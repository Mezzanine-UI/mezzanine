import { forwardRef } from 'react';
import {
  ControlFieldSlotColumns,
  ControlFieldSlotLayout,
  formFieldClasses as classes,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { FormControl, FormControlContext } from './FormControlContext';
import { FormLabel } from './index';
import { IconDefinition } from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import FormHintText from './FormHintText';

export interface FormFieldProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * The counter text to display in the form field.
   * Typically used to show character count or remaining characters.
   */
  counter?: string;
  /**
   * The color of the counter text.
   * @default FormFieldCounterColor.INFO
   */
  counterColor?: FormFieldCounterColor;
  /**
   * The number of equal-width columns in the control field slot.
   * Children are laid out in a CSS Grid with equal-width columns; items wrap into additional rows as needed.
   * Omit this prop for single-column (default) layout.
   */
  controlFieldSlotColumns?: ControlFieldSlotColumns;
  /**
   * The layout variant for the control field slot.
   * Controls the visual styling and appearance of the input control area.
   * @default ControlFieldSlotLayout.MAIN
   */
  controlFieldSlotLayout?: ControlFieldSlotLayout;
  /**
   * To control the field passed from children whether should be disabled.
   * The form message won't appear if disabled.
   */
  disabled?: boolean;
  /**
   * To control the field passed from children whether should be fullWidth.
   */
  fullWidth?: boolean;
  /**
   * The hint text to display below the input field.
   * Provides additional information or guidance to the user.
   */
  hintText?: string;
  /**
   * The icon to display alongside the hint text.
   */
  hintTextIcon?: IconDefinition;
  /**
   * Whether to display the hint text icon.
   * When false, neither the custom icon nor the default severity icon will be shown.
   * @default true
   */
  showHintTextIcon?: boolean;
  /**
   * The label text for the form field.
   */
  label?: string;
  /**
   * The icon to display next to the label.
   * When provided, displays an icon that shows a tooltip on hover.
   */
  labelInformationIcon?: IconDefinition;
  /**
   * The tooltip text to display when hovering over the label information icon.
   * Only shown when labelInformationIcon is provided.
   */
  labelInformationText?: string;
  /**
   * Optional marker text to display after the label.
   * Typically used to show "(optional)" or similar text.
   */
  labelOptionalMarker?: string;
  /**
   * The spacing variant for the label area.
   * Controls the padding and min-height of the label.
   * Only applicable when layout is 'horizontal' or 'stretch'.
   * Ignored when layout is 'vertical'.
   * @default FormFieldLabelSpacing.MAIN
   */
  labelSpacing?: FormFieldLabelSpacing;
  /**
   * The layout variant of the form field.
   * Controls the arrangement direction of label and input.
   * When set to 'vertical', density and labelSpacing are ignored.
   * @default FormFieldLayout.HORIZONTAL
   */
  layout?: FormFieldLayout;
  /**
   * The density variant of the form field.
   * Controls the width of label and max-width of data entry.
   * Only applicable when layout is 'horizontal' or 'stretch'.
   * Ignored when layout is 'vertical'.
   */
  density?: FormFieldDensity;
  /**
   * The name attribute for the form field.
   * Used to identify the field in form submissions and as htmlFor in the label.
   */
  name: string;
  /**
   * To control the field passed from children whether should be required.
   */
  required?: boolean;
  /**
   * The severity level of the form field.
   * Used to indicate the importance or urgency of the field.
   * @default 'info'
   */
  severity?: SeverityWithInfo;
}

/**
 * 表單欄位容器元件，整合標籤、提示文字與錯誤狀態。
 *
 * 透過 `FormControlContext` 將 `disabled`、`required`、`severity` 等狀態向下傳遞給子元件。
 * 支援水平、垂直與延伸三種排版方式，並可選擇性顯示字數計數器與提示文字圖示。
 * 當 `disabled` 為 `true` 時，提示訊息將不會顯示。
 *
 * @example
 * ```tsx
 * import FormField from '@mezzanine-ui/react/Form';
 * import { TextField } from '@mezzanine-ui/react/TextField';
 *
 * // 基本水平排版
 * <FormField name="username" label="使用者名稱">
 *   <TextField placeholder="請輸入使用者名稱" />
 * </FormField>
 *
 * // 帶有錯誤提示的垂直排版
 * <FormField
 *   name="email"
 *   label="電子郵件"
 *   layout="vertical"
 *   severity="error"
 *   hintText="電子郵件格式不正確"
 * >
 *   <TextField placeholder="請輸入電子郵件" />
 * </FormField>
 *
 * // 帶有字數計數器
 * <FormField name="bio" label="自我介紹" counter="50/200">
 *   <TextField placeholder="請輸入自我介紹" />
 * </FormField>
 * ```
 *
 * @see {@link FormLabel} 表單標籤元件
 * @see {@link FormHintText} 表單提示文字元件
 * @see {@link FormControlContext} 表單控制狀態 Context
 */
const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(props, ref) {
    const {
      children,
      className,
      counter,
      counterColor,
      controlFieldSlotColumns,
      controlFieldSlotLayout = ControlFieldSlotLayout.MAIN,
      density,
      disabled = false,
      fullWidth = false,
      hintText,
      hintTextIcon,
      showHintTextIcon,
      label,
      labelInformationIcon,
      labelInformationText,
      labelOptionalMarker,
      labelSpacing = FormFieldLabelSpacing.MAIN,
      layout = FormFieldLayout.HORIZONTAL,
      name,
      required = false,
      severity = 'info',
      ...rest
    } = props;
    const formControl: FormControl = {
      disabled,
      fullWidth,
      required,
      severity,
    };

    const shouldApplyDensity = density && layout !== FormFieldLayout.VERTICAL;
    const densityClass = shouldApplyDensity
      ? classes.density(density)
      : undefined;

    const shouldApplyLabelSpacing = layout !== FormFieldLayout.VERTICAL;
    const labelSpacingClass = shouldApplyLabelSpacing
      ? classes.labelSpacing(labelSpacing)
      : undefined;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.layout(layout),
          densityClass,
          {
            [classes.disabled]: disabled,
            [classes.fullWidth]: fullWidth,
          },
          className,
        )}
      >
        <FormControlContext.Provider value={formControl}>
          {label && (
            <FormLabel
              className={cx(classes.labelArea, labelSpacingClass)}
              htmlFor={name}
              informationIcon={labelInformationIcon}
              informationText={labelInformationText}
              labelText={label}
              optionalMarker={labelOptionalMarker}
            />
          )}
          <div className={cx(classes.dataEntry)}>
            <div
              className={cx(
                `${classes.controlFieldSlot}--${controlFieldSlotLayout}`,
                controlFieldSlotColumns
                  ? classes.controlFieldSlotColumns(controlFieldSlotColumns)
                  : undefined,
              )}
            >
              {children}
            </div>
            {hintText || hintTextIcon || counter ? (
              <div
                className={cx(classes.hintTextAndCounterArea, {
                  [classes.hintTextAndCounterArea + '--align-right']:
                    !(hintText || hintTextIcon) && counter,
                })}
              >
                {(hintText || hintTextIcon) && (
                  <FormHintText
                    hintText={hintText}
                    hintTextIcon={hintTextIcon}
                    severity={severity}
                    showHintTextIcon={showHintTextIcon}
                  />
                )}
                {counter && (
                  <span
                    className={cx(
                      classes.counter,
                      classes.counterColor(
                        counterColor || FormFieldCounterColor.INFO,
                      ),
                    )}
                  >
                    {counter}
                  </span>
                )}
              </div>
            ) : null}
          </div>
        </FormControlContext.Provider>
      </div>
    );
  },
);

export default FormField;
