import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  effect,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import {
  CopyIcon,
  DotHorizontalIcon,
  DownloadIcon,
  FolderMoveIcon,
  TrashIcon,
} from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import {
  MznDescription,
  MznDescriptionContent,
  MznDescriptionGroup,
} from '@mezzanine-ui/ng/description';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznTable } from './table.component';
import { MznTableCellRender } from './table-cell-render.directive';
import { useTableDataSource } from './use-table-data-source';
import type {
  HighlightMode as HighlightModeType,
  RowHeightPreset as RowHeightPresetType,
  SortOrder as SortOrderType,
  TableActions,
  TableCollectable,
  TableColumn,
  TableDataSource,
  TableDraggable,
  TableEmptyProps,
  TableExpandable,
  TablePinnable,
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
  TableSize,
  TableToggleable,
} from './table-types';

const basicColumns: TableColumn[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    width: 150,
    minWidth: 150,
  },
  {
    key: 'age',
    title: 'Age',
    dataIndex: 'age',
    width: 100,
    minWidth: 100,
    align: 'center',
  },
  { key: 'address', title: 'Address', dataIndex: 'address' },
];

const basicData: TableDataSource[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 35, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Jane Doe', age: 30, address: 'Tokyo No. 1 Lake Park' },
  { key: '5', name: 'Jack Smith', age: 21, address: 'Paris No. 1 Lake Park' },
  { key: '6', name: 'Emily Davis', age: 45, address: 'Berlin No. 1 Lake Park' },
  {
    key: '7',
    name: 'Michael Johnson',
    age: 38,
    address: 'Madrid No. 1 Lake Park',
  },
  { key: '8', name: 'Sarah Wilson', age: 29, address: 'Rome No. 1 Lake Park' },
  {
    key: '9',
    name: 'David Brown',
    age: 33,
    address: 'Dublin No. 1 Lake Park',
  },
];

export default {
  title: 'Data Display/Table',
  decorators: [
    moduleMetadata({
      imports: [MznTable, MznTableCellRender, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: basicData,
    },
    template: `
      <div mznTable [columns]="columns" [dataSource]="dataSource">
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    `,
  }),
};

export const SubSize: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: basicData,
    },
    template: `
      <div mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        size="sub"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-table-row-height',
  standalone: true,
  imports: [MznTable],
  template: `
    <div style="display: grid; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>Size:</span>
        <select
          [value]="size()"
          (change)="size.set($any($event.target).value)"
          style="margin-left: 8px;"
        >
          <option value="main">main</option>
          <option value="sub">sub</option>
        </select>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>Row Height Preset:</span>
        <select
          [value]="preset()"
          (change)="preset.set($any($event.target).value)"
          style="margin-left: 8px;"
        >
          <option value="base">base</option>
          <option value="condensed">condensed</option>
          <option value="detailed">detailed</option>
          <option value="roomy">roomy</option>
        </select>
      </div>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [size]="size()"
        [rowHeightPreset]="preset()"
      ></div>
    </div>
  `,
})
class RowHeightPresetStoryComponent {
  readonly size = signal<TableSize>('main');
  readonly preset = signal<RowHeightPresetType>('base');
  readonly columns = basicColumns;
  readonly dataSource = basicData;
}

export const RowHeightPreset: Story = {
  name: 'Row Height Preset',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [RowHeightPresetStoryComponent] })],
  render: () => ({
    template: `<story-table-row-height />`,
  }),
};

export const DataStateRepresentation: Story = {
  name: 'Data State Representation',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: basicData,
      separatorAtRowIndexes: [3, 6],
    },
    template: `
      <div style="display: grid; gap: 16px;">
        <span>separatorAtRowIndexes: [3, 6], zebraStriping: true</span>
        <div mznTable
          [columns]="columns"
          [dataSource]="dataSource"
          [zebraStriping]="true"
          [separatorAtRowIndexes]="separatorAtRowIndexes"
        ></div>
      </div>
    `,
  }),
};

interface TransitionRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
}

@Component({
  selector: 'story-table-create-delete',
  standalone: true,
  imports: [MznButton, MznInput, MznTable, MznTableCellRender, MznTypography],
  template: `
    <div style="width: 100%;">
      <div
        style="background: #f5f5f5; border-radius: 8px; margin-bottom: 16px; padding: 16px;"
      >
        <h4 style="margin: 0 0 8px 0;"
          >GraphQL Pattern: mutation → refetch → updateDataSource</h4
        >
        <p style="margin: 0 0 4px 0;"
          >Please use "useTableDataSource" to manage data source with
          create/delete</p
        >
        <p style="color: #666; font-size: 14px; margin: 0;">
          API returns <code>{{ '{ total: number, items: T[] }' }}</code> format.
          Pagination uses offset + limit. New items are prepended.
        </p>
      </div>

      <div
        style="margin-bottom: 16px; display: flex; flex-flow: row; gap: 8px;"
      >
        <div
          mznInput
          placeholder="Name"
          [value]="newName()"
          (valueChange)="newName.set($event)"
        ></div>
        <div
          mznInput
          variant="number"
          placeholder="Age"
          [value]="newAge()"
          (valueChange)="newAge.set($event)"
        ></div>
        <div
          mznInput
          placeholder="Address"
          [value]="newAddress()"
          (valueChange)="newAddress.set($event)"
        ></div>
        <button
          mznButton
          variant="base-primary"
          type="button"
          [disabled]="!newName().trim()"
          (click)="handleCreate()"
          >Create</button
        >
      </div>

      <div
        mznTable
        [actions]="actions"
        [columns]="transitionColumns"
        [dataSource]="dataSource()"
        [pagination]="pagination()"
        [transitionState]="transitionState()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    </div>
  `,
})
class CreateDeleteTransitionStoryComponent {
  private readonly itemsPerPage = 5;

  private readonly serverDb = signal<readonly TransitionRowType[]>(
    Array.from(
      { length: 23 },
      (_, i): TransitionRowType => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + (i % 40),
        address: `Address ${i + 1}`,
      }),
    ),
  );

  readonly currentPage = signal(1);
  readonly newName = signal('');
  readonly newAge = signal('');
  readonly newAddress = signal('');

  // eslint-disable-next-line react-hooks/rules-of-hooks -- Angular factory, not React hook
  private readonly ds = useTableDataSource<TransitionRowType>({
    initialData: this.fetchPage(1).items,
    highlightDuration: 1000,
    fadeOutDuration: 200,
  });

  readonly dataSource = this.ds.dataSource;
  readonly transitionState = this.ds.transitionState;

  readonly transitionColumns: TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 150 },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'address', title: 'Address', dataIndex: 'address' },
  ];

  readonly actions: TableActions = {
    title: 'Action',
    width: 120,
    variant: 'destructive-text-link',
    render: () => [
      {
        key: 'delete',
        label: 'Delete',
        onClick: (r) => this.handleDelete(String(r['key'])),
      },
    ],
  };

  readonly pagination = computed(() => ({
    current: this.currentPage(),
    pageSize: this.itemsPerPage,
    total: this.serverDb().length,
    onChange: (page: number): void => this.handlePageChange(page),
  }));

  private fetchPage(page: number): {
    items: TransitionRowType[];
    total: number;
  } {
    const offset = (page - 1) * this.itemsPerPage;
    const db = this.serverDb();

    return {
      items: [...db.slice(offset, offset + this.itemsPerPage)],
      total: db.length,
    };
  }

  handlePageChange(page: number): void {
    this.currentPage.set(page);
    this.ds.updateDataSource(this.fetchPage(page).items);
  }

  handleCreate(): void {
    const name = this.newName().trim();

    if (!name) return;

    const newItem: TransitionRowType = {
      key: String(Date.now()),
      name,
      age: parseInt(this.newAge(), 10) || 0,
      address: this.newAddress() || 'Unknown Address',
    };

    this.serverDb.update((prev) => [newItem, ...prev]);

    const response = this.fetchPage(this.currentPage());
    const inCurrentPage = response.items.some((i) => i.key === newItem.key);

    this.ds.updateDataSource(response.items, {
      addedKeys: inCurrentPage ? [newItem.key] : [],
    });

    this.newName.set('');
    this.newAge.set('');
    this.newAddress.set('');
  }

  handleDelete(key: string): void {
    this.serverDb.update((prev) => prev.filter((i) => i.key !== key));

    const total = this.serverDb().length;
    const maxPage = Math.ceil(total / this.itemsPerPage);
    const newPage =
      this.currentPage() > maxPage ? Math.max(1, maxPage) : this.currentPage();

    if (newPage !== this.currentPage()) this.currentPage.set(newPage);

    this.ds.updateDataSource(this.fetchPage(newPage).items, {
      removedKeys: [key],
    });
  }
}

export const CreateDeleteTransition: Story = {
  name: 'Create/Delete Transition',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [CreateDeleteTransitionStoryComponent] }),
  ],
  render: () => ({
    template: `<story-table-create-delete />`,
  }),
};

interface TransitionWithSubType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
  readonly subData?: readonly TransitionWithSubType[];
}

/** baseData with subData, mirroring React `baseData` in Table.stories.tsx. */
const expansionBaseData: readonly TransitionWithSubType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    subData: [
      {
        key: '1-1',
        name: 'Sub John Brown',
        age: 10,
        address: 'Sub New York No. 1 Lake Park',
      },
      {
        key: '1-2',
        name: 'Sub Jim Green',
        age: 12,
        address: 'Sub New York No. 2 Lake Park',
      },
    ],
  },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  {
    key: '3',
    name: 'Joe Black',
    age: 35,
    address: 'Sydney No. 1 Lake Park',
    subData: [
      {
        key: '3-1',
        name: 'Sub John Brown',
        age: 10,
        address: 'Sub New York No. 1 Lake Park',
      },
      {
        key: '3-2',
        name: 'Sub Jim Green',
        age: 12,
        address: 'Sub New York No. 2 Lake Park',
      },
    ],
  },
  { key: '4', name: 'Jane Doe', age: 30, address: 'Tokyo No. 1 Lake Park' },
  { key: '5', name: 'Jack Smith', age: 21, address: 'Paris No. 1 Lake Park' },
  { key: '6', name: 'Emily Davis', age: 45, address: 'Berlin No. 1 Lake Park' },
  {
    key: '7',
    name: 'Michael Johnson',
    age: 38,
    address: 'Madrid No. 1 Lake Park',
  },
  { key: '8', name: 'Sarah Wilson', age: 29, address: 'Rome No. 1 Lake Park' },
  {
    key: '9',
    name: 'David Brown',
    age: 33,
    address: 'Dublin No. 1 Lake Park',
  },
];

const expansionColumns: TableColumn[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', width: 150 },
  { key: 'age', title: 'Age', width: 100 },
  { key: 'address', title: 'Address', dataIndex: 'address' },
];

/**
 * 展開列內部 component — 每個展開的 row 一份 instance，故擁有獨立的
 * `useTableDataSource` state，對齊 React `ExpandedRowRender` 的設計。
 */
@Component({
  selector: 'story-table-expanded-row-render',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznButton, MznTable, MznTableCellRender, MznTypography],
  template: `
    <div>
      <div
        style="display: flex; gap: 8px; justify-content: flex-end; margin-bottom: 8px;"
      >
        <button
          mznButton
          variant="base-secondary"
          size="sub"
          type="button"
          (click)="addSubItem()"
          >Add Sub Item</button
        >
      </div>
      <div
        mznTable
        [actions]="actions"
        [columns]="columns()"
        [dataSource]="dataSource()"
        [nested]="true"
        [showHeader]="false"
        [transitionState]="transitionState()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    </div>
  `,
})
class ExpandedRowRenderStoryComponent {
  readonly record = input.required<TransitionWithSubType>();
  readonly columns = input.required<TableColumn[]>();

  // eslint-disable-next-line react-hooks/rules-of-hooks -- Angular factory, not React hook
  private readonly ds = useTableDataSource<TransitionWithSubType>({
    initialData: [],
    highlightDuration: 1500,
    fadeOutDuration: 300,
  });

  readonly dataSource = this.ds.dataSource;
  readonly transitionState = this.ds.transitionState;

  readonly actions: TableActions = {
    title: 'Action',
    width: 100,
    variant: 'destructive-text-link',
    render: () => [
      {
        key: 'delete',
        label: 'Delete',
        onClick: (r) => this.handleSubDelete(String(r['key'])),
      },
    ],
  };

  constructor() {
    // Seed child dataSource from the parent row's subData once the record
    // input is bound. React's `ExpandedRowRender` accomplishes the same via
    // `useTableDataSource({ initialData: record.subData })`.
    //
    // `updateDataSource` reads AND writes `internalData` inside its body; if
    // the effect tracked those signal accesses it would re-run every time we
    // updated the data and loop forever. Keep the only tracked signal to
    // `this.record()` and run the data mutation inside `untracked`.
    effect(
      () => {
        const sub = this.record().subData ?? [];

        untracked(() => {
          this.ds.updateDataSource(sub as readonly TransitionWithSubType[]);
        });
      },
      { allowSignalWrites: true },
    );
  }

  addSubItem(): void {
    const newItem: TransitionWithSubType = {
      key: `new-${Date.now()}`,
      name: 'New Sub Item',
      age: 0,
      address: 'New Address',
    };

    this.ds.updateDataSource([...this.dataSource(), newItem], {
      addedKeys: [newItem.key],
    });
  }

  private handleSubDelete(key: string): void {
    this.ds.updateDataSource(
      this.dataSource().filter((i) => i.key !== key),
      { removedKeys: [key] },
    );
  }
}

@Component({
  selector: 'story-table-create-delete-expansion',
  standalone: true,
  imports: [
    ExpandedRowRenderStoryComponent,
    MznTable,
    MznTableCellRender,
    MznTypography,
  ],
  template: `
    <div style="width: 100%;">
      <div
        style="background: #f5f5f5; border-radius: 8px; margin-bottom: 16px; padding: 16px;"
      >
        <h4 style="margin: 0 0 8px 0;">Transition with Expansion Demo</h4>
        <p style="margin: 0 0 4px 0;"
          >1. 刪除父層資料時，展開區域會同步顯示刪除提示</p
        >
        <p style="margin: 0 0 4px 0;"
          >2. 在展開區域內的子表格中刪除項目，該項目會有獨立的刪除過渡效果</p
        >
        <p style="color: #666; font-size: 14px; margin: 0;"
          >點擊展開圖標查看子表格，然後嘗試刪除父層或子層項目</p
        >
      </div>

      <ng-template #parentExpanded let-record>
        <story-table-expanded-row-render
          [record]="record"
          [columns]="columns"
        />
      </ng-template>

      <div
        mznTable
        [actions]="actions"
        [columns]="columns"
        [dataSource]="dataSource()"
        [expandable]="expandable()"
        [transitionState]="transitionState()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    </div>
  `,
})
class CreateDeleteExpansionStoryComponent {
  readonly columns = expansionColumns;

  private readonly parentExpandedTpl =
    viewChild.required<TemplateRef<{ $implicit: TransitionWithSubType }>>(
      'parentExpanded',
    );

  // eslint-disable-next-line react-hooks/rules-of-hooks -- Angular factory, not React hook
  private readonly ds = useTableDataSource<TransitionWithSubType>({
    initialData: expansionBaseData,
    highlightDuration: 700,
    fadeOutDuration: 150,
  });

  readonly dataSource = this.ds.dataSource;
  readonly transitionState = this.ds.transitionState;

  readonly actions: TableActions = {
    title: 'Action',
    width: 140,
    variant: 'destructive-text-link',
    render: () => [
      {
        key: 'delete',
        label: 'Delete Parent',
        onClick: (r) => this.handleDeleteParent(String(r['key'])),
      },
    ],
  };

  readonly expandable = computed(
    (): TableExpandable => ({
      template: this.parentExpandedTpl(),
      rowExpandable: (record) =>
        !!(record as TransitionWithSubType).subData?.length,
    }),
  );

  private handleDeleteParent(key: string): void {
    this.ds.updateDataSource(
      this.dataSource().filter((i) => i.key !== key),
      { removedKeys: [key] },
    );
  }
}

export const CreateDeleteTransitionWithExpansion: Story = {
  name: 'Create/Delete Transition With Expansion',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [CreateDeleteExpansionStoryComponent] }),
  ],
  render: () => ({
    template: `<story-table-create-delete-expansion />`,
  }),
};

interface SortingRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
}

@Component({
  selector: 'story-table-with-sorting',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznTypography],
  template: `
    <div style="display: grid; grid-auto-columns: row; gap: 12px;">
      <span
        >Controlled sort order: &#123; key: "{{ sortOrder()?.key }}", sortOrder:
        "{{ sortOrder()?.order }}"&#125;</span
      >
      <div mznTable [columns]="columns()" [dataSource]="controlledDataSource()">
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    </div>
  `,
})
class WithSortingStoryComponent {
  private readonly baseData: readonly SortingRowType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
    { key: '3', name: 'Joe Black', age: 35, address: 'Sydney No. 1 Lake Park' },
    { key: '4', name: 'Jane Doe', age: 30, address: 'Tokyo No. 1 Lake Park' },
    { key: '5', name: 'Jack Smith', age: 21, address: 'Paris No. 1 Lake Park' },
    {
      key: '6',
      name: 'Emily Davis',
      age: 45,
      address: 'Berlin No. 1 Lake Park',
    },
    {
      key: '7',
      name: 'Michael Johnson',
      age: 38,
      address: 'Madrid No. 1 Lake Park',
    },
    {
      key: '8',
      name: 'Sarah Wilson',
      age: 29,
      address: 'Rome No. 1 Lake Park',
    },
    {
      key: '9',
      name: 'David Brown',
      age: 33,
      address: 'Dublin No. 1 Lake Park',
    },
  ];

  readonly sortOrder = signal<{
    readonly key: string;
    readonly order: SortOrderType;
  } | null>({ key: 'name', order: 'ascend' });

  readonly controlledDataSource = signal<readonly SortingRowType[]>(
    // Initial state matches React: sortOrder starts on { key: 'name', order: 'ascend' }.
    [...this.baseData].sort((a, b) => a.name.localeCompare(b.name)),
  );

  readonly columns = computed((): TableColumn[] => {
    const current = this.sortOrder();
    const orderFor = (key: string): SortOrderType | undefined =>
      current?.key === key ? current.order : undefined;

    return [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        width: 150,
        sortOrder: orderFor('name'),
        onSort: (key, order) => this.handleSort(key, order, 'name'),
      },
      {
        key: 'age',
        title: 'Age',
        width: 100,
        sortOrder: orderFor('age'),
        onSort: (key, order) => this.handleSort(key, order, 'age'),
      },
      { key: 'address', title: 'Address', dataIndex: 'address' },
    ];
  });

  private handleSort(
    key: string,
    order: SortOrderType,
    field: 'name' | 'age',
  ): void {
    this.sortOrder.set({ key, order });

    if (!order) {
      this.controlledDataSource.set(this.baseData);

      return;
    }

    const sorted = [...this.controlledDataSource()].sort((a, b) => {
      if (field === 'name') {
        return order === 'ascend'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      return order === 'ascend' ? a.age - b.age : b.age - a.age;
    });

    this.controlledDataSource.set(sorted);
  }
}

export const WithSorting: Story = {
  name: 'With Sorting',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithSortingStoryComponent] })],
  render: () => ({
    template: `<story-table-with-sorting />`,
  }),
};

interface SelectionRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
  readonly disabled: boolean;
}

@Component({
  selector: 'story-table-row-selection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MznTable,
    MznTableCellRender,
    MznToggle,
    MznTypography,
  ],
  template: `
    <div>
      <div
        style="margin: 0 0 16px; display: flex; flex-flow: column; gap: 4px;"
      >
        <span>Mode: checkbox</span>
        <span>- Selected: [{{ selectedRowKeys().join(', ') }}]</span>
        <div
          mznToggle
          label="props.hideSelectAll"
          [ngModel]="hideSelectAll()"
          (ngModelChange)="hideSelectAll.set($event)"
        ></div>
        <div
          mznToggle
          label="props.preserveSelectedRowKeys"
          [ngModel]="preserveSelectedRowKeys()"
          (ngModelChange)="preserveSelectedRowKeys.set($event)"
        ></div>
      </div>
      <div
        mznTable
        [columns]="baseColumns"
        [dataSource]="paginationData()"
        [rowSelection]="checkboxSelection()"
        [pagination]="pagination()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>

      <div
        style="margin: 32px 0 16px; display: flex; flex-flow: column; gap: 4px;"
      >
        <span>Mode: radio</span>
        <span>- Selected: {{ selectedRadioKey() ?? '' }}</span>
      </div>
      <div
        mznTable
        [columns]="baseColumns"
        [dataSource]="baseData"
        [rowSelection]="radioSelection()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    </div>
  `,
})
class WithRowSelectionStoryComponent {
  readonly baseColumns: TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 150 },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'address', title: 'Address', dataIndex: 'address' },
  ];

  /** Mirrors React `baseData` — a few rows have age > 40 so the radio's
   *  `isSelectionDisabled: (r) => r.age > 40` predicate actually disables
   *  some rows (Jim Green age=42, Emily Davis age=45). */
  readonly baseData: readonly SelectionRowType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 35,
      address: 'Sydney No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '4',
      name: 'Jane Doe',
      age: 30,
      address: 'Tokyo No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '5',
      name: 'Jack Smith',
      age: 21,
      address: 'Paris No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '6',
      name: 'Emily Davis',
      age: 45,
      address: 'Berlin No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '7',
      name: 'Michael Johnson',
      age: 38,
      address: 'Madrid No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '8',
      name: 'Sarah Wilson',
      age: 29,
      address: 'Rome No. 1 Lake Park',
      disabled: false,
    },
    {
      key: '9',
      name: 'David Brown',
      age: 33,
      address: 'Dublin No. 1 Lake Park',
      disabled: false,
    },
  ];

  private readonly originData: readonly SelectionRowType[] = Array.from(
    { length: 100 },
    (_, i): SelectionRowType => ({
      key: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + (i % 50),
      address: `Address ${i + 1}`,
      disabled: i % 4 === 0,
    }),
  );

  private readonly itemsPerPage = 10;

  readonly currentPage = signal(1);
  readonly selectedRowKeys = signal<readonly string[]>([]);
  readonly selectedRadioKey = signal<string | undefined>(undefined);
  readonly hideSelectAll = signal(false);
  readonly preserveSelectedRowKeys = signal(false);

  readonly paginationData = computed((): readonly SelectionRowType[] => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;

    return this.originData.slice(start, start + this.itemsPerPage);
  });

  readonly checkboxSelection = computed(
    (): TableRowSelectionCheckbox => ({
      mode: 'checkbox',
      hideSelectAll: this.hideSelectAll(),
      preserveSelectedRowKeys: this.preserveSelectedRowKeys(),
      selectedRowKeys: this.selectedRowKeys(),
      isSelectionDisabled: (record) => (record as SelectionRowType).disabled,
      onChange: (keys): void => this.selectedRowKeys.set(keys),
    }),
  );

  readonly radioSelection = computed(
    (): TableRowSelectionRadio => ({
      mode: 'radio',
      selectedRowKey: this.selectedRadioKey(),
      isSelectionDisabled: (record) => (record as SelectionRowType).age > 40,
      onChange: (key): void => this.selectedRadioKey.set(key),
    }),
  );

  readonly pagination = computed(() => ({
    current: this.currentPage(),
    pageSize: this.itemsPerPage,
    total: this.originData.length,
    onChange: (page: number): void => this.handlePageChange(page),
  }));

  /**
   * React's `preserveSelectedRowKeys` only affects toggleAll, not page
   * navigation — selectedRowKeys are untouched on page change and are
   * trimmed (or kept) by MznTable's `onSelectAll` based on the flag.
   */
  private handlePageChange(page: number): void {
    this.currentPage.set(page);
  }
}

export const WithRowSelection: Story = {
  name: 'With Row Selection',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithRowSelectionStoryComponent] })],
  render: () => ({
    template: `<story-table-row-selection />`,
  }),
};

interface BulkActionsRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
  readonly disabled: boolean;
}

@Component({
  selector: 'story-table-bulk-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznTypography],
  template: `
    <div>
      <div style="width: 100%; height: 100px;"
        >(Extra spaces for demo fixed bulk actions)</div
      >
      <div
        style="margin: 0 0 16px; display: flex; flex-flow: column; gap: 4px;"
      >
        <span>Mode: checkbox + bulkActions</span>
        <span>- Selected: [{{ selectedRowKeys().join(', ') }}]</span>
      </div>
      <div
        mznTable
        [columns]="baseColumns"
        [dataSource]="paginationData()"
        [rowSelection]="checkboxSelection()"
        [pagination]="pagination()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
      <div style="width: 100%; height: 600px;"></div>
    </div>
  `,
})
class WithBulkActionsStoryComponent {
  readonly baseColumns: TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 150 },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'address', title: 'Address', dataIndex: 'address' },
  ];

  private readonly originData: readonly BulkActionsRowType[] = Array.from(
    { length: 100 },
    (_, i): BulkActionsRowType => ({
      key: String(i + 1),
      name: `User ${i + 1}`,
      age: 20 + (i % 50),
      address: `Address ${i + 1}`,
      disabled: i % 4 === 0,
    }),
  );

  private readonly itemsPerPage = 20;

  readonly currentPage = signal(1);
  readonly selectedRowKeys = signal<readonly string[]>([]);

  readonly paginationData = computed((): readonly BulkActionsRowType[] => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;

    return this.originData.slice(start, start + this.itemsPerPage);
  });

  readonly checkboxSelection = computed(
    (): TableRowSelectionCheckbox => ({
      mode: 'checkbox',
      selectedRowKeys: this.selectedRowKeys(),
      isSelectionDisabled: (record) => (record as BulkActionsRowType).disabled,
      bulkActions: {
        mainActions: [
          {
            icon: FolderMoveIcon,
            label: 'Move',
            onClick: (): void => {},
          },
          {
            icon: CopyIcon,
            label: 'Copy',
            onClick: (): void => {},
          },
          {
            icon: DownloadIcon,
            label: 'Download',
            onClick: (): void => {},
          },
        ],
        destructiveAction: {
          icon: TrashIcon,
          label: 'Delete',
          onClick: (): void => {},
        },
        overflowAction: {
          icon: DotHorizontalIcon,
          label: 'More',
          placement: 'top',
          options: [
            { id: 'opt1', name: 'Option 1' },
            { id: 'opt2', name: 'Option 2' },
            { id: 'opt3', name: 'Option 3' },
          ],
          onSelect: (option, keys): void => {
            // eslint-disable-next-line no-console
            console.log('Overflow action:', option, keys);
          },
        },
        renderSelectionSummary: (count) => `已選擇 ${count} 筆資料`,
      },
      onChange: (keys) => this.selectedRowKeys.set(keys),
    }),
  );

  readonly pagination = computed(() => ({
    current: this.currentPage(),
    pageSize: this.itemsPerPage,
    total: this.originData.length,
    onChange: (page: number): void => this.currentPage.set(page),
  }));
}

export const WithBulkActions: Story = {
  name: 'With Bulk Actions',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithBulkActionsStoryComponent] })],
  render: () => ({
    template: `<story-table-bulk-actions />`,
  }),
};

interface PaginationRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
}

@Component({
  selector: 'story-table-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznTypography],
  template: `
    <div
      mznTable
      [columns]="baseColumns"
      [dataSource]="paginationData()"
      [pagination]="pagination()"
    >
      <ng-template mznTableCellRender="age" let-record>
        <span mznTypography variant="body-mono">{{ record.age }}</span>
      </ng-template>
    </div>
  `,
})
class WithPaginationStoryComponent {
  readonly baseColumns: TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 150 },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'address', title: 'Address', dataIndex: 'address' },
  ];

  private readonly itemsPerPage = signal(10);
  readonly currentPage = signal(1);

  /**
   * React's WithPagination story synthesises `paginationData` on the fly
   * by slicing a 100-row range out of an imaginary source, so we do the
   * same here — no in-memory `originData`, just compute from page + size.
   */
  readonly paginationData = computed((): readonly PaginationRowType[] => {
    const page = this.currentPage();
    const size = this.itemsPerPage();

    return Array.from({ length: size }, (_, i) => {
      const index = i + (page - 1) * size;

      return {
        key: String(index + 1),
        name: `User ${index + 1}`,
        age: 20 + index,
        address: `Address ${index + 1}`,
      };
    });
  });

  readonly pagination = computed(() => ({
    current: this.currentPage(),
    pageSize: this.itemsPerPage(),
    total: 100,
    showPageSizeOptions: true,
    pageSizeLabel: '每頁顯示：',
    renderResultSummary: (from: number, to: number, total: number): string =>
      `目前顯示 ${from}-${to} 筆，共 ${total} 筆資料`,
    showJumper: true,
    inputPlaceholder: '頁碼',
    hintText: '前往',
    buttonText: '確定',
    onChange: (page: number): void => this.currentPage.set(page),
    onPageSizeChange: (size: number): void => this.itemsPerPage.set(size),
  }));
}

export const WithPagination: Story = {
  name: 'With Pagination',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithPaginationStoryComponent] })],
  render: () => ({
    template: `<story-table-pagination />`,
  }),
};

@Component({
  selector: 'story-table-expansion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MznDescription,
    MznDescriptionContent,
    MznDescriptionGroup,
    MznTable,
    MznTableCellRender,
    MznTypography,
  ],
  template: `
    <!-- Expansion with description (mirrors React 'expandableWithDescription') -->
    <ng-template #descriptionTpl>
      <div style="padding: 6px 12px;">
        <div mznDescriptionGroup>
          <div mznDescription title="Date Created At" widthType="wide">
            <span mznDescriptionContent>Tue, 03 Aug 2021 14:22:18 GMT</span>
          </div>
          <div mznDescription title="Data Updated At" widthType="wide">
            <span mznDescriptionContent>Tue, 05 Aug 2025 11:22:18 GMT</span>
          </div>
        </div>
      </div>
    </ng-template>

    <!-- Expansion with sub-table (mirrors React 'expandableWithSubTable').
         React's TableExpandedRow cloneElements any nested Table with
         nested=true + showHeader=false automatically; Angular has no
         equivalent injection, so we set them explicitly here. -->
    <ng-template #subTableTpl let-record>
      <div
        mznTable
        [columns]="baseColumns"
        [dataSource]="record.subData ?? []"
        [nested]="true"
        [showHeader]="false"
      >
        <ng-template mznTableCellRender="age" let-sub>
          <span mznTypography variant="body-mono">{{ sub.age }}</span>
        </ng-template>
      </div>
    </ng-template>

    <div style="display: grid; grid-auto-columns: row; gap: 12px;">
      <span>Expansion with description</span>
      <div
        mznTable
        [columns]="baseColumns"
        [dataSource]="dataSource"
        [expandable]="{ template: descriptionTpl, rowExpandable: canExpand }"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>

      <span>Expansion with sub table</span>
      <div
        mznTable
        [columns]="baseColumns"
        [dataSource]="dataSource"
        [expandable]="{ template: subTableTpl, rowExpandable: canExpand }"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
      </div>
    </div>
  `,
})
class ExpansionStoryComponent {
  readonly baseColumns: TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 150 },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'address', title: 'Address', dataIndex: 'address' },
  ];

  readonly dataSource = expansionBaseData;

  /** Only rows carrying `subData` are expandable — mirrors React
   *  `rowExpandable: (record) => !!record.subData?.length`. */
  readonly canExpand = (record: TableDataSource): boolean =>
    !!(record as TransitionWithSubType).subData?.length;
}

export const WithExpansion: Story = {
  name: 'With Expansion',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [ExpansionStoryComponent] })],
  render: () => ({
    template: `<story-table-expansion />`,
  }),
};

export const WithFixedColumns: Story = {
  name: 'With Fixed Columns',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: basicData,
    },
    template: `
      <!-- NOTE: Fixed left/right columns (column.fixed) from React are not yet supported in Angular MznTable. -->
      <div mznTable [columns]="columns" [dataSource]="dataSource" ></div>
    `,
  }),
};

export const WithResizableColumns: Story = {
  name: 'With Resizable Columns',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: [
        {
          key: 'name',
          title: 'Name',
          dataIndex: 'name',
          width: 200,
          minWidth: 100,
        },
        {
          key: 'age',
          title: 'Age',
          dataIndex: 'age',
          width: 100,
          minWidth: 60,
          align: 'center' as const,
        },
        {
          key: 'email',
          title: 'Email',
          dataIndex: 'email',
          width: 300,
          minWidth: 150,
        },
      ],
      dataSource: basicData,
    },
    template: `
      <div mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [resizable]="true"
      ></div>
    `,
  }),
};

export const WithCustomRender: Story = {
  name: 'With Custom Render',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: basicData,
    },
    template: `
      <!-- NOTE: Custom cell rendering (column.render() returning JSX) from React
           is not supported in Angular MznTable. Cells render string values via dataIndex. -->
      <div mznTable [columns]="columns" [dataSource]="dataSource" ></div>
    `,
  }),
};

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
    },
    template: `
      <div mznTable
        [columns]="columns"
        [dataSource]="[]"
        [loading]="true"
        emptyText="Loading..."
      ></div>
    `,
  }),
};

export const EmptyState: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      emptyProps: {
        title: 'No data available',
        description: 'There is no data to display in the table.',
        type: 'result',
        height: 444,
      } satisfies TableEmptyProps,
    },
    template: `
      <div mznTable
        [columns]="columns"
        [dataSource]="[]"
        [emptyProps]="emptyProps"
      ></div>
    `,
  }),
};

/**
 * Placeholder story for virtualized scrolling (React `scroll.virtualized: true`).
 *
 * Status: **In Development (Phase 6)**. Angular port will integrate
 * `@angular/cdk/scrolling` `CdkVirtualScrollViewport` to match the
 * React API. Currently the scroll input still supports a plain
 * `scroll.y` max-height and falls back to normal DOM rendering for
 * all rows; passing `{ virtualized: true }` is a no-op.
 */
export const VirtualScrollingInDevelopment: Story = {
  name: 'Virtual Scrolling (In Development)',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: Array.from({ length: 100 }, (_, i) => ({
        key: String(i + 1),
        name: `User ${i + 1}`,
        age: 20 + (i % 40),
        email: `user${i + 1}@example.com`,
      })),
    },
    template: `
      <div style="
        background: var(--mzn-color-warning-50, #fff7e6);
        border: 1px solid var(--mzn-color-warning-30, #ffd591);
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 16px;
        color: var(--mzn-color-text-primary, #1f1f1f);
      ">
        <strong>🚧 In Development — Phase 6</strong>
        <p style="margin: 8px 0 0;">
          React 的 <code>scroll.virtualized: true</code> 模式在 Angular 版尚未
          實作。未來會透過 <code>@angular/cdk/scrolling</code> 的
          <code>CdkVirtualScrollViewport</code> 補齊，保持 API 對齊。
          目前以 <code>scroll.y</code> fixed-height container 作為近似
          fallback，所有列仍全量渲染至 DOM。
        </p>
      </div>
      <div mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [scroll]="{ y: 400 }"
      ></div>
    `,
  }),
};

@Component({
  selector: 'story-table-draggable',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <p style="margin: 0 0 16px;">Drag rows to reorder them</p>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource()"
        [draggable]="draggableConfig"
      ></div>
    </div>
  `,
})
class DraggableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = signal<TableDataSource[]>([...basicData]);

  readonly draggableConfig: TableDraggable = {
    enabled: true,
    onDragEnd: (newData: readonly TableDataSource[]): void => {
      this.dataSource.set([...newData]);
    },
  };
}

export const DraggableRows: Story = {
  name: 'Draggable Rows',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [DraggableRowsStoryComponent] })],
  render: () => ({
    template: `<story-table-draggable />`,
  }),
};

@Component({
  selector: 'story-table-draggable-refetch',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <p style="margin: 0 0 8px;">
        Simulates a refetch while data rows are still rendered inside Draggable.
        Click the button to trigger loading.
      </p>
      <button
        (click)="simulateRefetch()"
        style="margin-bottom: 16px; padding: 4px 12px; cursor: pointer;"
      >
        Simulate Refetch
      </button>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource()"
        [draggable]="draggableConfig"
        [loading]="loading()"
      ></div>
    </div>
  `,
})
class DraggableRowsWithRefetchStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = signal<TableDataSource[]>([...basicData]);
  readonly loading = signal(false);

  readonly draggableConfig: TableDraggable = {
    enabled: true,
    onDragEnd: (newData: readonly TableDataSource[]): void => {
      this.dataSource.set([...newData]);
    },
  };

  simulateRefetch(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1500);
  }
}

export const DraggableRowsWithRefetch: Story = {
  name: 'Draggable Rows With Refetch',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [DraggableRowsWithRefetchStoryComponent] }),
  ],
  render: () => ({
    template: `<story-table-draggable-refetch />`,
  }),
};

@Component({
  selector: 'story-table-pinnable',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <p style="margin: 0 0 16px;">Click the pin icon to pin/unpin rows.</p>
      <p style="margin: 0 0 16px;"
        >Pinned rows: [{{ pinnedRowKeys().join(', ') }}]</p
      >
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [pinnable]="pinnableConfig()"
      ></div>
    </div>
  `,
})
class PinnableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly pinnedRowKeys = signal<readonly string[]>([]);

  readonly pinnableConfig = computed(
    (): TablePinnable => ({
      enabled: true,
      pinnedRowKeys: [...this.pinnedRowKeys()],
      onPinChange: (record: TableDataSource, pinned: boolean): void => {
        const key = String(record['key'] ?? record['id']);

        if (pinned) {
          this.pinnedRowKeys.update((prev) => [...prev, key]);
        } else {
          this.pinnedRowKeys.update((prev) => prev.filter((k) => k !== key));
        }
      },
    }),
  );
}

export const PinnableRows: Story = {
  name: 'Pinnable Rows',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [PinnableRowsStoryComponent] })],
  render: () => ({
    template: `<story-table-pinnable />`,
  }),
};

@Component({
  selector: 'story-table-toggleable',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <p style="margin: 0 0 16px;"
        >Use the toggle to enable/disable rows. Rows with age &gt; 40 are
        disabled.</p
      >
      <p style="margin: 0 0 16px;"
        >Toggled rows: [{{ toggledRowKeys().join(', ') }}]</p
      >
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [toggleable]="toggleableConfig()"
      ></div>
    </div>
  `,
})
class ToggleableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly toggledRowKeys = signal<readonly string[]>(['1', '3']);

  readonly toggleableConfig = computed(
    (): TableToggleable => ({
      enabled: true,
      title: 'Active',
      toggledRowKeys: [...this.toggledRowKeys()],
      isRowDisabled: (record: TableDataSource): boolean =>
        (record['age'] as number) > 40,
      onToggleChange: (record: TableDataSource, toggled: boolean): void => {
        const key = String(record['key'] ?? record['id']);

        if (toggled) {
          this.toggledRowKeys.update((prev) => [...prev, key]);
        } else {
          this.toggledRowKeys.update((prev) => prev.filter((k) => k !== key));
        }
      },
    }),
  );
}

export const ToggleableRows: Story = {
  name: 'Toggleable Rows',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [ToggleableRowsStoryComponent] })],
  render: () => ({
    template: `<story-table-toggleable />`,
  }),
};

@Component({
  selector: 'story-table-collectable',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <p style="margin: 0 0 16px;"
        >Click the star icon to add/remove rows from favorites. Rows with age
        &lt; 25 are disabled.</p
      >
      <p style="margin: 0 0 16px;"
        >Collected rows: [{{ collectedRowKeys().join(', ') }}]</p
      >
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [collectable]="collectableConfig()"
      ></div>
    </div>
  `,
})
class CollectableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly collectedRowKeys = signal<readonly string[]>(['2']);

  readonly collectableConfig = computed(
    (): TableCollectable => ({
      enabled: true,
      title: 'Favorite',
      collectedRowKeys: [...this.collectedRowKeys()],
      isRowDisabled: (record: TableDataSource): boolean =>
        (record['age'] as number) < 25,
      onCollectChange: (record: TableDataSource, collected: boolean): void => {
        const key = String(record['key'] ?? record['id']);

        if (collected) {
          this.collectedRowKeys.update((prev) => [...prev, key]);
        } else {
          this.collectedRowKeys.update((prev) => prev.filter((k) => k !== key));
        }
      },
    }),
  );
}

export const CollectableRows: Story = {
  name: 'Collectable Rows',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [CollectableRowsStoryComponent] })],
  render: () => ({
    template: `<story-table-collectable />`,
  }),
};

export const RowState: Story = {
  name: 'Row State',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      columns: basicColumns,
      dataSource: basicData,
      rowState: (
        record: TableDataSource,
      ): 'added' | 'deleted' | 'disabled' | undefined => {
        const age = record['age'] as number;

        if (age >= 42) return 'deleted';
        if (age >= 33) return 'disabled';
        if (age < 25) return 'added';

        return undefined;
      },
    },
    template: `
      <div>
        <div style="display: flex; gap: 16px; margin-bottom: 16px; font-size: 13px;">
          <span>rowState: age &gt;= 42 deleted, age &gt;= 33 disabled, age &lt; 25 added</span>
        </div>
        <div mznTable
          [columns]="columns"
          [dataSource]="dataSource"
          [rowState]="rowState"
        ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-table-highlight',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        <label style="margin-right: 8px;">Select Highlight Mode:</label>
        <select [value]="mode()" (change)="mode.set($any($event.target).value)">
          <option value="row">Row</option>
          <option value="cell">Cell</option>
          <option value="cross">Cross</option>
          <option value="none">None</option>
        </select>
      </div>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [highlight]="mode()"
      ></div>
    </div>
  `,
})
class HighlightModeStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly mode = signal<HighlightModeType>('row');
}

export const HighlightMode: Story = {
  name: 'Highlight Mode',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [HighlightModeStoryComponent] })],
  render: () => ({
    template: `<story-table-highlight />`,
  }),
};

@Component({
  selector: 'story-table-combined',
  standalone: true,
  imports: [MznTable],
  template: `
    <div style="width: 100%;">
      <div
        style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 16px;"
      >
        <span>Selected: [{{ selectedKeys().join(', ') }}]</span>
        <span>Toggled rows: [{{ toggledRowKeys().join(', ') }}]</span>
        <span>Collected rows: [{{ collectedRowKeys().join(', ') }}]</span>
      </div>
      <div
        mznTable
        [actions]="actionsConfig"
        [collectable]="collectableConfig()"
        [columns]="columns"
        [dataSource]="dataSource()"
        [draggable]="draggableConfig"
        [expandable]="true"
        [fullWidth]="true"
        highlight="cross"
        [resizable]="true"
        [rowSelection]="checkboxSelection()"
        [toggleable]="toggleableConfig()"
        [zebraStriping]="true"
      ></div>
    </div>
  `,
})
class CombinedStoryComponent {
  readonly columns: TableColumn[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      width: 200,
      minWidth: 100,
    },
    {
      key: 'age',
      title: 'Age',
      dataIndex: 'age',
      width: 100,
      minWidth: 60,
      align: 'center',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      width: 300,
      minWidth: 150,
    },
  ];

  readonly dataSource = signal<TableDataSource[]>([...basicData]);
  readonly selectedKeys = signal<readonly string[]>([]);
  readonly toggledRowKeys = signal<readonly string[]>(['1', '3']);
  readonly collectedRowKeys = signal<readonly string[]>(['2']);

  readonly checkboxSelection = computed(
    (): TableRowSelectionCheckbox => ({
      mode: 'checkbox',
      selectedRowKeys: this.selectedKeys(),
      onChange: (keys: readonly string[]): void => {
        this.selectedKeys.set(keys);
      },
    }),
  );

  readonly draggableConfig: TableDraggable = {
    enabled: true,
    onDragEnd: (newData: readonly TableDataSource[]): void => {
      this.dataSource.set([...newData]);
    },
  };

  readonly toggleableConfig = computed(
    (): TableToggleable => ({
      enabled: true,
      title: 'Active',
      toggledRowKeys: [...this.toggledRowKeys()],
      isRowDisabled: (record: TableDataSource): boolean =>
        (record['age'] as number) > 40,
      onToggleChange: (record: TableDataSource, toggled: boolean): void => {
        const key = String(record['key'] ?? record['id']);

        if (toggled) {
          this.toggledRowKeys.update((prev) => [...prev, key]);
        } else {
          this.toggledRowKeys.update((prev) => prev.filter((k) => k !== key));
        }
      },
    }),
  );

  readonly collectableConfig = computed(
    (): TableCollectable => ({
      enabled: true,
      title: 'Favorite',
      collectedRowKeys: [...this.collectedRowKeys()],
      isRowDisabled: (record: TableDataSource): boolean =>
        (record['age'] as number) < 25,
      onCollectChange: (record: TableDataSource, collected: boolean): void => {
        const key = String(record['key'] ?? record['id']);

        if (collected) {
          this.collectedRowKeys.update((prev) => [...prev, key]);
        } else {
          this.collectedRowKeys.update((prev) => prev.filter((k) => k !== key));
        }
      },
    }),
  );

  readonly actionsConfig: TableActions = {
    title: 'Actions',
    width: 180,
    align: 'end',
    render: (_record: TableDataSource, _index: number) => [
      { key: 'edit', label: 'Edit', onClick: (): void => {} },
      { key: 'delete', label: 'Delete', danger: true, onClick: (): void => {} },
    ],
  };
}

export const Combined: Story = {
  name: 'Combined',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [CombinedStoryComponent] })],
  render: () => ({
    template: `<story-table-combined />`,
  }),
};
