import { ReactElement } from 'react';
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

interface DescriptionContentBaseProps {
  className?: string;
  children: string;
  size?: DescriptionSize;
  type?: DescriptionContentType;
}

interface DescriptionContentWithClickableIcon {
  icon: IconDefinition;
  onClickIcon: VoidFunction;
}

interface DescriptionContentWithoutClickableIcon {
  icon?: IconDefinition;
  onClickIcon?: undefined;
}

export type DescriptionContentProps =
  | (DescriptionContentBaseProps & DescriptionContentWithClickableIcon)
  | (DescriptionContentBaseProps & DescriptionContentWithoutClickableIcon);

export interface DescriptionGroupProps {
  className?: string;
  children: ReactElement[];
  orientation?: DescriptionOrientation;
  widthType?: Extract<DescriptionWidthType, 'narrow' | 'wide' | 'stretch'>;
}
