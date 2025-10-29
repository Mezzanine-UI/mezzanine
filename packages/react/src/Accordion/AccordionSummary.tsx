'use client';

import {
  forwardRef,
  MouseEvent,
  KeyboardEvent,
  useContext,
  useMemo,
  useCallback,
  ReactNode,
  type JSX,
} from 'react';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { AccordionControlContext } from './AccordionControlContext';

export interface AccordionSummaryProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * custom chevronDown icon className
   */
  iconClassName?: string;
  /**
   * custom prefix icon element when `suffixActions` prop is given
   */
  prefixIcon?: JSX.Element;
  /**
   * custom suffix actions
   */
  suffixActions?: ReactNode;
}

const AccordionSummary = forwardRef<HTMLDivElement, AccordionSummaryProps>(
  function AccordionSummary(props, ref) {
    const {
      className,
      children,
      iconClassName: iconClassNameProp,
      prefixIcon,
      suffixActions,
      ...rest
    } = props;

    const { detailsId, disabled, expanded, toggleExpanded } =
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

      if (detailsId) {
        result = {
          ...result,
          'aria-controls': detailsId,
        };
      }

      return result;
    }, [detailsId, expanded]);

    const defaultIconElement = useMemo(
      () => (
        <Icon
          color={disabled ? 'neutral-faint' : 'neutral'}
          className={cx(
            classes.summaryIcon,
            {
              [classes.summaryIconExpanded]: expanded,
              [classes.summaryIconDisabled]: disabled,
            },
            iconClassNameProp,
          )}
          icon={ChevronDownIcon}
          onClick={onToggle}
          onMouseDown={(evt) => evt.preventDefault()}
          role="button"
        />
      ),
      [disabled, expanded, iconClassNameProp, onToggle],
    );

    const defaultIconWithPrefixClassName = useMemo(
      () => (
        <Icon
          color={disabled ? 'neutral-faint' : 'neutral'}
          className={cx(
            classes.summaryIcon,
            {
              [classes.summaryIconExpanded]: expanded,
              [classes.summaryIconDisabled]: disabled,
            },
            classes.summaryMainPartPrefix,
            iconClassNameProp,
          )}
          icon={ChevronDownIcon}
          onClick={onToggle}
          onMouseDown={(evt) => evt.preventDefault()}
          role="button"
        />
      ),
      [disabled, expanded, iconClassNameProp, onToggle],
    );

    return (
      <div
        {...rest}
        {...ariaProps}
        ref={ref}
        className={cx(
          classes.summary,
          {
            [classes.summaryDisabled]: disabled,
          },
          className,
        )}
        onClick={onToggle}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className={classes.summaryMainPart}>
          {suffixActions ? prefixIcon || defaultIconWithPrefixClassName : null}
          {children}
        </div>
        {suffixActions || defaultIconElement}
      </div>
    );
  },
);

export default AccordionSummary;
