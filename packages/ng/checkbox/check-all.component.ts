import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
} from '@angular/core';
import { CheckboxGroupOption } from '@mezzanine-ui/core/checkbox';
import { MznCheckbox } from './checkbox.component';
import { MznCheckboxGroup } from './checkbox-group.component';

/**
 * 全選核取方塊元件，搭配 `MznCheckboxGroup` 使用。
 *
 * 根據 `options` 與群組的已選值自動計算 checked / indeterminate 狀態，
 * 點擊時切換所有未禁用選項的勾選狀態。
 *
 * @example
 * ```html
 * import { MznCheckAll, MznCheckboxGroup, MznCheckbox } from '@mezzanine-ui/ng/checkbox';
 *
 * <div mznCheckAll [options]="options" label="全選">
 *   <div mznCheckboxGroup [(ngModel)]="selected" name="items">
 *     @for (opt of options; track opt.value) {
 *       <div mznCheckbox [value]="opt.value">{{ opt.label }}</div>
 *     }
 *   </div>
 * </div>
 * ```
 *
 * @see MznCheckboxGroup
 */
@Component({
  selector: '[mznCheckAll]',
  host: {
    '[attr.options]': 'null',
    '[attr.label]': 'null',
    '[attr.disabled]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznCheckbox],
  template: `
    <div
      mznCheckbox
      [checked]="checked()"
      [disabled]="disabled()"
      [indeterminate]="indeterminate()"
      (change)="handleCheckAllChange()"
    >
      {{ label() }}
    </div>
    <ng-content />
  `,
})
export class MznCheckAll {
  private readonly group = contentChild(MznCheckboxGroup);

  /**
   * 全部選項列表，用於計算全選/部分選取/未選狀態。
   */
  readonly options = input.required<readonly CheckboxGroupOption[]>();

  /**
   * 全選核取方塊的標籤文字。
   * @default 'Check All'
   */
  readonly label = input('Check All');

  /**
   * 是否禁用全選核取方塊。
   * @default false
   */
  readonly disabled = input(false);

  protected readonly enabledValues = computed((): readonly string[] =>
    this.options()
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.value),
  );

  protected readonly checked = computed((): boolean => {
    const groupValue = this.group()?.value() ?? [];
    const enabled = this.enabledValues();

    if (enabled.length === 0) return false;

    return enabled.every((v) => groupValue.includes(v));
  });

  protected readonly indeterminate = computed((): boolean => {
    const groupValue = this.group()?.value() ?? [];
    const enabled = this.enabledValues();
    const selectedEnabled = enabled.filter((v) => groupValue.includes(v));

    return (
      selectedEnabled.length > 0 && selectedEnabled.length < enabled.length
    );
  });

  protected handleCheckAllChange(): void {
    const group = this.group();

    if (!group) return;

    const groupValue = group.value();
    const enabled = this.enabledValues();
    const isCurrentlyChecked = this.checked();

    if (isCurrentlyChecked) {
      // Uncheck all enabled options, keep disabled ones that were checked
      enabled.forEach((v) => {
        if (groupValue.includes(v)) {
          group.toggle(v);
        }
      });
    } else {
      // Check all enabled options
      enabled.forEach((v) => {
        if (!groupValue.includes(v)) {
          group.toggle(v);
        }
      });
    }
  }
}
