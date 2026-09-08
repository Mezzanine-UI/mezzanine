import {
  computed,
  inject,
  onBeforeUnmount,
  provide,
  shallowRef,
  useId,
} from 'vue';
import type { ComputedRef, CSSProperties, InjectionKey, ShallowRef } from 'vue';
import {
  getRowKey,
  type TableDataSource,
  type TableDraggable,
} from '@mezzanine-ui/core/table';
import type {
  TableDraggableProvided,
  TableDroppableProvided,
} from './table-drag-and-drop.types';

/** The droppable id React passes to `<Droppable>`. */
export const TABLE_DROPPABLE_ID = 'mzn-table-dnd';

/**
 * The description `@hello-pangea/dnd` renders into a hidden node and points
 * every drag handle at. Reproduced verbatim, newlines included.
 */
export const TABLE_DRAG_HANDLE_DESCRIPTION = `Press space bar to start a drag.
  When dragging you can use the arrow keys to move the item around and escape to cancel.
  Some screen readers may require you to be in focus mode or to use your pass through key`;

export interface UseTableDragAndDropOptions<
  T extends TableDataSource = TableDataSource,
> {
  /** The rows currently rendered, in order. */
  dataSource?: () => T[];
  /** The `draggable` prop the table was given. */
  draggable?: () => TableDraggable<T> | undefined;
}

/** The rows' geometry, frozen at the moment a drag starts. */
interface TableDragLayout {
  /** The lifted row's height, which is also how far the others move. */
  height: number;
  /** The lifted row's left edge, so it can be pinned to the viewport. */
  left: number;
  /** Every row's vertical extent, by index, before anything moved. */
  rows: { bottom: number; top: number }[];
  /** The lifted row's top edge. */
  top: number;
  /** The lifted row's width, which it loses on leaving the table. */
  width: number;
}

export interface TableDragAndDropContextValue {
  /** What one row needs to take part in a drag. */
  draggableFor: (rowKey: string, index: number) => TableDraggableProvided;
  /** Whether a drag is in progress. */
  isDragging: boolean;
}

export interface UseTableDragAndDropReturn {
  /** The id of the hidden live region the announcements go to. */
  announcementId: string;
  /** What the scroll container and the placeholder row need. */
  droppable: ComputedRef<TableDroppableProvided>;
  /** The id of the hidden node every handle is described by. */
  hiddenTextId: string;
  /** The message currently announced, or an empty string. */
  message: ShallowRef<string>;
}

export const TABLE_DRAG_AND_DROP_CONTEXT: InjectionKey<
  ComputedRef<TableDragAndDropContextValue>
> = Symbol('MznTableDragAndDropContext');

/** How far above the pointer the dragged row is lifted, matching the library. */
const DRAG_Z_INDEX = 5000;

/**
 * The inline style `@hello-pangea/dnd` gives its live region, copied verbatim
 * so the announcement stays off-screen without a stylesheet of our own.
 */
export const TABLE_DRAG_VISUALLY_HIDDEN: CSSProperties = {
  border: 0,
  clip: 'rect(0px, 0px, 0px, 0px)',
  clipPath: 'inset(100%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
};

/**
 * 重現 React 端 `@hello-pangea/dnd` 的整份拖曳行為與它留在 DOM 上的痕跡。
 *
 * 兩件事分開看：
 *
 * 1. **靜止狀態的 DOM。** React 的 `DragDropContext` / `Droppable` 是無條件包住每一個
 *    非巢狀 Table 的，所以捲動容器上永遠有兩個 `data-rfd-droppable-*` 屬性、表格尾端
 *    永遠多一個空的 tbody；開了 `draggable` 之後每一列再多兩個 `data-rfd-draggable-*`，
 *    每個把手再多 `role` / `tabindex` / `aria-describedby` 與兩個
 *    `data-rfd-drag-handle-*`。這些一字不差地照抄（D-H1）。
 * 2. **拖曳本身。** 自己實作單一垂直列表的重排：滑鼠拖曳時被拖的列改用 `position: fixed`
 *    跟著游標，中間的列平移讓出空位；鍵盤則是空白鍵拿起、上下鍵移動、空白鍵放下、
 *    Esc 取消。結束時以與 React 相同的參數呼叫 `onDragEnd`。
 *
 * @example
 * ```ts
 * const { droppable, hiddenTextId } = useTableDragAndDrop({
 *   dataSource: () => props.dataSource,
 *   draggable: () => props.draggable,
 * });
 * ```
 *
 * @see MznTable 使用它的元件
 * @see useTableDraggableRow 每一列讀取它的 composable
 */ export function useTableDragAndDrop<
  T extends TableDataSource = TableDataSource,
>(options: UseTableDragAndDropOptions<T> = {}): UseTableDragAndDropReturn {
  const { dataSource = () => [] as T[], draggable = () => undefined } = options;

  const contextId = useId();
  const hiddenTextId = `rfd-hidden-text-${contextId}-hidden-text-${useId()}`;
  const announcementId = `rfd-announcement-${contextId}`;

  const message = shallowRef('');
  const draggingKey = shallowRef<string | null>(null);
  const sourceIndex = shallowRef(-1);
  const targetIndex = shallowRef(-1);
  /** How far the lifted row has travelled from where it started. */
  const offsetY = shallowRef(0);
  /**
   * The rows' boxes as they were the moment the drag started. Everything is
   * measured against this and never against the live DOM: the lifted row goes
   * `position: fixed`, which takes it out of the table and moves every row
   * below it, so measuring live would feed the drag its own output and the
   * rows would oscillate under the pointer.
   */
  const layout = shallowRef<TableDragLayout | null>(null);

  /** React keeps the row elements in refs; a Map is the equivalent. */
  const rowElements = new Map<string, HTMLElement>();
  let pointerStartY = 0;

  const isDragging = computed((): boolean => draggingKey.value !== null);

  /** Snapshot every row's box, plus the lifted row's own, before it moves. */
  function measure(index: number): TableDragLayout | null {
    const records = dataSource();
    const record = records[index];
    const element = record && rowElements.get(getRowKey(record));

    if (!element) return null;

    const bounds = element.getBoundingClientRect();

    return {
      height: bounds.height,
      left: bounds.left,
      rows: records.map((row) => {
        const rect = rowElements.get(getRowKey(row))?.getBoundingClientRect();

        return { bottom: rect?.bottom ?? 0, top: rect?.top ?? 0 };
      }),
      top: bounds.top,
      width: bounds.width,
    };
  }

  function reset(): void {
    draggingKey.value = null;
    sourceIndex.value = -1;
    targetIndex.value = -1;
    layout.value = null;
    offsetY.value = 0;
    pointerStartY = 0;
  }

  function lift(rowKey: string, index: number): boolean {
    const measured = measure(index);

    if (!measured) return false;

    layout.value = measured;
    draggingKey.value = rowKey;
    sourceIndex.value = index;
    targetIndex.value = index;
    offsetY.value = 0;
    message.value = `You have lifted an item in position ${index + 1}.`;

    return true;
  }

  function commit(): void {
    const from = sourceIndex.value;
    const to = targetIndex.value;
    const draggingId = draggingKey.value;

    if (draggingId === null || from === -1 || to === -1 || from === to) {
      reset();
      message.value = '';

      return;
    }

    const newData = [...dataSource()];
    const [removed] = newData.splice(from, 1);

    newData.splice(to, 0, removed);

    draggable()?.onDragEnd?.(newData, {
      draggingId,
      fromIndex: from,
      toIndex: to,
    });

    message.value = `You have dropped the item. It moved from position ${from + 1} to ${to + 1}.`;
    reset();
  }

  function cancel(): void {
    message.value =
      'Movement cancelled. The item has returned to its starting position.';
    reset();
  }

  /**
   * Which slot the lifted row currently covers, in the pre-drag geometry.
   *
   * A row counts as passed once the lifted row's centre is past its middle,
   * and the destination is simply how many of the others have been passed.
   * Counting beats hit-testing each row's box: boxes leave a hairline between
   * them at every boundary, and a centre landing exactly there matches nothing
   * — the destination would snap back to the start for that one frame.
   */
  function indexUnderPointer(): number {
    const current = layout.value;

    if (!current) return targetIndex.value;

    const from = sourceIndex.value;
    const centre = current.top + offsetY.value + current.height / 2;

    return current.rows.reduce(
      (slot, row, index) =>
        index !== from && (row.top + row.bottom) / 2 < centre ? slot + 1 : slot,
      0,
    );
  }

  function handleMousemove(event: MouseEvent): void {
    if (!layout.value) return;

    offsetY.value = event.clientY - pointerStartY;
    targetIndex.value = indexUnderPointer();
  }

  function stopListening(): void {
    document.removeEventListener('mousemove', handleMousemove);
    document.removeEventListener('mouseup', handleMouseup);
  }

  function handleMouseup(): void {
    stopListening();
    commit();
  }

  function handleMousedown(
    event: MouseEvent,
    rowKey: string,
    index: number,
  ): void {
    if (!draggable()?.enabled || event.button !== 0) return;

    pointerStartY = event.clientY;

    if (!lift(rowKey, index)) return;

    event.preventDefault();

    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', handleMouseup);
  }

  function handleKeydown(
    event: KeyboardEvent,
    rowKey: string,
    index: number,
  ): void {
    if (!draggable()?.enabled) return;

    const lifted = draggingKey.value === rowKey;

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();

      if (lifted) {
        commit();

        return;
      }

      lift(rowKey, index);

      return;
    }

    if (!lifted) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      cancel();

      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();

      const next = targetIndex.value + (event.key === 'ArrowUp' ? -1 : 1);

      if (next < 0 || next > dataSource().length - 1) return;

      targetIndex.value = next;
      // No pointer to follow, so the row is moved a slot at a time itself.
      offsetY.value = (next - sourceIndex.value) * (layout.value?.height ?? 0);
      message.value = `You have moved the item to position ${next + 1}.`;
    }
  }

  /**
   * The lifted row is taken out of the table and follows the pointer; the rest
   * are moved with a transform, exactly as `@hello-pangea/dnd` does it.
   *
   * The arithmetic has one subtlety. Going `position: fixed` removes the row
   * from the table, so the browser has *already* pulled every row below it up
   * by one row height. Undoing that and then opening a gap at the destination
   * comes to a single rule: after the collapse the remaining rows occupy slots
   * `0..n-2`, and the lifted row has to be inserted at slot `to`, so every row
   * whose collapsed slot is at or below `to` drops by one height and the rest
   * stay where they are.
   */
  function styleFor(index: number): CSSProperties | undefined {
    const current = layout.value;

    if (!isDragging.value || !current) return undefined;

    const from = sourceIndex.value;

    if (index === from) {
      return {
        boxSizing: 'border-box',
        height: `${current.height}px`,
        left: `${current.left}px`,
        pointerEvents: 'none',
        position: 'fixed',
        top: `${current.top + offsetY.value}px`,
        width: `${current.width}px`,
        zIndex: DRAG_Z_INDEX,
      };
    }

    const collapsedSlot = index - (index > from ? 1 : 0);

    return collapsedSlot >= targetIndex.value
      ? {
          transform: `translate(0px, ${current.height}px)`,
          transition: 'none',
        }
      : { transition: 'none' };
  }

  const draggableFor = (
    rowKey: string,
    index: number,
  ): TableDraggableProvided => ({
    draggableProps: {
      'data-rfd-draggable-context-id': contextId,
      'data-rfd-draggable-id': rowKey,
      style: styleFor(index),
    },
    dragHandleProps: {
      'aria-describedby': hiddenTextId,
      'data-rfd-drag-handle-context-id': contextId,
      'data-rfd-drag-handle-draggable-id': rowKey,
      draggable: false,
      onKeydown: (event: KeyboardEvent) => handleKeydown(event, rowKey, index),
      onMousedown: (event: MouseEvent) => handleMousedown(event, rowKey, index),
      role: 'button',
      tabindex: 0,
    },
    innerRef: (element: HTMLElement | null) => {
      if (element) {
        rowElements.set(rowKey, element);
      } else {
        rowElements.delete(rowKey);
      }
    },
  });

  provide(
    TABLE_DRAG_AND_DROP_CONTEXT,
    computed(
      (): TableDragAndDropContextValue => ({
        draggableFor,
        isDragging: isDragging.value,
      }),
    ),
  );

  onBeforeUnmount(stopListening);

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

  return { announcementId, droppable, hiddenTextId, message };
}

/**
 * 讀取 MznTable 提供的拖曳狀態，取得每一列要用的 provided 物件。
 *
 * @example
 * ```ts
 * const dragAndDrop = useTableDraggableRow();
 *
 * const provided = dragAndDrop.value?.draggableFor(rowKey, index);
 * ```
 *
 * @see useTableDragAndDrop 建立這份 context 的 composable
 */
export function useTableDraggableRow():
  | ComputedRef<TableDragAndDropContextValue>
  | undefined {
  return inject(TABLE_DRAG_AND_DROP_CONTEXT, undefined);
}
