import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import MznTypography from '../typography/typography.vue';
import MznSelect from './select.vue';
import type { SelectValue } from './select.types';

export default {
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
      description: '是否顯示清除按鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: { type: 'boolean' },
      description: '是否為錯誤狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    flip: {
      control: { type: 'boolean' },
      description:
        '空間不足時下拉選單是否自動向上翻轉（沿主軸 flip，保持與輸入框同寬與水平對齊）',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '是否撐滿父容器寬度',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: { type: 'boolean' },
      description: '是否顯示載入狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    loadingText: {
      control: { type: 'text' },
      description: '載入狀態顯示的文字',
    },
    menuMaxHeight: {
      control: { type: 'number' },
      description: '下拉選單最大高度',
    },
    mode: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: '選擇模式',
      table: { defaultValue: { summary: 'single' } },
    },
    overflowStrategy: {
      control: { type: 'select' },
      options: ['counter', 'wrap'],
      description: '多選時 tag 的溢出策略（僅 multiple 模式有效）',
      table: { defaultValue: { summary: 'counter' } },
    },
    placeholder: {
      control: { type: 'text' },
      description: '未選擇時的提示文字',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: '是否為唯讀狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    required: {
      control: { type: 'boolean' },
      description: '是否為必填',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['main', 'sub'],
      description: '輸入框尺寸',
      table: { defaultValue: { summary: 'main' } },
    },
  },
  component: MznSelect,
  title: 'Data Entry/Select',
} as Meta;

const gridStyle =
  'display: inline-grid; grid-template-columns: repeat(2, 300px); gap: 16px; align-items: center';

export const Basic: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect },
    setup: () => {
      const value = ref<SelectValue | null>(null);

      const basicOptions: DropdownOption[] = [
        { id: '1', name: 'item1 has very long description' },
        { id: '2', name: 'item2 has very long description' },
        { id: '3', name: 'item3 has very long description' },
        { id: '4', name: 'item4 has very long description' },
        { id: '5', name: 'item5 has very long description' },
      ];

      const simpleOptions: DropdownOption[] = [
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
        { id: '3', name: 'item3' },
      ];

      const multipleOptions: DropdownOption[] = [
        { id: '1', name: 'item123' },
        { id: '2', name: 'item26666' },
        { id: '3', name: 'item3' },
      ];

      return {
        basicOptions,
        defaultMultipleValue: [
          { id: '1', name: 'item123' },
          { id: '2', name: 'item26666' },
        ],
        gridStyle,
        multipleOptions,
        simpleOptions,
        value,
      };
    },
    template: `
      <div :style="gridStyle">
        <MznSelect
          clearable
          full-width
          required
          :options="basicOptions"
          placeholder="預設文字"
          :value="value"
          @change="value = $event"
        />
        <MznSelect
          disabled
          full-width
          :options="simpleOptions"
          placeholder="預設文字"
        />
        <MznSelect error full-width :options="simpleOptions" placeholder="預設文字" />
        <MznSelect
          clearable
          :default-value="defaultMultipleValue"
          full-width
          mode="multiple"
          :options="multipleOptions"
          placeholder="我是多選"
        />
      </div>
    `,
  }),
};

export const Size: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect, MznTypography },
    setup: () => ({
      gridStyle,
      labelStyle: { marginBottom: '8px' },
      sizeOptions: [
        { id: '1', name: 'item1' },
        { id: '2', name: 'item2' },
        { id: '3', name: 'item3' },
      ] as DropdownOption[],
    }),
    template: `
      <div :style="gridStyle">
        <div>
          <MznTypography variant="body" :style="labelStyle">
            size = main (default)
          </MznTypography>
          <MznSelect
            full-width
            :options="sizeOptions"
            placeholder="預設文字"
            size="main"
          />
        </div>
        <div>
          <MznTypography variant="body" :style="labelStyle">
            size = sub
          </MznTypography>
          <MznSelect
            full-width
            :options="sizeOptions"
            placeholder="預設文字"
            size="sub"
          />
        </div>
      </div>
    `,
  }),
};

export const Multiple: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect },
    setup: () => {
      const value = ref<SelectValue[]>([]);

      return {
        multipleOptions: [
          { id: '1', name: 'item1' },
          { id: '2', name: 'item2' },
          { id: '3', name: 'item3' },
          { id: '4', name: 'item4' },
          { id: '5', name: 'item5' },
          { id: '6', name: 'item6' },
        ] as DropdownOption[],
        value,
      };
    },
    template: `
      <div style="max-width: 300px">
        <MznSelect
          clearable
          full-width
          mode="multiple"
          :options="multipleOptions"
          overflow-strategy="wrap"
          placeholder="請選擇多個項目"
          :value="value"
          @change="value = $event"
        />
      </div>
    `,
  }),
};

export const WithReadOnly: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect, MznTypography },
    setup: () => {
      const value = ref<SelectValue | null>({ id: '1', name: 'item1' });

      return {
        gridStyle,
        labelStyle: { marginBottom: '8px' },
        readOnlyOptions: [
          { id: '1', name: 'item1' },
          { id: '2', name: 'item2' },
          { id: '3', name: 'item3' },
        ] as DropdownOption[],
        value,
      };
    },
    template: `
      <div :style="gridStyle">
        <div>
          <MznTypography variant="body" :style="labelStyle">
            readOnly = false (default)
          </MznTypography>
          <MznSelect
            clearable
            full-width
            :options="readOnlyOptions"
            placeholder="預設文字"
            :value="value"
            @change="value = $event"
          />
        </div>
        <div>
          <MznTypography variant="body" :style="labelStyle">
            readOnly = true
          </MznTypography>
          <MznSelect
            clearable
            full-width
            :options="readOnlyOptions"
            read-only
            placeholder="預設文字"
            :value="value"
            @change="value = $event"
          />
        </div>
      </div>
    `,
  }),
};

export const WithScroll: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect },
    setup: () => {
      const options = ref<DropdownOption[]>(
        Array.from({ length: 10 }, (_, i) => ({
          id: String(i + 1),
          name: `item${i + 1}`,
        })),
      );
      const loading = ref(false);
      const hasReachedBottom = ref(false);
      let isFetching = false;

      const loadMore = (): void => {
        if (isFetching) return;

        isFetching = true;
        loading.value = true;

        setTimeout(() => {
          options.value = [
            ...options.value,
            ...Array.from({ length: 10 }, (_, i) => ({
              id: String(options.value.length + i + 1),
              name: `item${options.value.length + i + 1}`,
            })),
          ];
          loading.value = false;
          isFetching = false;
          hasReachedBottom.value = false;
        }, 1000);
      };

      const handleReachBottom = (): void => {
        if (!hasReachedBottom.value && !isFetching) {
          hasReachedBottom.value = true;
          loadMore();
        }
      };

      const handleLeaveBottom = (): void => {
        hasReachedBottom.value = false;
      };

      return { handleLeaveBottom, handleReachBottom, loading, options };
    },
    template: `
      <div style="max-width: 300px">
        <MznSelect
          clearable
          full-width
          :loading="loading"
          loading-text="載入中..."
          :menu-max-height="200"
          :options="options"
          placeholder="滾動載入更多"
          @leave-bottom="handleLeaveBottom"
          @reach-bottom="handleReachBottom"
        />
      </div>
    `,
  }),
};

const treeOptions: DropdownOption[] = [
  {
    name: '前端框架',
    id: 'frontend',
    children: [
      {
        name: 'React',
        id: 'react',
        children: [
          { name: 'React.js', id: 'reactjs' },
          { name: 'React Native', id: 'react-native' },
          { name: 'Next.js', id: 'nextjs' },
        ],
      },
      { name: 'Vue', id: 'vue' },
      { name: 'Angular', id: 'angular' },
    ],
  },
  {
    name: '後端框架',
    id: 'backend',
    children: [
      { name: 'Node.js', id: 'nodejs' },
      { name: 'Express', id: 'express' },
      { name: 'NestJS', id: 'nestjs' },
    ],
  },
  {
    name: '資料庫',
    id: 'database',
    children: [
      { name: 'PostgreSQL', id: 'postgresql' },
      { name: 'MySQL', id: 'mysql' },
      { name: 'MongoDB', id: 'mongodb' },
    ],
  },
];

export const WithTree: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect, MznTypography },
    setup: () => {
      const value = ref<SelectValue[]>([]);

      return {
        labelStyle: { marginBottom: '8px' },
        summaryStyle: { marginBottom: '4px' },
        itemStyle: { fontSize: '12px' },
        treeOptions,
        value,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 400px">
        <div>
          <MznTypography variant="body" :style="labelStyle">
            Multiple Mode (Tree) - 所有選項都有 checkbox:
          </MznTypography>
          <MznSelect
            clearable
            full-width
            mode="multiple"
            :options="treeOptions"
            placeholder="請選擇多個技術棧"
            :value="value"
            @change="value = $event"
          />
        </div>
        <div
          v-if="value.length > 0"
          style="padding: 8px; background-color: #f5f5f5; border-radius: 4px"
        >
          <MznTypography variant="body" :style="summaryStyle">
            已選擇 ({{ value.length }} 項):
          </MznTypography>
          <MznTypography
            v-for="v in value"
            :key="v.id"
            variant="body"
            :style="itemStyle"
          >
            • {{ v.name }} (ID: {{ v.id }})
          </MznTypography>
        </div>
      </div>
    `,
  }),
};

export const WithFlip: StoryObj<typeof MznSelect> = {
  render: () => ({
    components: { MznSelect, MznTypography },
    setup: () => ({
      flipOptions: Array.from({ length: 6 }, (_, i) => ({
        id: String(i + 1),
        name: `item${i + 1}`,
      })) as DropdownOption[],
    }),
    template: `
      <div
        style="display: flex; flex-direction: column; gap: 8px; justify-content: flex-end; min-height: calc(100vh - 48px); max-width: 300px"
      >
        <MznTypography variant="body">
          flip = true：靠近視窗底部，開啟時自動向上翻轉
        </MznTypography>
        <MznSelect flip full-width :options="flipOptions" placeholder="請選擇" />
      </div>
    `,
  }),
};
