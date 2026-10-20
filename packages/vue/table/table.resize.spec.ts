import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import type {
  TableDataSourceWithKey,
  TablePinnable,
} from '@mezzanine-ui/core/table';
import MznTable from './table.vue';
import type {
  TableColumn,
  TableColumnWithMinWidth,
  TableProps,
} from './table.types';

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

type ResizeTableProps = Partial<TableProps<TestDataType>> & {
  'onUpdate:columnWidths'?: (widths: Record<string, number>) => void;
  onColumnWidthsChange?: (widths: Record<string, number>) => void;
};

const render = (props: ResizeTableProps = {}) =>
  mount(MznTable, {
    attachTo: document.body,
    props: {
      columns: columns as TableColumn<TestDataType>[],
      dataSource,
      resizable: true,
      ...props,
    } as never,
  });

type Wrapper = ReturnType<typeof render>;

const getColWidths = (wrapper: Wrapper) =>
  Array.from(wrapper.element.querySelectorAll('colgroup > col')).map(
    (col) => (col as HTMLElement).style.width,
  );

const getHandle = (wrapper: Wrapper, index = 0) =>
  wrapper.findAll('.mzn-table__resize-handle')[index];

const fireDocumentMouse = async (
  type: 'mousemove' | 'mouseup',
  clientX: number,
) => {
  document.dispatchEvent(new MouseEvent(type, { clientX }));
  await nextTick();
};

/** Drags the n-th resize handle horizontally by `deltaX` pixels. */
const dragHandle = async (wrapper: Wrapper, index: number, deltaX: number) => {
  await getHandle(wrapper, index).trigger('mousedown', { clientX: 0 });
  await fireDocumentMouse('mousemove', deltaX);
  await fireDocumentMouse('mouseup', deltaX);
};

let originalGetBoundingClientRect: typeof Element.prototype.getBoundingClientRect;

beforeAll(() => {
  // jsdom has no layout: report each col's inline width as its rendered width
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

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<MznTable resizable />', () => {
  it('should report resized widths through columnWidthsChange on mouseup', async () => {
    const onColumnWidthsChange = vi.fn();
    const wrapper = render({ onColumnWidthsChange });

    await dragHandle(wrapper, 0, 50);

    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
    expect(onColumnWidthsChange).toHaveBeenCalledWith({
      address: 350,
      age: 100,
      name: 210,
    });
    expect(wrapper.emitted('update:columnWidths')).toEqual([
      [{ address: 350, age: 100, name: 210 }],
    ]);
  });

  it('should not report while dragging, only on mouseup', async () => {
    const onColumnWidthsChange = vi.fn();
    const wrapper = render({ onColumnWidthsChange });

    await getHandle(wrapper).trigger('mousedown', { clientX: 0 });
    await fireDocumentMouse('mousemove', 30);

    expect(onColumnWidthsChange).not.toHaveBeenCalled();

    await fireDocumentMouse('mouseup', 30);

    expect(onColumnWidthsChange).toHaveBeenCalledTimes(1);
  });

  it('should resize the right column when pinnable adds a handle column', async () => {
    const onColumnWidthsChange = vi.fn();
    const wrapper = render({ onColumnWidthsChange, pinnable });

    await dragHandle(wrapper, 0, 50);

    expect(onColumnWidthsChange).toHaveBeenCalledWith({
      address: 350,
      age: 100,
      name: 210,
    });
    expect(getColWidths(wrapper).slice(1)).toEqual(['210px', '100px', '350px']);
  });

  it('should not report when a drag returns to its start position', async () => {
    const onColumnWidthsChange = vi.fn();
    const wrapper = render({ onColumnWidthsChange });

    await getHandle(wrapper).trigger('mousedown', { clientX: 0 });
    await fireDocumentMouse('mousemove', 40);
    await fireDocumentMouse('mousemove', 0);
    await fireDocumentMouse('mouseup', 0);

    expect(onColumnWidthsChange).not.toHaveBeenCalled();
    expect(getColWidths(wrapper)).toEqual(['160px', '100px', '400px']);
  });

  it('should not report when the table unmounts mid-drag', async () => {
    const onColumnWidthsChange = vi.fn();
    const wrapper = render({ onColumnWidthsChange });

    // Vue already drops emits from an unmounted instance, so also check the
    // drag's own document listeners are detached rather than left to leak.
    const addEventListener = vi.spyOn(document, 'addEventListener');

    await getHandle(wrapper).trigger('mousedown', { clientX: 0 });
    await fireDocumentMouse('mousemove', 40);

    const dragListeners = addEventListener.mock.calls.filter(([type]) =>
      ['mousemove', 'mouseup'].includes(type),
    );
    const removeEventListener = vi.spyOn(document, 'removeEventListener');

    wrapper.unmount();

    expect(dragListeners).toHaveLength(2);
    dragListeners.forEach(([type, listener]) => {
      expect(removeEventListener).toHaveBeenCalledWith(type, listener);
    });
    addEventListener.mockRestore();
    removeEventListener.mockRestore();

    await fireDocumentMouse('mouseup', 40);

    expect(onColumnWidthsChange).not.toHaveBeenCalled();
  });

  describe('controlled columnWidths', () => {
    it('should render widths from columnWidths over column.width', () => {
      const wrapper = render({ columnWidths: { name: 240 } });

      expect(getColWidths(wrapper)).toEqual(['240px', '100px', '400px']);
    });

    it('should reset to column.width when columnWidths becomes {}', async () => {
      const wrapper = render({ columnWidths: { address: 350, name: 210 } });

      expect(getColWidths(wrapper)).toEqual(['210px', '100px', '350px']);

      await wrapper.setProps({ columnWidths: {} } as never);

      expect(getColWidths(wrapper)).toEqual(['160px', '100px', '400px']);
    });

    it('should keep columnWidths when the parent ignores the change', async () => {
      const onColumnWidthsChange = vi.fn();
      const wrapper = render({ columnWidths: {}, onColumnWidthsChange });

      await dragHandle(wrapper, 0, 50);

      expect(onColumnWidthsChange).toHaveBeenCalledWith({
        address: 350,
        age: 100,
        name: 210,
      });
      expect(getColWidths(wrapper)).toEqual(['160px', '100px', '400px']);
    });

    it('should follow v-model:columnWidths', async () => {
      const wrapper = render({
        columnWidths: {},
        'onUpdate:columnWidths': (widths) =>
          wrapper.setProps({ columnWidths: widths } as never),
      });

      await dragHandle(wrapper, 0, 50);
      await nextTick();

      expect(getColWidths(wrapper)).toEqual(['210px', '100px', '350px']);
    });

    it('should clamp columnWidths to minWidth/maxWidth and ignore invalid values', () => {
      const wrapper = render({
        columnWidths: { address: Number.NaN, age: -5, name: 10 },
      });

      expect(getColWidths(wrapper)).toEqual(['80px', '100px', '400px']);
    });
  });
});
