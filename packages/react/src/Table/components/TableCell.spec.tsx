import '@testing-library/jest-dom';
import { cleanup, render, screen } from '../../../__test-utils__';
import { TableCell } from './TableCell';
import { TableContext, TableSuperContext } from '../TableContext';

interface TestDataType {
  key: string;
  name: string;
  age: number;
}

const testColumn: any = {
  dataIndex: 'name',
  key: 'name',
  title: 'Name',
  width: 150,
} as any;

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

const defaultSuperContextValue = {
  containerWidth: 800,
  expansionLeftPadding: 0,
  getResizedColumnWidth: () => undefined,
  hasDragOrPinHandleFixed: false,
  scrollLeft: 0,
};

const renderWithContext = (
  column: any = testColumn,
  record: any = testRecord,
  contextValue: any = defaultContextValue,
  superContextValue: any = defaultSuperContextValue,
) => {
  return render(
    <TableSuperContext.Provider value={superContextValue}>
      <TableContext.Provider value={contextValue}>
        <table>
          <tbody>
            <tr>
              <TableCell
                column={column}
                columnIndex={0}
                record={record}
                rowIndex={0}
              />
            </tr>
          </tbody>
        </table>
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

describe('<TableCell />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render td element', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cell = getHostHTMLElement().querySelector('td');

      expect(cell).toBeInTheDocument();
    });

    it('should render cell content from dataIndex', () => {
      renderWithContext();

      expect(screen.getByText('John')).toBeInTheDocument();
    });
  });

  describe('Custom render', () => {
    it('should use custom render function when provided', () => {
      const customColumn = {
        ...testColumn,
        render: (record: TestDataType) => `Custom: ${record.name}`,
      } as any;

      renderWithContext(customColumn);

      expect(screen.getByText('Custom: John')).toBeInTheDocument();
    });
  });

  describe('Alignment', () => {
    it('should apply start alignment class by default', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cellContent = getHostHTMLElement().querySelector(
        '.mzn-table__cell__content',
      );

      expect(
        cellContent?.classList.contains('mzn-table__cell--align-start'),
      ).toBe(true);
    });

    it('should apply center alignment class', () => {
      const centerColumn = {
        ...testColumn,
        align: 'center',
      } as any;

      const { getHostHTMLElement } = renderWithContext(centerColumn);
      const cellContent = getHostHTMLElement().querySelector(
        '.mzn-table__cell__content',
      );

      expect(
        cellContent?.classList.contains('mzn-table__cell--align-center'),
      ).toBe(true);
    });

    it('should apply end alignment class', () => {
      const endColumn = {
        ...testColumn,
        align: 'end',
      } as any;

      const { getHostHTMLElement } = renderWithContext(endColumn);
      const cellContent = getHostHTMLElement().querySelector(
        '.mzn-table__cell__content',
      );

      expect(
        cellContent?.classList.contains('mzn-table__cell--align-end'),
      ).toBe(true);
    });
  });

  describe('Ellipsis', () => {
    it('should apply ellipsis class when ellipsis is true', () => {
      const ellipsisColumn = {
        ...testColumn,
        ellipsis: true,
      } as any;

      const { getHostHTMLElement } = renderWithContext(ellipsisColumn);
      const cellContent = getHostHTMLElement().querySelector(
        '.mzn-table__cell__content',
      );

      expect(cellContent?.classList.contains('mzn-table__cell--ellipsis')).toBe(
        true,
      );
    });
  });

  describe('Fixed columns', () => {
    it('should apply fixed start classes', () => {
      const { getHostHTMLElement } = render(
        <TableSuperContext.Provider value={defaultSuperContextValue as any}>
          <TableContext.Provider value={defaultContextValue as any}>
            <table>
              <tbody>
                <tr>
                  <TableCell
                    column={testColumn as any}
                    columnIndex={0}
                    fixed="start"
                    fixedOffset={0}
                    record={testRecord as any}
                    rowIndex={0}
                  />
                </tr>
              </tbody>
            </table>
          </TableContext.Provider>
        </TableSuperContext.Provider>,
      );

      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed')).toBe(true);
      expect(cell?.classList.contains('mzn-table__cell--fixed-start')).toBe(
        true,
      );
    });

    it('should apply fixed end classes', () => {
      const { getHostHTMLElement } = render(
        <TableSuperContext.Provider value={defaultSuperContextValue as any}>
          <TableContext.Provider value={defaultContextValue as any}>
            <table>
              <tbody>
                <tr>
                  <TableCell
                    column={testColumn as any}
                    columnIndex={0}
                    fixed="end"
                    fixedOffset={0}
                    record={testRecord as any}
                    rowIndex={0}
                  />
                </tr>
              </tbody>
            </table>
          </TableContext.Provider>
        </TableSuperContext.Provider>,
      );

      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed')).toBe(true);
      expect(cell?.classList.contains('mzn-table__cell--fixed-end')).toBe(true);
    });
  });

  describe('Loading state', () => {
    it('should render skeleton when loading', () => {
      const loadingContextValue = {
        ...defaultContextValue,
        loading: true,
      };

      const { getHostHTMLElement } = renderWithContext(
        testColumn,
        testRecord,
        loadingContextValue,
      );

      const skeleton = getHostHTMLElement().querySelector('.mzn-skeleton');

      expect(skeleton).toBeInTheDocument();
    });
  });
});
