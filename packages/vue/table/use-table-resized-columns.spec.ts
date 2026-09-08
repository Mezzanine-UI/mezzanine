import { computed } from 'vue';
import { useTableResizedColumns } from './use-table-resized-columns';

describe('useTableResizedColumns', () => {
  it('should know nothing until a width is recorded', () => {
    expect(
      useTableResizedColumns().getResizedColumnWidth('name'),
    ).toBeUndefined();
  });

  it('should hand back the width it was given', () => {
    const { getResizedColumnWidth, setResizedColumnWidth } =
      useTableResizedColumns();

    setResizedColumnWidth('name', 220);

    expect(getResizedColumnWidth('name')).toBe(220);
    expect(getResizedColumnWidth('age')).toBeUndefined();
  });

  it('should replace the map so readers re-run', () => {
    const { getResizedColumnWidth, setResizedColumnWidth } =
      useTableResizedColumns();
    const width = computed(() => getResizedColumnWidth('name'));

    expect(width.value).toBeUndefined();

    setResizedColumnWidth('name', 220);

    expect(width.value).toBe(220);

    setResizedColumnWidth('name', 260);

    expect(width.value).toBe(260);
  });
});
