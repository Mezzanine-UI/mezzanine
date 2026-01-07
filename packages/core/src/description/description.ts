import { Orientation } from '@mezzanine-ui/system/orientation';
import { GeneralSize } from '@mezzanine-ui/system/size';

export type DescriptionSize = Extract<GeneralSize, 'main' | 'sub'>;
export type DescriptionWidthType = 'narrow' | 'wide' | 'stretch' | 'hug';
export type DescriptionContentVariant =
  | 'badge'
  | 'button'
  | 'normal'
  | 'progress'
  | 'statistic'
  | 'tag'
  | 'trend-up'
  | 'trend-down'
  | 'with-icon';
export type DescriptionOrientation = Orientation;

export const descriptionPrefix = 'mzn-description';
export const descriptionTitlePrefix = 'mzn-description-title';
export const descriptionContentPrefix = 'mzn-description-content';

export const descriptionClasses = {
  // host
  host: descriptionPrefix,
  orientation: (orientation: DescriptionOrientation) =>
    `${descriptionPrefix}--${orientation}`,
  // title
  titleHost: descriptionTitlePrefix,
  titleText: `${descriptionTitlePrefix}__text`,
  titleWidth: (width: DescriptionWidthType) =>
    `${descriptionTitlePrefix}--${width}`,
  // content
  contentHost: descriptionContentPrefix,
  contentIcon: `${descriptionContentPrefix}__icon`,
  contentTrendUp: `${descriptionContentPrefix}__trend-up`,
  contentTrendDown: `${descriptionContentPrefix}__trend-down`,
  contentVariant: (variant: DescriptionContentVariant) =>
    `${descriptionContentPrefix}--${variant}`,
  contentSize: (size: DescriptionSize) =>
    `${descriptionContentPrefix}--${size}`,
} as const;
