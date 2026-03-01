'use client';

import { forwardRef } from 'react';
import {
  IconDefinition,
  CaretUpIcon,
  CaretDownIcon,
} from '@mezzanine-ui/icons';
import {
  DescriptionContentVariant,
  descriptionClasses as classes,
} from '@mezzanine-ui/core/description';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { useDescriptionContext } from './DescriptionContext';

interface DescriptionContentBaseProps {
  /**
   * Custom class name for content
   */
  className?: string;
  /**
   * Content text
   */
  children: string;
  /**
   * Define the style and behavior of the content
   * @default 'normal'
   */
  variant?: Extract<
    DescriptionContentVariant,
    'normal' | 'statistic' | 'trend-up' | 'trend-down'
  >;
  /**
   * Custom icon rendered after the content text
   */
  icon?: never;
  /**
   * Click handler for the icon.
   */
  onClickIcon?: never;
}

interface DescriptionContentWithClickableIcon {
  className?: string;
  children: string;
  variant: Extract<DescriptionContentVariant, 'with-icon'>;
  icon: IconDefinition;
  onClickIcon?: VoidFunction;
}

export type DescriptionContentProps =
  | DescriptionContentBaseProps
  | DescriptionContentWithClickableIcon;

const DescriptionContent = forwardRef<HTMLSpanElement, DescriptionContentProps>(
  function DescriptionContent(props, ref) {
    const {
      className,
      children,
      icon,
      onClickIcon,
      variant = 'normal',
    } = props;

    const { size } = useDescriptionContext();

    return (
      <span
        className={cx(
          classes.contentHost,
          classes.contentVariant(variant),
          classes.contentSize(size),
          className,
        )}
        ref={ref}
      >
        {variant === 'trend-up' && (
          <Icon
            className={classes.contentTrendUp}
            icon={CaretUpIcon}
            size={16}
          />
        )}
        {variant === 'trend-down' && (
          <Icon
            className={classes.contentTrendDown}
            icon={CaretDownIcon}
            size={16}
          />
        )}
        {children}
        {variant === 'with-icon' && icon && (
          <Icon
            className={classes.contentIcon}
            icon={icon}
            size={16}
            onClick={onClickIcon}
          />
        )}
      </span>
    );
  },
);

export default DescriptionContent;
