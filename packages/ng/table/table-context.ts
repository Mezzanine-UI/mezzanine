import { InjectionToken } from '@angular/core';
import type { HighlightMode, TableColumn, TableSize } from './table-types';

/** 透過 DI 向子元件共享表格狀態的介面。 */
export interface TableContextValue {
  readonly columns: () => readonly TableColumn[];
  readonly expandedRowKeys: () => ReadonlySet<string>;
  readonly highlightMode: () => HighlightMode;
  readonly selectedRowKeys: () => ReadonlySet<string>;
  readonly selectionMode: () => 'checkbox' | 'radio';
  readonly size: () => TableSize;
  toggleExpansion: (key: string) => void;
  toggleSelectAll: (keys: readonly string[]) => void;
  toggleSelection: (key: string) => void;
}

/** 表格狀態共享 DI token。 */
export const MZN_TABLE_CONTEXT = new InjectionToken<TableContextValue>(
  'MZN_TABLE_CONTEXT',
);
