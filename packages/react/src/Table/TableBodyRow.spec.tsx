import {
  TableColumn,
} from '@mezzanine-ui/core/table';
import {
  act,
  cleanupHook,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { TableDataContext, TableContext } from './TableContext';
import TableBodyRow from './TableBodyRow';
import TableCell from './TableCell';

const rowData = {
  key: 'foo',
  name: 'foo',
};

function getCellWrappers(element: HTMLElement) {
  return element.querySelectorAll('.mzn-table__body__row__cellWrapper');
}

function getExpandingHost(element: HTMLElement) {
  return element.querySelector('.mzn-table__collapseAction');
}

function getExpandedContentHost() {
  return document.querySelector('.mzn-accordion__details');
}

describe('<TableBodyRow />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(
      <TableBodyRow
        ref={ref}
        rowData={rowData}
      />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <TableBodyRow rowData={rowData} />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__body__row')).toBeTruthy();
  });

  it('ellipsis control should set to true by default, and false when no data/disabled', () => {
    const columns: TableColumn[] = [{
      dataIndex: 'name',
      title: 'name',
    }, {
      dataIndex: 'not-existed',
      title: 'bar',
      ellipsis: true,
    }, {
      dataIndex: 'name',
      title: 'foo',
      ellipsis: false,
    }];

    const testInstance = TestRenderer.create(
      <TableDataContext.Provider
        value={{
          columns,
          dataSource: [rowData],
        }}
      >
        <TableBodyRow rowData={rowData} />
      </TableDataContext.Provider>,
    );
    const cellInstance = testInstance.root.findAllByType(TableCell);

    expect(cellInstance[0].props.ellipsis).toBe(true);
    expect(cellInstance[1].props.ellipsis).toBe(false);
    expect(cellInstance[2].props.ellipsis).toBe(false);
  });

  describe('columns are given', () => {
    const columns: TableColumn[] = [{
      dataIndex: 'name',
      title: 'foo',
      headerClassName: undefined,
      renderTitle: undefined,
      sorter: undefined,
      width: 80,
      align: 'center',
    }, {
      dataIndex: 'bar',
      title: 'bar',
      align: 'start',
      render: () => 'bar-render',
    }];

    let element: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns,
            dataSource: [rowData],
          }}
        >
          <TableBodyRow rowData={rowData} />
        </TableDataContext.Provider>,
      );

      element = getHostHTMLElement();
    });

    it('should apply custom width/align when given', () => {
      const firstColumn = getCellWrappers(element)[0];
      const firstColumnCell = firstColumn.querySelector('.mzn-table__cell');

      const columnStyleRegex = new RegExp(`width: ${columns[0].width}px`, 'g');
      const cellStyleRegex = new RegExp(`justify-content: ${columns[0].align}`, 'g');

      expect(firstColumn?.getAttribute('style')?.match(columnStyleRegex)).not.toBeUndefined();
      expect(firstColumn?.getAttribute('style')?.match(columnStyleRegex)).not.toBeNull();
      expect(firstColumnCell?.getAttribute('style')?.match(cellStyleRegex)).not.toBeUndefined();
      expect(firstColumnCell?.getAttribute('style')?.match(cellStyleRegex)).not.toBeNull();
    });

    it('should apply prefix for align start/end', () => {
      const secondColumnCell = getCellWrappers(element)[1].querySelector('.mzn-table__cell');
      const cellStyleRegex = new RegExp(`justify-content: flex-${columns[1].align}`, 'g');

      expect(secondColumnCell?.getAttribute('style')?.match(cellStyleRegex)).not.toBeUndefined();
      expect(secondColumnCell?.getAttribute('style')?.match(cellStyleRegex)).not.toBeNull();
    });

    it('should render custom content when render given', () => {
      const secondColumnCell = getCellWrappers(element)[1].querySelector('.mzn-table__cell');

      expect(secondColumnCell?.textContent).toBe('bar-render');
    });
  });

  describe('integrate with row selection', () => {
    let element: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns: [],
            dataSource: [rowData],
          }}
        >
          <TableContext.Provider
            value={{
              rowSelection: {
                selectedRowKeys: [rowData.key],
                onChange: () => {},
              },
            }}
          >
            <TableBodyRow rowData={rowData} />
          </TableContext.Provider>
        </TableDataContext.Provider>,
      );

      element = getHostHTMLElement();
    });

    it('should highlight row background when checked', async () => {
      expect(element.classList.contains('mzn-table__body__row--highlight')).toBe(true);
    });
  });

  describe('integrate with expanding', () => {
    describe('display custom render content', () => {
      it('should render expandedRowRender fallback', async () => {
        const { getHostHTMLElement } = render(
          <TableDataContext.Provider
            value={{
              columns: [],
              dataSource: [rowData],
            }}
          >
            <TableContext.Provider
              value={{
                expanding: {
                  className: 'foo',
                  expandedRowRender: (r) => r.name,
                  rowExpandable: () => true,
                },
              }}
            >
              <TableBodyRow rowData={rowData} />
            </TableContext.Provider>
          </TableDataContext.Provider>,
        );

        const element = getHostHTMLElement();
        const expandingHost = getExpandingHost(element);
        const icon = expandingHost?.querySelector('.mzn-icon');

        await act(async () => {
          fireEvent.click(icon!);
        });

        const expandedContentHost = getExpandedContentHost();

        expect(expandedContentHost?.textContent).toBe('foo');
        expect(expandedContentHost?.classList.contains('foo')).toBe(true);
      });
    });
  });

  describe('exceptions handle', () => {
    it('column.width/column.align not given', () => {
      const columns: TableColumn[] = [{
        dataIndex: 'foo',
        title: 'foo',
      }];

      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns,
            dataSource: [],
          }}
        >
          <TableBodyRow rowData={rowData} />
        </TableDataContext.Provider>,
      );

      const element = getHostHTMLElement();
      const firstColumn = getCellWrappers(element)[0];

      expect(firstColumn.getAttribute('style')).toBeNull();

      const firstColumnCell = firstColumn.querySelector('.mzn-table__cell');

      expect(firstColumnCell?.getAttribute('style')).toBeNull();
    });
  });
});
