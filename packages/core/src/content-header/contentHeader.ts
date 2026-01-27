export const contentHeaderPrefix = 'mzn-content-header';

type ContentHeaderSize = 'main' | 'sub';

export const contentHeaderClasses = {
  host: contentHeaderPrefix,
  size: (size: ContentHeaderSize) => `${contentHeaderPrefix}--${size}`,
  titleArea: `${contentHeaderPrefix}__title-area`,
  textGroup: `${contentHeaderPrefix}__text-group`,
  actionArea: `${contentHeaderPrefix}__action-area`,
  utilities: `${contentHeaderPrefix}__utilities`,
  backButton: `${contentHeaderPrefix}__back-button`,
} as const;
