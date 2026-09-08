import { computed, inject, provide } from 'vue';
import type { ComputedRef, InjectionKey } from 'vue';

export interface TableSuperContextValue {
  /** The measured width of the outer table's scroll container. */
  containerWidth?: number;
  /** Reads a column width the outer table's user has dragged. */
  getResizedColumnWidth?: (key: string) => number | undefined;
  /** How far the outer table is scrolled horizontally. */
  scrollLeft?: number;
  /** The left padding an expanded row's content sits behind. */
  expansionLeftPadding?: number;
  /** Whether the outer table pins its drag or pin handle column. */
  hasDragOrPinHandleFixed?: boolean;
}

/**
 * Provided by the outermost MznTable, injected by any table nested inside an
 * expanded row.
 *
 * Carries a `ComputedRef` rather than a plain object so a nested table follows
 * the outer one as it is scrolled or resized; React gets that from re-rendering
 * the provider.
 */
export const TABLE_SUPER_CONTEXT: InjectionKey<
  ComputedRef<TableSuperContextValue>
> = Symbol('MznTableSuperContext');

export function provideTableSuperContext(
  value: ComputedRef<TableSuperContextValue>,
): void {
  provide(TABLE_SUPER_CONTEXT, value);
}

/** Shared by every outermost table, which has no super context to read. */
const EMPTY_SUPER_CONTEXT: ComputedRef<TableSuperContextValue> = computed(
  () => ({}),
);

/**
 * 讀取外層 table 提供的量測結果，給巢狀在展開列裡的 table 用。
 *
 * 與另外兩個 context 不同，這個在沒有 provider 時回傳空物件而不是拋錯 —— 最外層的
 * table 本來就沒有外層可讀，React 端寫的是 `useContext(...) || {}`。
 *
 * @example
 * ```ts
 * const superContext = useTableSuperContext();
 *
 * const scrollLeft = computed(() => superContext.value.scrollLeft ?? 0);
 * ```
 *
 * @see MznTable 提供這份 context 的元件
 */
export function useTableSuperContext(): ComputedRef<TableSuperContextValue> {
  return inject(TABLE_SUPER_CONTEXT, undefined) ?? EMPTY_SUPER_CONTEXT;
}
