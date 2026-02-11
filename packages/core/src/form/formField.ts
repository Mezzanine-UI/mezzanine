import {
  CheckedFilledIcon,
  DangerousFilledIcon,
  InfoFilledIcon,
  WarningFilledIcon,
} from '@mezzanine-ui/icons';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { formPrefix } from './form';
import { IconDefinition } from '@mezzanine-ui/icons';

export enum FormFieldCounterColor {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum FormFieldLayout {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
  STRETCH = 'stretch',
}

export enum FormFieldLabelSpacing {
  MAIN = 'main',
  SUB = 'sub',
}

export enum FormFieldDensity {
  BASE = 'base',
  TIGHT = 'tight',
  NARROW = 'narrow',
  WIDE = 'wide',
}

export enum ControlFieldSlotLayout {
  MAIN = 'main',
  SUB = 'sub',
}

export const formFieldPrefix = `${formPrefix}-field`;

export const formHintIcons: Record<SeverityWithInfo, IconDefinition> = {
  success: CheckedFilledIcon,
  warning: WarningFilledIcon,
  error: DangerousFilledIcon,
  info: InfoFilledIcon,
};

export const formFieldClasses = {
  host: formFieldPrefix,
  counter: `${formFieldPrefix}__counter`,
  counterColor: (color: FormFieldCounterColor) =>
    `${formFieldPrefix}__counter--${color}`,
  controlFieldSlot: `${formFieldPrefix}__control-field-slot`,
  dataEntry: `${formFieldPrefix}__data-entry`,
  density: (density: FormFieldDensity) => `${formFieldPrefix}--${density}`,
  disabled: `${formFieldPrefix}--disabled`,
  fullWidth: `${formFieldPrefix}--full-width`,
  hintText: `${formFieldPrefix}__hint-text`,
  hintTextColor: (severity: SeverityWithInfo) =>
    `${formFieldPrefix}__hint-text--${severity}`,
  hintTextIcon: `${formFieldPrefix}__hint-text__icon`,
  hintTextAndCounterArea: `${formFieldPrefix}__hint-text-and-counter-area`,
  hintTextSeverity: (severity: SeverityWithInfo) =>
    `${formFieldPrefix}__hint-text--${severity}`,
  label: `${formFieldPrefix}__label`,
  labelArea: `${formFieldPrefix}__label-area`,
  labelColon: `${formFieldPrefix}__label__colon`,
  labelOptionalMarker: `${formFieldPrefix}__label__optional-marker`,
  labelInformationIcon: `${formFieldPrefix}__label__information-icon`,
  labelRequiredMarker: `${formFieldPrefix}__label__required-marker`,
  labelSpacing: (spacing: FormFieldLabelSpacing) =>
    `${formFieldPrefix}__label-area--${spacing}`,
  layout: (layout: FormFieldLayout) => `${formFieldPrefix}--${layout}`,
} as const;
