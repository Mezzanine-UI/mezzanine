import { act, cleanupHook, renderHook } from '../../../__test-utils__';
import {
  useTableResizedColumns,
  type UseTableResizedColumnsOptions,
} from './useTableResizedColumns';

const renderResizedColumns = (
  initialProps: UseTableResizedColumnsOptions = {},
) =>
  renderHook(
    (props: UseTableResizedColumnsOptions) => useTableResizedColumns(props),
    {
      initialProps,
    },
  );

describe('useTableResizedColumns', () => {
  afterEach(cleanupHook);

  describe('uncontrolled', () => {
    it('should return undefined for columns that were never resized', () => {
      const { result } = renderResizedColumns();

      expect(result.current.getResizedColumnWidth('name')).toBeUndefined();
    });

    it('should expose in-progress widths before commit', () => {
      const { result } = renderResizedColumns();

      act(() => {
        result.current.setResizedColumnWidth('name', 200);
      });

      expect(result.current.getResizedColumnWidth('name')).toBe(200);
    });

    it('should keep committed widths and report all of them on change', () => {
      const onColumnWidthsChange = jest.fn();
      const { result } = renderResizedColumns({ onColumnWidthsChange });

      act(() => {
        result.current.setResizedColumnWidth('name', 200);
        result.current.setResizedColumnWidth('address', 300);
      });
      act(() => {
        result.current.commitResizedColumnWidths();
      });

      expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
      expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
        address: 300,
        name: 200,
      });

      act(() => {
        result.current.setResizedColumnWidth('age', 80);
      });
      act(() => {
        result.current.commitResizedColumnWidths();
      });

      expect(onColumnWidthsChange).toHaveBeenLastCalledWith({
        address: 300,
        age: 80,
        name: 200,
      });
      expect(result.current.getResizedColumnWidth('name')).toBe(200);
    });

    it('should not fire change when nothing was resized', () => {
      const onColumnWidthsChange = jest.fn();
      const { result } = renderResizedColumns({ onColumnWidthsChange });

      act(() => {
        result.current.commitResizedColumnWidths();
      });

      expect(onColumnWidthsChange).not.toHaveBeenCalled();
    });

    it('should not fire change when the drag ends at the start widths', () => {
      const onColumnWidthsChange = jest.fn();
      const { result } = renderResizedColumns({ onColumnWidthsChange });

      act(() => {
        result.current.setResizedColumnWidth('name', 200);
      });
      act(() => {
        result.current.commitResizedColumnWidths();
      });
      act(() => {
        result.current.setResizedColumnWidth('name', 200);
      });
      act(() => {
        result.current.commitResizedColumnWidths();
      });

      expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
    });
    it('should drop in-progress widths on discard without reporting', () => {
      const onColumnWidthsChange = jest.fn();
      const { result } = renderResizedColumns({ onColumnWidthsChange });

      act(() => {
        result.current.setResizedColumnWidth('name', 200);
      });
      act(() => {
        result.current.discardResizedColumnWidths();
      });

      expect(result.current.getResizedColumnWidth('name')).toBeUndefined();
      expect(onColumnWidthsChange).not.toHaveBeenCalled();
    });
  });

  describe('controlled', () => {
    it('should read widths from columnWidths', () => {
      const { result } = renderResizedColumns({
        columnWidths: { name: 180 },
      });

      expect(result.current.getResizedColumnWidth('name')).toBe(180);
      expect(result.current.getResizedColumnWidth('age')).toBeUndefined();
    });

    it('should show drag widths, then fall back to columnWidths if the parent does not update it', () => {
      const onColumnWidthsChange = jest.fn();
      const { result } = renderResizedColumns({
        columnWidths: { name: 180 },
        onColumnWidthsChange,
      });

      act(() => {
        result.current.setResizedColumnWidth('name', 220);
      });

      expect(result.current.getResizedColumnWidth('name')).toBe(220);

      act(() => {
        result.current.commitResizedColumnWidths();
      });

      expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 220 });
      expect(result.current.getResizedColumnWidth('name')).toBe(180);
    });

    it('should follow columnWidths updates, including a reset to {}', () => {
      const { rerender, result } = renderResizedColumns({
        columnWidths: { name: 180 },
      });

      rerender({ columnWidths: { name: 240 } });

      expect(result.current.getResizedColumnWidth('name')).toBe(240);

      rerender({ columnWidths: {} });

      expect(result.current.getResizedColumnWidth('name')).toBeUndefined();
    });
  });
});
