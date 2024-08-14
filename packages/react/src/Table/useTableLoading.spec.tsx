import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { useTableLoading } from './useTableLoading';

describe('useTableLoading()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should change loading status when onChange triggered', () => {
    const { result } = renderHook(() => useTableLoading({}));

    const [loading, setLoading] = result.current;

    expect(loading).toBe(false);

    TestRenderer.act(() => {
      setLoading(true);
    });

    expect(result.current[0]).toBe(true);

    TestRenderer.act(() => {
      setLoading(true);
    });

    expect(result.current[0]).toBe(true);
  });
});
