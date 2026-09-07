import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import type { FunctionalComponent } from 'vue';
import { SearchIcon } from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznIcon from '../icon/icon.vue';
import MznTag from '../tag/tag.vue';
import type { SelectValue } from '../select/select.types';
import MznAutoComplete from './auto-complete.vue';

export default {
  component: MznAutoComplete,
  title: 'Data Entry/AutoComplete',
} as Meta;

type Story = StoryObj<typeof MznAutoComplete>;

const originOptions: SelectValue[] = [
  { id: 'item1', name: 'item1' },
  { id: 'item2', name: 'item2' },
  { id: 'item3', name: 'item3' },
  { id: 'foo', name: 'foo' },
  { id: 'bar', name: 'bar' },
  { id: 'bob', name: 'bob' },
  { id: 'apple', name: 'apple' },
  { id: 'very very very long', name: 'very very very long' },
  { id: '?><!@#$^$&^&', name: '?><!@#$^$&^&' },
  { id: '中文選項', name: '中文選項' },
];

/**
 * React renders `A{value}B` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

const gridStyle = (columns: string): string =>
  `display: inline-grid; grid-template-columns: ${columns}; gap: 16px; align-items: center`;

const hintStyle = 'font-size: 12px; color: #666; margin-bottom: 8px';

export const Basic: Story = {
  render: () => ({
    components: { MznAutoComplete, MznIcon },
    setup: () => {
      const multipleSelections = ref<SelectValue[]>([]);

      return {
        SearchIcon,
        gridStyle: gridStyle('repeat(4, 240px)'),
        multipleSelections,
        originOptions,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div :style="gridStyle">
          <MznAutoComplete
            :menu-max-height="140"
            :options="originOptions"
            placeholder="單選"
            required
          />
          <MznAutoComplete
            :menu-max-height="140"
            mode="multiple"
            :options="originOptions"
            placeholder="多選"
            required
            :value="multipleSelections"
            @change="multipleSelections = $event"
          />
          <MznAutoComplete
            error
            :menu-max-height="140"
            :options="originOptions"
            placeholder="錯誤"
            required
          />
          <MznAutoComplete
            disabled
            :menu-max-height="140"
            :options="originOptions"
            placeholder="已禁用"
            required
          />
        </div>
        <div :style="gridStyle">
          <MznAutoComplete
            :menu-max-height="140"
            :options="originOptions"
            placeholder="單選"
            required
            size="sub"
          />
          <MznAutoComplete
            :menu-max-height="140"
            mode="multiple"
            :options="originOptions"
            placeholder="多選"
            required
            size="sub"
            :value="multipleSelections"
            @change="multipleSelections = $event"
          />
          <MznAutoComplete
            error
            :menu-max-height="140"
            :options="originOptions"
            placeholder="錯誤"
            required
            size="sub"
          />
          <MznAutoComplete
            disabled
            :menu-max-height="140"
            :options="originOptions"
            placeholder="已禁用"
            required
            size="sub"
          />
        </div>
        <div :style="gridStyle">
          <MznAutoComplete
            :menu-max-height="140"
            mode="single"
            :options="originOptions"
            placeholder="單選"
            required
          >
            <template #prefix><MznIcon :icon="SearchIcon" /></template>
          </MznAutoComplete>
          <MznAutoComplete
            :menu-max-height="140"
            mode="single"
            size="sub"
            :options="originOptions"
            placeholder="單選 sub 尺寸"
            required
          >
            <template #prefix><MznIcon :icon="SearchIcon" /></template>
          </MznAutoComplete>
          <MznAutoComplete
            :menu-max-height="140"
            mode="multiple"
            :options="originOptions"
            placeholder="多選"
            required
            :value="multipleSelections"
            @change="multipleSelections = $event"
          >
            <template #prefix><MznIcon :icon="SearchIcon" /></template>
          </MznAutoComplete>
          <MznAutoComplete
            :menu-max-height="140"
            mode="multiple"
            :options="originOptions"
            size="sub"
            placeholder="多選 sub 尺寸"
            required
            :value="multipleSelections"
            @change="multipleSelections = $event"
          >
            <template #prefix><MznIcon :icon="SearchIcon" /></template>
          </MznAutoComplete>
        </div>
      </div>
    `,
  }),
};

export const SingleModeAsyncSearch: Story = {
  render: () => ({
    components: { MznAutoComplete },
    setup: () => {
      const options = ref<SelectValue[]>(originOptions);

      const handleSearch = (search: string): Promise<void> => {
        if (!search) {
          options.value = originOptions;

          return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
          setTimeout(() => {
            options.value = originOptions.filter((opt) =>
              opt.name.toLowerCase().includes(search.toLowerCase()),
            );
            resolve();
          }, 1000);
        });
      };

      return {
        gridStyle: gridStyle('repeat(2, 300px)'),
        handleSearch,
        options,
      };
    },
    template: `
      <div :style="gridStyle">
        <MznAutoComplete
          async-data
          disabled-options-filter
          empty-text="沒有符合的選項"
          loading-text="載入中..."
          :menu-max-height="200"
          mode="single"
          :options="options"
          placeholder="Placeholder"
          @search="handleSearch"
        />
      </div>
    `,
  }),
};

export const SingleModeSyncSearch: Story = {
  render: () => ({
    components: { MznAutoComplete },
    setup: () => {
      const options = ref<SelectValue[]>(originOptions);

      const handleSearch = (search: string): void => {
        options.value = search
          ? originOptions.filter((opt) =>
              opt.name.toLowerCase().includes(search.toLowerCase()),
            )
          : originOptions;
      };

      return {
        gridStyle: gridStyle('repeat(2, 300px)'),
        handleSearch,
        options,
      };
    },
    template: `
      <div :style="gridStyle">
        <MznAutoComplete
          disabled-options-filter
          empty-text="沒有符合的選項"
          :menu-max-height="200"
          mode="single"
          :options="options"
          placeholder="Placeholder"
          @search="handleSearch"
        />
      </div>
    `,
  }),
};

export const KeepSearchTextOnBlur: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag, TextParts },
    setup: () => {
      const multipleAutoClearSelections = ref<SelectValue[]>([]);
      const singleOptions = ref<SelectValue[]>(originOptions);
      const multipleOptions = ref<SelectValue[]>(originOptions);
      const multipleSelections = ref<SelectValue[]>([]);

      const filter = (search: string): SelectValue[] =>
        search
          ? originOptions.filter((opt) =>
              opt.name.toLowerCase().includes(search.toLowerCase()),
            )
          : originOptions;

      const handleSingleSearch = (search: string): void => {
        singleOptions.value = filter(search);
      };

      const handleMultipleSearch = (search: string): void => {
        multipleOptions.value = filter(search);
      };

      const handleSearchTextChange = (): void => {
        // This is the extension point for any custom string handling with searchText,
        // such as transformation, validation, API requests, logging, debouncing,
        // multi-field search, or advanced processing scenarios.
      };

      return {
        gridStyle: gridStyle('repeat(2, 300px)'),
        handleMultipleSearch,
        handleSearchTextChange,
        handleSingleSearch,
        multipleAutoClearSelections,
        multipleOptions,
        multipleSelections,
        singleOptions,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 800px">
        <div>
          <h3 style="margin-bottom: 16px">單選模式</h3>
          <div :style="gridStyle">
            <MznAutoComplete
              :clear-search-text="false"
              disabled-options-filter
              empty-text="沒有符合的選項"
              :menu-max-height="200"
              mode="single"
              :options="singleOptions"
              placeholder="失焦後保留文字"
              @search="handleSingleSearch"
              @search-text-change="handleSearchTextChange"
            />
            <MznAutoComplete
              disabled-options-filter
              empty-text="沒有符合的選項"
              :menu-max-height="200"
              mode="single"
              :options="singleOptions"
              placeholder="失焦後清空"
              @search="handleSingleSearch"
            />
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 16px">多選模式</h3>
          <div :style="gridStyle">
            <MznAutoComplete
              :clear-search-text="false"
              disabled-options-filter
              empty-text="沒有符合的選項"
              :menu-max-height="200"
              mode="multiple"
              :options="multipleOptions"
              placeholder="失焦後保留文字"
              :value="multipleSelections"
              @change="multipleSelections = $event"
              @search="handleMultipleSearch"
              @search-text-change="handleSearchTextChange"
            />
            <MznAutoComplete
              disabled-options-filter
              empty-text="沒有符合的選項"
              :menu-max-height="200"
              mode="multiple"
              :options="multipleOptions"
              placeholder="失焦後清空"
              :value="multipleAutoClearSelections"
              @change="multipleAutoClearSelections = $event"
              @search="handleMultipleSearch"
              @search-text-change="handleSearchTextChange"
            />
          </div>
          <div
            v-if="multipleSelections.length > 0"
            style="margin-top: 12px; padding: 12px; background-color: #f5f5f5; border-radius: 4px"
          >
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold">
              <TextParts :parts="['已選擇 (', multipleSelections.length, ' 個):']" />
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px">
              <MznTag
                v-for="item in multipleSelections"
                :key="item.id"
                :label="item.name"
                size="sub"
                type="static"
              />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    components: { MznAutoComplete },
    setup: () => {
      const selections = ref<SelectValue[]>([]);

      return {
        gridStyle: gridStyle('repeat(2, 500px)'),
        originOptions,
        selections,
      };
    },
    template: `
      <div :style="gridStyle">
        <MznAutoComplete
          mode="multiple"
          :options="originOptions"
          placeholder="Placeholder"
          required
          :value="selections"
          @change="selections = $event"
        />
      </div>
    `,
  }),
};

const caseSensitiveOptions: SelectValue[] = [
  { id: 'colorado', name: 'Colorado' },
  { id: 'connecticut', name: 'Connecticut' },
  { id: 'virginia', name: 'Virginia' },
  { id: 'west-virginia', name: 'West Virginia' },
];

export const CaseSensitivity: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag },
    setup: () => {
      const insensitive = ref<SelectValue | null>(null);
      const sensitive = ref<SelectValue | null>(null);

      return {
        caseSensitiveOptions,
        gridStyle:
          'display: inline-grid; grid-template-columns: repeat(2, 320px); gap: 16px; align-items: start',
        insensitive,
        sensitive,
      };
    },
    template: `
      <div :style="gridStyle">
        <div style="display: grid; gap: 8px">
          <MznTag label="預設：不分大小寫" />
          <MznAutoComplete
            :options="caseSensitiveOptions"
            placeholder="輸入 vir 也找得到 Virginia"
            :value="insensitive"
            @change="insensitive = $event"
          />
        </div>
        <div style="display: grid; gap: 8px">
          <MznTag label="caseSensitive" />
          <MznAutoComplete
            case-sensitive
            :options="caseSensitiveOptions"
            placeholder="需輸入 Vir 才找得到"
            :value="sensitive"
            @change="sensitive = $event"
          />
        </div>
      </div>
    `,
  }),
};

export const OverflowStrategy: Story = {
  render: () => ({
    components: { MznAutoComplete, TextParts },
    setup: () => {
      const counterSelections = ref<SelectValue[]>([]);
      const wrapSelections = ref<SelectValue[]>([]);

      // 創建足夠多的選項來觸發溢出
      const manyOptions: SelectValue[] = Array.from({ length: 20 }, (_, i) => ({
        id: `item-${i + 1}`,
        name: `選項 ${i + 1}`,
      }));

      return { counterSelections, hintStyle, manyOptions, wrapSelections };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 800px">
        <div>
          <h3 style="margin-bottom: 16px">Overflow Strategy: counter</h3>
          <p :style="hintStyle">
            當標籤過多時，會顯示部分標籤並用 "+ N" 計數器表示剩餘數量
          </p>
          <div style="max-width: 300px">
            <MznAutoComplete
              disabled-options-filter
              mode="multiple"
              :options="manyOptions"
              overflow-strategy="counter"
              placeholder="選擇多個選項..."
              :value="counterSelections"
              @change="counterSelections = $event"
            />
          </div>
          <p style="margin-top: 8px; font-size: 12px; color: #666">
            <TextParts :parts="['已選擇: ', counterSelections.length, ' 個']" />
          </p>
        </div>
        <div>
          <h3 style="margin-bottom: 16px">Overflow Strategy: wrap</h3>
          <p :style="hintStyle">
            當標籤過多時，會自動換行顯示所有標籤
          </p>
          <div style="max-width: 300px">
            <MznAutoComplete
              disabled-options-filter
              mode="multiple"
              :options="manyOptions"
              overflow-strategy="wrap"
              placeholder="選擇多個選項..."
              :value="wrapSelections"
              @change="wrapSelections = $event"
            />
          </div>
          <p style="margin-top: 8px; font-size: 12px; color: #666">
            <TextParts :parts="['已選擇: ', wrapSelections.length, ' 個']" />
          </p>
        </div>
      </div>
    `,
  }),
};

/** The insert/remove pair every creatable story repeats. */
function useCreatableOptions() {
  const options = ref<SelectValue[]>(originOptions);
  let nextId = originOptions.length + 1;

  return {
    handleInsert: (
      text: string,
      currentOptions: SelectValue[],
    ): SelectValue[] => {
      const newOption: SelectValue = { id: `new-${nextId}`, name: text };

      nextId += 1;

      const updatedOptions = [...currentOptions, newOption];

      options.value = updatedOptions;

      return updatedOptions;
    },
    handleRemoveCreated: (cleanedOptions: SelectValue[]): void => {
      options.value = cleanedOptions;
    },
    options,
  };
}

export const CreatableSingle: Story = {
  render: () => ({
    components: { MznAutoComplete, TextParts },
    setup: () => {
      const selection = ref<SelectValue | null>(null);
      const selectedName = computed(
        (): string => selection.value?.name || '無',
      );

      return { hintStyle, selectedName, selection, ...useCreatableOptions() };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px">
        <div>
          <h3>單選模式 - 可新增選項</h3>
          <p :style="hintStyle">
            輸入文字後按 Enter 或點擊 + 號新增選項
          </p>
          <MznAutoComplete
            addable
            mode="single"
            :on-insert="handleInsert"
            :options="options"
            placeholder="輸入文字新增選項..."
            :value="selection"
            @change="selection = $event"
            @remove-created="handleRemoveCreated"
          />
        </div>
        <div>
          <p><TextParts :parts="['已選擇: ', selectedName]" /></p>
          <p><TextParts :parts="['選項數量: ', options.length]" /></p>
        </div>
      </div>
    `,
  }),
};

export const CreatableMultiple: Story = {
  render: () => ({
    components: { MznAutoComplete, TextParts },
    setup: () => {
      const selections = ref<SelectValue[]>([]);

      return { hintStyle, selections, ...useCreatableOptions() };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 500px">
        <div>
          <h3>inside 多選模式 - 單選風格 checked icon</h3>
          <p :style="hintStyle">
            下拉視覺採單選風格 checked icon，但行為仍可多選；建立項目維持 New
            標記。
          </p>
          <MznAutoComplete
            addable
            mode="multiple"
            :on-insert="handleInsert"
            :options="options"
            placeholder="輸入文字新增選項..."
            :value="selections"
            @change="selections = $event"
            @remove-created="handleRemoveCreated"
          />
        </div>
        <div>
          <p><TextParts :parts="['已選擇數量: ', selections.length]" /></p>
          <p><TextParts :parts="['選項數量: ', options.length]" /></p>
        </div>
      </div>
    `,
  }),
};

export const BulkCreate: Story = {
  render: () => ({
    components: { MznAutoComplete, TextParts },
    setup: () => {
      const selections = ref<SelectValue[]>([]);

      return {
        createSeparators: [',', '+', '\n'],
        selections,
        ...useCreatableOptions(),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 600px">
        <div>
          <h3>批次新增</h3>
          <div style="font-size: 12px; color: #666; margin-bottom: 16px">
            <p>功能：</p>
            <ul style="margin-left: 20px; line-height: 1.8">
              <li>
                貼上後逐個確認：貼上如 "Grid chart, Griddle, Grid"
                時，輸入框保留字串，dropdown 僅顯示「建立 "Grid chart"」
              </li>
              <li>
                依序建立：點擊建立後只新增第一個項目，輸入框更新為剩餘字串，再建立下一筆
              </li>
              <li>已存在選項會從字串中濾除，不會重複顯示建立按鈕</li>
              <li>以第一個待建立字串過濾選項；無符合時顯示「沒有符合的項目」</li>
              <li>按 Enter 或點擊建立按鈕新增單筆</li>
              <li>自動去除前後空白、自動清理未選擇的新增選項</li>
            </ul>
          </div>
          <MznAutoComplete
            addable
            :create-separators="createSeparators"
            empty-text="沒有符合的項目"
            mode="multiple"
            :on-insert="handleInsert"
            :options="options"
            placeholder="試試貼上: Grid chart, Griddle, Grid"
            step-by-step-bulk-create
            trim-on-create
            :value="selections"
            @change="selections = $event"
            @remove-created="handleRemoveCreated"
          />
        </div>
        <div style="padding: 12px; background-color: #f5f5f5; border-radius: 4px">
          <p style="margin: 0 0 8px 0; font-weight: bold">狀態：</p>
          <p style="margin: 4px 0; font-size: 14px">
            <TextParts :parts="['已選擇: ', selections.length, ' 個項目']" />
          </p>
          <p style="margin: 4px 0; font-size: 14px">
            <TextParts :parts="['總選項數: ', options.length]" />
          </p>
          <div v-if="selections.length > 0" style="margin-top: 8px">
            <p style="margin: 4px 0; font-size: 14px; font-weight: bold">
              已選擇的項目：
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px">
              <span
                v-for="item in selections"
                :key="item.id"
                style="padding: 2px 8px; background-color: #e3f2fd; border-radius: 4px; font-size: 12px"
                >{{ item.name }}</span
              >
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const InputPositionInside: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag, TextParts },
    setup: () => {
      const open = ref(true);
      const selections = ref<SelectValue[]>([originOptions[0]]);
      const creatable = useCreatableOptions();

      return {
        hintStyle,
        open,
        selections,
        stopPropagation: (event: MouseEvent) => event.stopPropagation(),
        toggleOpen: (event: MouseEvent) => {
          event.stopPropagation();
          open.value = !open.value;
        },
        ...creatable,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 200px">
        <div>
          <h3>多選模式 - 可新增選項</h3>
          <p :style="hintStyle">
            輸入文字後按 Enter 或點擊 + 號新增選項
          </p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; width: 100%; margin-block: 8px">
            <MznTag
              v-for="selection in selections"
              :key="selection.id"
              :label="selection.name"
              type="dismissable"
              @close="selections = selections.filter((s) => s.id !== selection.id)"
            />
          </div>
          <MznTag
            type="addable"
            :label="open ? '收起選單' : '展開選單'"
            @click="toggleOpen"
            @mousedown="stopPropagation"
          />
          <MznAutoComplete
            addable
            mode="multiple"
            input-position="inside"
            :on-insert="handleInsert"
            :options="options"
            :open="open"
            placeholder="輸入文字新增選項..."
            :value="selections"
            @change="selections = $event"
            @remove-created="handleRemoveCreated"
            @visibility-change="open = false"
          />
        </div>
        <div>
          <p><TextParts :parts="['已選擇數量: ', selections.length]" /></p>
          <p><TextParts :parts="['選項數量: ', options.length]" /></p>
        </div>
      </div>
    `,
  }),
};

export const InsideBulkCreate: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag, TextParts },
    setup: () => {
      const open = ref(true);
      const selections = ref<SelectValue[]>([]);

      return {
        createSeparators: [',', '+', '\n'],
        hintStyle,
        open,
        selections,
        stopPropagation: (event: MouseEvent) => event.stopPropagation(),
        toggleOpen: (event: MouseEvent) => {
          event.stopPropagation();
          open.value = !open.value;
        },
        ...useCreatableOptions(),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 620px">
        <div>
          <h3>
            inside 多選模式 - 單選風格 checked icon + step-by-step bulk create
          </h3>
          <p :style="hintStyle">
            貼上多個項目後，dropdown 只顯示第一個「建立」，點擊後再顯示下一個。
          </p>
          <p style="font-size: 12px; color: #666; margin-bottom: 16px">
            試試貼上：<code>Grid chart, Griddle, Grid</code>
          </p>

          <div style="display: flex; flex-wrap: wrap; gap: 4px; width: 100%; margin-block: 8px">
            <MznTag
              v-for="selection in selections"
              :key="selection.id"
              :label="selection.name"
              type="dismissable"
              @close="selections = selections.filter((s) => s.id !== selection.id)"
            />
          </div>

          <MznTag
            type="addable"
            :label="open ? '收起選單' : '展開選單'"
            @click="toggleOpen"
            @mousedown="stopPropagation"
          />

          <MznAutoComplete
            addable
            :create-separators="createSeparators"
            input-position="inside"
            mode="multiple"
            :on-insert="handleInsert"
            :options="options"
            :open="open"
            placeholder="試試貼上..."
            step-by-step-bulk-create
            trim-on-create
            :value="selections"
            @change="selections = $event"
            @remove-created="handleRemoveCreated"
            @visibility-change="open = false"
          />
        </div>

        <div>
          <p><TextParts :parts="['已選擇數量: ', selections.length]" /></p>
          <p><TextParts :parts="['選項數量: ', options.length]" /></p>
        </div>
      </div>
    `,
  }),
};

export const InsideEmpty: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag },
    setup: () => {
      const open = ref(true);

      return {
        emptyOptions: [] as SelectValue[],
        emptyValue: [] as SelectValue[],
        open,
        stopPropagation: (event: MouseEvent) => event.stopPropagation(),
        toggleOpen: (event: MouseEvent) => {
          event.stopPropagation();
          open.value = !open.value;
        },
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 240px">
        <div>
          <h3>inside 多選模式 - 單選風格 checked icon + empty</h3>
          <MznTag
            type="addable"
            :label="open ? '收起選單' : '展開選單'"
            @click="toggleOpen"
            @mousedown="stopPropagation"
          />
          <MznAutoComplete
            empty-text="沒有符合的項目"
            input-position="inside"
            mode="multiple"
            :open="open"
            :options="emptyOptions"
            placeholder="沒有選項可選"
            :value="emptyValue"
            @visibility-change="open = false"
          />
        </div>
      </div>
    `,
  }),
};

export const InsideLoading: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag },
    setup: () => {
      const open = ref(true);

      return {
        emptyOptions: [] as SelectValue[],
        emptyValue: [] as SelectValue[],
        open,
        stopPropagation: (event: MouseEvent) => event.stopPropagation(),
        toggleOpen: (event: MouseEvent) => {
          event.stopPropagation();
          open.value = !open.value;
        },
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 240px">
        <div>
          <h3>inside 多選模式 - 單選風格 checked icon + loading</h3>
          <MznTag
            type="addable"
            :label="open ? '收起選單' : '展開選單'"
            @click="toggleOpen"
            @mousedown="stopPropagation"
          />
          <MznAutoComplete
            empty-text="沒有符合的項目"
            input-position="inside"
            loading
            loading-position="full"
            loading-text="載入中..."
            mode="multiple"
            :open="open"
            :options="emptyOptions"
            placeholder="資料載入中..."
            :value="emptyValue"
            @visibility-change="open = false"
          />
        </div>
      </div>
    `,
  }),
};

export const LoadMoreOnReachBottom: Story = {
  render: () => ({
    components: { MznAutoComplete, MznTag, TextParts },
    setup: () => {
      const options = ref<SelectValue[]>(originOptions.slice(0, 5));
      const value = ref<SelectValue | null>(null);
      const loading = ref(false);
      const hasMore = ref(true);
      const hasReachedBottom = ref(false);

      const loadMore = (): void => {
        if (loading.value || !hasMore.value) return;

        loading.value = true;

        // 模擬異步加載數據
        setTimeout(() => {
          const currentCount = options.value.length;
          const nextBatch = originOptions.slice(currentCount, currentCount + 5);

          if (nextBatch.length === 0) {
            hasMore.value = false;
          } else {
            options.value = [...options.value, ...nextBatch];
          }

          loading.value = false;
          hasReachedBottom.value = false;
        }, 1000);
      };

      const loadedLabel = computed(
        (): string =>
          `已載入 ${options.value.length} / ${originOptions.length} 個選項`,
      );

      return {
        handleLeaveBottom: () => {
          hasReachedBottom.value = false;
        },
        handleReachBottom: () => {
          if (!hasReachedBottom.value && !loading.value && hasMore.value) {
            hasReachedBottom.value = true;
            loadMore();
          }
        },
        hasMore,
        loadedLabel,
        loading,
        options,
        value,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 320px">
        <MznTag :label="loadedLabel" />
        <div style="display: flex; gap: 8px; align-items: center">
          <MznAutoComplete
            disabled-options-filter
            empty-text="沒有符合的選項"
            :loading="loading"
            loading-text="載入中..."
            :menu-max-height="120"
            mode="single"
            :options="options"
            placeholder="請選擇或輸入..."
            :value="value"
            @change="value = $event"
            @leave-bottom="handleLeaveBottom"
            @reach-bottom="handleReachBottom"
          />
        </div>
        <div style="font-size: 12px; color: #666">
          <div v-if="loading">正在載入更多選項...</div>
          <div v-if="!hasMore">已載入所有選項</div>
        </div>
        <div v-if="value" style="font-size: 12px; color: #666">
          <TextParts :parts="['已選擇: ', value.name]" />
        </div>
      </div>
    `,
  }),
};

export const SearchTextControlRef: Story = {
  render: () => ({
    components: { MznAutoComplete, MznButton, MznTag, TextParts },
    setup: () => {
      const setSearchTextControl = ref<{
        reset: () => void;
        setSearchText: (text: string) => void;
      } | null>(null);
      const resetControl = ref<{ reset: () => void } | null>(null);
      const submitControl = ref<{ reset: () => void } | null>(null);

      const resetValue = ref<SelectValue[]>([]);
      const submitValue = ref<SelectValue[]>([]);
      const submittedItems = ref<SelectValue[]>([]);

      return {
        handleSubmit: () => {
          if (!submitValue.value.length) return;

          submittedItems.value = [
            ...submittedItems.value,
            ...submitValue.value,
          ];
          submitValue.value = [];
          submitControl.value?.reset();
        },
        originOptions,
        resetControl,
        resetValue,
        setSearchTextControl,
        submitControl,
        submitValue,
        submittedItems,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; max-width: 480px">
        <div>
          <h3 style="margin-bottom: 8px">setSearchText — 只清空輸入文字</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 12px">
            呼叫 <code>setSearchText('')</code> 僅清除輸入框的搜尋文字，已選取的值與下拉選項狀態不受影響。
          </p>
          <div style="display: flex; gap: 8px; align-items: center">
            <div style="flex: 1">
              <MznAutoComplete
                ref="setSearchTextControl"
                :options="originOptions"
                placeholder="輸入後點擊清除文字"
              />
            </div>
            <MznButton
              variant="base-secondary"
              @click="setSearchTextControl?.setSearchText('')"
            >
              清除文字
            </MznButton>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 8px">reset — 完整重置</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 12px">
            呼叫 <code>reset()</code> 同時清除搜尋文字、已選取的值與下拉選單狀態，等同回到初始狀態。
          </p>
          <div style="display: flex; gap: 8px; align-items: center">
            <div style="flex: 1">
              <MznAutoComplete
                ref="resetControl"
                mode="multiple"
                :options="originOptions"
                placeholder="選取後點擊重置"
                :value="resetValue"
                @change="resetValue = $event"
              />
            </div>
            <MznButton
              size="main"
              variant="base-secondary"
              @click="resetValue = []; resetControl?.reset()"
            >
              重置
            </MznButton>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 8px">Submit 流程</h3>
          <p style="font-size: 12px; color: #666; margin-bottom: 12px">
            選取後按下送出，呼叫 <code>reset()</code> 清除欄位並記錄已送出的項目。
          </p>
          <div style="display: flex; gap: 8px; align-items: center">
            <div style="flex: 1">
              <MznAutoComplete
                ref="submitControl"
                mode="multiple"
                :options="originOptions"
                placeholder="選取項目後送出"
                :value="submitValue"
                @change="submitValue = $event"
              />
            </div>
            <MznButton
              :disabled="!submitValue.length"
              size="main"
              @click="handleSubmit"
            >
              送出
            </MznButton>
          </div>
          <div
            v-if="submittedItems.length > 0"
            style="margin-top: 12px; padding: 12px; background-color: #f5f5f5; border-radius: 4px"
          >
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold">
              <TextParts :parts="['已送出 (', submittedItems.length, ' 個):']" />
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 4px">
              <MznTag
                v-for="(item, index) in submittedItems"
                :key="item.id + '-' + index"
                :label="item.name"
                size="sub"
                type="static"
              />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
