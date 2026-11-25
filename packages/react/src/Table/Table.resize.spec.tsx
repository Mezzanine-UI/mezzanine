import '@testing-library/jest-dom';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import Table from '.';
import type {
  TableColumnWithMinWidth,
  TableDataSourceWithKey,
  TablePinnable,
} from '@mezzanine-ui/core/table';

interface TestDataType extends TableDataSourceWithKey {
  address: string;
  age: number;
  name: string;
}

const columns: TableColumnWithMinWidth<TestDataType>[] = [
  { dataIndex: 'name', key: 'name', minWidth: 80, title: 'Name', width: 160 },
  { dataIndex: 'age', key: 'age', minWidth: 60, title: 'Age', width: 100 },
  {
    dataIndex: 'address',
    key: 'address',
    minWidth: 200,
    title: 'Address',
    width: 400,
  },
];

const dataSource: TestDataType[] = [
  { address: 'Taipei', age: 32, key: '1', name: 'John' },
];

const pinnable: TablePinnable<TestDataType> = {
  enabled: true,
  onPinChange: () => {},
  pinnedRowKeys: [],
};

const getColWidths = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('colgroup > col')).map(
    (col) => (col as HTMLElement).style.width,
  );

/** Drags the n-th resize handle horizontally by `deltaX` pixels. */
const dragHandle = (container: HTMLElement, index: number, deltaX: number) => {
  const handle = container.querySelectorAll('.mzn-table__resize-handle')[index];

  fireEvent.mouseDown(handle, { clientX: 0 });
  act(() => {
    fireEvent.mouseMove(document, { clientX: deltaX });
  });
  act(() => {
    fireEvent.mouseUp(document, { clientX: deltaX });
  });
};

let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // jsdom has no layout: report each <col>'s inline width as its rendered width
  originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
    if (this instanceof HTMLTableColElement) {
      const width = parseFloat(this.style.width) || 0;

      return new DOMRect(0, 0, width, 0);
    }

    return originalGetBoundingClientRect.call(this);
  };
});

afterAll(() => {
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});

describe('<Table resizable />', () => {
  afterEach(cleanup);

  it('should report resized widths through onColumnWidthsChange on mouseup', () => {
    const onColumnWidthsChange = jest.fn();
    const { container } = render(
      <Table<TestDataType>
        columns={columns}
        dataSource={dataSource}
        onColumnWidthsChange={onColumnWidthsChange}
        resizable
      />,
    );

    dragHandle(container, 0, 50);

    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
    expect(onColumnWidthsChange).toHaveBeenCalledWith({
      address: 350,
      age: 100,
      name: 210,
    });
  });

  it('should not report while dragging, only on mouseup', () => {
    const onColumnWidthsChange = jest.fn();
    const { container } = render(
      <Table<TestDataType>
        columns={columns}
        dataSource={dataSource}
        onColumnWidthsChange={onColumnWidthsChange}
        resizable
      />,
    );
    const handle = container.querySelector('.mzn-table__resize-handle')!;

    fireEvent.mouseDown(handle, { clientX: 0 });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 30 });
    });

    expect(onColumnWidthsChange).not.toHaveBeenCalled();

    act(() => {
      fireEvent.mouseUp(document, { clientX: 30 });
    });

    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
  });

  it('should resize the right column when pinnable adds a handle column', () => {
    const onColumnWidthsChange = jest.fn();
    const { container } = render(
      <Table<TestDataType>
        columns={columns}
        dataSource={dataSource}
        onColumnWidthsChange={onColumnWidthsChange}
        pinnable={pinnable}
        resizable
      />,
    );

    dragHandle(container, 0, 50);

    expect(onColumnWidthsChange).toHaveBeenCalledWith({
      address: 350,
      age: 100,
      name: 210,
    });
    expect(getColWidths(container).slice(1)).toEqual([
      '210px',
      '100px',
      '350px',
    ]);
  });

  it('should not report when a drag returns to its start position', () => {
    const onColumnWidthsChange = jest.fn();
    const { container } = render(
      <Table<TestDataType>
        columns={columns}
        dataSource={dataSource}
        onColumnWidthsChange={onColumnWidthsChange}
        resizable
      />,
    );
    const handle = container.querySelector('.mzn-table__resize-handle')!;

    fireEvent.mouseDown(handle, { clientX: 0 });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 40 });
    });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 0 });
    });
    act(() => {
      fireEvent.mouseUp(document, { clientX: 0 });
    });

    expect(onColumnWidthsChange).not.toHaveBeenCalled();
    expect(getColWidths(container)).toEqual(['160px', '100px', '400px']);
  });

  it('should not report when the table unmounts mid-drag', () => {
    const onColumnWidthsChange = jest.fn();
    const { container, unmount } = render(
      <Table<TestDataType>
        columns={columns}
        dataSource={dataSource}
        onColumnWidthsChange={onColumnWidthsChange}
        resizable
      />,
    );
    const handle = container.querySelector('.mzn-table__resize-handle')!;

    fireEvent.mouseDown(handle, { clientX: 0 });
    act(() => {
      fireEvent.mouseMove(document, { clientX: 40 });
    });
    unmount();
    fireEvent.mouseUp(document, { clientX: 40 });

    expect(onColumnWidthsChange).not.toHaveBeenCalled();
  });

  describe("resizeStrategy='grow-table'", () => {
    it('should grow only the dragged column and report only its width', () => {
      const onColumnWidthsChange = jest.fn();
      const { container } = render(
        <Table<TestDataType>
          columns={columns}
          dataSource={dataSource}
          onColumnWidthsChange={onColumnWidthsChange}
          resizable
          resizeStrategy="grow-table"
        />,
      );

      dragHandle(container, 0, 300);

      expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
      expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 460 });
      expect(getColWidths(container)).toEqual(['460px', '100px', '400px']);
    });

    it('should keep other columns unchanged during the drag', () => {
      const { container } = render(
        <Table<TestDataType>
          columns={columns}
          dataSource={dataSource}
          resizable
          resizeStrategy="grow-table"
        />,
      );
      const handle = container.querySelectorAll('.mzn-table__resize-handle')[1];

      fireEvent.mouseDown(handle, { clientX: 0 });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 120 });
      });

      expect(getColWidths(container)).toEqual(['160px', '220px', '400px']);

      act(() => {
        fireEvent.mouseUp(document, { clientX: 120 });
      });
    });

    it('should ignore moves below minWidth or above maxWidth of the dragged column', () => {
      const onColumnWidthsChange = jest.fn();
      const { container } = render(
        <Table<TestDataType>
          columns={[{ ...columns[0], maxWidth: 200 }, columns[1], columns[2]]}
          dataSource={dataSource}
          onColumnWidthsChange={onColumnWidthsChange}
          resizable
          resizeStrategy="grow-table"
        />,
      );
      const handle = container.querySelector('.mzn-table__resize-handle')!;

      fireEvent.mouseDown(handle, { clientX: 0 });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 30 });
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100 });
      });
      act(() => {
        fireEvent.mouseMove(document, { clientX: -100 });
      });
      act(() => {
        fireEvent.mouseUp(document, { clientX: -100 });
      });

      expect(onColumnWidthsChange).toHaveBeenCalledWith({ name: 190 });
    });

    it('should render a resize handle on the last column too', () => {
      const { container } = render(
        <Table<TestDataType>
          columns={columns}
          dataSource={dataSource}
          resizable
          resizeStrategy="grow-table"
        />,
      );

      expect(
        container.querySelectorAll('.mzn-table__resize-handle'),
      ).toHaveLength(columns.length);
    });

    it('should resize the last column alone', () => {
      const onColumnWidthsChange = jest.fn();
      const { container } = render(
        <Table<TestDataType>
          columns={columns}
          dataSource={dataSource}
          onColumnWidthsChange={onColumnWidthsChange}
          resizable
          resizeStrategy="grow-table"
        />,
      );

      dragHandle(container, 2, 80);

      expect(onColumnWidthsChange).toHaveBeenCalledWith({ address: 480 });
    });

    it('should merge previously committed widths when reporting', () => {
      const onColumnWidthsChange = jest.fn();
      const { container } = render(
        <Table<TestDataType>
          columnWidths={{ age: 120 }}
          columns={columns}
          dataSource={dataSource}
          onColumnWidthsChange={onColumnWidthsChange}
          resizable
          resizeStrategy="grow-table"
        />,
      );

      dragHandle(container, 0, 40);

      expect(onColumnWidthsChange).toHaveBeenCalledWith({
        age: 120,
        name: 200,
      });
    });
  });

  it('should hide the resize handle of the last column by default', () => {
    const { container } = render(
      <Table<TestDataType>
        columns={columns}
        dataSource={dataSource}
        resizable
      />,
    );

    expect(
      container.querySelectorAll('.mzn-table__resize-handle'),
    ).toHaveLength(columns.length - 1);
  });

  it.each(['preserve-table-width', 'grow-table'] as const)(
    'should not render an actions column without actions (%s)',
    (resizeStrategy) => {
      const { container } = render(
        <Table<TestDataType>
          columns={columns}
          dataSource={dataSource}
          resizable
          resizeStrategy={resizeStrategy}
        />,
      );

      expect(getColWidths(container)).toHaveLength(columns.length);
    },
  );

  describe('controlled columnWidths', () => {
    it('should render widths from columnWidths over column.width', () => {
      const { container } = render(
        <Table<TestDataType>
          columnWidths={{ name: 240 }}
          columns={columns}
          dataSource={dataSource}
          resizable
        />,
      );

      expect(getColWidths(container)).toEqual(['240px', '100px', '400px']);
    });

    it('should reset to column.width when columnWidths becomes {}', () => {
      const { container, rerender } = render(
        <Table<TestDataType>
          columnWidths={{ address: 350, name: 210 }}
          columns={columns}
          dataSource={dataSource}
          resizable
        />,
      );

      expect(getColWidths(container)).toEqual(['210px', '100px', '350px']);

      rerender(
        <Table<TestDataType>
          columnWidths={{}}
          columns={columns}
          dataSource={dataSource}
          resizable
        />,
      );

      expect(getColWidths(container)).toEqual(['160px', '100px', '400px']);
    });

    it('should keep columnWidths when the parent ignores the change', () => {
      const onColumnWidthsChange = jest.fn();
      const { container } = render(
        <Table<TestDataType>
          columnWidths={{}}
          columns={columns}
          dataSource={dataSource}
          onColumnWidthsChange={onColumnWidthsChange}
          resizable
        />,
      );

      dragHandle(container, 0, 50);

      expect(onColumnWidthsChange).toHaveBeenCalledWith({
        address: 350,
        age: 100,
        name: 210,
      });
      expect(getColWidths(container)).toEqual(['160px', '100px', '400px']);
    });

    it('should clamp columnWidths to minWidth/maxWidth and ignore invalid values', () => {
      const { container } = render(
        <Table<TestDataType>
          columnWidths={{ address: Number.NaN, age: -5, name: 10 }}
          columns={columns}
          dataSource={dataSource}
          resizable
        />,
      );

      expect(getColWidths(container)).toEqual(['80px', '100px', '400px']);
    });
  });
});
