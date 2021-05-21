import { useState, useCallback } from 'react';
import { TableDataSource, TableColumn, TableRecord } from '@mezzanine-ui/core/table';
import { useControlValueState } from '../../Form/useControlValueState';
import { useLastCallback } from '../../hooks/useLastCallback';

const equalityFn = (a: TableDataSource[], b: TableDataSource[]) => {
  const sortedA = a.map((s) => (s.key || s.id)).sort();
  const sortedB = b.map((s) => (s.key || s.id)).sort();

  return sortedA.length === sortedB.length && sortedA.every((v, idx) => v === sortedB[idx]);
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

      const onMappingSources = (sources: TableDataSource[]) => {
        setDataSource(sources);

        onSorted?.(sources);
      };

      // only apply changes when column sorter is given
      if (typeof sorter === 'function') {
        // should update next sorted type first
        const isChosenFromOneToAnother = sortedOn && dataIndex !== sortedOn;
        const nextSortedType = getNextSortedType(isChosenFromOneToAnother ? 'none' : sortedType);

        setSortedType(nextSortedType);

        switch (nextSortedType) {
          case 'desc':
          case 'asc': {
            // update current working dataIndex
            setSortedOn(dataIndex);

            // getting new source instance (when switch between sorter, should use origin dataSource)
            let newSource = (isChosenFromOneToAnother ? dataSourceProp : dataSource).slice(0);

            // sort by given sorter
            newSource = newSource.sort((a, b) => (
              // reverse result when sorted type is ascending
              (sorter(a[dataIndex], b[dataIndex])) * (nextSortedType === 'asc' ? -1 : 1)
            ));

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
