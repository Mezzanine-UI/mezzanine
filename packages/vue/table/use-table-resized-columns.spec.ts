import { computed, shallowRef } from 'vue';
import { useTableResizedColumns } from './use-table-resized-columns';

describe('useTableResizedColumns', () => {
  describe('uncontrolled', () => {
    it('should know nothing until a width is recorded', () => {
      expect(
        useTableResizedColumns().getResizedColumnWidth('name'),
      ).toBeUndefined();
    });

    it('should expose in-progress widths before commit', () => {
      const { getResizedColumnWidth, setResizedColumnWidth } =
        useTableResizedColumns();

      setResizedColumnWidth('name', 220);

      expect(getResizedColumnWidth('name')).toBe(220);
      expect(getResizedColumnWidth('age')).toBeUndefined();
    });

    it('should let readers re-run as widths change', () => {
      const { getResizedColumnWidth, setResizedColumnWidth } =
        useTableResizedColumns();
      const width = computed(() => getResizedColumnWidth('name'));

      expect(width.value).toBeUndefined();

      setResizedColumnWidth('name', 220);

      expect(width.value).toBe(220);

      setResizedColumnWidth('name', 260);

      expect(width.value).toBe(260);
    });

    it('should keep committed widths and report all of them on change', () => {
      const onColumnWidthsChange = vi.fn();
      const state = useTableResizedColumns({ onColumnWidthsChange });

      state.setResizedColumnWidth('name', 200);
      state.setResizedColumnWidth('address', 300);
      state.commitResizedColumnWidths();

      expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
      expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
        address: 300,
        name: 200,
      });

      state.setResizedColumnWidth('age', 80);
      state.commitResizedColumnWidths();

      expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
        address: 300,
        age: 80,
        name: 200,
      });
      expect(state.getResizedColumnWidth('name')).toBe(200);
    });

    it('should not fire change when nothing was resized', () => {
      const onColumnWidthsChange = vi.fn();
      const state = useTableResizedColumns({ onColumnWidthsChange });

      state.commitResizedColumnWidths();

      expect(onColumnWidthsChange).not.toHaveBeenCalled();
    });

    it('should not fire change when the drag ends at the start widths', () => {
      const onColumnWidthsChange = vi.fn();
      const state = useTableResizedColumns({ onColumnWidthsChange });

      state.setResizedColumnWidth('name', 200);
      state.commitResizedColumnWidths();
      state.setResizedColumnWidth('name', 200);
      state.commitResizedColumnWidths();

      expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
    });

    it('should drop in-progress widths on discard without reporting', () => {
      const onColumnWidthsChange = vi.fn();
      const state = useTableResizedColumns({ onColumnWidthsChange });

      state.setResizedColumnWidth('name', 200);
      state.discardResizedColumnWidths();

      expect(state.getResizedColumnWidth('name')).toBeUndefined();
      expect(onColumnWidthsChange).not.toHaveBeenCalled();
    });
  });

  describe('controlled', () => {
    it('should read widths from columnWidths', () => {
      const state = useTableResizedColumns({
        columnWidths: () => ({ name: 180 }),
      });

      expect(state.getResizedColumnWidth('name')).toBe(180);
      expect(state.getResizedColumnWidth('age')).toBeUndefined();
    });

    it('should show drag widths, then fall back to columnWidths if the parent does not update it', () => {
      const onColumnWidthsChange = vi.fn();
      const state = useTableResizedColumns({
        columnWidths: () => ({ name: 180 }),
        onColumnWidthsChange,
      });

      state.setResizedColumnWidth('name', 220);

      expect(state.getResizedColumnWidth('name')).toBe(220);

      state.commitResizedColumnWidths();

      expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 220 });
      expect(state.getResizedColumnWidth('name')).toBe(180);
    });

    it('should follow columnWidths updates, including a reset to {}', () => {
      const columnWidths = shallowRef<Record<string, number>>({ name: 180 });
      const state = useTableResizedColumns({
        columnWidths: () => columnWidths.value,
      });
      const width = computed(() => state.getResizedColumnWidth('name'));

      columnWidths.value = { name: 240 };

      expect(width.value).toBe(240);

      columnWidths.value = {};

      expect(width.value).toBeUndefined();
    });
  });
});
