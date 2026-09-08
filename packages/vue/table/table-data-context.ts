import { inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';
import type { TableDataSource } from '@mezzanine-ui/core/table';
import type { TableColumn } from './table.types';

/** Data context for performance optimization */
export interface TableDataContextValue<
  T extends TableDataSource = TableDataSource,
> {
  /** The columns the table renders. */
  columns: TableColumn<T>[];
  /** The rows the table renders. */
  dataSource: T[];
}

/**
 * Provided by MznTable alongside the main context.
 *
 * React splits the columns and rows out so a part that only reads those does
 * not re-render when, say, the hovered cell moves. Vue's fine-grained tracking
 * makes the split unnecessary for performance, but it is part of the public
 * API — `useTableDataContext` is exported — so the shape is kept.
 */
export const TABLE_DATA_CONTEXT: InjectionKey<
  ComputedRef<TableDataContextValue<never>>
> = Symbol('MznTableDataContext');

export function provideTableDataContext<T extends TableDataSource>(
  value: ComputedRef<TableDataContextValue<T>>,
): void {
  provide(
    TABLE_DATA_CONTEXT,
    value as unknown as ComputedRef<TableDataContextValue<never>>,
  );
}

/**
 * 讀取 MznTable 提供的欄位與資料列。
 *
 * @example
 * ```ts
 * const data = useTableDataContext<DataType>();
 *
 * const rowCount = computed(() => data.value.dataSource.length);
 * ```
 *
 * @see MznTable 提供這份 context 的元件
 * @see useTableContext 其餘表格狀態
 */
export function useTableDataContext<
  T extends TableDataSource = TableDataSource,
>(): ComputedRef<TableDataContextValue<T>> {
  const context = inject(TABLE_DATA_CONTEXT, undefined);

  if (!context) {
    throw new Error(
      'useTableDataContext must be used within a Table component',
    );
  }

  return context as unknown as ComputedRef<TableDataContextValue<T>>;
}
