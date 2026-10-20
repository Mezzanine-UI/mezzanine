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

const render = (props: Partial<TableProps<TestDataType>> = {}) =>
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
  it('should resize the right column when pinnable adds a handle column', async () => {
    const wrapper = render({ pinnable });

    await dragHandle(wrapper, 0, 50);

    expect(getColWidths(wrapper).slice(1)).toEqual(['210px', '100px', '350px']);
  });
});
