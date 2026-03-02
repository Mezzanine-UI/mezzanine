import { forwardRef } from 'react';
import {
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
 * The React component for `mezzanine` form field.
 */
const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(props, ref) {
    const {
      children,
      className,
      counter,
      counterColor,
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
