import type { CSSProperties } from 'vue';

/**
 * What the drag implementation hands each row, shaped exactly like
 * `@hello-pangea/dnd`'s `DraggableProvided` — that is the seam React's
 * `TableRow` and `TableDragOrPinHandleCell` are already written against, so
 * keeping the shape keeps the components identical on both sides.
 */
export interface TableDraggableProvided {
  /** Spread onto the row. Carries the row's data attributes and drag transform. */
  draggableProps: Record<string, unknown> & { style?: CSSProperties };
  /** Spread onto the handle. Carries the handle's data and a11y attributes. */
  dragHandleProps?: Record<string, unknown>;
  /** Receives the row element. */
  innerRef: (element: HTMLElement | null) => void;
}

/**
 * What the drag implementation hands the scroll container, shaped like
 * `DroppableProvided`.
 */
export interface TableDroppableProvided {
  /** Spread onto the scroll container. */
  droppableProps: Record<string, unknown>;
  /** Receives the scroll container element. */
  innerRef: (element: HTMLElement | null) => void;
  /** Whether the placeholder row should be rendered. */
  placeholder: boolean;
}
