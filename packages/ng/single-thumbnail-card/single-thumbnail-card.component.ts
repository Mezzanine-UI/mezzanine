import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznThumbnailCardInfo } from '@mezzanine-ui/ng/thumbnail-card-info';

export type SingleThumbnailCardType = 'default' | 'action' | 'overflow';

/**
 * SingleThumbnailCard displays a single image thumbnail with optional tag, personal action,
 * and info section. Supports three action types: default, action, and overflow.
 *
 * The card width is determined by the image child element.
 *
 * @example
 * ```html
 * import { MznSingleThumbnailCard } from '@mezzanine-ui/ng/single-thumbnail-card';
 *
 * <div mznSingleThumbnailCard title="Document Title" subtitle="2024/01/15" tag="New">
 *   <img alt="thumbnail" src="https://picsum.photos/320/180" />
 * </div>
 * ```
 *
 * @see MznFourThumbnailCard
 */
@Component({
  selector: '[mznSingleThumbnailCard]',
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
    <div [class]="containerClass">
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
      <ng-content />
      <div [class]="overlayClass"></div>
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
export class MznSingleThumbnailCard {
  // CSS class constants
  protected readonly containerClass = classes.singleThumbnail;
  protected readonly tagClass = classes.thumbnailTag;
  protected readonly personalActionClass = classes.thumbnailPersonalAction;
  protected readonly overlayClass = classes.singleThumbnailOverlay;

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

  /** Optional tag label shown on top of the thumbnail. */
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
  readonly type = input<SingleThumbnailCardType>('default');

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

  @HostBinding('class')
  protected readonly hostClass = classes.thumbnail;

  protected currentPersonalActionIcon(): IconDefinition {
    if (this.personalActionActive()) {
      return this.personalActionActiveIcon() ?? this.personalActionIcon()!;
    }
    return this.personalActionIcon()!;
  }

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
