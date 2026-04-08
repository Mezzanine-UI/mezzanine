import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  ControlFieldSlotLayout,
  formFieldClasses as classes,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { IconDefinition } from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import clsx from 'clsx';
import { FormControl, MZN_FORM_CONTROL } from './form-control';
import { MznFormLabel } from './form-label.component';
import { MznFormHintText } from './form-hint-text.component';

/**
 * 表單欄位容器元件，整合標籤、提示文字與錯誤狀態。
 *
 * 透過 `MZN_FORM_CONTROL` InjectionToken 將 `disabled`、`required`、`severity` 等狀態
 * 向下傳遞給子元件。支援水平、垂直與延伸三種排版方式。
 *
 * @example
 * ```html
 * import { MznFormField } from '@mezzanine-ui/ng/form';
 *
 * <div mznFormField name="username" label="使用者名稱">
 *   <input mznInput placeholder="請輸入" />
 * </div>
 *
 * <div mznFormField name="email" label="電子郵件" layout="vertical" severity="error"
 *   hintText="格式不正確">
 *   <input mznInput placeholder="請輸入" />
 * </div>
 * ```
 */
@Component({
  selector: '[mznFormField]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznFormLabel, MznFormHintText],
  providers: [
    {
      provide: MZN_FORM_CONTROL,
      useFactory: (field: MznFormField): FormControl => ({
        get disabled(): boolean {
          return field.disabled();
        },
        get fullWidth(): boolean {
          return field.fullWidth();
        },
        get required(): boolean {
          return field.required();
        },
        get severity(): SeverityWithInfo {
          return field.severity();
        },
      }),
      deps: [MznFormField],
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    '[attr.controlFieldSlotColumns]': 'null',
    '[attr.controlFieldSlotLayout]': 'null',
    '[attr.counter]': 'null',
    '[attr.counterColor]': 'null',
    '[attr.density]': 'null',
    '[attr.disabled]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.hintText]': 'null',
    '[attr.hintTextIcon]': 'null',
    '[attr.label]': 'null',
    '[attr.labelInformationIcon]': 'null',
    '[attr.labelInformationText]': 'null',
    '[attr.labelOptionalMarker]': 'null',
    '[attr.labelSpacing]': 'null',
    '[attr.layout]': 'null',
    '[attr.name]': 'null',
    '[attr.required]': 'null',
    '[attr.severity]': 'null',
    '[attr.showHintTextIcon]': 'null',
  },
  template: `
    @if (label()) {
      <label
        mznFormLabel
        [class]="labelAreaClasses()"
        [htmlFor]="name()"
        [informationIcon]="labelInformationIcon()"
        [informationText]="labelInformationText()"
        [labelText]="label()!"
        [optionalMarker]="labelOptionalMarker()"
      ></label>
    }
    <div [class]="classes.dataEntry">
      <div [class]="controlFieldSlotClasses()">
        <ng-content />
      </div>
      @if (hintText() || hintTextIcon() || counter()) {
        <div [class]="hintAreaClasses()">
          @if (hintText() || hintTextIcon()) {
            <span
              mznFormHintText
              [hintText]="hintText()"
              [hintTextIcon]="hintTextIcon()"
              [severity]="severity()"
              [showHintTextIcon]="showHintTextIcon()"
            ></span>
          }
          @if (counter()) {
            <span [class]="counterClasses()">{{ counter() }}</span>
          }
        </div>
      }
    </div>
  `,
})
export class MznFormField {
  protected readonly classes = classes;

  /** 控制欄位插槽的欄數（2 | 3 | 4）。 */
  readonly controlFieldSlotColumns = input<2 | 3 | 4>();

  /**
   * 控制欄位插槽的排版變體。
   * @default ControlFieldSlotLayout.MAIN
   */
  readonly controlFieldSlotLayout = input<ControlFieldSlotLayout>(
    ControlFieldSlotLayout.MAIN,
  );

  /** 計數器文字（如字數統計）。 */
  readonly counter = input<string>();

  /**
   * 計數器文字顏色。
   * @default FormFieldCounterColor.INFO
   */
  readonly counterColor = input<FormFieldCounterColor>(
    FormFieldCounterColor.INFO,
  );

  /**
   * 密度變體，僅在水平/延伸排版時生效。
   */
  readonly density = input<FormFieldDensity>();

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否全寬。
   * @default false
   */
  readonly fullWidth = input(false);

  /** 提示文字。 */
  readonly hintText = input<string>();

  /** 提示文字圖示。 */
  readonly hintTextIcon = input<IconDefinition>();

  /** 標籤文字。 */
  readonly label = input<string>();

  /** 標籤旁資訊圖示。 */
  readonly labelInformationIcon = input<IconDefinition>();

  /** 資訊圖示 tooltip 文字。 */
  readonly labelInformationText = input<string>();

  /** 選填標記文字。 */
  readonly labelOptionalMarker = input<string>();

  /**
   * 標籤區域間距。
   * @default FormFieldLabelSpacing.MAIN
   */
  readonly labelSpacing = input<FormFieldLabelSpacing>(
    FormFieldLabelSpacing.MAIN,
  );

  /**
   * 排版方式。
   * @default FormFieldLayout.HORIZONTAL
   */
  readonly layout = input<FormFieldLayout>(FormFieldLayout.HORIZONTAL);

  /** 欄位名稱，作為 label 的 htmlFor。 */
  readonly name = input.required<string>();

  /**
   * 是否必填。
   * @default false
   */
  readonly required = input(false);

  /**
   * 嚴重程度。
   * @default 'info'
   */
  readonly severity = input<SeverityWithInfo>('info');

  /**
   * 是否顯示提示文字圖示。
   * @default true
   */
  readonly showHintTextIcon = input(true);

  protected readonly hostClasses = computed((): string => {
    const layout = this.layout();
    const density = this.density();
    const shouldApplyDensity = !!density && layout !== FormFieldLayout.VERTICAL;

    return clsx(
      classes.host,
      classes.layout(layout),
      shouldApplyDensity ? classes.density(density) : undefined,
      {
        [classes.disabled]: this.disabled(),
        [classes.fullWidth]: this.fullWidth(),
      },
    );
  });

  protected readonly labelAreaClasses = computed((): string => {
    const layout = this.layout();
    const shouldApplyLabelSpacing = layout !== FormFieldLayout.VERTICAL;

    return clsx(
      classes.labelArea,
      shouldApplyLabelSpacing
        ? classes.labelSpacing(this.labelSpacing())
        : undefined,
    );
  });

  protected readonly controlFieldSlotClasses = computed((): string => {
    const columns = this.controlFieldSlotColumns();

    return clsx(
      `${classes.controlFieldSlot}--${this.controlFieldSlotLayout()}`,
      columns ? `${classes.controlFieldSlot}--columns-${columns}` : undefined,
    );
  });

  protected readonly hintAreaClasses = computed((): string =>
    clsx(
      classes.hintTextAndCounterArea,
      !(this.hintText() || this.hintTextIcon()) && this.counter()
        ? `${classes.hintTextAndCounterArea}--align-right`
        : undefined,
    ),
  );

  protected readonly counterClasses = computed((): string =>
    clsx(classes.counter, classes.counterColor(this.counterColor())),
  );
}
