import '@testing-library/jest-dom';
import { cleanup, render } from '../../../__test-utils__';
import { TableResizeHandle } from './TableResizeHandle';
import { TableContext, TableDataContext } from '../TableContext';

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
    setResizedColumnWidth: jest.fn(),
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
  resizable: true,
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
  column: any = testColumns[0],
  columnIndex = 0,
  contextValue: any = defaultContextValue,
  dataContextValue: any = defaultDataContextValue,
) => {
  return render(
    <TableDataContext.Provider value={dataContextValue}>
      <TableContext.Provider value={contextValue}>
        <TableResizeHandle column={column} columnIndex={columnIndex} />
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

describe('<TableResizeHandle />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render resize handle for non-last column', () => {
      const { container } = renderWithContext(testColumns[0], 0);
      const handle = container.querySelector('.mzn-table__resize-handle');

      expect(handle).toBeInTheDocument();
    });

    it('should not render resize handle for last column', () => {
      const { container } = renderWithContext(testColumns[1], 1);
      const handle = container.querySelector('.mzn-table__resize-handle');

      // The last column should not have a resize handle rendered
      // because there's no adjacent column to resize
      expect(handle).toBeNull();
    });
  });

  describe('Resize handle behavior', () => {
    it('should be a div element', () => {
      const { container } = renderWithContext(testColumns[0], 0);
      const handle = container.querySelector('.mzn-table__resize-handle');

      expect(handle?.tagName.toLowerCase()).toBe('div');
    });
  });
});
