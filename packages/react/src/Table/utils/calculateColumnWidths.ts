import type { TableColumn } from '@mezzanine-ui/core/table';

/**
 * Check if width calculation should be applied.
 * Only calculate explicit widths for root tables (not nested).
 * Nested tables should let columns use natural CSS behavior.
 */
export function shouldCalculateWidths(
  isNestedTable: boolean,
  containerWidth: number | undefined,
): boolean {
  // Don't calculate widths for nested tables - they inherit parent's context
  // and should use natural CSS column sizing
  if (isNestedTable) {
    return false;
  }

  // Don't calculate if container width is not available
  if (!containerWidth || containerWidth <= 0) {
    return false;
  }

  return true;
}

/**
 * Clamp a width value between min and max bounds
 */
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

/**
 * Sanitize externally supplied column widths (e.g. restored from storage):
 * drops non-finite or non-positive values and clamps the rest to each
 * column's minWidth/maxWidth. Keys without a matching column are kept as-is.
 */
export function sanitizeColumnWidths(
  widths: Record<string, number>,
  columns: Pick<TableColumn, 'key' | 'maxWidth' | 'minWidth'>[],
): Record<string, number> {
  const columnsByKey = new Map(columns.map((column) => [column.key, column]));

  return Object.fromEntries(
    Object.entries(widths)
      .filter(([, width]) => Number.isFinite(width) && width > 0)
      .map(([key, width]) => {
        const column = columnsByKey.get(key);

        return [
          key,
          column ? clampWidth(width, column.minWidth, column.maxWidth) : width,
        ];
      }),
  );
}

export interface CalculateColumnWidthsOptions {
  /** Action columns (drag handle, selection, expansion) total width */
  actionColumnsWidth: number;
  /** All data columns */
  columns: TableColumn[];
  /** Container width */
  containerWidth: number;
  /** Get resized column width by key */
  getResizedColumnWidth?: (key: string) => number | undefined;
}

/**
 * Calculate the resolved width for each column.
 * - Columns with explicit width use that value
 * - Columns without width share the remaining space equally (simulating flex: 1)
 * - All widths are clamped to minWidth/maxWidth if specified
 */
export function calculateColumnWidths({
  actionColumnsWidth,
  columns,
  containerWidth,
  getResizedColumnWidth,
}: CalculateColumnWidthsOptions): Map<string, number> {
  const widthMap = new Map<string, number>();

  // If container width is not available yet, return empty map
  if (containerWidth <= 0) {
    return widthMap;
  }

  // Available width for data columns
  const availableWidth = containerWidth - actionColumnsWidth;

  if (availableWidth <= 0) {
    return widthMap;
  }

  // First pass: identify columns with explicit width and calculate total fixed width
  let totalFixedWidth = 0;
  const flexColumns: TableColumn[] = [];

  columns.forEach((column) => {
    const resizedWidth = getResizedColumnWidth?.(column.key);

    if (resizedWidth !== undefined) {
      // Column has been resized, use that width
      widthMap.set(column.key, resizedWidth);
      totalFixedWidth += resizedWidth;
    } else if (column.width !== undefined) {
      // Column has explicit width
      const width = clampWidth(column.width, column.minWidth, column.maxWidth);

      widthMap.set(column.key, width);
      totalFixedWidth += width;
    } else {
      // Column needs flex width calculation
      flexColumns.push(column);
    }
  });

  // Second pass: distribute remaining width to flex columns
  if (flexColumns.length > 0) {
    const averageWidth =
      (availableWidth - totalFixedWidth) / flexColumns.length;

    flexColumns.forEach((column) => {
      const clampedWidth = clampWidth(
        averageWidth,
        column.minWidth,
        column.maxWidth,
      );

      widthMap.set(column.key, clampedWidth);
    });
  }

  return widthMap;
}
