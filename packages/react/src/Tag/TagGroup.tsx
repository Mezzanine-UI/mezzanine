import {
  Children,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
} from 'react';
import OverflowCounterTag, {
  OverflowCounterTagProps,
} from '../OverflowTooltip/OverflowCounterTag';
import Tag, { TagProps } from '../Tag';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { TransitionGroup } from 'react-transition-group';
import { Fade, TransitionImplementationChildProps } from '../Transition';
import { cx } from '../utils/cx';

const isTagElement = (child: ReactNode): child is TagElement =>
  isValidElement(child) && child.type === Tag;

const isOverflowCounterElement = (
  child: ReactNode,
): child is OverflowCounterTagElement =>
  isValidElement(child) && child.type === OverflowCounterTag;

const fadeProps = {
  duration: {
    enter: MOTION_DURATION.fast,
    exit: MOTION_DURATION.fast,
  },
  easing: {
    enter: MOTION_EASING.standard,
    exit: MOTION_EASING.standard,
  },
};

type TagElement = ReactElement<
  TagProps & TransitionImplementationChildProps,
  typeof Tag
>;

type OverflowCounterTagElement = ReactElement<
  OverflowCounterTagProps & TransitionImplementationChildProps,
  typeof OverflowCounterTag
>;

type TagGroupChild = TagElement | OverflowCounterTagElement;

export type TagGroupProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'div'>,
  'children'
> & {
  children: TagGroupChild | TagGroupChild[];
  transition?: 'fade' | 'none';
};

const TagGroup = forwardRef<HTMLDivElement, TagGroupProps>(function TagGroup(
  { className, children, transition = 'none', ...rest },
  ref,
) {
  const hasInvalidChild = Children.toArray(children).some((child) => {
    if (!isTagElement(child) && !isOverflowCounterElement(child)) {
      console.error('<TagGroup> only accepts <Tag> or <OverflowCounterTag>');

      return true;
    }

    return false;
  });

  if (hasInvalidChild) {
    return null;
  }

  return (
    <div {...rest} ref={ref} className={cx(classes.group, className)}>
      {transition === 'fade' ? (
        <TransitionGroup component={null}>
          {Children.map(children, (child, index) => (
            <Fade {...fadeProps} key={child.key ?? index}>
              <span>{child}</span>
            </Fade>
          ))}
        </TransitionGroup>
      ) : (
        Children.map(children, (child, index) => (
          <span key={child.key ?? index}>{child}</span>
        ))
      )}
    </div>
  );
});

export default TagGroup;
