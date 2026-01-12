'use client';

import { forwardRef, useMemo } from 'react';
import { cx } from '../utils/cx';
import {
  DescriptionContentVariant,
  DescriptionOrientation,
  descriptionClasses as classes,
} from '@mezzanine-ui/core/description';
import DescriptionTitle, { DescriptionTitleProps } from './DescriptionTitle';
import DescriptionContent, {
  DescriptionContentProps,
} from './DescriptionContent';
import { BadgeProps } from '../Badge/typings';
import Badge from '../Badge';
import Button, { ButtonProps } from '../Button';
import Progress, { ProgressProps } from '../Progress';
import { TagProps } from '../Tag/typings';
import Tag from '../Tag';
import TagGroup from '../Tag/TagGroup';

type DistributiveOmit<T, K extends PropertyKey> = T extends any
  ? Omit<T, K>
  : never;

export type DescriptionProps = DistributiveOmit<
  DescriptionTitleProps,
  'className' | 'children'
> & {
  /**
   * Custom class name for description
   */
  className?: string;
  /**
   * Defines what is rendered as the description content
   */
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
      }
    | {
        variant: Extract<DescriptionContentVariant, 'tags'>;
        tags: TagProps[];
      };
  /**
   * Define the layout direction between the title and the content
   * @default 'horizontal'
   */
  orientation?: DescriptionOrientation;
  /**
   * title text for description
   */
  title: string;
};

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      className,
      contentProps,
      orientation = 'horizontal',
      title,
      ...rest
    } = props;

    const contentComponent = useMemo(() => {
      switch (contentProps.variant) {
        case 'badge':
          return <Badge {...contentProps.badge} />;

        case 'button':
          return <Button {...contentProps.button} />;

        case 'progress':
          return <Progress {...contentProps.progress} />;

        case 'tags':
          return (
            <TagGroup>
              {contentProps.tags.map((tagProps, index) => (
                <Tag key={`${tagProps.label}-${index}`} {...tagProps} />
              ))}
            </TagGroup>
          );

        default:
          return <DescriptionContent {...contentProps} />;
      }
    }, [contentProps]);

    return (
      <div
        className={cx(
          classes.host,
          classes.orientation(orientation),
          className,
        )}
        ref={ref}
      >
        <DescriptionTitle {...rest}>{title}</DescriptionTitle>
        {contentComponent}
      </div>
    );
  },
);

export default Description;
