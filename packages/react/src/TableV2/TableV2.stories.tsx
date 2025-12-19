import { StoryObj, Meta } from '@storybook/react-webpack5';
import { useState, useMemo } from 'react';
import { TableV2 } from '.';
import type {
  SortDirection,
  TableV2Column,
  TableV2DataSourceWithKey,
} from '@mezzanine-ui/core/tableV2';
import Tag from '../Tag';
import Button from '../Button';
import Toggle from '../Toggle';

interface DataType extends TableV2DataSourceWithKey {
  age: number;
  address: string;
  name: string;
  tags?: string[];
  subData?: DataType[];
}

const baseColumns: TableV2Column<DataType>[] = [
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
      },
      {
        key: '1-2',
        address: 'Sub New York No. 2 Lake Park',
        age: 12,
        name: 'Sub Jim Green',
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
      },
      {
        key: '3-2',
        address: 'Sub New York No. 2 Lake Park',
        age: 12,
        name: 'Sub Jim Green',
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

export default {
  component: TableV2,
  title: 'Data Display/TableV2',
} satisfies Meta<typeof TableV2>;

type Story = StoryObj<typeof TableV2<DataType>>;

export const Basic: Story = {
  render: () => (
    <TableV2<DataType> columns={baseColumns} dataSource={baseData} />
  ),
};

export const SubSize: Story = {
  render: () => (
    <TableV2<DataType> columns={baseColumns} dataSource={baseData} size="sub" />
  ),
};

export const WithSorting: Story = {
  render: function WithSortingStory() {
    const [controlledDataSource, setControlledDataSource] =
      useState<DataType[]>(baseData);
    const [sortOrder, setSortOrder] = useState<{
      key: string;
      sortOrder: SortDirection;
    } | null>({
      key: 'name',
      sortOrder: 'ascend',
    });

    const controlledSortColumns: TableV2Column<DataType>[] = [
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
        <TableV2<DataType>
          columns={controlledSortColumns}
          dataSource={controlledDataSource}
        />
      </div>
    );
  },
};

export const WithRowSelection: Story = {
  render: function WithRowSelectionStory() {
    const [selectedSimpleExampleRowKeys, setSelectedSimpleExampleRowKeys] =
      useState<(string | number)[]>([]);

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

    const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
      [],
    );
    const [hideSelectAll, toggleHideSelectAll] = useState(false);
    const [preserveSelectedRowKeys, togglePreserveSelectedRowKeys] =
      useState(false);

    return (
      <div>
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
          }}
        >
          <span>Simple Example</span>
          <span>- Selected: [{selectedSimpleExampleRowKeys.join(', ')}]</span>
        </div>
        <TableV2<DataType>
          columns={baseColumns}
          dataSource={baseData}
          rowSelection={{
            onChange: (keys) => setSelectedSimpleExampleRowKeys(keys),
            selectedRowKeys: selectedSimpleExampleRowKeys,
            isCheckboxDisabled: (record) => record.age > 40,
          }}
        />
        <div
          style={{
            marginBottom: 16,
            display: 'flex',
            flexFlow: 'column',
            gap: '4px',
          }}
        >
          <span>Full Example</span>
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
        <TableV2<DataType>
          columns={baseColumns}
          dataSource={paginationData}
          rowSelection={{
            hideSelectAll,
            preserveSelectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            // onSelectAll: (type) => {
            //   if (type === 'all') {
            //     setSelectedRowKeys(
            //       originData
            //         .filter((item) => !item.disabled)
            //         .map((item) => item.key),
            //     );
            //   } else {
            //     setSelectedRowKeys([]);
            //   }
            // },
            selectedRowKeys,
            isCheckboxDisabled: (record) =>
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
      <TableV2<DataType>
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
        <span>Expansion with sub table</span>
        <TableV2<DataType>
          columns={baseColumns}
          dataSource={baseData}
          expandable={{
            expandedRowRender: (record, { table }) => (
              <TableV2<DataType>
                {...table}
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
    const fixedColumns: TableV2Column<DataType>[] = [
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
        dataIndex: 'action',
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
          <TableV2<DataType>
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
    const resizableColumns: TableV2Column<DataType>[] = [
      {
        dataIndex: 'name',
        key: 'name',
        resizable: true,
        title: 'Name',
        minWidth: 100,
        maxWidth: 200,
      },
      {
        dataIndex: 'age',
        key: 'age',
        resizable: true,
        title: 'Age',
        minWidth: 80,
        maxWidth: 150,
      },
      {
        dataIndex: 'address',
        key: 'address',
        resizable: true,
        title: 'Address',
      },
    ];

    return (
      <TableV2<DataType> columns={resizableColumns} dataSource={baseData} />
    );
  },
};

export const WithCustomRender: Story = {
  render: () => {
    const customColumns: TableV2Column<DataType>[] = [
      {
        dataIndex: 'name',
        key: 'name',
        title: 'Name',
        width: 150,
      },
      {
        dataIndex: 'age',
        key: 'age',
        render: (value) => (
          <span style={{ color: (value as number) > 35 ? 'red' : 'green' }}>
            {value as number}
          </span>
        ),
        title: 'Age',
        width: 100,
      },
      {
        dataIndex: 'tags',
        key: 'tags',
        render: (value) => {
          const tags = value as string[] | undefined;

          return (
            <div style={{ display: 'flex', gap: 4 }}>
              {tags?.map((tag) => (
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

    return <TableV2<DataType> columns={customColumns} dataSource={baseData} />;
  },
};

export const Loading: Story = {
  render: () => (
    <TableV2<DataType> columns={baseColumns} dataSource={baseData} loading />
  ),
};

export const EmptyState: Story = {
  render: () => (
    <TableV2<DataType>
      columns={baseColumns}
      dataSource={[]}
      emptyProps={{
        title: 'No data available',
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
      <TableV2<DataType>
        columns={baseColumns}
        dataSource={largeDataList}
        scroll={{ y: 400 }}
      />
    );
  },
};

export const DraggableRows: Story = {
  render: function DraggableRowsStory() {
    const [data, setData] = useState<DataType[]>([
      {
        address: 'New York No. 1 Lake Park',
        age: 32,
        key: '1',
        name: 'John Brown',
      },
      {
        address: 'London No. 1 Lake Park',
        age: 42,
        key: '2',
        name: 'Jim Green',
      },
      {
        address: 'Sydney No. 1 Lake Park',
        age: 32,
        key: '3',
        name: 'Joe Black',
      },
      {
        address: 'Tokyo No. 1 Lake Park',
        age: 28,
        key: '4',
        name: 'Jane Doe',
      },
      {
        address: 'Paris No. 1 Lake Park',
        age: 35,
        key: '5',
        name: 'Jack Smith',
      },
    ]);

    return (
      <div>
        <p style={{ marginBottom: 16 }}>
          Drag rows to reorder them. Current order:{' '}
          {data.map((d) => d.name).join(' → ')}
        </p>
        <TableV2<DataType>
          columns={baseColumns}
          dataSource={data}
          draggable={{
            enabled: true,
            onDragEnd: (newData) => setData(newData),
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
        <TableV2<DataType>
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
    const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);

    const [data, setData] = useState<DataType[]>(baseData);

    const [sortOrder, setSortOrder] = useState<{
      key: string;
      sortOrder: SortDirection;
    } | null>({
      key: 'name',
      sortOrder: 'ascend',
    });

    const combinedColumns: TableV2Column<DataType>[] = [
      {
        dataIndex: 'name',
        fixed: 'start',
        key: 'name',
        resizable: true,
        title: 'Name',
        titleHelp: 'This is the name column',
        titleMenu: 'Menu',
        width: 150,
      },
      {
        dataIndex: 'age',
        key: 'age',
        resizable: true,
        sortOrder: sortOrder?.key === 'age' ? sortOrder?.sortOrder : undefined,
        onSort: (key, order) => {
          setSortOrder({ key, sortOrder: order });
          if (order) {
            const sorted = [...data].sort((a, b) => {
              if (order === 'ascend') {
                return a.age - b.age;
              }
              return b.age - a.age;
            });
            setData(sorted);
          } else {
            setData(baseData);
          }
        },
        title: 'Age',
        width: 100,
      },
      {
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        resizable: true,
        title: 'Address',
        width: 250,
      },
      {
        dataIndex: 'address',
        ellipsis: true,
        key: 'address2',
        resizable: true,
        title: 'Address',
        width: 600,
      },
      {
        dataIndex: 'tags',
        key: 'tags',
        render: (value) => {
          const tags = value as string[] | undefined;

          return (
            <div style={{ display: 'flex', gap: 4 }}>
              {tags?.map((tag) => (
                <Tag key={tag} label={tag} size="minor" />
              ))}
            </div>
          );
        },
        title: 'Tags',
        width: 200,
      },
      {
        align: 'center',
        dataIndex: 'key',
        fixed: 'end',
        key: 'action',
        render: () => (
          <div style={{ display: 'flex', gap: 4 }}>
            <Button size="minor" variant="base-text-link">
              Edit
            </Button>
            <Button size="minor" variant="destructive-text-link">
              Delete
            </Button>
          </div>
        ),
        title: 'Action',
        width: 150,
      },
    ];

    return (
      <div style={{ width: '100%' }}>
        <div style={{ marginBottom: 16 }}>
          <span>Selected: {selectedKeys.length} items</span>
        </div>
        <TableV2<DataType>
          columns={combinedColumns}
          dataSource={data}
          expandable={{
            expandedRowRender: (record, { table }) => (
              <TableV2<DataType>
                {...table}
                columns={combinedColumns}
                dataSource={record.subData || []}
                rowSelection={{
                  onChange: () => {},
                  selectedRowKeys: [],
                  fixed: true,
                }}
              />
            ),
            rowExpandable: (record) => !!record.subData?.length,
            // fixed: true,
          }}
          rowSelection={{
            onChange: (keys) => setSelectedKeys(keys),
            selectedRowKeys: selectedKeys,
            fixed: true,
          }}
          scroll={{ x: 1000, y: 300 }}
          highlight="cross"
          draggable={{
            enabled: true,
            onDragEnd: (newData) => setData(newData),
            // fixed: true,
          }}
        />
      </div>
    );
  },
};
