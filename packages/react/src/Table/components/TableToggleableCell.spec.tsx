import '@testing-library/jest-dom';
import { cleanup, fireEvent, render } from '../../../__test-utils__';
import { TableToggleableCell } from './TableToggleableCell';
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
  toggleable: {
    isRowDisabled: () => false,
    onToggleChange: jest.fn(),
    toggledRowKeys: [] as string[],
  },
  transitionState: undefined,
  virtualScrollEnabled: false,
  zebraStriping: undefined,
};

const renderWithContext = (
  props: {
    record?: TestDataType;
    fixed?: boolean;
    fixedOffset?: number;
  } = {},
  contextValue: any = defaultContextValue,
) => {
  return render(
    <TableContext.Provider value={contextValue}>
      <table>
        <tbody>
          <tr>
            <TableToggleableCell
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

describe('<TableToggleableCell />', () => {
  afterEach(cleanup);

  describe('Basic rendering', () => {
    it('should render toggleable cell', () => {
      const { getHostHTMLElement } = renderWithContext();
      const cell = getHostHTMLElement().querySelector('td');

      expect(cell).toBeInTheDocument();
    });

    it('should render toggle switch', () => {
      const { getHostHTMLElement } = renderWithContext();
      const toggle = getHostHTMLElement().querySelector('.mzn-toggle');

      expect(toggle).toBeInTheDocument();
    });
  });

  describe('Toggle state', () => {
    it('should show unchecked state by default', () => {
      const { getHostHTMLElement } = renderWithContext();
      const input = getHostHTMLElement().querySelector('input');

      expect(input?.checked).toBe(false);
    });

    it('should show checked state when row is toggled', () => {
      const contextWithToggled = {
        ...defaultContextValue,
        toggleable: {
          ...defaultContextValue.toggleable,
          toggledRowKeys: ['1'],
        },
      };

      const { getHostHTMLElement } = renderWithContext({}, contextWithToggled);
      const input = getHostHTMLElement().querySelector('input');

      expect(input?.checked).toBe(true);
    });
  });

  describe('Toggle interaction', () => {
    it('should call onToggleChange when toggle is clicked', () => {
      const onToggleChange = jest.fn();
      const contextWithCallback = {
        ...defaultContextValue,
        toggleable: {
          ...defaultContextValue.toggleable,
          onToggleChange,
        },
      };

      const { getHostHTMLElement } = renderWithContext({}, contextWithCallback);
      const input = getHostHTMLElement().querySelector('input');

      fireEvent.click(input!);

      expect(onToggleChange).toHaveBeenCalledWith(testRecord, true);
    });

    it('should call onToggleChange with false when turning off', () => {
      const onToggleChange = jest.fn();
      const contextWithToggledOn = {
        ...defaultContextValue,
        toggleable: {
          ...defaultContextValue.toggleable,
          onToggleChange,
          toggledRowKeys: ['1'],
        },
      };

      const { getHostHTMLElement } = renderWithContext(
        {},
        contextWithToggledOn,
      );
      const input = getHostHTMLElement().querySelector('input');

      fireEvent.click(input!);

      expect(onToggleChange).toHaveBeenCalledWith(testRecord, false);
    });
  });

  describe('Disabled state', () => {
    it('should disable toggle when isRowDisabled returns true', () => {
      const contextWithDisabled = {
        ...defaultContextValue,
        toggleable: {
          ...defaultContextValue.toggleable,
          isRowDisabled: () => true,
        },
      };

      const { getHostHTMLElement } = renderWithContext({}, contextWithDisabled);
      const input = getHostHTMLElement().querySelector('input');

      expect(input?.disabled).toBe(true);
    });

    it('should not call onToggleChange when disabled', () => {
      const onToggleChange = jest.fn();
      const contextWithDisabled = {
        ...defaultContextValue,
        toggleable: {
          ...defaultContextValue.toggleable,
          isRowDisabled: () => true,
          onToggleChange,
        },
      };

      const { getHostHTMLElement } = renderWithContext({}, contextWithDisabled);
      const input = getHostHTMLElement().querySelector('input');

      fireEvent.click(input!);

      expect(onToggleChange).not.toHaveBeenCalled();
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
                <TableToggleableCell
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
