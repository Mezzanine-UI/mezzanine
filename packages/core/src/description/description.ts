import { Orientation } from '@mezzanine-ui/system/orientation';
import { GeneralSize } from '@mezzanine-ui/system/size';

export type DescriptionSize = Extract<GeneralSize, 'main' | 'sub'>;
export type DescriptionWidthType = 'narrow' | 'wide' | 'stretch' | 'hug';
export type DescriptionOrientation = Orientation;

export const descriptionTitlePrefix = 'mzn-description-title';
export const descriptionContentPrefix = 'mzn-description-content';
export const descriptionGroupPrefix = 'mzn-description-group';

export const descriptionClasses = {
  // title
  titleHost: descriptionTitlePrefix,
  titleText: `${descriptionTitlePrefix}__text`,
  titleWidth: (width: DescriptionWidthType) =>
    `${descriptionTitlePrefix}--${width}`,
  // content
  contentHost: descriptionContentPrefix,
  // group
  groupHost: descriptionGroupPrefix,
} as const;
