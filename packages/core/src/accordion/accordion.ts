export const accordionPrefix = 'mzn-accordion';

export const accordionClasses = {
  host: accordionPrefix,
  size: (size: 'main' | 'sub') => `${accordionPrefix}--${size}`,
  title: `${accordionPrefix}__title`,
  titleExpanded: `${accordionPrefix}__title--expanded`,
  titleDisabled: `${accordionPrefix}__title--disabled`,
  titleIcon: `${accordionPrefix}__title__icon`,
  titleIconDisabled: `${accordionPrefix}__title__icon--disabled`,
  titleIconExpanded: `${accordionPrefix}__title__icon--expanded`,
  titleMainPart: `${accordionPrefix}__title__mainPart`,
  titleActions: `${accordionPrefix}__title__actions`,
  content: `${accordionPrefix}__content`,
};

export const accordionGroupPrefix = 'mzn-accordion-group';

export const accordionGroupClasses = {
  host: accordionGroupPrefix,
};
