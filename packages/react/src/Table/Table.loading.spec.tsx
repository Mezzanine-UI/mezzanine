import '@testing-library/jest-dom';
import { cleanup, render } from '../../__test-utils__';
import Table from '.';
import type {
  TableCollectable,
  TableColumn,
  TableDataSourceWithKey,
  TableExpandable,
  TableRowSelection,
  TableToggleable,
} from '@mezzanine-ui/core/table';

interface TestDataType extends TableDataSourceWithKey {
  name: string;
  nested: { value: string };
}

const testData: TestDataType[] = [
  { key: '0', name: 'John', nested: { value: 'a' } },
  { key: '1', name: 'Jane', nested: { value: 'b' } },
];

/**
 * Every consumer callback that receives a record, wired to dereference a
 * nested field. A placeholder row would only carry `key`, so any one of these
 * being called during loading both breaks the type contract and throws.
 */
const createRecordCallbacks = () => ({
  actionsRender: jest.fn((record: TestDataType) => [
    { name: record.nested.value, onClick: () => {} },
  ]),
  collectableIsRowDisabled: jest.fn(
    (record: TestDataType) => !!record.nested.value,
  ),
  columnRender: jest.fn((record: TestDataType) => record.nested.value),
  expandedRowRender: jest.fn((record: TestDataType) => (
    <div>{record.nested.value}</div>
  )),
  getCheckboxProps: jest.fn((record: TestDataType) => ({
    selected: !!record.nested.value,
  })),
  isSelectionDisabled: jest.fn((record: TestDataType) => !!record.nested.value),
  rowExpandable: jest.fn((record: TestDataType) => !!record.nested.value),
  rowState: jest.fn((record: TestDataType) =>
    record.nested.value === 'a' ? ('added' as const) : undefined,
  ),
  toggleableIsRowDisabled: jest.fn(
    (record: TestDataType) => !!record.nested.value,
  ),
});

type RecordCallbacks = ReturnType<typeof createRecordCallbacks>;

const renderTableWith = (callbacks: RecordCallbacks, loading: boolean) =>
  render(
    <Table<TestDataType>
      actions={{ render: callbacks.actionsRender }}
      collectable={
        {
          collectedRowKeys: [],
          enabled: true,
          isRowDisabled: callbacks.collectableIsRowDisabled,
          onCollectChange: () => {},
        } as TableCollectable<TestDataType>
      }
      columns={
        [
          { key: 'name', render: callbacks.columnRender, title: 'Name' },
          { dataIndex: 'name', key: 'plain', title: 'Plain' },
        ] as TableColumn<TestDataType>[]
      }
      dataSource={testData}
      expandable={
        {
          // Controlled keys that collide with the placeholder keys the table
          // used to fabricate ('0', '1'), which is how expandedRowRender used
          // to be reached during loading.
          expandedRowKeys: ['0', '1'],
          expandedRowRender: callbacks.expandedRowRender,
          rowExpandable: callbacks.rowExpandable,
        } as TableExpandable<TestDataType>
      }
      loading={loading}
      rowSelection={
        {
          getCheckboxProps: callbacks.getCheckboxProps,
          isSelectionDisabled: callbacks.isSelectionDisabled,
          mode: 'checkbox',
          onChange: () => {},
          selectedRowKeys: [],
        } as TableRowSelection<TestDataType>
      }
      rowState={callbacks.rowState}
      toggleable={
        {
          enabled: true,
          isRowDisabled: callbacks.toggleableIsRowDisabled,
          onToggleChange: () => {},
          toggledRowKeys: [],
        } as TableToggleable<TestDataType>
      }
    />,
  );

describe('<Table /> loading', () => {
  afterEach(cleanup);

  it('should not throw when a column render dereferences the record', () => {
    expect(() =>
      render(
        <Table
          columns={
            [
              {
                key: 'name',
                render: (record: TestDataType) => record.nested.value,
                title: 'Name',
              },
            ] as TableColumn<TestDataType>[]
          }
          dataSource={[]}
          loading
        />,
      ),
    ).not.toThrow();

    expect(document.querySelectorAll('tbody tr')).toHaveLength(10);
    expect(document.querySelectorAll('.mzn-skeleton').length).toBeGreaterThan(
      0,
    );
  });

  it('should not call any row-level record callback while loading', () => {
    const callbacks = createRecordCallbacks();

    expect(() => renderTableWith(callbacks, true)).not.toThrow();

    const called = (Object.keys(callbacks) as (keyof RecordCallbacks)[]).filter(
      (name) => callbacks[name].mock.calls.length > 0,
    );

    // `isSelectionDisabled` is excluded on purpose: it also feeds the header's
    // select-all state, which is derived from the real dataSource and is
    // therefore never handed a placeholder row. See the assertion below.
    expect(called).toEqual(['isSelectionDisabled']);
  });

  it('should only ever hand real records to isSelectionDisabled while loading', () => {
    const callbacks = createRecordCallbacks();

    renderTableWith(callbacks, true);

    callbacks.isSelectionDisabled.mock.calls.forEach(([record]) => {
      expect(record).toEqual(
        expect.objectContaining({ nested: expect.any(Object) }),
      );
    });
  });

  it('should call every record callback with the real record once loading ends', () => {
    const callbacks = createRecordCallbacks();

    expect(() => renderTableWith(callbacks, false)).not.toThrow();

    (Object.keys(callbacks) as (keyof RecordCallbacks)[]).forEach((name) => {
      expect(callbacks[name]).toHaveBeenCalled();
      expect(callbacks[name].mock.calls[0][0]).toEqual(
        expect.objectContaining({ nested: expect.any(Object) }),
      );
    });
  });

  it('should not leak the consumer selection or transition state onto skeleton rows', () => {
    const { getHostHTMLElement } = render(
      <Table
        columns={[{ dataIndex: 'name', key: 'name', title: 'Name' }] as any}
        dataSource={[]}
        loading
        rowSelection={
          {
            onChange: () => {},
            // Collides with the placeholder keys the table used to fabricate.
            selectedRowKeys: ['0', '1'],
          } as any
        }
      />,
    );

    const rows = getHostHTMLElement().querySelectorAll('tbody tr');

    rows.forEach((row) => {
      expect(row.classList.contains('mzn-table__body__row--selected')).toBe(
        false,
      );
      expect(row.getAttribute('aria-selected')).toBe('false');
    });
  });
});
