import {
  calculateColumnWidths,
  clampWidth,
  shouldCalculateWidths,
} from './calculate-column-widths';
import type { TableColumn } from './table.types';

const column = (key: string, extra: Partial<TableColumn> = {}): TableColumn =>
  ({ dataIndex: key, key, ...extra }) as TableColumn;

describe('shouldCalculateWidths', () => {
  it('should refuse for a nested table', () => {
    expect(shouldCalculateWidths(true, 800)).toBe(false);
  });

  it('should refuse before the container has been measured', () => {
    expect(shouldCalculateWidths(false, undefined)).toBe(false);
    expect(shouldCalculateWidths(false, 0)).toBe(false);
  });

  it('should allow a measured root table', () => {
    expect(shouldCalculateWidths(false, 800)).toBe(true);
  });
});

describe('clampWidth', () => {
  it('should leave a width inside the bounds alone', () => {
    expect(clampWidth(100, 50, 200)).toBe(100);
  });

  it('should raise to minWidth and lower to maxWidth', () => {
    expect(clampWidth(10, 50, 200)).toBe(50);
    expect(clampWidth(999, 50, 200)).toBe(200);
  });

  it('should ignore a bound that was not given', () => {
    expect(clampWidth(10, undefined, 200)).toBe(10);
    expect(clampWidth(999, 50, undefined)).toBe(999);
  });
});

describe('calculateColumnWidths', () => {
  it('should hand back nothing before the container has a width', () => {
    expect(
      calculateColumnWidths({
        actionColumnsWidth: 0,
        columns: [column('a')],
        containerWidth: 0,
      }).size,
    ).toBe(0);
  });

  it('should hand back nothing when the action columns already fill the row', () => {
    expect(
      calculateColumnWidths({
        actionColumnsWidth: 800,
        columns: [column('a')],
        containerWidth: 800,
      }).size,
    ).toBe(0);
  });

  it('should share what is left equally between the columns without a width', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 40,
      columns: [column('a'), column('b'), column('c')],
      containerWidth: 640,
    });

    expect([...widths.values()]).toEqual([200, 200, 200]);
  });

  it('should give the flex columns only what the fixed ones leave', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: [column('a', { width: 300 }), column('b'), column('c')],
      containerWidth: 800,
    });

    expect(widths.get('a')).toBe(300);
    expect(widths.get('b')).toBe(250);
    expect(widths.get('c')).toBe(250);
  });

  it('should clamp an explicit width to its own bounds', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: [column('a', { maxWidth: 200, width: 300 })],
      containerWidth: 800,
    });

    expect(widths.get('a')).toBe(200);
  });

  it('should clamp a flex column to its minWidth', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: [column('a', { width: 700 }), column('b', { minWidth: 150 })],
      containerWidth: 800,
    });

    expect(widths.get('b')).toBe(150);
  });

  it('should prefer a width the user dragged over the declared one', () => {
    const widths = calculateColumnWidths({
      actionColumnsWidth: 0,
      columns: [column('a', { width: 300 }), column('b')],
      containerWidth: 800,
      getResizedColumnWidth: (key) => (key === 'a' ? 500 : undefined),
    });

    expect(widths.get('a')).toBe(500);
    expect(widths.get('b')).toBe(300);
  });
});
