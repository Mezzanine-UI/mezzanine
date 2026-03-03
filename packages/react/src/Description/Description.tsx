'use client';

import { cloneElement, forwardRef, isValidElement, ReactElement } from 'react';
import { cx } from '../utils/cx';
import {
  DescriptionOrientation,
  DescriptionSize,
  descriptionClasses as classes,
} from '@mezzanine-ui/core/description';
import DescriptionTitle, { DescriptionTitleProps } from './DescriptionTitle';
import { DescriptionContentProps } from './DescriptionContent';
import { DescriptionContext } from './DescriptionContext';
import { BadgeProps } from '../Badge/typings';
import { ButtonProps } from '../Button';
import { ProgressProps } from '../Progress';
import { TagGroupProps } from '../Tag/TagGroup';

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

export type DescriptionProps = DistributiveOmit<
  DescriptionTitleProps,
  'className' | 'children'
> & {
  /**
   * Defines what is rendered as the description content
   */
  children:
    | ReactElement<DescriptionContentProps>
    | ReactElement<BadgeProps>
    | ReactElement<ButtonProps>
    | ReactElement<ProgressProps>
    | ReactElement<TagGroupProps>;
  /**
   * Custom class name for description
   */
  className?: string;
  /**
   * Define the layout direction between the title and the content
   * @default 'horizontal'
   */
  orientation?: DescriptionOrientation;
  /**
   * Controls the text size of the description content
   * @default 'main'
   */
  size?: DescriptionSize;
  /**
   * title text for description
   */
  title: string;
};

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      children,
      className,
      orientation = 'horizontal',
      size = 'main',
      title,
      ...rest
    } = props;

    const injectedChildren = isValidElement(children)
      ? cloneElement(children as ReactElement<{ size?: DescriptionSize }>, {
          size: (children.props as { size?: DescriptionSize }).size ?? size,
        })
      : children;

    return (
      <DescriptionContext.Provider value={{ size }}>
        <div
          className={cx(
            classes.host,
            classes.orientation(orientation),
            className,
          )}
          ref={ref}
        >
          <DescriptionTitle {...rest}>{title}</DescriptionTitle>
          {injectedChildren}
        </div>
      </DescriptionContext.Provider>
    );
  },
);

export default Description;
