import { StoryObj, Meta } from '@storybook/react-webpack5';
import { useCallback, useMemo, useRef, useState } from 'react';
import Table, {
  TableBaseProps,
  useTableDataSource,
  useTableRowSelection,
} from '.';
import type {
  SortOrder,
  TableColumn,
  TableColumnWithMinWidth,
  TableDataSourceWithKey,
} from '@mezzanine-ui/core/table';
import {
  CopyIcon,
  DotHorizontalIcon,
  DownloadIcon,
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

    const transitionColumns: TableColumn<DataType>[] = [
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
      {
        key: 'action',
        align: 'center',
        render: (record) => (
          <Button
            onClick={() => handleDeleteMutation(String(record.key))}
            size="minor"
            variant="destructive-text-link"
          >
            Delete
          </Button>
        ),
        title: 'Action',
        width: 120,
      },
    ];

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
          columns={transitionColumns}
          dataSource={dataSource}
          transitionState={transitionState}
          pagination={{
            current: currentPage,
            onChange: handlePageChange,
            pageSize: itemsPerPage,
            renderResultSummary: (from, to, t) =>
              `${from}-${to} 筆，共 ${t} 筆`,
            total: initialData.total,
          }}
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

    const controlledSortColumns: TableColumn<DataType>[] = [
      {
        dataIndex: 'name',
        key: 'name',
        sortOrder: sortOrder?.key === 'name' ? sortOrder?.sortOrder : undefined,
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
        sortOrder: sortOrder?.key === 'age' ? sortOrder?.sortOrder : undefined,
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
    ];

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
          rowSelection={{
            mode: 'checkbox',
            hideSelectAll,
            preserveSelectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            selectedRowKeys,
            isSelectionDisabled: (record) =>
              (record as (typeof paginationData)[number]).disabled,
          }}
          pagination={{
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            total: 100,
            showPageSizeOptions: true,
            pageSizeLabel: '每頁顯示：',
            pageSize: itemsPerPage,
            renderResultSummary: (from, to, total) => {
              return `${from}-${to} 筆，共 ${total} 筆`;
            },
            showJumper: true,
            inputPlaceholder: '頁碼',
            hintText: '前往',
            buttonText: '確定',
          }}
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
          rowSelection={{
            mode: 'radio',
            onChange: (key) => setSelectedRadioKey(key),
            selectedRowKey: selectedRadioKey,
            isSelectionDisabled: (record) => record.age > 40,
          }}
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
          <span>Mode: checkbox + bulkActions</span>
          <span>- Selected: [{selectedRowKeys.join(', ')}]</span>
        </div>
        <Table<DataType>
          columns={baseColumns}
          dataSource={paginationData}
          rowSelection={{
            mode: 'checkbox',
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
                onSelect: (option, keys) => {
                  // eslint-disable-next-line no-console
                  console.log('Overflow action:', option, keys);
                },
                options: [
                  { id: 'opt1', name: 'Option 1' },
                  { id: 'opt2', name: 'Option 2' },
                  { id: 'opt3', name: 'Option 3' },
                ],
                placement: 'top',
              },
              renderSelectionSummary: (count: number) =>
                `已選擇 ${count} 筆資料`,
            },
            onChange: (keys) => setSelectedRowKeys(keys),
            selectedRowKeys,
            isSelectionDisabled: (record) =>
              (record as (typeof paginationData)[number]).disabled,
          }}
          pagination={{
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            total: 100,
            showPageSizeOptions: true,
            pageSizeLabel: '每頁顯示：',
            pageSize: itemsPerPage,
            renderResultSummary: (from, to, total) => {
              return `${from}-${to} 筆，共 ${total} 筆`;
            },
            showJumper: true,
            inputPlaceholder: '頁碼',
            hintText: '前往',
            buttonText: '確定',
          }}
        />
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

    return (
      <Table<DataType>
        columns={baseColumns}
        dataSource={paginationData}
        pagination={{
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
          total: 100,
          showPageSizeOptions: true,
          pageSizeLabel: '每頁顯示：',
          pageSize: itemsPerPage,
          renderResultSummary: (from, to, total) => {
            return `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`;
          },
          showJumper: true,
          inputPlaceholder: '頁碼',
          hintText: '前往',
          buttonText: '確定',
        }}
      />
    );
  },
};

export const WithExpansion: Story = {
  render: function WithExpansionStory() {
    return (
      <div style={{ display: 'grid', gridAutoColumns: 'row', gap: '12px' }}>
        <span>Expansion with description</span>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          expandable={{
            expandedRowRender: (record) => <div>{record.subData?.length}</div>,
            rowExpandable: (record) => !!record.subData?.length,
          }}
        />
        <span>Expansion with sub table</span>
        <Table<DataType>
          columns={baseColumns}
          dataSource={baseData}
          expandable={{
            expandedRowRender: (record) => (
              <Table<DataType>
                columns={baseColumns}
                dataSource={record.subData || []}
              />
            ),
            rowExpandable: (record) => !!record.subData?.length,
          }}
        />
      </div>
    );
  },
};

export const WithFixedColumns: Story = {
  render: () => {
    const fixedColumns: TableColumn<DataType>[] = [
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
      {
        key: 'action',
        fixed: 'end',
        render: () => (
          <Button size="minor" variant="base-text-link">
            Edit
          </Button>
        ),
        title: 'Action',
        width: 100,
      },
    ];

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
            columns={fixedColumns}
            dataSource={baseData}
            scroll={{ x: 800 }}
          />
        </div>
      </div>
    );
  },
};

export const WithResizableColumns: Story = {
  render: () => {
    const resizableColumns = [
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
    ];

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
  render: () => {
    const customColumns: TableColumn<DataType>[] = [
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
    ];

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
  render: () => (
    <Table<DataType>
      columns={baseColumns}
      dataSource={[]}
      emptyProps={{
        height: 444,
        type: 'result',
        title: 'No data available',
        description: 'There is no data to display in the table.',
      }}
    />
  ),
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

    return (
      <Table<DataType>
        columns={baseColumns}
        dataSource={largeDataList}
        scroll={{ virtualized: true, y: 420 }}
      />
    );
  },
};

export const DraggableRows: Story = {
  render: function DraggableRowsStory() {
    const [data, setData] = useState<DataType[]>(baseData);

    return (
      <div>
        <p style={{ margin: '0 0 16px' }}>Drag rows to reorder them</p>
        <Table<DataType>
          columns={baseColumns}
          dataSource={data}
          draggable={{
            enabled: true,
            onDragEnd: (newData) => setData(newData),
          }}
          scroll={{
            y: 300,
          }}
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

    const combinedColumns: TableColumnWithMinWidth<DataType>[] = [
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
        sortOrder: sortOrder?.key === 'age' ? sortOrder?.sortOrder : undefined,
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
      {
        align: 'end',
        fixed: 'end',
        key: 'action',
        render: (record) => (
          <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
            <Button size="minor" variant="base-text-link">
              Edit
            </Button>
            <Button
              size="minor"
              variant="destructive-text-link"
              onClick={() => {
                const isFirstLayer = dataSource.some(
                  (item) => item.key === record.key,
                );

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
              }}
            >
              Delete
            </Button>
          </div>
        ),
        title: 'Action',
        width: 150,
        minWidth: 150,
        maxWidth: 150,
      },
    ];

    return (
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: 16 }}>
          <span>Selected: {totalSelectionCount} items</span>
        </div>
        <Table<DataType>
          columns={combinedColumns}
          dataSource={dataSource}
          expandable={{
            expandedRowRender: (record) => (
              <Table<DataType>
                columns={combinedColumns}
                dataSource={record.subData || []}
                rowSelection={{
                  mode: 'checkbox',
                  onChange: getChildOnChange(record),
                  selectedRowKeys: getChildSelectedRowKeys(record),
                  fixed: true,
                }}
              />
            ),
            rowExpandable: (record) => !!record.subData?.length,
            // fixed: true,
          }}
          resizable
          rowSelection={{
            mode: 'checkbox',
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
              renderSelectionSummary: () =>
                `${totalSelectionCount} items selected`,
            },
            onChange: parentOnChange,
            selectedRowKeys: parentSelectedKeys,
            getCheckboxProps: parentGetCheckboxProps,
            fixed: true,
          }}
          scroll={{ x: 1000, y: 300 }}
          highlight="cross"
          draggable={{
            enabled: true,
            onDragEnd: (newData) => updateDataSource(newData),
            // fixed: true,
          }}
          transitionState={transitionState}
        />
      </div>
    );
  },
};
