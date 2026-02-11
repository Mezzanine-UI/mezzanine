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
  groupSingleThumbnail: `${cardGroupPrefix}--single-thumbnail`,

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

  /** thumbnail card (shared) */
  thumbnail: thumbnailCardPrefix,
  thumbnailTag: `${thumbnailCardPrefix}__tag`,
  thumbnailPersonalAction: `${thumbnailCardPrefix}__personal-action`,

  /** single thumbnail card */
  singleThumbnail: singleThumbnailCardPrefix,
  singleThumbnailOverlay: `${singleThumbnailCardPrefix}__overlay`,

  /** thumbnail card info */
  thumbnailInfo: thumbnailCardInfoPrefix,
  thumbnailInfoMain: `${thumbnailCardInfoPrefix}__main`,
  thumbnailInfoFiletype: `${thumbnailCardInfoPrefix}__main__filetype`,
  thumbnailInfoContent: `${thumbnailCardInfoPrefix}__main__content`,
  thumbnailInfoTitle: `${thumbnailCardInfoPrefix}__main__content__title`,
  thumbnailInfoSubtitle: `${thumbnailCardInfoPrefix}__main__content__subtitle`,
  thumbnailInfoAction: `${thumbnailCardInfoPrefix}__action`,
};
