import { Orientation } from '@mezzanine-ui/system/orientation';
import { GeneralSize } from '@mezzanine-ui/system/size';

export type DescriptionSize = Extract<GeneralSize, 'main' | 'sub'>;
/**
 * Description 標題欄位的寬度類型。
 * - `'narrow'` — 窄幅
 * - `'wide'` — 寬幅
 * - `'stretch'` — 延伸填滿
 * - `'hug'` — 依內容收縮
 */
export type DescriptionWidthType = 'narrow' | 'wide' | 'stretch' | 'hug';
export type DescriptionContentVariant =
  | 'badge'
  | 'button'
  | 'normal'
  | 'progress'
  | 'statistic'
  | 'tags'
  | 'trend-up'
  | 'trend-down'
  | 'with-icon';
export type DescriptionOrientation = Orientation;

export const descriptionPrefix = 'mzn-description';
export const descriptionTitlePrefix = 'mzn-description-title';
export const descriptionContentPrefix = 'mzn-description-content';
export const descriptionGroupPrefix = 'mzn-description-group';

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
  // group
  groupHost: descriptionGroupPrefix,
} as const;
