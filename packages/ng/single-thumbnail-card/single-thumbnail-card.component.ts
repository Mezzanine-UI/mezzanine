import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  output,
  signal,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznIcon } from '@mezzanine-ui/ng/icon';

export type SingleThumbnailCardType = 'default' | 'action' | 'overflow';

/** Button variant for the action button in type='action' mode. */
export type SingleThumbnailCardActionVariant =
  | 'base-text-link'
  | 'destructive-text-link';

export interface SingleThumbnailCardActionOptions {
  type: 'action';
  /** Label text for the action button. */
  actionName: string;
  /**
   * Variant for the action button.
   * @default 'base-text-link'
   */
  actionVariant?: SingleThumbnailCardActionVariant;
  /** Click handler for the action button. */
  actionClick?: (event: MouseEvent) => void;
}

export interface SingleThumbnailCardOverflowOptions {
  type: 'overflow';
  /** Dropdown options. */
  options: ReadonlyArray<{ id: string; name: string }>;
  /** Callback when an option is selected. */
  optionSelect?: (option: { id: string; name: string }) => void;
}

export interface SingleThumbnailCardDefaultOptions {
  type?: 'default';
}

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
 * <mzn-single-thumbnail-card title="Document Title" subtitle="2024/01/15" tag="New">
 *   <img alt="thumbnail" src="https://picsum.photos/320/180" />
 * </mzn-single-thumbnail-card>
 * ```
 *
 * @see MznFourThumbnailCard
 */
@Component({
  selector: 'mzn-single-thumbnail-card',
  standalone: true,
  imports: [MznButton, MznDropdown, MznIcon],
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
    <div [class]="infoClass">
      <div [class]="infoMainClass">
        @if (filetype()) {
          <div [class]="filetypeClass">{{ filetype()!.toUpperCase() }}</div>
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
export class MznSingleThumbnailCard {
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

  /** Action options for the info section (action or overflow type). */
  readonly actionOptions = input<
    | SingleThumbnailCardActionOptions
    | SingleThumbnailCardOverflowOptions
    | SingleThumbnailCardDefaultOptions
  >();

  /** Click handler for the personal action button. */
  readonly personalActionClick = output<{
    event: MouseEvent;
    active: boolean;
  }>();

  // CSS class constants
  protected readonly containerClass = classes.singleThumbnail;
  protected readonly tagClass = classes.thumbnailTag;
  protected readonly personalActionClass = classes.thumbnailPersonalAction;
  protected readonly overlayClass = classes.singleThumbnailOverlay;
  protected readonly infoClass = classes.thumbnailInfo;
  protected readonly infoMainClass = classes.thumbnailInfoMain;
  protected readonly filetypeClass = classes.thumbnailInfoFiletype;
  protected readonly infoContentClass = classes.thumbnailInfoContent;
  protected readonly infoTitleClass = classes.thumbnailInfoTitle;
  protected readonly infoSubtitleClass = classes.thumbnailInfoSubtitle;
  protected readonly infoActionClass = classes.thumbnailInfoAction;

  protected readonly dotHorizontalIcon = DotHorizontalIcon;

  private readonly _overflowOpen = signal(false);

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
    | SingleThumbnailCardActionOptions
    | undefined {
    const opts = this.actionOptions();
    return opts?.type === 'action' ? opts : undefined;
  }

  protected get actionOptionsForOverflow():
    | SingleThumbnailCardOverflowOptions
    | undefined {
    const opts = this.actionOptions();
    return opts?.type === 'overflow' ? opts : undefined;
  }

  protected closeOverflow(): void {
    this._overflowOpen.set(false);
  }
}
