import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Meta,
  StoryObj,
  moduleMetadata,
  applicationConfig,
} from '@storybook/angular';
import { SearchIcon } from '@mezzanine-ui/icons';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import {
  MznAutocomplete,
  MznAutocompletePrefix,
} from './autocomplete.component';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznTag } from '@mezzanine-ui/ng/tag';

export default {
  title: 'Data Entry/AutoComplete',
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      imports: [FormsModule, MznAutocomplete, MznAutocompletePrefix, MznIcon],
    }),
  ],
  argTypes: {
    active: {
      control: false,
      description: '是否處於 active 狀態。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    addable: {
      control: false,
      description:
        '是否啟用動態新增選項。需搭配 `onInsert` 或 `inserted` 使用。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    asyncData: {
      control: false,
      description:
        '非同步資料模式。啟用時，搜尋觸發後自動追蹤 loading 狀態，直到 `options` 變更時自動結束 loading。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    clearable: {
      control: false,
      description: '是否可清除已選值。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    clearSearchText: {
      control: false,
      description: '失焦後是否清除搜尋文字。`false` 時保留使用者輸入的文字。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Inputs',
      },
    },
    createActionText: {
      control: false,
      description:
        '建立動作按鈕的自訂文字函式。優先於 `createActionTextTemplate`。',
      table: {
        type: { summary: '(text: string) => string' },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    createActionTextTemplate: {
      control: false,
      description: '建立動作按鈕的文字模板，以 `{text}` 作為替換佔位符。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '\'建立 "{text}"\'' },
        category: 'Inputs',
      },
    },
    createSeparators: {
      control: false,
      description: '批次新增的分隔符號。',
      table: {
        type: { summary: 'ReadonlyArray<string>' },
        defaultValue: { summary: "[',', '+', '\\n']" },
        category: 'Inputs',
      },
    },
    disabled: {
      control: false,
      description: '是否禁用。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    disabledOptionsFilter: {
      control: false,
      description:
        '停用內建的 substring 過濾，改由消費者透過 `searchChange` 自行更新 `options`。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    dropdownZIndex: {
      control: false,
      description: '下拉選單的 z-index。',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    emptyText: {
      control: false,
      description: '無符合選項時顯示的文字。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'沒有符合的項目'" },
        category: 'Inputs',
      },
    },
    error: {
      control: false,
      description: '是否為錯誤狀態。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    inputPosition: {
      control: false,
      description:
        "搜尋輸入框的位置。`'outside'`：輸入框在 trigger 區域（預設）；`'inside'`：輸入框在下拉面板內部。",
      table: {
        type: { summary: "'outside' | 'inside'" },
        defaultValue: { summary: "'outside'" },
        category: 'Inputs',
      },
    },
    loading: {
      control: false,
      description: '是否顯示載入中狀態。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    loadingPosition: {
      control: false,
      description:
        "載入中狀態的顯示位置。`'full'` — 全畫面 loading；`'bottom'` — 底部加載指示器。",
      table: {
        type: { summary: "'full' | 'bottom'" },
        defaultValue: { summary: "'bottom'" },
        category: 'Inputs',
      },
    },
    loadingText: {
      control: false,
      description: '載入中狀態文字。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'載入中...'" },
        category: 'Inputs',
      },
    },
    menuMaxHeight: {
      control: false,
      description: '下拉選單的最大高度（px）。',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    mode: {
      control: false,
      description: '選取模式。',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" },
        category: 'Inputs',
      },
    },
    id: {
      control: false,
      description: 'input 元素的 id 屬性，供表單與 label 關聯使用。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    name: {
      control: false,
      description: 'input 的 name 屬性，供表單使用。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    onInsert: {
      control: false,
      description:
        '新增選項的同步回呼。回傳值為更新後的 options 陣列，元件會立即使用。優先於 `inserted` output。',
      table: {
        type: {
          summary:
            '(text: string, currentOptions: ReadonlyArray<DropdownOption>) => ReadonlyArray<DropdownOption>',
        },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    onRemoveCreated: {
      control: false,
      description:
        '關閉下拉時清理未選中的動態新增選項。回呼收到的是清理後的 options 陣列。',
      table: {
        type: {
          summary: '(cleanedOptions: ReadonlyArray<DropdownOption>) => void',
        },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    open: {
      control: false,
      description: '受控模式下的開啟狀態。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: '-' },
        category: 'Inputs',
      },
    },
    options: {
      control: false,
      description: '選項列表。',
      table: {
        type: { summary: 'ReadonlyArray<DropdownOption>' },
        defaultValue: { summary: '[]' },
        category: 'Inputs',
      },
    },
    overflowStrategy: {
      control: false,
      description:
        "多選模式的溢出策略。`'wrap'`：換行顯示所有標籤；`'counter'`：固定單行，超出以 +N 計數器顯示。",
      table: {
        type: { summary: "'counter' | 'wrap'" },
        defaultValue: { summary: "'wrap'" },
        category: 'Inputs',
      },
    },
    placeholder: {
      control: false,
      description: '佔位文字。',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
        category: 'Inputs',
      },
    },
    readOnly: {
      control: false,
      description: '是否唯讀。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    required: {
      control: false,
      description: '是否必填。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    searchDebounceTime: {
      control: false,
      description: '搜尋防抖時間（毫秒）。',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
        category: 'Inputs',
      },
    },
    size: {
      control: false,
      description: '欄位尺寸。',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
        category: 'Inputs',
      },
    },
    stepByStepBulkCreate: {
      control: false,
      description: '逐步批次新增模式。啟用時，貼上多筆項目後一次只建立第一筆。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'Inputs',
      },
    },
    trimOnCreate: {
      control: false,
      description: '建立項目時是否自動去除前後空白。',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
        category: 'Inputs',
      },
    },
    searchChange: {
      control: false,
      description: '搜尋文字變更事件（經 debounce）。',
      table: {
        type: { summary: 'OutputEmitterRef<string>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    searchTextChange: {
      control: false,
      description: '搜尋文字原始變更事件（每次 input 立即觸發，無 debounce）。',
      table: {
        type: { summary: 'OutputEmitterRef<string>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    selectionChange: {
      control: false,
      description: '選取變更事件（單選或多選的每次 toggle 都會觸發）。',
      table: {
        type: { summary: 'OutputEmitterRef<DropdownOption>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    valueChange: {
      control: false,
      description: '多選模式下值陣列變更事件。',
      table: {
        type: { summary: 'OutputEmitterRef<ReadonlyArray<string>>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    cleared: {
      control: false,
      description: '清除事件。',
      table: {
        type: { summary: 'OutputEmitterRef<void>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    visibilityChange: {
      control: false,
      description: '下拉選單可見性變更事件。',
      table: {
        type: { summary: 'OutputEmitterRef<boolean>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    reachBottom: {
      control: false,
      description: '滾動到底事件。',
      table: {
        type: { summary: 'OutputEmitterRef<void>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    leaveBottom: {
      control: false,
      description: '離開底部事件。',
      table: {
        type: { summary: 'OutputEmitterRef<void>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    inserted: {
      control: false,
      description: '新增選項事件（output 風格）。',
      table: {
        type: {
          summary:
            'OutputEmitterRef<{ text: string; currentOptions: ReadonlyArray<DropdownOption> }>',
        },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    removeCreated: {
      control: false,
      description: '清理動態新增選項事件（output 風格）。',
      table: {
        type: { summary: 'OutputEmitterRef<ReadonlyArray<DropdownOption>>' },
        defaultValue: { summary: '-' },
        category: 'Outputs',
      },
    },
    'ngModel / value': {
      control: false,
      description:
        '當前選取值。單選模式為 `string`，多選模式為 `ReadonlyArray<string>`。支援 `[(ngModel)]` 雙向繫結。',
      table: {
        type: { summary: 'string | ReadonlyArray<string>' },
        defaultValue: { summary: '-' },
        category: 'NgModel',
      },
    },
  },
} satisfies Meta;

type Story = StoryObj;

const originOptions: DropdownOption[] = [
  { id: 'item1', name: 'item1' },
  { id: 'item2', name: 'item2' },
  { id: 'item3', name: 'item3' },
  { id: 'foo', name: 'foo' },
  { id: 'bar', name: 'bar' },
  { id: 'bob', name: 'bob' },
  { id: 'apple', name: 'apple' },
  { id: 'very very very long', name: 'very very very long' },
  { id: '?><!@#$^$&^&', name: '?><!@#$^$&^&' },
];

const manyOptions: DropdownOption[] = Array.from({ length: 20 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `選項 ${i + 1}`,
}));

// ──────────────────────────────────────────────
//  1. Basic
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-basic',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznAutocompletePrefix, MznIcon],
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px;">
      <!-- Row 1: main size -->
      <div
        style="display: inline-grid; grid-template-columns: repeat(4, 240px); gap: 16px; align-items: center;"
      >
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="單選"
          [required]="true"
        />
        <mzn-autocomplete
          mode="multiple"
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="多選"
          [required]="true"
          [(ngModel)]="multipleSelections"
        />
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="錯誤"
          [error]="true"
          [required]="true"
        />
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="已禁用"
          [disabled]="true"
          [required]="true"
        />
      </div>
      <!-- Row 2: sub size -->
      <div
        style="display: inline-grid; grid-template-columns: repeat(4, 240px); gap: 16px; align-items: center;"
      >
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="單選"
          size="sub"
          [required]="true"
        />
        <mzn-autocomplete
          mode="multiple"
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="多選"
          size="sub"
          [required]="true"
          [(ngModel)]="multipleSelections"
        />
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="錯誤"
          size="sub"
          [error]="true"
          [required]="true"
        />
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="已禁用"
          size="sub"
          [disabled]="true"
          [required]="true"
        />
      </div>
      <!-- Row 3: prefix icon -->
      <div
        style="display: inline-grid; grid-template-columns: repeat(4, 240px); gap: 16px; align-items: center;"
      >
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="單選"
          [required]="true"
        >
          <i mznIcon mznAutocompletePrefix [icon]="searchIcon"></i>
        </mzn-autocomplete>
        <mzn-autocomplete
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="單選 sub 尺寸"
          size="sub"
          [required]="true"
        >
          <i mznIcon mznAutocompletePrefix [icon]="searchIcon"></i>
        </mzn-autocomplete>
        <mzn-autocomplete
          mode="multiple"
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="多選"
          [required]="true"
          [(ngModel)]="multipleSelections"
        >
          <i mznIcon mznAutocompletePrefix [icon]="searchIcon"></i>
        </mzn-autocomplete>
        <mzn-autocomplete
          mode="multiple"
          [options]="options"
          [menuMaxHeight]="140"
          placeholder="多選 sub 尺寸"
          size="sub"
          [required]="true"
          [(ngModel)]="multipleSelections"
        >
          <i mznIcon mznAutocompletePrefix [icon]="searchIcon"></i>
        </mzn-autocomplete>
      </div>
    </div>
  `,
})
class BasicStoryComponent {
  readonly options = originOptions;
  readonly searchIcon = SearchIcon;
  multipleSelections: ReadonlyArray<string> = [];
}

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [BasicStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-basic />`,
  }),
};

// ──────────────────────────────────────────────
//  2. SingleModeAsyncSearch
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-async',
  standalone: true,
  imports: [MznAutocomplete],
  template: `
    <div
      style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;"
    >
      <mzn-autocomplete
        [asyncData]="true"
        [disabledOptionsFilter]="true"
        [loading]="loading()"
        [menuMaxHeight]="200"
        [options]="options()"
        emptyText="沒有符合的選項"
        loadingText="載入中..."
        placeholder="Placeholder"
        (searchChange)="onSearch($event)"
      />
    </div>
  `,
})
class AsyncSearchStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);
  readonly loading = signal(false);

  onSearch(search: string): void {
    if (!search) {
      this.options.set([...originOptions]);
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      this.options.set(
        originOptions.filter((opt) =>
          opt.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
      this.loading.set(false);
    }, 1000);
  }
}

export const SingleModeAsyncSearch: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [AsyncSearchStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-async />`,
  }),
};

// ──────────────────────────────────────────────
//  3. SingleModeSyncSearch
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-sync',
  standalone: true,
  imports: [MznAutocomplete],
  template: `
    <div
      style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;"
    >
      <mzn-autocomplete
        [disabledOptionsFilter]="true"
        [menuMaxHeight]="200"
        [options]="options()"
        emptyText="沒有符合的選項"
        placeholder="Placeholder"
        (searchChange)="onSearch($event)"
      />
    </div>
  `,
})
class SyncSearchStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);

  onSearch(search: string): void {
    if (!search) {
      this.options.set([...originOptions]);
      return;
    }

    this.options.set(
      originOptions.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }
}

export const SingleModeSyncSearch: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [SyncSearchStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-sync />`,
  }),
};

// ──────────────────────────────────────────────
//  4. KeepSearchTextOnBlur
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-keep-search-text',
  standalone: true,
  imports: [FormsModule, MznAutocomplete],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; max-width: 800px;"
    >
      <div>
        <h3 style="margin-bottom: 16px;">單選模式</h3>
        <div
          style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;"
        >
          <mzn-autocomplete
            [clearSearchText]="false"
            [disabledOptionsFilter]="true"
            [menuMaxHeight]="200"
            [options]="singleOptions()"
            emptyText="沒有符合的選項"
            placeholder="失焦後保留文字"
            (searchChange)="onSingleSearch($event)"
          />
          <mzn-autocomplete
            [disabledOptionsFilter]="true"
            [menuMaxHeight]="200"
            [options]="singleOptions()"
            emptyText="沒有符合的選項"
            placeholder="失焦後清空"
            (searchChange)="onSingleSearch($event)"
          />
        </div>
      </div>
      <div>
        <h3 style="margin-bottom: 16px;">多選模式</h3>
        <div
          style="display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center;"
        >
          <mzn-autocomplete
            mode="multiple"
            [clearSearchText]="false"
            [disabledOptionsFilter]="true"
            [menuMaxHeight]="200"
            [options]="multipleOptions()"
            emptyText="沒有符合的選項"
            placeholder="失焦後保留文字"
            [(ngModel)]="multipleSelections"
            (searchChange)="onMultipleSearch($event)"
          />
          <mzn-autocomplete
            mode="multiple"
            [disabledOptionsFilter]="true"
            [menuMaxHeight]="200"
            [options]="multipleOptions()"
            emptyText="沒有符合的選項"
            placeholder="失焦後清空"
            [(ngModel)]="multipleAutoClearSelections"
            (searchChange)="onMultipleSearch($event)"
          />
        </div>
      </div>
    </div>
  `,
})
class KeepSearchTextOnBlurStoryComponent {
  readonly singleOptions = signal<DropdownOption[]>([...originOptions]);
  readonly multipleOptions = signal<DropdownOption[]>([...originOptions]);
  multipleSelections: ReadonlyArray<string> = [];
  multipleAutoClearSelections: ReadonlyArray<string> = [];

  onSingleSearch(search: string): void {
    if (!search) {
      this.singleOptions.set([...originOptions]);
      return;
    }

    this.singleOptions.set(
      originOptions.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }

  onMultipleSearch(search: string): void {
    if (!search) {
      this.multipleOptions.set([...originOptions]);
      return;
    }

    this.multipleOptions.set(
      originOptions.filter((opt) =>
        opt.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }
}

export const KeepSearchTextOnBlur: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [KeepSearchTextOnBlurStoryComponent] }),
  ],
  render: () => ({
    template: `<story-autocomplete-keep-search-text />`,
  }),
};

// ──────────────────────────────────────────────
//  5. Multiple
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-multiple',
  standalone: true,
  imports: [FormsModule, MznAutocomplete],
  template: `
    <div
      style="display: inline-grid; grid-template-columns: repeat(2, 500px); gap: 16px; align-items: center;"
    >
      <mzn-autocomplete
        mode="multiple"
        [options]="options"
        placeholder="Placeholder"
        [required]="true"
        [(ngModel)]="selections"
      />
    </div>
  `,
})
class MultipleStoryComponent {
  readonly options = originOptions;
  selections: ReadonlyArray<string> = [];
}

export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [MultipleStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-multiple />`,
  }),
};

// ──────────────────────────────────────────────
//  6. OverflowStrategy
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-overflow',
  standalone: true,
  imports: [FormsModule, MznAutocomplete],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; max-width: 800px;"
    >
      <div>
        <h3 style="margin-bottom: 16px;">Overflow Strategy: counter</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
          當標籤過多時，會顯示部分標籤並用 "+ N" 計數器表示剩餘數量
        </p>
        <div style="max-width: 300px;">
          <mzn-autocomplete
            mode="multiple"
            overflowStrategy="counter"
            [disabledOptionsFilter]="true"
            [options]="options"
            placeholder="選擇多個選項..."
            [(ngModel)]="counterSelections"
          />
        </div>
        <p style="margin-top: 8px; font-size: 12px; color: #666;"
          >已選擇: {{ counterSelections.length }} 個</p
        >
      </div>
      <div>
        <h3 style="margin-bottom: 16px;">Overflow Strategy: wrap</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
          當標籤過多時，會自動換行顯示所有標籤
        </p>
        <div style="max-width: 300px;">
          <mzn-autocomplete
            mode="multiple"
            overflowStrategy="wrap"
            [disabledOptionsFilter]="true"
            [options]="options"
            placeholder="選擇多個選項..."
            [(ngModel)]="wrapSelections"
          />
        </div>
        <p style="margin-top: 8px; font-size: 12px; color: #666;"
          >已選擇: {{ wrapSelections.length }} 個</p
        >
      </div>
    </div>
  `,
})
class OverflowStrategyStoryComponent {
  readonly options = manyOptions;
  counterSelections: ReadonlyArray<string> = manyOptions
    .slice(0, 5)
    .map((o) => o.id);
  wrapSelections: ReadonlyArray<string> = manyOptions
    .slice(0, 5)
    .map((o) => o.id);
}

export const OverflowStrategy: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [OverflowStrategyStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-overflow />`,
  }),
};

// ──────────────────────────────────────────────
//  7. CreatableSingle
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-creatable-single',
  standalone: true,
  imports: [FormsModule, MznAutocomplete],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;"
    >
      <div>
        <h3>單選模式 - 可新增選項</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
          輸入文字後按 Enter 或點擊 + 號新增選項
        </p>
        <mzn-autocomplete
          [addable]="true"
          [onInsert]="handleInsert"
          [onRemoveCreated]="handleRemoveCreated"
          [options]="options()"
          placeholder="輸入文字新增選項..."
          [(ngModel)]="selected"
          (selectionChange)="onSelect($event)"
        />
      </div>
      <div>
        <p style="font-size: 12px; color: #666;"
          >已選擇: {{ selectedName() || '無' }}</p
        >
        <p style="font-size: 12px; color: #666;"
          >選項數量: {{ options().length }}</p
        >
      </div>
    </div>
  `,
})
class CreatableSingleStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);
  selected = '';
  private nextId = originOptions.length + 1;

  readonly handleInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => {
    const newOption: DropdownOption = {
      id: `new-${this.nextId++}`,
      name: text,
    };
    const updated = [...currentOptions, newOption];

    this.options.set([...updated]);

    return updated;
  };

  readonly handleRemoveCreated = (
    cleanedOptions: ReadonlyArray<DropdownOption>,
  ): void => {
    this.options.set([...cleanedOptions]);
  };

  selectedName(): string {
    const opt = this.options().find((o) => o.id === this.selected);

    return opt?.name ?? '';
  }

  onSelect(option: DropdownOption): void {
    console.log('selectionChange', option);
  }
}

export const CreatableSingle: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [CreatableSingleStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-creatable-single />`,
  }),
};

// ──────────────────────────────────────────────
//  8. CreatableMultiple
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-creatable-multiple',
  standalone: true,
  imports: [FormsModule, MznAutocomplete],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; max-width: 500px;"
    >
      <div>
        <h3>inside 多選模式 - 單選風格 checked icon</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
          下拉視覺採單選風格 checked icon，但行為仍可多選；建立項目維持 New
          標記。
        </p>
        <mzn-autocomplete
          mode="multiple"
          [addable]="true"
          [onInsert]="handleInsert"
          [onRemoveCreated]="handleRemoveCreated"
          [options]="options()"
          placeholder="輸入文字新增選項..."
          [(ngModel)]="selections"
        />
      </div>
      <div>
        <p style="font-size: 12px; color: #666;"
          >已選擇數量: {{ selections.length }}</p
        >
        <p style="font-size: 12px; color: #666;"
          >選項數量: {{ options().length }}</p
        >
      </div>
    </div>
  `,
})
class CreatableMultipleStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);
  selections: ReadonlyArray<string> = [];
  private nextId = originOptions.length + 1;

  readonly handleInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => {
    const newOption: DropdownOption = {
      id: `new-${this.nextId++}`,
      name: text,
    };
    const updated = [...currentOptions, newOption];

    this.options.set([...updated]);

    return updated;
  };

  readonly handleRemoveCreated = (
    cleanedOptions: ReadonlyArray<DropdownOption>,
  ): void => {
    this.options.set([...cleanedOptions]);
  };
}

export const CreatableMultiple: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [CreatableMultipleStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-creatable-multiple />`,
  }),
};

// ──────────────────────────────────────────────
//  9. BulkCreate
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-bulk-create',
  standalone: true,
  imports: [FormsModule, MznAutocomplete],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 600px;"
    >
      <div>
        <h3>批次新增</h3>
        <div style="font-size: 12px; color: #666; margin-bottom: 16px;">
          <p>功能：</p>
          <ul style="margin-left: 20px; line-height: 1.8;">
            <li
              >貼上後逐個確認：貼上如 "Grid chart, Griddle, Grid"
              時，輸入框保留字串，dropdown 僅顯示「建立 "Grid chart"」</li
            >
            <li
              >依序建立：點擊建立後只新增第一個項目，輸入框更新為剩餘字串，再建立下一筆</li
            >
            <li>已存在選項會從字串中濾除，不會重複顯示建立按鈕</li>
            <li>按 Enter 或點擊建立按鈕新增單筆</li>
            <li>自動去除前後空白、自動清理未選擇的新增選項</li>
          </ul>
        </div>
        <mzn-autocomplete
          mode="multiple"
          [addable]="true"
          [onInsert]="handleInsert"
          [onRemoveCreated]="handleRemoveCreated"
          [stepByStepBulkCreate]="true"
          [trimOnCreate]="true"
          [options]="options()"
          emptyText="沒有符合的項目"
          placeholder="試試貼上: Grid chart, Griddle, Grid"
          [(ngModel)]="selections"
        />
      </div>
      <div
        style="padding: 12px; background-color: #f5f5f5; border-radius: 4px;"
      >
        <p style="margin: 0 0 8px 0; font-weight: bold;">狀態：</p>
        <p style="margin: 4px 0; font-size: 14px;"
          >已選擇: {{ selections.length }} 個項目</p
        >
        <p style="margin: 4px 0; font-size: 14px;"
          >總選項數: {{ options().length }}</p
        >
        @if (selections.length > 0) {
          <div style="margin-top: 8px;">
            <p style="margin: 4px 0; font-size: 14px; font-weight: bold;"
              >已選擇的項目：</p
            >
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              @for (id of selections; track id) {
                <span
                  style="padding: 2px 8px; background-color: #e3f2fd; border-radius: 4px; font-size: 12px;"
                >
                  {{ getOptionName(id) }}
                </span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class BulkCreateStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);
  selections: ReadonlyArray<string> = [];
  private nextId = originOptions.length + 1;

  readonly handleInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => {
    const newOption: DropdownOption = {
      id: `new-${this.nextId++}`,
      name: text,
    };
    const updated = [...currentOptions, newOption];

    this.options.set([...updated]);

    return updated;
  };

  readonly handleRemoveCreated = (
    cleanedOptions: ReadonlyArray<DropdownOption>,
  ): void => {
    this.options.set([...cleanedOptions]);
  };

  getOptionName(id: string): string {
    return this.options().find((o) => o.id === id)?.name ?? id;
  }
}

export const BulkCreate: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [BulkCreateStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-bulk-create />`,
  }),
};

// ──────────────────────────────────────────────
//  10. InputPositionInside
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-input-position-inside',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznTag],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 200px;"
    >
      <div>
        <h3>多選模式 - 可新增選項</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
          輸入文字後按 Enter 或點擊 + 號新增選項
        </p>
        <div
          style="display: flex; flex-wrap: wrap; gap: 4px; width: 100%; margin-block: 8px;"
        >
          @for (id of selections; track id) {
            <span
              mznTag
              type="dismissable"
              [label]="getOptionName(id)"
              (close)="removeSelection(id)"
            ></span>
          }
        </div>
        <span
          mznTag
          type="addable"
          [label]="isOpen() ? '收起選單' : '展開選單'"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        ></span>
        <mzn-autocomplete
          mode="multiple"
          inputPosition="inside"
          [addable]="true"
          [onInsert]="handleInsert"
          [onRemoveCreated]="handleRemoveCreated"
          [options]="options()"
          [open]="isOpen()"
          placeholder="輸入文字新增選項..."
          [(ngModel)]="selections"
          (visibilityChange)="onVisibilityChange($event)"
        />
      </div>
      <div>
        <p>已選擇數量: {{ selections.length }}</p>
        <p>選項數量: {{ options().length }}</p>
      </div>
    </div>
  `,
})
class InputPositionInsideStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);
  readonly isOpen = signal(true);
  selections: ReadonlyArray<string> = [originOptions[0].id];
  private nextId = originOptions.length + 1;

  readonly handleInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => {
    const newOption: DropdownOption = {
      id: `new-${this.nextId++}`,
      name: text,
    };
    const updated = [...currentOptions, newOption];

    this.options.set([...updated]);

    return updated;
  };

  readonly handleRemoveCreated = (
    cleanedOptions: ReadonlyArray<DropdownOption>,
  ): void => {
    this.options.set([...cleanedOptions]);
  };

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  onVisibilityChange(open: boolean): void {
    if (!open) this.isOpen.set(false);
  }

  removeSelection(id: string): void {
    this.selections = this.selections.filter((s) => s !== id);
  }

  getOptionName(id: string): string {
    return this.options().find((o) => o.id === id)?.name ?? id;
  }
}

export const InputPositionInside: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [InputPositionInsideStoryComponent] }),
  ],
  render: () => ({
    template: `<story-autocomplete-input-position-inside />`,
  }),
};

// ──────────────────────────────────────────────
//  11. InsideBulkCreate
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-inside-bulk-create',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznTag],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 620px;"
    >
      <div>
        <h3
          >inside 多選模式 - 單選風格 checked icon + step-by-step bulk
          create</h3
        >
        <p style="font-size: 12px; color: #666; margin-bottom: 8px;">
          貼上多個項目後，dropdown 只顯示第一個「建立」，點擊後再顯示下一個。
        </p>
        <p style="font-size: 12px; color: #666; margin-bottom: 16px;">
          試試貼上：<code>Grid chart, Griddle, Grid</code>
        </p>
        <div
          style="display: flex; flex-wrap: wrap; gap: 4px; width: 100%; margin-block: 8px;"
        >
          @for (id of selections; track id) {
            <span
              mznTag
              type="dismissable"
              [label]="getOptionName(id)"
              (close)="removeSelection(id)"
            ></span>
          }
        </div>
        <span
          mznTag
          type="addable"
          [label]="isOpen() ? '收起選單' : '展開選單'"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        ></span>
        <mzn-autocomplete
          mode="multiple"
          inputPosition="inside"
          [addable]="true"
          [onInsert]="handleInsert"
          [onRemoveCreated]="handleRemoveCreated"
          [stepByStepBulkCreate]="true"
          [trimOnCreate]="true"
          [options]="options()"
          [open]="isOpen()"
          placeholder="試試貼上..."
          [(ngModel)]="selections"
          (visibilityChange)="onVisibilityChange($event)"
        />
      </div>
      <div>
        <p>已選擇數量: {{ selections.length }}</p>
        <p>選項數量: {{ options().length }}</p>
      </div>
    </div>
  `,
})
class InsideBulkCreateStoryComponent {
  readonly options = signal<DropdownOption[]>([...originOptions]);
  readonly isOpen = signal(true);
  selections: ReadonlyArray<string> = [];
  private nextId = originOptions.length + 1;

  readonly handleInsert = (
    text: string,
    currentOptions: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> => {
    const newOption: DropdownOption = {
      id: `new-${this.nextId++}`,
      name: text,
    };
    const updated = [...currentOptions, newOption];

    this.options.set([...updated]);

    return updated;
  };

  readonly handleRemoveCreated = (
    cleanedOptions: ReadonlyArray<DropdownOption>,
  ): void => {
    this.options.set([...cleanedOptions]);
  };

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  onVisibilityChange(open: boolean): void {
    if (!open) this.isOpen.set(false);
  }

  removeSelection(id: string): void {
    this.selections = this.selections.filter((s) => s !== id);
  }

  getOptionName(id: string): string {
    return this.options().find((o) => o.id === id)?.name ?? id;
  }
}

export const InsideBulkCreate: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [InsideBulkCreateStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-inside-bulk-create />`,
  }),
};

// ──────────────────────────────────────────────
//  12. InsideEmpty
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-inside-empty',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznTag],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 240px;"
    >
      <div>
        <h3>inside 多選模式 - 單選風格 checked icon + empty</h3>
        <span
          mznTag
          type="addable"
          [label]="isOpen() ? '收起選單' : '展開選單'"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        ></span>
        <mzn-autocomplete
          mode="multiple"
          inputPosition="inside"
          [options]="emptyOptions"
          [open]="isOpen()"
          emptyText="沒有符合的項目"
          placeholder="沒有選項可選"
          [(ngModel)]="selections"
          (visibilityChange)="onVisibilityChange($event)"
        />
      </div>
    </div>
  `,
})
class InsideEmptyStoryComponent {
  readonly emptyOptions: DropdownOption[] = [];
  readonly isOpen = signal(true);
  selections: ReadonlyArray<string> = [];

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  onVisibilityChange(open: boolean): void {
    if (!open) this.isOpen.set(false);
  }
}

export const InsideEmpty: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [InsideEmptyStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-inside-empty />`,
  }),
};

// ──────────────────────────────────────────────
//  13. InsideLoading
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-inside-loading',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznTag],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 24px; max-width: 240px;"
    >
      <div>
        <h3>inside 多選模式 - 單選風格 checked icon + loading</h3>
        <span
          mznTag
          type="addable"
          [label]="isOpen() ? '收起選單' : '展開選單'"
          (mousedown)="$event.stopPropagation()"
          (click)="$event.stopPropagation(); toggleOpen()"
        ></span>
        <mzn-autocomplete
          mode="multiple"
          inputPosition="inside"
          [loading]="true"
          [options]="emptyOptions"
          [open]="isOpen()"
          emptyText="沒有符合的項目"
          loadingText="載入中..."
          placeholder="資料載入中..."
          [(ngModel)]="selections"
          (visibilityChange)="onVisibilityChange($event)"
        />
      </div>
    </div>
  `,
})
class InsideLoadingStoryComponent {
  readonly emptyOptions: DropdownOption[] = [];
  readonly isOpen = signal(true);
  selections: ReadonlyArray<string> = [];

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  onVisibilityChange(open: boolean): void {
    if (!open) this.isOpen.set(false);
  }
}

export const InsideLoading: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [InsideLoadingStoryComponent] })],
  render: () => ({
    template: `<story-autocomplete-inside-loading />`,
  }),
};

// ──────────────────────────────────────────────
//  14. LoadMoreOnReachBottom
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-load-more',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznTag],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 12px; max-width: 320px;"
    >
      <span
        mznTag
        [label]="'已載入 ' + options().length + ' / ' + totalCount + ' 個選項'"
      ></span>
      <div style="display: flex; gap: 8px; align-items: center;">
        <mzn-autocomplete
          [disabledOptionsFilter]="true"
          [loading]="loading()"
          [menuMaxHeight]="120"
          [options]="options()"
          emptyText="沒有符合的選項"
          loadingText="載入中..."
          placeholder="請選擇或輸入..."
          [(ngModel)]="selected"
          (reachBottom)="onReachBottom()"
          (leaveBottom)="onLeaveBottom()"
        />
      </div>
      <div style="font-size: 12px; color: #666;">
        @if (loading()) {
          <div>正在載入更多選項...</div>
        }
        @if (!hasMore) {
          <div>已載入所有選項</div>
        }
      </div>
      @if (selected) {
        <div style="font-size: 12px; color: #666;"
          >已選擇: {{ selectedName() }}</div
        >
      }
    </div>
  `,
})
class LoadMoreOnReachBottomStoryComponent {
  readonly options = signal<DropdownOption[]>(originOptions.slice(0, 5));
  readonly loading = signal(false);
  readonly totalCount = originOptions.length;
  selected = '';
  hasMore = true;
  private hasReachedBottom = false;

  onReachBottom(): void {
    if (this.hasReachedBottom || this.loading() || !this.hasMore) return;

    this.hasReachedBottom = true;
    this.loadMore();
  }

  onLeaveBottom(): void {
    this.hasReachedBottom = false;
  }

  selectedName(): string {
    return (
      this.options().find((o) => o.id === this.selected)?.name ?? this.selected
    );
  }

  private loadMore(): void {
    this.loading.set(true);

    setTimeout(() => {
      const currentCount = this.options().length;
      const nextBatch = originOptions.slice(currentCount, currentCount + 5);

      if (nextBatch.length === 0) {
        this.hasMore = false;
      } else {
        this.options.update((prev) => [...prev, ...nextBatch]);
      }

      this.loading.set(false);
      this.hasReachedBottom = false;
    }, 1000);
  }
}

export const LoadMoreOnReachBottom: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [LoadMoreOnReachBottomStoryComponent] }),
  ],
  render: () => ({
    template: `<story-autocomplete-load-more />`,
  }),
};

// ──────────────────────────────────────────────
//  15. SearchTextControlRef
// ──────────────────────────────────────────────

@Component({
  selector: 'story-autocomplete-search-text-control',
  standalone: true,
  imports: [FormsModule, MznAutocomplete, MznButton, MznTag],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 32px; max-width: 480px;"
    >
      <div>
        <h3 style="margin-bottom: 8px;">setSearchTextValue — 只清空輸入文字</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 12px;">
          呼叫 setSearchTextValue('')
          僅清除輸入框的搜尋文字，已選取的值與下拉選項狀態不受影響。
        </p>
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="flex: 1;">
            <mzn-autocomplete
              #clearRef
              [options]="options"
              placeholder="輸入後點擊清除文字"
            />
          </div>
          <button
            mznButton
            variant="base-secondary"
            (click)="clearRef.setSearchTextValue('')"
          >
            清除文字
          </button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 8px;">resetSearchText — 完整重置</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 12px;">
          呼叫 resetSearchText()
          同時清除搜尋文字與已選取的值，等同回到初始狀態。
        </p>
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="flex: 1;">
            <mzn-autocomplete
              #resetRef
              mode="multiple"
              [options]="options"
              placeholder="選取後點擊重置"
              [(ngModel)]="resetValue"
            />
          </div>
          <button
            mznButton
            variant="base-secondary"
            (click)="resetRef.resetSearchText(); resetValue = []"
          >
            重置
          </button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: 8px;">Submit 流程</h3>
        <p style="font-size: 12px; color: #666; margin-bottom: 12px;">
          選取後按下送出，呼叫 resetSearchText() 清除欄位並記錄已送出的項目。
        </p>
        <div style="display: flex; gap: 8px; align-items: center;">
          <div style="flex: 1;">
            <mzn-autocomplete
              #submitRef
              mode="multiple"
              [options]="options"
              placeholder="選取項目後送出"
              [(ngModel)]="submitValue"
            />
          </div>
          <button
            mznButton
            [disabled]="submitValue.length === 0"
            (click)="submit(submitRef)"
          >
            送出
          </button>
        </div>
        @if (submittedItems.length > 0) {
          <div
            style="margin-top: 12px; padding: 12px; background: #f5f5f5; border-radius: 4px;"
          >
            <p style="margin: 0 0 8px; font-size: 14px; font-weight: bold;">
              已送出 ({{ submittedItems.length }} 個):
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px;">
              @for (item of submittedItems; track $index) {
                <span mznTag type="static" size="sub" [label]="item"></span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
class SearchTextControlRefStoryComponent {
  readonly options = originOptions;
  resetValue: ReadonlyArray<string> = [];
  submitValue: ReadonlyArray<string> = [];
  submittedItems: string[] = [];

  submit(ref: MznAutocomplete): void {
    if (this.submitValue.length === 0) return;

    const names = this.submitValue.map((id) => {
      const opt = this.options.find((o) => o.id === id);

      return opt?.name ?? id;
    });

    this.submittedItems = [...this.submittedItems, ...names];
    this.submitValue = [];
    ref.resetSearchText();
  }
}

export const SearchTextControlRef: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [SearchTextControlRefStoryComponent] }),
  ],
  render: () => ({
    template: `<story-autocomplete-search-text-control />`,
  }),
};
