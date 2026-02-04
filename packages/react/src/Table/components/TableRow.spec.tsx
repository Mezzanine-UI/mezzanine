import '@testing-library/jest-dom';
import { cleanup, render, screen } from '../../../__test-utils__';
import { TableRow } from './TableRow';
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

const testRecord: TestDataType = { key: '1', name: 'John', age: 32 };

const defaultContextValue = {
  actions: undefined,
  collectable: undefined,
  columnState: {
    getResizedColumnWidth: () => undefined,
    resizedColumns: {},
    setResizedColumnWidth: () => {},
  },
  dataSource: [testRecord],
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
  dataSource: [testRecord],
};

const defaultSuperContextValue = {
  containerWidth: 800,
  expansionLeftPadding: 0,
  getResizedColumnWidth: () => undefined,
  hasDragOrPinHandleFixed: false,
  scrollLeft: 0,
};

const renderWithContext = (
  record: any = testRecord,
  rowIndex = 0,
  contextValue: any = defaultContextValue,
  dataContextValue: any = defaultDataContextValue,
  superContextValue: any = defaultSuperContextValue,
) => {
  return render(
    <TableSuperContext.Provider value={superContextValue}>
      <TableContext.Provider value={contextValue}>
        <TableDataContext.Provider value={dataContextValue}>
          <table>
            <tbody>
              <TableRow record={record} rowIndex={rowIndex} />
            </tbody>
          </table>
        </TableDataContext.Provider>
      </TableContext.Provider>
    </TableSuperContext.Provider>,
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

describe('<TableRow />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render tr element with correct class', () => {
      const { getHostHTMLElement } = renderWithContext();
      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row).toBeInTheDocument();
      expect(row?.classList.contains('mzn-table__body__row')).toBe(true);
    });

    it('should render cells for each column', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cells = getHostHTMLElement().querySelectorAll('tbody tr td');

      expect(cells.length).toBe(testColumns.length);
    });

    it('should render cell content from dataIndex', () => {
      renderWithContext();

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('32')).toBeInTheDocument();
    });

    it('should set data-row-key attribute', () => {
      const { getHostHTMLElement } = renderWithContext();
      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.getAttribute('data-row-key')).toBe('1');
    });
  });

  describe('Zebra striping', () => {
    it('should apply zebra class to odd rows when zebraStriping is true', () => {
      const contextWithZebra = {
        ...defaultContextValue,
        zebraStriping: true,
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        1, // Odd row index
        contextWithZebra,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--zebra')).toBe(true);
    });

    it('should not apply zebra class to even rows', () => {
      const contextWithZebra = {
        ...defaultContextValue,
        zebraStriping: true,
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        0, // Even row index
        contextWithZebra,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--zebra')).toBe(
        false,
      );
    });
  });

  describe('Separator rows', () => {
    it('should apply separator class when row index is in separatorAtRowIndexes', () => {
      const contextWithSeparator = {
        ...defaultContextValue,
        separatorAtRowIndexes: [0],
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        0,
        contextWithSeparator,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--separator')).toBe(
        true,
      );
    });
  });

  describe('Selection', () => {
    it('should apply selected class when row is selected', () => {
      const contextWithSelection = {
        ...defaultContextValue,
        selection: {
          mode: 'checkbox' as const,
          config: {
            mode: 'checkbox' as const,
            onChange: () => {},
            selectedRowKeys: ['1'],
          },
          isRowSelected: (key: string) => key === '1',
          isRowDisabled: () => false,
          selectedRowKeys: ['1'],
          toggleSelectAll: () => {},
          toggleSelectRow: () => {},
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        0,
        contextWithSelection,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--selected')).toBe(
        true,
      );
    });
  });

  describe('Transition states', () => {
    it('should apply adding class when row is in addingKeys', () => {
      const contextWithTransition = {
        ...defaultContextValue,
        transitionState: {
          addingKeys: new Set(['1']),
          deletingKeys: new Set<string>(),
          fadingOutKeys: new Set<string>(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        0,
        contextWithTransition,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--adding')).toBe(
        true,
      );
    });

    it('should apply deleting class when row is in deletingKeys', () => {
      const contextWithTransition = {
        ...defaultContextValue,
        transitionState: {
          addingKeys: new Set<string>(),
          deletingKeys: new Set(['1']),
          fadingOutKeys: new Set<string>(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        0,
        contextWithTransition,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--deleting')).toBe(
        true,
      );
    });

    it('should apply fading-out class when row is in fadingOutKeys', () => {
      const contextWithTransition = {
        ...defaultContextValue,
        transitionState: {
          addingKeys: new Set<string>(),
          deletingKeys: new Set<string>(),
          fadingOutKeys: new Set(['1']),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        0,
        contextWithTransition,
      );

      const row = getHostHTMLElement().querySelector('tbody tr');

      expect(row?.classList.contains('mzn-table__body__row--fading-out')).toBe(
        true,
      );
    });
  });
});
