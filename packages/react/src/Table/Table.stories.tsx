import {
  useState,
  useMemo,
  RefObject,
  MouseEvent,
  Fragment,
  FC,
  ReactElement,
  useEffect,
} from 'react';
import { MoreVerticalIcon, InfoCircleFilledIcon } from '@mezzanine-ui/icons';
import {
  tableClasses,
  TableColumn,
  TableExpandable,
} from '@mezzanine-ui/core/table';
import get from 'lodash/get';
import Table, { TableRefresh, EditableBodyCellProps, TableProps } from '.';
import Button from '../Button';
import Icon from '../Icon';
import Menu, { MenuItem, MenuSize, MenuDivider } from '../Menu';
import Dropdown from '../Dropdown';
import Switch from '../Switch';
import Input from '../Input';
import Select, { Option } from '../Select';
import { cx } from '../utils/cx';
import Message from '../Message/Message';

export default {
  title: 'Data Display/Table',
};

type DataType = {
  key: string;
  name: string;
  address: string;
  age: number;
  description: string;
  tel: string;
  foo: {
    bar: string;
  };
};

const columns: TableColumn<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 150,
    sorter: (a: string, b: string) => {
      if (a < b) return 1;

      return -1;
    },

    onSorted: (key, sortedType) => {
      console.warn(key, sortedType);
    },
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    key: 'age-column',
    title: 'Age',
    dataIndex: 'age',
    renderTooltipTitle: (source) => `${source.name} is age ${source.age}.`,
    forceShownTooltipWhenHovered: true,
    sorter: (a: number, b: number) => b - a,

    onSorted: (key, sortedType) => {
      console.warn(key, sortedType);
    },
    width: 80,
  },
  {
    title: 'Tel',
    dataIndex: 'tel',
    ellipsis: false,
    forceShownTooltipWhenHovered: true,
  },
];

const dataSource: DataType[] = Array.from(Array(15)).map((_, idx) => ({
  key: `source-${idx + 1}`,
  name: `${String.fromCharCode(97 + idx)} John Brown`,
  address: `New York No. ${idx + 1} Lake Park`,
  age: 12 + parseInt(`${(Math.random() * 100) % 12}`, 10) + idx,
  description:
    idx % 2 === 0
      ? `Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure illo,
  ipsa sunt molestias culpa saepe! Minima odio repellendus officiis! Assumenda,
  consequuntur sit blanditiis culpa vel repellendus dolorum non minus doloribus.`
      : '',
  tel: '0912345678(no ellipsis)',
  foo: {
    bar: 'test',
  },
}));

export const Basic = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sources, setSources] = useState<typeof dataSource>([]);
  const [isReachEnd, setReachEnd] = useState<boolean>(false);
  // const [isFetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSources(() => dataSource.slice(0, 8));
    }, 2000);

    const timer2 = setTimeout(() => {
      setSources(() => dataSource.slice(0, 8).reverse());
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          display: 'inline-grid',
          gap: 12,
          alignItems: 'center',
          gridTemplateColumns: '70px 50px 70px 50px',
          margin: '0 0 12px',
        }}
      >
        Loading
        <Switch
          checked={loading}
          onChange={() => setLoading((prev) => !prev)}
        />
        Empty
        <Switch
          checked={!sources.length}
          onChange={() =>
            setSources((prev) => {
              if (prev.length) return [];

              return dataSource;
            })
          }
        />
      </div>
      <h3>Basic overflow table</h3>
      <div
        style={{
          width: '80%',
        }}
      >
        <Table
          columns={columns}
          dataSource={sources}
          loading={loading}
          scroll={{
            y: 400,
          }}
          fetchMore={{
            callback: () => {
              // your custom reach end condition
              if (sources.length >= 15) {
                setReachEnd(true);
              } else {
                setTimeout(() => {
                  setSources([
                    ...sources,
                    ...dataSource.map((source, idx) => ({
                      ...source,
                      key: `${Math.random() * (1000 + idx)}`,
                    })),
                  ]);
                }, 2000);
              }
            },
            isReachEnd,
            // isFetching,
          }}
        />
      </div>
      <h3>Basic auto height table</h3>
      <div
        style={{
          width: '80%',
        }}
      >
        <Table columns={columns} dataSource={sources} loading={loading} />
      </div>
    </div>
  );
};

export const ScrollableAndFixedColumn = () => {
  const expandable: TableProps<DataType>['expandable'] = {
    expandedRowRender: (record) => record.description,
    rowExpandable: (record) => !!record.description,
  };

  return (
    <div style={{ width: '100%' }}>
      <h3>Scrollable X & Y / Fixed first column</h3>
      <div style={{ width: '80%' }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          scrollContainerClassName="foo"
          scroll={{
            x: 1500,
            y: 300,
            fixedFirstColumn: true,
          }}
        />
      </div>
      <h3>Scrollable X & Y</h3>
      <div style={{ width: '80%' }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{
            x: 1500,
            y: 300,
          }}
        />
      </div>
      <h3>Scrollable X only</h3>
      <div style={{ width: '80%' }}>
        <Table
          columns={columns}
          dataSource={dataSource.slice(0, 8)}
          scroll={{
            x: 1500,
          }}
        />
      </div>
      <h3>Scrollable Y only</h3>
      <div style={{ width: '80%' }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{
            y: 300,
          }}
        />
      </div>
      <h3>When actions existed, fixed column will disabled</h3>
      <div style={{ width: '80%' }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{
            x: 1500,
            y: 300,
            /** 因為 expandable 有給，所以 fixedFirstColumn 沒有作用 */
            fixedFirstColumn: true,
          }}
          expandable={expandable}
        />
      </div>
    </div>
  );
};

export const Draggable = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [source, setSource] = useState<DataType[]>(dataSource);

  return (
    <div style={{ width: '100%' }}>
      <h3>Draggable + Scrollable</h3>
      <div
        style={{
          width: '80%',
        }}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={source}
          draggable={{
            enabled: true,
            onDragEnd: async (nextSources) => {
              setLoading(true);
              Message.info('更新排序中...');

              setTimeout(() => {
                setSource(nextSources);
                setLoading(false);
                Message.success('已成功更新排序');
              }, 1000);
            },
          }}
          scroll={{
            y: 400,
          }}
        />
      </div>
      <h3>Draggable + Auto Height</h3>
      <div
        style={{
          width: '80%',
        }}
      >
        <Table
          loading={loading}
          columns={columns}
          dataSource={source}
          draggable={{
            enabled: true,
            onDragEnd: async (nextSources) => {
              setLoading(true);
              Message.info('更新排序中...');

              setTimeout(() => {
                setSource(nextSources);
                setLoading(false);
                Message.success('已成功更新排序');
              }, 1000);
            },
          }}
        />
      </div>
    </div>
  );
};

export const Selections = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const selectedActions = useMemo(
    () => [
      {
        key: 'mark-as-read',
        text: 'Mark as read',

        onClick: (keys: string[]) => {
          console.warn('mark ', keys, ' as read');
        },
      },
      {
        key: 'delete',
        text: 'Delete',

        onClick: (keys: string[]) => {
          console.warn('Delete ', keys);
        },
        className: '',
      },
    ],
    [],
  );

  const expandable: TableProps<DataType>['expandable'] = {
    expandedRowRender: (record) => record.description,
    rowExpandable: (record) => !!record.description,
  };

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      <div style={{ width: '95%' }}>
        <h3>UnControlled</h3>
        <Table
          columns={columns}
          dataSource={dataSource}
          expandable={expandable}
          scroll={{
            y: 400,
          }}
          rowSelection={{
            actions: selectedActions,
          }}
        />
      </div>
      <div style={{ width: '95%' }}>
        <h3>Controlled</h3>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{
            y: 400,
          }}
          rowSelection={{
            selectedRowKey: selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            disabledRowKeys: dataSource
              .map((d) => {
                if (d.age >= 25) return d.key;

                return null;
              })
              .filter((k) => k) as string[],
          }}
        />
      </div>
    </div>
  );
};

const demoMenu = (size?: MenuSize) => (
  <Menu size={size} style={{ width: 100 }}>
    <MenuItem onClick={(e) => e.stopPropagation()}>排序</MenuItem>
    <MenuItem onClick={(e) => e.stopPropagation()}>動作2</MenuItem>
    <MenuDivider />
    <MenuItem onClick={(e) => e.stopPropagation()}>動作3</MenuItem>
  </Menu>
);

export const WithActions = () => {
  const [open, toggleOpen] = useState<boolean>(false);

  const renderHeaderActions: TableColumn<DataType>['renderTitle'] = (
    classes,
  ) => (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 24px)',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Icon
        className={cx(classes.icon, classes.iconClickable)}
        color="primary"
        icon={InfoCircleFilledIcon}
        onClick={(event: MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
        }}
      />
      <Dropdown
        menu={demoMenu()}
        onClose={() => toggleOpen(false)}
        popperProps={{
          open,
          options: {
            placement: 'bottom-end',
          },
        }}
      >
        {(ref) => (
          <Icon
            ref={ref as RefObject<HTMLButtonElement | null>}
            className={cx(classes.icon, classes.iconClickable)}
            color="primary"
            icon={MoreVerticalIcon}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();
              toggleOpen((prev) => !prev);
            }}
          />
        )}
      </Dropdown>
    </div>
  );

  const renderRowActions = () => (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <Button>編輯</Button>
      <Button danger>刪除</Button>
    </div>
  );

  const withActionColumns: TableColumn<DataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      renderTitle: renderHeaderActions,
      render: renderRowActions,
      // styling
      width: 160,
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      <div
        style={{
          width: '95%',
        }}
      >
        <Table columns={withActionColumns} dataSource={dataSource} />
      </div>
    </div>
  );
};

export const WithPagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState(10);
  const [sources] = useState<typeof dataSource>(dataSource);

  const slicedSources = useMemo(
    () => sources.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sources, pageSize, currentPage],
  );

  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
      }}
    >
      <h3>Scrollable Pagination Table</h3>
      <div style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={slicedSources}
          scroll={{ y: 350, x: 1024 }}
          pagination={{
            disableAutoSlicing: true,
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            total: sources.length,
            options: {
              pageSize,
              pageSizeLabel: '每頁顯示：',
              pageSizeUnit: '筆',
              onChangePageSize: (nextPageSize) => setPageSize(nextPageSize),
              renderPageSizeOptionName: (p) => `${p}`,
              renderPaginationSummary: (start, end) =>
                `目前顯示 ${start} - ${end} 筆，共 ${sources.length} 筆資料`,
              showPageSizeOptions: true, // 開啟每頁顯示 N 筆
              showJumper: true, // 開啟跳頁功能
              jumperButtonText: '前往',
              jumperHintText: '跳至',
            },
          }}
        />
      </div>
      <h3>Auto Height Pagination Table</h3>
      <div style={{ width: '100%' }}>
        <Table
          columns={columns}
          dataSource={sources}
          pagination={{
            current: currentPage,
            onChange: (page) => setCurrentPage(page),
            options: {
              pageSize,
              pageSizeLabel: '每頁顯示：',
              pageSizeUnit: '筆',
              onChangePageSize: (nextPageSize) => setPageSize(nextPageSize),
              renderPageSizeOptionName: (p) => `${p}`,
              renderPaginationSummary: (start, end) =>
                `目前顯示 ${start} - ${end} 筆，共 ${sources.length} 筆資料`,
              showPageSizeOptions: true, // 開啟每頁顯示 N 筆
              showJumper: true, // 開啟跳頁功能
              jumperButtonText: '前往',
              jumperHintText: '跳至',
            },
          }}
        />
      </div>
    </div>
  );
};

export const WithRefresh = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      <div
        style={{
          width: '90%',
        }}
      >
        <h3>refresh button inside Table</h3>
        <Table
          columns={columns}
          dataSource={dataSource.slice(0, 5)}
          refresh={{
            show: true,

            onClick: () => {},
          }}
        />
      </div>
      <div
        style={{
          width: '90%',
        }}
      >
        <h3>refresh button outside Table</h3>
        <TableRefresh onClick={() => setRefreshing(true)} />
        <Table
          columns={columns}
          dataSource={dataSource.slice(0, 5)}
          loading={refreshing}
        />
      </div>
    </div>
  );
};

export const ExpandedWithString = () => {
  const customizedColumns: TableColumn<DataType>[] = [
    {
      title: 'Name',
      render: (source) => source.key,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      /** styling */
      align: 'center',
      headerClassName: 'custom-table-header',
      bodyClassName: 'custom-table-body',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      /** styling */
      width: 80,
      align: 'center',
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
      ellipsis: false,
      /** styling */
      align: 'end',
    },
  ];

  const expandable: TableProps<DataType>['expandable'] = useMemo(
    () => ({
      className: '',

      expandedRowRender: (record) => (
        <div style={{ padding: '40px' }}>{record.description}</div>
      ),
      rowExpandable: (record) => !!record.description,
    }),
    [],
  );

  return (
    <div
      style={{
        width: '90%',
      }}
    >
      <Table
        columns={customizedColumns}
        dataSource={dataSource}
        expandable={expandable}
      />
    </div>
  );
};

export const ExpandedWithDataSource = () => {
  const customizedColumns: TableColumn<DataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      /** styling */
      align: 'center',
      headerClassName: 'custom-table-header',
      bodyClassName: 'custom-table-body',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      /** styling */
      width: 80,
      align: 'center',
    },
    {
      title: 'Tel',
      dataIndex: 'tel',
      ellipsis: false,
      /** styling */
      align: 'end',
    },
  ];

  const [sourceData, setSource] = useState<{ [key: string]: DataType[] }>({});

  return (
    <div
      style={{
        width: '90%',
      }}
    >
      <Table
        columns={customizedColumns}
        dataSource={dataSource}
        scroll={{ y: 400 }}
        expandable={
          {
            className: '',
            expandedRowRender: (record) => ({
              dataSource: sourceData[record.key as string] || [],
              className: 'expanded-table-row',
              columns: [
                {
                  dataIndex: 'name',
                },
                {
                  dataIndex: 'address',
                },
                {
                  dataIndex: 'age',
                },
                {
                  dataIndex: 'tel',
                },
              ],
            }),
            rowExpandable: () => true,

            onExpand: (record, status) => {
              if (status) {
                setTimeout(() => {
                  setSource((p) => ({
                    ...p,
                    [record.key]: dataSource.slice(0, 3),
                  }));
                }, 500);
              }
            },
          } as TableExpandable<DataType>
        }
      />
    </div>
  );
};

const editableColumns: TableColumn<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    editable: false,
    width: 120,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    editable: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    editable: true,
    width: 200,
  },
  {
    title: 'Tel',
    dataIndex: 'tel',
    ellipsis: true,
    editable: true,
  },
  {
    dataIndex: '',
    title: '',
    // styling
    width: 160,
  },
];

interface EditableCellProps extends EditableBodyCellProps {
  /** some extra props come from `setCellProps` */
  isEditing: boolean;
}

export const Editable = () => {
  const [editingKey, setEditingKey] = useState<string>('');
  /** Customize body cell */
  const EditableCell: FC<EditableCellProps> = ({
    children,
    dataIndex,
    editable,
    isEditing,
    rowData,
  }) => {
    const elementType = dataIndex === 'tel' ? 'select' : 'input';
    const inputType = dataIndex === 'age' ? 'number' : 'text';

    return (
      editable && isEditing ? (
        <div className={tableClasses.cell}>
          {elementType === 'select' ? (
            <Select
              defaultValue={{ id: '0912345678', name: '0912345678' }}
              fullWidth
            >
              <Option value="0912345678">0912345678</Option>
              <Option value="0987654432">0987654432</Option>
            </Select>
          ) : (
            <Input
              defaultValue={
                dataIndex ? (get(rowData, dataIndex) as string) : ''
              }
              fullWidth
              inputProps={{
                type: inputType,
              }}
            />
          )}
        </div>
      ) : (
        children
      )
    ) as ReactElement<any>;
  };

  const renderRowActions: TableColumn<DataType>['render'] = (source) => (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      {editingKey === source.key ? (
        <Button
          onClick={() => {
            setEditingKey('');
          }}
        >
          完成
        </Button>
      ) : (
        <Fragment>
          <Button
            disabled={!!editingKey}
            onClick={() => {
              setEditingKey(source.key);
            }}
          >
            編輯
          </Button>
          <Button danger disabled={!!editingKey}>
            刪除
          </Button>
        </Fragment>
      )}
    </div>
  );

  const mergeColumnWithCustomProps: typeof editableColumns =
    editableColumns.map((column) => {
      if (!column.dataIndex) {
        /**  actions column */
        return {
          ...column,
          dataIndex: undefined,
          render: renderRowActions,
        };
      }

      if (!column.editable) return column;

      return {
        ...column,
        /** inject some custom props to your custom cell */
        setCellProps: (source) => ({
          isEditing: editingKey === source.key,
        }),
      };
    });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '95%' }}>
        <h3>Default</h3>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergeColumnWithCustomProps}
          dataSource={dataSource.slice(0, 6)}
        />
      </div>
      <div style={{ width: '95%' }}>
        <h3>Scrollable with fixed column and editable</h3>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergeColumnWithCustomProps}
          dataSource={dataSource.slice(0, 6)}
          scroll={{ x: 1024, fixedFirstColumn: true }}
        />
      </div>
    </div>
  );
};
