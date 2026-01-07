'use client';

import { forwardRef } from 'react';
import { CaretUpIcon, CaretDownIcon } from '@mezzanine-ui/icons';
import { descriptionClasses as classes } from '@mezzanine-ui/core/description';
import { cx } from '../utils/cx';
import Icon from '../Icon';
import { DescriptionContentProps } from '.';

const DescriptionContent = forwardRef<HTMLDivElement, DescriptionContentProps>(
  function DescriptionContent(props, ref) {
    const {
      className,
      children,
      icon,
      onClickIcon,
      size = 'main',
      type = 'normal',
    } = props;

    return (
      <div
        className={cx(
          classes.contentHost,
          classes.contentType(type),
          classes.contentSize(size),
          className,
        )}
        ref={ref}
      >
        {type === 'trend-up' && <Icon icon={CaretUpIcon} size={16} />}
        {type === 'trend-down' && <Icon icon={CaretDownIcon} size={16} />}
        <span>{children}</span>
        {icon && <Icon icon={icon} size={16} onClick={onClickIcon} />}
      </div>
    );
  },
);

export default DescriptionContent;
