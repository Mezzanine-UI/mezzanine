'use client';

import { Children, ComponentPropsWithoutRef, forwardRef, ReactElement, useCallback, useMemo, useState } from 'react';
import { cx } from '../utils/cx';

import { filterAreaClasses as classes, FilterAreaActionsAlign, FilterAreaSize } from '@mezzanine-ui/core/filter-area';
import { ChevronDownIcon, ChevronUpIcon } from '@mezzanine-ui/icons';

import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import Button from '../Button';
import { FilterLineProps } from './FilterLine';

export interface FilterAreaProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children' | 'onSubmit' | 'onReset'> {
  /**
   * The alignment of the actions.
   * @default 'end'
   */
  actionsAlign?: FilterAreaActionsAlign;
  /**
   * The content of the filter area, must be FilterLine component(s).
   */
  children: ReactElement<FilterLineProps> | ReactElement<FilterLineProps>[];
  /**
   * Whether the form has been modified from its initial state.
   * When false, the reset button will be disabled.
   * @default true
   */
  isDirty?: boolean;
  /**
   * Callback function triggered when the form is reset.
   * Used to clear all filter conditions and restore to initial state.
   */
  onReset?: () => void;
  /**
   * Callback function triggered when the form is submitted.
   * FilterArea itself does not manage form state; the parent component should collect
   * filter values and handle submission logic. If using react-hook-form, values will be
   * handled through FormProvider's handleSubmit.
   */
  onSubmit?: () => void;
  /**
   * The text of the reset button.
   */
  resetText?: string;
  /**
   * The size of the filter area.
   * @default 'main'
   */
  size?: FilterAreaSize;
  /**
   * The text of the submit button.
   */
  submitText?: string;
  /**
   * The type of the reset button.
   * @default 'button'
   */
  resetButtonType?: ComponentPropsWithoutRef<'button'>['type'];
  /**
   * The type of the submit button.
   * @default 'button'
   */
  submitButtonType?: ComponentPropsWithoutRef<'button'>['type'];
}

const FilterArea = forwardRef<HTMLDivElement, FilterAreaProps>(
  function FilterArea(props, ref) {
    const {
      actionsAlign = 'end',
      children,
      className,
      isDirty = true,
      onReset,
      onSubmit,
      resetText = 'Reset',
      size = 'main',
      submitText = 'Search',
      resetButtonType = 'button',
      submitButtonType = 'button',
      ...rest
    } = props;

    const filterLines = useMemo(
      () => Children.toArray(children) as ReactElement<FilterLineProps>[],
      [children],
    );
    const hasMultipleLines = filterLines.length > 1;
    const [expanded, setExpanded] = useState(false);

    const handleToggleExpanded = useCallback(() => {
      setExpanded((prev) => !prev);
    }, []);

    const handleSubmit = useCallback(() => {
      if (onSubmit) {
        onSubmit();
      }
    }, [onSubmit]);

    const renderAction = () => {
      return (
        <div className={cx(
          classes.actions,
          classes.actionsAlign(actionsAlign),
          { [classes.actionsExpanded]: expanded },
        )}>
          <Button
            onClick={handleSubmit}
            size={size}
            type={submitButtonType}
          >
            {submitText}
          </Button>
          <Button
            disabled={!isDirty}
            onClick={onReset}
            size={size}
            type={resetButtonType}
            variant="base-secondary"
          >
            {resetText}
          </Button>
          {hasMultipleLines && (
            <Button
              aria-expanded={expanded}
              aria-label={expanded ? 'Collapse filters' : 'Expand filters'}
              icon={expanded ? ChevronUpIcon : ChevronDownIcon}
              iconType="icon-only"
              onClick={handleToggleExpanded}
              size={size}
              title={expanded ? 'Collapse filters' : 'Expand filters'}
              type="button"
              variant="base-ghost"
            />
          )}
        </div>
      );
    };

    const firstLine = filterLines[0];

    return (
      <div
        {...rest}
        ref={ref}
        className={cx(
          classes.host,
          className,
          {
            [classes.size(size)]: size,
          },
        )}
      >
        {expanded ? (
          <>
            {filterLines}
            <div className={classes.row}>
              {renderAction()}
            </div>
          </>
        ) : (
          <>
            {firstLine && (
              <div className={classes.row}>
                {firstLine}
                {renderAction()}
              </div>
            )}
          </>
        )}
      </div>
    );
  },
);

export default FilterArea;

