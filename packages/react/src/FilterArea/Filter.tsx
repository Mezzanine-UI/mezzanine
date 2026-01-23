'use client';

import { forwardRef, ReactElement, useMemo } from 'react';

import {
  filterAreaClasses as classes,
  FilterAlign,
  filterAreaPrefix,
  FilterSpan,
} from '@mezzanine-ui/core/filter-area';

import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import { FormFieldProps } from '../Form';

export interface FilterProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * Layout control - Vertical alignment of the field.
   * @default 'stretch'
   */
  align?: FilterAlign;
  /**
   * The content of the filter field.
   */
  children: ReactElement<FormFieldProps> | ReactElement<FormFieldProps>[];
  /**
   * Layout control - Whether the field should automatically expand to fill the entire row (equivalent to span={12}).
   * @default false
   */
  grow?: boolean;
  /**
   * Layout control - Minimum width of the field.
   */
  minWidth?: string | number;
  /**
   * Layout control - Number of columns the field occupies in the Grid (1-12, Grid has 12 columns total).
   * This property is ignored when grow is true.
   * @default 2
   */
  span?: FilterSpan;
}

const Filter = forwardRef<HTMLDivElement, FilterProps>(
  function Filter(props, ref) {
    const {
      align = 'stretch',
      children,
      className,
      grow = false,
      minWidth,
      span = 2,
      ...rest
    } = props;

    const filterClassName = useMemo(
      () =>
        cx(
          classes.filter,
          {
            [classes.filterGrow]: grow,
            [classes.filterAlign(align)]: align,
          },
          className,
        ),
      [align, className, grow],
    );

    const style = useMemo(
      () => ({
        ...(minWidth && { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }),
        ...(!grow && {
          [`--${filterAreaPrefix}-filter-span`]: span,
        }),
        ...rest.style,
      }),
      [grow, minWidth, rest.style, span],
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={filterClassName}
        style={style}
      >
        {children}
      </div>
    );
  },
);

export default Filter;

