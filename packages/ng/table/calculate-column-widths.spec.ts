import {
  calculateColumnWidths,
  sanitizeColumnWidths,
} from './calculate-column-widths';
import type { TableColumn } from './table-types';

describe('sanitizeColumnWidths', () => {
  const columns = [
    { key: 'name', maxWidth: 300, minWidth: 80 },
    { key: 'age', minWidth: 60 },
  ];

  it('should clamp widths to each column minWidth/maxWidth', () => {
    expect(sanitizeColumnWidths({ age: 70, name: 500 }, columns)).toEqual({
      age: 70,
      name: 300,
    });
    expect(sanitizeColumnWidths({ age: 10 }, columns)).toEqual({ age: 60 });
  });

  it('should drop non-finite and non-positive widths', () => {
    expect(
      sanitizeColumnWidths(
        { age: 0, name: Number.POSITIVE_INFINITY, other: -1, x: Number.NaN },
        columns,
      ),
    ).toEqual({});
  });

  it('should keep widths for keys without a matching column as-is', () => {
    expect(sanitizeColumnWidths({ hidden: 42 }, columns)).toEqual({
      hidden: 42,
    });
  });

  it('should not mutate the input', () => {
    const widths = { name: 10 };

    sanitizeColumnWidths(widths, columns);

    expect(widths).toEqual({ name: 10 });
  });
});

describe("calculateColumnWidths with resizeStrategy='grow-table'", () => {
  const fixedColumns: TableColumn[] = ['a', 'b', 'c'].map((key) => ({
    dataIndex: key,
    key,
    minWidth: 40,
    width: 100,
  }));

  it('should leave the remaining space to the browser by default', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: fixedColumns,
      containerWidth: 500,
    });

    expect(Object.fromEntries(widths)).toEqual({ a: 100, b: 100, c: 100 });
  });

  it('should give the remaining space to the last column when no column flexes', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 20,
      columns: fixedColumns,
      containerWidth: 500,
      resizeStrategy: 'grow-table',
    });

    expect(Object.fromEntries(widths)).toEqual({ a: 100, b: 100, c: 280 });
  });

  it('should keep the widths when they already overflow the container', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: fixedColumns,
      containerWidth: 500,
      getResizedColumnWidth: (key) => (key === 'a' ? 400 : undefined),
      resizeStrategy: 'grow-table',
    });

    expect(Object.fromEntries(widths)).toEqual({ a: 400, b: 100, c: 100 });
  });

  it('should let flex columns absorb the remaining space', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: [...fixedColumns.slice(0, 2), { dataIndex: 'c', key: 'c' }],
      containerWidth: 500,
      resizeStrategy: 'grow-table',
    });

    expect(Object.fromEntries(widths)).toEqual({ a: 100, b: 100, c: 300 });
  });
});
