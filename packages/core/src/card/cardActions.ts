
import { cardPrefix } from './card';

export const cardActionsPrefix = `${cardPrefix}-actions` as const;
export const cardActionsClasses = {
  host: cardActionsPrefix,
} as const;
