import { TableColumn } from '@mezzanine-ui/core/table';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import {
  act,
  cleanupHook,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { TableDataContext, TableContext } from './TableContext';
import TableBodyRow from './TableBodyRow';
import TableCell from './TableCell';

type DataType = {
  key: string;
  name: string;
  foo: {
    bar: string;
  };
};

const rowData: DataType = {
  key: 'foo',
  name: 'foo',
  foo: {
    bar: 'test',
  },
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

  describeForwardRefToHTMLElement(HTMLTableRowElement, (ref) =>
    render(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="mzn-table-dnd">
          {() => <TableBodyRow ref={ref} rowData={rowData} rowIndex={0} />}
        </Droppable>
      </DragDropContext>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <DragDropContext onDragEnd={() => {}}>
        <Droppable droppableId="mzn-table-dnd">
          {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
        </Droppable>
      </DragDropContext>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__body__row')).toBeTruthy();
  });

  it('ellipsis control should set to true by default, and false when no data/disabled', () => {
    const columns: TableColumn<DataType>[] = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'name',
      },
      {
        key: 'not-existed',
        dataIndex: 'not-existed',
        title: 'bar',
        ellipsis: true,
      },
      {
        key: 'name',
        dataIndex: 'name',
        title: 'foo',
        ellipsis: false,
      },
    ];

    const testInstance = TestRenderer.create(
      <TableDataContext.Provider
        value={{
          columns,
          dataSource: [rowData],
        }}
      >
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="mzn-table-dnd">
            {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
          </Droppable>
        </DragDropContext>
      </TableDataContext.Provider>,
    );
    const cellInstance = testInstance.root.findAllByType(TableCell);

    expect(cellInstance[0].props.ellipsis).toBe(true);
    expect(cellInstance[1].props.ellipsis).toBe(true);
    expect(cellInstance[2].props.ellipsis).toBe(false);
  });

  describe('columns are given', () => {
    const columns: TableColumn<DataType>[] = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'foo',
        headerClassName: undefined,
        renderTitle: undefined,
        renderTooltipTitle: (s) => s.name,
        sorter: undefined,
        width: 80,
        align: 'center',
      },
      {
        key: 'bar',
        title: 'bar',
        align: 'start',
        render: () => 'bar-render',
      },
      {
        key: 'foo.bar',
        dataIndex: 'foo.bar',
        title: 'foo',
      },
    ];

    let element: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns,
            dataSource: [rowData],
          }}
        >
          <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId="mzn-table-dnd">
              {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
            </Droppable>
          </DragDropContext>
        </TableDataContext.Provider>,
      );

      element = getHostHTMLElement();
    });

    it('should apply custom width/align when given', () => {
      const firstColumn = getCellWrappers(element)[0];
      const firstColumnCell = firstColumn.querySelector('.mzn-table__cell');

      const columnStyleRegex = new RegExp(`width: ${columns[0].width}px`, 'g');
      const cellStyleRegex = new RegExp(
        `justify-content: ${columns[0].align}`,
        'g',
      );

      expect(
        firstColumn?.getAttribute('style')?.match(columnStyleRegex),
      ).not.toBeUndefined();
      expect(
        firstColumn?.getAttribute('style')?.match(columnStyleRegex),
      ).not.toBeNull();
      expect(
        firstColumnCell?.getAttribute('style')?.match(cellStyleRegex),
      ).not.toBeUndefined();
      expect(
        firstColumnCell?.getAttribute('style')?.match(cellStyleRegex),
      ).not.toBeNull();
    });

    it('should apply prefix for align start/end', () => {
      const secondColumnCell =
        getCellWrappers(element)[1].querySelector('.mzn-table__cell');
      const cellStyleRegex = new RegExp(
        `justify-content: flex-${columns[1].align}`,
        'g',
      );

      expect(
        secondColumnCell?.getAttribute('style')?.match(cellStyleRegex),
      ).not.toBeUndefined();
      expect(
        secondColumnCell?.getAttribute('style')?.match(cellStyleRegex),
      ).not.toBeNull();
    });

    it('should render custom content when render given', () => {
      const secondColumnCell =
        getCellWrappers(element)[1].querySelector('.mzn-table__cell');

      expect(secondColumnCell?.textContent).toBe('bar-render');
    });

    it('should render content with nested dataIndex', () => {
      const secondColumnCell =
        getCellWrappers(element)[2].querySelector('.mzn-table__cell');

      expect(secondColumnCell?.textContent).toBe('test');
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
            <DragDropContext onDragEnd={() => {}}>
              <Droppable droppableId="mzn-table-dnd">
                {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
              </Droppable>
            </DragDropContext>
          </TableContext.Provider>
        </TableDataContext.Provider>,
      );

      element = getHostHTMLElement();
    });

    it('should highlight row background when checked', async () => {
      expect(
        element.classList.contains('mzn-table__body__row--highlight'),
      ).toBe(true);
    });
  });

  describe('integrate with expanding', () => {
    describe('display custom render content', () => {
      describe('should render expandedRowRender fallback', () => {
        const onExpand = jest.fn();

        it('string case', async () => {
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
                    expandedRowRender: (r) => r.name as string,
                    rowExpandable: () => true,
                    onExpand,
                  },
                }}
              >
                <DragDropContext onDragEnd={() => {}}>
                  <Droppable droppableId="mzn-table-dnd">
                    {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
                  </Droppable>
                </DragDropContext>
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
          expect(onExpand).toBeCalledWith(rowData, true);
        });

        it('dataSource case', async () => {
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
                    expandedRowRender: () => ({
                      dataSource: [
                        {
                          key: 'foo',
                          name: 'foo',
                        },
                        {
                          key: 'bar',
                          name: 'bar',
                        },
                      ],
                      columns: [
                        {
                          key: 'name',
                          dataIndex: 'name',
                        },
                        {
                          key: 'name2',
                          dataIndex: 'name',
                        },
                      ],
                    }),
                    rowExpandable: () => true,
                    onExpand,
                  },
                }}
              >
                <DragDropContext onDragEnd={() => {}}>
                  <Droppable droppableId="mzn-table-dnd">
                    {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
                  </Droppable>
                </DragDropContext>
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
          const rows = expandedContentHost?.querySelectorAll(
            '.mzn-table__body__row__expandedTableRow',
          );

          expect(rows?.length).toBe(2);
        });

        it('empty dataSource case', async () => {
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
                    expandedRowRender: () => ({
                      dataSource: [],
                      columns: [
                        {
                          key: 'name',
                          dataIndex: 'name',
                        },
                        {
                          key: 'name2',
                          dataIndex: 'name',
                        },
                      ],
                    }),
                    rowExpandable: () => true,
                    onExpand,
                  },
                }}
              >
                <DragDropContext onDragEnd={() => {}}>
                  <Droppable droppableId="mzn-table-dnd">
                    {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
                  </Droppable>
                </DragDropContext>
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

          expect(expandedContentHost).toBeDefined();
        });
      });
    });
  });

  describe('exceptions handle', () => {
    it('column.width/column.align not given', () => {
      const columns: TableColumn<DataType>[] = [
        {
          key: 'name',
          dataIndex: 'name',
          title: 'name',
        },
      ];

      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns,
            dataSource: [],
          }}
        >
          <DragDropContext onDragEnd={() => {}}>
            <Droppable droppableId="mzn-table-dnd">
              {() => <TableBodyRow rowData={rowData} rowIndex={0} />}
            </Droppable>
          </DragDropContext>
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
