import { ReactElement, ReactNode } from 'react';
import { IconDefinition } from '@mezzanine-ui/icons';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import {
  DescriptionWidthType,
  DescriptionSize,
  DescriptionContentType,
  DescriptionOrientation,
} from '@mezzanine-ui/core/description';
import { Placement } from '@floating-ui/react-dom';

interface DescriptionTitleBaseProps {
  badge?: BadgeDotVariant;
  className?: string;
  children: string;
  widthType?: DescriptionWidthType;
}

interface DescriptionTitleWithTooltip {
  icon: IconDefinition;
  tooltip: string;
  tooltipPlacement?: Placement;
}

interface DescriptionTitleWithoutTooltip {
  icon?: IconDefinition;
  tooltip?: undefined;
  tooltipPlacement?: undefined;
}

export type DescriptionTitleProps =
  | (DescriptionTitleBaseProps & DescriptionTitleWithTooltip)
  | (DescriptionTitleBaseProps & DescriptionTitleWithoutTooltip);

export interface DescriptionContentProps {
  className?: string;
  children: string;
  prefix?: ReactNode;
  size?: DescriptionSize;
  suffix?: ReactNode;
  type?: DescriptionContentType;
}

export interface DescriptionGroupProps {
  className?: string;
  children: ReactElement[];
  orientation?: DescriptionOrientation;
  widthType?: Extract<DescriptionWidthType, 'narrow' | 'wide' | 'stretch'>;
}
