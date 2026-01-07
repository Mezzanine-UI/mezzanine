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
      }
    | {
        variant: Extract<DescriptionContentVariant, 'tags'>;
        tags: TagProps[];
      };
  orientation?: DescriptionOrientation;
  titleProps: DescriptionTitleProps;
}

const Description = forwardRef<HTMLDivElement, DescriptionProps>(
  function Description(props, ref) {
    const {
      className,
      contentProps,
      orientation = 'horizontal',
      titleProps,
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
              {contentProps.tags.map((tagProps) => (
                <Tag key={tagProps.label} {...tagProps} />
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
        <DescriptionTitle {...titleProps} />
        {contentComponent}
      </div>
    );
  },
);

export default Description;
