import { Component, computed, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTable } from './table.component';
import type {
  HighlightMode as HighlightModeType,
  RowHeightPreset as RowHeightPresetType,
  TableActions,
  TableCollectable,
  TableColumn,
  TableDataSource,
  TableDraggable,
  TableEmptyProps,
  TablePinnable,
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
  TableSize,
  TableToggleable,
} from './table-types';

const basicColumns: TableColumn[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', width: 200 },
  { key: 'age', title: 'Age', dataIndex: 'age', width: 100, align: 'center' },
  { key: 'email', title: 'Email', dataIndex: 'email' },
];

const basicData: TableDataSource[] = [
  { key: '1', name: 'John Brown', age: 32, email: 'john@example.com' },
  { key: '2', name: 'Jim Green', age: 42, email: 'jim@example.com' },
  { key: '3', name: 'Joe Black', age: 35, email: 'joe@example.com' },
  { key: '4', name: 'Jane Doe', age: 30, email: 'jane@example.com' },
  { key: '5', name: 'Jack Smith', age: 21, email: 'jack@example.com' },
  { key: '6', name: 'Emily Davis', age: 45, email: 'emily@example.com' },
  { key: '7', name: 'Michael Johnson', age: 38, email: 'michael@example.com' },
  { key: '8', name: 'Sarah Wilson', age: 29, email: 'sarah@example.com' },
  { key: '9', name: 'David Brown', age: 33, email: 'david@example.com' },
];

export default {
  title: 'Data Display/Table',
  decorators: [
    moduleMetadata({
      imports: [MznTable],
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
      <div mznTable [columns]="columns" [dataSource]="dataSource" ></div>
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
      ></div>
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

@Component({
  selector: 'story-table-create-delete',
  standalone: true,
  imports: [MznTable],
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div
        style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;"
      >
        <input
          #nameInput
          type="text"
          placeholder="Name"
          style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
        <input
          #ageInput
          type="number"
          placeholder="Age"
          style="padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; width: 80px;"
        />
        <button
          (click)="
            addRow(nameInput.value, ageInput.value);
            nameInput.value = '';
            ageInput.value = ''
          "
          style="padding: 4px 12px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Add Row
        </button>
      </div>
      <div mznTable [columns]="columns" [dataSource]="dataSource()"></div>
    </div>
  `,
})
class CreateDeleteTransitionStoryComponent {
  readonly columns: TableColumn[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 200 },
    { key: 'age', title: 'Age', dataIndex: 'age', width: 100, align: 'center' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
  ];

  readonly dataSource = signal<TableDataSource[]>([...basicData]);

  addRow(name: string, age: string): void {
    if (!name.trim()) return;
    this.dataSource.update((prev) => [
      {
        key: String(Date.now()),
        name,
        age: parseInt(age, 10) || 0,
        email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
      },
      ...prev,
    ]);
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

export const CreateDeleteTransitionWithExpansion: Story = {
  name: 'Create/Delete Transition With Expansion',
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
        [expandable]="true"
      ></div>
    `,
  }),
};

export const WithSorting: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const columns: TableColumn[] = [
      {
        key: 'name',
        title: 'Name',
        dataIndex: 'name',
        width: 200,
        sortOrder: null,
      },
      {
        key: 'age',
        title: 'Age',
        dataIndex: 'age',
        width: 100,
        align: 'center',
        sortOrder: 'ascend',
      },
      { key: 'email', title: 'Email', dataIndex: 'email' },
    ];

    return {
      props: {
        columns,
        dataSource: basicData,
      },
      template: `
        <div mznTable
          [columns]="columns"
          [dataSource]="dataSource"
        ></div>
      `,
    };
  },
};

@Component({
  selector: 'story-table-row-selection',
  standalone: true,
  imports: [MznTable],
  template: `
    <div>
      <div
        style="margin: 0 0 16px; display: flex; flex-direction: column; gap: 4px;"
      >
        <span>Mode: checkbox</span>
        <span>Selected: [{{ selectedKeys().join(', ') }}]</span>
      </div>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [rowSelection]="checkboxSelection()"
      ></div>
      <div
        style="margin: 32px 0 16px; display: flex; flex-direction: column; gap: 4px;"
      >
        <span>Mode: radio</span>
        <span>Selected: {{ selectedRadioKey() }}</span>
      </div>
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource"
        [rowSelection]="radioSelection()"
      ></div>
    </div>
  `,
})
class WithRowSelectionStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = basicData;
  readonly selectedKeys = signal<readonly string[]>([]);
  readonly selectedRadioKey = signal<string | undefined>(undefined);

  readonly checkboxSelection = computed(
    (): TableRowSelectionCheckbox => ({
      mode: 'checkbox',
      selectedRowKeys: this.selectedKeys(),
      onChange: (keys: readonly string[]): void => {
        this.selectedKeys.set(keys);
      },
    }),
  );

  readonly radioSelection = computed(
    (): TableRowSelectionRadio => ({
      mode: 'radio',
      selectedRowKey: this.selectedRadioKey(),
      onChange: (key: string | undefined): void => {
        this.selectedRadioKey.set(key);
      },
    }),
  );
}

export const WithRowSelection: Story = {
  name: 'With Selection',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithRowSelectionStoryComponent] })],
  render: () => ({
    template: `<story-table-row-selection />`,
  }),
};

@Component({
  selector: 'story-table-bulk-actions',
  standalone: true,
  imports: [MznTable],
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px;">
      @if (selectedKeys().length > 0) {
        <div
          style="display: flex; align-items: center; gap: 16px; padding: 8px 16px;
                 background: #e3f2fd; border-radius: 4px;"
        >
          <span>{{ selectedKeys().length }} item(s) selected</span>
          <button
            (click)="deleteSelected()"
            style="padding: 4px 12px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            Delete
          </button>
          <button
            (click)="clearSelection()"
            style="padding: 4px 12px; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;"
          >
            Clear
          </button>
        </div>
      }
      <div
        mznTable
        [columns]="columns"
        [dataSource]="dataSource()"
        [rowSelection]="checkboxSelection()"
      ></div>
    </div>
  `,
})
class WithBulkActionsStoryComponent {
  readonly columns = basicColumns;
  readonly dataSource = signal<TableDataSource[]>([...basicData]);
  readonly selectedKeys = signal<readonly string[]>([]);

  readonly checkboxSelection = computed(
    (): TableRowSelectionCheckbox => ({
      mode: 'checkbox',
      selectedRowKeys: this.selectedKeys(),
      onChange: (keys: readonly string[]): void => {
        this.selectedKeys.set(keys);
      },
    }),
  );

  deleteSelected(): void {
    const keys = new Set(this.selectedKeys());
    this.dataSource.update((prev) =>
      prev.filter((r) => !keys.has(String(r['key']))),
    );
    this.selectedKeys.set([]);
  }

  clearSelection(): void {
    this.selectedKeys.set([]);
  }
}

export const WithBulkActions: Story = {
  name: 'With Bulk Actions',
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithBulkActionsStoryComponent] })],
  render: () => ({
    template: `<story-table-bulk-actions />`,
  }),
};

@Component({
  selector: 'story-table-pagination',
  standalone: true,
  imports: [MznTable],
  template: `
    <div
      mznTable
      [columns]="columns"
      [dataSource]="paginated()"
      [pagination]="paginationConfig()"
    ></div>
  `,
})
class WithPaginationStoryComponent {
  readonly columns = basicColumns;
  private readonly allData = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    name: `User ${i + 1}`,
    age: 20 + i,
    email: `user${i + 1}@example.com`,
  }));

  readonly pageSize = 5;
  readonly page = signal(1);

  readonly paginated = computed<TableDataSource[]>(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.allData.slice(start, start + this.pageSize);
  });

  readonly paginationConfig = computed(() => ({
    current: this.page(),
    pageSize: this.pageSize,
    total: this.allData.length,
    onChange: (p: number): void => {
      this.page.set(p);
    },
  }));
}

export const WithPagination: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithPaginationStoryComponent] })],
  render: () => ({
    template: `<story-table-pagination />`,
  }),
};

export const WithExpansion: Story = {
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
        [expandable]="true"
      ></div>
    `,
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

export const VirtualScrolling: Story = {
  name: 'Virtual Scrolling',
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
      <!-- NOTE: Virtual scrolling (virtualized mode) from React is not yet supported.
           Using scroll.y for a fixed-height scrollable container. -->
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
