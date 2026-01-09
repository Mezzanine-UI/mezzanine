'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  DRAG_HANDLE_COLUMN_WIDTH,
  EXPANSION_COLUMN_WIDTH,
  type TableDataSource,
  type TableExpandable,
} from '@mezzanine-ui/core/table';
import type { TableExpansionState } from '../TableContext';

export interface UseTableExpansionOptions<T extends TableDataSource> {
  expandable?: TableExpandable<T>;
  hasDragHandle: boolean;
}

export function useTableExpansion<T extends TableDataSource>({
  expandable,
  hasDragHandle,
}: UseTableExpansionOptions<T>): TableExpansionState<T> | undefined {
  const [internalExpandedKeys, setInternalExpandedKeys] = useState<string[]>(
    [],
  );

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
    (key: string) => {
      return expandedRowKeys.includes(key);
    },
    [expandedRowKeys],
  );

  const toggleExpand = useCallback(
    (key: string, record: T) => {
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
