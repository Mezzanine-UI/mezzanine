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
   * custom chevronDown icon className
   */
  iconClassName?: string;
  /**
   * custom suffix actions
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

    const onKeyDown = (e: KeyboardEvent<Element>) => {
      switch (e.code) {
        case 'Enter':
          onToggle(e);

          break;

        default:
          break;
      }
    };

    const ariaProps = useMemo(() => {
      let result: any = {
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
        {...ariaProps}
        ref={ref}
        className={cx(
          classes.title,
          {
            [classes.titleDisabled]: disabled,
          },
          className,
        )}
      >
        <button
          onClick={onToggle}
          onKeyDown={onKeyDown}
          type="button"
          className={classes.titleMainPart}
        >
          <Rotate in={expanded} degrees={-90}>
            <Icon
              size={16}
              className={cx(
                classes.titleIcon,
                {
                  // [classes.titleIconExpanded]: expanded,
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
