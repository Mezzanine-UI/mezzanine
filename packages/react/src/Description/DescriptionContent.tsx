'use client';

import { forwardRef } from 'react';
import { CaretUpIcon, CaretDownIcon } from '@mezzanine-ui/icons';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { DescriptionContentProps } from '.';

const DescriptionContent = forwardRef<HTMLSpanElement, DescriptionContentProps>(
  function DescriptionContent(props, ref) {
    const {
      className,
      children,
      icon,
      onClickIcon,
      size = 'main',
      variant = 'normal',
    } = props;

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
        {icon && (
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
