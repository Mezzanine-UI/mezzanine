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
import { getFileTypeCategory } from '@mezzanine-ui/core/card/fileTypeMapping';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznThumbnail } from '@mezzanine-ui/ng/thumbnail';

const MAX_THUMBNAILS = 4;
const EMPTY_SLOT_CLASS = `${classes.fourThumbnailThumbnail} ${classes.fourThumbnailThumbnailEmpty}`;

export type FourThumbnailCardType = 'default' | 'action' | 'overflow';

/** Button variant for the action button in type='action' mode. */
export type FourThumbnailCardActionVariant =
  | 'base-text-link'
  | 'destructive-text-link';

export interface FourThumbnailCardActionOptions {
  type: 'action';
  /** Label text for the action button. */
  actionName: string;
  /**
   * Variant for the action button.
   * @default 'base-text-link'
   */
  actionVariant?: FourThumbnailCardActionVariant;
  /** Click handler for the action button. */
  actionClick?: (event: MouseEvent) => void;
}

export interface FourThumbnailCardOverflowOptions {
  type: 'overflow';
  /** Dropdown options. */
  options: ReadonlyArray<{ id: string; name: string }>;
  /** Callback when an option is selected. */
  optionSelect?: (option: { id: string; name: string }) => void;
}

export interface FourThumbnailCardDefaultOptions {
  type?: 'default';
}

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
    '[class]': 'thumbnailGridClass',
    '[attr.filetype]': 'null',
    '[attr.personalActionIcon]': 'null',
    '[attr.personalActionActiveIcon]': 'null',
    '[attr.personalActionActive]': 'null',
    '[attr.subtitle]': 'null',
    '[attr.tag]': 'null',
    '[attr.title]': 'null',
    '[attr.actionOptions]': 'null',
  },
  standalone: true,
  imports: [MznButton, MznDropdown, MznIcon],
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
      <ng-content select="mzn-thumbnail" />
      @for (empty of emptySlots(); track $index) {
        <div [class]="emptySlotClass"></div>
      }
    </div>
    <div [class]="infoClass">
      <div [class]="infoMainClass">
        @if (filetype()) {
          <div [class]="filetypeClass()">{{ filetype()!.toUpperCase() }}</div>
        }
        <div [class]="infoContentClass">
          @if (title()) {
            <span [class]="infoTitleClass">{{ title() }}</span>
          }
          @if (subtitle()) {
            <span [class]="infoSubtitleClass">{{ subtitle() }}</span>
          }
        </div>
      </div>
      @if (actionType === 'action') {
        <div [class]="infoActionClass">
          <button
            mznButton
            [variant]="
              actionOptionsForAction?.actionVariant ?? 'base-text-link'
            "
            size="sub"
            type="button"
            (click)="onActionClick($event)"
          >
            {{ actionOptionsForAction?.actionName }}
          </button>
        </div>
      }
      @if (actionType === 'overflow') {
        <div [class]="infoActionClass">
          <button
            #overflowTrigger
            mznButton
            variant="base-text-link"
            size="sub"
            type="button"
            (click)="toggleOverflow()"
          >
            <i mznIcon [icon]="dotHorizontalIcon" [size]="16"></i>
          </button>
          <div
            mznDropdown
            [anchor]="overflowTrigger"
            [open]="overflowOpen()"
            [options]="actionOptionsForOverflow?.options"
            mode="single"
            (selected)="onOptionSelect($event)"
            (closed)="closeOverflow()"
          ></div>
        </div>
      }
    </div>
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
  protected readonly infoClass = classes.thumbnailInfo;
  protected readonly infoMainClass = classes.thumbnailInfoMain;
  protected readonly infoContentClass = classes.thumbnailInfoContent;
  protected readonly infoTitleClass = classes.thumbnailInfoTitle;
  protected readonly infoSubtitleClass = classes.thumbnailInfoSubtitle;
  protected readonly infoActionClass = classes.thumbnailInfoAction;

  protected readonly dotHorizontalIcon = DotHorizontalIcon;

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

  /** Action options for the info section (action or overflow type). */
  readonly actionOptions = input<
    | FourThumbnailCardActionOptions
    | FourThumbnailCardOverflowOptions
    | FourThumbnailCardDefaultOptions
  >();

  /** Click handler for the personal action button. */
  readonly personalActionClick = output<{
    event: MouseEvent;
    active: boolean;
  }>();

  private readonly _overflowOpen = signal(false);
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

  protected filetypeClass(): string {
    const ext = this.filetype();
    if (!ext) return classes.thumbnailInfoFiletype;
    const category = getFileTypeCategory(ext);
    if (category) {
      return `${classes.thumbnailInfoFiletype}--${category}`;
    }
    return classes.thumbnailInfoFiletype;
  }

  protected onPersonalActionClick(event: MouseEvent): void {
    event.stopPropagation();
    this.personalActionClick.emit({
      event,
      active: this.personalActionActive(),
    });
  }

  protected onActionClick(event: MouseEvent): void {
    event.stopPropagation();
    const opts = this.actionOptions();
    if (opts?.type === 'action') {
      opts.actionClick?.(event);
    }
  }

  protected toggleOverflow(): void {
    this._overflowOpen.update((v) => !v);
  }

  protected overflowOpen() {
    return this._overflowOpen();
  }

  protected onOptionSelect(option: { id: string; name: string }): void {
    const opts = this.actionOptions();
    if (opts?.type === 'overflow') {
      opts.optionSelect?.(option);
    }
  }

  protected get actionType(): 'action' | 'overflow' | undefined {
    const opts = this.actionOptions();
    if (opts?.type === 'action' || opts?.type === 'overflow') {
      return opts.type;
    }
    return undefined;
  }

  protected get actionOptionsForAction():
    | FourThumbnailCardActionOptions
    | undefined {
    const opts = this.actionOptions();
    return opts?.type === 'action' ? opts : undefined;
  }

  protected get actionOptionsForOverflow():
    | FourThumbnailCardOverflowOptions
    | undefined {
    const opts = this.actionOptions();
    return opts?.type === 'overflow' ? opts : undefined;
  }

  protected closeOverflow(): void {
    this._overflowOpen.set(false);
  }
}
