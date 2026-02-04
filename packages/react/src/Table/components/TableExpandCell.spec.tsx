import '@testing-library/jest-dom';
import { cleanup, render, fireEvent } from '../../../__test-utils__';
import { TableExpandCell } from './TableExpandCell';
import { TableContext } from '../TableContext';

const defaultContextValue = {
  actions: undefined,
  collectable: undefined,
  columnState: {
    getResizedColumnWidth: () => undefined,
    resizedColumns: {},
    setResizedColumnWidth: () => {},
  },
  dataSource: [],
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
  props: Partial<React.ComponentProps<typeof TableExpandCell>> = {},
  isHeader = false,
  contextValue = defaultContextValue,
) => {
  const defaultProps = {
    expanded: false,
  };

  const Component = isHeader ? (
    <table>
      <thead>
        <tr>
          <TableExpandCell {...defaultProps} {...props} isHeader />
        </tr>
      </thead>
    </table>
  ) : (
    <table>
      <tbody>
        <tr>
          <TableExpandCell {...defaultProps} {...props} />
        </tr>
      </tbody>
    </table>
  );

  return render(
    <TableContext.Provider value={contextValue}>
      {Component}
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

describe('<TableExpandCell />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render expand icon button', () => {
      const { getHostHTMLElement } = renderWithContext();
      const button = getHostHTMLElement().querySelector(
        '.mzn-table__expand-icon',
      );

      expect(button).toBeInTheDocument();
    });

    it('should not render expand icon when isHeader is true', () => {
      const { getHostHTMLElement } = renderWithContext({}, true);
      const button = getHostHTMLElement().querySelector(
        '.mzn-table__expand-icon',
      );

      expect(button).not.toBeInTheDocument();
    });
  });

  describe('Expanded state', () => {
    it('should apply expanded class when expanded is true', () => {
      const { getHostHTMLElement } = renderWithContext({ expanded: true });
      const button = getHostHTMLElement().querySelector(
        '.mzn-table__expand-icon',
      );

      expect(
        button?.classList.contains('mzn-table__expand-icon--expanded'),
      ).toBe(true);
    });

    it('should not apply expanded class when expanded is false', () => {
      const { getHostHTMLElement } = renderWithContext({ expanded: false });
      const button = getHostHTMLElement().querySelector(
        '.mzn-table__expand-icon',
      );

      expect(
        button?.classList.contains('mzn-table__expand-icon--expanded'),
      ).toBe(false);
    });
  });

  describe('Click handler', () => {
    it('should call onClick when button is clicked', () => {
      const onClick = jest.fn();

      const { getHostHTMLElement } = renderWithContext({
        onClick,
        canExpand: true,
      });

      const button = getHostHTMLElement().querySelector(
        '.mzn-table__expand-icon',
      );

      fireEvent.click(button!);

      expect(onClick).toHaveBeenCalled();
    });

    it('should not call onClick when canExpand is false', () => {
      const onClick = jest.fn();

      const { getHostHTMLElement } = renderWithContext({
        canExpand: false,
        onClick,
      });

      // Button should not be rendered when canExpand is false
      const button = getHostHTMLElement().querySelector(
        '.mzn-table__expand-icon',
      );

      expect(button).not.toBeInTheDocument();
    });
  });

  describe('Header vs body cell', () => {
    it('should render th element when isHeader is true', () => {
      const { getHostHTMLElement } = renderWithContext({}, true);
      const th = getHostHTMLElement().querySelector('th');

      expect(th).toBeInTheDocument();
    });

    it('should render td element when isHeader is false', () => {
      const { getHostHTMLElement } = renderWithContext({}, false);
      const td = getHostHTMLElement().querySelector('td');

      expect(td).toBeInTheDocument();
    });
  });

  describe('Fixed column', () => {
    it('should apply fixed classes when fixed is true', () => {
      const { getHostHTMLElement } = renderWithContext({ fixed: true });
      const cell = getHostHTMLElement().querySelector('td');

      expect(cell?.classList.contains('mzn-table__cell--fixed')).toBe(true);
      expect(cell?.classList.contains('mzn-table__cell--fixed-start')).toBe(
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
        {},
        false,
        loadingContextValue,
      );

      const skeleton = getHostHTMLElement().querySelector('.mzn-skeleton');

      expect(skeleton).toBeInTheDocument();
    });
  });
});
