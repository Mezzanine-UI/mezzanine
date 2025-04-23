import {
  forwardRef,
  useState,
  useCallback,
  useMemo,
  Children,
  ReactElement,
} from 'react';
import { accordionClasses as classes } from '@mezzanine-ui/core/accordion';
import { AccordionControlContext } from './AccordionControlContext';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';

export interface AccordionProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'onChange'> {
  /**
   * If true, expands the accordion by default.
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * If true, the accordion will be displayed in a disabled state.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, expands the accordion, otherwise collapse it. Setting this prop enables control over the accordion.
   */
  expanded?: boolean;
  /**
   * Callback fired when the expand/collapse state is changed.
   */
  onChange?(e: boolean): void;
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(props, ref) {
    const {
      className,
      children: childrenProp,
      defaultExpanded = false,
      disabled = false,
      expanded: expandedProp,
      onChange,
      ...rest
    } = props;

    const [expanded, toggleExpanded] = useState<boolean>(
      defaultExpanded || false,
    );

    const onToggleExpanded = useCallback(
      (newStatus: boolean) => {
        if (typeof onChange === 'function') {
          onChange(newStatus);
        } else {
          toggleExpanded(newStatus);
        }
      },
      [onChange],
    );

    const [summary, ...children] = Children.toArray(childrenProp);

    const contextValue = useMemo(
      () => ({
        detailsId: (summary as ReactElement<any>)?.props?.id
          ? `${(summary as ReactElement<any>).props.id}-details`
          : undefined,
        disabled,
        expanded: expandedProp || expanded,
        summaryId: (summary as ReactElement<any>)?.props?.id,
        toggleExpanded: onToggleExpanded,
      }),
      [disabled, expandedProp, expanded, onToggleExpanded, summary],
    );

    return (
      <div {...rest} ref={ref} className={cx(classes.host, className)}>
        <AccordionControlContext.Provider value={contextValue}>
          {summary}
          {children}
        </AccordionControlContext.Provider>
      </div>
    );
  },
);

export default Accordion;
