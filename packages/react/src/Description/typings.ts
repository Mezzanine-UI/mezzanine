import { IconDefinition } from '@mezzanine-ui/icons';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import {
  DescriptionWidthType,
  DescriptionSize,
  DescriptionContentVariant,
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
  variant?: DescriptionContentVariant;
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

export interface DescriptionProps {
  className?: string;
  contentProps: DescriptionContentProps;
  orientation?: DescriptionOrientation;
  titleProps: DescriptionTitleProps;
}
