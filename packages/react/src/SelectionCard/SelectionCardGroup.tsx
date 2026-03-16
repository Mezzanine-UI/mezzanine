'use client';

import { ComponentProps, forwardRef, ReactElement, useMemo } from 'react';

import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import SelectionCard, { SelectionCardProps } from './SelectionCard';

import { selectionCardClasses as classes } from '@mezzanine-ui/core/selection-card';

export interface SelectionCardGroupBaseProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * The class name of the selection group.
   */
  className?: string;
}

export interface SelectionCardGroupProps extends SelectionCardGroupBaseProps {
  /**
   * The selections in the group.
   * Only SelectionCard components are allowed.
   * When provided, will take priority over selections prop.
   */
  children?:
  | ReactElement<ComponentProps<typeof SelectionCard>>
  | ReactElement<ComponentProps<typeof SelectionCard>>[];
  /**
   * The selections array.
   * When provided, SelectionCard components will be automatically rendered.
   * Will be ignored if children is provided.
   */
  selections?: SelectionCardProps[];
}

/**
 * The react component for `mezzanine` selection card group.
 */
const SelectionCardGroup = forwardRef<HTMLDivElement, SelectionCardGroupProps>(
  function SelectionCardGroup(props, ref) {
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
          <SelectionCard key={selectionProps.value || index} {...selectionProps} />
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

export default SelectionCardGroup;
