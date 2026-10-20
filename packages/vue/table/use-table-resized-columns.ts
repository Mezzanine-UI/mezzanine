import { computed, shallowRef } from 'vue';
import type { TableResizedColumnState } from './table-context';

export interface UseTableResizedColumnsOptions {
  /**
   * Controlled column widths keyed by column key.
   * When it returns a value, the table renders these widths and only reports
   * drags through `onColumnWidthsChange`.
   */
  columnWidths?: () => Record<string, number> | undefined;
  /**
   * Called once when a resize drag ends, with the widths of every column
   * resized so far (previous widths merged with this drag).
   */
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
}

const EMPTY_WIDTHS: Record<string, number> = {};

/**
 * Manages resized column widths for `MznTable`.
 *
 * Widths written during a drag live in a draft layer so the table can render
 * live feedback; `commitResizedColumnWidths` (called on mouseup) merges the
 * draft into the committed widths and notifies `onColumnWidthsChange`, while
 * `discardResizedColumnWidths` drops the draft (e.g. a drag back to its start).
 * In controlled mode the committed widths are always `columnWidths`.
 *
 * React keeps the latest values in refs for its document listeners; the
 * getter options and refs here are always read live, so none are needed.
 *
 * @example
 * ```ts
 * const columnState = useTableResizedColumns({
 *   columnWidths: () => props.columnWidths,
 *   onColumnWidthsChange: (widths) => emit('columnWidthsChange', widths),
 * });
 *
 * columnState.setResizedColumnWidth('name', 220);
 * columnState.commitResizedColumnWidths();
 * ```
 *
 * @see MznTableResizeHandle the component that writes and commits widths
 */
export function useTableResizedColumns({
  columnWidths,
  onColumnWidthsChange,
}: UseTableResizedColumnsOptions = {}): TableResizedColumnState {
  const uncontrolledWidths = shallowRef<Record<string, number>>(EMPTY_WIDTHS);
  const draftWidths = shallowRef<Record<string, number>>(EMPTY_WIDTHS);

  const controlledWidths = computed(() => columnWidths?.());
  const committedWidths = computed(
    (): Record<string, number> =>
      controlledWidths.value ?? uncontrolledWidths.value,
  );

  const getResizedColumnWidth = (key: string): number | undefined =>
    draftWidths.value[key] ?? committedWidths.value[key];

  const setResizedColumnWidth = (key: string, width: number): void => {
    draftWidths.value = { ...draftWidths.value, [key]: width };
  };

  const commitResizedColumnWidths = (): void => {
    const draft = draftWidths.value;
    const committed = committedWidths.value;
    const hasChanges = Object.keys(draft).some(
      (key) => draft[key] !== committed[key],
    );

    draftWidths.value = EMPTY_WIDTHS;

    if (!hasChanges) return;

    const next = { ...committed, ...draft };

    if (controlledWidths.value === undefined) {
      uncontrolledWidths.value = next;
    }

    onColumnWidthsChange?.(next);
  };

  const discardResizedColumnWidths = (): void => {
    draftWidths.value = EMPTY_WIDTHS;
  };

  return {
    commitResizedColumnWidths,
    discardResizedColumnWidths,
    getResizedColumnWidth,
    setResizedColumnWidth,
  };
}
