'use client';

import { forwardRef, ReactElement, useMemo } from 'react';

import { filterAreaClasses as classes } from '@mezzanine-ui/core/filter-area';

import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import { FilterProps } from './Filter';

export interface FilterLineProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * The content of the filter line, must be Filter component(s).
   */
  children: ReactElement<FilterProps> | ReactElement<FilterProps>[];
}

const FilterLine = forwardRef<HTMLDivElement, FilterLineProps>(
  function FilterLine(props, ref) {
    const { className, children, ...rest } = props;

    const lineClassName = useMemo(
      () => cx(classes.line, className),
      [className],
    );

    return (
      <div {...rest} ref={ref} className={lineClassName}>
        {children}
      </div>
    );
  },
);

export default FilterLine;

