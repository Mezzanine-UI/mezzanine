import { stepperPrefix } from './stepper';

export const stepPrefix = `${stepperPrefix}-step`;
export const stepClasses = {
  host: stepPrefix,
  completedIcon: `${stepPrefix}__completed-icon`,
  iconBackground: `${stepPrefix}__icon-background`,
  title: `${stepPrefix}__title`,
  disabled: `${stepPrefix}--disabled`,
  tail: `${stepPrefix}__tail`,
} as const;
