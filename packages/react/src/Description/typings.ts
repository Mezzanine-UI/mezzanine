import { IconDefinition } from '@mezzanine-ui/icons';
import { BadgeDotVariant } from '@mezzanine-ui/core/badge';
import {
  DescriptionWidthType,
  DescriptionSize,
  DescriptionContentVariant,
  DescriptionOrientation,
} from '@mezzanine-ui/core/description';
import { Placement } from '@floating-ui/react-dom';
import { BadgeProps } from '../Badge/typings';
import { ButtonProps } from '../Button';
import { ProgressProps } from '../Progress';

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
  variant?: Extract<
    DescriptionContentVariant,
    'normal' | 'statistic' | 'trend-up' | 'trend-down'
  >;
  icon?: never;
  onClickIcon?: never;
}

interface DescriptionContentWithClickableIcon {
  className?: string;
  children: string;
  size?: DescriptionSize;
  variant: Extract<DescriptionContentVariant, 'with-icon'>;
  icon: IconDefinition;
  onClickIcon?: VoidFunction;
}

export type DescriptionContentProps =
  | DescriptionContentBaseProps
  | DescriptionContentWithClickableIcon;

export interface DescriptionProps {
  className?: string;
  contentProps:
    | DescriptionContentProps
    | {
        variant: Extract<DescriptionContentVariant, 'badge'>;
        badge: BadgeProps;
      }
    | {
        variant: Extract<DescriptionContentVariant, 'button'>;
        button: ButtonProps;
      }
    | {
        variant: Extract<DescriptionContentVariant, 'progress'>;
        progress: ProgressProps;
      };
  orientation?: DescriptionOrientation;
  titleProps: DescriptionTitleProps;
}
