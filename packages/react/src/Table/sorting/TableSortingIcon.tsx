'use client';

import { forwardRef, useContext, useMemo } from 'react';
import {
  tableClasses as classes,
  TableColumn,
  TableRecord,
} from '@mezzanine-ui/core/table';
import { IconColor } from '@mezzanine-ui/core/icon';
import { ArrowRightIcon } from '@mezzanine-ui/icons';
import { TableContext } from '../TableContext';
import { NativeElementPropsWithoutKeyAndRef } from '../../utils/jsx-types';
import { cx } from '../../utils/cx';
import { SortedType } from './useTableSorting';
import Icon from '../../Icon';

export interface TableSortingIconProps
  extends NativeElementPropsWithoutKeyAndRef<'i'> {
  /**
   * current table column
   */
  column: TableColumn<TableRecord<unknown>>;
}

const TableSortingIcon = forwardRef<HTMLElement, TableSortingIconProps>(
  function TableSortingIcon(props, ref) {
    const { className, column, ...rest } = props;

    const uniqueId = useMemo(
      () => `${crypto.getRandomValues(new Uint32Array(5))[0]}`,
      [],
    );

    const { sorting } = useContext(TableContext) || {};

    const { key = uniqueId } = column;

    /** styling */
    const currentType = (
      key === sorting?.sortedOn ? sorting.sortedType : 'none'
    ) as SortedType;
    const currentIconStyle: { color: IconColor; style: { transform: string } } =
      useMemo(
        () => ({
          color: currentType === 'none' ? 'secondary' : 'primary',
          style: {
            transform: `rotate(${90 * (currentType === 'asc' ? -1 : 1)}deg)`,
          },
        }),
        [currentType],
      );

    return (
      <Icon
        {...rest}
        ref={ref}
        className={cx(classes.icon, classes.iconClickable, className)}
        color={currentIconStyle.color}
        icon={ArrowRightIcon}
        onClick={(evt) => {
          evt.stopPropagation();

          sorting?.onSort?.({
            ...column,
            key,
          });
        }}
        style={currentIconStyle.style}
      />
    );
  },
);

export default TableSortingIcon;
