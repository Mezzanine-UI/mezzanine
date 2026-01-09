import { forwardRef } from 'react';
import {
  formFieldClasses as classes,
  FormFieldCounterColor,
  FormFieldSize,
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
   * The label text for the form field.
   */
  label: string;
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
   * The name attribute for the form field.
   * Used to identify the field in form submissions and as htmlFor in the label.
   */
  name: string;
  /**
   * To control the field passed from children whether should be required.
   */
  required?: boolean;
  /**
   * The size variant of the form field.
   * Controls the layout and spacing of label, input, and other elements.
   */
  size: FormFieldSize;
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
      disabled = false,
      fullWidth = false,
      hintText,
      hintTextIcon,
      label,
      labelInformationIcon,
      labelInformationText,
      labelOptionalMarker,
      name,
      required = false,
      size,
      severity = 'info',
      ...rest
    } = props;
    const formControl: FormControl = {
      disabled,
      fullWidth,
      required,
      severity,
    };

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          classes.size(size),
          {
            [classes.disabled]: disabled,
            [classes.fullWidth]: fullWidth,
          },
          className,
        )}
      >
        <FormControlContext.Provider value={formControl}>
          <FormLabel
            className={classes.labelArea}
            htmlFor={name}
            informationIcon={labelInformationIcon}
            informationText={labelInformationText}
            labelText={label}
            optionalMarker={labelOptionalMarker}
          />
          <div className={cx(classes.dataEntry)}>
            {children}
            <div className={cx(classes.hintTextAndCounterArea)}>
              {(hintText || hintTextIcon) && (
                <FormHintText
                  hintText={hintText}
                  hintTextIcon={hintTextIcon}
                  severity={severity}
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
          </div>
        </FormControlContext.Provider>
      </div>
    );
  },
);

export default FormField;
