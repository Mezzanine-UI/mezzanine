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
  EditIcon,
  FolderMoveIcon,
  TrashIcon,
  UserIcon,
} from '@mezzanine-ui/icons';
import { MznButton } from '@mezzanine-ui/ng/button';
import {
  MznDescription,
  MznDescriptionContent,
  MznDescriptionGroup,
} from '@mezzanine-ui/ng/description';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznSlider } from '@mezzanine-ui/ng/slider';
import { MznTag } from '@mezzanine-ui/ng/tag';
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

interface FixedColumnsRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
}

@Component({
  selector: 'story-table-fixed-columns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznTypography],
  template: `
    <div
      style="width: 100%; display: flex; flex-flow: column; align-items: flex-start; gap: 12px;"
    >
      <span
        >Fixed Columns: "Name (start)", "Fixed Age (start)", "Fixed Address
        (end)", "Action (end)"</span
      >
      <div style="width: 100%;">
        <div
          mznTable
          [actions]="actions"
          [columns]="fixedColumns"
          [dataSource]="dataSource"
          [fullWidth]="true"
        >
          <ng-template mznTableCellRender="age" let-record>
            <span mznTypography variant="body-mono">{{ record.age }}</span>
          </ng-template>
          <ng-template mznTableCellRender="age2" let-record>
            <span mznTypography variant="body-mono">{{ record.age }}</span>
          </ng-template>
        </div>
      </div>
    </div>
  `,
})
class WithFixedColumnsStoryComponent {
  readonly dataSource: readonly FixedColumnsRowType[] = [
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

  readonly fixedColumns: TableColumn[] = [
    {
      dataIndex: 'name',
      fixed: 'start',
      key: 'name',
      title: 'Name',
      width: 120,
    },
    { key: 'age', title: 'Age', width: 140 },
    { key: 'age2', title: 'Fixed Age', fixed: 'start', width: 120 },
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
      fixed: 'end',
      width: 200,
    },
    {
      dataIndex: 'address',
      key: 'address3',
      title: 'Address 3',
      width: 250,
    },
  ];

  readonly actions: TableActions = {
    fixed: 'end',
    title: 'Action',
    width: 100,
    variant: 'base-text-link',
    render: () => [
      {
        key: 'edit',
        label: 'Edit',
        onClick: (): void => {},
      },
    ],
  };
}

export const WithFixedColumns: Story = {
  name: 'With Fixed Columns',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithFixedColumnsStoryComponent] })],
  render: () => ({
    template: `<story-table-fixed-columns />`,
  }),
};

interface ResizableRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
  readonly tags: readonly string[];
}

@Component({
  selector: 'story-table-resizable-columns',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznTypography],
  template: `
    <div style="width: 100%; display: flex; flex-flow: column; gap: 12px;">
      <span style="white-space: pre-line;">{{ legendText }}</span>
      <div
        mznTable
        [columns]="resizableColumns"
        [dataSource]="dataSource"
        [resizable]="true"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
        <ng-template mznTableCellRender="tags" let-record>{{
          (record.tags ?? []).join(', ')
        }}</ng-template>
      </div>
    </div>
  `,
})
class WithResizableColumnsStoryComponent {
  readonly legendText =
    'Column 1: minWidth: 120, maxWidth: 220;\n' +
    '          Column 2: minWidth: 80;\n' +
    '          Column 3: width 200 minWidth: 140;\n' +
    '          Column 4: minWidth: 220;';

  readonly dataSource: readonly ResizableRowType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 35,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '4',
      name: 'Jane Doe',
      age: 30,
      address: 'Tokyo No. 1 Lake Park',
      tags: ['developer'],
    },
    {
      key: '5',
      name: 'Jack Smith',
      age: 21,
      address: 'Paris No. 1 Lake Park',
      tags: ['nice', 'cool'],
    },
    {
      key: '6',
      name: 'Emily Davis',
      age: 45,
      address: 'Berlin No. 1 Lake Park',
      tags: ['loser', 'teacher'],
    },
    {
      key: '7',
      name: 'Michael Johnson',
      age: 38,
      address: 'Madrid No. 1 Lake Park',
      tags: ['developer', 'teacher'],
    },
    {
      key: '8',
      name: 'Sarah Wilson',
      age: 29,
      address: 'Rome No. 1 Lake Park',
      tags: ['nice'],
    },
    {
      key: '9',
      name: 'David Brown',
      age: 33,
      address: 'Dublin No. 1 Lake Park',
      tags: ['cool', 'developer'],
    },
  ];

  readonly resizableColumns: TableColumn[] = [
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Name',
      minWidth: 120,
      maxWidth: 220,
    },
    { key: 'age', title: 'Age', minWidth: 80 },
    {
      key: 'tags',
      dataIndex: 'tags',
      title: 'Tags',
      width: 200,
      minWidth: 140,
    },
    {
      key: 'address',
      dataIndex: 'address',
      title: 'Address',
      minWidth: 220,
    },
  ];
}

export const WithResizableColumns: Story = {
  name: 'With Resizable Columns',
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithResizableColumnsStoryComponent] }),
  ],
  render: () => ({
    template: `<story-table-resizable-columns />`,
  }),
};

interface CustomRenderRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
  readonly tags: readonly string[];
}

@Component({
  selector: 'story-table-custom-render',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznIcon, MznTag, MznTypography],
  template: `
    <div mznTable [columns]="customColumns" [dataSource]="dataSource">
      <ng-template mznTableCellRender="name" let-record>
        <div
          style="display: flex; flex-flow: row; align-items: center; gap: 4px;"
        >
          <i mznIcon [icon]="userIcon" [size]="24"></i>
          <span>{{ record.name }}</span>
        </div>
      </ng-template>
      <ng-template mznTableCellRender="age" let-record>
        <span mznTypography variant="body-mono">{{ record.age }}</span>
      </ng-template>
      <ng-template mznTableCellRender="tags" let-record>
        <div style="display: flex; gap: 4px;">
          @for (tag of record.tags ?? []; track tag) {
            <span mznTag [label]="tag" size="sub"></span>
          }
        </div>
      </ng-template>
    </div>
  `,
})
class WithCustomRenderStoryComponent {
  readonly userIcon = UserIcon;

  readonly dataSource: readonly CustomRenderRowType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 35,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
    {
      key: '4',
      name: 'Jane Doe',
      age: 30,
      address: 'Tokyo No. 1 Lake Park',
      tags: ['developer'],
    },
    {
      key: '5',
      name: 'Jack Smith',
      age: 21,
      address: 'Paris No. 1 Lake Park',
      tags: ['nice', 'cool'],
    },
    {
      key: '6',
      name: 'Emily Davis',
      age: 45,
      address: 'Berlin No. 1 Lake Park',
      tags: ['loser', 'teacher'],
    },
    {
      key: '7',
      name: 'Michael Johnson',
      age: 38,
      address: 'Madrid No. 1 Lake Park',
      tags: ['developer', 'teacher'],
    },
    {
      key: '8',
      name: 'Sarah Wilson',
      age: 29,
      address: 'Rome No. 1 Lake Park',
      tags: ['nice'],
    },
    {
      key: '9',
      name: 'David Brown',
      age: 33,
      address: 'Dublin No. 1 Lake Park',
      tags: ['cool', 'developer'],
    },
  ];

  readonly customColumns: TableColumn[] = [
    { key: 'name', title: 'Name', width: 150 },
    { key: 'age', title: 'Age', width: 100 },
    { key: 'tags', title: 'Tags', width: 200 },
    {
      key: 'address',
      dataIndex: 'address',
      ellipsis: true,
      title: 'Address',
      width: 150,
    },
  ];
}

export const WithCustomRender: Story = {
  name: 'With Custom Render',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithCustomRenderStoryComponent] })],
  render: () => ({
    template: `<story-table-custom-render />`,
  }),
};

@Component({
  selector: 'story-table-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MznSlider, MznTable],
  template: `
    <div style="display: grid; grid-auto-columns: row; gap: 36px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <span>props.loadingRowsCount: </span>
        <div style="width: 260px;">
          <div
            mznSlider
            [(ngModel)]="loadingRowsCount"
            [min]="1"
            [max]="10"
            [step]="1"
          ></div>
        </div>
      </div>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="emptyDataSource"
        [loading]="true"
        [loadingRowsCount]="loadingRowsCount"
      ></div>
    </div>
  `,
})
class LoadingStoryComponent {
  readonly columns: TableColumn[] = basicColumns;

  readonly emptyDataSource: readonly TableDataSource[] = [];

  loadingRowsCount = 10;
}

export const Loading: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [LoadingStoryComponent] })],
  render: () => ({
    template: `<story-table-loading />`,
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
        [scroll]="scroll"
      ></div>
    </div>
  `,
})
class DraggableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = signal<TableDataSource[]>([...basicData]);

  readonly scroll = { y: 300 };

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
  imports: [MznButton, MznTable],
  template: `
    <div>
      <p style="margin: 0 0 8px;">
        Simulates a refetch while data rows are still rendered inside Draggable.
        Click the button to trigger loading — drag handles should remain
        functional without dnd errors.
      </p>
      <button
        mznButton
        type="button"
        variant="base-primary"
        style="margin-bottom: 16px;"
        (click)="simulateRefetch()"
      >
        Simulate Refetch
      </button>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource()"
        [draggable]="draggableConfig"
        [loading]="loading()"
        [scroll]="scroll"
      ></div>
    </div>
  `,
})
class DraggableRowsWithRefetchStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = signal<TableDataSource[]>([...basicData]);
  readonly loading = signal(false);
  readonly scroll = { y: 300 };

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
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [pinnable]="pinnableConfig()"
        [scroll]="scroll"
      ></div>
    </div>
  `,
})
class PinnableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly pinnedRowKeys = signal<readonly string[]>([]);
  readonly scroll = { y: 300 };

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
        [scroll]="scroll"
      ></div>
    </div>
  `,
})
class CollectableRowsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly collectedRowKeys = signal<readonly string[]>(['2']);
  readonly scroll = { y: 300 };

  readonly collectableConfig = computed(
    (): TableCollectable => ({
      enabled: true,
      title: 'Favorite',
      minWidth: 120,
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

@Component({
  selector: 'story-table-row-state',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <div
        style="display: flex; gap: 16px; margin-bottom: 16px; font-size: 13px;"
      >
        <span>props.rowState for customizing row background color</span>
      </div>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [rowState]="rowState"
      ></div>
    </div>
  `,
})
class RowStateStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;

  readonly rowState = (
    record: TableDataSource,
  ): 'added' | 'deleted' | 'disabled' | undefined => {
    const age = record['age'] as number;

    if (age >= 42) return 'deleted';
    if (age >= 33) return 'disabled';
    if (age < 25) return 'added';

    return undefined;
  };
}

export const RowState: Story = {
  name: 'Row State',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [RowStateStoryComponent] })],
  render: () => ({
    template: `<story-table-row-state />`,
  }),
};

@Component({
  selector: 'story-table-highlight',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <div style="margin-bottom: 16px;">
        <label for="highlight-mode-select" style="margin-right: 8px;"
          >Select Highlight Mode:</label
        >
        <select
          id="highlight-mode-select"
          [value]="mode()"
          (change)="mode.set($any($event.target).value)"
        >
          <option value="row">Row</option>
          <option value="cell">Cell</option>
          <option value="column">Column</option>
          <option value="cross">Cross</option>
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

interface CombinedRowType extends TableDataSource {
  readonly key: string;
  readonly name: string;
  readonly age: number;
  readonly address: string;
  readonly tags: readonly string[];
  readonly subData?: readonly CombinedRowType[];
}

const combinedBaseData: readonly CombinedRowType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
    subData: [
      {
        key: '1-1',
        name: 'Sub John Brown',
        age: 10,
        address: 'Sub New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '1-2',
        name: 'Sub Jim Green',
        age: 12,
        address: 'Sub New York No. 2 Lake Park',
        tags: ['nice', 'developer'],
      },
    ],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 35,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
    subData: [
      {
        key: '3-1',
        name: 'Sub John Brown',
        age: 10,
        address: 'Sub New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '3-2',
        name: 'Sub Jim Green',
        age: 12,
        address: 'Sub New York No. 2 Lake Park',
        tags: ['nice', 'developer'],
      },
    ],
  },
  {
    key: '4',
    name: 'Jane Doe',
    age: 30,
    address: 'Tokyo No. 1 Lake Park',
    tags: ['developer'],
  },
  {
    key: '5',
    name: 'Jack Smith',
    age: 21,
    address: 'Paris No. 1 Lake Park',
    tags: ['nice', 'cool'],
  },
  {
    key: '6',
    name: 'Emily Davis',
    age: 45,
    address: 'Berlin No. 1 Lake Park',
    tags: ['loser', 'teacher'],
  },
  {
    key: '7',
    name: 'Michael Johnson',
    age: 38,
    address: 'Madrid No. 1 Lake Park',
    tags: ['developer', 'teacher'],
  },
  {
    key: '8',
    name: 'Sarah Wilson',
    age: 29,
    address: 'Rome No. 1 Lake Park',
    tags: ['nice'],
  },
  {
    key: '9',
    name: 'David Brown',
    age: 33,
    address: 'Dublin No. 1 Lake Park',
    tags: ['cool', 'developer'],
  },
];

@Component({
  selector: 'story-table-combined',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTable, MznTableCellRender, MznTag, MznTypography],
  template: `
    <ng-template #expandedTpl let-record>
      <!--
        React's TableExpandedRow cloneElements any nested Table with
        nested=true + showHeader=false automatically; Angular has no
        runtime child-component injection, so we set the flags
        explicitly here.
      -->
      <div
        mznTable
        [columns]="combinedColumns()"
        [dataSource]="record.subData ?? []"
        [nested]="true"
        [rowSelection]="getChildSelection(record)"
        [showHeader]="false"
      >
        <ng-template mznTableCellRender="age" let-row>
          <span mznTypography variant="body-mono">{{ row.age }}</span>
        </ng-template>
        <ng-template mznTableCellRender="tags" let-row>
          <div style="display: flex; gap: 4px;">
            @for (tag of row.tags ?? []; track tag) {
              <span mznTag [label]="tag" size="sub"></span>
            }
          </div>
        </ng-template>
      </div>
    </ng-template>

    <div style="width: 100%;">
      <div
        style="display: flex; flex-flow: column; gap: 4px; margin-bottom: 16px;"
      >
        <span>Selected: {{ totalSelectionCount() }} items</span>
        <span>Toggled rows: [{{ toggledRowKeys().join(', ') }}]</span>
        <span>Collected rows: [{{ collectedRowKeys().join(', ') }}]</span>
      </div>
      <div
        mznTable
        [actions]="actionsConfig"
        [collectable]="collectableConfig()"
        [columns]="combinedColumns()"
        [dataSource]="ds.dataSource()"
        [draggable]="draggableConfig"
        [expandable]="expandableConfig()"
        [fullWidth]="true"
        highlight="cross"
        [resizable]="true"
        [rowSelection]="parentSelection()"
        [scroll]="scroll"
        [toggleable]="toggleableConfig()"
        [transitionState]="ds.transitionState()"
      >
        <ng-template mznTableCellRender="age" let-record>
          <span mznTypography variant="body-mono">{{ record.age }}</span>
        </ng-template>
        <ng-template mznTableCellRender="tags" let-record>
          <div style="display: flex; gap: 4px;">
            @for (tag of record.tags ?? []; track tag) {
              <span mznTag [label]="tag" size="sub"></span>
            }
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
class CombinedStoryComponent {
  readonly scroll = { y: 300 };

  /**
   * Parent + child selection entries mirroring React
   * `useTableRowSelection`. Each entry carries the parent row `key` plus
   * optional `subKeys` (the child rows the user has checked). Derived
   * signals compute `parentSelectedKeys` (for the outer checkbox list)
   * and `totalSelectionCount` (parent + all tracked child rows).
   */
  private readonly selectedEntries = signal<
    readonly { key: string; subKeys?: readonly string[] }[]
  >([]);

  readonly parentSelectedKeys = computed((): readonly string[] =>
    this.selectedEntries().map((entry) => entry.key),
  );

  readonly totalSelectionCount = computed((): number =>
    this.selectedEntries().reduce(
      (acc, entry) => acc + (entry.subKeys?.length ?? 0) + 1,
      0,
    ),
  );

  readonly toggledRowKeys = signal<readonly string[]>(['1', '3']);
  readonly collectedRowKeys = signal<readonly string[]>(['2']);

  private readonly sortOrderState = signal<{
    key: string;
    sortOrder: SortOrderType;
  } | null>({ key: 'name', sortOrder: 'ascend' });

  private readonly expandedTpl =
    viewChild.required<TemplateRef<{ $implicit: CombinedRowType }>>(
      'expandedTpl',
    );

  // eslint-disable-next-line react-hooks/rules-of-hooks -- Angular factory, not React hook
  readonly ds = useTableDataSource<CombinedRowType>({
    initialData: combinedBaseData,
    highlightDuration: 1000,
    fadeOutDuration: 200,
  });

  readonly combinedColumns = computed((): TableColumn[] => {
    const sort = this.sortOrderState();

    return [
      {
        key: 'name',
        dataIndex: 'name',
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
        fixed: 'start',
        width: 150,
        minWidth: 100,
        maxWidth: 300,
      },
      {
        key: 'age',
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
        sortOrder: sort?.key === 'age' ? sort.sortOrder : undefined,
        onSort: (key: string, order: SortOrderType): void => {
          this.sortOrderState.set({ key, sortOrder: order });

          if (order) {
            const sorted = [...this.ds.dataSource()].sort((a, b) => {
              const diff = a.age - b.age;

              return order === 'ascend' ? diff : -diff;
            });

            this.ds.updateDataSource(sorted);
          } else {
            this.ds.updateDataSource(combinedBaseData);
          }
        },
      },
      {
        key: 'address',
        dataIndex: 'address',
        title: 'Address',
        width: 250,
        minWidth: 200,
        maxWidth: 400,
      },
      {
        key: 'address2',
        dataIndex: 'address',
        title: 'Address',
        width: 600,
        minWidth: 400,
        maxWidth: 800,
      },
      {
        key: 'tags',
        title: 'Tags',
        width: 200,
        minWidth: 120,
        maxWidth: 300,
      },
    ];
  });

  /**
   * Row actions — mirrors React `TableActionItemButton` + `TableActionItemDropdown`.
   * Edit fires `onClick`; the dropdown trigger opens a menu with
   * Copy / Download / Delete, and routes selection through `onSelect`.
   */
  readonly actionsConfig: TableActions = {
    variant: 'base-primary',
    width: 220,
    minWidth: 220,
    render: (record) => [
      { key: 'edit', label: 'Edit', icon: EditIcon, onClick: () => {} },
      {
        key: 'more',
        type: 'dropdown',
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
            validate: 'danger',
          },
        ],
        onSelect: (option) => {
          if (option.id === 'Delete') {
            this.handleDelete(record as CombinedRowType);
          }
        },
      },
    ],
  };

  private handleDelete(record: CombinedRowType): void {
    const data = this.ds.dataSource();
    const isFirstLayer = data.some((item) => item.key === record.key);

    if (isFirstLayer) {
      this.ds.updateDataSource(
        data.filter((item) => item.key !== record.key),
        { removedKeys: [record.key] },
      );

      return;
    }

    const target = data.find((item) =>
      item.subData?.some((sub) => sub.key === record.key),
    );

    if (!target?.subData) return;

    const newSubData = target.subData.filter((sub) => sub.key !== record.key);
    const newDataSource = data.map((item) =>
      item.key === target.key ? { ...item, subData: newSubData } : item,
    );

    this.ds.updateDataSource(newDataSource, { removedKeys: [record.key] });
  }

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

  readonly toggleableConfig = computed(
    (): TableToggleable => ({
      enabled: true,
      fixed: true,
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

  readonly draggableConfig: TableDraggable = {
    enabled: true,
    onDragEnd: (newData: readonly TableDataSource[]): void => {
      this.ds.updateDataSource(newData as readonly CombinedRowType[]);
    },
  };

  readonly expandableConfig = computed(
    (): TableExpandable => ({
      template: this.expandedTpl() as TemplateRef<{
        $implicit: TableDataSource;
      }>,
      rowExpandable: (record: TableDataSource): boolean =>
        !!(record as CombinedRowType).subData?.length,
    }),
  );

  readonly parentSelection = computed(
    (): TableRowSelectionCheckbox => ({
      mode: 'checkbox',
      fixed: true,
      selectedRowKeys: this.parentSelectedKeys(),
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
        renderSelectionSummary: (): string =>
          `${this.totalSelectionCount()} items selected`,
      },
      onChange: (
        _keys: readonly string[],
        selectedRow: TableDataSource | null,
        selectedRows: readonly TableDataSource[],
      ): void => {
        // Mirror React `useTableRowSelection.parentOnChange`:
        // preserve `subKeys` for rows not touched by this change, and
        // refresh `subKeys` for the row just toggled / for select-all.
        const current = this.selectedEntries();
        const selectedRowKey = selectedRow
          ? String((selectedRow as CombinedRowType).key)
          : null;

        const next = selectedRows.map((row) => {
          const record = row as CombinedRowType;
          const pk = record.key;
          const isCurrentSelectedRow =
            selectedRowKey !== null && selectedRowKey === pk;
          const subData = record.subData;

          const subKeys = ((): readonly string[] | undefined => {
            if (isCurrentSelectedRow) {
              return subData?.length
                ? subData.map((sub) => sub.key)
                : undefined;
            }

            if (selectedRow === null) {
              // toggleAll: refresh every row's subKeys
              return subData?.length
                ? subData.map((sub) => sub.key)
                : undefined;
            }

            return current.find((entry) => entry.key === pk)?.subKeys;
          })();

          return { key: pk, subKeys };
        });

        this.selectedEntries.set(next);
      },
    }),
  );

  protected getChildSelection(
    parentRecord: CombinedRowType,
  ): TableRowSelectionCheckbox {
    const entry = this.selectedEntries().find(
      (e) => e.key === parentRecord.key,
    );

    return {
      mode: 'checkbox',
      fixed: true,
      selectedRowKeys: entry?.subKeys ?? [],
      onChange: (keys: readonly string[]): void => {
        this.selectedEntries.update((prev) => {
          const others = prev.filter((e) => e.key !== parentRecord.key);

          if (keys.length === 0) return others;

          return [...others, { key: parentRecord.key, subKeys: [...keys] }];
        });
      },
    };
  }
}

export const Combined: Story = {
  name: 'Combined',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [CombinedStoryComponent] })],
  render: () => ({
    template: `<story-table-combined />`,
  }),
};
