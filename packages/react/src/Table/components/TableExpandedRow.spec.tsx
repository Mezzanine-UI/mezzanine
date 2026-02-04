import '@testing-library/jest-dom';
import { cleanup, render } from '../../../__test-utils__';
import { TableExpandedRow } from './TableExpandedRow';
import { TableContext, TableDataContext } from '../TableContext';

interface TestDataType {
  key: string;
  name: string;
}

const testRecord: TestDataType = { key: '1', name: 'John' };

const testColumns: any[] = [{ key: 'name', dataIndex: 'name', title: 'Name' }];

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
  expansion: {
    config: { expandedRowRender: () => <div>Expanded Content</div> },
    expandedKeys: ['1'],
    expansionLeftPadding: 0,
    isRowExpanded: (key: string) => key === '1',
    onExpand: jest.fn(),
  },
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
  columns: testColumns,
  getRowKey: (record: TestDataType) => record.key,
};

const renderWithContext = (
  record: any = testRecord,
  contextValue: any = defaultContextValue,
  dataContextValue: any = defaultDataContextValue,
) => {
  return render(
    <TableDataContext.Provider value={dataContextValue as any}>
      <TableContext.Provider value={contextValue as any}>
        <table>
          <tbody>
            <TableExpandedRow record={record as any} />
          </tbody>
        </table>
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

describe('<TableExpandedRow />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render expanded row when row is expanded', () => {
      const { getHostHTMLElement } = renderWithContext();
      const row = getHostHTMLElement().querySelector('tr');

      expect(row).toBeInTheDocument();
      expect(row?.classList.contains('mzn-table__expanded-row')).toBe(true);
    });

    it('should render expanded content', () => {
      const { getHostHTMLElement } = renderWithContext();
      const content = getHostHTMLElement().querySelector(
        '.mzn-table__expanded-content',
      );

      expect(content).toBeInTheDocument();
      expect(content?.textContent).toBe('Expanded Content');
    });

    it('should set data-row-key attribute', () => {
      const { getHostHTMLElement } = renderWithContext();
      const row = getHostHTMLElement().querySelector('tr');

      expect(row?.getAttribute('data-row-key')).toBe('1-expanded');
    });
  });

  describe('Not expanded', () => {
    it('should not render when row is not expanded', () => {
      const contextNotExpanded = {
        ...defaultContextValue,
        expansion: {
          ...defaultContextValue.expansion,
          isRowExpanded: () => false,
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        contextNotExpanded,
      );

      const row = getHostHTMLElement().querySelector('tr');

      expect(row).not.toBeInTheDocument();
    });
  });

  describe('ColSpan calculation', () => {
    it('should include selection column in colSpan', () => {
      const contextWithSelection = {
        ...defaultContextValue,
        selection: {
          allSelectedState: 'none' as const,
          selectedRowKeys: [],
          disabledRowKeys: [],
          onChange: jest.fn(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        contextWithSelection,
      );

      const td = getHostHTMLElement().querySelector('td');

      // 1 column + 1 expansion + 1 selection = 3
      expect(td?.getAttribute('colspan')).toBe('3');
    });

    it('should include draggable column in colSpan', () => {
      const contextWithDraggable = {
        ...defaultContextValue,
        draggable: {
          enabled: true,
          onDragEnd: jest.fn(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        contextWithDraggable,
      );

      const td = getHostHTMLElement().querySelector('td');

      // 1 column + 1 expansion + 1 draggable = 3
      expect(td?.getAttribute('colspan')).toBe('3');
    });
  });

  describe('Transition states', () => {
    it('should apply adding class when parent row is being added', () => {
      const contextWithAdding = {
        ...defaultContextValue,
        transitionState: {
          addingKeys: new Set(['1']),
          deletingKeys: new Set<string>(),
          fadingOutKeys: new Set<string>(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        contextWithAdding,
      );

      const row = getHostHTMLElement().querySelector('tr');

      expect(row?.classList.contains('mzn-table__expanded-row--adding')).toBe(
        true,
      );
    });

    it('should apply deleting class when parent row is being deleted', () => {
      const contextWithDeleting = {
        ...defaultContextValue,
        transitionState: {
          addingKeys: new Set<string>(),
          deletingKeys: new Set(['1']),
          fadingOutKeys: new Set<string>(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        contextWithDeleting,
      );

      const row = getHostHTMLElement().querySelector('tr');

      expect(row?.classList.contains('mzn-table__expanded-row--deleting')).toBe(
        true,
      );
    });

    it('should apply fading-out class when parent row is fading out', () => {
      const contextWithFadingOut = {
        ...defaultContextValue,
        transitionState: {
          addingKeys: new Set<string>(),
          deletingKeys: new Set<string>(),
          fadingOutKeys: new Set(['1']),
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        testRecord,
        contextWithFadingOut,
      );

      const row = getHostHTMLElement().querySelector('tr');

      expect(
        row?.classList.contains('mzn-table__expanded-row--fading-out'),
      ).toBe(true);
    });
  });

  describe('Custom className and style', () => {
    it('should apply custom className', () => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider value={defaultDataContextValue as any}>
          <TableContext.Provider value={defaultContextValue as any}>
            <table>
              <tbody>
                <TableExpandedRow
                  className="custom-class"
                  record={testRecord as any}
                />
              </tbody>
            </table>
          </TableContext.Provider>
        </TableDataContext.Provider>,
      );

      const row = getHostHTMLElement().querySelector('tr');

      expect(row?.classList.contains('custom-class')).toBe(true);
    });

    it('should apply custom style', () => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider value={defaultDataContextValue as any}>
          <TableContext.Provider value={defaultContextValue as any}>
            <table>
              <tbody>
                <TableExpandedRow
                  record={testRecord as any}
                  style={{ backgroundColor: 'red' }}
                />
              </tbody>
            </table>
          </TableContext.Provider>
        </TableDataContext.Provider>,
      );

      const row = getHostHTMLElement().querySelector('tr');

      expect(row?.style.backgroundColor).toBe('red');
    });
  });
});
