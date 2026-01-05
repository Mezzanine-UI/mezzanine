import { GeneralSize } from '@mezzanine-ui/system/size';

export type DescriptionSize = Extract<GeneralSize, 'main' | 'sub'>;

export const descriptionPrefix = 'mzn-description';

export const descriptionClasses = {
  host: descriptionPrefix,
} as const;
