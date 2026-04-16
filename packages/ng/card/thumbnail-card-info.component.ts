import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
  output,
  signal,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { getFileTypeCategory } from '@mezzanine-ui/core/card/fileTypeMapping';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * Button variant for the action button in type='action' mode.
 * - `'base-text-link'` — 預設文字連結樣式
 * - `'destructive-text-link'` — 危險操作文字連結樣式
 */
export type ThumbnailCardInfoActionVariant =
  | 'base-text-link'
  | 'destructive-text-link';

/**
 * The interaction mode of the info section.
 * - `'default'` — no action rendered
 * - `'action'` — renders a text-link action button
 * - `'overflow'` — renders a dot-horizontal overflow menu button with a dropdown
 */
export type ThumbnailCardInfoType = 'default' | 'action' | 'overflow';

/**
 * MznThumbnailCardInfo renders the info section (filetype badge, title, subtitle, and optional
 * action) shared by SingleThumbnailCard and FourThumbnailCard.
 *
 * When `type="action"`, an action button labelled by `actionName` is rendered.
 * When `type="overflow"`, a dot-horizontal button opens a dropdown built from `options`.
 * When `type="default"` (the default), no action is rendered.
 *
 * @example
 * ```html
 * import { MznThumbnailCardInfo } from '@mezzanine-ui/ng/card';
 *
 * <!-- 預設（無操作） -->
 * <div mznThumbnailCardInfo title="Report.pdf" subtitle="2.4 MB" filetype="pdf" ></div>
 *
 * <!-- Action 模式 -->
 * <div mznThumbnailCardInfo
 *   title="Report.pdf"
 *   subtitle="2.4 MB"
 *   filetype="pdf"
 *   type="action"
 *   actionName="下載"
 *   (actionClick)="onDownload($event)"
 * ></div>
 *
 * <!-- Overflow 模式 -->
 * <div mznThumbnailCardInfo
 *   title="Report.pdf"
 *   subtitle="2.4 MB"
 *   filetype="pdf"
 *   type="overflow"
 *   [options]="menuOptions"
 *   (optionSelect)="onOptionSelect($event)"
 * ></div>
 * ```
 *
 * @see MznFourThumbnailCard
 */
@Component({
  selector: '[mznThumbnailCardInfo]',
  host: {
    '[attr.actionName]': 'null',
    '[attr.actionVariant]': 'null',
    '[attr.disabled]': 'null',
    '[attr.filetype]': 'null',
    '[attr.options]': 'null',
    '[attr.subtitle]': 'null',
    '[attr.title]': 'null',
    '[attr.type]': 'null',
  },
  standalone: true,
  imports: [MznButton, MznDropdown, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
    @if (type() === 'action') {
      <div [class]="infoActionClass">
        <button
          mznButton
          [disabled]="disabled()"
          [variant]="actionVariant()"
          size="sub"
          type="button"
          (click)="onActionClick($event)"
        >
          {{ actionName() }}
        </button>
      </div>
    }
    @if (type() === 'overflow') {
      <div [class]="infoActionClass">
        <div class="mzn-dropdown mzn-dropdown--outside">
          <button
            #overflowTrigger
            mznButton
            [disabled]="disabled()"
            iconType="icon-only"
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
            [options]="resolvedOptions()"
            mode="single"
            (selected)="onOptionSelect($event)"
            (closed)="closeOverflow()"
          ></div>
        </div>
      </div>
    }
  `,
})
export class MznThumbnailCardInfo {
  // CSS class constants
  protected readonly infoMainClass = classes.thumbnailInfoMain;
  protected readonly infoContentClass = classes.thumbnailInfoContent;
  protected readonly infoTitleClass = classes.thumbnailInfoTitle;
  protected readonly infoSubtitleClass = classes.thumbnailInfoSubtitle;
  protected readonly infoActionClass = classes.thumbnailInfoAction;

  protected readonly dotHorizontalIcon = DotHorizontalIcon;

  private readonly _overflowOpen = signal(false);

  /**
   * Label text for the action button.
   * Only relevant when `type="action"`.
   */
  readonly actionName = input<string>();

  /**
   * Button variant for the action button.
   * Only relevant when `type="action"`.
   * @default 'base-text-link'
   */
  readonly actionVariant =
    input<ThumbnailCardInfoActionVariant>('base-text-link');

  /**
   * Whether the action button or overflow button is disabled.
   * @default false
   */
  readonly disabled = input(false);

  /**
   * File extension string for the filetype badge (e.g., `'pdf'`, `'jpg'`, `'zip'`).
   * When provided, the badge is rendered with a category-specific colour modifier.
   */
  readonly filetype = input<string>();

  /**
   * Dropdown options for the overflow menu.
   * Only relevant when `type="overflow"`.
   */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /** Card subtitle text. */
  readonly subtitle = input<string>();

  /** Card title text. */
  readonly title = input<string>();

  /**
   * Interaction mode of the info section.
   * - `'default'` — no action rendered
   * - `'action'` — renders a text-link action button labelled by `actionName`
   * - `'overflow'` — renders a dot-horizontal overflow menu
   * @default 'default'
   */
  readonly type = input<ThumbnailCardInfoType>('default');

  /** Emitted when the action button is clicked (type="action"). */
  readonly actionClick = output<MouseEvent>();

  /** Emitted when a dropdown option is selected (type="overflow"). */
  readonly optionSelect = output<DropdownOption>();

  @HostBinding('class')
  protected get hostClass(): string {
    return classes.thumbnailInfo;
  }

  protected filetypeClass(): string {
    const ext = this.filetype();
    if (!ext) return classes.thumbnailInfoFiletype;
    const category = getFileTypeCategory(ext);
    return category
      ? clsx(
          classes.thumbnailInfoFiletype,
          `${classes.thumbnailInfoFiletype}--${category}`,
        )
      : classes.thumbnailInfoFiletype;
  }

  protected readonly resolvedOptions = computed(
    (): ReadonlyArray<DropdownOption> => this.options() ?? [],
  );

  protected overflowOpen(): boolean {
    return this._overflowOpen();
  }

  protected toggleOverflow(): void {
    this._overflowOpen.update((v) => !v);
  }

  protected closeOverflow(): void {
    this._overflowOpen.set(false);
  }

  protected onActionClick(event: MouseEvent): void {
    event.stopPropagation();
    this.actionClick.emit(event);
  }

  protected onOptionSelect(option: DropdownOption): void {
    this.optionSelect.emit(option);
    this.closeOverflow();
  }
}
