'use client';

import {
  forwardRef,
  MouseEvent,
  KeyboardEvent,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
  isValidElement,
} from 'react';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { AccordionControlContext } from './AccordionControlContext';
import { flattenChildren } from '../utils/flatten-children';
import AccordionActions, { AccordionActionsProps } from './AccordionActions';
import { Rotate } from '../Transition';

export interface AccordionTitleProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * Custom ChevronRight icon className.
   */
  iconClassName?: string;
  /**
   * Custom suffix actions.
   */
  actions?: AccordionActionsProps;
}

const resolveChildren = (children: ReactNode) => {
  const mainPartChildren: ReactNode[] = [];
  const actionsChildren: ReactNode[] = [];

  flattenChildren(children).forEach((child) => {
    if (isValidElement(child) && child.type === AccordionActions) {
      actionsChildren.push(child);
    } else {
      mainPartChildren.push(child);
    }
  });

  return { mainPartChildren, actionsChildren };
};

const AccordionTitle = forwardRef<HTMLDivElement, AccordionTitleProps>(
  function AccordionTitle(props, ref) {
    const {
      className,
      children,
      iconClassName: iconClassNameProp,
      actions: suffixActions,
      ...rest
    } = props;

    const { contentId, disabled, expanded, toggleExpanded } =
      useContext(AccordionControlContext) || {};

    const onToggle = useCallback(
      (e: MouseEvent | KeyboardEvent) => {
        e.stopPropagation();

        if (typeof toggleExpanded === 'function' && !disabled) {
          toggleExpanded(!expanded);
        }
      },
      [disabled, expanded, toggleExpanded],
    );

    const ariaProps = useMemo(() => {
      let result: React.AriaAttributes = {
        'aria-expanded': expanded,
      };

      if (contentId) {
        result = {
          ...result,
          'aria-controls': contentId,
        };
      }

      return result;
    }, [contentId, expanded]);

    const { mainPartChildren, actionsChildren } = useMemo(
      () => resolveChildren(children),
      [children],
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.title,
          {
            [classes.titleExpanded]: expanded,
            [classes.titleDisabled]: disabled,
          },
          className,
        )}
      >
        <button
          className={classes.titleMainPart}
          disabled={disabled}
          onClick={onToggle}
          type="button"
          {...ariaProps}
        >
          <Rotate in={expanded} degrees={-90}>
            <Icon
              size={16}
              className={cx(
                classes.titleIcon,
                {
                  [classes.titleIconDisabled]: disabled,
                },
                iconClassNameProp,
              )}
              icon={ChevronRightIcon}
            />
          </Rotate>

          {mainPartChildren}
        </button>
        {suffixActions ? (
          <AccordionActions {...suffixActions} />
        ) : (
          actionsChildren
        )}
      </div>
    );
  },
);

export default AccordionTitle;
