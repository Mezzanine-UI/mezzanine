import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  Signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  checkboxGroupClasses as classes,
  CheckboxGroupLayout,
} from '@mezzanine-ui/core/checkbox';
import { CheckboxMode, CheckboxSize } from '@mezzanine-ui/core/checkbox';
import clsx from 'clsx';
import { MZN_CHECKBOX_GROUP } from './checkbox-group-context';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 核取方塊群組元件。
 *
 * 透過 DI token `MZN_CHECKBOX_GROUP` 提供共享狀態給子 `MznCheckbox`。
 * 支援 `ngModel` / `formControl` 綁定多選值陣列。
 *
 * @example
 * ```html
 * import { MznCheckboxGroup, MznCheckbox } from '@mezzanine-ui/ng/checkbox';
 *
 * <div mznCheckboxGroup [(ngModel)]="selectedValues" name="fruits">
 *   <div mznCheckbox value="apple">蘋果</div>
 *   <div mznCheckbox value="banana">香蕉</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznCheckboxGroup]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideValueAccessor(MznCheckboxGroup),
    {
      provide: MZN_CHECKBOX_GROUP,
      useExisting: forwardRef(() => MznCheckboxGroup),
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.layout]': 'null',
  },
  template: `<ng-content />`,
})
export class MznCheckboxGroup implements ControlValueAccessor {
  /** 是否禁用所有子 Checkbox。 */
  readonly disabled: Signal<boolean> = input(false);

  /** 佈局方向。 */
  readonly layout = input<CheckboxGroupLayout>('horizontal');

  /** 顯示模式。 */
  readonly mode: Signal<CheckboxMode> = input<CheckboxMode>('default');

  /** 群組名稱。 */
  readonly name: Signal<string> = input('');

  /** 尺寸。 */
  readonly size: Signal<CheckboxSize> = input<CheckboxSize>('main');

  /** 值變更事件。 */
  readonly valueChange = output<ReadonlyArray<string>>();

  private readonly internalValue = signal<ReadonlyArray<string>>([]);

  /** 目前選取值（供子 Checkbox 讀取）。 */
  readonly value: Signal<ReadonlyArray<string>> = computed(() =>
    this.internalValue(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.layout(this.layout()),
      classes.mode(this.mode()),
    ),
  );

  // CVA
  private onChange: (value: ReadonlyArray<string>) => void = () => {};
  private onTouched: () => void = () => {};

  /** 子 Checkbox 呼叫此方法切換勾選狀態。 */
  toggle(val: string): void {
    const current = this.internalValue();
    const next = current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

    this.internalValue.set(next);
    this.onChange(next);
    this.onTouched();
    this.valueChange.emit(next);
  }

  writeValue(value: ReadonlyArray<string> | null): void {
    this.internalValue.set(value ?? []);
  }

  registerOnChange(fn: (value: ReadonlyArray<string>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
