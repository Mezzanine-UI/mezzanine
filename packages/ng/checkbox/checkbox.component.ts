import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  checkboxClasses as classes,
  CheckboxMode,
  CheckboxSeverity,
  CheckboxSize,
} from '@mezzanine-ui/core/checkbox';
import { TypographyColor } from '@mezzanine-ui/core/typography';
import { inputCheckClasses } from '@mezzanine-ui/core/_internal/input-check';
import { CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import { MznTypography } from '@mezzanine-ui/ng/typography';
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
 * <div mznCheckbox [(ngModel)]="checked">同意條款</div>
 * <div mznCheckbox mode="chip" size="minor">標籤選項</div>
 * ```
 */
@Component({
  selector: '[mznCheckbox]',
  standalone: true,
  imports: [MznIcon, MznTextField, MznTypography],
  providers: [provideValueAccessor(MznCheckbox)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.checked]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.hint]': 'null',
    '[attr.indeterminate]': 'null',
    '[attr.label]': 'null',
    '[attr.description]': 'null',
    '[attr.mode]': 'null',
    '[attr.name]': 'null',
    '[attr.severity]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
    '[attr.withEditInput]': 'null',
    '[attr.editableInputPlaceholder]': 'null',
  },
  template: `
    <label [class]="labelContainerClass">
      <div [class]="inputContainerClass">
        <div [class]="inputContentClass">
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
          @if (resolvedMode() === 'chip') {
            @if (resolvedChecked()) {
              <i
                mznIcon
                [icon]="checkIcon"
                [class]="chipIconClass"
                color="brand"
                [size]="16"
              ></i>
            }
          } @else {
            @if (indeterminate()) {
              <span [class]="indeterminateLineClass"></span>
            } @else if (resolvedChecked()) {
              <i
                mznIcon
                [icon]="checkIcon"
                [class]="iconClass"
                color="fixed-light"
                [size]="9"
              ></i>
            }
          }
        </div>
      </div>
      <span [class]="textContainerClass">
        <span
          mznTypography
          variant="label-primary"
          [color]="labelColor()"
          [class]="labelClass"
        >
          @if (label()) {
            {{ label() }}
          }
          <ng-content />
        </span>
        @if (
          description() &&
          resolvedMode() !== 'chip' &&
          !shouldShowEditableInput()
        ) {
          <span
            mznTypography
            variant="caption"
            color="text-neutral"
            [class]="descriptionClass"
            >{{ description() }}</span
          >
        }
        @if (hint()) {
          <span
            mznTypography
            variant="caption"
            color="text-neutral"
            [class]="hintClass"
            >{{ hint() }}</span
          >
        }
      </span>
    </label>
    @if (
      shouldShowEditableInput() && resolvedMode() !== 'chip' && !indeterminate()
    ) {
      <label [class]="editableInputContainerClass">
        <div
          mznTextField
          #editableInputEl
          size="main"
          (mousedown)="onEditableInputMouseDown($event)"
        >
          <input
            type="text"
            [disabled]="resolvedDisabled()"
            [placeholder]="editableInputPlaceholder()"
            [name]="editableInputName()"
          />
        </div>
      </label>
    }
  `,
})
export class MznCheckbox implements ControlValueAccessor {
  private readonly group = inject<CheckboxGroupContextValue>(
    MZN_CHECKBOX_GROUP,
    { optional: true },
  );

  private readonly hostElRef = inject(ElementRef<HTMLElement>);

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

  /**
   * 是否在勾選時顯示附加輸入框。
   * @default false
   */
  readonly withEditInput = input(false);

  /**
   * 附加輸入框的 placeholder。
   * @default 'Please enter...'
   */
  readonly editableInputPlaceholder = input('Please enter...');

  /**
   * 附加輸入框的 name。預設由 checkbox name 或 id 衍生。
   */
  readonly editableInputName = computed(
    (): string => `${this.resolvedName() || 'checkbox'}_input`,
  );

  private readonly editableInputElRef =
    viewChild<ElementRef<HTMLElement>>('editableInputEl');

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

    // Default mode: match React's root class composition so that
    // `.mzn-checkbox__input { appearance: none; border: 1px solid; ... }`
    // from _checkbox-styles.scss applies to the native input. Previously
    // this emitted `.mzn-input-check` which activated the shared
    // `.mzn-input-check input { opacity: 0 }` rule and hid the visible
    // box entirely. React emits `mzn-checkbox mzn-checkbox--<severity>
    // mzn-checkbox--<size>` with optional state modifiers.
    return clsx(
      classes.host,
      classes.size(this.resolvedSize()),
      classes.severity(this.severity() ?? 'info'),
      {
        [classes.checked]: this.resolvedChecked(),
        [classes.indeterminate]: this.indeterminate(),
        [classes.disabled]: this.resolvedDisabled(),
      },
    );
  });

  protected readonly labelColor = computed(
    (): TypographyColor =>
      this.resolvedDisabled() ? 'text-neutral-light' : 'text-neutral-solid',
  );

  protected readonly labelContainerClass = classes.labelContainer;
  protected readonly inputContainerClass = classes.inputContainer;
  protected readonly inputContentClass = classes.inputContent;
  protected readonly textContainerClass = classes.textContainer;
  protected readonly labelClass = classes.label;
  protected readonly descriptionClass = classes.description;
  protected readonly hintClass = inputCheckClasses.hint;
  protected readonly inputClass = classes.input;
  protected readonly iconClass = classes.icon;
  protected readonly chipIconClass = clsx(classes.icon, classes.chipIcon);
  protected readonly indeterminateLineClass = classes.indeterminateLine;
  protected readonly editableInputContainerClass =
    classes.editableInputContainer;
  protected readonly checkIcon = CheckedIcon;

  protected readonly shouldShowEditableInput = computed((): boolean =>
    this.withEditInput(),
  );

  private prevChecked = false;

  constructor() {
    effect(() => {
      const checked = this.resolvedChecked();
      const show = this.shouldShowEditableInput();

      if (checked && !this.prevChecked && show) {
        queueMicrotask(() => {
          const el = this.editableInputElRef()?.nativeElement;
          const input = el?.querySelector('input');

          input?.focus();
        });
      }

      this.prevChecked = checked;
    });
  }

  protected onEditableInputMouseDown(event: MouseEvent): void {
    if (!this.resolvedChecked() && !this.resolvedDisabled()) {
      event.preventDefault();

      const hostEl = this.hostElRef.nativeElement;
      const checkboxInput = hostEl.querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement | null;

      checkboxInput?.click();
    }
  }

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
