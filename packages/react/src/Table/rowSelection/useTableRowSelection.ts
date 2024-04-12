import { TableRowSelection, TableDataSource } from '@mezzanine-ui/core/table';
import xor from 'lodash/xor';
import { useControlValueState } from '../../Form/useControlValueState';
import { useLastCallback } from '../../hooks/useLastCallback';

const equalityFn = (a: string[], b: string[]) => {
  const sortedA = a.sort();
  const sortedB = b.sort();

  return sortedA.length === sortedB.length && sortedA.every((v, idx) => v === sortedB[idx]);
};

export const SELECTED_ALL_KEY = 'MZN-TABLE-ROW-SELECTION-ALL';

export interface UseTableRowSelection extends Omit<TableRowSelection, 'actions'> {
  dataSource: TableDataSource[];
}

export function useTableRowSelection(props: UseTableRowSelection) {
  const {
    selectedRowKey: selectedRowKeyProp,
    onChange: onChangeProp,
    disabledRowKeys = [],
    dataSource,
  } = props;

  const [selectedRowKey, setSelectedRowKey] = useControlValueState({
    defaultValue: [],
    equalityFn,
    value: selectedRowKeyProp,
  });

  const onChange = useLastCallback<(v: string) => void>((rowKey) => {
    if (!dataSource.length) return;

    const allSourceKeys = dataSource.map((source) => (source.key || source.id) as string);
    const validSourceKeys = xor(disabledRowKeys, allSourceKeys);
    let nextSelectedRowKey = selectedRowKey;

    if (rowKey === SELECTED_ALL_KEY) {
      if (equalityFn(selectedRowKey, validSourceKeys)) {
        nextSelectedRowKey = [];
      } else {
        nextSelectedRowKey = validSourceKeys;
      }
    } else {
      const existedRowKeyIdx = selectedRowKey.findIndex((key) => key === rowKey);

      if (~existedRowKeyIdx) {
        nextSelectedRowKey = [
          ...selectedRowKey.slice(0, existedRowKeyIdx),
          ...selectedRowKey.slice(existedRowKeyIdx + 1),
        ];
      } else {
        nextSelectedRowKey = [
          ...selectedRowKey,
          rowKey,
        ];
      }
    }

    setSelectedRowKey(nextSelectedRowKey);

    if (onChangeProp) {
      onChangeProp(nextSelectedRowKey);
    }
  });

  return [selectedRowKey, onChange] as const;
}
