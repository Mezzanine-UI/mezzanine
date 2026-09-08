import { computed, useId } from 'vue';
import type { ComputedRef } from 'vue';
import type { TableDroppableProvided } from './table-drag-and-drop.types';

/** The droppable id React passes to `<Droppable>`. */
export const TABLE_DROPPABLE_ID = 'mzn-table-dnd';

export interface UseTableDragAndDropReturn {
  /** What the scroll container and the placeholder row need. */
  droppable: ComputedRef<TableDroppableProvided>;
}

/**
 * 重現 React 端 `@hello-pangea/dnd` 在「靜止狀態」留下的痕跡。
 *
 * React 的 `DragDropContext` / `Droppable` 是**無條件**包住每一個非巢狀 Table 的，
 * 所以即使沒有開啟 `draggable`，捲動容器上還是會有兩個 `data-rfd-droppable-*` 屬性、
 * 表格尾端還是會多一個空的 `<tbody>`（placeholder 的容器）。要和 React 的 DOM 對得起來
 * 就必須照樣產生 —— 這是 D-H1 決議「自寫拖曳並複製靜態 DOM」的第一半。
 *
 * context id 用 Vue 的 `useId()`，parity harness 會把產生式 id 收斂成 `<id>`，
 * 因此兩邊只要形狀一樣就不會有差異。
 *
 * @example
 * ```ts
 * const { droppable } = useTableDragAndDrop();
 * ```
 *
 * @see MznTable 使用它的元件
 */
export function useTableDragAndDrop(): UseTableDragAndDropReturn {
  const contextId = useId();

  const droppable = computed(
    (): TableDroppableProvided => ({
      droppableProps: {
        'data-rfd-droppable-context-id': contextId,
        'data-rfd-droppable-id': TABLE_DROPPABLE_ID,
      },
      innerRef: () => {},
      placeholder: true,
    }),
  );

  return { droppable };
}
