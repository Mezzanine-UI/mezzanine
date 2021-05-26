import {
  TableColumn,
} from '@mezzanine-ui/core/table';
import {
  act,
  cleanupHook,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { TableDataContext, TableContext } from './TableContext';
import TableBody from './TableBody';

type DataType = {
  key: string;
  name: string;
};

const defaultSources: DataType[] = [{
  key: 'foo',
  name: 'foo',
}];

const defaultColumns: TableColumn<DataType>[] = [{
  dataIndex: 'foo',
  title: 'foo',
}];

function getTableBodyScrollBar(element: HTMLElement) {
  return element.querySelectorAll('div[role=\'button\']')[0] as HTMLDivElement;
}

function getTableBody() {
  return document.querySelector('.mzn-table__body') as HTMLElement;
}

describe('<TableBody />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TableBody ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableBody />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__body')).toBeTruthy();
  });

  it('should mapping dataSource when given', () => {
    const { getHostHTMLElement } = render(
      <TableDataContext.Provider
        value={{
          columns: defaultColumns,
          dataSource: defaultSources,
        }}
      >
        <TableBody />
      </TableDataContext.Provider>,
    );
    const host = getHostHTMLElement();

    expect(host.querySelectorAll('.mzn-table__body__row').length).toBe(defaultSources.length);
  });

  it('should display <Empty /> when no data', () => {
    const { getHostHTMLElement } = render(
      <TableDataContext.Provider
        value={{
          columns: defaultColumns,
          dataSource: [],
        }}
      >
        <TableBody />
      </TableDataContext.Provider>,
    );
    const host = getHostHTMLElement();

    expect(host.querySelector('.mzn-table__body__empty')).toBeInstanceOf(HTMLDivElement);
  });

  describe('integrate with fetchMore', () => {
    it('should display loading indicator when isFetching', () => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns: defaultColumns,
            dataSource: defaultSources,
          }}
        >
          <TableContext.Provider
            value={{
              fetchMore: {
                isFetching: true,
                isReachEnd: false,
                onFetchMore: () => {},
              },
            }}
          >
            <TableBody />
          </TableContext.Provider>
        </TableDataContext.Provider>,
      );
      const host = getHostHTMLElement();

      expect(host.querySelector('.mzn-table__body__fetchMore')).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('useTableScroll', () => {
    const scrollBarSize = 4;
    const scrollBarTop = 20;
    const scrollHeight = 800;
    const tableTop = 80;
    const tableHeight = 200;
    const mouseDownFrom = 120;
    const mouseMoveTo = 252;
    let fetchMoreTriggered = false;

    const onFetchMore = jest.fn<void, [void]>(() => {
      fetchMoreTriggered = true;
    });

    beforeEach(() => {
      fetchMoreTriggered = false;

      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: scrollHeight });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: tableHeight });

      jest.useFakeTimers();
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(0);

        return 0;
      });

      render(
        <TableContext.Provider
          value={{
            fetchMore: {
              isFetching: false,
              isReachEnd: false,
              onFetchMore,
            },
            scrollBarSize,
          }}
        >
          <TableDataContext.Provider
            value={{
              columns: [],
              dataSource: defaultSources,
            }}
          >
            <TableBody />
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );
    });

    afterEach(() => {
      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: scrollHeight });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: tableHeight });
    });

    it('should scroll bar and its child existed', () => {
      const host = getTableBody();
      const scrollBar = getTableBodyScrollBar(host);
      const scrollBarChildStyle = scrollBar.firstElementChild?.getAttribute('style');
      const widthMatch = new RegExp(`width: ${scrollBarSize}px`, 'g');

      expect(scrollBar).not.toBeNull();
      expect(scrollBarChildStyle?.match(widthMatch)).not.toBeNull();
    });

    it('should scroll bar stretching when mouse enter/leave', async () => {
      const host = getTableBody();
      let currentScrollBar = getTableBodyScrollBar(host);
      let currentScrollBarChildStyle;

      await act(async () => {
        fireEvent.mouseEnter(currentScrollBar);
      });

      currentScrollBar = getTableBodyScrollBar(host);
      currentScrollBarChildStyle = currentScrollBar.firstElementChild?.getAttribute('style');

      const widthMatch = new RegExp(`width: ${scrollBarSize + 6}px`, 'g');

      expect(currentScrollBarChildStyle?.match(widthMatch)).not.toBeNull();

      await act(async () => {
        fireEvent.mouseLeave(getTableBodyScrollBar(host));
      });

      currentScrollBar = getTableBodyScrollBar(host);
      currentScrollBarChildStyle = currentScrollBar.firstElementChild?.getAttribute('style');

      const widthMatch2 = new RegExp(`width: ${scrollBarSize}px`, 'g');

      expect(currentScrollBarChildStyle?.match(widthMatch2)).not.toBeNull();
    });

    it('should update scroll bar position when use mouse to drag', async () => {
      const host = getTableBody();
      const currentScrollBar = getTableBodyScrollBar(host);
      let newScrollBarTop;

      await act(async () => {
        fireEvent.mouseDown(currentScrollBar, {
          clientY: mouseDownFrom,
          target: {
            getBoundingClientRect: () => ({
              top: scrollBarTop,
            }),
          },
        });
      });

      const originDOMRect = host.getBoundingClientRect();

      host.getBoundingClientRect = () => ({
        ...originDOMRect,
        top: tableTop,
      });

      currentScrollBar.style.setProperty = jest.fn<void, [string, string]>((position, style) => {
        newScrollBarTop = `${position}: ${style}`;
      });

      await act(async () => {
        fireEvent.mouseMove(currentScrollBar, {
          clientY: mouseMoveTo,
        });
      });

      expect(newScrollBarTop).toBe('top: 72px');
    });

    it('should display/hide scroll bar when scrolling', async () => {
      const host = getTableBody();

      await act(async () => {
        // scroll twice to trigger clearTimeout
        fireEvent.scroll(host);
        fireEvent.scroll(host);
      });

      const currentScrollBarStyle = getTableBodyScrollBar(host)?.getAttribute('style');
      const styleMatch = new RegExp(/opacity: 1/, 'g');

      expect(currentScrollBarStyle).not.toBeUndefined();
      expect(currentScrollBarStyle?.match(styleMatch)).not.toBeNull();

      jest.runAllTimers();

      const nextScrollBarStyle = getTableBodyScrollBar(host)?.getAttribute('style');
      const nextStyleMatch = new RegExp(/opacity: 0/, 'g');

      expect(nextScrollBarStyle).not.toBeUndefined();
      expect(nextScrollBarStyle?.match(nextStyleMatch)).not.toBeNull();
    });

    it('should trigger fetchMore when scrolling position near table bottom', async () => {
      const host = getTableBody();

      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: 230 });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: 200 });

      await act(async () => {
        fireEvent.scroll(host);
      });

      expect(fetchMoreTriggered).toBe(true);
    });

    it('should set scroll bar height when sources given', () => {
      const host = getTableBody();
      const currentScrollBarStyle = getTableBodyScrollBar(host)?.getAttribute('style');
      const styleMatch = new RegExp(/height: 46px/, 'g');

      expect(currentScrollBarStyle).not.toBeUndefined();
      expect(currentScrollBarStyle?.match(styleMatch)).not.toBeNull();
    });

    describe('exceptions handle', () => {
      it('when fetchMore callback is not given', async () => {
        Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: 230 });
        Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: 200 });

        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              scrollBarSize,
            }}
          >
            <TableBody />
          </TableContext.Provider>,
        );
        const host = getHostHTMLElement();

        await act(async () => {
          fireEvent.scroll(host);
        });

        expect(true);
      });

      it('should not trigger fetchMore when is scroll below bottom (safari specific bug)', async () => {
        Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: 199 });
        Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: 200 });

        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              scrollBarSize,
              fetchMore: {
                isFetching: false,
                isReachEnd: false,
                onFetchMore,
              },
            }}
          >
            <TableBody />
          </TableContext.Provider>,
        );
        const host = getHostHTMLElement();

        await act(async () => {
          fireEvent.scroll(host);
        });

        expect(fetchMoreTriggered).toBe(false);
      });

      it('should not trigger scrolling event changes when loading', async () => {
        Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: 230 });
        Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: 200 });

        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              fetchMore: {
                isFetching: false,
                isReachEnd: false,
                onFetchMore,
              },
              loading: true,
              scrollBarSize,
            }}
          >
            <TableBody />
          </TableContext.Provider>,
        );
        const host = getHostHTMLElement();

        await act(async () => {
          fireEvent.scroll(host);
        });

        expect(fetchMoreTriggered).toBe(false);
      });
    });
  });
});
