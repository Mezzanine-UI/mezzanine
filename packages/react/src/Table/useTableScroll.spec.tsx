import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import useTableScroll from './useTableScroll';

describe('useTableScroll()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should not trigger any event handler when ref is not assigned', () => {
    const { result } = renderHook(
      () => useTableScroll(),
    );

    const [
      tableBody,
      scrollElement,
    ] = result.current;

    expect(scrollElement.style.height).toBe('0px');

    TestRenderer.act(() => {
      scrollElement.onMouseDown({ target: null });
    });

    TestRenderer.act(() => {
      scrollElement.onMouseUp();
    });

    TestRenderer.act(() => {
      scrollElement.onMouseEnter();
    });

    TestRenderer.act(() => {
      scrollElement.onMouseLeave();
    });

    TestRenderer.act(() => {
      tableBody.onScroll();
    });

    expect(scrollElement.style.height).toBe('0px');
  });
});
