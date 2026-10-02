import '@testing-library/jest-dom';
import { OverlayScrollbars } from 'overlayscrollbars';
import { cleanup, render, screen } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Table from '.';
import type {
  TableColumn,
  TableDataSourceWithKey,
} from '@mezzanine-ui/core/table';

interface TestDataType extends TableDataSourceWithKey {
  name: string;
  age: number;
}

const testColumns: TableColumn<TestDataType>[] = [
  {
    dataIndex: 'name',
    key: 'name',
    title: 'Name',
    width: 150,
  },
  {
    dataIndex: 'age',
    key: 'age',
    title: 'Age',
    width: 100,
  },
];

const testData: TestDataType[] = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jane', age: 28 },
  { key: '3', name: 'Bob', age: 45 },
];

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('<Table />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Table ref={ref} columns={testColumns} dataSource={testData} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Table
        className={className}
        columns={testColumns}
        dataSource={testData}
      />,
    ),
  );

  describe('Basic rendering', () => {
    it('should render table with columns and data', () => {
      render(<Table columns={testColumns} dataSource={testData} />);

      // Check column headers
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();

      // Check data rows
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('should render with main size by default', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} />,
      );

      const table = getHostHTMLElement().querySelector('table');

      expect(table?.classList.contains('mzn-table--main')).toBe(true);
    });

    it('should render with sub size when specified', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} size="sub" />,
      );

      const table = getHostHTMLElement().querySelector('table');

      expect(table?.classList.contains('mzn-table--sub')).toBe(true);
    });
  });

  describe('showHeader prop', () => {
    it('should show header by default', () => {
      render(<Table columns={testColumns} dataSource={testData} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should hide header when showHeader is false', () => {
      render(
        <Table
          columns={testColumns}
          dataSource={testData}
          showHeader={false}
        />,
      );

      expect(screen.queryByText('Name')).not.toBeInTheDocument();
    });
  });

  describe('fullWidth prop', () => {
    it('should apply 100% width when fullWidth is true', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} fullWidth />,
      );

      const table = getHostHTMLElement().querySelector('table');

      expect(table?.style.width).toBe('100%');
    });
  });

  describe('scrollbarOptions prop', () => {
    const getScrollbarOptions = (host: HTMLElement) => {
      const scrollHost = host.querySelector<HTMLElement>('.mzn-scrollbar');
      const instance = scrollHost ? OverlayScrollbars(scrollHost) : undefined;

      if (!instance) throw new Error('OverlayScrollbars was not initialised');

      return instance.options();
    };

    it('should keep the Scrollbar defaults when not provided', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} />,
      );
      const options = getScrollbarOptions(getHostHTMLElement());

      expect(options.overflow).toEqual({ x: 'scroll', y: 'scroll' });
      expect(options.scrollbars.autoHide).toBe('scroll');
    });

    it('should forward scrollbarOptions to the inner Scrollbar', () => {
      const { getHostHTMLElement } = render(
        <Table
          columns={testColumns}
          dataSource={testData}
          scrollbarOptions={{
            overflow: { x: 'visible', y: 'visible' },
            scrollbars: { autoHide: 'never' },
          }}
        />,
      );
      const options = getScrollbarOptions(getHostHTMLElement());

      expect(options.overflow).toEqual({ x: 'visible', y: 'visible' });
      expect(options.scrollbars.autoHide).toBe('never');
    });

    it('should not create a Scrollbar for nested tables', () => {
      const { getHostHTMLElement } = render(
        <Table
          columns={testColumns}
          dataSource={testData}
          nested
          scrollbarOptions={{ overflow: { x: 'visible' } }}
        />,
      );

      expect(getHostHTMLElement().querySelector('.mzn-scrollbar')).toBeNull();
    });
  });

  describe('Intrinsic width containment', () => {
    it('should contain the scroll area and render a hidden sizer', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} />,
      );
      const host = getHostHTMLElement();
      const sizer = host.querySelector('.mzn-table__intrinsic-sizer');

      expect(
        host.querySelector('.mzn-scrollbar.mzn-table-scroll-area'),
      ).not.toBeNull();
      expect(sizer?.tagName.toLowerCase()).toBe('svg');
      expect(sizer).toHaveAttribute('aria-hidden', 'true');
      expect(sizer).toHaveAttribute('focusable', 'false');
    });

    it('should skip containment and the sizer for nested tables', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} nested />,
      );
      const host = getHostHTMLElement();

      expect(host.querySelector('.mzn-table-scroll-area')).toBeNull();
      expect(host.querySelector('.mzn-table__intrinsic-sizer')).toBeNull();
    });

    it('should expose the measured table width as a CSS variable', () => {
      const OriginalResizeObserver = global.ResizeObserver;
      const callbacks: ResizeObserverCallback[] = [];

      global.ResizeObserver = class {
        constructor(callback: ResizeObserverCallback) {
          callbacks.push(callback);
        }

        observe() {}
        unobserve() {}
        disconnect() {}
      } as unknown as typeof ResizeObserver;

      try {
        const { getHostHTMLElement } = render(
          <Table columns={testColumns} dataSource={testData} />,
        );
        const host = getHostHTMLElement();
        const table = host.querySelector('table') as HTMLTableElement;

        Object.defineProperty(table, 'scrollWidth', { value: 1180 });
        callbacks.forEach((callback) => callback([], {} as ResizeObserver));

        expect(host.style.getPropertyValue('--mzn-table-intrinsic-width')).toBe(
          '1180px',
        );
      } finally {
        global.ResizeObserver = OriginalResizeObserver;
      }
    });
  });

  describe('Empty state', () => {
    it('should render empty state when dataSource is empty', () => {
      render(
        <Table
          columns={testColumns}
          dataSource={[]}
          emptyProps={{ title: 'No data available' }}
        />,
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should render skeleton rows when loading', () => {
      const { getHostHTMLElement } = render(
        <Table
          columns={testColumns}
          dataSource={[]}
          loading
          loadingRowsCount={5}
        />,
      );

      const rows = getHostHTMLElement().querySelectorAll('tbody tr');

      expect(rows.length).toBe(5);
    });
  });

  describe('Actions column', () => {
    it('should render actions column when actions prop is provided', () => {
      render(
        <Table
          actions={{
            render: () => [{ name: 'Edit', onClick: () => {} }],
            title: 'Actions',
            width: 100,
          }}
          columns={testColumns}
          dataSource={testData}
        />,
      );

      expect(screen.getByText('Actions')).toBeInTheDocument();
      expect(screen.getAllByText('Edit').length).toBe(testData.length);
    });
  });

  describe('Row selection', () => {
    it('should render checkbox selection when mode is checkbox', () => {
      const { getHostHTMLElement } = render(
        <Table
          columns={testColumns}
          dataSource={testData}
          rowSelection={{
            mode: 'checkbox',
            onChange: () => {},
            selectedRowKeys: [],
          }}
        />,
      );

      const checkboxes = getHostHTMLElement().querySelectorAll(
        'input[type="checkbox"]',
      );

      // Header checkbox + row checkboxes
      expect(checkboxes.length).toBe(testData.length + 1);
    });

    it('should render radio selection when mode is radio', () => {
      const { getHostHTMLElement } = render(
        <Table
          columns={testColumns}
          dataSource={testData}
          rowSelection={{
            mode: 'radio',
            onChange: () => {},
            selectedRowKey: undefined,
          }}
        />,
      );

      const radios = getHostHTMLElement().querySelectorAll(
        'input[type="radio"]',
      );

      expect(radios.length).toBe(testData.length);
    });
  });

  describe('Pagination', () => {
    it('should render pagination when pagination prop is provided', () => {
      render(
        <Table
          columns={testColumns}
          dataSource={testData}
          pagination={{
            current: 1,
            onChange: () => {},
            pageSize: 10,
            total: 100,
          }}
        />,
      );

      // Check if pagination is rendered
      const paginationElement = document.querySelector('.mzn-pagination');

      expect(paginationElement).toBeInTheDocument();
    });
  });

  describe('Zebra striping', () => {
    it('should apply zebra striping class to alternate rows', () => {
      const { getHostHTMLElement } = render(
        <Table columns={testColumns} dataSource={testData} zebraStriping />,
      );

      const rows = getHostHTMLElement().querySelectorAll('tbody tr');

      // Even rows (0-indexed) should not have zebra class
      // Odd rows should have zebra class
      expect(rows[1]?.classList.contains('mzn-table__body__row--zebra')).toBe(
        true,
      );
    });
  });

  describe('Separator rows', () => {
    it('should apply separator class at specified row indexes', () => {
      const { getHostHTMLElement } = render(
        <Table
          columns={testColumns}
          dataSource={testData}
          separatorAtRowIndexes={[1]}
        />,
      );

      const rows = getHostHTMLElement().querySelectorAll('tbody tr');

      expect(
        rows[1]?.classList.contains('mzn-table__body__row--separator'),
      ).toBe(true);
    });
  });
});
