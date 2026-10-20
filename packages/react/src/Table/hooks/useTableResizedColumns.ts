'use client';

import { useState, useCallback, useRef } from 'react';
import type { TableResizedColumnState } from '../TableContext';

export interface UseTableResizedColumnsOptions {
  /**
   * Controlled column widths keyed by column key.
   * When provided, the table renders these widths and only reports drags
   * through `onColumnWidthsChange`.
   */
  columnWidths?: Record<string, number>;
  /**
   * Called once when a resize drag ends, with the widths of every column
   * resized so far (previous widths merged with this drag).
   */
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
}

const EMPTY_WIDTHS: Record<string, number> = {};

/**
 * Manages resized column widths for `Table`.
 *
 * Widths written during a drag live in a draft layer so the table can render
 * live feedback; `commitResizedColumnWidths` (called on mouseup) merges the
 * draft into the committed widths and notifies `onColumnWidthsChange`.
 * In controlled mode the committed widths are always `columnWidths`.
 */
export function useTableResizedColumns({
  columnWidths,
  onColumnWidthsChange,
}: UseTableResizedColumnsOptions = {}): TableResizedColumnState {
  const isControlled = columnWidths !== undefined;
  const [uncontrolledWidths, setUncontrolledWidths] =
    useState<Record<string, number>>(EMPTY_WIDTHS);
  const [draftWidths, setDraftWidths] =
    useState<Record<string, number>>(EMPTY_WIDTHS);

  const committedWidths = isControlled ? columnWidths : uncontrolledWidths;

  // Refs let commit read the latest values from a document mouseup listener
  // that was bound at mousedown time.
  const committedWidthsRef = useRef(committedWidths);
  const draftWidthsRef = useRef(draftWidths);
  const onColumnWidthsChangeRef = useRef(onColumnWidthsChange);

  committedWidthsRef.current = committedWidths;
  onColumnWidthsChangeRef.current = onColumnWidthsChange;

  const getResizedColumnWidth = useCallback(
    (key: string) => draftWidths[key] ?? committedWidths[key],
    [committedWidths, draftWidths],
  );

  const setResizedColumnWidth = useCallback((key: string, width: number) => {
    const next = { ...draftWidthsRef.current, [key]: width };

    draftWidthsRef.current = next;
    setDraftWidths(next);
  }, []);

  const commitResizedColumnWidths = useCallback(() => {
    const draft = draftWidthsRef.current;
    const committed = committedWidthsRef.current;
    const hasChanges = Object.keys(draft).some(
      (key) => draft[key] !== committed[key],
    );

    draftWidthsRef.current = EMPTY_WIDTHS;
    setDraftWidths(EMPTY_WIDTHS);

    if (!hasChanges) return;

    const next = { ...committed, ...draft };

    if (!isControlled) {
      setUncontrolledWidths(next);
    }

    onColumnWidthsChangeRef.current?.(next);
  }, [isControlled]);

  return {
    commitResizedColumnWidths,
    getResizedColumnWidth,
    setResizedColumnWidth,
  };
}
