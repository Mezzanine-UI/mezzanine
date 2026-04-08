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
  checkboxClasses as classes,
  CheckboxMode,
  CheckboxSeverity,
  CheckboxSize,
} from '@mezzanine-ui/core/checkbox';
import {
  inputCheckClasses,
  InputCheckSize,
} from '@mezzanine-ui/core/_internal/input-check';
import { CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  MZN_CHECKBOX_GROUP,
  CheckboxGroupContextValue,
} from './checkbox-group-context';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 核取方塊元件。
 *
 * 支援 `default`（標準）與 `chip`（標籤）兩種顯示模式，
 * 可獨立使用或搭配 `MznCheckboxGroup` 使用。
 * 實作 `ControlValueAccessor` 以支援 Angular Forms。
 *
 * @example
 * ```html
 * import { MznCheckbox } from '@mezzanine-ui/ng/checkbox';
 *
 * <mzn-checkbox [(ngModel)]="checked">同意條款</mzn-checkbox>
 * <mzn-checkbox mode="chip" size="minor">標籤選項</mzn-checkbox>
 * ```
 */
@Component({
  selector: 'mzn-checkbox',
  standalone: true,
  imports: [MznIcon],
  providers: [provideValueAccessor(MznCheckbox)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <label [class]="labelWrapClass">
      <span [class]="controlWrapperClasses()">
        <input
          type="checkbox"
          [class]="inputClass"
          [checked]="resolvedChecked()"
          [disabled]="resolvedDisabled()"
          [indeterminate]="indeterminate()"
          [name]="resolvedName()"
          [value]="value()"
          (change)="onInputChange($event)"
          (focus)="onTouched()"
        />
        @if (resolvedMode() === 'default') {
          <span [class]="inputContentClass">
            @if (indeterminate()) {
              <span [class]="indeterminateLineClass"></span>
            } @else if (resolvedChecked()) {
              <i mznIcon [icon]="checkIcon" [class]="iconClass"></i>
            }
          </span>
        } @else if (resolvedChecked()) {
          <i mznIcon [icon]="checkIcon" [class]="chipIconClass"></i>
        }
      </span>
      <span [class]="labelClass">
        @if (label()) {
          {{ label() }}
        }
        <ng-content />
        @if (description() && resolvedMode() !== 'chip') {
          <span [class]="descriptionClass">{{ description() }}</span>
        }
        @if (hint()) {
          <span [class]="hintClass">{{ hint() }}</span>
        }
      </span>
    </label>
  `,
})
export class MznCheckbox implements ControlValueAccessor {
  private readonly group = inject<CheckboxGroupContextValue>(
    MZN_CHECKBOX_GROUP,
    { optional: true },
  );

  /** 是否勾選（獨立使用時）。 */
  readonly checked = input<boolean>();

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 是否為錯誤狀態。 */
  readonly error = input(false);

  /** 提示文字。 */
  readonly hint = input<string>();

  /** 是否為不定狀態。 */
  readonly indeterminate = input(false);

  /** 標籤文字（顯示於 checkbox 旁）。等同於直接投影文字內容，但方便程式化設定。 */
  readonly label = input<string | undefined>(undefined);

  /** 標籤下方的說明文字（chip 模式下不顯示）。 */
  readonly description = input<string | undefined>(undefined);

  /** 顯示模式。 */
  readonly mode = input<CheckboxMode>('default');

  /** input name。 */
  readonly name = input<string>();

  /** 嚴重性。 */
  readonly severity = input<CheckboxSeverity>();

  /** 尺寸。 */
  readonly size = input<CheckboxSize>('main');

  /** Checkbox 值（用於群組）。 */
  readonly value = input<string>('');

  private readonly internalChecked = signal(false);

  readonly resolvedChecked = computed((): boolean => {
    if (this.group) {
      return this.group.value().includes(this.value());
    }

    return this.checked() ?? this.internalChecked();
  });

  readonly resolvedDisabled = computed(
    (): boolean => this.group?.disabled() || this.disabled(),
  );

  readonly resolvedMode = computed((): CheckboxMode => this.mode());

  readonly resolvedName = computed(
    (): string => this.group?.name() ?? this.name() ?? '',
  );

  readonly resolvedSize = computed(
    (): CheckboxSize => this.group?.size() ?? this.size(),
  );

  protected readonly hostClasses = computed((): string => {
    const mode = this.resolvedMode();

    if (mode === 'chip') {
      return clsx(
        classes.host,
        classes.mode('chip'),
        classes.size(this.resolvedSize()),
        {
          [classes.checked]: this.resolvedChecked(),
          [classes.disabled]: this.resolvedDisabled(),
        },
        this.severity() ? classes.severity(this.severity()!) : undefined,
      );
    }

    return clsx(
      inputCheckClasses.host,
      inputCheckClasses.size(this.resolvedSize() as InputCheckSize),
      {
        [inputCheckClasses.disabled]: this.resolvedDisabled(),
        [inputCheckClasses.error]: this.error(),
        [inputCheckClasses.withLabel]: true,
      },
    );
  });

  protected readonly controlWrapperClasses = computed((): string => {
    if (this.resolvedMode() === 'chip') {
      return classes.inputContent;
    }

    return clsx(inputCheckClasses.control, classes.inputContainer);
  });

  protected readonly labelClass = inputCheckClasses.label;
  protected readonly labelWrapClass = classes.labelContainer;
  protected readonly descriptionClass = classes.description;
  protected readonly hintClass = inputCheckClasses.hint;
  protected readonly inputContentClass = classes.inputContent;
  protected readonly inputClass = classes.input;
  protected readonly iconClass = classes.icon;
  protected readonly chipIconClass = clsx(classes.icon, classes.chipIcon);
  protected readonly indeterminateLineClass = classes.indeterminateLine;
  protected readonly checkIcon = CheckedIcon;

  // CVA
  private onChange: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.internalChecked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newChecked = target.checked;

    if (this.group) {
      this.group.toggle(this.value());
    } else {
      this.internalChecked.set(newChecked);
      this.onChange(newChecked);
    }
  }
}
