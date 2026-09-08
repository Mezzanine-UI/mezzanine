import { flushPromises, mount } from '@vue/test-utils';
import { h } from 'vue';
import { tableClasses as classes } from '@mezzanine-ui/core/table';
import type { TableRowSelectionCheckbox } from '@mezzanine-ui/core/table';
import MznTable from './table.vue';
import type { TableCollectable, TableColumn, TableProps } from './table.types';

interface Row extends Record<string, unknown> {
  age: number;
  key: string;
  name: string;
  subData?: Row[];
}

const rows: Row[] = [
  { age: 32, key: '1', name: 'John' },
  { age: 42, key: '2', name: 'Jim' },
  { age: 21, key: '3', name: 'Joe' },
];

const columns: TableColumn<Row>[] = [
  { dataIndex: 'name', key: 'name', title: 'Name' },
  { dataIndex: 'age', key: 'age', title: 'Age' },
];

const render = (props: Partial<TableProps<Row>> = {}) =>
  mount(MznTable, {
    attachTo: document.body,
    props: { columns, dataSource: rows, ...props } as never,
  });

const bodyRows = (wrapper: ReturnType<typeof render>) =>
  wrapper.findAll(`tbody.${classes.body} tr`);

describe('<MznTable />', () => {
  it('should render a row per record and a cell per column', () => {
    const wrapper = render();

    expect(bodyRows(wrapper)).toHaveLength(3);
    expect(bodyRows(wrapper)[0].findAll('td')).toHaveLength(2);
    expect(wrapper.findAll('thead th').map((th) => th.text())).toEqual([
      'Name',
      'Age',
    ]);
  });

  it('should read a cell from dataIndex and from a render function', () => {
    const wrapper = render({
      columns: [
        { dataIndex: 'name', key: 'name', title: 'Name' },
        {
          key: 'shout',
          render: (record) => h('b', record.name.toUpperCase()),
          title: 'Shout',
        },
      ],
    });

    const cells = bodyRows(wrapper)[0].findAll('td');

    expect(cells[0].text()).toBe('John');
    expect(cells[1].find('b').text()).toBe('JOHN');
  });

  it('should leave the pinned columns to CSS variables', () => {
    const wrapper = render({
      columns: [
        { dataIndex: 'name', fixed: 'start', key: 'name', title: 'Name' },
        { dataIndex: 'age', fixed: 'end', key: 'age', title: 'Age' },
      ],
    });

    const [start, end] = bodyRows(wrapper)[0].findAll('td');

    expect(start.classes()).toContain(classes.cellFixedStart);
    expect(start.attributes('style')).toContain('--fixed-start-offset: 0px');
    expect(end.classes()).toContain(classes.cellFixedEnd);
    expect(end.attributes('style')).toContain('--fixed-end-offset: 0px');
  });

  it('should render the empty state instead of rows', () => {
    const wrapper = render({ dataSource: [] });

    expect(bodyRows(wrapper)).toHaveLength(1);
    expect(wrapper.find(`.${classes.emptyRow}`).exists()).toBe(true);
    expect(wrapper.find(`.${classes.empty}`).attributes('colspan')).toBe('2');
  });

  it('should render skeleton rows while loading and hand no record to any callback', () => {
    const render$ = vi.fn(() => 'never');
    const rowState = vi.fn(() => 'added' as const);
    const wrapper = render({
      columns: [{ key: 'name', render: render$, title: 'Name' }],
      loading: true,
      loadingRowsCount: 4,
      rowState,
    });

    expect(bodyRows(wrapper)).toHaveLength(4);
    expect(render$).not.toHaveBeenCalled();
    expect(rowState).not.toHaveBeenCalled();
  });

  it('should mark the rows the transition state names', () => {
    const wrapper = render({
      transitionState: {
        addingKeys: new Set(['1']),
        deletingKeys: new Set(['2']),
        fadingOutKeys: new Set(['3']),
      },
    });

    const [first, second, third] = bodyRows(wrapper);

    expect(first.classes()).toContain(classes.bodyRowAdding);
    expect(second.classes()).toContain(classes.bodyRowDeleting);
    expect(third.classes()).toContain(classes.bodyRowFadingOut);
  });

  it('should stripe every other row and separate the indexes it is given', () => {
    const wrapper = render({ separatorAtRowIndexes: [1], zebraStriping: true });
    const [first, second] = bodyRows(wrapper);

    expect(first.classes()).not.toContain(classes.bodyRowZebra);
    expect(second.classes()).toContain(classes.bodyRowZebra);
    expect(second.classes()).toContain(classes.bodyRowSeparator);
  });

  it('should resolve a row state per record', () => {
    const wrapper = render({
      rowState: (record) => (record.age > 40 ? 'deleted' : undefined),
    });

    expect(bodyRows(wrapper)[0].classes()).not.toContain(
      classes.bodyRowStateDeleted,
    );
    expect(bodyRows(wrapper)[1].classes()).toContain(
      classes.bodyRowStateDeleted,
    );
  });

  describe('selection', () => {
    it('should report the new keys, the row and every selected row', async () => {
      const onChange = vi.fn();
      const wrapper = render({
        rowSelection: {
          mode: 'checkbox',
          onChange,
          selectedRowKeys: [],
        } as unknown as TableRowSelectionCheckbox<Row>,
      });

      await bodyRows(wrapper)[0].find('input[type="checkbox"]').setValue(true);

      expect(onChange).toHaveBeenCalledWith(['1'], rows[0], [rows[0]]);
    });

    it('should select every selectable row from the header', async () => {
      const onChange = vi.fn();
      const wrapper = render({
        rowSelection: {
          isSelectionDisabled: (record: Row) => record.age > 40,
          mode: 'checkbox',
          onChange,
          selectedRowKeys: [],
        } as unknown as TableRowSelectionCheckbox<Row>,
      });

      await wrapper.find('thead input[type="checkbox"]').setValue(true);

      expect(onChange).toHaveBeenCalledWith(['1', '3'], null, [
        rows[0],
        rows[2],
      ]);
    });

    it('should withhold the header control in radio mode', () => {
      const wrapper = render({
        rowSelection: {
          mode: 'radio',
          onChange: vi.fn(),
          selectedRowKey: undefined,
        } as never,
      });

      expect(wrapper.find('thead input').exists()).toBe(false);
      expect(wrapper.findAll('tbody input[type="radio"]')).toHaveLength(3);
    });
  });

  describe('expansion', () => {
    it('should expand and collapse a row from its own button', async () => {
      const onExpand = vi.fn();
      const wrapper = render({
        expandable: {
          expandedRowRender: (record) => h('p', `about ${record.name}`),
          onExpand,
        },
      });

      expect(wrapper.find(`.${classes.expandedRow}`).exists()).toBe(false);

      await bodyRows(wrapper)[0]
        .find(`.${classes.expandIcon}`)
        .trigger('click');
      await flushPromises();

      expect(onExpand).toHaveBeenCalledWith(true, rows[0]);
      expect(wrapper.find(`.${classes.expandedRow}`).text()).toBe('about John');
    });

    it('should refuse a row that rowExpandable rejects', () => {
      const wrapper = render({
        expandable: {
          expandedRowRender: () => null,
          rowExpandable: (record) => record.key === '1',
        },
      });

      expect(bodyRows(wrapper)[0].find(`.${classes.expandIcon}`).exists()).toBe(
        true,
      );
      expect(bodyRows(wrapper)[1].find(`.${classes.expandIcon}`).exists()).toBe(
        false,
      );
    });
  });

  describe('sorting', () => {
    it('should walk a column through ascend, descend and back', async () => {
      const onSort = vi.fn();
      const wrapper = render({
        columns: [
          {
            dataIndex: 'name',
            key: 'name',
            onSort,
            title: 'Name',
            sortOrder: null,
          },
        ],
      });

      await wrapper.find(`.${classes.sortIcons}`).trigger('click');

      expect(onSort).toHaveBeenCalledWith('name', 'ascend');
    });

    it('should mark the header with aria-sort', () => {
      const wrapper = render({
        columns: [
          {
            dataIndex: 'name',
            key: 'name',
            onSort: vi.fn(),
            sortOrder: 'descend',
            title: 'Name',
          },
        ],
      });

      expect(wrapper.find('thead th').attributes('aria-sort')).toBe(
        'descending',
      );
    });
  });

  describe('the table’s own columns', () => {
    it('should append a toggle column and report a change', async () => {
      const onToggleChange = vi.fn();
      const wrapper = render({
        toggleable: {
          enabled: true,
          onToggleChange,
          title: 'Active',
          toggledRowKeys: ['1'],
        },
      });

      const toggles = wrapper.findAll('tbody input[type="checkbox"]');

      expect(toggles).toHaveLength(3);
      expect((toggles[0].element as HTMLInputElement).checked).toBe(true);

      await toggles[1].setValue(true);

      expect(onToggleChange).toHaveBeenCalledWith(rows[1], true);
    });

    it('should append a collect column and report a change', async () => {
      const onCollectChange = vi.fn();
      const wrapper = render({
        collectable: {
          collectedRowKeys: ['2'],
          enabled: true,
          onCollectChange,
          title: 'Favorite',
        } as unknown as TableCollectable<Row>,
      });

      const stars = wrapper.findAll(`tbody .${classes.collectHandleIcon}`);

      expect(stars).toHaveLength(3);
      expect(stars[1].attributes('aria-pressed')).toBe('true');

      await stars[0].trigger('click');

      expect(onCollectChange).toHaveBeenCalledWith(rows[0], true);
    });

    it('should append an actions column that renders per record', async () => {
      const onClick = vi.fn();
      const wrapper = render({
        actions: {
          render: (record) => [{ name: `Edit ${record.name}`, onClick }],
          title: 'Action',
        },
      });

      const buttons = wrapper.findAll(`tbody .${classes.actionsCell} button`);

      expect(buttons).toHaveLength(3);
      expect(buttons[0].text()).toBe('Edit John');

      await buttons[0].trigger('click');

      expect(onClick).toHaveBeenCalledWith(rows[0], 0);
    });

    it('should pin rows through the handle column', async () => {
      const onPinChange = vi.fn();
      const wrapper = render({
        pinnable: { enabled: true, onPinChange, pinnedRowKeys: ['2'] },
      });

      const pins = wrapper.findAll(`tbody .${classes.pinHandleIcon}`);

      expect(pins).toHaveLength(3);
      expect(pins[1].attributes('aria-label')).toBe('Unpin row');

      await pins[0].trigger('click');

      expect(onPinChange).toHaveBeenCalledWith(rows[0], true);
    });
  });

  describe('the drag-and-drop shell', () => {
    it('should carry the droppable attributes and the placeholder body', () => {
      const wrapper = render();
      const scrollbar = wrapper.find(`.${classes.host} > div`);

      expect(scrollbar.attributes('data-rfd-droppable-id')).toBe(
        'mzn-table-dnd',
      );
      expect(
        scrollbar.attributes('data-rfd-droppable-context-id'),
      ).toBeDefined();
      expect(wrapper.findAll('table > tbody')).toHaveLength(2);
    });

    it('should leave a nested table out of the shell', () => {
      const wrapper = render({ nested: true });

      expect(wrapper.find('[data-rfd-droppable-id]').exists()).toBe(false);
      expect(wrapper.findAll('table > tbody')).toHaveLength(1);
    });
  });

  it('should hide the header when asked', () => {
    expect(render({ showHeader: false }).find('thead').exists()).toBe(false);
  });

  it('should size the table by its variant', () => {
    expect(render().find('table').classes()).toContain(classes.main);
    expect(render({ size: 'sub' }).find('table').classes()).toContain(
      classes.sub,
    );
  });
});
