import { stepperPrefix } from './stepper';

export const stepPrefix = `${stepperPrefix}-step`;
export const stepClasses = {
  host: stepPrefix,

  // type
  dot: `${stepPrefix}--dot`,
  number: `${stepPrefix}--number`,

  // orientation
  horizontal: `${stepPrefix}--horizontal`,
  vertical: `${stepPrefix}--vertical`,

  // indicator icon
  statusIndicator: `${stepPrefix}__status-indicator`,
  statusIndicatorDot: `${stepPrefix}__status-indicator-dot`,

  // text
  textContainer: `${stepPrefix}__text-container`,
  title: `${stepPrefix}__title`,
  titleConnectLine: `${stepPrefix}__title-connect-line`,
  description: `${stepPrefix}__description`,

  // status
  processing: `${stepPrefix}--processing`,
  pending: `${stepPrefix}--pending`,
  succeeded: `${stepPrefix}--succeeded`,
  error: `${stepPrefix}--error`,
  processingError: `${stepPrefix}--processing-error`,

  // interactive
  interactive: `${stepPrefix}--interactive`,
} as const;
