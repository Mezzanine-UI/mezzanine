import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  computed,
  defineComponent,
  h,
  ref,
  shallowRef,
  vModelSelect,
  withDirectives,
} from 'vue';
import type { Component, ConcreteComponent, VNodeChild } from 'vue';
import type {
  SortOrder,
  TableDataSourceWithKey,
  TableDraggable,
  TablePinnable,
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
} from '@mezzanine-ui/core/table';
import type { TypographySemanticType } from '@mezzanine-ui/system/typography';
import {
  CopyIcon,
  DotHorizontalIcon,
  DownloadIcon,
  EditIcon,
  FolderMoveIcon,
  TrashIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import MznTable from './table.vue';
import type {
  TableActions,
  TableActionsWithMinWidth,
  TableCollectable,
  TableColumn,
  TableColumnWithMinWidth,
  TableExpandable,
  TableProps,
  TableToggleable,
} from './table.types';
import type { TablePaginationProps } from './table-pagination.types';
import { useTableDataSource } from './use-table-data-source';
import { useTableRowSelection } from './use-table-row-selection';
import MznTag from '../tag/tag.vue';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznToggle from '../toggle/toggle.vue';
import MznInput from '../input/input.vue';
import MznIcon from '../icon/icon.vue';
import MznSlider from '../slider/slider.vue';
import MznDescription from '../description/description.vue';
import MznDescriptionContent from '../description/description-content.vue';
import MznDescriptionGroup from '../description/description-group.vue';

interface DataType extends TableDataSourceWithKey {
  age: number;
  address: string;
  name: string;
  tags?: string[];
  subData?: DataType[];
}

const monoAge = (record: DataType): VNodeChild =>
  h(
    MznTypography,
    { component: 'span', variant: 'body-mono' },
    () => record.age,
  );

const baseColumns: TableColumn<DataType>[] = [
  {
    dataIndex: 'name',
    key: 'name',
    title: 'Name',
    width: 150,
    minWidth: 150,
  },
  {
    key: 'age',
    title: 'Age',
    align: 'center',
    width: 100,
    minWidth: 100,
    render: (record) => monoAge(record),
  },
  {
    dataIndex: 'address',
    key: 'address',
    title: 'Address',
  },
];

const baseData: DataType[] = [
  {
    address: 'New York No. 1 Lake Park',
    age: 32,
    key: '1',
    name: 'John Brown',
    tags: ['nice', 'developer'],
    subData: [
      {
        key: '1-1',
        address: 'Sub New York No. 1 Lake Park',
        age: 10,
        name: 'Sub John Brown',
        tags: ['nice', 'developer'],
      },
      {
        key: '1-2',
        address: 'Sub New York No. 2 Lake Park',
        age: 12,
        name: 'Sub Jim Green',
        tags: ['nice', 'developer'],
      },
    ],
  },
  {
    address: 'London No. 1 Lake Park',
    age: 42,
    key: '2',
    name: 'Jim Green',
    tags: ['loser'],
  },
  {
    address: 'Sydney No. 1 Lake Park',
    age: 35,
    key: '3',
    name: 'Joe Black',
    tags: ['cool', 'teacher'],
    subData: [
      {
        key: '3-1',
        address: 'Sub New York No. 1 Lake Park',
        age: 10,
        name: 'Sub John Brown',
        tags: ['nice', 'developer'],
      },
      {
        key: '3-2',
        address: 'Sub New York No. 2 Lake Park',
        age: 12,
        name: 'Sub Jim Green',
        tags: ['nice', 'developer'],
      },
    ],
  },
  {
    address: 'Tokyo No. 1 Lake Park',
    age: 30,
    key: '4',
    name: 'Jane Doe',
    tags: ['developer'],
  },
  {
    address: 'Paris No. 1 Lake Park',
    age: 21,
    key: '5',
    name: 'Jack Smith',
    tags: ['nice', 'cool'],
  },
  {
    address: 'Berlin No. 1 Lake Park',
    age: 45,
    key: '6',
    name: 'Emily Davis',
    tags: ['loser', 'teacher'],
  },
  {
    address: 'Madrid No. 1 Lake Park',
    age: 38,
    key: '7',
    name: 'Michael Johnson',
    tags: ['developer', 'teacher'],
  },
  {
    address: 'Rome No. 1 Lake Park',
    age: 29,
    key: '8',
    name: 'Sarah Wilson',
    tags: ['nice'],
  },
  {
    address: 'Dublin No. 1 Lake Park',
    age: 33,
    key: '9',
    name: 'David Brown',
    tags: ['cool', 'developer'],
  },
];

/**
 * MznTable is the port's only generic SFC, so its type is a generic function
 * rather than a `ConcreteComponent` and Storybook's `Meta` will not take it
 * directly. The cast is type-level only — Storybook reads the real component at
 * runtime, exactly as React's meta does.
 */
const meta = {
  title: 'Data Display/Table',
  component: MznTable as unknown as ConcreteComponent,
} satisfies Meta<ConcreteComponent>;

export default meta;

type Story = StoryObj<ConcreteComponent>;

/**
 * Stories are authored with `h()` rather than a template: JSX emits one text
 * node per child, and a Vue template would merge adjacent text and
 * interpolations into a single one (see PORTING-PLAYBOOK P13).
 */
const table = (props: Partial<TableProps<DataType>>): VNodeChild =>
  h(MznTable as unknown as Component, props as Record<string, unknown>);

export const Basic: Story = {
  render: () => ({
    render: () => table({ columns: baseColumns, dataSource: baseData }),
  }),
};

export const SubSize: Story = {
  render: () => ({
    render: () =>
      table({ columns: baseColumns, dataSource: baseData, size: 'sub' }),
  }),
};

const RowHeightPresetStory = defineComponent({
  setup() {
    const currentSize = ref<TableProps<DataType>['size']>('main');
    const currentPreset = ref<TableProps<DataType>['rowHeightPreset']>('base');

    return () =>
      h(
        'div',
        { style: { display: 'grid', gridAutoColumns: 'row', gap: '12px' } },
        [
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            [
              h('span', 'Size:'),
              withDirectives(
                h(
                  'select',
                  {
                    onChange: (event: Event) => {
                      currentSize.value = (event.target as HTMLSelectElement)
                        .value as TableProps<DataType>['size'];
                    },
                    style: { marginLeft: '8px' },
                  },
                  [
                    h('option', { value: 'main' }, 'main'),
                    h('option', { value: 'sub' }, 'sub'),
                  ],
                ),
                [[vModelSelect, currentSize.value]],
              ),
            ],
          ),
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            [
              h('span', 'Row Height Preset:'),
              withDirectives(
                h(
                  'select',
                  {
                    onChange: (event: Event) => {
                      currentPreset.value = (event.target as HTMLSelectElement)
                        .value as TableProps<DataType>['rowHeightPreset'];
                    },
                    style: { marginLeft: '8px' },
                  },
                  [
                    h('option', { value: 'base' }, 'base'),
                    h('option', { value: 'condensed' }, 'condensed'),
                    h('option', { value: 'detailed' }, 'detailed'),
                    h('option', { value: 'roomy' }, 'roomy'),
                  ],
                ),
                [[vModelSelect, currentPreset.value]],
              ),
            ],
          ),
          table({
            columns: baseColumns,
            dataSource: baseData,
            size: currentSize.value,
            rowHeightPreset: currentPreset.value,
          }),
        ],
      );
  },
});

export const RowHeightPreset: Story = {
  render: () => ({ render: () => h(RowHeightPresetStory) }),
};

const DataStateRepresentationStory = defineComponent({
  setup() {
    const separatorAtRowIndexes = [3, 6];

    return () =>
      h(
        'div',
        { style: { display: 'grid', gridAutoColumns: 'row', gap: '16px' } },
        [
          h('span', 'separatorAtRowIndexes: [3, 6], zebraStriping: true'),
          table({
            columns: baseColumns,
            dataSource: baseData,
            separatorAtRowIndexes,
            zebraStriping: true,
          }),
        ],
      );
  },
});

export const DataStateRepresentation: Story = {
  render: () => ({ render: () => h(DataStateRepresentationStory) }),
};

const CreateDeleteTransitionStory = defineComponent({
  setup() {
    const newName = ref('');
    const newAge = ref('');
    const newAddress = ref('');
    const currentPage = ref(1);
    const itemsPerPage = 5;

    // Simulated server-side database (represents backend storage)
    let serverDatabase: DataType[] = Array.from({ length: 23 }, (_, i) => ({
      address: `Address ${i + 1}`,
      age: 20 + (i % 40),
      key: String(i + 1),
      name: `User ${i + 1}`,
    }));

    // Simulate API response format: { total: number, items: T[] }
    const fetchPageData = (
      offset: number,
      limit: number,
    ): { items: DataType[]; total: number } => ({
      items: serverDatabase.slice(offset, offset + limit),
      total: serverDatabase.length,
    });

    // Initialize with first page data
    const initialData = fetchPageData(0, itemsPerPage);

    const { dataSource, transitionState, updateDataSource } =
      useTableDataSource<DataType>({
        initialData: initialData.items,
        highlightDuration: 1000,
        fadeOutDuration: 200,
      });

    // Handle page change
    const handlePageChange = (page: number): void => {
      const offset = (page - 1) * itemsPerPage;
      const response = fetchPageData(offset, itemsPerPage);

      currentPage.value = page;
      updateDataSource(response.items);
    };

    // Simulate GraphQL create mutation + refetch current page
    const handleCreateMutation = (): void => {
      if (!newName.value.trim()) return;

      const newItem: DataType = {
        address: newAddress.value || 'Unknown Address',
        age: parseInt(newAge.value, 10) || 0,
        key: String(Date.now()),
        name: newName.value,
      };

      // 1. Server adds the item (prepend to beginning)
      serverDatabase = [newItem, ...serverDatabase];

      // 2. Refetch current page data (API pattern)
      const offset = (currentPage.value - 1) * itemsPerPage;
      const response = fetchPageData(offset, itemsPerPage);

      // 3. Update with animation
      const isNewItemInCurrentPage = response.items.some(
        (item) => item.key === newItem.key,
      );

      updateDataSource(response.items, {
        addedKeys: isNewItemInCurrentPage ? [newItem.key] : [],
      });

      newName.value = '';
      newAge.value = '';
      newAddress.value = '';
    };

    // Simulate GraphQL delete mutation + refetch current page
    const handleDeleteMutation = (key: string): void => {
      // 1. Server removes the item
      serverDatabase = serverDatabase.filter((item) => item.key !== key);

      // 2. Refetch current page data
      const offset = (currentPage.value - 1) * itemsPerPage;
      const response = fetchPageData(offset, itemsPerPage);

      // 3. Check if we need to go back a page (current page is now empty)
      const maxPage = Math.ceil(response.total / itemsPerPage);
      const newPage =
        currentPage.value > maxPage ? Math.max(1, maxPage) : currentPage.value;

      // Page changed, fetch new page without delete animation
      const newOffset = (newPage - 1) * itemsPerPage;
      const newResponse = fetchPageData(newOffset, itemsPerPage);

      currentPage.value = newPage;
      updateDataSource(newResponse.items, { removedKeys: [key] });
    };

    const transitionColumns: TableColumn<DataType>[] = [
      { dataIndex: 'name', key: 'name', title: 'Name', width: 150 },
      {
        key: 'age',
        render: (record) => monoAge(record),
        title: 'Age',
        width: 100,
      },
      { dataIndex: 'address', key: 'address', title: 'Address' },
    ];

    const actions = computed(
      (): TableActions<DataType> => ({
        render: (record: DataType) => [
          {
            name: 'Delete',
            onClick: () => handleDeleteMutation(String(record.key)),
          },
        ],
        title: 'Action',
        variant: 'destructive-text-link' as const,
        width: 120,
      }),
    );

    const pagination = computed(
      (): TablePaginationProps => ({
        current: currentPage.value,
        onChange: handlePageChange,
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, t: number) =>
          `${from}-${to} 筆，共 ${t} 筆`,
        total: initialData.total,
      }),
    );

    return () =>
      h('div', { style: { width: '100%' } }, [
        h(
          'div',
          {
            style: {
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '16px',
              padding: '16px',
            },
          },
          [
            h(
              'h4',
              { style: { margin: '0 0 8px 0' } },
              'GraphQL Pattern: mutation → refetch → updateDataSource',
            ),
            h(
              'p',
              'Please use "useTableDataSource" to manage data source with\n            create/delete',
            ),
            h('p', { style: { color: '#666', fontSize: '14px', margin: 0 } }, [
              'API returns ',
              h('code', '{ total: number, items: T[] }'),
              ' format. Pagination uses offset + limit. New items are prepended.',
            ]),
          ],
        ),
        h(
          'div',
          {
            style: {
              marginBottom: '16px',
              display: 'flex',
              flexFlow: 'row',
              gap: '8px',
            },
          },
          [
            h(MznInput, {
              onChange: (event: Event) => {
                newName.value = (event.target as HTMLInputElement).value;
              },
              placeholder: 'Name',
              value: newName.value,
            }),
            h(MznInput, {
              onChange: (event: Event) => {
                newAge.value = (event.target as HTMLInputElement).value;
              },
              placeholder: 'Age',
              value: newAge.value,
              variant: 'number',
            }),
            h(MznInput, {
              onChange: (event: Event) => {
                newAddress.value = (event.target as HTMLInputElement).value;
              },
              placeholder: 'Address',
              value: newAddress.value,
            }),
            h(
              MznButton,
              {
                disabled: !newName.value.trim() || undefined,
                onClick: handleCreateMutation,
                variant: 'base-primary',
              },
              () => 'Create',
            ),
          ],
        ),
        table({
          actions: actions.value,
          columns: transitionColumns,
          dataSource: dataSource.value,
          pagination: pagination.value,
          transitionState: transitionState.value,
        }),
      ]);
  },
});

export const CreateDeleteTransition: Story = {
  render: () => ({ render: () => h(CreateDeleteTransitionStory) }),
};

/** Component */
const ExpandedRowRender = defineComponent({
  props: {
    columns: { required: true, type: Array as () => TableColumn<DataType>[] },
    record: { required: true, type: Object as () => DataType },
  },
  setup(props) {
    const {
      dataSource: childDataSource,
      transitionState: childTransitionState,
      updateDataSource: updateChildDataSource,
    } = useTableDataSource<DataType>({
      initialData: props.record.subData,
      highlightDuration: 1500,
      fadeOutDuration: 300,
    });

    const actions = computed(
      (): TableActions<DataType> => ({
        render: (subRecord) => [
          {
            name: 'Delete',
            onClick: () => {
              updateChildDataSource(
                childDataSource.value.filter(
                  (item) => item.key !== subRecord.key,
                ),
                { removedKeys: [subRecord.key] },
              );
            },
          },
        ],
        title: 'Action',
        variant: 'destructive-text-link',
        width: 100,
      }),
    );

    return () =>
      h('div', [
        h(
          'div',
          {
            style: {
              display: 'flex',
              gap: '8px',
              justifyContent: 'flex-end',
              marginBottom: '8px',
            },
          },
          [
            h(
              MznButton,
              {
                onClick: () => {
                  const newSource = {
                    key: `new-${Date.now()}`,
                    name: 'New Sub Item',
                    age: 0,
                    address: 'New Address',
                  };

                  updateChildDataSource([...childDataSource.value, newSource], {
                    addedKeys: [newSource.key],
                  });
                },
                size: 'sub',
                variant: 'base-secondary',
              },
              () => 'Add Sub Item',
            ),
          ],
        ),
        table({
          actions: actions.value,
          columns: props.columns,
          dataSource: childDataSource.value,
          transitionState: childTransitionState.value,
          showHeader: false,
          nested: true,
        }),
      ]);
  },
});

const CreateDeleteTransitionWithExpansionStory = defineComponent({
  setup() {
    // Parent table transition state
    const {
      dataSource: parentDataSource,
      transitionState: parentTransitionState,
      updateDataSource: updateParentDataSource,
    } = useTableDataSource<DataType>({
      initialData: baseData,
      highlightDuration: 700,
      fadeOutDuration: 150,
    });

    const columns: TableColumn<DataType>[] = [
      { dataIndex: 'name', key: 'name', title: 'Name', width: 150 },
      {
        key: 'age',
        render: (record) => monoAge(record),
        title: 'Age',
        width: 100,
      },
      { dataIndex: 'address', key: 'address', title: 'Address' },
    ];

    const actions = computed(
      (): TableActions<DataType> => ({
        render: (record: DataType) => [
          {
            name: 'Delete Parent',
            onClick: () => {
              updateParentDataSource(
                parentDataSource.value.filter(
                  (item) => item.key !== record.key,
                ),
                { removedKeys: [record.key] },
              );
            },
          },
        ],
        title: 'Action',
        variant: 'destructive-text-link' as const,
        width: 140,
      }),
    );

    const expandable: TableExpandable<DataType> = {
      expandedRowRender: (record: DataType) =>
        h(ExpandedRowRender, { columns, record }),
      rowExpandable: (record: DataType) => !!record.subData?.length,
    };

    return () =>
      h('div', { style: { width: '100%' } }, [
        h(
          'div',
          {
            style: {
              background: '#f5f5f5',
              borderRadius: '8px',
              marginBottom: '16px',
              padding: '16px',
            },
          },
          [
            h(
              'h4',
              { style: { margin: '0 0 8px 0' } },
              'Transition with Expansion Demo',
            ),
            h(
              'p',
              { style: { margin: '0 0 4px 0' } },
              '1. 刪除父層資料時，展開區域會同步顯示刪除提示',
            ),
            h(
              'p',
              { style: { margin: '0 0 4px 0' } },
              '2. 在展開區域內的子表格中刪除項目，該項目會有獨立的刪除過渡效果',
            ),
            h(
              'p',
              { style: { color: '#666', fontSize: '14px', margin: 0 } },
              '點擊展開圖標查看子表格，然後嘗試刪除父層或子層項目',
            ),
          ],
        ),
        table({
          actions: actions.value,
          columns,
          dataSource: parentDataSource.value,
          expandable,
          transitionState: parentTransitionState.value,
        }),
      ]);
  },
});

export const CreateDeleteTransitionWithExpansion: Story = {
  render: () => ({ render: () => h(CreateDeleteTransitionWithExpansionStory) }),
};

const WithSortingStory = defineComponent({
  setup() {
    const controlledDataSource = shallowRef<DataType[]>(baseData);
    const sortOrder = shallowRef<{ key: string; sortOrder: SortOrder } | null>({
      key: 'name',
      sortOrder: 'ascend',
    });

    const controlledSortColumns = computed((): TableColumn<DataType>[] => [
      {
        dataIndex: 'name',
        key: 'name',
        sortOrder:
          sortOrder.value?.key === 'name'
            ? sortOrder.value?.sortOrder
            : undefined,
        onSort: (key, order) => {
          sortOrder.value = { key, sortOrder: order };

          if (order) {
            controlledDataSource.value = [...controlledDataSource.value].sort(
              (a, b) =>
                order === 'ascend'
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name),
            );
          } else {
            controlledDataSource.value = baseData;
          }
        },
        title: 'Name',
        width: 150,
      },
      {
        key: 'age',
        render: (record) => monoAge(record),
        sortOrder:
          sortOrder.value?.key === 'age'
            ? sortOrder.value?.sortOrder
            : undefined,
        onSort: (key, order) => {
          sortOrder.value = { key, sortOrder: order };

          if (order) {
            controlledDataSource.value = [...controlledDataSource.value].sort(
              (a, b) => (order === 'ascend' ? a.age - b.age : b.age - a.age),
            );
          } else {
            controlledDataSource.value = baseData;
          }
        },
        title: 'Age',
        width: 100,
      },
      { dataIndex: 'address', key: 'address', title: 'Address' },
    ]);

    return () =>
      h(
        'div',
        { style: { display: 'grid', gridAutoColumns: 'row', gap: '12px' } },
        [
          h(
            'span',
            `Controlled sort order: { key: "${sortOrder.value?.key}", sortOrder: "${sortOrder.value?.sortOrder}"}`,
          ),
          table({
            columns: controlledSortColumns.value,
            dataSource: controlledDataSource.value,
          }),
        ],
      );
  },
});

export const WithSorting: Story = {
  render: () => ({ render: () => h(WithSortingStory) }),
};

const WithRowSelectionStory = defineComponent({
  setup() {
    // full example
    const currentPage = ref(1);
    const itemsPerPage = 10;

    const originData = Array.from({ length: 100 }, (_, i) => ({
      address: `Address ${i + 1}`,
      age: 20 + (i % 50),
      key: String(i + 1),
      name: `User ${i + 1}`,
      disabled: i % 4 === 0,
    }));

    const paginationData = computed(() =>
      originData.slice(
        (currentPage.value - 1) * itemsPerPage,
        currentPage.value * itemsPerPage,
      ),
    );

    const selectedRowKeys = shallowRef<string[]>([]);
    const hideSelectAll = ref(false);
    const preserveSelectedRowKeys = ref(false);

    // Radio selection example
    const selectedRadioKey = ref<string | undefined>();

    const checkboxRowSelection = computed(
      (): TableRowSelectionCheckbox<DataType> =>
        ({
          mode: 'checkbox' as const,
          hideSelectAll: hideSelectAll.value,
          preserveSelectedRowKeys: preserveSelectedRowKeys.value,
          onChange: (keys: string[]) => {
            selectedRowKeys.value = keys;
          },
          selectedRowKeys: selectedRowKeys.value,
          isSelectionDisabled: (record: DataType) =>
            (record as (typeof originData)[number]).disabled,
        }) as TableRowSelectionCheckbox<DataType>,
    );

    const pagination = computed(
      (): TablePaginationProps => ({
        current: currentPage.value,
        onChange: (page: number) => {
          currentPage.value = page;
        },
        total: 100,
        showPageSizeOptions: true,
        pageSizeLabel: '每頁顯示：',
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, total: number) =>
          `${from}-${to} 筆，共 ${total} 筆`,
        showJumper: true,
        inputPlaceholder: '頁碼',
        hintText: '前往',
        buttonText: '確定',
      }),
    );

    const radioRowSelection = computed(
      (): TableRowSelectionRadio<DataType> =>
        ({
          mode: 'radio' as const,
          onChange: (key: string) => {
            selectedRadioKey.value = key;
          },
          selectedRowKey: selectedRadioKey.value,
          isSelectionDisabled: (record: DataType) => record.age > 40,
        }) as TableRowSelectionRadio<DataType>,
    );

    return () =>
      h('div', [
        h(
          'div',
          {
            style: {
              margin: '0 0 16px',
              display: 'flex',
              flexFlow: 'column',
              gap: '4px',
            },
          },
          [
            h('span', 'Mode: checkbox'),
            h('span', ['- Selected: [', selectedRowKeys.value.join(', '), ']']),
            h(MznToggle, {
              checked: hideSelectAll.value,
              label: 'props.hideSelectAll',
              onChange: (event: Event) => {
                hideSelectAll.value = (
                  event.target as HTMLInputElement
                ).checked;
              },
            }),
            h(MznToggle, {
              checked: preserveSelectedRowKeys.value,
              label: 'props.preserveSelectedRowKeys',
              onChange: (event: Event) => {
                preserveSelectedRowKeys.value = (
                  event.target as HTMLInputElement
                ).checked;
              },
            }),
          ],
        ),
        table({
          columns: baseColumns,
          dataSource: paginationData.value,
          rowSelection: checkboxRowSelection.value,
          pagination: pagination.value,
        }),
        h(
          'div',
          {
            style: {
              margin: '32px 0 16px',
              display: 'flex',
              flexFlow: 'column',
              gap: '4px',
            },
          },
          [
            h('span', 'Mode: radio'),
            h('span', ['- Selected: ', selectedRadioKey.value]),
          ],
        ),
        table({
          columns: baseColumns,
          dataSource: baseData,
          rowSelection: radioRowSelection.value,
        }),
      ]);
  },
});

export const WithRowSelection: Story = {
  render: () => ({ render: () => h(WithRowSelectionStory) }),
};

const WithBulkActionsStory = defineComponent({
  setup() {
    // full example
    const currentPage = ref(1);
    const itemsPerPage = 20;

    const originData = Array.from({ length: 100 }, (_, i) => ({
      address: `Address ${i + 1}`,
      age: 20 + (i % 50),
      key: `${i + 1}`,
      name: `User ${i + 1}`,
      disabled: i % 4 === 0,
    }));

    const paginationData = computed(() =>
      originData.slice(
        (currentPage.value - 1) * itemsPerPage,
        currentPage.value * itemsPerPage,
      ),
    );

    const selectedRowKeys = shallowRef<string[]>([]);

    const rowSelection = computed(
      (): TableRowSelectionCheckbox<DataType> =>
        ({
          mode: 'checkbox' as const,
          bulkActions: {
            mainActions: [
              { icon: FolderMoveIcon, label: 'Move', onClick: () => {} },
              { icon: CopyIcon, label: 'Copy', onClick: () => {} },
              { icon: DownloadIcon, label: 'Download', onClick: () => {} },
            ],
            destructiveAction: {
              icon: TrashIcon,
              label: 'Delete',
              onClick: () => {},
            },
            overflowAction: {
              icon: DotHorizontalIcon,
              label: 'More',
              onSelect: (
                option: { id: string; name: string },
                keys: string[],
              ) => {
                // eslint-disable-next-line no-console
                console.log('Overflow action:', option, keys);
              },
              options: [
                { id: 'opt1', name: 'Option 1' },
                { id: 'opt2', name: 'Option 2' },
                { id: 'opt3', name: 'Option 3' },
              ],
              placement: 'top' as const,
            },
            renderSelectionSummary: (count: number) => `已選擇 ${count} 筆資料`,
          },
          onChange: (keys: string[]) => {
            selectedRowKeys.value = keys;
          },
          selectedRowKeys: selectedRowKeys.value,
          isSelectionDisabled: (record: DataType) =>
            (record as (typeof originData)[number]).disabled,
        }) as unknown as TableRowSelectionCheckbox<DataType>,
    );

    const pagination = computed(
      (): TablePaginationProps => ({
        current: currentPage.value,
        onChange: (page: number) => {
          currentPage.value = page;
        },
        total: 100,
        showPageSizeOptions: true,
        pageSizeLabel: '每頁顯示：',
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, total: number) =>
          `${from}-${to} 筆，共 ${total} 筆`,
        showJumper: true,
        inputPlaceholder: '頁碼',
        hintText: '前往',
        buttonText: '確定',
      }),
    );

    return () =>
      h('div', [
        h(
          'div',
          { style: { width: '100%', height: '100px' } },
          '(Extra spaces for demo fixed bulk actions)',
        ),
        h(
          'div',
          {
            style: {
              margin: '0 0 16px',
              display: 'flex',
              flexFlow: 'column',
              gap: '4px',
            },
          },
          [
            h('span', 'Mode: checkbox + bulkActions'),
            h('span', ['- Selected: [', selectedRowKeys.value.join(', '), ']']),
          ],
        ),
        table({
          columns: baseColumns,
          dataSource: paginationData.value,
          rowSelection: rowSelection.value,
          pagination: pagination.value,
        }),
        h(
          'div',
          { style: { width: '100%', height: '600px' } },
          '(Extra spaces for demo fixed bulk actions)',
        ),
      ]);
  },
});

export const WithBulkActions: Story = {
  render: () => ({ render: () => h(WithBulkActionsStory) }),
};

const WithPaginationStory = defineComponent({
  setup() {
    const currentPage = ref(1);
    const itemsPerPage = 10;

    const paginationData = computed((): DataType[] =>
      Array.from({ length: itemsPerPage }, (_, i) => ({
        address: `Address ${i + (currentPage.value - 1) * itemsPerPage + 1}`,
        age: 20 + (i + (currentPage.value - 1) * itemsPerPage),
        key: String(i + (currentPage.value - 1) * itemsPerPage + 1),
        name: `User ${i + (currentPage.value - 1) * itemsPerPage + 1}`,
      })),
    );

    const pagination = computed(
      (): TablePaginationProps => ({
        current: currentPage.value,
        onChange: (page: number) => {
          currentPage.value = page;
        },
        total: 100,
        showPageSizeOptions: true,
        pageSizeLabel: '每頁顯示：',
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, total: number) =>
          `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`,
        showJumper: true,
        inputPlaceholder: '頁碼',
        hintText: '前往',
        buttonText: '確定',
      }),
    );

    return () =>
      table({
        columns: baseColumns,
        dataSource: paginationData.value,
        pagination: pagination.value,
      });
  },
});

export const WithPagination: Story = {
  render: () => ({ render: () => h(WithPaginationStory) }),
};

const WithExpansionStory = defineComponent({
  setup() {
    const expandableWithDescription: TableExpandable<DataType> = {
      expandedRowRender: () =>
        h('div', { style: { padding: '6px 12px' } }, [
          h(MznDescriptionGroup, null, () => [
            h(
              MznDescription,
              { title: 'Date Created At', widthType: 'wide' },
              () => [
                h(MznDescriptionContent, {
                  children: 'Tue, 03 Aug 2021 14:22:18 GMT',
                }),
              ],
            ),
            h(
              MznDescription,
              { title: 'Data Updated At', widthType: 'wide' },
              () => [
                h(MznDescriptionContent, {
                  children: 'Tue, 05 Aug 2025 11:22:18 GMT',
                }),
              ],
            ),
          ]),
        ]),
      rowExpandable: (record: DataType) => !!record.subData?.length,
    };

    const expandableWithSubTable: TableExpandable<DataType> = {
      expandedRowRender: (record: DataType) =>
        table({ columns: baseColumns, dataSource: record.subData || [] }),
      rowExpandable: (record: DataType) => !!record.subData?.length,
    };

    return () =>
      h(
        'div',
        { style: { display: 'grid', gridAutoColumns: 'row', gap: '12px' } },
        [
          h('span', 'Expansion with description'),
          table({
            columns: baseColumns,
            dataSource: baseData,
            expandable: expandableWithDescription,
          }),
          h('span', 'Expansion with sub table'),
          table({
            columns: baseColumns,
            dataSource: baseData,
            expandable: expandableWithSubTable,
          }),
        ],
      );
  },
});

export const WithExpansion: Story = {
  render: () => ({ render: () => h(WithExpansionStory) }),
};

const WithFixedColumnsStory = defineComponent({
  setup() {
    const fixedColumns: TableColumn<DataType>[] = [
      {
        dataIndex: 'name',
        fixed: 'start',
        key: 'name',
        title: 'Name',
        width: 120,
      },
      {
        key: 'age',
        render: (record) => monoAge(record),
        title: 'Age',
        width: 140,
      },
      {
        key: 'age2',
        render: (record) => monoAge(record),
        title: 'Fixed Age',
        width: 120,
        fixed: 'start',
      },
      {
        dataIndex: 'address',
        key: 'address1',
        title: 'Address 1',
        width: 400,
      },
      {
        dataIndex: 'address',
        key: 'address2',
        title: 'Fixed Address',
        width: 200,
        fixed: 'end',
      },
      {
        dataIndex: 'address',
        key: 'address3',
        title: 'Address 3',
        width: 250,
      },
    ];

    const actions: TableActions<DataType> = {
      fixed: 'end' as const,
      render: () => [{ name: 'Edit', onClick: () => {} }],
      title: 'Action',
      variant: 'base-text-link' as const,
      width: 100,
    };

    return () =>
      h(
        'div',
        {
          style: {
            width: '100%',
            display: 'flex',
            flexFlow: 'column',
            alignItems: 'flex-start',
            gap: '12px',
          },
        },
        [
          h(
            'span',
            'Fixed Columns: "Name (start)", "Fixed Age (start)", "Fixed Address (end)", "Action (end)"',
          ),
          h('div', { style: { width: '100%' } }, [
            table({
              actions,
              columns: fixedColumns,
              dataSource: baseData,
              fullWidth: true,
            }),
          ]),
        ],
      );
  },
});

export const WithFixedColumns: Story = {
  render: () => ({ render: () => h(WithFixedColumnsStory) }),
};

const RESIZE_STRATEGY_TEXT = `Resize strategy: drag any column's right handle — the rightmost column (Address) absorbs the change first, so middle columns stay put. Once Address shrinks to its minWidth (200), the next column to the right of the dragged handle starts to compensate.

Try: drag "Name" right → only Address shrinks. Keep dragging until Address hits 200px → "Age" starts shrinking.

Columns:
  Name      width 120, minWidth 80
  Age       width  70, minWidth 50
  Status    width 100, minWidth 80
  Role      width 100, minWidth 80
  Tags      width  80, minWidth 60
  Address   minWidth 200 (donor)`;

const WithResizableColumnsStory = defineComponent({
  setup() {
    const resizableColumns: TableColumnWithMinWidth<DataType>[] = [
      {
        dataIndex: 'name',
        key: 'name',
        title: 'Name',
        width: 120,
        minWidth: 80,
      },
      {
        align: 'center',
        key: 'age',
        render: (record) => monoAge(record),
        title: 'Age',
        width: 70,
        minWidth: 50,
      },
      {
        key: 'status',
        render: (record) =>
          h(
            MznTypography,
            {
              component: 'span',
              // React's story passes `body2`, which is not a
              // `TypographySemanticType` — it is one of the 13 type errors
              // `packages/react` already reports. Mirrored so the rendered
              // class matches.
              variant: 'body2' as TypographySemanticType,
            },
            () => record.tags?.[0] ?? '-',
          ),
        title: 'Status',
        width: 100,
        minWidth: 80,
      },
      {
        key: 'role',
        render: (record) =>
          h(
            MznTypography,
            {
              component: 'span',
              variant: 'body2' as TypographySemanticType,
            },
            () => record.tags?.[1] ?? '-',
          ),
        title: 'Role',
        width: 100,
        minWidth: 80,
      },
      {
        align: 'center',
        key: 'tagsCount',
        render: (record) =>
          h(
            MznTypography,
            { component: 'span', variant: 'body-mono' },
            () => record.tags?.length ?? 0,
          ),
        title: 'Tags',
        width: 80,
        minWidth: 60,
      },
      {
        dataIndex: 'address',
        key: 'address',
        title: 'Address',
        minWidth: 200,
      },
    ];

    return () =>
      h(
        'div',
        {
          style: {
            width: '100%',
            display: 'flex',
            flexFlow: 'column',
            gap: '12px',
          },
        },
        [
          h(
            'span',
            { style: { whiteSpace: 'pre-line' } },
            RESIZE_STRATEGY_TEXT,
          ),
          table({
            columns: resizableColumns as TableColumn<DataType>[],
            dataSource: baseData,
            resizable: true,
          }),
        ],
      );
  },
});

export const WithResizableColumns: Story = {
  render: () => ({ render: () => h(WithResizableColumnsStory) }),
};

const WithCustomRenderStory = defineComponent({
  setup() {
    const customColumns: TableColumn<DataType>[] = [
      {
        key: 'name',
        title: 'Name',
        render: (record) =>
          h(
            'div',
            {
              style: {
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                gap: '4px',
              },
            },
            [h(MznIcon, { icon: UserIcon, size: 24 }), h('span', record.name)],
          ),
        width: 150,
      },
      {
        key: 'age',
        render: (record) => monoAge(record),
        title: 'Age',
        width: 100,
      },
      {
        key: 'tags',
        render: (record) =>
          h(
            'div',
            { style: { display: 'flex', gap: '4px' } },
            record.tags?.map((tag) =>
              h(MznTag, { key: tag, label: tag, size: 'sub' }),
            ),
          ),
        title: 'Tags',
        width: 200,
      },
      {
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        title: 'Address',
        width: 150,
      },
    ];

    return () => table({ columns: customColumns, dataSource: baseData });
  },
});

export const WithCustomRender: Story = {
  render: () => ({ render: () => h(WithCustomRenderStory) }),
};

const LoadingStory = defineComponent({
  setup() {
    const loadingRowsCount = ref(10);

    return () =>
      h(
        'div',
        { style: { display: 'grid', gridAutoColumns: 'row', gap: '36px' } },
        [
          h(
            'div',
            { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
            [
              h('span', 'props.loadingRowsCount: '),
              h('div', { style: { width: '260px' } }, [
                h(MznSlider, {
                  value: loadingRowsCount.value,
                  min: 1,
                  max: 10,
                  step: 1,
                  onChange: (value: number | [number, number]) => {
                    loadingRowsCount.value = value as number;
                  },
                }),
              ]),
            ],
          ),
          table({
            columns: baseColumns,
            dataSource: [],
            loading: true,
            loadingRowsCount: loadingRowsCount.value,
          }),
        ],
      );
  },
});

export const Loading: Story = {
  render: () => ({ render: () => h(LoadingStory) }),
};

const LoadingWithRecordCallbacksStory = defineComponent({
  setup() {
    const loading = ref(true);

    /**
     * Every callback below dereferences a nested field without guarding for
     * the loading state. Skeleton rows carry no record, so none of them are
     * called while loading — flipping the switch must never throw.
     */
    const columns: TableColumn<DataType>[] = [
      {
        key: 'name',
        title: 'Name',
        width: 150,
        render: (record) => (record.subData as DataType[])[0].name,
      },
      { dataIndex: 'address', key: 'address', title: 'Address' },
    ];

    const actions: TableActions<DataType> = {
      render: (record) => [
        {
          name: (record.subData as DataType[])[0].name,
          onClick: () => {},
          type: 'button' as const,
        },
      ],
    };

    const expandable: TableExpandable<DataType> = {
      // Collides with the placeholder keys the table used to fabricate.
      expandedRowKeys: ['0', '1', '2'],
      expandedRowRender: (record) =>
        h('div', (record.subData as DataType[])[0].name),
      rowExpandable: (record) => !!(record.subData as DataType[])[0],
    };

    const rowSelection = {
      getCheckboxProps: (record: DataType) => ({
        selected: !!(record.subData as DataType[])[0],
      }),
      isSelectionDisabled: (record: DataType) => !!record.subData?.length,
      mode: 'checkbox' as const,
      onChange: () => {},
      selectedRowKeys: [],
    } as unknown as TableRowSelectionCheckbox<DataType>;

    const rowState = (record: DataType) =>
      (record.subData as DataType[])[0] ? ('added' as const) : undefined;

    const dataWithSubData = baseData.filter((record) => record.subData?.length);

    return () =>
      h('div', [
        h('p', { style: { margin: '0 0 8px' } }, [
          'Every column render, action, rowState, rowExpandable and getCheckboxProps below dereferences ',
          h('code', 'record.subData[0]'),
          ' ',
          'without any loading guard. Toggling loading must never throw.',
        ]),
        h(
          MznButton,
          {
            style: { marginBottom: '16px' },
            onClick: () => {
              loading.value = !loading.value;
            },
            variant: 'base-primary',
          },
          () => (loading.value ? 'Finish loading' : 'Start loading'),
        ),
        table({
          actions,
          columns,
          dataSource: dataWithSubData,
          expandable,
          loading: loading.value,
          rowSelection,
          rowState,
        }),
      ]);
  },
});

export const LoadingWithRecordCallbacks: Story = {
  render: () => ({ render: () => h(LoadingWithRecordCallbacksStory) }),
};

const EmptyStateStory = defineComponent({
  setup() {
    const emptyProps = {
      height: 444,
      type: 'result' as const,
      title: 'No data available',
      description: 'There is no data to display in the table.',
    };

    return () => table({ columns: baseColumns, dataSource: [], emptyProps });
  },
});

export const EmptyState: Story = {
  render: () => ({ render: () => h(EmptyStateStory) }),
};

const VirtualScrollingStory = defineComponent({
  setup() {
    const largeDataList: DataType[] = Array.from({ length: 10000 }, (_, i) => ({
      address: `Address ${i + 1}`,
      age: 20 + (i % 50),
      key: String(i + 1),
      name: `User ${i + 1}`,
    }));

    const scroll = { virtualized: true as const, y: 420 };

    return () =>
      table({ columns: baseColumns, dataSource: largeDataList, scroll });
  },
});

export const VirtualScrolling: Story = {
  render: () => ({ render: () => h(VirtualScrollingStory) }),
};

const DraggableRowsStory = defineComponent({
  setup() {
    const data = shallowRef<DataType[]>(baseData);

    const draggable: TableDraggable<DataType> = {
      enabled: true,
      onDragEnd: (newData: DataType[]) => {
        data.value = newData;
      },
    };

    const scroll = { y: 300 };

    return () =>
      h('div', [
        h('p', { style: { margin: '0 0 16px' } }, 'Drag rows to reorder them'),
        table({
          columns: baseColumns,
          dataSource: data.value,
          draggable,
          scroll,
        }),
      ]);
  },
});

export const DraggableRows: Story = {
  render: () => ({ render: () => h(DraggableRowsStory) }),
};

const DraggableRowsWithRefetchStory = defineComponent({
  setup() {
    const data = shallowRef<DataType[]>(baseData);
    const loading = ref(false);

    const draggable: TableDraggable<DataType> = {
      enabled: true,
      onDragEnd: (newData: DataType[]) => {
        data.value = newData;
      },
    };

    const scroll = { y: 300 };

    const handleRefetch = (): void => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1500);
    };

    return () =>
      h('div', [
        h(
          'p',
          { style: { margin: '0 0 8px' } },
          'Simulates a refetch while data rows are still rendered inside Draggable. Click the button to trigger loading — drag handles should remain functional without dnd errors.',
        ),
        h(
          MznButton,
          {
            style: { marginBottom: '16px' },
            onClick: handleRefetch,
            variant: 'base-primary',
          },
          () => 'Simulate Refetch',
        ),
        table({
          columns: baseColumns,
          dataSource: data.value,
          draggable,
          loading: loading.value,
          scroll,
        }),
      ]);
  },
});

export const DraggableRowsWithRefetch: Story = {
  render: () => ({ render: () => h(DraggableRowsWithRefetchStory) }),
};

const PinnableRowsStory = defineComponent({
  setup() {
    const pinnedRowKeys = shallowRef<string[]>([]);

    const pinnable = computed(
      (): TablePinnable<DataType> => ({
        enabled: true,
        onPinChange: (record: DataType, pinned: boolean) => {
          pinnedRowKeys.value = pinned
            ? [...pinnedRowKeys.value, record.key]
            : pinnedRowKeys.value.filter((k) => k !== record.key);
        },
        pinnedRowKeys: pinnedRowKeys.value,
      }),
    );

    const scroll = { y: 300 };

    return () =>
      h('div', [
        h(
          'p',
          { style: { margin: '0 0 16px' } },
          'Click the pin icon to pin/unpin rows.',
        ),
        table({
          columns: baseColumns,
          dataSource: baseData,
          pinnable: pinnable.value,
          scroll,
        }),
      ]);
  },
});

export const PinnableRows: Story = {
  render: () => ({ render: () => h(PinnableRowsStory) }),
};

const ToggleableRowsStory = defineComponent({
  setup() {
    const toggledRowKeys = shallowRef<string[]>(['1', '3']);

    const toggleable = computed(
      (): TableToggleable<DataType> => ({
        enabled: true,
        isRowDisabled: (record: DataType) => record.age > 40,
        onToggleChange: (record: DataType, toggled: boolean) => {
          toggledRowKeys.value = toggled
            ? [...toggledRowKeys.value, record.key]
            : toggledRowKeys.value.filter((k) => k !== record.key);
        },
        title: 'Active',
        toggledRowKeys: toggledRowKeys.value,
      }),
    );

    const scroll = { y: 300 };

    return () =>
      h('div', [
        h(
          'p',
          { style: { margin: '0 0 16px' } },
          'Use the toggle to enable/disable rows. Rows with age > 40 are disabled.',
        ),
        h('p', { style: { margin: '0 0 16px' } }, [
          'Toggled rows: [',
          toggledRowKeys.value.join(', '),
          ']',
        ]),
        table({
          columns: baseColumns,
          dataSource: baseData,
          toggleable: toggleable.value,
          scroll,
        }),
      ]);
  },
});

export const ToggleableRows: Story = {
  render: () => ({ render: () => h(ToggleableRowsStory) }),
};

const CollectableRowsStory = defineComponent({
  setup() {
    const collectedRowKeys = shallowRef<string[]>(['2']);

    const collectable = computed(
      (): TableCollectable<DataType> => ({
        collectedRowKeys: collectedRowKeys.value,
        enabled: true,
        isRowDisabled: (record: DataType) => record.age < 25,
        onCollectChange: (record: DataType, collected: boolean) => {
          collectedRowKeys.value = collected
            ? [...collectedRowKeys.value, record.key]
            : collectedRowKeys.value.filter((k) => k !== record.key);
        },
        title: 'Favorite',
        minWidth: 120,
      }),
    );

    const scroll = { y: 300 };

    return () =>
      h('div', [
        h(
          'p',
          { style: { margin: '0 0 16px' } },
          'Click the star icon to add/remove rows from favorites. Rows with age < 25 are disabled.',
        ),
        h('p', { style: { margin: '0 0 16px' } }, [
          'Collected rows: [',
          collectedRowKeys.value.join(', '),
          ']',
        ]),
        table({
          collectable: collectable.value,
          columns: baseColumns,
          dataSource: baseData,
          scroll,
        }),
      ]);
  },
});

export const CollectableRows: Story = {
  render: () => ({ render: () => h(CollectableRowsStory) }),
};

const RowStateStory = defineComponent({
  setup() {
    return () =>
      h('div', [
        h(
          'div',
          {
            style: {
              display: 'flex',
              gap: '16px',
              marginBottom: '16px',
              fontSize: '13px',
            },
          },
          [h('span', 'props.rowState for customizing row background color')],
        ),
        table({
          columns: baseColumns,
          dataSource: baseData,
          rowState: (record: DataType) => {
            if (record.age >= 42) return 'deleted';
            if (record.age >= 33) return 'disabled';
            if (record.age < 25) return 'added';

            return undefined;
          },
        }),
      ]);
  },
});

export const RowState: Story = {
  render: () => ({ render: () => h(RowStateStory) }),
};

const HighlightModeStory = defineComponent({
  setup() {
    const mode = ref<'row' | 'cell' | 'column' | 'cross'>('row');

    return () =>
      h('div', [
        h('div', { style: { marginBottom: '16px' } }, [
          h(
            'label',
            { for: 'highlight-mode-select', style: { marginRight: '8px' } },
            'Select Highlight Mode:',
          ),
          withDirectives(
            h(
              'select',
              {
                id: 'highlight-mode-select',
                onChange: (event: Event) => {
                  mode.value = (event.target as HTMLSelectElement).value as
                    | 'row'
                    | 'cell'
                    | 'column'
                    | 'cross';
                },
              },
              [
                h('option', { value: 'row' }, 'Row'),
                h('option', { value: 'cell' }, 'Cell'),
                h('option', { value: 'column' }, 'Column'),
                h('option', { value: 'cross' }, 'Cross'),
              ],
            ),
            [[vModelSelect, mode.value]],
          ),
        ]),
        table({
          columns: baseColumns,
          dataSource: baseData,
          highlight: mode.value,
        }),
      ]);
  },
});

export const HighlightMode: Story = {
  render: () => ({ render: () => h(HighlightModeStory) }),
};

const CombinedStory = defineComponent({
  setup() {
    const {
      parentSelectedKeys,
      parentOnChange,
      parentGetCheckboxProps,
      getChildSelectedRowKeys,
      getChildOnChange,
      totalSelectionCount,
    } = useTableRowSelection<DataType>({
      getSubData: (record) => record.subData,
    });

    const { dataSource, transitionState, updateDataSource } =
      useTableDataSource<DataType>({
        initialData: baseData,
        highlightDuration: 1000,
        fadeOutDuration: 200,
      });

    const sortOrder = shallowRef<{ key: string; sortOrder: SortOrder } | null>({
      key: 'name',
      sortOrder: 'ascend',
    });

    // Toggleable state
    const toggledRowKeys = shallowRef<string[]>(['1', '3']);

    // Collectable state
    const collectedRowKeys = shallowRef<string[]>(['2']);

    const combinedColumns = computed(
      (): TableColumnWithMinWidth<DataType>[] => [
        {
          dataIndex: 'name',
          fixed: 'start',
          key: 'name',
          title: 'Name',
          titleHelp: 'This is the name column',
          titleMenu: {
            options: [
              { id: 'opt1', name: 'Option 1' },
              { id: 'opt2', name: 'Option 2' },
              { id: 'opt3', name: 'Option 3' },
            ],
            onSelect: () => {},
          },
          width: 150,
          minWidth: 100,
          maxWidth: 300,
        },
        {
          key: 'age',
          render: (record) => monoAge(record),
          sortOrder:
            sortOrder.value?.key === 'age'
              ? sortOrder.value?.sortOrder
              : undefined,
          onSort: (key, order) => {
            sortOrder.value = { key, sortOrder: order };

            if (order) {
              updateDataSource(
                [...dataSource.value].sort((a, b) =>
                  order === 'ascend' ? a.age - b.age : b.age - a.age,
                ),
              );
            } else {
              updateDataSource(baseData);
            }
          },
          title: 'Age',
          titleMenu: {
            options: [
              { id: 'opt1', name: 'Option 1' },
              { id: 'opt2', name: 'Option 2' },
            ],
            onSelect: () => {},
          },
          width: 100,
          minWidth: 90,
          maxWidth: 200,
        },
        {
          dataIndex: 'address',
          key: 'address',
          title: 'Address',
          width: 250,
          minWidth: 200,
          maxWidth: 400,
        },
        {
          dataIndex: 'address',
          key: 'address2',
          title: 'Address',
          width: 600,
          minWidth: 400,
          maxWidth: 800,
        },
        {
          key: 'tags',
          render: (record) =>
            h(
              'div',
              { style: { display: 'flex', gap: '4px' } },
              record.tags?.map((tag) =>
                h(MznTag, { key: tag, label: tag, size: 'sub' }),
              ),
            ),
          title: 'Tags',
          width: 200,
          minWidth: 120,
          maxWidth: 300,
        },
      ],
    );

    const handleDelete = (record: DataType): void => {
      const isFirstLayer = dataSource.value.some(
        (item) => item.key === record.key,
      );

      if (isFirstLayer) {
        updateDataSource(
          dataSource.value.filter((item) => item.key !== record.key),
          { removedKeys: [record.key] },
        );

        return;
      }

      const target = dataSource.value.find((item) =>
        item.subData?.some((sub) => sub.key === record.key),
      );

      if (target && target.subData) {
        const newSubData = target.subData.filter(
          (sub) => sub.key !== record.key,
        );

        const newDataSource = dataSource.value.map((item) =>
          item.key === target.key ? { ...item, subData: newSubData } : item,
        );

        updateDataSource(newDataSource, { removedKeys: [record.key] });
      }
    };

    const actions = computed(
      (): TableActionsWithMinWidth<DataType> => ({
        render: (record: DataType) => [
          {
            name: 'Edit',
            icon: EditIcon,
            iconType: 'leading' as const,
            onClick: () => {},
          },
          {
            type: 'dropdown' as const,
            name: 'More actions',
            options: [
              { id: 'copy', name: 'Copy', icon: CopyIcon },
              {
                id: 'download',
                name: 'Download',
                icon: DownloadIcon,
                showUnderline: true,
              },
              {
                id: 'Delete',
                name: 'Delete',
                icon: TrashIcon,
                validate: 'danger' as const,
              },
            ],
            onSelect: (option: { id: string }) => {
              if (option.id === 'Delete') {
                handleDelete(record);
              }
            },
          },
        ],
        variant: 'base-primary' as const,
        width: 220,
        minWidth: 220,
      }),
    );

    const collectable = computed(
      (): TableCollectable<DataType> => ({
        collectedRowKeys: collectedRowKeys.value,
        enabled: true,
        isRowDisabled: (record: DataType) => record.age < 25,
        onCollectChange: (record: DataType, collected: boolean) => {
          collectedRowKeys.value = collected
            ? [...collectedRowKeys.value, record.key]
            : collectedRowKeys.value.filter((k) => k !== record.key);
        },
        title: 'Favorite',
      }),
    );

    const draggable: TableDraggable<DataType> = {
      enabled: true,
      onDragEnd: (newData: DataType[]) => updateDataSource(newData),
    };

    const expandable = computed(
      (): TableExpandable<DataType> => ({
        expandedRowRender: (record: DataType) =>
          table({
            columns: combinedColumns.value as TableColumn<DataType>[],
            dataSource: record.subData || [],
            rowSelection: {
              mode: 'checkbox' as const,
              onChange: getChildOnChange(record),
              selectedRowKeys: getChildSelectedRowKeys(record),
              fixed: true,
            } as unknown as TableRowSelectionCheckbox<DataType>,
          }),
        rowExpandable: (record: DataType) => !!record.subData?.length,
      }),
    );

    const rowSelection = computed(
      (): TableRowSelectionCheckbox<DataType> =>
        ({
          mode: 'checkbox' as const,
          bulkActions: {
            mainActions: [
              { icon: CopyIcon, label: 'Copy', onClick: () => {} },
              { icon: DownloadIcon, label: 'Download', onClick: () => {} },
            ],
            destructiveAction: {
              icon: TrashIcon,
              label: 'Delete',
              onClick: () => {},
            },
            renderSelectionSummary: () =>
              `${totalSelectionCount.value} items selected`,
          },
          onChange: parentOnChange,
          selectedRowKeys: parentSelectedKeys.value,
          getCheckboxProps: parentGetCheckboxProps,
          fixed: true,
        }) as unknown as TableRowSelectionCheckbox<DataType>,
    );

    const scroll = { y: 300 };

    const toggleable = computed(
      (): TableToggleable<DataType> => ({
        enabled: true,
        fixed: true,
        isRowDisabled: (record: DataType) => record.age > 40,
        onToggleChange: (record: DataType, toggled: boolean) => {
          toggledRowKeys.value = toggled
            ? [...toggledRowKeys.value, record.key]
            : toggledRowKeys.value.filter((k) => k !== record.key);
        },
        title: 'Active',
        toggledRowKeys: toggledRowKeys.value,
      }),
    );

    return () =>
      h('div', { style: { width: '100%' } }, [
        h(
          'div',
          {
            style: {
              display: 'flex',
              flexFlow: 'column',
              gap: '4px',
              marginBottom: '16px',
            },
          },
          [
            h('span', ['Selected: ', totalSelectionCount.value, ' items']),
            h('span', [
              'Toggled rows: [',
              toggledRowKeys.value.join(', '),
              ']',
            ]),
            h('span', [
              'Collected rows: [',
              collectedRowKeys.value.join(', '),
              ']',
            ]),
          ],
        ),
        table({
          actions: actions.value,
          collectable: collectable.value,
          columns: combinedColumns.value as TableColumn<DataType>[],
          dataSource: dataSource.value,
          draggable,
          expandable: expandable.value,
          fullWidth: true,
          highlight: 'cross',
          resizable: true,
          rowSelection: rowSelection.value,
          scroll,
          toggleable: toggleable.value,
          transitionState: transitionState.value,
        }),
      ]);
  },
});

export const Combined: Story = {
  render: () => ({ render: () => h(CombinedStory) }),
};
