import { TypographySemanticType } from '../typography';

export const skeletonPrefix = 'mzn-skeleton';

export const skeletonClasses = {
  host: skeletonPrefix,
  bg: `${skeletonPrefix}--bg`,
  type: (type: TypographySemanticType) => `${skeletonPrefix}--strip--${type}`,
  circle: `${skeletonPrefix}--circle`,
} as const;
