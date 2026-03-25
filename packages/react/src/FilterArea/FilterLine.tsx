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

/**
 * 篩選器中的單行條件列，包含一或多個 Filter 欄位。
 *
 * 透過 Grid 排版將 Filter 子元件橫向排列；
 * 需作為 FilterArea 的直接子元件使用。
 *
 * @example
 * ```tsx
 * import { Filter, FilterLine } from '@mezzanine-ui/react';
 *
 * <FilterLine>
 *   <Filter span={2}>...</Filter>
 *   <Filter span={3}>...</Filter>
 * </FilterLine>
 * ```
 *
 * @see {@link FilterArea} 管理多個 FilterLine 的容器元件
 * @see {@link Filter} 包裝單一篩選欄位的元件
 */
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

