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
 */
export function useTableDragAndDrop<
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
  /** Set while the drag is following a pointer rather than the keyboard. */
  const pointerRect = shallowRef<{
    height: number;
    left: number;
    top: number;
    width: number;
  } | null>(null);

  /** React keeps the row elements in refs; a Map is the equivalent. */
  const rowElements = new Map<string, HTMLElement>();
  let pointerStartY = 0;
  let pointerDeltaY = 0;

  const isDragging = computed((): boolean => draggingKey.value !== null);

  const rowHeight = (): number =>
    pointerRect.value?.height ??
    (draggingKey.value
      ? (rowElements.get(draggingKey.value)?.getBoundingClientRect().height ??
        0)
      : 0);

  function reset(): void {
    draggingKey.value = null;
    sourceIndex.value = -1;
    targetIndex.value = -1;
    pointerRect.value = null;
    pointerStartY = 0;
    pointerDeltaY = 0;
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

  /** Which row the pointer is currently over, as an index into the data. */
  function indexUnderPointer(): number {
    const rect = pointerRect.value;

    if (!rect) return targetIndex.value;

    const centre = rect.top + pointerDeltaY + rect.height / 2;
    const rows = dataSource();
    let index = sourceIndex.value;

    rows.forEach((record, rowIndex) => {
      if (rowIndex === sourceIndex.value) return;

      const element = rowElements.get(getRowKey(record));

      if (!element) return;

      const bounds = element.getBoundingClientRect();

      if (centre > bounds.top && centre < bounds.bottom) {
        index = rowIndex;
      }
    });

    return index;
  }

  function handleMousemove(event: MouseEvent): void {
    if (!pointerRect.value) return;

    pointerDeltaY = event.clientY - pointerStartY;
    targetIndex.value = indexUnderPointer();
    // Re-assign so the style recomputes as the pointer moves.
    pointerRect.value = { ...pointerRect.value };
  }

  function handleMouseup(): void {
    document.removeEventListener('mousemove', handleMousemove);
    document.removeEventListener('mouseup', handleMouseup);
    commit();
  }

  function handleMousedown(
    event: MouseEvent,
    rowKey: string,
    index: number,
  ): void {
    if (!draggable()?.enabled || event.button !== 0) return;

    const element = rowElements.get(rowKey);

    if (!element) return;

    event.preventDefault();

    const bounds = element.getBoundingClientRect();

    draggingKey.value = rowKey;
    sourceIndex.value = index;
    targetIndex.value = index;
    pointerStartY = event.clientY;
    pointerDeltaY = 0;
    pointerRect.value = {
      height: bounds.height,
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
    };
    message.value = `You have lifted an item in position ${index + 1}.`;

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

      draggingKey.value = rowKey;
      sourceIndex.value = index;
      targetIndex.value = index;
      message.value = `You have lifted an item in position ${index + 1}.`;

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
      message.value = `You have moved the item to position ${next + 1}.`;
    }
  }

  /** The dragged row leaves the flow; the rows it passes shift to make room. */
  function styleFor(index: number): CSSProperties | undefined {
    if (!isDragging.value) return undefined;

    const from = sourceIndex.value;
    const to = targetIndex.value;

    if (index === from) {
      const rect = pointerRect.value;

      if (!rect) return undefined;

      return {
        height: `${rect.height}px`,
        left: `${rect.left}px`,
        pointerEvents: 'none',
        position: 'fixed',
        top: `${rect.top + pointerDeltaY}px`,
        width: `${rect.width}px`,
        zIndex: DRAG_Z_INDEX,
      };
    }

    const height = rowHeight();

    if (from < to && index > from && index <= to) {
      return { transform: `translateY(-${height}px)` };
    }

    if (from > to && index >= to && index < from) {
      return { transform: `translateY(${height}px)` };
    }

    return undefined;
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

  onBeforeUnmount(() => {
    document.removeEventListener('mousemove', handleMousemove);
    document.removeEventListener('mouseup', handleMouseup);
  });

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
