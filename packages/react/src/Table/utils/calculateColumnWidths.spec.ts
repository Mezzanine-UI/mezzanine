import type { TableColumn } from '@mezzanine-ui/core/table';
import { calculateColumnWidths } from './calculateColumnWidths';

const fixedColumns: TableColumn[] = [
  { dataIndex: 'a', key: 'a', minWidth: 40, title: 'A', width: 100 },
  { dataIndex: 'b', key: 'b', minWidth: 40, title: 'B', width: 100 },
  { dataIndex: 'c', key: 'c', minWidth: 40, title: 'C', width: 100 },
];

const toObject = (map: Map<string, number>) => Object.fromEntries(map);

describe('calculateColumnWidths', () => {
  it('should leave the remaining space to the browser by default', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: fixedColumns,
      containerWidth: 500,
    });

    expect(toObject(widths)).toEqual({ a: 100, b: 100, c: 100 });
  });

  describe("resizeStrategy='grow-table'", () => {
    it('should give the remaining space to the last column when no column flexes', () => {
      const widths = calculateColumnWidths({
        actionColumnsWidth: 20,
        columns: fixedColumns,
        containerWidth: 500,
        resizeStrategy: 'grow-table',
      });

      expect(toObject(widths)).toEqual({ a: 100, b: 100, c: 280 });
    });

    it('should keep the widths when they already overflow the container', () => {
      const widths = calculateColumnWidths({
        actionColumnsWidth: 0,
        columns: fixedColumns,
        containerWidth: 500,
        getResizedColumnWidth: (key) => (key === 'a' ? 400 : undefined),
        resizeStrategy: 'grow-table',
      });

      expect(toObject(widths)).toEqual({ a: 400, b: 100, c: 100 });
    });

    it('should let flex columns absorb the remaining space', () => {
      const widths = calculateColumnWidths({
        actionColumnsWidth: 0,
        columns: [
          ...fixedColumns.slice(0, 2),
          { dataIndex: 'c', key: 'c', title: 'C' },
        ],
        containerWidth: 500,
        resizeStrategy: 'grow-table',
      });

      expect(toObject(widths)).toEqual({ a: 100, b: 100, c: 300 });
    });
  });
});
