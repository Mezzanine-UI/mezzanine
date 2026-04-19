import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  dropdownClasses as classes,
  DropdownCheckPosition,
  DropdownItemLevel,
  DropdownItemValidate,
  DropdownMode,
} from '@mezzanine-ui/core/dropdown';
import { CheckedIcon, IconDefinition } from '@mezzanine-ui/icons';
import { MznCheckbox } from '@mezzanine-ui/ng/checkbox';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznSeparator } from '@mezzanine-ui/ng/separator';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { HighlightSegment, highlightText } from '@mezzanine-ui/ng/utils';
import clsx from 'clsx';

/**
 * Dropdown 選項卡片元件，渲染單一選項列表項目。
 *
 * 支援單選/多選模式的勾選圖示、前置/後置圖示、副標題、
 * 層級縮排與危險驗證樣式。多選模式下 `checkSite='prefix'` 會顯示 Checkbox。
 *
 * @example
 * ```html
 * import { MznDropdownItemCard } from '@mezzanine-ui/ng/dropdown';
 *
 * <div mznDropdownItemCard
 *   label="Option A"
 *   mode="single"
 *   [checked]="isSelected"
 *   (clicked)="onSelect()"
 * ></div>
 * ```
 *
 * @see MznDropdown
 */
@Component({
  selector: '[mznDropdownItemCard]',
  host: {
    '[attr.active]': 'null',
    '[attr.appendContent]': 'null',
    '[attr.appendIcon]': 'null',
    '[attr.checked]': 'null',
    '[attr.checkSite]': 'null',
    '[attr.disabled]': 'null',
    '[attr.followText]': 'null',
    '[attr.id]': 'null',
    '[attr.indeterminate]': 'null',
    '[attr.label]': 'null',
    '[attr.level]': 'null',
    '[attr.mode]': 'null',
    '[attr.prependIcon]': 'null',
    '[attr.showUnderline]': 'null',
    '[attr.subTitle]': 'null',
    '[attr.validate]': 'null',
  },
  standalone: true,
  imports: [MznCheckbox, MznIcon, MznSeparator, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <li
      role="option"
      [attr.id]="id() || null"
      [attr.aria-labelledby]="labelId()"
      [class]="hostClasses()"
      [attr.aria-selected]="checked()"
      [attr.aria-disabled]="disabled() || null"
      [tabIndex]="-1"
      (click)="onClick()"
      (mouseenter)="onMouseEnter()"
    >
      <div [class]="containerClass">
        @if (showPrependContent()) {
          <div [class]="prependClass">
            @if (prependIcon()) {
              <i mznIcon [icon]="prependIcon()!"></i>
            }
            @if (checkSite() === 'prefix' && mode() === 'multiple') {
              <div
                mznCheckbox
                [checked]="checked()"
                [disabled]="disabled()"
                [indeterminate]="indeterminate()"
                (click)="$event.stopPropagation()"
                (mousedown)="$event.stopPropagation()"
                (change)="onCheckedChange()"
              ></div>
            }
            @if (checkSite() === 'prefix' && mode() === 'single' && checked()) {
              <i
                mznIcon
                [icon]="checkedIcon"
                [color]="checkIconColor()"
                [size]="16"
              ></i>
            }
          </div>
        }
        <div [class]="bodyClass">
          @if (label()) {
            <p
              mznTypography
              variant="body"
              [class]="titleClass"
              [attr.id]="labelId()"
            >
              @for (part of labelParts(); track $index) {
                <span [class]="part.highlight ? highlightedClass() : ''">{{
                  part.text
                }}</span>
              }
            </p>
          }
          @if (subTitle()) {
            <p mznTypography variant="caption" [class]="descriptionClass">
              @for (part of subTitleParts(); track $index) {
                <span [class]="part.highlight ? highlightedClass() : ''">{{
                  part.text
                }}</span>
              }
            </p>
          }
        </div>
        @if (showAppendContent()) {
          <div [class]="appendClass">
            @if (appendContent()) {
              <span mznTypography color="text-neutral-light">{{
                appendContent()
              }}</span>
            }
            @if (appendIcon()) {
              <i mznIcon [icon]="appendIcon()!" [size]="16"></i>
            }
            @if (checkSite() === 'suffix' && checked()) {
              <i
                mznIcon
                [icon]="checkedIcon"
                [color]="checkIconColor()"
                [size]="16"
              ></i>
            }
          </div>
        }
      </div>
    </li>
    @if (showUnderline()) {
      <li role="presentation" aria-hidden="true">
        <hr mznSeparator orientation="horizontal" [class]="underlineClass" />
      </li>
    }
  `,
})
export class MznDropdownItemCard {
  /** 是否為鍵盤導航高亮狀態。 @default false */
  readonly active = input(false);

  /** 後置文字內容。 */
  readonly appendContent = input<string>();

  /** 後置圖示。 */
  readonly appendIcon = input<IconDefinition>();

  /** 是否被選取。 @default false */
  readonly checked = input(false);

  /** 勾選圖示顯示位置。 @default 'suffix' */
  readonly checkSite = input<DropdownCheckPosition>('suffix');

  /** 是否禁用。 @default false */
  readonly disabled = input(false);

  /**
   * 高亮關鍵字;若提供,會將 `label` / `subTitle` 中(大小寫不敏感)符合的
   * 子字串以 `.mzn-dropdown-item-card-highlighted-text` 包裹。
   * 對應 React 的 `followText` prop(`DropdownItemCard.tsx:68`)。
   */
  readonly followText = input<string>();

  /** DOM id，用於 aria-activedescendant。 */
  readonly id = input<string>();

  /** 是否為不確定狀態（部分子項目被選取）。 @default false */
  readonly indeterminate = input(false);

  /** 選項文字標籤。 */
  readonly label = input<string>();

  /** 層級深度（影響縮排）。 @default 0 */
  readonly level = input<DropdownItemLevel>(0);

  /** 選取模式。 */
  readonly mode = input.required<DropdownMode>();

  /** 前置圖示。 */
  readonly prependIcon = input<IconDefinition>();

  /** 是否在選項下方顯示分隔線。 @default false */
  readonly showUnderline = input(false);

  /** 副標題文字。 */
  readonly subTitle = input<string>();

  /** 驗證樣式。 @default 'default' */
  readonly validate = input<DropdownItemValidate>('default');

  /**
   * 額外的 host class,對齊 React `DropdownItemCard` 的 `className` prop。
   * 父元件(如 `MznDropdownItem`)可透過此 input 追加情境特定 class,例如
   * tree mode 在 level-1 leaf 節點加上 `.mzn-dropdown-item-card--level-1-leaf`
   * 讓文字靠左對齊到有 caret 的同層節點位置。
   */
  readonly extraClass = input<string>('');

  /** 點擊事件。 */
  readonly clicked = output<void>();

  /** 勾選狀態變更事件（多選 prefix 模式）。 */
  readonly checkedChange = output<void>();

  /**
   * 滑鼠進入(hover)事件。由 parent(MznDropdownItem / MznDropdown)
   * 用來回報 `activeIndex`,對齊 React `DropdownItemCard` 的 `onMouseEnter`
   * 行為。
   */
  readonly hovered = output<void>();

  protected readonly checkedIcon = CheckedIcon;
  protected readonly containerClass = classes.cardContainer;
  protected readonly bodyClass = classes.cardBody;
  protected readonly titleClass = classes.cardTitle;
  protected readonly descriptionClass = classes.cardDescription;
  protected readonly prependClass = classes.cardPrependContent;
  protected readonly appendClass = classes.cardAppendContent;
  protected readonly underlineClass = classes.cardUnderline;

  /**
   * 高亮 span 套用的 class。`validate === 'danger'` 時清空,對齊 React
   * `DropdownItemCard.tsx:242`(danger 狀態下不顯示高亮底色)。
   */
  protected readonly highlightedClass = computed((): string =>
    this.validate() === 'danger' ? '' : classes.cardHighlightedText,
  );

  /**
   * 將 `label` 按 `followText` 切成 `{ text, highlight }` 片段陣列,
   * 無 followText 時整段回傳 `highlight: false`。
   * 對應 React `DropdownItemCard.tsx:195-204` 的 `labelParts`。
   */
  protected readonly labelParts = computed(
    (): ReadonlyArray<HighlightSegment> => {
      const label = this.label();

      if (!label) return [];

      const keyword = this.followText();

      return keyword
        ? highlightText(label, keyword)
        : [{ text: label, highlight: false }];
    },
  );

  /**
   * 將 `subTitle` 按 `followText` 切片。無 subTitle 時回傳空陣列。
   * 對應 React `DropdownItemCard.tsx:218-229`。
   */
  protected readonly subTitleParts = computed(
    (): ReadonlyArray<HighlightSegment> => {
      const subTitle = this.subTitle();

      if (!subTitle) return [];

      const keyword = this.followText();

      return keyword
        ? highlightText(subTitle, keyword)
        : [{ text: subTitle, highlight: false }];
    },
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.card,
      classes.cardLevel(this.level()),
      {
        [classes.cardActive]: this.active() || this.checked(),
        [classes.cardKeyboardActive]: this.active(),
        [classes.cardDisabled]: this.disabled(),
        [classes.cardDanger]: this.validate() === 'danger',
      },
      this.extraClass(),
    ),
  );

  protected readonly showPrependContent = computed((): boolean => {
    const prependIcon = this.prependIcon();
    const checkSite = this.checkSite();
    const mode = this.mode();
    const checked = this.checked();

    return (
      !!prependIcon ||
      (checkSite === 'prefix' && mode === 'multiple') ||
      (checkSite === 'prefix' && mode === 'single' && checked)
    );
  });

  protected readonly showAppendContent = computed((): boolean => {
    const appendContent = this.appendContent();
    const appendIcon = this.appendIcon();
    const checkSite = this.checkSite();
    const checked = this.checked();

    return (
      !!appendContent || !!appendIcon || (checkSite === 'suffix' && checked)
    );
  });

  // Mirror React's appendIconColor: disabled → neutral-light,
  // validate 'danger' → error, otherwise brand.
  protected readonly checkIconColor = computed(
    (): 'neutral-light' | 'error' | 'brand' => {
      if (this.disabled()) return 'neutral-light';
      if (this.validate() === 'danger') return 'error';

      return 'brand';
    },
  );

  /** DOM id for label, used for aria-labelledby. Mirrors React's `${id}-label`. */
  protected readonly labelId = computed((): string | null => {
    const id = this.id();

    return id ? `${id}-label` : null;
  });

  protected onClick(): void {
    if (this.disabled()) return;

    this.clicked.emit();
  }

  protected onCheckedChange(): void {
    if (this.disabled()) return;

    this.checkedChange.emit();
  }

  /**
   * Disabled 的選項仍允許 hover 回報(對齊 React 行為:disabled card 依然
   * 會呼叫 onMouseEnter)。Parent 可視需求自行忽略。
   */
  protected onMouseEnter(): void {
    this.hovered.emit();
  }
}
