import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { inputClasses as classes } from '@mezzanine-ui/core/input';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import { type Placement } from '@floating-ui/dom';
import { EyeIcon, EyeInvisibleIcon, SearchIcon } from '@mezzanine-ui/icons';
import type { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import {
  formatNumberWithCommas,
  parseNumberWithCommas,
  provideValueAccessor,
} from '@mezzanine-ui/ng/utils';
import { MznInputSpinnerButton } from './spinner-button.component';
import { MznInputActionButton } from './action-button.component';
import { MznInputSelectButton } from './select-button.component';
import { MznPasswordStrengthIndicator } from './password-strength-indicator.component';

/** Input 的變體類型。 */
export type InputVariant =
  | 'base'
  | 'affix'
  | 'action'
  | 'measure'
  | 'number'
  | 'password'
  | 'search'
  | 'select';

/**
 * 多功能輸入框元件，支援 base、affix、search、password、measure、action 等多種變體。
 *
 * 實作 `ControlValueAccessor`，可搭配 Angular Reactive Forms 或 Template-driven Forms。
 * `search` 變體預設帶搜尋圖示與清除按鈕；`password` 變體提供密碼可見性切換及強度指示器；
 * `measure` 變體支援 Spinner 微調按鈕；`action` 變體支援外部動作按鈕。
 *
 * @example
 * ```html
 * import { MznInput } from '@mezzanine-ui/ng/input';
 *
 * <mzn-input placeholder="請輸入" />
 * <mzn-input variant="search" placeholder="搜尋" />
 * <mzn-input variant="password" placeholder="密碼" />
 * <mzn-input variant="affix" prefixText="$" suffixText=".00" />
 * <mzn-input variant="measure" suffixText="px" [showSpinner]="true" />
 * ```
 */
@Component({
  selector: 'mzn-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MznIcon,
    MznInputActionButton,
    MznInputSelectButton,
    MznInputSpinnerButton,
    MznPasswordStrengthIndicator,
    MznTextField,
  ],
  providers: [provideValueAccessor(MznInput)],
  host: {
    '[class]': 'containerClasses()',
    '[style.display]': '"block"',
  },
  template: `
    <div [class]="hostClasses()">
      @if (actionButtonPosition() === 'prefix') {
        <mzn-input-action-button
          [disabled]="actionButtonDisabled()"
          [icon]="actionButton()?.icon"
          [label]="actionButton()?.label ?? 'Copy'"
          [size]="size()"
          (clicked)="actionButton()?.onClick?.()"
        />
      }
      @if (
        selectButtonPosition() === 'prefix' || selectButtonPosition() === 'both'
      ) {
        <mzn-input-select-button
          [disabled]="selectButton()?.disabled || disabled()"
          [dropdownMaxHeight]="dropdownMaxHeight()"
          [dropdownPlacement]="dropdownPlacement()"
          [dropdownWidth]="dropdownWidth()"
          [options]="selectOptions()"
          [size]="size()"
          [value]="selectButton()?.value"
          (selected)="onSelectOption($event)"
        />
      }
      <mzn-text-field
        [active]="active()"
        [class]="fieldClasses()"
        [clearable]="isClearable()"
        [disabled]="disabled()"
        [error]="error()"
        [fullWidth]="fullWidth()"
        [hasPrefix]="!!resolvedPrefix()"
        [hasSuffix]="!!resolvedSuffix()"
        [readonly]="readonlyState()"
        [size]="size()"
        [typing]="typing()"
        (cleared)="onClear()"
      >
        @if (resolvedPrefix(); as pfx) {
          <span prefix [class]="textFieldClasses.prefix">
            @if (pfx === 'search-icon') {
              <i mznIcon [icon]="searchIcon"></i>
            } @else if (pfx === 'prefix-icon') {
              <i mznIcon [icon]="prefixIcon()!"></i>
            } @else {
              {{ pfx }}
            }
          </span>
        }
        <input
          #inputEl
          [attr.id]="inputId()"
          [attr.name]="inputName()"
          [attr.placeholder]="placeholder()"
          [attr.aria-disabled]="disabled()"
          [attr.aria-multiline]="false"
          [attr.aria-readonly]="readonlyState()"
          [attr.min]="min()"
          [attr.max]="max()"
          [attr.step]="step()"
          [disabled]="disabled()"
          [readOnly]="readonlyState()"
          [type]="resolvedInputType()"
          [style.text-align]="inputTextAlign()"
          [value]="displayValue()"
          (input)="onInput($event)"
          (blur)="onBlur()"
        />
        @if (showSpinner() && variant() === 'measure') {
          <div
            suffix
            [class]="textFieldClasses.suffix + ' ' + classes.spinners"
          >
            @if (resolvedSuffix(); as sfx) {
              <span>{{ sfx }}</span>
            }
            <div [class]="classes.spinners">
              <mzn-input-spinner-button
                type="up"
                [size]="size()"
                [disabled]="disabled()"
                (clicked)="onSpinUp()"
              />
              <mzn-input-spinner-button
                type="down"
                [size]="size()"
                [disabled]="disabled()"
                (clicked)="onSpinDown()"
              />
            </div>
          </div>
        } @else if (resolvedSuffix(); as sfx) {
          <span suffix [class]="textFieldClasses.suffix">
            @if (sfx === 'password-toggle') {
              <i
                mznIcon
                [clickable]="true"
                [icon]="showPassword() ? eyeIcon : eyeInvisibleIcon"
                (click)="togglePassword()"
                role="button"
                tabindex="0"
                [attr.aria-label]="
                  showPassword() ? 'Hide password' : 'Show password'
                "
                (keydown.enter)="togglePassword()"
                (keydown.space)="togglePassword(); $event.preventDefault()"
              ></i>
            } @else {
              {{ sfx }}
            }
          </span>
        }
      </mzn-text-field>
      @if (actionButtonPosition() === 'suffix') {
        <mzn-input-action-button
          [disabled]="actionButtonDisabled()"
          [icon]="actionButton()?.icon"
          [label]="actionButton()?.label ?? 'Copy'"
          [size]="size()"
          (clicked)="actionButton()?.onClick?.()"
        />
      }
      @if (
        selectButtonPosition() === 'suffix' || selectButtonPosition() === 'both'
      ) {
        <mzn-input-select-button
          [disabled]="selectButton()?.disabled || disabled()"
          [dropdownMaxHeight]="dropdownMaxHeight()"
          [dropdownPlacement]="dropdownPlacement()"
          [dropdownWidth]="dropdownWidth()"
          [options]="selectOptions()"
          [size]="size()"
          [value]="selectButton()?.value"
          (selected)="onSelectOption($event)"
        />
      }
    </div>
    @if (showPasswordStrengthIndicator() && variant() === 'password') {
      <div [class]="classes.indicatorContainer">
        <mzn-password-strength-indicator
          [strength]="passwordStrengthIndicator()?.strength ?? 'weak'"
          [strengthText]="passwordStrengthIndicator()?.strengthText"
          [strengthTextPrefix]="
            passwordStrengthIndicator()?.strengthTextPrefix ?? '密碼強度：'
          "
          [hintTexts]="passwordStrengthIndicator()?.hintTexts"
        />
      </div>
    }
  `,
})
export class MznInput implements ControlValueAccessor, OnInit {
  protected readonly textFieldClasses = textFieldClasses;
  protected readonly classes = classes;
  protected readonly searchIcon = SearchIcon;
  protected readonly eyeIcon = EyeIcon;
  protected readonly eyeInvisibleIcon = EyeInvisibleIcon;

  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private onChangeFn: (value: string) => void = () => {};
  private onTouchedFn: () => void = () => {};

  /**
   * 輸入值，可透過模板綁定 `[value]="..."` 或 `value="..."` 設定。
   * 同時支援 ControlValueAccessor（Reactive Forms / ngModel）。
   *
   * Controlled mode：parent 透過 `[value]` 控制顯示值，需監聽 `(valueChange)` 更新。
   * Uncontrolled mode：不綁定 `[value]`，透過 CVA 或直接輸入管理值。
   */
  readonly externalValue = input<string | undefined>(undefined, {
    alias: 'value',
  });

  /** 內部值 signal — 用於 uncontrolled mode 和 CVA。 */
  protected readonly internalValue = signal('');

  protected readonly showPassword = signal(false);

  /**
   * 是否處於 active 狀態。
   * @default false
   */
  readonly active = input(false);

  /**
   * 外部動作按鈕設定（action 變體用）。
   * `position` 決定按鈕在輸入框前（'prefix'）或後（'suffix'）。
   */
  readonly actionButton = input<{
    readonly position?: 'prefix' | 'suffix';
    readonly icon?: IconDefinition;
    readonly label?: string;
    readonly disabled?: boolean;
    readonly onClick?: () => void;
  }>();

  /**
   * 是否可清除。search 變體預設為 true，其餘預設為 false。
   */
  readonly clearable = input<boolean>();

  /**
   * 初始預設值（uncontrolled 模式）。
   * 僅在元件初始化時生效，若同時提供 `[value]` 則 `defaultValue` 無效。
   * 對應 React 的 `defaultValue` prop。
   */
  readonly defaultValue = input<string>();

  /**
   * 選擇按鈕設定（select 變體用）。
   * `position` 決定按鈕在 'prefix'、'suffix' 或 'both'（兩端皆顯示）。
   */
  readonly selectButton = input<{
    readonly position?: 'prefix' | 'suffix' | 'both';
    readonly disabled?: boolean;
    readonly value?: string;
    readonly onClick?: () => void;
  }>();

  /**
   * 下拉選單的選項列表（select 變體用）。
   */
  readonly selectOptions = input<ReadonlyArray<DropdownOption>>();

  /**
   * 下拉選單的固定寬度（select 變體用）。
   * @default 120
   */
  readonly dropdownWidth = input<number | string>(120);

  /**
   * 下拉選單的最大高度（select 變體用）。
   * @default 114
   */
  readonly dropdownMaxHeight = input<number | string>(114);

  /**
   * 下拉選單的定位方向（select 變體用）。
   * @default 'bottom-start'
   */
  readonly dropdownPlacement = input<Placement>('bottom-start');

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否全寬。
   * @default true
   */
  readonly fullWidth = input(true);

  /**
   * 數值格式化函式，將內部值轉換為顯示文字（measure / number 變體用）。
   */
  readonly formatter = input<(value: string) => string>();

  /** input 的 id 屬性。 */
  readonly inputId = input<string>();

  /** input 的 name 屬性。 */
  readonly inputName = input<string>();

  /**
   * input 的原生 type 屬性。
   */
  readonly inputType = input<string>();

  /**
   * 最大值（measure / number 變體用）。
   */
  readonly max = input<number>();

  /**
   * 最小值（measure / number 變體用）。
   */
  readonly min = input<number>();

  /**
   * 數值解析函式，將顯示文字轉換回原始值（measure / number 變體用）。
   */
  readonly parser = input<(value: string) => string>();

  /** 佔位文字。 */
  readonly placeholder = input<string>();

  /**
   * 前綴圖示（affix 變體用），優先於 `prefixText`。
   */
  readonly prefixIcon = input<IconDefinition>();

  /** 前綴文字（affix 變體用）。 */
  readonly prefixText = input<string>();

  /**
   * 密碼強度指示器設定（password 變體 + showPasswordStrengthIndicator 為 true 時使用）。
   */
  readonly passwordStrengthIndicator = input<{
    readonly strength?: 'weak' | 'medium' | 'strong';
    readonly strengthText?: string;
    readonly strengthTextPrefix?: string;
    readonly hintTexts?: readonly {
      severity: 'error' | 'info' | 'success' | 'warning';
      hint: string;
    }[];
  }>();

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readonlyState = input(false, { alias: 'readonly' });

  /**
   * 欄位尺寸。
   * @default 'main'
   */
  readonly size = input<'main' | 'sub'>('main');

  /**
   * 是否顯示密碼強度指示器（password 變體用）。
   * @default false
   */
  readonly showPasswordStrengthIndicator = input(false);

  /**
   * 是否顯示 Spinner 微調按鈕（measure 變體用）。
   * @default false
   */
  readonly showSpinner = input(false);

  /**
   * 步進值（measure / number 變體用）。
   * @default 1
   */
  readonly step = input<number>();

  /** 後綴文字（affix / measure 變體用）。 */
  readonly suffixText = input<string>();

  /**
   * 是否正在輸入（覆蓋 TextField 的自動偵測）。
   */
  readonly typing = input<boolean>();

  /**
   * 輸入框變體。
   * @default 'base'
   */
  readonly variant = input<InputVariant>('base');

  /** 值變更事件。 */
  readonly valueChange = output<string>();

  /** Spinner 往上微調事件（measure 變體用）。 */
  readonly spinUp = output<void>();

  /** Spinner 往下微調事件（measure 變體用）。 */
  readonly spinDown = output<void>();

  /** 下拉選項選取事件（select 變體用）。 */
  readonly selectOptionSelected = output<DropdownOption>();

  protected readonly isClearable = computed((): boolean => {
    const v = this.variant();

    if (v === 'search') return this.clearable() !== false;

    return this.clearable() ?? false;
  });

  protected readonly resolvedInputType = computed((): string => {
    const custom = this.inputType();

    if (custom) return custom;

    if (this.variant() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }

    if (this.variant() === 'number') {
      return 'number';
    }

    return 'text';
  });

  protected readonly resolvedPrefix = computed((): string | null => {
    if (this.variant() === 'search') return 'search-icon';

    const icon = this.prefixIcon();

    if (icon) return 'prefix-icon';

    const text = this.prefixText();

    return text ?? null;
  });

  protected readonly resolvedSuffix = computed((): string | null => {
    if (this.variant() === 'password') return 'password-toggle';

    const text = this.suffixText();

    return text ?? null;
  });

  /** 解析後的當前值（externalValue 優先、internalValue 為 fallback）。 */
  protected readonly resolvedValue = computed((): string => {
    const external = this.externalValue();

    return external !== undefined ? external : this.internalValue();
  });

  protected readonly displayValue = computed((): string => {
    const fmt = this.formatter();
    const raw = this.resolvedValue();

    if (fmt) return fmt(raw);

    if (this.variant() === 'measure' && raw !== '') {
      const n = Number(raw);

      if (!Number.isNaN(n)) return formatNumberWithCommas(n);
    }

    return raw;
  });

  protected readonly containerClasses = computed((): string =>
    clsx(classes.container),
  );

  protected readonly hostClasses = computed((): string => {
    const sbPos = this.selectButtonPosition();
    const hasPrefixExternal =
      this.actionButtonPosition() === 'prefix' ||
      sbPos === 'prefix' ||
      sbPos === 'both';
    const hasSuffixExternal =
      this.actionButtonPosition() === 'suffix' ||
      sbPos === 'suffix' ||
      sbPos === 'both';

    return clsx(classes.host, {
      [classes.number]: this.variant() === 'number',
      [classes.passwordInput]: this.variant() === 'password',
      [classes.searchInput]: this.variant() === 'search',
      [classes.measureWithSpinner]:
        this.variant() === 'measure' && this.showSpinner(),
      [classes.measureWithoutSpinner]:
        this.variant() === 'measure' && !this.showSpinner(),
      [classes.withPrefixExternalAction]: hasPrefixExternal,
      [classes.withSuffixExternalAction]: hasSuffixExternal,
    });
  });

  protected readonly fieldClasses = computed((): string =>
    clsx(
      classes.field,
      {
        [classes.number]: this.variant() === 'number',
        [textFieldClasses.monoInput]: this.variant() === 'measure',
        [textFieldClasses.tinyGap]:
          this.variant() === 'measure' && this.showSpinner(),
      },
      classes.size(this.size()),
    ),
  );

  protected readonly inputTextAlign = computed((): string | null =>
    this.variant() === 'measure' ? 'right' : null,
  );

  protected readonly actionButtonPosition = computed(
    (): 'prefix' | 'suffix' | null => {
      const ab = this.actionButton();

      if (!ab) return null;

      return ab.position ?? null;
    },
  );

  protected readonly actionButtonDisabled = computed((): boolean => {
    const ab = this.actionButton();

    if (typeof ab?.disabled === 'boolean') return ab.disabled;

    return this.disabled() || this.readonlyState();
  });

  protected readonly selectButtonPosition = computed(
    (): 'prefix' | 'suffix' | 'both' | null => {
      const sb = this.selectButton();

      if (!sb) return null;

      return sb.position ?? null;
    },
  );

  // ControlValueAccessor
  writeValue(value: string | null): void {
    this.internalValue.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState?(_isDisabled: boolean): void {
    // Disabled state is managed via the `disabled` input
  }

  ngOnInit(): void {
    // Set internalValue from defaultValue if no external value is bound
    const dv = this.defaultValue();

    if (dv !== undefined && this.externalValue() === undefined) {
      this.internalValue.set(dv);
    }
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value;
    const parse = this.parser();
    let newValue: string;

    if (parse) {
      newValue = parse(rawValue);
    } else if (this.variant() === 'measure') {
      newValue = String(parseNumberWithCommas(rawValue));
    } else {
      newValue = rawValue;
    }

    this.internalValue.set(newValue);
    this.onChangeFn(newValue);
    this.valueChange.emit(newValue);
  }

  protected onBlur(): void {
    this.onTouchedFn();
  }

  protected onClear(): void {
    this.internalValue.set('');
    this.onChangeFn('');
    this.valueChange.emit('');

    const el = this.inputEl()?.nativeElement;

    if (el) {
      el.value = '';
      el.focus();
    }
  }

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected updateValue(newVal: string): void {
    this.internalValue.set(newVal);
    this.onChangeFn(newVal);
    this.valueChange.emit(newVal);
  }

  protected onSpinUp(): void {
    const val = parseFloat(this.resolvedValue() || '0');
    const step = this.step() ?? 1;
    const max = this.max();
    const newVal = max != null ? Math.min(val + step, max) : val + step;

    this.updateValue(String(newVal));
    this.spinUp.emit();
  }

  protected onSpinDown(): void {
    const val = parseFloat(this.resolvedValue() || '0');
    const step = this.step() ?? 1;
    const min = this.min();
    const newVal = min != null ? Math.max(val - step, min) : val - step;

    this.updateValue(String(newVal));
    this.spinDown.emit();
  }

  protected onSelectOption(option: DropdownOption): void {
    this.selectOptionSelected.emit(option);
  }
}
