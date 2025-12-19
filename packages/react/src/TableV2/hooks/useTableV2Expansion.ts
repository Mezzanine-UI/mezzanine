'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  EXPANSION_COLUMN_WIDTH,
  type TableV2DataSource,
  type TableV2Expandable,
} from '@mezzanine-ui/core/tableV2';
import type { TableV2ExpansionState } from '../TableV2Context';

export interface UseTableV2ExpansionOptions<T extends TableV2DataSource> {
  expandable?: TableV2Expandable<T>;
  hasDragHandle: boolean;
}

export function useTableV2Expansion<T extends TableV2DataSource>({
  expandable,
  hasDragHandle,
}: UseTableV2ExpansionOptions<T>): TableV2ExpansionState<T> | undefined {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<
    (string | number)[]
  >([]);

  const {
    expandedRowKeys: expandedRowKeysProp,
    onExpand,
    onExpandedRowsChange,
  } = expandable || {};

  const isControlled = expandedRowKeysProp !== undefined;
  const expandedRowKeys =
    isControlled && expandedRowKeysProp
      ? expandedRowKeysProp
      : internalExpandedKeys;

  const isRowExpanded = useCallback(
    (key: string | number) => {
      return expandedRowKeys.includes(key);
    },
    [expandedRowKeys],
  );

  const toggleExpand = useCallback(
    (key: string | number, record: T) => {
      const isExpanded = expandedRowKeys.includes(key);
      const newKeys = isExpanded
        ? expandedRowKeys.filter((k) => k !== key)
        : [...expandedRowKeys, key];

      if (!isControlled) {
        setInternalExpandedKeys(newKeys);
      }

      onExpand?.(!isExpanded, record);
      onExpandedRowsChange?.(newKeys);
    },
    [expandedRowKeys, isControlled, onExpand, onExpandedRowsChange],
  );

  const expansionLeftPadding = useMemo(() => {
    let padding = 0;
    // Number(
    //   getCSSVariableValue('--mzn-spacing-padding-horizontal-comfort').replace(
    //     'rem',
    //     '',
    //   ),
    // ) * 16;

    if (hasDragHandle) padding += DRAG_HANDLE_COLUMN_WIDTH;
    if (expandable) padding += EXPANSION_COLUMN_WIDTH;

    return padding;
  }, [expandable, hasDragHandle]);

  if (!expandable) {
    return undefined;
  }

  return {
    config: expandable,
    expansionLeftPadding,
    expandedRowKeys,
    isRowExpanded,
    toggleExpand,
  };
}
