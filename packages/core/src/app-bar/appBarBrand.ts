import { appBarPrefix } from './appBar';

export const appBarBrandPrefix = `${appBarPrefix}-brand` as const;

export const appBarBrandClasses = {
  host: appBarBrandPrefix,
} as const;
