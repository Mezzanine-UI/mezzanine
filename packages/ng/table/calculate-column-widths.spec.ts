import { sanitizeColumnWidths } from './calculate-column-widths';

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
