import { useEffect, useMemo } from 'react';
import { TableFetchMore, TableDataSource } from '@mezzanine-ui/core/table';
import { useControlValueState } from '../Form/useControlValueState';
import { useLastCallback } from '../hooks/useLastCallback';
import { usePreviousValue } from '../hooks/usePreviousValue';

const equalityFn = (a: boolean, b: boolean) => a === b;

export interface UseTableFetchMore extends TableFetchMore {
  dataSource: TableDataSource[];
  disabled?: boolean;
}

export function useTableFetchMore(props: UseTableFetchMore) {
  const {
    callback: callbackProp,
    dataSource,
    disabled = false,
    isReachEnd: isReachEndProp,
    isFetching: isFetchingProp,
  } = props;

  /** reach end indicator */
  const [isReachEnd] = useControlValueState({
    defaultValue: false,
    equalityFn,
    value: isReachEndProp,
  });

  /** fetching indicator */
  const [isFetching, setFetching] = useControlValueState({
    defaultValue: false,
    equalityFn,
    value: isFetchingProp,
  });

  const onFetching = useLastCallback<(f: boolean) => void>((newState) => {
    if (!equalityFn(isFetching, newState)) setFetching(newState);
  });

  /** fetchMore called */
  const onFetchMore = useLastCallback<() => void>(() => {
    if (!isFetching && !isReachEnd) {
      (callbackProp as (() => any))();
      onFetching(true);
    }

    if (isReachEnd) onFetching(false);
  });

  const fetchMore = (callbackProp && !disabled ? onFetchMore : undefined);

  /** check source length and reset states */
  const prevSourceLength = usePreviousValue(dataSource.length);
  const currentSourceLength = useMemo(() => dataSource.length, [dataSource.length]);

  useEffect(() => {
    if (prevSourceLength !== currentSourceLength) {
      onFetching(false);
    }
  }, [prevSourceLength, currentSourceLength]);

  return {
    fetchMore,
    isFetching,
    isReachEnd,
  } as const;
}
