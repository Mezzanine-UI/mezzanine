// Port of `packages/react/src/Table/utils/calculateColumnWidths.ts`.
// Used by `MznTable` to derive per-cell widths for the CDK drag preview so
// they match React's dragging-row behaviour — explicit column widths clamp
// to min/max, the rest share remaining container width equally.
import type { TableColumn } from './table-types';

export function clampWidth(
  width: number,
  minWidth?: number,
  maxWidth?: number,
): number {
  let result = width;

  if (minWidth !== undefined && result < minWidth) {
    result = minWidth;
  }

  if (maxWidth !== undefined && result > maxWidth) {
    result = maxWidth;
  }

  return result;
}

export interface CalculateColumnWidthsOptions {
  readonly actionColumnsWidth: number;
  readonly columns: readonly TableColumn[];
  readonly containerWidth: number;
  readonly getResizedColumnWidth?: (key: string) => number | undefined;
}

export function calculateColumnWidths({
  actionColumnsWidth,
  columns,
  containerWidth,
  getResizedColumnWidth,
}: CalculateColumnWidthsOptions): Map<string, number> {
  const widthMap = new Map<string, number>();

  if (containerWidth <= 0) return widthMap;

  const availableWidth = containerWidth - actionColumnsWidth;

  if (availableWidth <= 0) return widthMap;

  let totalFixedWidth = 0;
  const flexColumns: TableColumn[] = [];

  columns.forEach((column) => {
    const resizedWidth = getResizedColumnWidth?.(column.key);

    if (resizedWidth !== undefined) {
      widthMap.set(column.key, resizedWidth);
      totalFixedWidth += resizedWidth;
    } else if (typeof column.width === 'number') {
      const width = clampWidth(column.width, column.minWidth, column.maxWidth);

      widthMap.set(column.key, width);
      totalFixedWidth += width;
    } else {
      // `column.width` as a string (e.g. '100%') can't participate in numeric
      // layout — treat as flex and let remaining space distribute naturally.
      flexColumns.push(column);
    }
  });

  if (flexColumns.length > 0) {
    const averageWidth =
      (availableWidth - totalFixedWidth) / flexColumns.length;

    flexColumns.forEach((column) => {
      widthMap.set(
        column.key,
        clampWidth(averageWidth, column.minWidth, column.maxWidth),
      );
    });
  }

  return widthMap;
}
