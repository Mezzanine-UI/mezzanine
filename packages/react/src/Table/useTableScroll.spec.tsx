import { MouseEvent } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import useTableScroll from './useTableScroll';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('useTableScroll()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should not trigger any event handler when ref is not assigned', () => {
    const { result } = renderHook(
      () => useTableScroll({}),
    );

    const [
      tableBody,
      scrollElement,
    ] = result.current;

    expect(scrollElement.style.height).toBe('0px');

    TestRenderer.act(() => {
      scrollElement.onMouseDown({ target: null } as unknown as MouseEvent<HTMLDivElement>);
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
      tableBody.onScroll({ target: { scrollLeft: 0 } } as any);
    });

    expect(scrollElement.style.height).toBe('0px');
  });

  it('should hide scroll bar when is touch screen', () => {
    /** @TODO test */
  });

  it('should contain bar track', () => {
    /** @TODO test */
  });

  it('should update scroll bar position when clicking bar track', () => {
    /** @TODO test */
  });
});
