export const cardGroupPrefix = 'mzn-card-group';
export const baseCardPrefix = 'mzn-base-card';
export const quickActionCardPrefix = 'mzn-quick-action-card';
export const thumbnailCardPrefix = 'mzn-thumbnail-card';
export const thumbnailCardInfoPrefix = 'mzn-thumbnail-card-info';
export const singleThumbnailCardPrefix = 'mzn-single-thumbnail-card';

export const cardClasses = {
  /** group */
  group: cardGroupPrefix,
  groupQuickAction: `${cardGroupPrefix}--quick-action`,

  /** base card */
  base: baseCardPrefix,
  baseDisabled: `${baseCardPrefix}--disabled`,
  baseReadOnly: `${baseCardPrefix}--read-only`,
  baseHeader: `${baseCardPrefix}__header`,
  baseHeaderContentWrapper: `${baseCardPrefix}__header__content-wrapper`,
  baseHeaderTitle: `${baseCardPrefix}__header__content-wrapper__title`,
  baseHeaderDescription: `${baseCardPrefix}__header__content-wrapper__description`,
  baseHeaderAction: `${baseCardPrefix}__header__action`,
  baseContent: `${baseCardPrefix}__content`,

  /** quick action card */
  quickAction: quickActionCardPrefix,
  quickActionDisabled: `${quickActionCardPrefix}--disabled`,
  quickActionReadOnly: `${quickActionCardPrefix}--read-only`,
  quickActionIcon: `${quickActionCardPrefix}__icon`,
  quickActionContent: `${quickActionCardPrefix}__content`,
  quickActionTitle: `${quickActionCardPrefix}__content__title`,
  quickActionSubtitle: `${quickActionCardPrefix}__content__subtitle`,
  quickActionVertical: `${quickActionCardPrefix}--vertical`,
};
