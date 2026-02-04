import '@testing-library/jest-dom';
import { cleanup, render } from '../../../__test-utils__';
import { TableBody } from './TableBody';
import { TableContext, TableDataContext } from '../TableContext';
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

const testData: TestDataType[] = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jane', age: 28 },
];

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

const renderWithContext = (
  contextValue: any = defaultContextValue,
  dataContextValue: any = defaultDataContextValue,
) => {
  return render(
    <TableContext.Provider value={contextValue}>
      <TableDataContext.Provider value={dataContextValue}>
        <table>
          <TableBody />
        </table>
      </TableDataContext.Provider>
    </TableContext.Provider>,
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

describe('<TableBody />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render tbody element', () => {
      const { getHostHTMLElement } = renderWithContext();
      const tbody = getHostHTMLElement().querySelector('tbody');

      expect(tbody).toBeInTheDocument();
      expect(tbody?.classList.contains('mzn-table__body')).toBe(true);
    });

    it('should render rows for each data item', () => {
      const { getHostHTMLElement } = renderWithContext();
      const rows = getHostHTMLElement().querySelectorAll('tbody tr');

      expect(rows.length).toBe(testData.length);
    });
  });

  describe('Empty state', () => {
    it('should render empty state when dataSource is empty', () => {
      const emptyContextValue = {
        ...defaultContextValue,
        dataSource: [],
        emptyProps: { title: 'No data' },
      };
      const emptyDataContextValue = {
        ...defaultDataContextValue,
        dataSource: [],
      };

      const { getHostHTMLElement } = renderWithContext(
        emptyContextValue,
        emptyDataContextValue,
      );

      const emptyCell = getHostHTMLElement().querySelector('.mzn-table__empty');

      expect(emptyCell).toBeInTheDocument();
    });
  });

  describe('Loading state', () => {
    it('should render skeleton rows when loading', () => {
      const loadingContextValue = {
        ...defaultContextValue,
        loading: true,
        dataSource: Array.from({ length: 5 }, (_, i) => ({ key: `${i}` })),
      };
      const loadingDataContextValue = {
        ...defaultDataContextValue,
        dataSource: Array.from({ length: 5 }, (_, i) => ({ key: `${i}` })),
      };

      const { getHostHTMLElement } = renderWithContext(
        loadingContextValue,
        loadingDataContextValue,
      );

      const rows = getHostHTMLElement().querySelectorAll('tbody tr');

      expect(rows.length).toBe(5);
    });
  });
});
