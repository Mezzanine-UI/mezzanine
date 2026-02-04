import '@testing-library/jest-dom';
import { cleanup, render } from '../../../__test-utils__';
import { TableColGroup } from './TableColGroup';
import {
  TableContext,
  TableDataContext,
  TableSuperContext,
} from '../TableContext';

interface TestDataType {
  key: string;
  name: string;
  age: number;
}

const testColumns: any[] = [
  { key: 'name', dataIndex: 'name', title: 'Name' },
  { key: 'age', dataIndex: 'age', title: 'Age' },
];

const defaultContextValue = {
  actions: undefined,
  collectable: undefined,
  columnState: {
    getResizedColumnWidth: () => undefined,
    resizedColumns: {},
    setResizedColumnWidth: () => {},
  },
  dataSource: [] as TestDataType[],
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
  columns: testColumns,
  getRowKey: (record: TestDataType) => record.key,
};

const defaultSuperContextValue = {
  containerWidth: 800,
  getResizedColumnWidth: () => undefined,
  setResizedColumnWidth: () => {},
};

const renderWithContext = (
  contextValue: any = defaultContextValue,
  dataContextValue: any = defaultDataContextValue,
  superContextValue: any = defaultSuperContextValue,
) => {
  return render(
    <TableSuperContext.Provider value={superContextValue}>
      <TableDataContext.Provider value={dataContextValue}>
        <TableContext.Provider value={contextValue}>
          <table>
            <TableColGroup />
            <tbody>
              <tr>
                <td>test</td>
              </tr>
            </tbody>
          </table>
        </TableContext.Provider>
      </TableDataContext.Provider>
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

describe('<TableColGroup />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render colgroup element', () => {
      const { getHostHTMLElement } = renderWithContext();
      const colgroup = getHostHTMLElement().querySelector('colgroup');

      expect(colgroup).toBeInTheDocument();
    });

    it('should render col elements for each column', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cols = getHostHTMLElement().querySelectorAll('col');

      expect(cols).toHaveLength(testColumns.length);
    });
  });

  describe('Selection column', () => {
    it('should render selection column when selection is enabled', () => {
      const contextWithSelection = {
        ...defaultContextValue,
        selection: {
          allSelectedState: 'none' as const,
          selectedRowKeys: [],
          disabledRowKeys: [],
          onChange: jest.fn(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(contextWithSelection);
      const cols = getHostHTMLElement().querySelectorAll('col');

      // 1 selection column + 2 data columns
      expect(cols).toHaveLength(3);
    });
  });

  describe('Expansion column', () => {
    it('should render expansion column when expansion is enabled', () => {
      const contextWithExpansion = {
        ...defaultContextValue,
        expansion: {
          config: { expandedRowRender: () => <div>Expanded</div> },
          expandedKeys: [],
          expansionLeftPadding: 0,
          isRowExpanded: () => false,
          onExpand: jest.fn(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(contextWithExpansion);
      const cols = getHostHTMLElement().querySelectorAll('col');

      // 1 expansion column + 2 data columns
      expect(cols).toHaveLength(3);
    });
  });

  describe('Draggable column', () => {
    it('should render drag handle column when draggable is enabled', () => {
      const contextWithDraggable = {
        ...defaultContextValue,
        draggable: {
          enabled: true,
          onDragEnd: jest.fn(),
        },
      };

      const { getHostHTMLElement } = renderWithContext(contextWithDraggable);
      const cols = getHostHTMLElement().querySelectorAll('col');

      // 1 drag handle column + 2 data columns
      expect(cols).toHaveLength(3);
    });
  });

  describe('Pinnable column', () => {
    it('should render pin handle column when pinnable is enabled', () => {
      const contextWithPinnable = {
        ...defaultContextValue,
        pinnable: {
          enabled: true,
          onPinChange: jest.fn(),
          pinnedRowKeys: [],
        },
      };

      const { getHostHTMLElement } = renderWithContext(contextWithPinnable);
      const cols = getHostHTMLElement().querySelectorAll('col');

      // 1 pin handle column + 2 data columns
      expect(cols).toHaveLength(3);
    });
  });

  describe('Column widths', () => {
    it('should apply minWidth to columns', () => {
      const columnsWithMinWidth: any[] = [
        { key: 'name', dataIndex: 'name', title: 'Name', minWidth: 100 },
        { key: 'age', dataIndex: 'age', title: 'Age', minWidth: 50 },
      ];

      const dataContextWithMinWidth = {
        ...defaultDataContextValue,
        columns: columnsWithMinWidth,
      };

      const { getHostHTMLElement } = renderWithContext(
        defaultContextValue,
        dataContextWithMinWidth,
      );

      const cols = getHostHTMLElement().querySelectorAll('col');

      expect((cols[0] as HTMLElement).style.minWidth).toBe('100px');
      expect((cols[1] as HTMLElement).style.minWidth).toBe('50px');
    });

    it('should apply maxWidth to columns', () => {
      const columnsWithMaxWidth: any[] = [
        { key: 'name', dataIndex: 'name', title: 'Name', maxWidth: 200 },
        { key: 'age', dataIndex: 'age', title: 'Age', maxWidth: 100 },
      ];

      const dataContextWithMaxWidth = {
        ...defaultDataContextValue,
        columns: columnsWithMaxWidth,
      };

      const { getHostHTMLElement } = renderWithContext(
        defaultContextValue,
        dataContextWithMaxWidth,
      );

      const cols = getHostHTMLElement().querySelectorAll('col');

      expect((cols[0] as HTMLElement).style.maxWidth).toBe('200px');
      expect((cols[1] as HTMLElement).style.maxWidth).toBe('100px');
    });
  });
});
