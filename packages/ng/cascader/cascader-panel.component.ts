import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';
import { ChevronRightIcon, CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';

import { MznIcon } from '@mezzanine-ui/ng/icon';
import { CascaderOption } from './cascader-option';

/**
 * 串接式選單的單欄面板，用於顯示單一層級的選項清單。
 *
 * 每個選項可包含子選項（顯示右箭頭圖示）或為葉節點（選取後顯示勾選圖示）。
 * 此元件通常由 `MznCascader` 內部使用，不建議單獨使用。
 *
 * @example
 * ```html
 * import { MznCascaderPanel } from '@mezzanine-ui/ng/cascader';
 *
 * <mzn-cascader-panel
 *   [options]="options"
 *   [activeOptionId]="'option-1'"
 *   (optionSelect)="onSelect($event)"
 * />
 * ```
 *
 * @see MznCascader
 */
@Component({
  selector: 'mzn-cascader-panel',
  standalone: true,
  imports: [MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    @for (option of options(); track option.id) {
      <div [class]="getItemClasses(option)" (click)="onItemClick(option)">
        <span [class]="labelClass">{{ option.name }}</span>
        <span [class]="appendClass">
          @if (option.children?.length) {
            <i mznIcon [icon]="chevronRightIcon"></i>
          } @else if (isSelected(option)) {
            <i mznIcon [icon]="checkedIcon"></i>
          }
        </span>
      </div>
    }
  `,
})
export class MznCascaderPanel {
  /** 目前展開（active）的選項 ID。 */
  readonly activeOptionId = input<string>();

  /** 目前聚焦的選項 ID。 */
  readonly focusedOptionId = input<string>();

  /** 此面板顯示的選項清單。 */
  readonly options = input<CascaderOption[]>([]);

  /** 已選取的葉節點選項 ID。 */
  readonly selectedOptionId = input<string>();

  /** 當使用者點選選項時發出。 */
  readonly optionSelect = output<CascaderOption>();

  protected readonly chevronRightIcon = ChevronRightIcon;
  protected readonly checkedIcon = CheckedIcon;

  protected readonly labelClass = classes.itemLabel;
  protected readonly appendClass = classes.itemAppend;

  protected readonly hostClasses = computed((): string => clsx(classes.panel));

  protected getItemClasses(option: CascaderOption): string {
    return clsx(classes.item, {
      [classes.itemActive]: this.activeOptionId() === option.id,
      [classes.itemDisabled]: option.disabled,
      [classes.itemFocused]: this.focusedOptionId() === option.id,
      [classes.itemSelected]: this.isSelected(option),
    });
  }

  protected isSelected(option: CascaderOption): boolean {
    return this.selectedOptionId() === option.id;
  }

  protected onItemClick(option: CascaderOption): void {
    if (option.disabled) {
      return;
    }

    this.optionSelect.emit(option);
  }
}
