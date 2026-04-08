import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  toggleClasses as classes,
  ToggleSize,
} from '@mezzanine-ui/core/toggle';
import clsx from 'clsx';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 切換開關元件。
 *
 * 二元 on/off 狀態的切換控制，實作 `ControlValueAccessor` 支援 Angular Forms。
 *
 * @example
 * ```html
 * import { MznToggle } from '@mezzanine-ui/ng/toggle';
 *
 * <mzn-toggle [(ngModel)]="enabled" label="啟用通知" />
 * ```
 */
@Component({
  selector: 'mzn-toggle',
  standalone: true,
  imports: [MznTypography],
  providers: [provideValueAccessor(MznToggle)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <span [class]="inputContainerClass">
      <input
        type="checkbox"
        [attr.aria-checked]="resolvedChecked()"
        [attr.aria-disabled]="resolvedDisabled() || null"
        [class]="inputClass"
        [checked]="resolvedChecked()"
        [disabled]="resolvedDisabled()"
        (change)="onInputChange($event)"
        (focus)="onTouched()"
      />
      <span [class]="knobClass"></span>
    </span>
    @if (label()) {
      <span [class]="textContainerClass">
        <span
          mznTypography
          variant="label-primary"
          color="text-neutral-solid"
          >{{ label() }}</span
        >
        @if (supportingText()) {
          <span mznTypography variant="caption" color="text-neutral">{{
            supportingText()
          }}</span>
        }
      </span>
    }
  `,
})
export class MznToggle implements ControlValueAccessor {
  /** 是否勾選。 */
  readonly checked = input<boolean>();

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 主要標籤文字。 */
  readonly label = input<string>();

  /** 尺寸。 */
  readonly size = input<ToggleSize>('main');

  /** 輔助說明文字。 */
  readonly supportingText = input<string>();

  private readonly internalChecked = signal(false);
  private readonly internalDisabled = signal(false);

  readonly resolvedChecked = computed(
    (): boolean => this.checked() ?? this.internalChecked(),
  );

  readonly resolvedDisabled = computed(
    (): boolean => this.disabled() || this.internalDisabled(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes[this.size()], {
      [classes.checked]: this.resolvedChecked(),
      [classes.disabled]: this.resolvedDisabled(),
    }),
  );

  protected readonly inputContainerClass = classes.inputContainer;
  protected readonly inputClass = classes.input;
  protected readonly knobClass = classes.knob;
  protected readonly textContainerClass = classes.textContainer;

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

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }

  protected onInputChange(event: Event): void {
    if (this.resolvedDisabled()) {
      return;
    }

    const next = (event.target as HTMLInputElement).checked;

    this.internalChecked.set(next);
    this.onChange(next);
  }
}
