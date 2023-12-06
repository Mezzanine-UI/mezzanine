import { ArrowRightIcon } from '@mezzanine-ui/icons';
import { TableColumn } from '@mezzanine-ui/core/table';
import {
  cleanupHook,
  render,
  fireEvent,
  act,
} from '../../../__test-utils__';
import TableSortingIcon from './TableSortingIcon';
import { TableContext } from '../TableContext';
import { SortedType } from './useTableSorting';

const defaultMockingContextValue = {
  sorting: {
    onSort: () => {},
    onResetAll: () => {},
    sortedOn: '',
    sortedType: '',
  },
};

type DataType = {
  key: string;
};

const key = 'foo';
const defaultColumn = { key: 'foo', title: '', dataIndex: '' };

global.crypto.randomUUID = jest.fn().mockImplementation(() => 'UUID-UUID-UUID-UUID-UUID');

describe('<TableSortingIcon />', () => {
  afterEach(cleanupHook);

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableSortingIcon column={defaultColumn} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__icon')).toBeTruthy();
  });

  describe('sorting mode is on', () => {
    (['none', 'asc', 'desc'] as SortedType[]).forEach((mode) => {
      describe(`sortedType: ${mode}`, () => {
        let icon: HTMLElement;

        beforeEach(() => {
          const { getHostHTMLElement } = render(
            <TableContext.Provider
              value={{
                ...defaultMockingContextValue,
                sorting: {
                  ...defaultMockingContextValue.sorting,
                  sortedOn: key,
                  sortedType: mode,
                },
              }}
            >
              <TableSortingIcon column={defaultColumn} />
            </TableContext.Provider>,
          );
          const element = getHostHTMLElement();

          icon = (element as HTMLElement);
        });

        it('should styling correct', () => {
          const colorMatch = icon.getAttribute('style')?.match(mode === 'none'
            ? /--mzn-color-secondary/
            : /--mzn-color-primary/);
          const transformMatch = icon.getAttribute('style')?.match(mode === 'asc'
            ? /rotate\(-90deg\)/
            : /rotate\(90deg\)/);

          expect(icon.getAttribute('data-icon-name')).toBe(ArrowRightIcon.name);
          expect(colorMatch).not.toBe(null);
          expect(transformMatch).not.toBe(null);
        });
      });
    });

    it('onSort function should be called when icon clicked', async () => {
      let valueGetFromOnSort;

      const onSort = jest.fn<void, [TableColumn<DataType>]>((value) => {
        valueGetFromOnSort = value;
      });

      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            ...defaultMockingContextValue,
            sorting: {
              ...defaultMockingContextValue.sorting,
              onSort,
              sortedOn: key,
              sortedType: 'none',
            },
          }}
        >
          <TableSortingIcon column={defaultColumn} />
        </TableContext.Provider>,
      );
      const element = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(element);
      });

      expect(valueGetFromOnSort).toStrictEqual(defaultColumn);
    });

    it('should icon remain default state when is not sorting on its column', () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            ...defaultMockingContextValue,
            sorting: {
              ...defaultMockingContextValue.sorting,
              sortedOn: `${key}-bar`,
              sortedType: 'asc',
            },
          }}
        >
          <TableSortingIcon column={defaultColumn} />
        </TableContext.Provider>,
      );
      const element = getHostHTMLElement();

      const colorMatch = element.getAttribute('style')?.match(/--mzn-color-secondary/);
      const transformMatch = element.getAttribute('style')?.match(/rotate\(90deg\)/);

      expect(colorMatch).not.toBe(null);
      expect(transformMatch).not.toBe(null);
    });
  });

  describe('sorting mode is off', () => {
    let icon: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider value={{}}>
          <TableSortingIcon column={defaultColumn} />
        </TableContext.Provider>,
      );
      const element = getHostHTMLElement();

      icon = (element as HTMLElement);
    });

    it('should apply default state when sorting methods is not given', () => {
      const colorMatch = icon.getAttribute('style')?.match(/--mzn-color-secondary/);
      const transformMatch = icon.getAttribute('style')?.match(/rotate\(90deg\)/);

      expect(colorMatch).not.toBe(null);
      expect(transformMatch).not.toBe(null);
    });

    it('should nothing happened when icon clicked', async () => {
      await act(async () => {
        fireEvent.click(icon);
      });

      // really nothing happen here...
      expect(true);
    });
  });
});
