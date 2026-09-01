import '@testing-library/jest-dom';
import { TrashIcon } from '@mezzanine-ui/icons';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test-utils__';
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
  describe('Dropdown action accessibility', () => {
    const dropdownActions: any = {
      render: () => [
        {
          name: 'More actions',
          onSelect: jest.fn(),
          options: [{ id: '1', name: 'Option 1' }],
          type: 'dropdown',
        },
      ],
      variant: 'base-text-link',
      width: 100,
    };

    it('should give the icon-only dropdown trigger an accessible name', () => {
      renderWithContext(dropdownActions);

      expect(
        screen.getByRole('button', { name: 'More actions' }),
      ).toBeInTheDocument();
    });

    describe('menu position at the viewport edge', () => {
      const VIEWPORT_WIDTH = 1024;
      const MENU_WIDTH = 200;
      const MENU_HEIGHT = 120;
      /**
       * Row actions sit in the last column of a horizontally scrolled table, so
       * the trigger can end up past the right edge of the viewport. `bottom-end`
       * aligns the menu's right edge to the trigger's, which then overflows too.
       */
      const ANCHOR_X = 1010;

      const isPopper = (el: Element) =>
        el.hasAttribute('data-popper-placement');

      let offsetWidthDescriptor: PropertyDescriptor | undefined;
      let offsetHeightDescriptor: PropertyDescriptor | undefined;

      const domRect = (x: number, y: number, width: number, height: number) =>
        ({
          x,
          y,
          width,
          height,
          top: y,
          left: x,
          right: x + width,
          bottom: y + height,
          toJSON: () => {},
        }) as DOMRect;

      beforeEach(() => {
        // jsdom has no layout, so hand floating-ui the geometry it needs.
        Object.defineProperty(document.documentElement, 'clientWidth', {
          configurable: true,
          value: VIEWPORT_WIDTH,
        });
        Object.defineProperty(document.documentElement, 'clientHeight', {
          configurable: true,
          value: 768,
        });

        jest
          .spyOn(Element.prototype, 'getBoundingClientRect')
          .mockImplementation(function mockRect(this: Element) {
            if (isPopper(this)) return domRect(0, 0, MENU_WIDTH, MENU_HEIGHT);
            if (this.matches('button.mzn-button')) {
              return domRect(ANCHOR_X, 200, 32, 32);
            }

            return domRect(0, 0, 0, 0);
          });

        offsetWidthDescriptor = Object.getOwnPropertyDescriptor(
          HTMLElement.prototype,
          'offsetWidth',
        );
        offsetHeightDescriptor = Object.getOwnPropertyDescriptor(
          HTMLElement.prototype,
          'offsetHeight',
        );

        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
          configurable: true,
          get(this: HTMLElement) {
            return isPopper(this) ? MENU_WIDTH : 0;
          },
        });
        Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
          configurable: true,
          get(this: HTMLElement) {
            return isPopper(this) ? MENU_HEIGHT : 0;
          },
        });
      });

      afterEach(() => {
        jest.restoreAllMocks();

        if (offsetWidthDescriptor) {
          Object.defineProperty(
            HTMLElement.prototype,
            'offsetWidth',
            offsetWidthDescriptor,
          );
        }

        if (offsetHeightDescriptor) {
          Object.defineProperty(
            HTMLElement.prototype,
            'offsetHeight',
            offsetHeightDescriptor,
          );
        }
      });

      it('should keep the menu inside the viewport', async () => {
        renderWithContext(dropdownActions);

        fireEvent.click(screen.getByRole('button', { name: 'More actions' }));

        const popper = await waitFor(() => {
          const found = document.body.querySelector<HTMLElement>(
            '[data-popper-placement]',
          );

          expect(found).toBeInTheDocument();
          expect(found!.style.transform).not.toBe('');

          return found!;
        });

        const [, x] = /translate\((-?[\d.]+)px/.exec(popper.style.transform)!;

        expect(Number(x) + MENU_WIDTH).toBeLessThanOrEqual(VIEWPORT_WIDTH);
      });
    });
  });

  describe('Button action accessibility', () => {
    const iconOnlyButtonActions: any = {
      render: () => [
        {
          icon: TrashIcon,
          iconType: 'icon-only',
          name: 'Delete row',
          onClick: jest.fn(),
        },
      ],
      variant: 'base-text-link',
      width: 100,
    };

    it('should give an icon-only button action an accessible name', () => {
      renderWithContext(iconOnlyButtonActions);

      // `icon-only` renders children as the tooltip title, not button content,
      // so `name` alone leaves the button with no accessible name.
      expect(
        screen.getByRole('button', { name: 'Delete row' }),
      ).toBeInTheDocument();
    });

    it('should not add aria-label when the action text is already visible', () => {
      renderWithContext();

      const button = screen.getByRole('button', { name: 'Edit' });

      expect(button.getAttribute('aria-label')).toBeNull();
      expect(button.textContent).toBe('Edit');
    });
  });
});
