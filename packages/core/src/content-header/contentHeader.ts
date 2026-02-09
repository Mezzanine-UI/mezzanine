export const contentHeaderPrefix = 'mzn-content-header';

export type ResponsiveBreakpoint =
  | 'above1080px'
  | 'above680px'
  | 'below1080px'
  | 'below680px'
  | 'between680and1080px';

type ContentHeaderSize = 'main' | 'sub';

export const contentHeaderClasses = {
  host: contentHeaderPrefix,
  breakpoint: (breakpoint: ResponsiveBreakpoint) =>
    `${contentHeaderPrefix}--${breakpoint}`,
  size: (size: ContentHeaderSize) => `${contentHeaderPrefix}--${size}`,
  titleArea: `${contentHeaderPrefix}__title-area`,
  textGroup: `${contentHeaderPrefix}__text-group`,
  actionArea: `${contentHeaderPrefix}__action-area`,
  utilities: `${contentHeaderPrefix}__utilities`,
  backButton: `${contentHeaderPrefix}__back-button`,
} as const;
