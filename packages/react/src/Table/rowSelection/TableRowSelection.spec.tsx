import {
  cleanupHook,
  render,
  fireEvent,
  act,
} from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../../__test-utils__/common';
import { TableContext, TableDataContext } from '../TableContext';
import TableRowSelection from './TableRowSelection';
import { SELECTED_ALL_KEY } from './useTableRowSelection';

const dataLength = 10;
const defaultDataContext = {
  columns: [],
  dataSource: Array.from(Array(dataLength)).map((_, idx) => ({
    key: `source-${idx + 1}`,
  })),
};

describe('<TableRowSelection />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TableRowSelection ref={ref} rowKey="any" />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableRowSelection rowKey="any" />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__selections')).toBeTruthy();
  });

  it('prop: setChecked', async () => {
    let checkState;
    const setChecked = jest.fn<void, [boolean]>((check) => {
      checkState = check;
    });

    render(
      <TableRowSelection
        rowKey="any"
        setChecked={setChecked}
      />,
    );

    expect(setChecked).toHaveBeenCalledTimes(1);
    expect(checkState).toBe(false);
  });

  describe('in body', () => {
    const myKey = defaultDataContext.dataSource[0].key;
    let selectedRowKeys: string[];

    const onChange = jest.fn<void, [string]>((key) => {
      if (selectedRowKeys.includes(myKey)) {
        selectedRowKeys = [];
      } else {
        selectedRowKeys = [
          ...selectedRowKeys,
          key,
        ];
      }
    });

    beforeEach(() => {
      selectedRowKeys = [];
    });

    it('should onChange called when clicked', async () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            rowSelection: {
              selectedRowKeys,
              onChange,
            },
          }}
        >
          <TableDataContext.Provider
            value={defaultDataContext}
          >
            <TableRowSelection
              rowKey={myKey}
            />
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const element = getHostHTMLElement();
      const [checkbox] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.click(checkbox);
      });

      expect(selectedRowKeys[0]).toBe(myKey);
    });

    it('should nothing happened when clicked if rowSelection is not given', async () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{}}
        >
          <TableDataContext.Provider
            value={defaultDataContext}
          >
            <TableRowSelection rowKey={myKey} />
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const element = getHostHTMLElement();
      const [checkbox] = element.getElementsByTagName('input');

      await act(async () => {
        fireEvent.click(checkbox);
      });

      expect(true);
    });

    it('should checked when row key is included in selectedRowKey', () => {
      selectedRowKeys = [myKey];

      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            rowSelection: {
              selectedRowKeys,
              onChange,
            },
          }}
        >
          <TableDataContext.Provider
            value={defaultDataContext}
          >
            <TableRowSelection rowKey={myKey} />
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const element = getHostHTMLElement();
      const [checkbox] = element.getElementsByTagName('input');

      expect(checkbox.getAttribute('aria-checked')).toBe('true');
    });

    describe('when expanding feature enabled', () => {
      let element: HTMLElement;

      beforeEach(() => {
        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              expanding: {
                expandedRowRender: () => '',
              },
              rowSelection: {
                selectedRowKeys,
                onChange,
              },
            }}
          >
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TableRowSelection rowKey={myKey} />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        element = getHostHTMLElement();
      });

      it('should apply extra styles', () => {
        const hostStyleMatch = element
          .getAttribute('style')
          ?.match(/padding-right: 0px/);

        expect(hostStyleMatch).not.toBe(null);

        const iconStyleMatch = element
          ?.querySelector('.mzn-table__icon')
          ?.getAttribute('style')
          ?.match(/width: 0px/);

        expect(iconStyleMatch).not.toBe(null);
      });
    });
  });

  describe('in header', () => {
    const myKey = SELECTED_ALL_KEY;
    let selectedRowKeys: string[];

    const onChange = jest.fn<void, [string]>((key) => {
      if (selectedRowKeys.includes(myKey)) {
        selectedRowKeys = [];
      } else {
        selectedRowKeys = [
          ...selectedRowKeys,
          key,
        ];
      }
    });

    beforeEach(() => {
      selectedRowKeys = [];
    });

    it('should checked when all sources checked', () => {
      selectedRowKeys = defaultDataContext.dataSource.map((source) => source.key);

      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            rowSelection: {
              selectedRowKeys,
              onChange,
            },
          }}
        >
          <TableDataContext.Provider
            value={defaultDataContext}
          >
            <TableRowSelection rowKey={myKey} />
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const element = getHostHTMLElement();
      const [checkbox] = element.getElementsByTagName('input');

      expect(checkbox.getAttribute('aria-checked')).toBe('true');
    });

    it('should display indeterminate state when partial sources checked', () => {
      selectedRowKeys = defaultDataContext.dataSource
        .map((source) => source.key)
        .slice(0, defaultDataContext.dataSource.length / 2);

      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            rowSelection: {
              selectedRowKeys,
              onChange,
            },
          }}
        >
          <TableDataContext.Provider
            value={defaultDataContext}
          >
            <TableRowSelection rowKey={myKey} />
          </TableDataContext.Provider>
        </TableContext.Provider>,
      );

      const element = getHostHTMLElement();
      const [checkbox] = element.getElementsByTagName('input');

      expect(checkbox.getAttribute('aria-checked')).toBe('mixed');
    });

    describe('dropdown should worked when selected sources', () => {
      let element: HTMLElement;
      let icon: HTMLElement;
      let actionRowKeys: string[];

      const defaultSelectedRowKeys = defaultDataContext.dataSource
        .map((source) => source.key)
        .slice(0, defaultDataContext.dataSource.length / 2);

      const onActionClick = jest.fn<void, [string[]]>((rowKeys) => {
        actionRowKeys = rowKeys;
      });

      const actions = [{
        key: 'Mark as read',
        text: 'mark as read',
        onClick: onActionClick,
      }, {
        key: 'delete',
        text: 'delete',
        className: 'foo',
      }];

      beforeEach(() => {
        actionRowKeys = [];
        selectedRowKeys = defaultSelectedRowKeys;

        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              rowSelection: {
                selectedRowKeys,
                onChange,
                actions,
              },
            }}
          >
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TableRowSelection
                rowKey={myKey}
                showDropdownIcon
              />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        element = getHostHTMLElement();
        icon = (element.querySelector('.mzn-table__icon--clickable') as HTMLElement);
      });

      it('should icon existed', () => {
        expect(icon).not.toBe(null);
      });

      it('should open dropdown when icon clicked and close dropdown when click away', async () => {
        await act(async () => {
          fireEvent.click(icon);
        });

        expect(document.querySelector('.mzn-menu')).toBeInstanceOf(HTMLUListElement);

        await act(async () => {
          fireEvent.click(document);
        });

        expect(document.querySelector('.mzn-menu')).toBe(null);
      });

      it('should menu item returning back row keys when clicked', async () => {
        await act(async () => {
          fireEvent.click(icon);
        });

        const menuItem = document.querySelectorAll('.mzn-menu-item');

        expect(menuItem?.[0]?.textContent).toBe(actions[0].text);

        await act(async () => {
          fireEvent.click(menuItem[0]!);
        });

        expect(actionRowKeys.length).toBe(defaultSelectedRowKeys.length);
        expect(document.querySelector('.mzn-menu-item')).toBe(null);
      });

      it('should menu still closed when action.onClick is not given', async () => {
        await act(async () => {
          fireEvent.click(icon);
        });

        const menuItem = document.querySelectorAll('.mzn-menu-item');

        await act(async () => {
          fireEvent.click(menuItem[1]!);
        });

        expect(actionRowKeys.length).toBe(0);
        expect(document.querySelector('.mzn-menu-item')).toBe(null);
      });

      it('should apply className to MenuItem when given', async () => {
        await act(async () => {
          fireEvent.click(icon);
        });

        const menuItem = document.querySelectorAll('.mzn-menu-item');

        expect(menuItem[1].classList.contains('foo')).toBe(true);
      });
    });

    describe('dropdown should disabled when nothing selected', () => {
      let element: HTMLElement;
      let icon: HTMLElement;

      beforeEach(() => {
        selectedRowKeys = [];

        const { getHostHTMLElement } = render(
          <TableContext.Provider
            value={{
              rowSelection: {
                selectedRowKeys,
                onChange,
              },
            }}
          >
            <TableDataContext.Provider
              value={defaultDataContext}
            >
              <TableRowSelection
                rowKey={myKey}
                showDropdownIcon
              />
            </TableDataContext.Provider>
          </TableContext.Provider>,
        );

        element = getHostHTMLElement();
        icon = (element.getElementsByClassName('mzn-icon mzn-table__icon')[0] as HTMLElement);
      });

      it('should use disabled color for icon', () => {
        const styleMatch = icon?.getAttribute('style')?.match(/--mzn-color-action-disabled/);

        expect(styleMatch).not.toBeUndefined();
        expect(styleMatch).not.toBeNull();
      });

      it('should nothing happen when icon clicked', async () => {
        await act(async () => {
          fireEvent.click(icon);
        });

        expect(true);
      });
    });

    it('should not apply custom styles', () => {
      const { getHostHTMLElement } = render(
        <TableRowSelection
          rowKey={myKey}
          showDropdownIcon
        />,
      );
      const element = getHostHTMLElement();
      const icon = element.querySelector('.mzn-table__icon');

      expect(element?.getAttribute('style')).toBeNull();
      expect(icon?.getAttribute('style')).toBeNull();
    });
  });
});
