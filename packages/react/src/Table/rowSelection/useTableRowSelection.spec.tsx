import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../../__test-utils__';
import { useTableRowSelection, SELECTED_ALL_KEY } from './useTableRowSelection';

describe('useTableRowSelection()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should nothing happen when dataSource is empty', () => {
    const { result } = renderHook(
      ({ dataSource }) =>
        useTableRowSelection({
          dataSource,
        }),
      {
        initialProps: {
          dataSource: [],
        },
      },
    );

    const [, onChange] = result.current;

    TestRenderer.act(() => {
      onChange('foo');
    });

    expect(result.current[0].length).toBe(0);
  });

  describe('Group Controller', () => {
    it('should select all/clear all when clicked', () => {
      const sources = [
        {
          id: 'foo',
          name: 'foo',
        },
        {
          id: 'bar',
          name: 'bar',
        },
      ];

      const { result } = renderHook(
        ({ dataSource }) =>
          useTableRowSelection({
            dataSource,
          }),
        {
          initialProps: {
            dataSource: sources,
          },
        },
      );

      const [selectedRowKey, onChange] = result.current;

      expect(selectedRowKey.length).toBe(0);

      TestRenderer.act(() => {
        onChange(SELECTED_ALL_KEY);
      });

      expect(result.current[0].length).toBe(sources.length);

      TestRenderer.act(() => {
        onChange(SELECTED_ALL_KEY);
      });

      expect(result.current[0].length).toBe(0);
    });
  });

  describe('One Item Controller', () => {
    it('should checked/unchecked self when clicked', () => {
      const sources = [
        {
          id: 'foo',
          name: 'foo',
        },
        {
          id: 'bar',
          name: 'bar',
        },
      ];

      const { result } = renderHook(
        ({ dataSource }) =>
          useTableRowSelection({
            dataSource,
          }),
        {
          initialProps: {
            dataSource: sources,
          },
        },
      );

      const [selectedRowKey, onChange] = result.current;

      expect(selectedRowKey.length).toBe(0);

      TestRenderer.act(() => {
        onChange(sources[0].id);
      });

      expect(result.current[0].length).toBe(1);
      expect(result.current[0][0]).toBe(sources[0].id);

      TestRenderer.act(() => {
        onChange(sources[0].id);
      });

      expect(result.current[0].length).toBe(0);
    });
  });
});
