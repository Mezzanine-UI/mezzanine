import { IconDefinition } from '@mezzanine-ui/icons';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';

export interface DescriptionTitleProps {
  badge?: BadgeDotVariant;
  className?: string;
  children: string;
  icon?: IconDefinition;
}
