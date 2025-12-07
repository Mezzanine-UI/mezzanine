export const pageToolbarPrefix = 'mzn-page-toolbar';

type PageToolbarSize = 'main' | 'sub';

export const pageToolbarClasses = {
  host: pageToolbarPrefix,
  size: (size: PageToolbarSize) => `${pageToolbarPrefix}--${size}`,
} as const;
