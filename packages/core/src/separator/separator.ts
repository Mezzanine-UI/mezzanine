export const separatorPrefix = 'mzn-separator';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export const separatorClasses = {
  host: separatorPrefix,
  horizontal: `${separatorPrefix}--horizontal`,
  vertical: `${separatorPrefix}--vertical`,
} as const;

