import {
  forwardRef,
  MouseEvent,
  KeyboardEvent,
  useContext,
  useMemo,
  ReactNode,
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
   * custom chevronDown icon className
   */
  iconClassName?: string;
  /**
   * custom prefix icon when `suffixActions` prop is given
   */
  prefixIcon?: IconDefinition;
  /**
   * custom suffix actions
   */
  suffixActions?: ReactNode;
}

const AccordionSummary = forwardRef<HTMLDivElement, AccordionSummaryProps>(function AccordionSummary(props, ref) {
  const {
    className,
    children,
    iconClassName: iconClassNameProp,
    prefixIcon,
    suffixActions,
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

  const DefaultIcon = (iconProps: { className?: string }) => {
    const { className: iconClassNames = '' } = iconProps;

    return (
      <Icon
        color={disabled ? 'disabled' : 'primary'}
        className={cx(
          classes.summaryIcon,
          {
            [classes.summaryIconExpanded]: expanded,
            [classes.summaryIconDisabled]: disabled,
          },
          iconClassNames,
          iconClassNameProp,
        )}
        icon={ChevronDownIcon}
        onClick={onToggle}
        onMouseDown={(evt) => evt.preventDefault()}
        role="button"
      />
    );
  };

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
        {suffixActions ? (prefixIcon || (
          <DefaultIcon className={classes.summaryMainPartPrefix} />
        )) : null}
        {children}
      </div>
      {suffixActions || (
        <DefaultIcon />
      )}
    </div>
  );
});

export default AccordionSummary;
