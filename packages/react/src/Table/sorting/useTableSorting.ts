import { useState, useCallback, useEffect } from 'react';
import { TableDataSource, TableColumn, TableRecord } from '@mezzanine-ui/core/table';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { useControlValueState } from '../../Form/useControlValueState';
import { useLastCallback } from '../../hooks/useLastCallback';
import { usePreviousValue } from '../../hooks/usePreviousValue';

const sortSource = (prev: TableDataSource, cur: TableDataSource) => {
  const prevKey = (prev.key || prev.id) as string;
  const curKey = (cur.key || cur.id) as string;

  if (prevKey < curKey) return -1;
  if (prevKey > curKey) return 1;

  return 0;
};

/**
 * @NOTE deepCompare = true 時，會深度比較 dataSource 順序是否有不同
 * @NOTE deepCompare = false（預設），則是為了內部排序可以讓 useControlValueState 認為是一樣的 dataSource
 * useControlValueState 會強制把 return value 和傳入的 value 做同步，當有不一樣時就會自動 sync
 * 所以無論如何用 setDataSource 都不會有改變
 */
const equalityFn = (a: TableDataSource[], b: TableDataSource[], deepCompare = false) => {
  const aTemp = a.slice(0);
  const bTemp = b.slice(0);
  const sortedA = deepCompare ? aTemp : aTemp.sort(sortSource);
  const sortedB = deepCompare ? bTemp : bTemp.sort(sortSource);
  const mappedAKeys = sortedA.map((s) => (s.key || s.id) as string);
  const mappedBKeys = sortedB.map((s) => (s.key || s.id) as string);

  const isShallowEqual = mappedAKeys.length === mappedBKeys.length &&
    mappedAKeys.every((v, idx) => v === mappedBKeys[idx]);

  if (isShallowEqual) {
    // we need to do deep compare to sync dataSources
    return sortedA.every((v, idx) => isEqual(v, sortedB[idx]));
  }

  // since shallow equal checked that array is different, so we don't need do deep compare
  return false;
};

export interface UseTableSorting {
  dataSource: TableDataSource[];
}

export type SortedType = 'desc' | 'asc' | 'none';

export function useTableSorting(props: UseTableSorting) {
  const {
    dataSource: dataSourceProp,
  } = props;

  const [sortedOn, setSortedOn] = useState<string>('');
  const [sortedType, setSortedType] = useState<SortedType>('none');
  const [dataSource, setDataSource] = useControlValueState({
    defaultValue: [],
    equalityFn,
    /** @NOTE 只有當 dataSource 傳入時，並且使用了 table 提供的 sorting，才需要完全同步 dataSource */
    value: dataSourceProp.length && sortedOn ? dataSourceProp : undefined,
  });

  const prevDataSourceProps = usePreviousValue(dataSourceProp);

  useEffect(() => {
    /**
     * @NOTE 條件1: 如果一開始就有傳入值，則直接同步 dataSource
     * @NOTE 條件2: 深度比較舊 dataSourceProp 跟新的是否有不同，如果有則同步
     */
    if (!dataSource.length || !equalityFn(prevDataSourceProps, dataSourceProp, true)) {
      setDataSource(dataSourceProp);
    }
  }, [prevDataSourceProps, dataSourceProp]);

  const getNextSortedType = useCallback((currentType: SortedType) => {
    // none -> desc -> asc -> none
    if (currentType === 'none') return 'desc';
    if (currentType === 'desc') return 'asc';

    return 'none';
  }, []);

  const onReset = useCallback(() => setSortedOn(''), []);
  const onResetAll = useCallback(() => {
    setSortedOn('');
    setSortedType('none');
  }, []);

  const onChange = useLastCallback<(
  v: Pick<TableColumn<TableRecord<unknown>>,
  'key' | 'dataIndex' | 'sorter' | 'onSorted'>
  ) => void>(
    (opts) => {
      const { key = '', dataIndex, sorter, onSorted } = opts;
      const isChosenFromOneToAnother = sortedOn && key !== sortedOn;
      const nextSortedType = getNextSortedType(isChosenFromOneToAnother ? 'none' : sortedType);

      const onMappingSources = (sources: TableDataSource[]) => {
        setDataSource(sources);

        onSorted?.(key, nextSortedType);
      };

      // only apply changes when column sorter is given
      if (typeof sorter === 'function' || typeof onSorted === 'function') {
        // should update next sorted type first

        setSortedType(nextSortedType);

        switch (nextSortedType) {
          case 'desc':
          case 'asc': {
            // update current working key
            setSortedOn(key);

            // getting new source instance (when switch between sorter, should use origin dataSource)
            let newSource = (isChosenFromOneToAnother ? dataSourceProp : dataSource).slice(0);

            if (typeof sorter === 'function') {
              console.warn(
                'When using a `sorter` function, please provide the `dataIndex` to make sure it worked as expected.',
              );
              // sort by given sorter
              newSource = newSource.sort((a, b) => (
                // reverse result when sorted type is ascending
                (sorter(get(a, dataIndex || ''), get(b, dataIndex || ''))) * (nextSortedType === 'asc' ? -1 : 1)
              ));
            }

            // map back the data source
            onMappingSources(newSource);

            break;
          }

          case 'none':
          default: {
            onReset();
            onMappingSources(dataSourceProp);

            break;
          }
        }
      }
    },
    );

  return [dataSource, onChange, { sortedOn, sortedType, onResetAll, setDataSource }] as const;
}
