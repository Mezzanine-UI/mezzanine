import {
  useMemo,
  RefObject,
  useContext,
} from 'react';
import { TablePagination, TableDataSource } from '@mezzanine-ui/core/table';
import { useControlValueState } from '../../Form/useControlValueState';
import { useLastCallback } from '../../hooks/useLastCallback';
import { TableContext } from '../TableContext';

const equalityFn = (a: number, b: number) => a === b;

export interface UseTablePagination extends Omit<TablePagination, 'show'> {
  bodyRef: RefObject<HTMLDivElement>;
  dataSource: TableDataSource[];
}

export function useTablePagination(props: UseTablePagination) {
  const {
    bodyRef,
    current: currentProp,
    dataSource,
    onChange: onChangeProp,
    options: optionsProp,
    total: totalProp = 1,
  } = props || {};

  const {
    boundaryCount = 1,
    className,
    disabled = false,
    hideNextButton = false,
    hidePreviousButton = false,
    pageSize: pageSizeProp,
    siblingCount = 1,
  } = optionsProp || {};

  const {
    sorting,
  } = useContext(TableContext) || {};

  const [current, setCurrent] = useControlValueState({
    defaultValue: 1,
    equalityFn,
    value: currentProp,
  });

  const onChange = useLastCallback<(c: number) => void>((newCurrent) => {
    if (!equalityFn(current, newCurrent)) setCurrent(newCurrent);

    /** reset body scroll position when page changed */
    bodyRef?.current?.scrollTo(0, 0);
    /** reset sorting status */
    sorting?.onResetAll?.();

    onChangeProp?.(newCurrent);
  });

  const defaultOptions = useMemo(() => ({
    boundaryCount,
    className,
    disabled,
    hideNextButton,
    hidePreviousButton,
    pageSize: pageSizeProp ?? dataSource?.length,
    siblingCount,
    total: totalProp ?? dataSource?.length,
  }), [
    boundaryCount,
    className,
    disabled,
    dataSource,
    hideNextButton,
    hidePreviousButton,
    pageSizeProp,
    siblingCount,
    totalProp,
  ]);

  return [current, onChange, defaultOptions] as const;
}
