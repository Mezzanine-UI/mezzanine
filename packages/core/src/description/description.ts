import { GeneralSize } from '@mezzanine-ui/system/size';

export type DescriptionSize = Extract<GeneralSize, 'main' | 'sub'>;

export const descriptionTitlePrefix = 'mzn-description-title';
export const descriptionContentPrefix = 'mzn-description-content';

export const descriptionClasses = {
  titleHost: descriptionTitlePrefix,
  titleText: `${descriptionTitlePrefix}__text`,
  contentHost: descriptionContentPrefix,
} as const;
