import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
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
 * <div mznRadio [(ngModel)]="selected" value="a">選項 A</div>
 * ```
 */
@Component({
  selector: '[mznRadio]',
  standalone: true,
  imports: [MznIcon, MznInput],
  providers: [provideValueAccessor(MznRadio)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.checked]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.hint]': 'null',
    '[attr.icon]': 'null',
    '[attr.withInputConfig]': 'null',
    '[attr.name]': 'null',
    '[attr.size]': 'null',
    '[attr.type]': 'null',
    '[attr.value]': 'null',
  },
  template: `
    @if (resolvedType() === 'radio') {
      <label [class]="labelHostClasses()">
        <span [class]="radioControlClass">
          <span [class]="radioCircleClass()">
            <input
              #radioInputEl
              type="radio"
              [checked]="resolvedChecked()"
              [disabled]="resolvedDisabled()"
              [name]="resolvedName()"
              [value]="value()"
              (change)="onRadioChange()"
              (focus)="onTouched()"
            />
          </span>
        </span>
        <span [class]="labelClass">
          <ng-content />
          @if (hint()) {
            <span [class]="hintClass">{{ hint() }}</span>
          }
        </span>
      </label>
      @if (withInputConfig()) {
        <div
          #textInputWrapper
          [style.width.px]="withInputConfig()!.width ?? 120"
        >
          <div
            mznInput
            [placeholder]="withInputConfig()!.placeholder ?? 'Placeholder'"
            [disabled]="withInputConfig()!.disabled ?? false"
            (valueChange)="withInputConfig()!.onValueChange?.($event)"
          ></div>
        </div>
      }
    } @else {
      <label [class]="labelHostClasses()">
        <span [class]="segmentedControlClass()">
          <span [class]="segmentedHostClass()">
            <span [class]="segmentedContainerClass()">
              @if (icon()) {
                <i mznIcon [icon]="icon()!" [size]="16"></i>
              }
              <ng-content />
            </span>
            <input
              type="radio"
              [checked]="resolvedChecked()"
              [disabled]="resolvedDisabled()"
              [name]="resolvedName()"
              [value]="value()"
              (change)="onInputChange()"
              (focus)="onTouched()"
            />
          </span>
        </span>
      </label>
    }
  `,
})
export class MznRadio implements ControlValueAccessor {
  private readonly group = inject<RadioGroupContextValue>(MZN_RADIO_GROUP, {
    optional: true,
  });

  constructor() {
    afterNextRender(() => this.setupTextInputClickHandler());
  }

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

  // Host element class: mzn-radio__wrapper for both radio and segment
  protected readonly hostClasses = computed((): string => classes.wrapper);

  // <label> classes — InputCheck host
  protected readonly labelHostClasses = computed((): string => {
    if (this.resolvedType() === 'segment') {
      return clsx(
        inputCheckClasses.host,
        inputCheckClasses.size(this.resolvedSize()),
        inputCheckClasses.segmented,
        {
          [inputCheckClasses.disabled]: this.resolvedDisabled(),
          [inputCheckClasses.error]: this.error(),
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

  // Radio type: control wrapper (mzn-input-check__control)
  protected readonly radioControlClass = inputCheckClasses.control;

  // Radio type: inner circle span
  protected readonly radioCircleClass = computed((): string =>
    clsx(classes.host, classes.size(this.resolvedSize()), {
      [classes.checked]: this.resolvedChecked(),
      [classes.error]: this.error(),
    }),
  );

  // Segment type: control wrapper (mzn-input-check__control--segmented)
  protected readonly segmentedControlClass = computed((): string =>
    clsx(inputCheckClasses.control, inputCheckClasses.controlSegmented),
  );

  // Segment type: inner host span (mzn-radio--segmented + state)
  protected readonly segmentedHostClass = computed((): string =>
    clsx(classes.host, classes.size(this.resolvedSize()), classes.segmented, {
      [classes.checked]: this.resolvedChecked(),
      [classes.error]: this.error(),
    }),
  );

  // Segment type: container for icon + text
  protected readonly segmentedContainerClass = computed((): string =>
    clsx(classes.segmentedContainer, {
      [classes.segmentedContainerWithIconText]: !!this.icon(),
    }),
  );

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

  private readonly radioInputElRef =
    viewChild<ElementRef<HTMLInputElement>>('radioInputEl');

  private readonly textInputWrapperRef =
    viewChild<ElementRef<HTMLElement>>('textInputWrapper');

  protected onInputChange(): void {
    const val = this.value();

    if (this.group) {
      this.group.select(val);
    } else {
      this.internalValue.set(val);
      this.onChange(val);
    }
  }

  /** Radio change + auto-focus text input (matches React handleRadioChange). */
  protected onRadioChange(): void {
    this.onInputChange();

    const cfg = this.withInputConfig();

    if (cfg && !cfg.disabled) {
      const inputEl =
        this.textInputWrapperRef()?.nativeElement?.querySelector('input');
      inputEl?.focus();
    }
  }

  /**
   * Bind click on the inner native <input> of MznInput to select this radio.
   * React does this via inputProps.onClick on the Input component.
   * We use afterNextRender to wait for MznInput to render its internal input.
   */
  private setupTextInputClickHandler(): void {
    const wrapper = this.textInputWrapperRef()?.nativeElement;

    if (!wrapper) return;

    const innerInput = wrapper.querySelector('input');

    if (!innerInput) return;

    innerInput.addEventListener('click', () => {
      this.radioInputElRef()?.nativeElement?.click();
    });
  }
}
