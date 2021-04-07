import { appBarPrefix } from './appBar';

export const appBarSupportPrefix = `${appBarPrefix}-support` as const;

export const appBarSupportClasses = {
  host: appBarSupportPrefix,
} as const;
