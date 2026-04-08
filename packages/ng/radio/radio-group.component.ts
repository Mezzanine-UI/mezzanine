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
import { RadioType } from '@mezzanine-ui/core/radio';
import {
  inputCheckGroupClasses,
  InputCheckGroupOrientation,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MZN_RADIO_GROUP } from './radio-group-context';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import { MznRadio, RadioWithInputConfig } from './radio.component';

/**
 * RadioGroup 選項定義，可替代子元件傳入。
 */
export interface RadioGroupOption {
  /** 選項 id（唯一識別）。 */
  readonly id: string;
  /** 顯示名稱。 */
  readonly name: string | number;
  /** 是否禁用此選項。 */
  readonly disabled?: boolean;
  /** 是否為錯誤狀態。 */
  readonly error?: boolean;
  /** 圖示（僅 segment 模式）。 */
  readonly icon?: IconDefinition;
  /** 提示文字（僅 radio 模式）。 */
  readonly hint?: string;
  /** 並排輸入框設定。 */
  readonly withInputConfig?: RadioWithInputConfig;
}

/**
 * 單選按鈕群組元件。
 *
 * 透過 DI token `MZN_RADIO_GROUP` 提供共享狀態給子 `MznRadio`。
 *
 * @example
 * ```html
 * import { MznRadioGroup, MznRadio } from '@mezzanine-ui/ng/radio';
 *
 * <div mznRadioGroup [(ngModel)]="selected" name="color">
 *   <div mznRadio value="red">Red</div>
 *   <div mznRadio value="blue">Blue</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznRadioGroup]',
  standalone: true,
  imports: [MznRadio],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideValueAccessor(MznRadioGroup),
    {
      provide: MZN_RADIO_GROUP,
      useExisting: forwardRef(() => MznRadioGroup),
    },
  ],
  host: {
    role: 'radiogroup',
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]': 'orientation()',
  },
  template: `
    @for (option of options(); track option.id) {
      <div
        mznRadio
        [value]="option.id"
        [disabled]="option.disabled ?? false"
        [error]="option.error ?? false"
        [icon]="option.icon"
        [hint]="option.hint"
        [withInputConfig]="option.withInputConfig"
        >{{ option.name }}</div
      >
    }
    <ng-content />
  `,
})
export class MznRadioGroup implements ControlValueAccessor {
  /** 是否禁用所有子 Radio。 */
  readonly disabled: Signal<boolean> = input(false);

  /**
   * 排列方向。控制 aria-orientation 與對應 CSS class。
   * @default 'horizontal'
   */
  readonly orientation: Signal<InputCheckGroupOrientation> =
    input<InputCheckGroupOrientation>('horizontal');

  /**
   * 選項陣列，設定後自動渲染對應 Radio 子元件。若同時傳入 children，此選項會先渲染，children 接在後方。
   */
  readonly options: Signal<readonly RadioGroupOption[]> = input<
    readonly RadioGroupOption[]
  >([]);

  /** 群組名稱。 */
  readonly name: Signal<string> = input('');

  /** 尺寸。 */
  readonly size: Signal<InputCheckSize> = input<InputCheckSize>('main');

  /** 類型。 */
  readonly type: Signal<RadioType> = input<RadioType>('radio');

  /** 值變更事件。 */
  readonly valueChange = output<string>();

  protected readonly hostClasses = computed((): string =>
    clsx(
      inputCheckGroupClasses.host,
      inputCheckGroupClasses.orientation(this.orientation()),
      inputCheckGroupClasses.size(this.size()),
      this.type() === 'segment' ? inputCheckGroupClasses.segmented : undefined,
    ),
  );

  private readonly internalValue = signal('');

  /** 目前選取值（供子 Radio 讀取）。 */
  readonly value: Signal<string> = computed(() => this.internalValue());

  // CVA
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  /** 子 Radio 呼叫此方法選取。 */
  select(val: string): void {
    this.internalValue.set(val);
    this.onChange(val);
    this.onTouched();
    this.valueChange.emit(val);
  }

  writeValue(value: string | null): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
