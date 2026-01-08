'use client';

import { useState, useCallback } from 'react';
import type { TableResizedColumnState } from '../TableContext';

export function useTableResizedColumns(): TableResizedColumnState {
  const [resizedColumnWidths, setResizedColumnWidths] = useState<
    Map<string, number>
  >(new Map());

  const getResizedColumnWidth = useCallback(
    (key: string) => {
      return resizedColumnWidths.get(key);
    },
    [resizedColumnWidths],
  );

  const setResizedColumnWidth = useCallback((key: string, width: number) => {
    setResizedColumnWidths((prev) => {
      const next = new Map(prev);

      next.set(key, width);

      return next;
    });
  }, []);

  return {
    getResizedColumnWidth,
    setResizedColumnWidth,
  };
}
