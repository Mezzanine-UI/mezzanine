import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { formFieldClasses as classes } from '@mezzanine-ui/core/form';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTooltip } from '@mezzanine-ui/ng/tooltip';
import { FormControl, MZN_FORM_CONTROL } from './form-control';

/**
 * 表單標籤元件，用於顯示欄位名稱、必填標記與可選的資訊圖示。
 *
 * @example
 * ```html
 * <label mznFormLabel htmlFor="email" labelText="電子郵件" ></label>
 * <label mznFormLabel
 *   htmlFor="email"
 *   labelText="電子郵件"
 *   [informationIcon]="InfoOutlineIcon"
 *   informationText="請輸入有效的電子郵件"
 * ></label>
 * ```
 */
@Component({
  selector: '[mznFormLabel]',
  host: {
    '[attr.htmlFor]': 'null',
    '[attr.labelText]': 'null',
    '[attr.informationIcon]': 'null',
    '[attr.informationText]': 'null',
    '[attr.optionalMarker]': 'null',
  },
  standalone: true,
  imports: [MznIcon, MznTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [class]="labelClasses()" [attr.for]="htmlFor()">
      @if (isRequired()) {
        <span [class]="classes.labelRequiredMarker">*</span>
      }
      {{ labelText() }}
      @if (optionalMarker()) {
        <span [class]="classes.labelOptionalMarker">{{
          optionalMarker()
        }}</span>
      }
      @if (informationIcon()) {
        <i
          mznIcon
          [class]="classes.labelInformationIcon"
          [icon]="informationIcon()!"
          [size]="16"
          color="neutral-light"
          [mznTooltip]="informationText()"
        ></i>
      }
      <span [class]="classes.labelColon">:</span>
    </label>
  `,
})
export class MznFormLabel {
  protected readonly classes = classes;

  private readonly formControl = inject<FormControl>(MZN_FORM_CONTROL, {
    optional: true,
  });

  /** label 的 for 屬性。 */
  readonly htmlFor = input<string>();

  /** 標籤文字。 */
  readonly labelText = input.required<string>();

  /** 標籤旁的資訊圖示。 */
  readonly informationIcon = input<IconDefinition>();

  /** 資訊圖示的 tooltip 文字。 */
  readonly informationText = input<string>();

  /** 選填標記文字（如「(選填)」）。 */
  readonly optionalMarker = input<string>();

  protected readonly isRequired = computed(
    (): boolean => this.formControl?.required ?? false,
  );

  protected readonly labelClasses = computed((): string => clsx(classes.label));
}
