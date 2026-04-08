import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  radioClasses as classes,
  RadioSize,
  RadioType,
} from '@mezzanine-ui/core/radio';
import {
  inputCheckClasses,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznInput } from '@mezzanine-ui/ng/input';
import { IconDefinition } from '@mezzanine-ui/icons';
import { MZN_RADIO_GROUP, RadioGroupContextValue } from './radio-group-context';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * withInputConfig 設定，與 radio 並排顯示文字輸入框。
 * 僅在 type='radio' 模式下有效。
 */
export interface RadioWithInputConfig {
  /** 輸入框佔位文字。 @default 'Placeholder' */
  readonly placeholder?: string;
  /** 輸入框寬度（px）。 @default 120 */
  readonly width?: number;
  /** 是否禁用輸入框。 */
  readonly disabled?: boolean;
  /** 輸入框值變更回呼。 */
  readonly onValueChange?: (value: string) => void;
}

/**
 * 單選按鈕元件。
 *
 * 支援 `radio`（標準）與 `segment`（分段）兩種類型，
 * 可獨立使用或搭配 `MznRadioGroup` 使用。
 *
 * @example
 * ```html
 * import { MznRadio } from '@mezzanine-ui/ng/radio';
 *
 * <mzn-radio [(ngModel)]="selected" value="a">選項 A</mzn-radio>
 * ```
 */
@Component({
  selector: 'mzn-radio',
  standalone: true,
  imports: [MznIcon, MznInput],
  providers: [provideValueAccessor(MznRadio)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <label>
      <span [class]="controlWrapperClass()">
        <input
          type="radio"
          [style.display]="resolvedType() === 'segment' ? 'none' : null"
          [checked]="resolvedChecked()"
          [disabled]="resolvedDisabled()"
          [name]="resolvedName()"
          [value]="value()"
          (change)="onInputChange()"
          (focus)="onTouched()"
        />
        @if (resolvedType() === 'segment' && icon()) {
          <i mznIcon [icon]="icon()!"></i>
        }
      </span>
      <span [class]="labelClass">
        <ng-content />
        @if (hint() && resolvedType() === 'radio') {
          <span [class]="hintClass">{{ hint() }}</span>
        }
      </span>
    </label>
    @if (withInputConfig() && resolvedType() === 'radio') {
      <div [style.width.px]="withInputConfig()!.width ?? 120">
        <mzn-input
          [placeholder]="withInputConfig()!.placeholder ?? 'Placeholder'"
          [disabled]="withInputConfig()!.disabled ?? false"
          (valueChange)="withInputConfig()!.onValueChange?.($event)"
        />
      </div>
    }
  `,
})
export class MznRadio implements ControlValueAccessor {
  private readonly group = inject<RadioGroupContextValue>(MZN_RADIO_GROUP, {
    optional: true,
  });

  /** 是否勾選（獨立使用時）。 */
  readonly checked = input<boolean>();

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 是否為錯誤狀態。 */
  readonly error = input(false);

  /** 提示文字（僅 radio 模式）。 */
  readonly hint = input<string>();

  /** 圖示（僅 segment 模式）。 */
  readonly icon = input<IconDefinition>();

  /**
   * 並排文字輸入框設定（僅 radio 模式）。
   * 提供後會在 radio 旁顯示一個文字輸入框。
   */
  readonly withInputConfig = input<RadioWithInputConfig | undefined>(undefined);

  /** input name。 */
  readonly name = input<string>();

  /** 尺寸。 */
  readonly size = input<RadioSize>('main');

  /** 類型。 */
  readonly type = input<RadioType>('radio');

  /** Radio 值。 */
  readonly value = input.required<string>();

  private readonly internalValue = signal('');

  readonly resolvedChecked = computed((): boolean => {
    if (this.group) {
      return this.group.value() === this.value();
    }

    return this.checked() ?? this.internalValue() === this.value();
  });

  readonly resolvedDisabled = computed(
    (): boolean => this.group?.disabled() || this.disabled(),
  );

  readonly resolvedName = computed(
    (): string => this.group?.name() ?? this.name() ?? '',
  );

  readonly resolvedSize = computed(
    (): InputCheckSize => this.group?.size() ?? this.size(),
  );

  readonly resolvedType = computed(
    (): RadioType => this.group?.type() ?? this.type(),
  );

  protected readonly hostClasses = computed((): string => {
    if (this.resolvedType() === 'segment') {
      return clsx(
        classes.host,
        classes.segmented,
        classes.size(this.resolvedSize()),
        {
          [classes.checked]: this.resolvedChecked(),
        },
      );
    }

    return clsx(
      inputCheckClasses.host,
      inputCheckClasses.size(this.resolvedSize()),
      {
        [inputCheckClasses.disabled]: this.resolvedDisabled(),
        [inputCheckClasses.error]: this.error(),
        [inputCheckClasses.withLabel]: true,
      },
    );
  });

  protected readonly controlWrapperClass = computed((): string => {
    if (this.resolvedType() === 'segment') {
      return classes.segmentedContainer;
    }

    return clsx(inputCheckClasses.control, classes.wrapper);
  });

  protected readonly labelClass = inputCheckClasses.label;
  protected readonly hintClass = inputCheckClasses.hint;

  // CVA
  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onInputChange(): void {
    const val = this.value();

    if (this.group) {
      this.group.select(val);
    } else {
      this.internalValue.set(val);
      this.onChange(val);
    }
  }
}
