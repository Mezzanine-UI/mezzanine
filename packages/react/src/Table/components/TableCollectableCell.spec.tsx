import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '../../../__test-utils__';
import { TableCollectableCell } from './TableCollectableCell';
import { TableContext } from '../TableContext';

interface TestDataType {
  key: string;
  name: string;
}

const testRecord: TestDataType = { key: '1', name: 'John' };

const defaultContextValue = {
  actions: undefined,
  collectable: {
    collectedRowKeys: [] as string[],
    isRowDisabled: () => false,
    onCollectChange: jest.fn(),
  },
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
    record?: TestDataType;
    fixed?: boolean;
    fixedOffset?: number;
    isHeader?: boolean;
  } = {},
  contextValue: any = defaultContextValue,
) => {
  return render(
    <TableContext.Provider value={contextValue}>
      <table>
        <tbody>
          <tr>
            <TableCollectableCell
              record={(props.record ?? testRecord) as any}
              {...props}
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

describe('<TableCollectableCell />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render collectable cell', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cell = getHostHTMLElement().querySelector('td');

      expect(cell).toBeInTheDocument();
    });

    it('should render collect button', () => {
      renderWithContext();
      const button = screen.getByRole('button');

      expect(button).toBeInTheDocument();
    });

    it('should have correct aria-label when not collected', () => {
      renderWithContext();
      const button = screen.getByRole('button');

      expect(button.getAttribute('aria-label')).toBe('Add to collection');
    });
  });

  describe('Collected state', () => {
    it('should show collected state when row is collected', () => {
      const contextWithCollected = {
        ...defaultContextValue,
        collectable: {
          ...defaultContextValue.collectable,
          collectedRowKeys: ['1'],
        },
      };

      renderWithContext({}, contextWithCollected);
      const button = screen.getByRole('button');

      expect(button.getAttribute('aria-label')).toBe('Remove from collection');
      expect(button.getAttribute('aria-pressed')).toBe('true');
    });

    it('should show uncollected state when row is not collected', () => {
      renderWithContext();
      const button = screen.getByRole('button');

      expect(button.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('Collect interaction', () => {
    it('should call onCollectChange when button is clicked', () => {
      const onCollectChange = jest.fn();
      const contextWithCallback = {
        ...defaultContextValue,
        collectable: {
          ...defaultContextValue.collectable,
          onCollectChange,
        },
      };

      renderWithContext({}, contextWithCallback);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(onCollectChange).toHaveBeenCalledWith(testRecord, true);
    });

    it('should call onCollectChange with false when uncollecting', () => {
      const onCollectChange = jest.fn();
      const contextWithCollected = {
        ...defaultContextValue,
        collectable: {
          ...defaultContextValue.collectable,
          collectedRowKeys: ['1'],
          onCollectChange,
        },
      };

      renderWithContext({}, contextWithCollected);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(onCollectChange).toHaveBeenCalledWith(testRecord, false);
    });
  });

  describe('Disabled state', () => {
    it('should disable button when isRowDisabled returns true', () => {
      const contextWithDisabled = {
        ...defaultContextValue,
        collectable: {
          ...defaultContextValue.collectable,
          isRowDisabled: () => true,
        },
      };

      renderWithContext({}, contextWithDisabled);
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
      expect(button.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not call onCollectChange when disabled', () => {
      const onCollectChange = jest.fn();
      const contextWithDisabled = {
        ...defaultContextValue,
        collectable: {
          ...defaultContextValue.collectable,
          isRowDisabled: () => true,
          onCollectChange,
        },
      };

      renderWithContext({}, contextWithDisabled);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(onCollectChange).not.toHaveBeenCalled();
    });

    it('should apply disabled class when disabled', () => {
      const contextWithDisabled = {
        ...defaultContextValue,
        collectable: {
          ...defaultContextValue.collectable,
          isRowDisabled: () => true,
        },
      };

      renderWithContext({}, contextWithDisabled);
      const button = screen.getByRole('button');

      expect(
        button.classList.contains('mzn-table__collect-handle-icon--disabled'),
      ).toBe(true);
    });
  });

  describe('Fixed column', () => {
    it('should apply fixed end classes when fixed is true', () => {
      const { getHostHTMLElement } = renderWithContext({
        fixed: true,
        fixedOffset: 0,
      });

      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed')).toBe(true);
      expect(cell?.classList.contains('mzn-table__cell--fixed-end')).toBe(true);
    });

    it('should apply shadow class when showShadow is true', () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider value={defaultContextValue as any}>
          <table>
            <tbody>
              <tr>
                <TableCollectableCell
                  fixed
                  fixedOffset={0}
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

      const { getHostHTMLElement } = renderWithContext({}, loadingContextValue);
      const skeleton = getHostHTMLElement().querySelector('.mzn-skeleton');

      expect(skeleton).toBeInTheDocument();
    });
  });
});
