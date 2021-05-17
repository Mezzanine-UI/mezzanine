export const cardPrefix = 'mzn-card';

export const cardClasses = {
  host: cardPrefix,
  meta: `${cardPrefix}__meta`,
  metaContents: `${cardPrefix}__metaContents`,
  metaContentsHeader: `${cardPrefix}__metaContentsHeader`,
} as const;
