import { ReactPortal } from 'react';
import ReactDOM from 'react-dom';
import { TableColumn } from '@mezzanine-ui/core/table';
import { act, cleanupHook, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Table from './Table';

const mockTableHeaderRender = jest.fn();
const OriginalTableHeader = jest.requireActual('./TableHeader').default;

jest.mock('./TableHeader', () => {
  return function MockTableHeader(props: any) {
    mockTableHeaderRender(props);
    const React = require('react');
    return React.createElement(OriginalTableHeader, props);
  };
});

const mockLoadingRender = jest.fn();
const OriginalLoading = jest.requireActual('../Spin').default;

jest.mock('../Spin', () => {
  return function MockLoading(props: any) {
    mockLoadingRender(props);
    const React = require('react');
    return React.createElement(OriginalLoading, props);
  };
});

const mockTableRefreshRender = jest.fn();
const OriginalTableRefresh = jest.requireActual(
  './refresh/TableRefresh',
).default;

jest.mock('./refresh/TableRefresh', () => {
  return function MockTableRefresh(props: any) {
    mockTableRefreshRender(props);
    const React = require('react');
    return React.createElement(OriginalTableRefresh, props);
  };
});

const mockPaginationRender = jest.fn();
const OriginalPagination = jest.requireActual('../Pagination').default;

jest.mock('../Pagination', () => {
  return function MockPagination(props: any) {
    mockPaginationRender(props);
    const React = require('react');
    return React.createElement(OriginalPagination, props);
  };
});

type DataType = {
  key: string;
  name: string;
};

const defaultSources: DataType[] = [
  {
    key: 'foo',
    name: 'foo',
  },
  {
    key: 'bar',
    name: 'bar',
  },
];

const defaultColumns: TableColumn<DataType>[] = [
  {
    key: 'foo',
    dataIndex: 'foo',
    title: 'foo',
  },
];

const defaultProps = {
  columns: defaultColumns,
  dataSource: defaultSources,
};

function getTableBodyScrollBarTrack(element: HTMLElement) {
  return element.querySelector('.mzn-table-scroll-bar-track') as HTMLDivElement;
}

function getTableBodyScrollBar(element: HTMLElement) {
  return element.querySelector('.mzn-table-scroll-bar') as HTMLDivElement;
}

function getTableScrollContainer(element: HTMLElement) {
  return element.querySelector('.mzn-table-scroll-area') as HTMLDivElement;
}

function getTableRefreshHost(element: HTMLElement) {
  return element.querySelector('.mzn-table__refresh');
}

function getTableBody(element: HTMLElement) {
  return element.querySelector('.mzn-table__body') as HTMLElement;
}

function getTablePaginationHost(element: HTMLElement) {
  return element.querySelector('.mzn-table__pagination');
}

function getTableRowSelectionHost(element: HTMLElement) {
  return element.querySelector('.mzn-table__selections') as HTMLElement;
}

function getTableRows(element: HTMLElement) {
  return element.querySelectorAll('.mzn-table__body__row');
}

const observeCallback = jest.fn();

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: observeCallback,
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('<Table />', () => {
  afterEach(cleanupHook);

  beforeAll(() => {
    ReactDOM.createPortal = (node) => node as ReactPortal;
  });

  describeForwardRefToHTMLElement(HTMLTableElement, (ref) =>
    render(<Table {...defaultProps} ref={ref} />),
  );

  it('prop: headerClassName', () => {
    mockTableHeaderRender.mockClear();
    render(<Table {...defaultProps} headerClassName="foo" />);
    const calls = mockTableHeaderRender.mock.calls;

    expect(calls[0][0].className).toBe('foo');
  });

  it('prop: loading', () => {
    mockLoadingRender.mockClear();
    render(<Table {...defaultProps} loading />);
    const calls = mockLoadingRender.mock.calls;

    expect(calls[0][0].loading).toBe(true);
    expect(calls[0][0].stretch).toBe(true);
  });

  describe('fetchMore feature', () => {
    let fetchMoreTriggered = false;

    const onFetchMore = jest.fn<void, [void]>(() => {
      fetchMoreTriggered = true;
    });

    beforeAll(() => {
      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
        configurable: true,
        value: 230,
      });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
        configurable: true,
        value: 200,
      });
    });

    beforeEach(() => {
      fetchMoreTriggered = false;
    });

    it('should callback called when given', async () => {
      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          scroll={{ y: 200 }}
          fetchMore={{
            callback: onFetchMore,
          }}
        />,
      );
      const host = getHostHTMLElement();
      const scrollContainer = getTableScrollContainer(host);

      await act(async () => {
        fireEvent.scroll(scrollContainer);
      });

      expect(fetchMoreTriggered).toBe(true);
    });

    it('should not called callback when is reach end', async () => {
      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          fetchMore={{
            callback: onFetchMore,
            isReachEnd: true,
          }}
        />,
      );
      const host = getHostHTMLElement();
      const body = getTableBody(host);

      await act(async () => {
        fireEvent.scroll(body);
      });

      expect(fetchMoreTriggered).toBe(false);
    });

    it('should not called callback when is fetching', async () => {
      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          fetchMore={{
            callback: onFetchMore,
            isFetching: true,
          }}
        />,
      );
      const host = getHostHTMLElement();
      const body = getTableBody(host);

      await act(async () => {
        fireEvent.scroll(body);
      });

      expect(fetchMoreTriggered).toBe(false);
    });
  });

  describe('refresh feature', () => {
    it('should display refresh button when show=true', () => {
      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          refresh={{
            show: true,
          }}
        />,
      );
      const host = getHostHTMLElement();

      expect(getTableRefreshHost(host)).not.toBeNull();
    });

    it('should pass refresh needed props', () => {
      const onClick = jest.fn<void, []>(() => {});
      mockTableRefreshRender.mockClear();
      render(
        <Table
          {...defaultProps}
          refresh={{
            show: true,
            onClick,
          }}
        />,
      );
      const calls = mockTableRefreshRender.mock.calls;

      expect(calls[0][0].onClick).toBe(onClick);
    });
  });

  describe('pagination feature', () => {
    it('should display pagination when given pagination required fields', () => {
      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          pagination={{
            current: 0,
            onChange: () => {},
          }}
        />,
      );
      const host = getHostHTMLElement();

      expect(getTablePaginationHost(host)).not.toBeNull();
    });

    it('should apply correct default pagination options when not given options', () => {
      mockPaginationRender.mockClear();
      render(
        <Table
          {...defaultProps}
          pagination={{
            current: 0,
            onChange: () => {},
          }}
        />,
      );

      const calls = mockPaginationRender.mock.calls;
      const lastCallProps = calls[calls.length - 1][0];

      expect(lastCallProps.boundaryCount).toBe(1);
      expect(lastCallProps.className).toBe(undefined);
      expect(lastCallProps.pageSize).toBe(10);
      expect(lastCallProps.siblingCount).toBe(1);
      expect(lastCallProps.total).toBe(defaultProps.dataSource.length);
    });

    it('should map options into context when given custom options', () => {
      mockPaginationRender.mockClear();
      render(
        <Table
          {...defaultProps}
          pagination={{
            current: 0,
            disableAutoSlicing: true,
            onChange: () => {},
            total: 100,
            options: {
              boundaryCount: 2,
              className: 'foo',
              disabled: true,
              hideNextButton: true,
              hidePreviousButton: true,
              pageSize: 5,
              siblingCount: 2,
            },
          }}
        />,
      );

      const calls = mockPaginationRender.mock.calls;
      const lastCallProps = calls[calls.length - 1][0];

      expect(lastCallProps.boundaryCount).toBe(2);
      expect(lastCallProps.className).toBe('foo');
      expect(lastCallProps.disabled).toBe(true);
      expect(lastCallProps.hideNextButton).toBe(true);
      expect(lastCallProps.hidePreviousButton).toBe(true);
      expect(lastCallProps.pageSize).toBe(5);
      expect(lastCallProps.siblingCount).toBe(2);
      expect(lastCallProps.total).toBe(100);
    });

    it('should auto slice data when pagination enabled and disableAutoSlicing is false as default', () => {
      const pageSize = 1;

      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          pagination={{
            current: 1,
            onChange: () => {},
            options: {
              pageSize,
            },
          }}
        />,
      );
      const host = getHostHTMLElement();
      const rows = getTableRows(host);

      expect(rows.length).toBe(pageSize);
    });

    it('should not auto slice data when disableAutoSlicing set to true', () => {
      const pageSize = 1;

      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          pagination={{
            current: 1,
            disableAutoSlicing: true,
            onChange: () => {},
            options: {
              pageSize,
            },
          }}
        />,
      );
      const host = getHostHTMLElement();
      const rows = getTableRows(host);

      expect(rows.length).toBe(defaultSources.length);
    });
  });

  describe('customize table components feature', () => {
    it('should render custom cell when given', () => {
      const CustomCell = () => <div className="foo-cell">foo</div>;

      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          components={{
            body: {
              cell: CustomCell,
            },
          }}
        />,
      );
      const host = getHostHTMLElement();

      expect(host.querySelector('.foo-cell')).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('rowSelection feature', () => {
    it('should row selection onChange return all selected keys', async () => {
      let selectedRowKeys: string[] = [];

      const onChange = jest.fn<void, [string[]]>((keys) => {
        selectedRowKeys = keys;
      });

      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          rowSelection={{
            selectedRowKey: selectedRowKeys,
            onChange,
          }}
        />,
      );
      const host = getHostHTMLElement();
      const body = getTableBody(host);
      const selectionHost = getTableRowSelectionHost(body);
      const [checkbox] = selectionHost.getElementsByTagName('input');

      await act(async () => {
        fireEvent.click(checkbox);
      });

      expect(selectedRowKeys[0]).toBe(defaultSources[0].key);
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
    let host: HTMLElement;

    const onFetchMore = jest.fn<void, [void]>(() => {
      fetchMoreTriggered = true;
    });

    beforeEach(() => {
      fetchMoreTriggered = false;

      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
        configurable: true,
        value: scrollHeight,
      });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
        configurable: true,
        value: tableHeight,
      });

      jest.useFakeTimers();
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(0);

        return 0;
      });

      const { getHostHTMLElement } = render(
        <Table
          columns={[]}
          dataSource={defaultSources}
          scroll={{ y: tableHeight }}
          fetchMore={{
            isFetching: false,
            isReachEnd: false,
            callback: onFetchMore,
          }}
        />,
      );

      host = getHostHTMLElement();
    });

    afterEach(() => {
      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
        configurable: true,
        value: scrollHeight,
      });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
        configurable: true,
        value: tableHeight,
      });
    });

    it('should scroll bar / scroll bar track existed', () => {
      const scrollBarTrack = getTableBodyScrollBarTrack(host);
      const scrollBar = getTableBodyScrollBar(host);
      const scrollBarChildStyle =
        scrollBar.firstElementChild?.getAttribute('style');
      const widthMatch = new RegExp(`width: ${scrollBarSize}px`, 'g');

      expect(scrollBarTrack).not.toBeNull();
      expect(scrollBar).not.toBeNull();
      expect(scrollBarChildStyle?.match(widthMatch)).not.toBeNull();
    });

    it('should scroll bar stretching when mouse enter/leave', async () => {
      let currentScrollBar = getTableBodyScrollBar(host);
      let currentScrollBarChildStyle;

      await act(async () => {
        fireEvent.mouseEnter(currentScrollBar);
      });

      currentScrollBar = getTableBodyScrollBar(host);
      currentScrollBarChildStyle =
        currentScrollBar.firstElementChild?.getAttribute('style');

      const widthMatch = new RegExp(`width: ${scrollBarSize + 6}px`, 'g');

      expect(currentScrollBarChildStyle?.match(widthMatch)).not.toBeNull();

      await act(async () => {
        fireEvent.mouseLeave(getTableBodyScrollBar(host));
      });

      currentScrollBar = getTableBodyScrollBar(host);
      currentScrollBarChildStyle =
        currentScrollBar.firstElementChild?.getAttribute('style');

      const widthMatch2 = new RegExp(`width: ${scrollBarSize}px`, 'g');

      expect(currentScrollBarChildStyle?.match(widthMatch2)).not.toBeNull();
    });

    it('should update scroll bar position when use mouse to drag', async () => {
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

      currentScrollBar.style.setProperty = jest.fn<void, [string, string]>(
        (position, style) => {
          newScrollBarTop = `${position}: ${style}`;
        },
      );

      await act(async () => {
        fireEvent.mouseMove(currentScrollBar, {
          clientY: mouseMoveTo,
        });
      });

      expect(newScrollBarTop).toBe('transform: translate3d(0, 112px, 0)');
    });

    it('should display/hide scroll bar when scrolling', async () => {
      const scrollContainer = getTableScrollContainer(host);

      await act(async () => {
        // scroll twice to trigger clearTimeout
        fireEvent.scroll(scrollContainer);
        fireEvent.scroll(scrollContainer);
      });

      const currentScrollBarStyle =
        getTableBodyScrollBar(host)?.getAttribute('style');

      expect(currentScrollBarStyle).not.toBeUndefined();
      expect(currentScrollBarStyle?.match(/opacity: 1/g)).not.toBeNull();

      jest.runAllTimers();

      const nextScrollBarStyle =
        getTableBodyScrollBar(host)?.getAttribute('style');

      expect(nextScrollBarStyle).not.toBeUndefined();
      expect(nextScrollBarStyle?.match(/opacity: 0/g)).not.toBeNull();
    });

    it('should trigger fetchMore when scrolling position near table bottom', async () => {
      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
        configurable: true,
        value: 230,
      });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
        configurable: true,
        value: 200,
      });

      const scrollContainer = getTableScrollContainer(host);

      await act(async () => {
        fireEvent.scroll(scrollContainer);
      });

      expect(fetchMoreTriggered).toBe(true);
    });

    it('should update scroll bar position when clicked on scroll track', async () => {
      const currentScrollBar = getTableBodyScrollBar(host);
      const currentScrollBarTrack = getTableBodyScrollBarTrack(host);
      let newScrollBarTop;

      const originDOMRect = host.getBoundingClientRect();

      host.getBoundingClientRect = () => ({
        ...originDOMRect,
        top: tableTop,
      });

      currentScrollBar.style.setProperty = jest.fn<void, [string, string]>(
        (position, style) => {
          newScrollBarTop = `${position}: ${style}`;
        },
      );

      await act(async () => {
        fireEvent.click(currentScrollBarTrack, {
          clientY: mouseMoveTo,
          target: {
            getBoundingClientRect: () => ({
              top: scrollBarTop,
            }),
          },
        });
      });

      expect(newScrollBarTop).toBe('transform: translate3d(0, 144px, 0)');
    });

    it('should called ResizeObserver.observe when table existed', () => {
      expect(observeCallback).toHaveBeenCalled();
    });

    describe('exceptions handle', () => {
      it('when fetchMore callback is not given', async () => {
        Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
          configurable: true,
          value: 230,
        });
        Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
          configurable: true,
          value: 200,
        });

        const { getHostHTMLElement } = render(
          <Table columns={[]} dataSource={defaultSources} />,
        );

        const tableHost = getHostHTMLElement();

        await act(async () => {
          fireEvent.scroll(tableHost);
        });

        expect(true);
      });

      it('should not trigger fetchMore when is scroll below bottom (safari specific bug)', async () => {
        Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
          configurable: true,
          value: 199,
        });
        Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
          configurable: true,
          value: 200,
        });

        const { getHostHTMLElement } = render(
          <Table
            columns={[]}
            dataSource={defaultSources}
            fetchMore={{
              isFetching: false,
              isReachEnd: false,
              callback: onFetchMore,
            }}
          />,
        );

        const tableHost = getHostHTMLElement();

        await act(async () => {
          fireEvent.scroll(tableHost);
        });

        expect(fetchMoreTriggered).toBe(false);
      });

      it('should not trigger scrolling event changes when loading', async () => {
        Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', {
          configurable: true,
          value: 230,
        });
        Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
          configurable: true,
          value: 200,
        });

        const { getHostHTMLElement } = render(
          <Table
            columns={[]}
            dataSource={defaultSources}
            fetchMore={{
              isFetching: false,
              isReachEnd: false,
              callback: onFetchMore,
            }}
          />,
        );
        const tableHost = getHostHTMLElement();

        await act(async () => {
          fireEvent.scroll(tableHost);
        });

        expect(fetchMoreTriggered).toBe(false);
      });
    });
  });
});
