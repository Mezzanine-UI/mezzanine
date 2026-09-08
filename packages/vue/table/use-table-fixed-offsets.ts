import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import {
  COLLECTABLE_KEY,
  DRAG_OR_PIN_HANDLE_COLUMN_WIDTH,
  DRAG_OR_PIN_HANDLE_KEY,
  EXPANSION_COLUMN_WIDTH,
  EXPANSION_KEY,
  SELECTION_COLUMN_WIDTH,
  SELECTION_KEY,
  TOGGLEABLE_KEY,
  type FixedType,
} from '@mezzanine-ui/core/table';
import { useTableSuperContext } from './table-super-context';
import type { ActionColumnConfig } from './table-hooks.types';
import type { TableColumn } from './table.types';

export interface FixedOffsetInfo {
  /** CSS offset value for the column */
  offset: number;
  /** Fixed side: 'start' or 'end' */
  side: 'start' | 'end';
}

export interface UseTableFixedOffsetsReturn {
  /** Get offset info for a specific column by key */
  getColumnOffset: (key: string) => FixedOffsetInfo | null;
  /** Get offset info for drag or pin handle column */
  getDragOrPinHandleOffset: () => FixedOffsetInfo | null;
  /** Get offset info for selection column */
  getSelectionOffset: () => FixedOffsetInfo | null;
  /** Get offset info for expansion column */
  getExpansionOffset: () => FixedOffsetInfo | null;
  /** Get offset info for toggleable column */
  getToggleableOffset: () => FixedOffsetInfo | null;
  /** Get offset info for collectable column */
  getCollectableOffset: () => FixedOffsetInfo | null;
  /** Check if a column should show shadow based on scroll position */
  shouldShowShadow: (
    key: string,
    scrollLeft: number,
    containerWidth: number,
  ) => boolean;
}

export interface UseTableFixedOffsetsOptions {
  /** Action column configuration */
  actionConfig: () => ActionColumnConfig;
  /** Column definitions */
  columns: () => TableColumn[];
  /** Get computed width for a column (from columnState) */
  getResizedColumnWidth?: (key: string) => number | undefined;
}

const parseFixed = (fixed: FixedType | undefined): 'end' | 'start' | null => {
  if (fixed === true || fixed === 'start') return 'start';
  if (fixed === 'end') return 'end';

  return null;
};

/**
 * 算出每個被固定（fixed）的欄位要黏在容器的哪個位置，以及什麼時候該畫出陰影。
 *
 * 起始側的欄位由左往右累加寬度，結束側由右往左；寬度依「量測值 → 使用者拖曳過的
 * 寬度 → 欄位自己宣告的 width → 0」的順序取得。陰影只在該欄真的黏住、而且與相鄰的
 * 固定欄之間還有縫隙時才出現，所以連續黏住的兩欄之間不會有多餘的陰影。
 *
 * @example
 * ```ts
 * const fixedOffsets = useTableFixedOffsets({
 *   actionConfig: () => actionConfig.value,
 *   columns: () => props.columns,
 *   getResizedColumnWidth: columnState.getResizedColumnWidth,
 * });
 *
 * const offset = fixedOffsets.value.getColumnOffset('name');
 * ```
 *
 * @see MznTable 使用這個 composable 的元件
 * @see MznTableCell 依 offset 決定 `--fixed-start-offset` 的儲存格
 */
export function useTableFixedOffsets(
  props: UseTableFixedOffsetsOptions,
): ComputedRef<UseTableFixedOffsetsReturn> {
  const superContext = useTableSuperContext();

  const expansionLeftPadding = computed(
    (): number => superContext.value.expansionLeftPadding ?? 0,
  );
  const parentHasDragOrPinHandleFixed = computed(
    (): boolean => superContext.value.hasDragOrPinHandleFixed ?? false,
  );

  /**
   * React seeds this from an effect into state; the value is a pure function of
   * the action config, so here it is simply derived.
   */
  const measuredWidths = computed((): Map<string, number> => {
    const {
      collectableMinWidth,
      hasCollectable,
      hasDragOrPinHandle,
      hasExpansion,
      hasSelection,
      hasToggleable,
      toggleableMinWidth,
    } = props.actionConfig();
    const innerMap = new Map<string, number>();

    if (hasDragOrPinHandle || parentHasDragOrPinHandleFixed.value) {
      innerMap.set(DRAG_OR_PIN_HANDLE_KEY, DRAG_OR_PIN_HANDLE_COLUMN_WIDTH);
    }

    if (hasExpansion) {
      innerMap.set(EXPANSION_KEY, EXPANSION_COLUMN_WIDTH);
    }

    if (hasSelection) {
      innerMap.set(SELECTION_KEY, SELECTION_COLUMN_WIDTH);
    }

    if (hasToggleable) {
      innerMap.set(TOGGLEABLE_KEY, toggleableMinWidth);
    }

    if (hasCollectable) {
      innerMap.set(COLLECTABLE_KEY, collectableMinWidth);
    }

    return innerMap;
  });

  // Get width for a column (prioritize measured, then computed, then defined, then fallback)
  const getWidth = (key: string, fallback = 0): number => {
    // Get static widths first
    const measured = measuredWidths.value.get(key);

    if (measured !== undefined && measured > 0) {
      return measured;
    }

    // get resized column width
    const computedWidth = props.getResizedColumnWidth?.(key);

    if (computedWidth !== undefined) {
      return computedWidth;
    }

    // Then try to find column definition width
    const column = props.columns().find((col) => col.key === key);

    if (column?.width !== undefined) {
      return column.width;
    }

    return fallback;
  };

  // Build ordered list of all fixed columns
  const fixedKeys = computed(
    (): { fixedEndKeys: string[]; fixedStartKeys: string[] } => {
      const {
        dragOrPinHandleFixed,
        expansionFixed,
        hasDragOrPinHandle,
        hasExpansion,
        hasSelection,
        selectionFixed,
      } = props.actionConfig();
      const startKeys: string[] = [];
      const endKeys: string[] = [];

      if (hasExpansion && expansionFixed) {
        startKeys.push(EXPANSION_KEY);
      }

      if (
        (hasDragOrPinHandle && dragOrPinHandleFixed) ||
        parentHasDragOrPinHandleFixed.value
      ) {
        startKeys.push(DRAG_OR_PIN_HANDLE_KEY);
      }

      if (hasSelection && selectionFixed) {
        startKeys.push(SELECTION_KEY);
      }

      props.columns().forEach((column) => {
        const side = parseFixed(column.fixed);

        if (side === 'start') {
          startKeys.push(column.key);
        } else if (side === 'end') {
          endKeys.push(column.key);
        }
      });

      return { fixedEndKeys: endKeys, fixedStartKeys: startKeys };
    },
  );

  // Calculate all fixed offsets
  const fixedOffsets = computed(
    (): {
      endOffsets: Map<string, FixedOffsetInfo>;
      startOffsets: Map<string, FixedOffsetInfo>;
    } => {
      const { fixedEndKeys, fixedStartKeys } = fixedKeys.value;
      const startOffsets = new Map<string, FixedOffsetInfo>();
      const endOffsets = new Map<string, FixedOffsetInfo>();

      let currentStartOffset = 0;

      fixedStartKeys.forEach((key) => {
        startOffsets.set(key, {
          offset: currentStartOffset,
          side: 'start',
        });
        currentStartOffset += getWidth(key);
      });

      let currentEndOffset = 0;

      for (let i = fixedEndKeys.length - 1; i >= 0; i -= 1) {
        const key = fixedEndKeys[i];

        endOffsets.set(key, {
          offset: currentEndOffset,
          side: 'end',
        });
        currentEndOffset += getWidth(key);
      }

      return { endOffsets, startOffsets };
    },
  );

  const allColumnKeys = computed((): string[] => {
    const { hasDragOrPinHandle, hasExpansion, hasSelection } =
      props.actionConfig();
    const keys: string[] = [];

    if (hasExpansion) {
      keys.push(EXPANSION_KEY);
    }

    if (hasDragOrPinHandle) {
      keys.push(DRAG_OR_PIN_HANDLE_KEY);
    }

    if (hasSelection) {
      keys.push(SELECTION_KEY);
    }

    props.columns().forEach((column) => {
      keys.push(column.key);
    });

    return keys;
  });

  const originalPositions = computed((): Map<string, number> => {
    const positions = new Map<string, number>();
    let currentPosition = 0;

    allColumnKeys.value.forEach((key) => {
      positions.set(key, currentPosition);
      currentPosition += getWidth(key);
    });

    return positions;
  });

  function shouldShowShadow(
    key: string,
    scrollLeft: number,
    containerWidth: number,
  ): boolean {
    const { fixedEndKeys, fixedStartKeys } = fixedKeys.value;
    const offsetInfo =
      fixedOffsets.value.startOffsets.get(key) ??
      fixedOffsets.value.endOffsets.get(key);

    if (!offsetInfo) return false;

    if (offsetInfo.side === 'start') {
      // For start-fixed columns
      const keyIndex = fixedStartKeys.indexOf(key);

      if (keyIndex === -1) return false;

      const originalPos = originalPositions.value.get(key) ?? 0;

      const isSticky =
        scrollLeft - expansionLeftPadding.value >
        originalPos - offsetInfo.offset;

      if (!isSticky) return false;

      // Now check if there's a gap to the right (shadow should show)
      // Find the next fixed-start column
      const nextIndex = keyIndex + 1;

      if (nextIndex < fixedStartKeys.length) {
        const nextKey = fixedStartKeys[nextIndex];
        const nextOriginalPos = originalPositions.value.get(nextKey) ?? 0;
        const nextOffset =
          fixedOffsets.value.startOffsets.get(nextKey)?.offset ?? 0;

        // Gap closes when scroll reaches the point where next column becomes sticky
        const isNextSticky =
          scrollLeft - expansionLeftPadding.value >=
          nextOriginalPos - nextOffset;

        return !isNextSticky;
      }

      return true;
    }

    // For end-fixed columns
    const keyIndex = fixedEndKeys.indexOf(key);

    if (keyIndex === -1) return false;

    // Get this column's original position from left
    const originalPos = originalPositions.value.get(key) ?? 0;
    const columnWidth = getWidth(key);
    const isSticky =
      scrollLeft + containerWidth <
      originalPos +
        columnWidth +
        offsetInfo.offset +
        expansionLeftPadding.value;

    if (!isSticky) return false;

    // Check if there's a gap to the left (shadow should show)
    const prevIndex = keyIndex - 1;

    if (~prevIndex) {
      const prevKey = fixedEndKeys[prevIndex];
      const prevOriginalPos = originalPositions.value.get(prevKey) ?? 0;
      const prevOffset =
        fixedOffsets.value.endOffsets.get(prevKey)?.offset ?? 0;
      const prevColumnWidth = getWidth(prevKey);

      const isPrevSticky =
        scrollLeft + containerWidth <
        prevOriginalPos +
          prevColumnWidth +
          prevOffset +
          expansionLeftPadding.value;

      // If both are sticky, the gap is closed if this column's
      // left visual edge touches the prev column's right visual edge
      return !isPrevSticky;
    }

    // This is the leftmost fixed-end column
    return true;
  }

  return computed((): UseTableFixedOffsetsReturn => {
    const { endOffsets, startOffsets } = fixedOffsets.value;
    const {
      collectableFixed,
      dragOrPinHandleFixed,
      expansionFixed,
      hasCollectable,
      hasDragOrPinHandle,
      hasExpansion,
      hasSelection,
      hasToggleable,
      selectionFixed,
      toggleableFixed,
    } = props.actionConfig();

    return {
      getCollectableOffset: () =>
        hasCollectable && collectableFixed
          ? (endOffsets.get(COLLECTABLE_KEY) ?? null)
          : null,
      getColumnOffset: (key) =>
        startOffsets.get(key) ?? endOffsets.get(key) ?? null,
      getDragOrPinHandleOffset: () =>
        hasDragOrPinHandle && dragOrPinHandleFixed
          ? (startOffsets.get(DRAG_OR_PIN_HANDLE_KEY) ?? null)
          : null,
      getExpansionOffset: () =>
        hasExpansion && expansionFixed
          ? (startOffsets.get(EXPANSION_KEY) ?? null)
          : null,
      getSelectionOffset: () =>
        hasSelection && selectionFixed
          ? (startOffsets.get(SELECTION_KEY) ?? null)
          : null,
      getToggleableOffset: () =>
        hasToggleable && toggleableFixed
          ? (endOffsets.get(TOGGLEABLE_KEY) ?? null)
          : null,
      shouldShowShadow,
    };
  });
}
