import { computed, shallowRef } from 'vue';
import type { ComputedRef } from 'vue';
import {
  getRowKey,
  type TableDataSource,
  type TableRowSelectionCheckbox,
} from '@mezzanine-ui/core/table';

export interface UseTableRowSelectionProps<T extends TableDataSource> {
  /** The child rows a record carries, if any. */
  getSubData: (record: T) => T[] | undefined;
}

export interface UseTableRowSelectionReturn<T extends TableDataSource> {
  /** `onChange` for a child table, bound to its parent record. */
  getChildOnChange: (record: T) => TableRowSelectionCheckbox<T>['onChange'];
  /** The keys selected inside one parent record's child table. */
  getChildSelectedRowKeys: (record: T) => string[];
  /** `getCheckboxProps` for the parent table. */
  parentGetCheckboxProps: TableRowSelectionCheckbox<T>['getCheckboxProps'];
  /** `onChange` for the parent table. */
  parentOnChange: TableRowSelectionCheckbox<T>['onChange'];
  /** The keys selected in the parent table. */
  parentSelectedKeys: ComputedRef<string[]>;
  /** Parent rows plus child rows, counted together. */
  totalSelectionCount: ComputedRef<number>;
}

/**
 * 讓使用端管理「父列 + 展開後子表」兩層選取狀態的 composable。
 *
 * 父表的每個 key 底下記著它子表被選走的 key；父列因此會在子列部分選取時顯示
 * 半選、全部選取時顯示已選。全選／全不選會一併帶上所有子列。
 *
 * @example
 * ```ts
 * const {
 *   getChildOnChange,
 *   getChildSelectedRowKeys,
 *   parentGetCheckboxProps,
 *   parentOnChange,
 *   parentSelectedKeys,
 * } = useTableRowSelection<DataType>({ getSubData: (record) => record.subData });
 * ```
 *
 * @see MznTable 接收這些回呼的元件
 */
export function useTableRowSelection<
  T extends TableDataSource = TableDataSource,
>(props: UseTableRowSelectionProps<T>): UseTableRowSelectionReturn<T> {
  const { getSubData } = props;

  const selectedKeys = shallowRef<{ key: string; subKeys?: string[] }[]>([]);

  const parentSelectedKeys = computed((): string[] =>
    selectedKeys.value.map((item) => item.key),
  );

  const parentOnChange: TableRowSelectionCheckbox<T>['onChange'] = (
    _,
    selectedRow,
    selectedRows,
  ) => {
    const prev = selectedKeys.value;

    selectedKeys.value = selectedRows.map((row) => {
      const isCurrentSelectedRow = row.key === selectedRow?.key;
      const subData = getSubData(row);
      const pk = getRowKey(row);

      const subKeys = (() => {
        if (isCurrentSelectedRow) {
          return subData?.length
            ? subData.map((subRow) => getRowKey(subRow))
            : undefined;
        }

        if (!selectedRow) {
          // trigger select all or deselect all, need to find subKeys for all selected rows
          return subData?.length
            ? subData.map((subRow) => getRowKey(subRow))
            : undefined;
        }

        return prev.find((item) => item.key === pk)?.subKeys;
      })();

      return {
        key: pk,
        subKeys,
      };
    });
  };

  const parentGetCheckboxProps: TableRowSelectionCheckbox<T>['getCheckboxProps'] =
    (record: T) => {
      const subData = getSubData(record);
      const selectedItem = selectedKeys.value.find(
        (item) => item.key === getRowKey(record),
      );

      if (!subData?.length) {
        return {};
      }

      return {
        indeterminate:
          !!subData?.length &&
          selectedItem?.subKeys &&
          selectedItem.subKeys.length > 0 &&
          selectedItem.subKeys.length < subData.length,
        selected:
          subData?.length > 0 &&
          selectedItem?.subKeys &&
          selectedItem.subKeys.length === subData.length,
      };
    };

  const getChildOnChange =
    (record: T): TableRowSelectionCheckbox<T>['onChange'] =>
    (keys) => {
      const otherSelected = selectedKeys.value.filter(
        (item) => item.key !== getRowKey(record),
      );

      if (!keys.length) {
        selectedKeys.value = otherSelected;

        return;
      }

      selectedKeys.value = [
        ...otherSelected,
        { key: getRowKey(record), subKeys: keys },
      ];
    };

  const getChildSelectedRowKeys = (record: T): string[] => {
    const selectedItem = selectedKeys.value.find(
      (item) => item.key === getRowKey(record),
    );

    return selectedItem?.subKeys || [];
  };

  const totalSelectionCount = computed((): number =>
    selectedKeys.value.reduce(
      (acc, item) => acc + (item.subKeys?.length ?? 0) + 1,
      0,
    ),
  );

  return {
    getChildOnChange,
    getChildSelectedRowKeys,
    parentGetCheckboxProps,
    parentOnChange,
    parentSelectedKeys,
    totalSelectionCount,
  };
}
