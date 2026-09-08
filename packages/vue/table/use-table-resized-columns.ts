import { shallowRef } from 'vue';
import type { TableResizedColumnState } from './table-context';

/**
 * 記住使用者把每一欄拖成多寬。
 *
 * 只是一個 key → 寬度的表；重繪由取代整個 Map 觸發，與 React 端相同。
 *
 * @example
 * ```ts
 * const columnState = useTableResizedColumns();
 *
 * columnState.setResizedColumnWidth('name', 220);
 * ```
 *
 * @see MznTableResizeHandle 拖曳時寫入寬度的元件
 */
export function useTableResizedColumns(): TableResizedColumnState {
  const resizedColumnWidths = shallowRef<Map<string, number>>(new Map());

  const getResizedColumnWidth = (key: string): number | undefined =>
    resizedColumnWidths.value.get(key);

  const setResizedColumnWidth = (key: string, width: number): void => {
    const next = new Map(resizedColumnWidths.value);

    next.set(key, width);
    resizedColumnWidths.value = next;
  };

  return {
    getResizedColumnWidth,
    setResizedColumnWidth,
  };
}
