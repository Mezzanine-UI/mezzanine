import type {
  ControlFieldSlotColumns,
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import type { IconDefinition } from '@mezzanine-ui/icons';
import type { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export interface FormFieldProps {
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
   * The density of the form field. Ignored in vertical layout.
   */
  density?: FormFieldDensity;
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
   * @default FormFieldLabelSpacing.MAIN
   */
  labelSpacing?: FormFieldLabelSpacing;
  /**
   * The layout of the form field.
   * @default FormFieldLayout.HORIZONTAL
   */
  layout?: FormFieldLayout;
  /**
   * The name of the field, used as the label's `for`.
   */
  name?: string;
  /**
   * Whether the field is required. Passed down through the form control.
   */
  required?: boolean;
  /**
   * The severity of form message.
   * @default 'info'
   */
  severity?: SeverityWithInfo;
  /**
   * Whether to display the hint text icon.
   * When false, neither the custom icon nor the default severity icon will be shown.
   * @default true
   */
  showHintTextIcon?: boolean;
}
