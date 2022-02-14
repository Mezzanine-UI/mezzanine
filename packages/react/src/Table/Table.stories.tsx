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
import Table, { TableRefresh, EditableBodyCellProps } from '.';
import Button from '../Button';
import Icon from '../Icon';
import Menu, { MenuItem, MenuSize, MenuDivider } from '../Menu';
import Dropdown from '../Dropdown';
import Switch from '../Switch';
import Input from '../Input';
import Select, { Option } from '../Select';
import { cx } from '../utils/cx';

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

const columns: TableColumn<DataType>[] = [{
  title: 'Name',
  dataIndex: 'name',
  sorter: (a: string, b: string) => {
    if (a < b) return 1;

    return -1;
  },
  // eslint-disable-next-line no-console
  onSorted: (dataIndex, sortedType) => { console.log(dataIndex, sortedType); },
}, {
  title: 'Address',
  dataIndex: 'address',
}, {
  title: 'Age',
  dataIndex: 'age',
  renderTooltipTitle: (source) => `${source.name} is age ${source.age}.`,
  forceShownTooltipWhenHovered: true,
  sorter: (a: number, b: number) => b - a,
  // eslint-disable-next-line no-console
  onSorted: (dataIndex, sortedType) => { console.log(dataIndex, sortedType); },
  width: 80,
}, {
  title: 'Tel',
  dataIndex: 'tel',
  ellipsis: false,
  forceShownTooltipWhenHovered: true,
}];

const dataSource: DataType[] = Array.from(Array(35)).map((_, idx) => ({
  key: `source-${idx + 1}`,
  name: `${String.fromCharCode(97 + idx)} John Brown`,
  address: `New York No. ${idx + 1} Lake Park`,
  age: (12 + parseInt(`${((Math.random()) * 100) % 12}`, 10)) + idx,
  description: idx % 2 === 0 ? `Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure illo,
  ipsa sunt molestias culpa saepe! Minima odio repellendus officiis! Assumenda,
  consequuntur sit blanditiis culpa vel repellendus dolorum non minus doloribus.` : '',
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
      setSources(dataSource);
    }, 2000);

    return () => {
      clearTimeout(timer);
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
          onChange={() => setSources((prev) => {
            if (prev.length) return [];

            return dataSource;
          })}
        />
      </div>
      <div
        style={{
          width: '80%',
          height: 400,
        }}
      >
        <Table
          columns={columns}
          dataSource={sources}
          loading={loading}
          fetchMore={{
            callback: () => {
              // your custom reach end condition
              if (sources.length >= 30) {
                setReachEnd(true);
              } else {
                setTimeout(() => {
                  setSources([
                    ...sources,
                    ...dataSource.map((source, idx) => ({ ...source, key: `${Math.random() * (1000 + idx)}` })),
                  ]);
                }, 2000);
              }
            },
            isReachEnd,
            // isFetching,
          }}
        />
      </div>
    </div>
  );
};

export const Selections = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const selectedActions = useMemo(() => ([{
    key: 'mark-as-read',
    text: 'Mark as read',
    // eslint-disable-next-line no-console
    onClick: (keys: string[]) => { console.log('mark ', keys, ' as read'); },
  }, {
    key: 'delete',
    text: 'Delete',
    // eslint-disable-next-line no-console
    onClick: (keys: string[]) => { console.log('Delete ', keys); },
    className: '',
  }]), []);

  const expandable: TableExpandable<DataType> = {
    expandedRowRender: (record) => record.description,
    rowExpandable: (record) => !!record.description,
  };

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      <div
        style={{
          width: '80%',
          height: 350,
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <h3>
          UnControlled
        </h3>
        <div style={{ flex: '1 0 0' }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            expandable={expandable}
            rowSelection={{
              actions: selectedActions,
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: '80%',
          height: 350,
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <h3>
          Controlled
        </h3>
        <div style={{ flex: '1 0 0' }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            expandable={expandable}
            rowSelection={{
              selectedRowKey: selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
              actions: selectedActions,
            }}
          />
        </div>
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

  const renderHeaderActions: TableColumn<DataType>['renderTitle'] = (classes) => (
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
        className={cx(
          classes.icon,
          classes.iconClickable,
        )}
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
            ref={ref as RefObject<HTMLButtonElement>}
            className={cx(
              classes.icon,
              classes.iconClickable,
            )}
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
      <Button>
        編輯
      </Button>
      <Button danger>
        刪除
      </Button>
    </div>
  );

  const withActionColumns: TableColumn<DataType>[] = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Address',
    dataIndex: 'address',
  }, {
    title: 'Age',
    dataIndex: 'age',
  }, {
    dataIndex: '',
    renderTitle: renderHeaderActions,
    render: renderRowActions,
    // styling
    width: 160,
  }];

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      <div
        style={{
          width: '80%',
          height: 350,
          display: 'flex',
          flexFlow: 'column',
        }}
      >
        <div style={{ flex: '1 0 0' }}>
          <Table
            columns={withActionColumns}
            dataSource={dataSource}
          />
        </div>
      </div>
    </div>
  );
};

export const WithPagination = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sources, setSources] = useState<typeof dataSource>([]);

  useEffect(() => {
    setSources(dataSource);
  }, []);

  return (
    <div
      style={{
        width: '80%',
        height: 'auto',
      }}
    >
      <Table
        columns={columns}
        dataSource={sources}
        pagination={{
          current: currentPage,
          onChange: (page) => setCurrentPage(page),
        }}
        style={{ display: 'block' }}
      />
    </div>
  );
};

export const WithRefresh = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  return (
    <div style={{ display: 'grid', gap: 40 }}>
      <div
        style={{
          width: '80%',
          height: 400,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3>refresh button inside Table</h3>
        <Table
          columns={columns}
          dataSource={dataSource}
          refresh={{
            show: true,
            // eslint-disable-next-line no-console
            onClick: () => { console.log('refresh clicked!'); },
          }}
        />
      </div>
      <div
        style={{
          width: '80%',
          height: 400,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h3>refresh button outside Table</h3>
        <TableRefresh onClick={() => setRefreshing(true)} />
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={refreshing}
        />
      </div>
    </div>
  );
};

const customizedColumns: TableColumn<DataType>[] = [{
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'Address',
  dataIndex: 'address',
  /** styling */
  align: 'center',
  headerClassName: 'custom-table-header',
  bodyClassName: 'custom-table-body',
}, {
  title: 'Age',
  dataIndex: 'age',
  /** styling */
  width: 80,
  align: 'center',
}, {
  title: 'Tel',
  dataIndex: 'tel',
  ellipsis: false,
  /** styling */
  align: 'end',
}];

export const Styling = () => (
  <div
    style={{
      width: '80%',
      height: 460,
    }}
  >
    <Table
      columns={customizedColumns}
      dataSource={dataSource}
      expandable={{
        className: '',
        expandedRowRender: (record) => record.description,
        rowExpandable: (record) => !!record.description,
      } as TableExpandable<DataType>}
    />
  </div>
);

const editableColumns: TableColumn<DataType>[] = [{
  title: 'Name',
  dataIndex: 'name',
  editable: false,
  width: 160,
}, {
  title: 'Address',
  dataIndex: 'address',
  editable: true,
}, {
  title: 'Age',
  dataIndex: 'age',
  editable: true,
  width: 200,
}, {
  title: 'Tel',
  dataIndex: 'tel',
  ellipsis: false,
  editable: true,
}, {
  dataIndex: '',
  title: '',
  // styling
  width: 160,
}];

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

    return (editable && isEditing ? (
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
            defaultValue={get(rowData, dataIndex) as string}
            fullWidth
            inputProps={{
              type: inputType,
            }}
          />
        )}
      </div>
    ) : children) as ReactElement;
  };

  const renderRowActions: TableColumn<DataType>['render'] = (_, source) => (
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
          <Button
            danger
            disabled={!!editingKey}
          >
            刪除
          </Button>
        </Fragment>
      )}
    </div>
  );

  const mergeColumnWithCustomProps: typeof editableColumns = editableColumns.map((column) => {
    if (!column.dataIndex) {
      /**  actions column */
      return {
        ...column,
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
    <div
      style={{
        width: '90%',
        height: 460,
      }}
    >
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergeColumnWithCustomProps}
        dataSource={dataSource}
      />
    </div>
  );
};
