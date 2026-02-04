import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '../../../__test-utils__';
import { TableDragOrPinHandleCell } from './TableDragOrPinHandleCell';
import { TableContext } from '../TableContext';

interface TestDataType {
  key: string;
  name: string;
}

const testRecord: TestDataType = { key: '1', name: 'John' };

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
  props: {
    isHeader?: boolean;
    mode: 'drag' | 'pin';
    record?: any;
    fixed?: boolean;
    fixedOffset?: number;
    dragHandleProps?: Record<string, unknown>;
  },
  contextValue: any = defaultContextValue,
) => {
  return render(
    <TableContext.Provider value={contextValue as any}>
      <table>
        <tbody>
          <tr>
            <TableDragOrPinHandleCell {...(props as any)} />
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

describe('<TableDragOrPinHandleCell />', () => {
  afterEach(cleanup);

  describe('Drag mode', () => {
    it('should render drag handle in body cell', () => {
      const { getHostHTMLElement } = renderWithContext({
        mode: 'drag',
        record: testRecord,
      });

      const cell = getHostHTMLElement().querySelector('td');
      const handle = cell?.querySelector('.mzn-table__drag-or-pin-handle');

      expect(cell).toBeInTheDocument();
      expect(handle).toBeInTheDocument();
    });

    it('should render th element when isHeader is true', () => {
      const { getHostHTMLElement } = renderWithContext({
        isHeader: true,
        mode: 'drag',
      });

      const cell = getHostHTMLElement().querySelector('th');

      expect(cell).toBeInTheDocument();
    });

    it('should not render icon in header cell', () => {
      const { getHostHTMLElement } = renderWithContext({
        isHeader: true,
        mode: 'drag',
      });

      const cell = getHostHTMLElement().querySelector('th');
      const handle = cell?.querySelector('.mzn-table__drag-or-pin-handle');

      expect(handle).not.toBeInTheDocument();
    });

    it('should pass dragHandleProps to handle span', () => {
      const dragHandleProps = { 'data-testid': 'drag-handle' };

      renderWithContext({
        dragHandleProps,
        mode: 'drag',
        record: testRecord,
      });

      expect(screen.getByTestId('drag-handle')).toBeInTheDocument();
    });
  });

  describe('Pin mode', () => {
    it('should render pin button in body cell', () => {
      const contextWithPinnable = {
        ...defaultContextValue,
        pinnable: {
          enabled: true,
          onPinChange: jest.fn(),
          pinnedRowKeys: [] as string[],
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        {
          mode: 'pin',
          record: testRecord,
        },
        contextWithPinnable,
      );

      const cell = getHostHTMLElement().querySelector('td');
      const button = cell?.querySelector('button');

      expect(button).toBeInTheDocument();
      expect(button?.getAttribute('aria-label')).toBe('Pin row');
    });

    it('should show pinned state when row is pinned', () => {
      const contextWithPinnedRow = {
        ...defaultContextValue,
        pinnable: {
          enabled: true,
          onPinChange: jest.fn(),
          pinnedRowKeys: ['1'],
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        {
          mode: 'pin',
          record: testRecord,
        },
        contextWithPinnedRow,
      );

      const button = getHostHTMLElement().querySelector('button');

      expect(button?.getAttribute('aria-label')).toBe('Unpin row');
      expect(button?.getAttribute('aria-pressed')).toBe('true');
    });

    it('should call onPinChange when pin button is clicked', () => {
      const onPinChange = jest.fn();
      const contextWithPinnable = {
        ...defaultContextValue,
        pinnable: {
          enabled: true,
          onPinChange,
          pinnedRowKeys: [] as string[],
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        {
          mode: 'pin',
          record: testRecord,
        },
        contextWithPinnable,
      );

      const button = getHostHTMLElement().querySelector('button');

      fireEvent.click(button!);

      expect(onPinChange).toHaveBeenCalledWith(testRecord, true);
    });

    it('should call onPinChange with false when unpinning', () => {
      const onPinChange = jest.fn();
      const contextWithPinnedRow = {
        ...defaultContextValue,
        pinnable: {
          enabled: true,
          onPinChange,
          pinnedRowKeys: ['1'],
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        {
          mode: 'pin',
          record: testRecord,
        },
        contextWithPinnedRow,
      );

      const button = getHostHTMLElement().querySelector('button');

      fireEvent.click(button!);

      expect(onPinChange).toHaveBeenCalledWith(testRecord, false);
    });
  });

  describe('Fixed column', () => {
    it('should apply fixed classes when fixed is true', () => {
      const { getHostHTMLElement } = renderWithContext({
        fixed: true,
        fixedOffset: 0,
        mode: 'drag',
        record: testRecord,
      });

      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed')).toBe(true);
      expect(cell?.classList.contains('mzn-table__cell--fixed-start')).toBe(
        true,
      );
    });

    it('should apply shadow class when showShadow is true', () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider value={defaultContextValue as any}>
          <table>
            <tbody>
              <tr>
                <TableDragOrPinHandleCell
                  fixed
                  fixedOffset={0}
                  mode="drag"
                  record={testRecord as any}
                  showShadow
                />
              </tr>
            </tbody>
          </table>
        </TableContext.Provider>,
      );

      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed-shadow')).toBe(
        true,
      );
    });
  });

  describe('Loading state', () => {
    it('should render skeleton when loading', () => {
      const loadingContextValue = {
        ...defaultContextValue,
        loading: true,
      };

      const { getHostHTMLElement } = renderWithContext(
        {
          mode: 'drag',
          record: testRecord,
        },
        loadingContextValue,
      );

      const skeleton = getHostHTMLElement().querySelector('.mzn-skeleton');

      expect(skeleton).toBeInTheDocument();
    });
  });
});
