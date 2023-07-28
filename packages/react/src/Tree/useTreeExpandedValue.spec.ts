import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { useTreeExpandedValue } from '.';
import { TreeNodeProp } from './typings';

describe('usePickerInputValue', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const nodes: TreeNodeProp[] = [
    {
      label: '1',
      value: '1',
      nodes: [
        {
          label: '1-1',
          value: '1-1',
        },
      ],
    },
  ];

  describe('case: uncontrolled', () => {
    it('should return expanded values and be able to set via `onExpand` or `setExpandedValue`', () => {
      const { result } = renderHook(useTreeExpandedValue, {
        initialProps: {
          nodes,
        },
      });

      expect(result.current.expandedValues).toBeInstanceOf(Array);

      TestRenderer.act(() => {
        result.current.onExpand?.('1');
      });

      expect(result.current.expandedValues).toContain('1');

      TestRenderer.act(() => {
        result.current.onExpand?.('1');
      });

      expect(result.current.expandedValues.length).toBe(0);

      TestRenderer.act(() => {
        result.current.setExpandedValues(['1']);
      });

      expect(result.current.expandedValues).toContain('1');
    });
  });

  describe('case: controlled', () => {
    it('returned value should match with props`', () => {
      const expandedValues = ['1'];
      const onExpand = jest.fn();
      const { result } = renderHook(useTreeExpandedValue, {
        initialProps: {
          nodes,
          expandedValues,
          onExpand,
        },
      });

      expect(result.current.expandedValues).toEqual(expandedValues);
      expect(result.current.onExpand).toEqual(onExpand);
    });
  });
});
