import {
  TableColumn,
} from '@mezzanine-ui/core/table';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import {
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import { TableDataContext, TableContext } from './TableContext';
import TableBody from './TableBody';

type DataType = {
  key: string;
  name: string;
};

const defaultSources: DataType[] = [{
  key: 'foo',
  name: 'foo',
}];

const defaultColumns: TableColumn<DataType>[] = [{
  key: 'foo',
  dataIndex: 'foo',
  title: 'foo',
}];

describe('<TableBody />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLTableSectionElement,
    (ref) => render(<TableBody ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableBody />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__body')).toBeTruthy();
  });

  it('should mapping dataSource when given', () => {
    const { getHostHTMLElement } = render(
      <TableDataContext.Provider
        value={{
          columns: defaultColumns,
          dataSource: defaultSources,
        }}
      >
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="mzn-table-dnd">
            {() => (
              <TableBody />
            )}
          </Droppable>
        </DragDropContext>
      </TableDataContext.Provider>,
    );
    const host = getHostHTMLElement();

    expect(host.querySelectorAll('.mzn-table__body__row').length).toBe(defaultSources.length);
  });

  it('should display <Empty /> when no data', () => {
    const { getHostHTMLElement } = render(
      <TableDataContext.Provider
        value={{
          columns: defaultColumns,
          dataSource: [],
        }}
      >
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId="mzn-table-dnd">
            {() => (
              <TableBody />
            )}
          </Droppable>
        </DragDropContext>
      </TableDataContext.Provider>,
    );
    const host = getHostHTMLElement();

    expect(host.querySelector('.mzn-table__body__empty')).toBeInstanceOf(HTMLDivElement);
  });

  describe('integrate with fetchMore', () => {
    it('should display loading indicator when isFetching', () => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns: defaultColumns,
            dataSource: defaultSources,
          }}
        >
          <TableContext.Provider
            value={{
              fetchMore: {
                isFetching: true,
                isReachEnd: false,
                onFetchMore: () => {},
              },
            }}
          >
            <DragDropContext onDragEnd={() => {}}>
              <Droppable droppableId="mzn-table-dnd">
                {() => (
                  <TableBody />
                )}
              </Droppable>
            </DragDropContext>
          </TableContext.Provider>
        </TableDataContext.Provider>,
      );
      const host = getHostHTMLElement();

      expect(host.querySelector('.mzn-table__body__fetchMore')).toBeInstanceOf(HTMLTableRowElement);
    });
  });
});
