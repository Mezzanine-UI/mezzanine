'use client';

import { ComponentProps, forwardRef, ReactElement, useMemo } from 'react';

import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import Selection, { SelectionProps } from './Selection';

import { selectionClasses as classes } from '@mezzanine-ui/core/selection';

export interface SelectionGroupBaseProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * The class name of the selection group.
   */
  className?: string;
}

export interface SelectionGroupProps extends SelectionGroupBaseProps {
  /**
   * The selections in the group.
   * Only Selection components are allowed.
   * When provided, will take priority over selections prop.
   */
  children?:
  | ReactElement<ComponentProps<typeof Selection>>
  | ReactElement<ComponentProps<typeof Selection>>[];
  /**
   * The selections array.
   * When provided, Selection components will be automatically rendered.
   * Will be ignored if children is provided.
   */
  selections?: SelectionProps[];
}

/**
 * The react component for `mezzanine` selection group.
 */
const SelectionGroup = forwardRef<HTMLDivElement, SelectionGroupProps>(
  function SelectionGroup(props, ref) {
    const { className, ...rest } = props;

    const hasSelections = 'selections' in rest && rest.selections !== undefined;
    const hasChildren = 'children' in rest && rest.children !== undefined;

    const renderedChildren = useMemo(() => {
      // Children take priority over selections
      if (hasChildren) {
        return rest.children;
      }

      if (hasSelections && rest.selections) {
        return rest.selections.map((selectionProps, index) => (
          <Selection key={selectionProps.value || index} {...selectionProps} />
        ));
      }

      return null;
    }, [hasSelections, hasChildren, rest]);

    const divProps = hasSelections
      ? (() => {
        const { selections: _selections, ...otherProps } = rest;
        return otherProps;
      })()
      : rest;

    return (
      <div
        ref={ref}
        {...divProps}
        className={cx(classes.group, className)}
      >
        {renderedChildren}
      </div>
    );
  },
);

export default SelectionGroup;