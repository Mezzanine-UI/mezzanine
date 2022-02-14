import { useState, useCallback } from 'react';
import { TableDataSource, TableColumn, TableRecord } from '@mezzanine-ui/core/table';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { useControlValueState } from '../../Form/useControlValueState';
import { useLastCallback } from '../../hooks/useLastCallback';

const sortSource = (prev: TableDataSource, cur: TableDataSource) => {
  const prevKey = (prev.key || prev.id) as string;
  const curKey = (cur.key || cur.id) as string;

  if (prevKey < curKey) return -1;
  if (prevKey > curKey) return 1;

  return 0;
};

const equalityFn = (a: TableDataSource[], b: TableDataSource[]) => {
  const sortedA = a.slice(0).sort(sortSource);
  const sortedB = b.slice(0).sort(sortSource);
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
    value: dataSourceProp,
  });

  const getNextSortedType = useCallback((currentType) => {
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
  'dataIndex' | 'sorter' | 'onSorted'>
  ) => void>(
    (opts) => {
      const { dataIndex, sorter, onSorted } = opts;
      const isChosenFromOneToAnother = sortedOn && dataIndex !== sortedOn;
      const nextSortedType = getNextSortedType(isChosenFromOneToAnother ? 'none' : sortedType);

      const onMappingSources = (sources: TableDataSource[]) => {
        setDataSource(sources);

        onSorted?.(dataIndex, nextSortedType);
      };

      // only apply changes when column sorter is given
      if (typeof sorter === 'function' || typeof onSorted === 'function') {
        // should update next sorted type first

        setSortedType(nextSortedType);

        switch (nextSortedType) {
          case 'desc':
          case 'asc': {
            // update current working dataIndex
            setSortedOn(dataIndex);

            // getting new source instance (when switch between sorter, should use origin dataSource)
            let newSource = (isChosenFromOneToAnother ? dataSourceProp : dataSource).slice(0);

            if (typeof sorter === 'function') {
              // sort by given sorter
              newSource = newSource.sort((a, b) => (
                // reverse result when sorted type is ascending
                (sorter(get(a, dataIndex), get(b, dataIndex))) * (nextSortedType === 'asc' ? -1 : 1)
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

  return [dataSource, onChange, { sortedOn, sortedType, onResetAll }] as const;
}
