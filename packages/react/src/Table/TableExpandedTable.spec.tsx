import { TableColumn } from '@mezzanine-ui/core/table';
import { cleanupHook, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { TableDataContext } from './TableContext';
import TableExpandedTable from './TableExpandedTable';

type DataType = {
  key: string;
  name: string;
  age: number;
};

const dataSource: DataType[] = [
  {
    key: 'foo',
    name: 'foo',
    age: 15,
  },
  {
    key: 'bar',
    name: 'bar',
    age: 16,
  },
];

const columns: TableColumn<DataType>[] = [
  {
    key: 'name',
    dataIndex: 'name',
    title: 'name',
    width: 80,
    align: 'center',
  },
  {
    key: 'age',
    dataIndex: 'age',
    title: 'foo',
    ellipsis: false,
  },
];

const expandedSources: DataType[] = [
  {
    key: 'foo expanded',
    name: 'foo expanded',
    age: 14,
  },
  {
    key: 'bar expanded',
    name: 'bar expanded',
    age: 17,
  },
];

const expandedColumns: TableColumn<DataType>[] = [
  {
    key: 'name',
    dataIndex: 'name',
    title: '',
  },
  {
    key: 'name',
    title: '',
    render: () => 'render name',
  },
];

const renderedExpandedContent = {
  columns: expandedColumns,
  dataSource: expandedSources,
};

describe('<TableExpandedTable />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <TableDataContext.Provider
        value={{
          columns,
          dataSource,
        }}
      >
        <TableExpandedTable
          ref={ref}
          renderedExpandedContent={renderedExpandedContent}
        />
      </TableDataContext.Provider>,
    ),
  );

  describe('render TableExpandedTable', () => {
    const customExpandedRowClass = 'expanded-row';

    const { getHostHTMLElement } = render(
      <TableDataContext.Provider
        value={{
          columns,
          dataSource,
        }}
      >
        <TableExpandedTable
          renderedExpandedContent={{
            ...renderedExpandedContent,
            className: customExpandedRowClass,
          }}
        />
      </TableDataContext.Provider>,
    );

    const element = getHostHTMLElement();

    const expandedTableElements = element.querySelectorAll(
      '.mzn-table__body__row__expandedTableRow',
    );

    expect(expandedTableElements.length).toBe(2);

    const firstRow = expandedTableElements[0];

    it('should have custom class name when rowClassName in renderedExpandedContent is given', () => {
      const rowClassRegex = new RegExp(customExpandedRowClass, 'g');

      expect(
        firstRow?.getAttribute('class')?.match(rowClassRegex),
      ).not.toBeNull();
    });

    const rowColumns = firstRow.querySelectorAll(
      '.mzn-table__body__row__cellWrapper',
    );

    expect(rowColumns.length).toBe(2);

    it('cell style is from parent columns', () => {
      const firstColumn = rowColumns[0];
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

    it('should render custom content when render given', () => {
      const secondColumn = rowColumns[1];
      const secondColumnCell = secondColumn.querySelector('.mzn-table__cell');

      expect(secondColumnCell?.textContent).toBe('render name');
    });
  });

  describe('renderedExpandedContent without columns', () => {
    const { getHostHTMLElement } = render(
      <TableDataContext.Provider
        value={{
          columns,
          dataSource,
        }}
      >
        <TableExpandedTable
          renderedExpandedContent={{ dataSource: expandedSources }}
        />
      </TableDataContext.Provider>,
    );

    const element = getHostHTMLElement();

    const expandedTableElements = element.querySelectorAll(
      '.mzn-table__body__row__expandedTableRow',
    );

    const firstRow = expandedTableElements[0];
    const rowColumns = firstRow.querySelectorAll(
      '.mzn-table__body__row__cellWrapper',
    );

    const secondColumn = rowColumns[1];
    const secondColumnCell = secondColumn.querySelector('.mzn-table__cell');

    expect(secondColumnCell?.textContent).toBe('14');
  });

  describe('no columns context case', () => {
    const { getHostHTMLElement } = render(
      <TableExpandedTable renderedExpandedContent={renderedExpandedContent} />,
    );

    const element = getHostHTMLElement();

    const expandedTableElements = element.querySelectorAll(
      '.mzn-table__body__row__expandedTableRow',
    );

    const firstRow = expandedTableElements[1];
    const rowColumns = firstRow.querySelectorAll(
      '.mzn-table__body__row__cellWrapper',
    );

    const firstColumn = rowColumns[0];
    const firstColumnCell = firstColumn.querySelector('.mzn-table__cell');

    const columnStyleRegex = new RegExp(`width: ${columns[0].width}px`, 'g');
    const cellStyleRegex = new RegExp(
      `justify-content: ${columns[0].align}`,
      'g',
    );

    expect(
      firstColumn?.getAttribute('style')?.match(columnStyleRegex),
    ).toBeUndefined();
    expect(
      firstColumnCell?.getAttribute('style')?.match(cellStyleRegex),
    ).toBeUndefined();
  });
});
