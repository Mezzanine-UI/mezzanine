import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { inputSelectButtonClasses as classes } from '@mezzanine-ui/core/input';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { type Placement } from '@floating-ui/dom';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';

/**
 * 選擇按鈕元件，顯示已選值、下拉箭頭，並內建 Dropdown 選單。
 *
 * 點擊按鈕開啟下拉選單，選取後發出 `selected` 事件並自動關閉。
 *
 * @example
 * ```html
 * import { MznInputSelectButton } from '@mezzanine-ui/ng/input';
 *
 * <div mznInputSelectButton
 *   [options]="options"
 *   [value]="selectedValue"
 *   (selected)="onSelect($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznInputSelectButton]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznDropdown],
  host: {
    style: 'display: contents',
    '[attr.disabled]': 'null',
    '[attr.dropdownMaxHeight]': 'null',
    '[attr.dropdownPlacement]': 'null',
    '[attr.dropdownWidth]': 'null',
    '[attr.options]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
  template: `
    <button
      #buttonEl
      type="button"
      [class]="hostClasses()"
      [disabled]="disabled()"
      [title]="value()"
      (click)="onToggle()"
    >
      <span [class]="textClass">{{ value() }}</span>
      <i
        mznIcon
        [class]="iconClass"
        [icon]="chevronDownIcon"
        [size]="16"
        [style.transform]="open() ? 'rotate(180deg)' : 'rotate(0deg)'"
        [style.transition]="'transform 150ms ease'"
      ></i>
    </button>
    @if (options()?.length) {
      <div
        mznDropdown
        [anchor]="buttonElRef()"
        [open]="open()"
        [options]="options()!"
        [value]="value()"
        [customWidth]="dropdownWidth()"
        [maxHeight]="dropdownMaxHeight()"
        [placement]="dropdownPlacement()"
        [zIndex]="1000"
        (selected)="onOptionSelect($event)"
        (closed)="open.set(false)"
      ></div>
    }
  `,
})
export class MznInputSelectButton {
  protected readonly chevronDownIcon = ChevronDownIcon;
  protected readonly iconClass = classes.icon;
  protected readonly textClass = classes.text;

  protected readonly buttonElRef =
    viewChild.required<ElementRef<HTMLButtonElement>>('buttonEl');

  /** 下拉選單開啟狀態。 */
  protected readonly open = signal(false);

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 下拉選單的最大高度（px 或 CSS 字串）。
   * @default 114
   */
  readonly dropdownMaxHeight = input<number | string>(114);

  /**
   * 下拉選單的顯示位置。
   * @default 'bottom-start'
   */
  readonly dropdownPlacement = input<Placement>('bottom-start');

  /**
   * 下拉選單的固定寬度（px 或 CSS 字串）。
   * @default 120
   */
  readonly dropdownWidth = input<number | string>(120);

  /**
   * 下拉選單選項列表。
   */
  readonly options = input<ReadonlyArray<DropdownOption>>();

  /**
   * 按鈕尺寸。
   * @default 'main'
   */
  readonly size = input<'main' | 'sub'>('main');

  /**
   * 顯示的已選值文字。
   */
  readonly value = input<string>();

  /** 點擊事件（向後相容，不帶 dropdown 時的簡單 click）。 */
  readonly clicked = output<void>();

  /** 選項選取事件。 */
  readonly selected = output<DropdownOption>();

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      this.disabled() && classes.disabled,
      this.size() === 'main' ? classes.main : classes.sub,
    ),
  );

  protected onToggle(): void {
    if (!this.disabled()) {
      if (this.options()?.length) {
        this.open.update((v) => !v);
      }

      this.clicked.emit();
    }
  }

  protected onOptionSelect(option: DropdownOption): void {
    this.selected.emit(option);
    this.open.set(false);
  }
}
