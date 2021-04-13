import { appBarPrefix } from './appBar';

export const appBarMainPrefix = `${appBarPrefix}-main` as const;

export const appBarMainClasses = {
  host: appBarMainPrefix,
} as const;
