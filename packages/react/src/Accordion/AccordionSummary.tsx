import {
  forwardRef,
  MouseEvent,
  KeyboardEvent,
  useContext,
  useMemo,
} from 'react';
import { IconDefinition, ChevronDownIcon } from '@mezzanine-ui/icons';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { AccordionControlContext } from './AccordionControlContext';

export interface AccordionSummaryProps
  extends
  NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * custom expandIcon
   */
  expandIcon?: IconDefinition;
}

const AccordionSummary = forwardRef<HTMLDivElement, AccordionSummaryProps>(function AccordionSummary(props, ref) {
  const {
    className,
    children,
    expandIcon,
    ...rest
  } = props;

  const {
    detailsId,
    disabled,
    expanded,
    toggleExpanded,
  } = useContext(AccordionControlContext) || {};

  const onToggle = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation();

    if (typeof toggleExpanded === 'function' && !disabled) {
      toggleExpanded(!expanded);
    }
  };

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
      {children}
      {expandIcon || (
        <Icon
          color={disabled ? 'disabled' : 'primary'}
          className={cx(
            classes.summaryIcon,
            {
              [classes.summaryIconExpanded]: expanded,
              [classes.summaryIconDisabled]: disabled,
            },
          )}
          icon={ChevronDownIcon}
          onClick={onToggle}
          onMouseDown={(evt) => evt.preventDefault()}
          role="button"
        />
      )}
    </div>
  );
});

export default AccordionSummary;
