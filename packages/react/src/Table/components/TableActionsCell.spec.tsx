import '@testing-library/jest-dom';
import { cleanup, render, screen } from '../../../__test-utils__';
import { TableActionsCell } from './TableActionsCell';
import { TableContext } from '../TableContext';

interface TestDataType {
  key: string;
  name: string;
}

const testRecord: TestDataType = { key: '1', name: 'John' };

const defaultActions: any = {
  render: () => [{ name: 'Edit', onClick: jest.fn() }],
  variant: 'base-text-link',
  width: 100,
};

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

const renderWithContext = (
  actions: any = defaultActions,
  record: any = testRecord,
  contextValue: any = defaultContextValue,
) => {
  return render(
    <TableContext.Provider value={contextValue as any}>
      <table>
        <tbody>
          <tr>
            <TableActionsCell
              actions={actions}
              columnIndex={0}
              record={record}
              rowIndex={0}
            />
          </tr>
        </tbody>
      </table>
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

describe('<TableActionsCell />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render actions cell', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cell = getHostHTMLElement().querySelector('td');

      expect(cell).toBeInTheDocument();
    });

    it('should render action button', () => {
      renderWithContext();

      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  describe('Multiple actions', () => {
    it('should render multiple action buttons', () => {
      const multipleActions: any = {
        render: () => [
          { name: 'Edit', onClick: jest.fn() },
          { name: 'Delete', onClick: jest.fn() },
        ],
        variant: 'base-text-link',
        width: 200,
      };

      renderWithContext(multipleActions);

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Fixed column', () => {
    it('should apply fixed end classes when fixed is end', () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider value={defaultContextValue as any}>
          <table>
            <tbody>
              <tr>
                <TableActionsCell
                  actions={defaultActions as any}
                  columnIndex={0}
                  fixed="end"
                  fixedOffset={0}
                  record={testRecord as any}
                  rowIndex={0}
                />
              </tr>
            </tbody>
          </table>
        </TableContext.Provider>,
      );

      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed')).toBe(true);
      expect(cell?.classList.contains('mzn-table__cell--fixed-end')).toBe(true);
    });
  });

  describe('Loading state', () => {
    it('should render empty cell when loading', () => {
      const loadingContextValue = {
        ...defaultContextValue,
        loading: true,
      };

      const { getHostHTMLElement } = renderWithContext(
        defaultActions,
        testRecord,
        loadingContextValue,
      );

      const cell = getHostHTMLElement().querySelector('td');

      // When loading, the cell should be empty (no action buttons)
      expect(cell).toBeInTheDocument();
      expect(cell?.querySelector('.mzn-table__actions-cell')).toBeNull();
    });
  });
});
