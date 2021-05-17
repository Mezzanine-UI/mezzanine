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
    total: totalProp,
  } = props;

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
    if (!equalityFn(current, newCurrent)) {
      setCurrent(newCurrent);
      /** reset body scroll position when page changed */
      bodyRef.current?.scrollTo(0, 0);
      /** reset sorting status */
      sorting?.onResetAll?.();
    }

    onChangeProp?.(newCurrent);
  });

  const pageSize = useMemo(() => (
    pageSizeProp ?? dataSource.length
  ), [pageSizeProp, dataSource.length]);

  const total = useMemo(() => (
    totalProp ?? (dataSource.length / pageSize)
  ), [totalProp, dataSource.length, pageSize]);

  const defaultOptions = useMemo(() => ({
    boundaryCount,
    className,
    disabled,
    hideNextButton,
    hidePreviousButton,
    pageSize,
    siblingCount,
    total,
  }), [
    boundaryCount,
    className,
    disabled,
    hideNextButton,
    hidePreviousButton,
    siblingCount,
  ]);

  return [current, onChange, defaultOptions] as const;
}
