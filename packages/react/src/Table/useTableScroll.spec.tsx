import { ReactNode, MouseEvent } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
  render,
} from '../../__test-utils__';
import useTableScroll from './useTableScroll';
import { TableDataContext } from './TableContext';

type Source = {
  key: string;
};

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
      tableBody.onScroll();
    });

    expect(scrollElement.style.height).toBe('0px');
  });

  it('should update scroll bar height when sources changed', () => {
    Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: 800 });
    Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: 200 });

    const wrapper = ({
      dataSource,
      children,
    }: {
      dataSource: Source[],
      children?: ReactNode,
    }) => (
      <TableDataContext.Provider value={{ dataSource, columns: [] }}>
        {children}
      </TableDataContext.Provider>
    );

    const { result, rerender } = renderHook(
      () => useTableScroll(),
      {
        wrapper,
        initialProps: {
          dataSource: [] as Source[],
        },
      },
    );

    const [
      body,
      scroll,
    ] = result.current;

    expect(scroll.style.height).toBe('0px');

    render(
      <div ref={body.ref}>
        <div ref={scroll.ref} />
      </div>,
    );

    rerender({
      dataSource: [{
        key: 'foo',
      }, {
        key: 'bar',
      }],
    });

    expect(result.current[1].style.height).toBe('46px');
  });
});
