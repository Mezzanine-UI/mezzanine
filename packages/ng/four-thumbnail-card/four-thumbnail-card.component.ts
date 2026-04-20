import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  HostBinding,
  QueryList,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
import { MznThumbnailCardInfo } from '@mezzanine-ui/ng/thumbnail-card-info';

const MAX_THUMBNAILS = 4;
const EMPTY_SLOT_CLASS = `${classes.fourThumbnailThumbnail} ${classes.fourThumbnailThumbnailEmpty}`;

export type FourThumbnailCardType = 'default' | 'action' | 'overflow';

/**
 * FourThumbnailCard displays a 2x2 grid of image thumbnails with optional tag, personal action,
 * and info section. Supports three action types: default, action, and overflow.
 *
 * Children must be MznThumbnail components (use `hostComponent` input for button/anchor variants).
 * If less than 4 are provided, empty slots will be rendered.
 *
 * @example
 * ```html
 * import { MznFourThumbnailCard } from '@mezzanine-ui/ng/four-thumbnail-card';
 * import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';
 *
 * <div mznFourThumbnailCard title="Photo Collection" subtitle="4 photos">
 *   <div mznThumbnail title="Photo 1"><img alt="..." src="..." /></div>
 *   <div mznThumbnail title="Photo 2"><img alt="..." src="..." /></div>
 *   <div mznThumbnail title="Photo 3"><img alt="..." src="..." /></div>
 *   <div mznThumbnail title="Photo 4"><img alt="..." src="..." /></div>
 * </div>
 * ```
 *
 * @see MznThumbnail
 * @see MznSingleThumbnailCard
 */
@Component({
  selector: '[mznFourThumbnailCard]',
  host: {
    '[class]': 'hostClass',
    '[attr.actionName]': 'null',
    '[attr.filetype]': 'null',
    '[attr.options]': 'null',
    '[attr.personalActionIcon]': 'null',
    '[attr.personalActionActiveIcon]': 'null',
    '[attr.personalActionActive]': 'null',
    '[attr.subtitle]': 'null',
    '[attr.tag]': 'null',
    '[attr.title]': 'null',
    '[attr.type]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznThumbnailCardInfo],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="thumbnailGridClass">
      @if (tag()) {
        <div [class]="tagClass">{{ tag() }}</div>
      }
      @if (personalActionIcon()) {
        <button
          type="button"
          [class]="personalActionClass"
          [attr.aria-label]="'Personal Action'"
          (click)="onPersonalActionClick($event)"
        >
          <i mznIcon [icon]="currentPersonalActionIcon()" [size]="16"></i>
        </button>
      }
      <ng-content select="[mznThumbnail]" />
      @for (empty of emptySlots(); track $index) {
        <div [class]="emptySlotClass"></div>
      }
    </div>
    <div
      mznThumbnailCardInfo
      [actionName]="actionName()"
      [filetype]="filetype()"
      [options]="options() ?? []"
      [subtitle]="subtitle()"
      [title]="title()"
      [type]="type()"
      (actionClick)="onActionClick($event)"
      (optionSelect)="onOptionSelect($event)"
    ></div>
  `,
})
export class MznFourThumbnailCard implements AfterContentInit {
  private readonly destroyRef = inject(DestroyRef);

  @ContentChildren(MznThumbnail, { descendants: true })
  thumbnailList!: QueryList<MznThumbnail>;

  // CSS class constants
  protected readonly thumbnailGridClass = classes.fourThumbnail;
  protected readonly tagClass = classes.thumbnailTag;
  protected readonly personalActionClass = classes.thumbnailPersonalAction;
  protected readonly emptySlotClass = EMPTY_SLOT_CLASS;

  /** File extension string for the filetype badge (e.g., 'pdf', 'jpg', 'zip'). */
  readonly filetype = input<string>();

  /** Icon for the personal action button. */
  readonly personalActionIcon = input<IconDefinition>();

  /** Icon shown when personal action is active. */
  readonly personalActionActiveIcon = input<IconDefinition>();

  /** Whether the personal action is in active state. @default false */
  readonly personalActionActive = input(false);

  /** Subtitle text shown in the info section. */
  readonly subtitle = input<string>();

  /** Optional tag label shown on top of the thumbnail grid. */
  readonly tag = input<string>();

  /** Title text shown in the info section. */
  readonly title = input<string>();

  /**
   * Action mode of the info section — mirrors React `type`.
   * - `'default'` — no action
   * - `'action'` — renders a text-link action button labelled by `actionName`
   * - `'overflow'` — renders a dot-horizontal overflow menu driven by `options`
   * @default 'default'
   */
  readonly type = input<FourThumbnailCardType>('default');

  /** Label for the action button when `type="action"`. */
  readonly actionName = input<string>();

  /** Dropdown options when `type="overflow"`. */
  readonly options = input<ReadonlyArray<DropdownOption>>();

  /** Click handler for the personal action button. */
  readonly personalActionClick = output<{
    event: MouseEvent;
    active: boolean;
  }>();

  /** Emitted when the action button is clicked (type="action"). */
  readonly actionClick = output<MouseEvent>();

  /** Emitted when a dropdown option is selected (type="overflow"). */
  readonly optionSelect = output<DropdownOption>();

  private readonly _emptySlotCount = signal(0);
  private readonly subscriptions: Array<{ unsubscribe: () => void }> = [];

  ngAfterContentInit(): void {
    this.updateEmptySlots();
    this.subscriptions.push(
      this.thumbnailList.changes.subscribe(() => this.updateEmptySlots()),
    );
    this.destroyRef.onDestroy(() => {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
    });
  }

  private updateEmptySlots(): void {
    const thumbnails = this.thumbnailList?.length ?? 0;
    this._emptySlotCount.set(Math.max(0, MAX_THUMBNAILS - thumbnails));
  }

  protected emptySlots(): readonly null[] {
    return Array.from({ length: this._emptySlotCount() });
  }

  protected currentPersonalActionIcon(): IconDefinition {
    if (this.personalActionActive()) {
      return this.personalActionActiveIcon() ?? this.personalActionIcon()!;
    }
    return this.personalActionIcon()!;
  }

  @HostBinding('class')
  protected readonly hostClass = classes.thumbnail;

  protected onPersonalActionClick(event: MouseEvent): void {
    event.stopPropagation();
    this.personalActionClick.emit({
      event,
      active: this.personalActionActive(),
    });
  }

  protected onActionClick(event: MouseEvent): void {
    this.actionClick.emit(event);
  }

  protected onOptionSelect(option: DropdownOption): void {
    this.optionSelect.emit(option);
  }
}
