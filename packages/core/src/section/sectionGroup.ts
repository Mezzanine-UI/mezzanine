import { sectionPrefix } from './section';

export const sectionGroupPrefix = `${sectionPrefix}-group` as const;

export const sectionGroupClasses = {
  host: sectionGroupPrefix,
  hostHorizontal: `${sectionGroupPrefix}--horizontal`,
} as const;
