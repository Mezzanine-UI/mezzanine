import '@testing-library/jest-dom';
import { cleanup, render, fireEvent } from '../../../__test-utils__';
import { TableSelectionCell } from './TableSelectionCell';
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
  props: Partial<React.ComponentProps<typeof TableSelectionCell>> = {},
  isHeader = false,
  contextValue = defaultContextValue,
) => {
  const defaultProps = {
    onChange: jest.fn(),
    selected: false,
  };

  const Component = isHeader ? (
    <table>
      <thead>
        <tr>
          <TableSelectionCell {...defaultProps} {...props} isHeader />
        </tr>
      </thead>
    </table>
  ) : (
    <table>
      <tbody>
        <tr>
          <TableSelectionCell {...defaultProps} {...props} />
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

describe('<TableSelectionCell />', () => {
  afterEach(cleanup);

  describe('Checkbox mode', () => {
    it('should render checkbox by default', () => {
      const { getHostHTMLElement } = renderWithContext();
      const checkbox = getHostHTMLElement().querySelector(
        'input[type="checkbox"]',
      );

      expect(checkbox).toBeInTheDocument();
    });

    it('should call onChange when checkbox is clicked', () => {
      const onChange = jest.fn();

      const { getHostHTMLElement } = renderWithContext({ onChange });
      const checkbox = getHostHTMLElement().querySelector(
        'input[type="checkbox"]',
      );

      fireEvent.click(checkbox!);

      expect(onChange).toHaveBeenCalled();
    });

    it('should be checked when selected is true', () => {
      const { getHostHTMLElement } = renderWithContext({ selected: true });
      const checkbox = getHostHTMLElement().querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;

      expect(checkbox.checked).toBe(true);
    });

    it('should be disabled when disabled is true', () => {
      const { getHostHTMLElement } = renderWithContext({ disabled: true });
      const checkbox = getHostHTMLElement().querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement;

      expect(checkbox.disabled).toBe(true);
    });
  });

  describe('Radio mode', () => {
    it('should render radio when mode is radio', () => {
      const { getHostHTMLElement } = renderWithContext({ mode: 'radio' });
      const radio = getHostHTMLElement().querySelector('input[type="radio"]');

      expect(radio).toBeInTheDocument();
    });

    it('should be checked when selected is true', () => {
      const { getHostHTMLElement } = renderWithContext({
        mode: 'radio',
        selected: true,
      });
      const radio = getHostHTMLElement().querySelector(
        'input[type="radio"]',
      ) as HTMLInputElement;

      expect(radio.checked).toBe(true);
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

  describe('Hidden state', () => {
    it('should not render checkbox when hidden is true', () => {
      const { getHostHTMLElement } = renderWithContext({ hidden: true });
      const checkbox = getHostHTMLElement().querySelector(
        'input[type="checkbox"]',
      );

      expect(checkbox).not.toBeInTheDocument();
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
