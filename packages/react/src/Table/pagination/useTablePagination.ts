import { RefObject, useContext } from 'react';
import { TablePagination } from '@mezzanine-ui/core/table';
import { useControlValueState } from '../../Form/useControlValueState';
import { useLastCallback } from '../../hooks/useLastCallback';
import { TableContext } from '../TableContext';

const equalityFn = (a: number, b: number) => a === b;

export interface UseTablePagination {
  bodyRef: RefObject<HTMLDivElement | null>;
  current?: TablePagination['current'];
  onChange?: TablePagination['onChange'];
}

export function useTablePagination(props: UseTablePagination) {
  const { bodyRef, current: currentProp, onChange: onChangeProp } = props;

  const { sorting } = useContext(TableContext) || {};

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

  return [current, onChange] as const;
}
