export const cardPrefix = 'mzn-card';

export const cardClasses = {
  host: cardPrefix,
  meta: `${cardPrefix}__meta`,
  content: `${cardPrefix}__metaContent`,
  header: `${cardPrefix}__metaContentHeader`,
  actions: `${cardPrefix}__metaActions`,
} as const;
