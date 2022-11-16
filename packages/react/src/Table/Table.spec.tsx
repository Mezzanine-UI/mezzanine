import { ReactPortal } from 'react';
import ReactDOM from 'react-dom';
import {
  TableColumn,
} from '@mezzanine-ui/core/table';
import {
  act,
  cleanupHook,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import Table from './Table';
import TableRefresh from './refresh/TableRefresh';
import TableHeader from './TableHeader';
import Loading from '../Loading';
import Pagination from '../Pagination';

type DataType = {
  key: string;
  name: string;
};

const defaultSources: DataType[] = [{
  key: 'foo',
  name: 'foo',
}, {
  key: 'bar',
  name: 'bar',
}];

const defaultColumns: TableColumn<DataType>[] = [{
  dataIndex: 'foo',
  title: 'foo',
}];

const defaultProps = {
  columns: defaultColumns,
  dataSource: defaultSources,
};

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

describe('<Table />', () => {
  afterEach(cleanupHook);

  beforeAll(() => {
    ReactDOM.createPortal = (node) => node as ReactPortal;
  });

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <Table
        {...defaultProps}
        ref={ref}
      />,
    ),
  );

  it('prop: headerClassName', () => {
    const testInstance = TestRenderer.create(
      <Table
        {...defaultProps}
        headerClassName="foo"
      />,
    );
    const headerInstance = testInstance.root.findByType(TableHeader);

    expect(headerInstance.props.className).toBe('foo');
  });

  it('prop: loading', () => {
    const testInstance = TestRenderer.create(
      <Table
        {...defaultProps}
        loading
      />,
    );
    const loadingInstance = testInstance.root.findByType(Loading);

    expect(loadingInstance.props.loading).toBe(true);
    expect(loadingInstance.props.stretch).toBe(true);
  });

  describe('fetchMore feature', () => {
    let fetchMoreTriggered = false;

    const onFetchMore = jest.fn<void, [void]>(() => {
      fetchMoreTriggered = true;
    });

    beforeAll(() => {
      Object.defineProperty(HTMLDivElement.prototype, 'scrollHeight', { configurable: true, value: 230 });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', { configurable: true, value: 200 });
    });

    beforeEach(() => {
      fetchMoreTriggered = false;
    });

    it('should callback called when given', async () => {
      const { getHostHTMLElement } = render(
        <Table
          {...defaultProps}
          fetchMore={{
            callback: onFetchMore,
          }}
        />,
      );
      const host = getHostHTMLElement();
      const body = getTableBody(host);

      await act(async () => {
        fireEvent.scroll(body);
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
      const testInstance = TestRenderer.create(
        <Table
          {...defaultProps}
          refresh={{
            show: true,
            onClick,
          }}
        />,
      );
      const refreshInstance = testInstance.root.findByType(TableRefresh);

      expect(refreshInstance.props.onClick).toBe(onClick);
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
      const testInstance = TestRenderer.create(
        <Table
          {...defaultProps}
          pagination={{
            current: 0,
            onChange: () => {},
          }}
        />,
      );

      const paginationInstance = testInstance.root.findByType(Pagination);

      expect(paginationInstance.props.boundaryCount).toBe(1);
      expect(paginationInstance.props.className).toBe(undefined);
      expect(paginationInstance.props.pageSize).toBe(10);
      expect(paginationInstance.props.siblingCount).toBe(1);
      expect(paginationInstance.props.total).toBe(defaultProps.dataSource.length);
    });

    it('should map options into context when given custom options', () => {
      const testInstance = TestRenderer.create(
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

      const paginationInstance = testInstance.root.findByType(Pagination);

      expect(paginationInstance.props.boundaryCount).toBe(2);
      expect(paginationInstance.props.className).toBe('foo');
      expect(paginationInstance.props.disabled).toBe(true);
      expect(paginationInstance.props.hideNextButton).toBe(true);
      expect(paginationInstance.props.hidePreviousButton).toBe(true);
      expect(paginationInstance.props.pageSize).toBe(5);
      expect(paginationInstance.props.siblingCount).toBe(2);
      expect(paginationInstance.props.total).toBe(100);
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
      const CustomCell = () => (
        <div className="foo-cell">
          foo
        </div>
      );

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
});
