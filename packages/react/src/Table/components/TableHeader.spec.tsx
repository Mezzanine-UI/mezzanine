import '@testing-library/jest-dom';
import { cleanup, render } from '../../../__test-utils__';
import { TableHeader } from './TableHeader';
import {
  TableContext,
  TableDataContext,
  TableSuperContext,
} from '../TableContext';
import type { TableColumn } from '@mezzanine-ui/core/table';

interface TestDataType {
  key: string;
  name: string;
  age: number;
}

const testColumns: any[] = [
  { dataIndex: 'name', key: 'name', title: 'Name', width: 150 },
  { dataIndex: 'age', key: 'age', title: 'Age', width: 100 },
];

const testData: TestDataType[] = [{ key: '1', name: 'John', age: 32 }];

const defaultContextValue = {
  actions: undefined,
  collectable: undefined,
  columnState: {
    getResizedColumnWidth: () => undefined,
    resizedColumns: {},
    setResizedColumnWidth: () => {},
  },
  dataSource: testData,
  draggable: undefined,
  emptyProps: undefined,
  expansion: undefined,
  fixedOffsets: undefined,
  highlight: {
    columnIndex: null,
    mode: 'row' as const,
    rowIndex: null,
    setHoveredCell: () => {},
  },
  isContainerReady: true,
  isInsideExpandedContentArea: false,
  isScrollingHorizontally: false,
  loading: false,
  pagination: undefined,
  pinnable: undefined,
  resizable: false,
  rowHeight: 48,
  scroll: undefined,
  scrollContainerRef: { current: null },
  selection: undefined,
  separatorAtRowIndexes: undefined,
  size: 'main' as const,
  sorting: undefined,
  toggleable: undefined,
  transitionState: undefined,
  virtualScrollEnabled: false,
  zebraStriping: undefined,
};

const defaultDataContextValue = {
  columns: testColumns as TableColumn[],
  dataSource: testData,
};

const defaultSuperContextValue = {
  containerWidth: 800,
  expansionLeftPadding: 0,
  getResizedColumnWidth: () => undefined,
  hasDragOrPinHandleFixed: false,
  scrollLeft: 0,
};

const renderWithContext = (
  contextValue: any = defaultContextValue,
  dataContextValue: any = defaultDataContextValue,
  superContextValue: any = defaultSuperContextValue,
) => {
  return render(
    <TableDataContext.Provider value={dataContextValue}>
      <TableContext.Provider value={contextValue}>
        <TableSuperContext.Provider value={superContextValue}>
          <table>
            <TableHeader />
          </table>
        </TableSuperContext.Provider>
      </TableContext.Provider>
    </TableDataContext.Provider>,
  );
};

// Mock ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('<TableHeader />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render thead element', () => {
      const { getHostHTMLElement } = renderWithContext();
      const thead = getHostHTMLElement().querySelector('thead');

      expect(thead).toBeInTheDocument();
      expect(thead?.classList.contains('mzn-table__header')).toBe(true);
    });

    it('should render header cells for each column', () => {
      const { getHostHTMLElement } = renderWithContext();
      const headerCells = getHostHTMLElement().querySelectorAll(
        'thead th.mzn-table__header__cell',
      );

      expect(headerCells.length).toBe(testColumns.length);
    });

    it('should render column titles', () => {
      const { getHostHTMLElement } = renderWithContext();
      const headerCells = getHostHTMLElement().querySelectorAll(
        'thead th.mzn-table__header__cell',
      );

      // Check that all column titles are rendered
      const titles = Array.from(headerCells).map((cell) => cell.textContent);

      expect(titles).toContain('Name');
      expect(titles).toContain('Age');
    });
  });

  describe('Selection column', () => {
    it('should render selection column when selection is enabled', () => {
      const contextWithSelection = {
        ...defaultContextValue,
        selection: {
          mode: 'checkbox' as const,
          config: {
            mode: 'checkbox' as const,
            onChange: () => {},
            selectedRowKeys: [],
          },
          isRowSelected: () => false,
          selectedRowKeys: [],
          toggleSelectAll: () => {},
          toggleSelectRow: () => {},
        },
      };

      const { getHostHTMLElement } = renderWithContext(contextWithSelection);
      const selectionCell = getHostHTMLElement().querySelector(
        'thead th input[type="checkbox"]',
      );

      expect(selectionCell).toBeInTheDocument();
    });
  });

  describe('Resizable columns', () => {
    it('should render resize handle when resizable is true', () => {
      const contextWithResizable = {
        ...defaultContextValue,
        resizable: true,
      };

      const { getHostHTMLElement } = renderWithContext(contextWithResizable);
      const resizeHandle = getHostHTMLElement().querySelector(
        '.mzn-table__resize-handle',
      );

      expect(resizeHandle).toBeInTheDocument();
    });
  });

  describe('Sortable columns', () => {
    it('should render sort icons for sortable columns', () => {
      const sortableColumns: any[] = [
        {
          dataIndex: 'name',
          key: 'name',
          onSort: () => {},
          title: 'Name',
          width: 150,
        },
      ];

      const contextWithSorting = {
        ...defaultContextValue,
        sorting: {
          getSortOrder: () => undefined,
        },
      };

      const dataContextWithSortable = {
        ...defaultDataContextValue,
        columns: sortableColumns,
      };

      const { getHostHTMLElement } = renderWithContext(
        contextWithSorting,
        dataContextWithSortable,
      );

      const sortIcons = getHostHTMLElement().querySelector(
        '.mzn-table__sort-icons',
      );

      expect(sortIcons).toBeInTheDocument();
    });
  });
});
