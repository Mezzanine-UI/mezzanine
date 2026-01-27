import { StoryObj, Meta } from '@storybook/react-webpack5';
import { useCallback, useMemo, useRef, useState } from 'react';
import Table, {
  TableBaseProps,
  TablePaginationProps,
  useTableDataSource,
  useTableRowSelection,
} from '.';
import type {
  SortOrder,
  TableActions,
  TableActionsWithMinWidth,
  TableCollectable,
  TableColumn,
  TableColumnWithMinWidth,
  TableDataSourceWithKey,
  TableDraggable,
  TableExpandable,
  TablePinnable,
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
  TableToggleable,
} from '@mezzanine-ui/core/table';
import {
  CopyIcon,
  DotHorizontalIcon,
  DownloadIcon,
  EditIcon,
  FolderMoveIcon,
  TrashIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import Tag from '../Tag';
import Button from '../Button';
import Toggle from '../Toggle';
import Input from '../Input';
import Icon from '../Icon';
import Slider from '../Slider';
import {
  Description,
  DescriptionContent,
  DescriptionGroup,
} from '../Description';

interface DataType extends TableDataSourceWithKey {
  age: number;
  address: string;
  name: string;
  tags?: string[];
  subData?: DataType[];
}

const baseColumns: TableColumn<DataType>[] = [
  {
    dataIndex: 'name',
    key: 'name',
    title: 'Name',
    width: 150,
    minWidth: 150,
  },
  {
    dataIndex: 'age',
    key: 'age',
    title: 'Age',
    align: 'center',
    width: 100,
    minWidth: 100,
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

const meta: Meta<typeof Table> = {
  title: 'Data Display/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table<DataType>>;

export const Basic: Story = {
  render: () => <Table<DataType> columns={baseColumns} dataSource={baseData} />,
};

export const SubSize: Story = {
  render: () => (
    <Table<DataType> columns={baseColumns} dataSource={baseData} size="sub" />
  ),
};

export const RowHeightPreset: Story = {
  render: function RowHeightPresetStory() {
    const [currentSize, setCurrentSize] =
      useState<TableBaseProps<DataType>['size']>('main');
    const [currentPreset, setCurrentPreset] =
      useState<TableBaseProps<DataType>['rowHeightPreset']>('base');

    return (
      <div style={{ display: 'grid', gridAutoColumns: 'row', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Size:</span>
          <select
            value={currentSize}
            onChange={(e) =>
              setCurrentSize(e.target.value as TableBaseProps<DataType>['size'])
            }
            style={{ marginLeft: 8 }}
          >
            <option value="main">main</option>
            <option value="sub">sub</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Row Height Preset:</span>
          <select
            value={currentPreset}
            onChange={(e) =>
              setCurrentPreset(
                e.target.value as TableBaseProps<DataType>['rowHeightPreset'],
              )
            }
            style={{ marginLeft: 8 }}
          >
            <option value="base">base</option>
            <option value="condensed">condensed</option>
            <option value="detailed">detailed</option>
            <option value="roomy">roomy</option>
          </select>
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          size={currentSize}
          rowHeightPreset={currentPreset}
        />
      </div>
    );
  },
};

export const DataStateRepresentation: Story = {
  render: function DataStateRepresentationStory() {
    const separatorAtRowIndexes = useMemo(() => [3, 6], []);

    return (
      <div style={{ display: 'grid', gridAutoColumns: 'row', gap: '16px' }}>
        <span>{`separatorAtRowIndexes: [3, 6], zebraStriping: true`}</span>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          separatorAtRowIndexes={separatorAtRowIndexes}
          zebraStriping
        />
      </div>
    );
  },
};

export const CreateDeleteTransition: Story = {
  render: function CreateDeleteTransitionStory() {
    const [newName, setNewName] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Simulated server-side database (represents backend storage)
    const serverDatabaseRef = useRef<DataType[]>(
      Array.from({ length: 23 }, (_, i) => ({
        address: `Address ${i + 1}`,
        age: 20 + (i % 40),
        key: String(i + 1),
        name: `User ${i + 1}`,
      })),
    );

    // Simulate API response format: { total: number, items: T[] }
    const fetchPageData = useCallback(
      (offset: number, limit: number): { items: DataType[]; total: number } => {
        const items = serverDatabaseRef.current.slice(offset, offset + limit);

        return {
          items,
          total: serverDatabaseRef.current.length,
        };
      },
      [],
    );

    // Initialize with first page data
    const initialData = useMemo(() => {
      const response = fetchPageData(0, itemsPerPage);

      return response;
    }, [fetchPageData, itemsPerPage]);

    const { dataSource, transitionState, updateDataSource } =
      useTableDataSource<DataType>({
        initialData: initialData.items,
        highlightDuration: 1000,
        fadeOutDuration: 200,
      });

    // Handle page change
    const handlePageChange = useCallback(
      (page: number) => {
        const offset = (page - 1) * itemsPerPage;
        const response = fetchPageData(offset, itemsPerPage);

        setCurrentPage(page);
        updateDataSource(response.items);
      },
      [fetchPageData, itemsPerPage, updateDataSource],
    );

    // Simulate GraphQL create mutation + refetch current page
    const handleCreateMutation = useCallback(() => {
      if (!newName.trim()) return;

      const newItem: DataType = {
        address: newAddress || 'Unknown Address',
        age: parseInt(newAge, 10) || 0,
        key: String(Date.now()),
        name: newName,
      };

      // 1. Server adds the item (prepend to beginning)
      serverDatabaseRef.current = [newItem, ...serverDatabaseRef.current];

      // 2. Refetch current page data (API pattern)
      const offset = (currentPage - 1) * itemsPerPage;
      const response = fetchPageData(offset, itemsPerPage);

      // 3. Update with animation
      const isNewItemInCurrentPage = response.items.some(
        (item) => item.key === newItem.key,
      );

      updateDataSource(response.items, {
        addedKeys: isNewItemInCurrentPage ? [newItem.key] : [],
      });

      setNewName('');
      setNewAge('');
      setNewAddress('');
    }, [
      currentPage,
      fetchPageData,
      itemsPerPage,
      newAddress,
      newAge,
      newName,
      updateDataSource,
    ]);

    // Simulate GraphQL delete mutation + refetch current page
    const handleDeleteMutation = useCallback(
      (key: string) => {
        // 1. Server removes the item
        serverDatabaseRef.current = serverDatabaseRef.current.filter(
          (item) => item.key !== key,
        );

        // 2. Refetch current page data
        const offset = (currentPage - 1) * itemsPerPage;
        const response = fetchPageData(offset, itemsPerPage);

        // 3. Check if we need to go back a page (current page is now empty)
        const maxPage = Math.ceil(response.total / itemsPerPage);
        const newPage =
          currentPage > maxPage ? Math.max(1, maxPage) : currentPage;

        // Page changed, fetch new page without delete animation
        const newOffset = (newPage - 1) * itemsPerPage;
        const newResponse = fetchPageData(newOffset, itemsPerPage);

        setCurrentPage(newPage);
        updateDataSource(newResponse.items, { removedKeys: [key] });
      },
      [currentPage, fetchPageData, itemsPerPage, updateDataSource],
    );

    const transitionColumns: TableColumn<DataType>[] = useMemo(
      () => [
        {
          dataIndex: 'name',
          key: 'name',
          title: 'Name',
          width: 150,
        },
        {
          dataIndex: 'age',
          key: 'age',
          title: 'Age',
          width: 100,
        },
        {
          dataIndex: 'address',
          key: 'address',
          title: 'Address',
        },
      ],
      [],
    );

    const actions: TableActions<DataType> = useMemo(
      () => ({
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
      [handleDeleteMutation],
    );

    const pagination = useMemo(
      () => ({
        current: currentPage,
        onChange: handlePageChange,
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, t: number) =>
          `${from}-${to} 筆，共 ${t} 筆`,
        total: initialData.total,
      }),
      [currentPage, handlePageChange, itemsPerPage, initialData.total],
    );

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            background: '#f5f5f5',
            borderRadius: 8,
            marginBottom: 16,
            padding: 16,
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>
            GraphQL Pattern: mutation → refetch → updateDataSource
          </h4>
          <p>
            {`Please use "useTableDataSource" to manage data source with
            create/delete`}
          </p>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
            API returns <code>{`{ total: number, items: T[] }`}</code> format.
            Pagination uses offset + limit. New items are prepended.
          </p>
        </div>

        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            flexFlow: 'row',
            gap: 8,
          }}
        >
          <Input
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name"
            value={newName}
          />
          <Input
            onChange={(e) => setNewAge(e.target.value)}
            placeholder="Age"
            value={newAge}
            variant="number"
          />
          <Input
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Address"
            value={newAddress}
          />
          <Button
            disabled={!newName.trim() || undefined}
            onClick={handleCreateMutation}
            variant="base-primary"
          >
            Create
          </Button>
        </div>

        <Table<DataType>
          actions={actions}
          columns={transitionColumns}
          dataSource={dataSource}
          pagination={pagination}
          transitionState={transitionState}
        />
      </div>
    );
  },
};

/** Component */
const ExpandedRowRender: React.FC<{
  record: DataType;
  columns: TableColumn<DataType>[];
}> = ({ record, columns }) => {
  const {
    dataSource: childDataSource,
    transitionState: childTransitionState,
    updateDataSource: updateChildDataSource,
  } = useTableDataSource<DataType>({
    initialData: record.subData,
    highlightDuration: 1500,
    fadeOutDuration: 300,
  });

  const actions: TableActions<DataType> = useMemo(
    () => ({
      render: (subRecord) => [
        {
          name: 'Delete',
          onClick: () => {
            updateChildDataSource(
              childDataSource.filter((item) => item.key !== subRecord.key),
              { removedKeys: [subRecord.key] },
            );
          },
        },
      ],
      title: 'Action',
      variant: 'destructive-text-link',
      width: 100,
    }),
    [childDataSource, updateChildDataSource],
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          marginBottom: 8,
        }}
      >
        <Button
          onClick={() => {
            const newSource = {
              key: `new-${Date.now()}`,
              name: 'New Sub Item',
              age: 0,
              address: 'New Address',
            };

            updateChildDataSource([...childDataSource, newSource], {
              addedKeys: [newSource.key],
            });
          }}
          size="sub"
          variant="base-secondary"
        >
          Add Sub Item
        </Button>
      </div>
      <Table<DataType>
        actions={actions}
        columns={columns}
        dataSource={childDataSource}
        transitionState={childTransitionState}
        showHeader={false}
        nested
      />
    </div>
  );
};

export const CreateDeleteTransitionWithExpansion: Story = {
  render: function CreateDeleteTransitionWithExpansionStory() {
    // Parent table transition state
    const {
      dataSource: parentDataSource,
      transitionState: parentTransitionState,
      updateDataSource: updateParentDataSource,
    } = useTableDataSource<DataType>({
      initialData: baseData,
      highlightDuration: 1500,
      fadeOutDuration: 300,
    });

    const columns: TableColumn<DataType>[] = useMemo(
      () => [
        {
          dataIndex: 'name',
          key: 'name',
          title: 'Name',
          width: 150,
        },
        {
          dataIndex: 'age',
          key: 'age',
          title: 'Age',
          width: 100,
        },
        {
          dataIndex: 'address',
          key: 'address',
          title: 'Address',
        },
      ],
      [],
    );

    const actions = useMemo(
      () => ({
        render: (record: DataType) => [
          {
            name: 'Delete Parent',
            onClick: () => {
              const newData = parentDataSource.filter(
                (item) => item.key !== record.key,
              );

              updateParentDataSource(newData, {
                removedKeys: [record.key],
              });
            },
          },
        ],
        title: 'Action',
        variant: 'destructive-text-link' as const,
        width: 140,
      }),
      [parentDataSource, updateParentDataSource],
    );

    const expandable = useMemo(
      () => ({
        expandedRowRender: (record: DataType) => (
          <ExpandedRowRender record={record} columns={columns} />
        ),
        rowExpandable: (record: DataType) => !!record.subData?.length,
      }),
      [columns],
    );

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            background: '#f5f5f5',
            borderRadius: 8,
            marginBottom: 16,
            padding: 16,
          }}
        >
          <h4 style={{ margin: '0 0 8px 0' }}>
            Transition with Expansion Demo
          </h4>
          <p style={{ margin: '0 0 4px 0' }}>
            1. 刪除父層資料時，展開區域會同步顯示刪除提示
          </p>
          <p style={{ margin: '0 0 4px 0' }}>
            2. 在展開區域內的子表格中刪除項目，該項目會有獨立的刪除過渡效果
          </p>
          <p style={{ color: '#666', fontSize: 14, margin: 0 }}>
            點擊展開圖標查看子表格，然後嘗試刪除父層或子層項目
          </p>
        </div>

        <Table<DataType>
          actions={actions}
          columns={columns}
          dataSource={parentDataSource}
          expandable={expandable}
          transitionState={parentTransitionState}
        />
      </div>
    );
  },
};

export const WithSorting: Story = {
  render: function WithSortingStory() {
    const [controlledDataSource, setControlledDataSource] =
      useState<DataType[]>(baseData);
    const [sortOrder, setSortOrder] = useState<{
      key: string;
      sortOrder: SortOrder;
    } | null>({
      key: 'name',
      sortOrder: 'ascend',
    });

    const controlledSortColumns: TableColumn<DataType>[] = useMemo(
      () => [
        {
          dataIndex: 'name',
          key: 'name',
          sortOrder:
            sortOrder?.key === 'name' ? sortOrder?.sortOrder : undefined,
          onSort: (key, order) => {
            setSortOrder({ key, sortOrder: order });

            if (order) {
              const sorted = [...controlledDataSource].sort((a, b) => {
                if (order === 'ascend') {
                  return a.name.localeCompare(b.name);
                }
                return b.name.localeCompare(a.name);
              });

              setControlledDataSource(sorted);
            } else {
              setControlledDataSource(baseData);
            }
          },
          title: 'Name',
          width: 150,
        },
        {
          dataIndex: 'age',
          key: 'age',
          sortOrder:
            sortOrder?.key === 'age' ? sortOrder?.sortOrder : undefined,
          onSort: (key, order) => {
            setSortOrder({ key, sortOrder: order });

            if (order) {
              const sorted = [...controlledDataSource].sort((a, b) => {
                if (order === 'ascend') {
                  return a.age - b.age;
                }
                return b.age - a.age;
              });
              setControlledDataSource(sorted);
            } else {
              setControlledDataSource(baseData);
            }
          },
          title: 'Age',
          width: 100,
        },
        {
          dataIndex: 'address',
          key: 'address',
          title: 'Address',
        },
      ],
      [controlledDataSource, sortOrder],
    );

    return (
      <div style={{ display: 'grid', gridAutoColumns: 'row', gap: '12px' }}>
        <span>{`Controlled sort order: { key: "${sortOrder?.key}", sortOrder: "${sortOrder?.sortOrder}"}`}</span>
        <Table<DataType>
          columns={controlledSortColumns}
          dataSource={controlledDataSource}
        />
      </div>
    );
  },
};

export const WithRowSelection: Story = {
  render: function WithRowSelectionStory() {
    // full example
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const originData = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => ({
        address: `Address ${i + 1}`,
        age: 20 + (i % 50),
        key: String(i + 1),
        name: `User ${i + 1}`,
        disabled: i % 4 === 0,
      }));
    }, []);

    const paginationData = useMemo(() => {
      return originData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );
    }, [currentPage, itemsPerPage, originData]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [hideSelectAll, toggleHideSelectAll] = useState(false);
    const [preserveSelectedRowKeys, togglePreserveSelectedRowKeys] =
      useState(false);

    // Radio selection example
    const [selectedRadioKey, setSelectedRadioKey] = useState<string>();

    const checkboxRowSelection: TableRowSelectionCheckbox<DataType> = useMemo(
      () => ({
        mode: 'checkbox' as const,
        hideSelectAll,
        preserveSelectedRowKeys,
        onChange: (keys: string[]) => setSelectedRowKeys(keys),
        selectedRowKeys,
        isSelectionDisabled: (record: DataType) =>
          (record as (typeof paginationData)[number]).disabled,
      }),
      [hideSelectAll, preserveSelectedRowKeys, selectedRowKeys],
    );

    const pagination = useMemo(
      () => ({
        current: currentPage,
        onChange: (page: number) => setCurrentPage(page),
        total: 100,
        showPageSizeOptions: true,
        pageSizeLabel: '每頁顯示：',
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, total: number) => {
          return `${from}-${to} 筆，共 ${total} 筆`;
        },
        showJumper: true,
        inputPlaceholder: '頁碼',
        hintText: '前往',
        buttonText: '確定',
      }),
      [currentPage, itemsPerPage],
    );

    const radioRowSelection: TableRowSelectionRadio<DataType> = useMemo(
      () => ({
        mode: 'radio' as const,
        onChange: (key) => setSelectedRadioKey(key),
        selectedRowKey: selectedRadioKey,
        isSelectionDisabled: (record: DataType) => record.age > 40,
      }),
      [selectedRadioKey],
    );

    return (
      <div>
        <div
          style={{
            margin: '0 0 16px',
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
          }}
        >
          <span>Mode: checkbox</span>
          <span>- Selected: [{selectedRowKeys.join(', ')}]</span>
          <Toggle
            checked={hideSelectAll}
            label="props.hideSelectAll"
            onChange={(e) => toggleHideSelectAll(e.target.checked)}
          />
          <Toggle
            checked={preserveSelectedRowKeys}
            label="props.preserveSelectedRowKeys"
            onChange={(e) => togglePreserveSelectedRowKeys(e.target.checked)}
          />
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={paginationData}
          rowSelection={checkboxRowSelection}
          pagination={pagination}
        />
        <div
          style={{
            margin: '32px 0 16px',
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
          }}
        >
          <span>Mode: radio</span>
          <span>- Selected: {selectedRadioKey}</span>
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          rowSelection={radioRowSelection}
        />
      </div>
    );
  },
};

export const WithBulkActions: Story = {
  render: function WithBulkActionsStory() {
    // full example
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const originData = useMemo(() => {
      return Array.from({ length: 100 }, (_, i) => ({
        address: `Address ${i + 1}`,
        age: 20 + (i % 50),
        key: `${i + 1}`,
        name: `User ${i + 1}`,
        disabled: i % 4 === 0,
      }));
    }, []);

    const paginationData = useMemo(() => {
      return originData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );
    }, [currentPage, itemsPerPage, originData]);

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    const rowSelection: TableRowSelectionCheckbox<DataType> = useMemo(
      () => ({
        mode: 'checkbox' as const,
        bulkActions: {
          mainActions: [
            {
              icon: FolderMoveIcon,
              label: 'Move',
              onClick: () => {},
            },
            {
              icon: CopyIcon,
              label: 'Copy',
              onClick: () => {},
            },
            {
              icon: DownloadIcon,
              label: 'Download',
              onClick: () => {},
            },
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
        onChange: (keys) => setSelectedRowKeys(keys),
        selectedRowKeys,
        isSelectionDisabled: (record) =>
          (record as (typeof paginationData)[number]).disabled,
      }),
      [selectedRowKeys],
    );

    const pagination: TablePaginationProps = useMemo(
      () => ({
        current: currentPage,
        onChange: (page: number) => setCurrentPage(page),
        total: 100,
        showPageSizeOptions: true,
        pageSizeLabel: '每頁顯示：',
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, total: number) => {
          return `${from}-${to} 筆，共 ${total} 筆`;
        },
        showJumper: true,
        inputPlaceholder: '頁碼',
        hintText: '前往',
        buttonText: '確定',
      }),
      [currentPage, itemsPerPage],
    );

    return (
      <div>
        <div style={{ width: '100%', height: '100px' }}>
          (Extra spaces for demo fixed bulk actions)
        </div>
        <div
          style={{
            margin: '0 0 16px',
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
          }}
        >
          <span>Mode: checkbox + bulkActions</span>
          <span>- Selected: [{selectedRowKeys.join(', ')}]</span>
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={paginationData}
          rowSelection={rowSelection}
          pagination={pagination}
        />
        <div style={{ width: '100%', height: '600px' }}>
          (Extra spaces for demo fixed bulk actions)
        </div>
      </div>
    );
  },
};

export const WithPagination: Story = {
  render: function WithPaginationStory() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const paginationData: DataType[] = useMemo(() => {
      return Array.from({ length: itemsPerPage }, (_, i) => ({
        address: `Address ${i + (currentPage - 1) * itemsPerPage + 1}`,
        age: 20 + (i + (currentPage - 1) * itemsPerPage),
        key: String(i + (currentPage - 1) * itemsPerPage + 1),
        name: `User ${i + (currentPage - 1) * itemsPerPage + 1}`,
      }));
    }, [currentPage, itemsPerPage]);

    const pagination: TablePaginationProps = useMemo(
      () => ({
        current: currentPage,
        onChange: (page: number) => setCurrentPage(page),
        total: 100,
        showPageSizeOptions: true,
        pageSizeLabel: '每頁顯示：',
        pageSize: itemsPerPage,
        renderResultSummary: (from: number, to: number, total: number) => {
          return `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`;
        },
        showJumper: true,
        inputPlaceholder: '頁碼',
        hintText: '前往',
        buttonText: '確定',
      }),
      [currentPage, itemsPerPage],
    );

    return (
      <Table<DataType>
        columns={baseColumns}
        dataSource={paginationData}
        pagination={pagination}
      />
    );
  },
};

export const WithExpansion: Story = {
  render: function WithExpansionStory() {
    const expandableWithDescription: TableExpandable<DataType> = useMemo(
      () => ({
        expandedRowRender: () => (
          <div style={{ padding: '6px 12px' }}>
            <DescriptionGroup>
              <Description title="Date Created At" widthType="wide">
                <DescriptionContent>
                  Tue, 03 Aug 2021 14:22:18 GMT
                </DescriptionContent>
              </Description>
              <Description title="Data Updated At" widthType="wide">
                <DescriptionContent>
                  Tue, 05 Aug 2025 11:22:18 GMT
                </DescriptionContent>
              </Description>
            </DescriptionGroup>
          </div>
        ),
        rowExpandable: (record: DataType) => !!record.subData?.length,
      }),
      [],
    );

    const expandableWithSubTable: TableExpandable<DataType> = useMemo(
      () => ({
        expandedRowRender: (record: DataType) => (
          <Table<DataType>
            columns={baseColumns}
            dataSource={record.subData || []}
          />
        ),
        rowExpandable: (record: DataType) => !!record.subData?.length,
      }),
      [],
    );

    return (
      <div style={{ display: 'grid', gridAutoColumns: 'row', gap: '12px' }}>
        <span>Expansion with description</span>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          expandable={expandableWithDescription}
        />
        <span>Expansion with sub table</span>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          expandable={expandableWithSubTable}
        />
      </div>
    );
  },
};

export const WithFixedColumns: Story = {
  render: function FixedColumnsStory() {
    const fixedColumns: TableColumn<DataType>[] = useMemo(
      () => [
        {
          dataIndex: 'name',
          fixed: 'start',
          key: 'name',
          title: 'Name',
          width: 120,
        },
        {
          dataIndex: 'age',
          key: 'age',
          title: 'Age',
          width: 140,
        },
        {
          dataIndex: 'age',
          key: 'age2',
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
      ],
      [],
    );

    const actions: TableActions<DataType> = useMemo(
      () => ({
        fixed: 'end' as const,
        render: () => [
          {
            name: 'Edit',
            onClick: () => {},
          },
        ],
        title: 'Action',
        variant: 'base-text-link' as const,
        width: 100,
      }),
      [],
    );

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexFlow: 'column',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <span>{`Fixed Columns: "Name (start)", "Fixed Age (start)", "Fixed Address (end)", "Action (end)"`}</span>
        <div style={{ width: '100%' }}>
          <Table<DataType>
            actions={actions}
            columns={fixedColumns}
            dataSource={baseData}
            fullWidth
          />
        </div>
      </div>
    );
  },
};

export const WithResizableColumns: Story = {
  render: function ResizableColumnsStory() {
    const resizableColumns: TableColumnWithMinWidth<DataType>[] = useMemo(
      () => [
        {
          dataIndex: 'name',
          key: 'name',
          title: 'Name',
          minWidth: 120,
          maxWidth: 220,
        },
        {
          dataIndex: 'age',
          key: 'age',
          title: 'Age',
          minWidth: 80,
        },
        {
          dataIndex: 'tags',
          key: 'tags',
          title: 'Tags',
          width: 200,
          minWidth: 140,
        },
        {
          dataIndex: 'address',
          key: 'address',
          title: 'Address',
          minWidth: 220,
        },
      ],
      [],
    );

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexFlow: 'column',
          gap: '12px',
        }}
      >
        <span style={{ whiteSpace: 'pre-line' }}>
          {`Column 1: minWidth: 120, maxWidth: 220;
          Column 2: minWidth: 80;
          Column 3: width 200 minWidth: 140;
          Column 4: minWidth: 220;`}
        </span>
        <Table<DataType>
          columns={resizableColumns}
          dataSource={baseData}
          resizable
        />
      </div>
    );
  },
};

export const WithCustomRender: Story = {
  render: function CustomRenderStory() {
    const customColumns: TableColumn<DataType>[] = useMemo(
      () => [
        {
          key: 'name',
          title: 'Name',
          render: (record) => (
            <div
              style={{
                display: 'flex',
                flexFlow: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Icon icon={UserIcon} size={24} />
              <span>{record.name}</span>
            </div>
          ),
          width: 150,
        },
        {
          key: 'age',
          dataIndex: 'age',
          title: 'Age',
          width: 100,
        },
        {
          key: 'tags',
          render: (record) => {
            return (
              <div style={{ display: 'flex', gap: 4 }}>
                {record.tags?.map((tag) => (
                  <Tag key={tag} label={tag} size="minor" />
                ))}
              </div>
            );
          },
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
      ],
      [],
    );

    return <Table<DataType> columns={customColumns} dataSource={baseData} />;
  },
};

export const Loading: Story = {
  render: function LoadingStory() {
    const [loadingRowsCount, setLoadingRowsCount] = useState(10);

    return (
      <div style={{ display: 'grid', gridAutoColumns: 'row', gap: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>props.loadingRowsCount: </span>
          <div style={{ width: '260px' }}>
            <Slider
              value={loadingRowsCount}
              min={1}
              max={10}
              step={1}
              onChange={setLoadingRowsCount}
            />
          </div>
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={[]}
          loading
          loadingRowsCount={loadingRowsCount}
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  render: function EmptyStateStory() {
    const emptyProps = useMemo(
      () => ({
        height: 444,
        type: 'result' as const,
        title: 'No data available',
        description: 'There is no data to display in the table.',
      }),
      [],
    );

    return (
      <Table<DataType>
        columns={baseColumns}
        dataSource={[]}
        emptyProps={emptyProps}
      />
    );
  },
};

export const VirtualScrolling: Story = {
  render: function VirtualScrollingStory() {
    const largeDataList: DataType[] = useMemo(() => {
      return Array.from({ length: 10000 }, (_, i) => ({
        address: `Address ${i + 1}`,
        age: 20 + (i % 50),
        key: String(i + 1),
        name: `User ${i + 1}`,
      }));
    }, []);

    const scroll = useMemo(() => ({ virtualized: true as const, y: 420 }), []);

    return (
      <Table<DataType>
        columns={baseColumns}
        dataSource={largeDataList}
        scroll={scroll}
      />
    );
  },
};

export const DraggableRows: Story = {
  render: function DraggableRowsStory() {
    const [data, setData] = useState<DataType[]>(baseData);

    const draggable: TableDraggable<DataType> = useMemo(
      () => ({
        enabled: true,
        onDragEnd: (newData: DataType[]) => setData(newData),
      }),
      [],
    );

    const scroll = useMemo(() => ({ y: 300 }), []);

    return (
      <div>
        <p style={{ margin: '0 0 16px' }}>Drag rows to reorder them</p>
        <Table<DataType>
          columns={baseColumns}
          dataSource={data}
          draggable={draggable}
          scroll={scroll}
        />
      </div>
    );
  },
};

export const PinnableRows: Story = {
  render: function PinnableRowsStory() {
    const [pinnedRowKeys, setPinnedRowKeys] = useState<string[]>([]);

    const pinnable: TablePinnable<DataType> = useMemo(
      () => ({
        enabled: true,
        onPinChange: (record: DataType, pinned: boolean) => {
          if (pinned) {
            setPinnedRowKeys((prev) => [...prev, record.key]);
          } else {
            setPinnedRowKeys((prev) => prev.filter((k) => k !== record.key));
          }
        },
        pinnedRowKeys,
      }),
      [pinnedRowKeys],
    );

    const scroll = useMemo(() => ({ y: 300 }), []);

    return (
      <div>
        <p style={{ margin: '0 0 16px' }}>
          Click the pin icon to pin/unpin rows.
        </p>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          pinnable={pinnable}
          scroll={scroll}
        />
      </div>
    );
  },
};

export const ToggleableRows: Story = {
  render: function ToggleableRowsStory() {
    const [toggledRowKeys, setToggledRowKeys] = useState<string[]>(['1', '3']);

    const toggleable: TableToggleable<DataType> = useMemo(
      () => ({
        enabled: true,
        isRowDisabled: (record: DataType) => record.age > 40,
        onToggleChange: (record: DataType, toggled: boolean) => {
          if (toggled) {
            setToggledRowKeys((prev) => [...prev, record.key]);
          } else {
            setToggledRowKeys((prev) => prev.filter((k) => k !== record.key));
          }
        },
        title: 'Active',
        toggledRowKeys,
      }),
      [toggledRowKeys],
    );

    const scroll = useMemo(() => ({ y: 300 }), []);

    return (
      <div>
        <p style={{ margin: '0 0 16px' }}>
          Use the toggle to enable/disable rows. Rows with age &gt; 40 are
          disabled.
        </p>
        <p style={{ margin: '0 0 16px' }}>
          Toggled rows: [{toggledRowKeys.join(', ')}]
        </p>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          toggleable={toggleable}
          scroll={scroll}
        />
      </div>
    );
  },
};

export const CollectableRows: Story = {
  render: function CollectableRowsStory() {
    const [collectedRowKeys, setCollectedRowKeys] = useState<string[]>(['2']);

    const collectable: TableCollectable<DataType> = useMemo(
      () => ({
        collectedRowKeys,
        enabled: true,
        isRowDisabled: (record: DataType) => record.age < 25,
        onCollectChange: (record: DataType, collected: boolean) => {
          if (collected) {
            setCollectedRowKeys((prev) => [...prev, record.key]);
          } else {
            setCollectedRowKeys((prev) => prev.filter((k) => k !== record.key));
          }
        },
        title: 'Favorite',
        minWidth: 120,
      }),
      [collectedRowKeys],
    );

    const scroll = useMemo(() => ({ y: 300 }), []);

    return (
      <div>
        <p style={{ margin: '0 0 16px' }}>
          Click the star icon to add/remove rows from favorites. Rows with age
          &lt; 25 are disabled.
        </p>
        <p style={{ margin: '0 0 16px' }}>
          Collected rows: [{collectedRowKeys.join(', ')}]
        </p>
        <Table<DataType>
          collectable={collectable}
          columns={baseColumns}
          dataSource={baseData}
          scroll={scroll}
        />
      </div>
    );
  },
};

export const HighlightMode: Story = {
  render: function HighlightMode() {
    const [mode, setMode] = useState<'row' | 'cell' | 'column' | 'cross'>(
      'row',
    );

    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="highlight-mode-select" style={{ marginRight: 8 }}>
            Select Highlight Mode:
          </label>
          <select
            id="highlight-mode-select"
            value={mode}
            onChange={(e) =>
              setMode(e.target.value as 'row' | 'cell' | 'column' | 'cross')
            }
          >
            <option value="row">Row</option>
            <option value="cell">Cell</option>
            <option value="column">Column</option>
            <option value="cross">Cross</option>
          </select>
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          highlight={mode}
        />
      </div>
    );
  },
};

export const Combined: Story = {
  render: function CombinedStory() {
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

    const [sortOrder, setSortOrder] = useState<{
      key: string;
      sortOrder: SortOrder;
    } | null>({
      key: 'name',
      sortOrder: 'ascend',
    });

    // Toggleable state
    const [toggledRowKeys, setToggledRowKeys] = useState<string[]>(['1', '3']);

    // Collectable state
    const [collectedRowKeys, setCollectedRowKeys] = useState<string[]>(['2']);

    const combinedColumns: TableColumnWithMinWidth<DataType>[] = useMemo(
      () => [
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
          dataIndex: 'age',
          key: 'age',
          sortOrder:
            sortOrder?.key === 'age' ? sortOrder?.sortOrder : undefined,
          onSort: (key, order) => {
            setSortOrder({ key, sortOrder: order });
            if (order) {
              const sorted = [...dataSource].sort((a, b) => {
                if (order === 'ascend') {
                  return a.age - b.age;
                }
                return b.age - a.age;
              });
              updateDataSource(sorted);
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
          render: (record) => {
            return (
              <div style={{ display: 'flex', gap: 4 }}>
                {record.tags?.map((tag) => (
                  <Tag key={tag} label={tag} size="minor" />
                ))}
              </div>
            );
          },
          title: 'Tags',
          width: 200,
          minWidth: 120,
          maxWidth: 300,
        },
      ],
      [dataSource, sortOrder, updateDataSource],
    );

    const handleDelete = useCallback(
      (record: DataType) => {
        const isFirstLayer = dataSource.some((item) => item.key === record.key);

        if (isFirstLayer) {
          updateDataSource(
            dataSource.filter((item) => item.key !== record.key),
            { removedKeys: [record.key] },
          );
        } else {
          const target = dataSource.find((item) =>
            item.subData?.some((sub) => sub.key === record.key),
          );

          if (target && target.subData) {
            const newSubData = target.subData.filter(
              (sub) => sub.key !== record.key,
            );

            const newDataSource = dataSource.map((item) => {
              if (item.key === target.key) {
                return {
                  ...item,
                  subData: newSubData,
                };
              }
              return item;
            });

            updateDataSource(newDataSource, {
              removedKeys: [record.key],
            });
          }
        }
      },
      [dataSource, updateDataSource],
    );

    const actions: TableActionsWithMinWidth<DataType> = useMemo(
      () => ({
        render: (record: DataType) => [
          {
            name: 'Edit',
            icon: EditIcon,
            iconType: 'leading' as const,
            onClick: () => {},
          },
          {
            type: 'dropdown' as const,
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
                return;
              }
            },
          },
        ],
        variant: 'base-primary' as const,
        width: 220,
        minWidth: 220,
      }),
      [handleDelete],
    );

    const collectable: TableCollectable<DataType> = useMemo(
      () => ({
        collectedRowKeys,
        enabled: true,
        isRowDisabled: (record: DataType) => record.age < 25,
        onCollectChange: (record: DataType, collected: boolean) => {
          if (collected) {
            setCollectedRowKeys((prev) => [...prev, record.key]);
          } else {
            setCollectedRowKeys((prev) => prev.filter((k) => k !== record.key));
          }
        },
        title: 'Favorite',
      }),
      [collectedRowKeys],
    );

    const draggable: TableDraggable<DataType> = useMemo(
      () => ({
        enabled: true,
        onDragEnd: (newData: DataType[]) => updateDataSource(newData),
      }),
      [updateDataSource],
    );

    const expandable: TableExpandable<DataType> = useMemo(
      () => ({
        expandedRowRender: (record: DataType) => {
          const childRowSelection = {
            mode: 'checkbox' as const,
            onChange: getChildOnChange(record),
            selectedRowKeys: getChildSelectedRowKeys(record),
            fixed: true,
          };

          return (
            <Table<DataType>
              columns={combinedColumns}
              dataSource={record.subData || []}
              rowSelection={childRowSelection}
            />
          );
        },
        rowExpandable: (record: DataType) => !!record.subData?.length,
      }),
      [combinedColumns, getChildOnChange, getChildSelectedRowKeys],
    );

    const rowSelection: TableRowSelectionCheckbox<DataType> = useMemo(
      () => ({
        mode: 'checkbox' as const,
        bulkActions: {
          mainActions: [
            {
              icon: CopyIcon,
              label: 'Copy',
              onClick: () => {},
            },
            {
              icon: DownloadIcon,
              label: 'Download',
              onClick: () => {},
            },
          ],
          destructiveAction: {
            icon: TrashIcon,
            label: 'Delete',
            onClick: () => {},
          },
          renderSelectionSummary: () => `${totalSelectionCount} items selected`,
        },
        onChange: parentOnChange,
        selectedRowKeys: parentSelectedKeys,
        getCheckboxProps: parentGetCheckboxProps,
        fixed: true,
      }),
      [
        totalSelectionCount,
        parentOnChange,
        parentSelectedKeys,
        parentGetCheckboxProps,
      ],
    );

    const scroll = useMemo(() => ({ y: 300 }), []);

    const toggleable: TableToggleable<DataType> = useMemo(
      () => ({
        enabled: true,
        fixed: true,
        isRowDisabled: (record: DataType) => record.age > 40,
        onToggleChange: (record: DataType, toggled: boolean) => {
          if (toggled) {
            setToggledRowKeys((prev) => [...prev, record.key]);
          } else {
            setToggledRowKeys((prev) => prev.filter((k) => k !== record.key));
          }
        },
        title: 'Active',
        toggledRowKeys,
      }),
      [toggledRowKeys],
    );

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
            marginBottom: 16,
          }}
        >
          <span>Selected: {totalSelectionCount} items</span>
          <span>Toggled rows: [{toggledRowKeys.join(', ')}]</span>
          <span>Collected rows: [{collectedRowKeys.join(', ')}]</span>
        </div>
        <Table<DataType>
          actions={actions}
          collectable={collectable}
          columns={combinedColumns}
          dataSource={dataSource}
          draggable={draggable}
          expandable={expandable}
          fullWidth
          highlight="cross"
          resizable
          rowSelection={rowSelection}
          scroll={scroll}
          toggleable={toggleable}
          transitionState={transitionState}
        />
      </div>
    );
  },
};
