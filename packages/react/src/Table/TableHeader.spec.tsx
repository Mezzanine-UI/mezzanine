import {
  TableColumn,
} from '@mezzanine-ui/core/table';
import {
  cleanupHook,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
} from '../../__test-utils__/common';
import TableHeader from './TableHeader';
import { TableContext, TableDataContext } from './TableContext';

function getCellWrappers(element: HTMLElement) {
  return element.querySelectorAll('.mzn-table__header__cellWrapper');
}

type DataType = {
  key: string;
};

describe('<TableHeader />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(
    HTMLDivElement,
    (ref) => render(<TableHeader ref={ref} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TableHeader />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-table__header')).toBeTruthy();
  });

  describe('columns are given', () => {
    const columns: TableColumn<DataType>[] = [{
      dataIndex: 'foo',
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
      renderTitle: () => 'bar',
      sorter: () => 1,
    }];

    let element: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <TableDataContext.Provider
          value={{
            columns,
            dataSource: [],
          }}
        >
          <TableHeader />
        </TableDataContext.Provider>,
      );

      element = getHostHTMLElement();
    });

    it('should columns length mapping correctly', () => {
      expect(getCellWrappers(element).length).toBe(columns.length);
    });

    it('should column display given title', () => {
      expect(getCellWrappers(element)[0].textContent).toBe(columns[0].title);
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

    it('should custom renderTitle render function callback(string)', () => {
      const secondColumnCell = getCellWrappers(element)[1].querySelector('.mzn-table__cell');

      expect(secondColumnCell?.textContent).toBe('bar');
    });

    it('should render sorter icon when sorter given', () => {
      const secondColumnSortingIcon = getCellWrappers(element)[1].querySelector('.mzn-table__icon');

      expect(secondColumnSortingIcon).not.toBeNull();
    });
  });

  describe('integration with optional features', () => {
    it('should render rowSelection when rowSelection is defined', () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            rowSelection: {
              selectedRowKeys: [],
              onChange: () => {},
            },
          }}
        >
          <TableHeader />
        </TableContext.Provider>,
      );
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-table__selections')).toBeInstanceOf(HTMLDivElement);
    });

    it('should render TableExpandable for placeholder when expanding defined', () => {
      const { getHostHTMLElement } = render(
        <TableContext.Provider
          value={{
            expanding: {
              expandedRowRender: () => '',
            },
          }}
        >
          <TableHeader />
        </TableContext.Provider>,
      );
      const element = getHostHTMLElement();

      expect(element.querySelector('.mzn-table__collapseAction')).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('exceptions handle', () => {
    it('column.width/column.align not given', () => {
      const columns: TableColumn<DataType>[] = [{
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
          <TableHeader />
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
