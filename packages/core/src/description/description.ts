import { GeneralSize } from '@mezzanine-ui/system/size';

export type DescriptionSize = Extract<GeneralSize, 'main' | 'sub'>;
export type DescriptionWidthType = 'narrow' | 'wide' | 'stretch' | 'hug';

export const descriptionTitlePrefix = 'mzn-description-title';
export const descriptionContentPrefix = 'mzn-description-content';

export const descriptionClasses = {
  titleHost: descriptionTitlePrefix,
  titleText: `${descriptionTitlePrefix}__text`,
  titleWidth: (width: DescriptionWidthType) =>
    `${descriptionTitlePrefix}--${width}`,
  contentHost: descriptionContentPrefix,
} as const;
