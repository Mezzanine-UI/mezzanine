export const stepperPrefix = 'mzn-stepper';

export const stepperClasses = {
  host: stepperPrefix,

  // orientation
  horizontal: `${stepperPrefix}--horizontal`,
  vertical: `${stepperPrefix}--vertical`,

  // type
  dot: `${stepperPrefix}--dot`,
  number: `${stepperPrefix}--number`,
} as const;
