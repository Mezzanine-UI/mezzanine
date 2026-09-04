import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import MznTypography from '../typography/typography.vue';
import MznCheckbox from './checkbox.vue';
import MznCheckboxGroup from './checkbox-group.vue';
import type {
  CheckboxGroupChangeEvent,
  CheckboxGroupOptionInput,
  CheckboxGroupProps,
} from './checkbox-group.types';

export default {
  component: MznCheckboxGroup,
  title: 'Data Entry/Checkbox/Group',
} as Meta;

type Story = StoryObj<typeof MznCheckboxGroup>;

const defaultOptions: CheckboxGroupOptionInput[] = [
  { label: 'Checkbox Label', value: '1' },
  { label: 'Checkbox Label', value: '2' },
  { label: 'Checkbox Label', value: '3', disabled: true },
  { label: 'Checkbox Label', value: '4' },
  { label: 'Checkbox Label', value: '5' },
  { label: 'Checkbox Label', value: '6' },
  { label: 'Checkbox Label', value: '7' },
  { label: 'Checkbox Label', value: '8' },
  { label: 'Checkbox Label', value: '9' },
  { label: 'Checkbox Label', value: '10' },
  { label: 'Checkbox Label', value: '11' },
  { label: 'Checkbox Label', value: '12' },
  { label: 'Checkbox Label', value: '13' },
  { label: 'Checkbox Label', value: '14' },
  { label: 'Checkbox Label', value: '15' },
  { label: 'Checkbox Label', value: '16' },
  { label: 'Checkbox Label', value: '17' },
  { label: 'Checkbox Label', value: '18' },
  { label: 'Checkbox Label', value: '19' },
  { label: 'Checkbox Label', value: '20' },
];

/**
 * The shared body of the layout stories, the way React's
 * `CheckboxGroupStoryContent` is: either the `options` prop or twenty children.
 */
function storyContent(options: {
  initialValue?: string[];
  layout?: CheckboxGroupProps['layout'];
  level?: CheckboxGroupProps['level'];
  mode?: CheckboxGroupProps['mode'];
  useChildren?: boolean;
}) {
  const {
    initialValue = [],
    layout,
    level,
    mode,
    useChildren = false,
  } = options;

  return {
    components: { MznCheckbox, MznCheckboxGroup },
    setup: () => {
      const value = ref<string[]>(initialValue);

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        value.value = event.target.values || [];
      };

      return {
        defaultOptions,
        handleChange,
        layout,
        level,
        mode,
        useChildren,
        value,
      };
    },
    template: `
      <MznCheckboxGroup
        v-if="useChildren"
        :layout="layout"
        :level="level"
        :mode="mode"
        name="checkbox-group-children"
        :value="value"
        @change="handleChange"
      >
        <MznCheckbox id="group-child-1" label="Checkbox Label" value="1" />
        <MznCheckbox id="group-child-2" label="Checkbox Label" value="2" />
        <MznCheckbox id="group-child-3" label="Checkbox Label" value="3" disabled />
        <MznCheckbox id="group-child-4" label="Checkbox Label" value="4" />
        <MznCheckbox id="group-child-5" label="Checkbox Label" value="5" />
        <MznCheckbox id="group-child-6" label="Checkbox Label" value="6" />
        <MznCheckbox id="group-child-7" label="Checkbox Label" value="7" />
        <MznCheckbox id="group-child-8" label="Checkbox Label" value="8" />
        <MznCheckbox id="group-child-9" label="Checkbox Label" value="9" />
        <MznCheckbox id="group-child-10" label="Checkbox Label" value="10" />
        <MznCheckbox id="group-child-11" label="Checkbox Label" value="11" />
        <MznCheckbox id="group-child-12" label="Checkbox Label" value="12" />
        <MznCheckbox id="group-child-13" label="Checkbox Label" value="13" />
        <MznCheckbox id="group-child-14" label="Checkbox Label" value="14" />
        <MznCheckbox id="group-child-15" label="Checkbox Label" value="15" />
        <MznCheckbox id="group-child-16" label="Checkbox Label" value="16" />
        <MznCheckbox id="group-child-17" label="Checkbox Label" value="17" />
        <MznCheckbox id="group-child-18" label="Checkbox Label" value="18" />
        <MznCheckbox id="group-child-19" label="Checkbox Label" value="19" />
        <MznCheckbox id="group-child-20" label="Checkbox Label" value="20" />
      </MznCheckboxGroup>
      <MznCheckboxGroup
        v-else
        :layout="layout"
        :level="level"
        :mode="mode"
        name="checkbox-group-options"
        :options="defaultOptions"
        :value="value"
        @change="handleChange"
      />
    `,
  };
}

export const Playground: Story = {
  args: {
    disabled: false,
    layout: 'horizontal',
    level: {
      active: false,
      disabled: false,
      label: 'Select All',
    },
    options: defaultOptions,
    value: ['2'],
  },
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    layout: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
    },
    level: {
      control: {
        type: 'object',
      },
    },
    options: {
      control: {
        type: 'object',
      },
    },
    value: {
      control: {
        type: 'object',
      },
    },
  },
  render: (args) => ({
    components: { MznCheckboxGroup },
    setup: () => {
      const value = ref<string[]>(args.value || []);

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        const newValue = event.target.values || [];

        value.value = newValue;
        // eslint-disable-next-line no-console
        console.log('CheckboxGroup changed:', newValue);
      };

      const levelWithOnChange = args.level
        ? {
            ...args.level,
            onChange: (event: Event) => {
              const target = event.target as HTMLInputElement;

              // eslint-disable-next-line no-console
              console.log('Level control changed:', {
                checked: target.checked,
                value: target.value,
              });

              args.level?.onChange?.(event);
            },
          }
        : undefined;

      return { args, handleChange, levelWithOnChange, value };
    },
    template: `
      <MznCheckboxGroup
        :key="args.layout"
        v-bind="args"
        :level="levelWithOnChange"
        :name="args.name || 'playground-checkbox-group'"
        :value="value"
        @change="handleChange"
      />
    `,
  }),
};

export const Horizontal: Story = {
  render: () => storyContent({ layout: 'horizontal' }),
};

export const Vertical: Story = {
  render: () => storyContent({ layout: 'vertical' }),
};

export const HorizontalChips: Story = {
  render: () => storyContent({ layout: 'horizontal', mode: 'chip' }),
};

export const VerticalChips: Story = {
  render: () => storyContent({ layout: 'vertical', mode: 'chip' }),
};

export const ChipsWithLevelControl: Story = {
  render: () => ({
    components: { MznCheckboxGroup, MznTypography },
    setup: () => {
      const value = ref<string[]>(['2', '4']);

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        value.value = event.target.values || [];
      };

      return {
        handleChange,
        level: { active: true, label: '全選', mode: 'chip' },
        options: defaultOptions.slice(0, 8),
        value,
      };
    },
    template: `
      <div
        style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px"
      >
        <MznTypography>Chip 模式搭配 Level 控制範例</MznTypography>
        <MznTypography color="text-neutral">
          使用 chip 模式的 checkbox 組件，並搭配 level（全選）功能。
        </MznTypography>

        <MznCheckboxGroup
          :level="level"
          layout="horizontal"
          mode="chip"
          name="chips-level-group"
          :options="options"
          :value="value"
          @change="handleChange"
        />
      </div>
    `,
  }),
};

export const ChipsWithLevelControlVertical: Story = {
  render: () => ({
    components: { MznCheckboxGroup, MznTypography },
    setup: () => {
      const value = ref<string[]>(['2', '4']);

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        value.value = event.target.values || [];
      };

      return {
        handleChange,
        level: { active: true, label: '全選', mode: 'chip' },
        options: defaultOptions.slice(0, 8),
        value,
      };
    },
    template: `
      <div
        style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px"
      >
        <MznTypography>Chip 模式搭配 Level 控制範例（垂直佈局）</MznTypography>
        <MznTypography color="text-neutral">
          使用 chip 模式的 checkbox 組件，並搭配 level（全選）功能，垂直排列。
        </MznTypography>

        <MznCheckboxGroup
          :level="level"
          layout="vertical"
          mode="chip"
          name="chips-level-group-vertical"
          :options="options"
          :value="value"
          @change="handleChange"
        />
      </div>
    `,
  }),
};

export const WithLevelControlCustomization: Story = {
  render: () => ({
    components: { MznCheckboxGroup },
    setup: () => {
      const value = ref<string[]>(['2', '4']);

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        value.value = event.target.values || [];
      };

      return {
        defaultOptions,
        handleChange,
        level: { active: true, disabled: false, label: '全選' },
        value,
      };
    },
    template: `
      <MznCheckboxGroup
        :level="level"
        name="level-control-group"
        :options="defaultOptions"
        :value="value"
        @change="handleChange"
      />
    `,
  }),
};

export const WithChildren: Story = {
  render: () => storyContent({ useChildren: true }),
};

export const WithEditableInput: Story = {
  render: () => ({
    components: { MznCheckboxGroup, MznTypography },
    setup: () => {
      const value = ref<string[]>([]);
      const editableValues = ref<Record<string, string>>({});

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        const newValue = event.target.values || [];

        value.value = newValue;

        // Clear editable values for unchecked items
        const newEditableValues = { ...editableValues.value };

        Object.keys(newEditableValues).forEach((key) => {
          if (!newValue.includes(key)) {
            delete newEditableValues[key];
          }
        });

        editableValues.value = newEditableValues;
      };

      const options = computed((): CheckboxGroupOptionInput[] => [
        { label: '選項 1', value: 'option1' },
        { label: '選項 2', value: 'option2' },
        {
          label: '其他',
          value: 'other',
          withEditInput: true,
          editableInput: {
            value: editableValues.value.other || '',
            onChange: (event: Event) => {
              editableValues.value = {
                ...editableValues.value,
                other: (event.target as HTMLInputElement).value,
              };
            },
          },
        },
        { label: '選項 3', value: 'option3' },
      ]);

      return { editableValues, handleChange, options, value };
    },
    template: `
      <div
        style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px"
      >
        <MznTypography>CheckboxGroup 可編輯輸入範例</MznTypography>
        <MznTypography color="text-neutral">
          選擇「其他」選項後，會顯示輸入框讓您輸入自訂內容。只設置 \`withEditInput: true\` 即可使用默認配置。
        </MznTypography>

        <MznCheckboxGroup
          layout="vertical"
          name="editable-group"
          :options="options"
          :value="value"
          @change="handleChange"
        />

        <div
          v-if="value.length > 0"
          style="padding: 12px; background-color: #f3f4f6; border-radius: 4px; margin-top: 8px"
        >
          <MznTypography variant="caption" color="text-neutral">
            已選擇：{{ value.join(', ') }}
          </MznTypography>
          <MznTypography
            v-if="editableValues.other"
            variant="caption"
            color="text-neutral"
            style="display: block; margin-top: 4px"
          >
            其他選項內容：{{ editableValues.other }}
          </MznTypography>
        </div>
      </div>
    `,
  }),
};

export const WithEditableInputMultiple: Story = {
  render: () => ({
    components: { MznCheckboxGroup, MznTypography },
    setup: () => {
      const value = ref<string[]>([]);
      const editableValues = ref<Record<string, string>>({});

      const handleChange = (event: CheckboxGroupChangeEvent): void => {
        const newValue = event.target.values || [];

        value.value = newValue;

        // Clear editable values for unchecked items
        const newEditableValues = { ...editableValues.value };

        Object.keys(newEditableValues).forEach((key) => {
          if (!newValue.includes(key)) {
            delete newEditableValues[key];
          }
        });

        editableValues.value = newEditableValues;
      };

      const options = computed((): CheckboxGroupOptionInput[] => [
        {
          label: '自訂選項 1',
          value: 'custom1',
          withEditInput: true,
          editableInput: {
            value: editableValues.value.custom1 || '',
            onChange: (event: Event) => {
              editableValues.value = {
                ...editableValues.value,
                custom1: (event.target as HTMLInputElement).value,
              };
            },
          },
        },
        {
          label: '自訂選項 2',
          value: 'custom2',
          withEditInput: true,
          editableInput: {
            value: editableValues.value.custom2 || '',
            onChange: (event: Event) => {
              editableValues.value = {
                ...editableValues.value,
                custom2: (event.target as HTMLInputElement).value,
              };
            },
          },
        },
        { label: '一般選項', value: 'normal' },
        {
          label: '其他',
          value: 'other',
          withEditInput: true,
          editableInput: {
            value: editableValues.value.other || '',
            onChange: (event: Event) => {
              editableValues.value = {
                ...editableValues.value,
                other: (event.target as HTMLInputElement).value,
              };
            },
          },
        },
      ]);

      return { editableValues, handleChange, options, value };
    },
    template: `
      <div
        style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px"
      >
        <MznTypography>多個可編輯輸入範例</MznTypography>
        <MznTypography color="text-neutral">
          多個選項都可以有可編輯輸入框，勾選後會自動顯示。
        </MznTypography>

        <MznCheckboxGroup
          layout="vertical"
          name="multiple-editable-group"
          :options="options"
          :value="value"
          @change="handleChange"
        />

        <div
          v-if="value.length > 0"
          style="padding: 12px; background-color: #f3f4f6; border-radius: 4px; margin-top: 8px"
        >
          <MznTypography variant="caption" color="text-neutral">
            已選擇：{{ value.join(', ') }}
          </MznTypography>
          <div v-if="Object.keys(editableValues).length > 0" style="margin-top: 8px">
            <MznTypography
              variant="caption"
              color="text-neutral"
              style="display: block; margin-bottom: 4px"
            >
              已輸入的內容：
            </MznTypography>
            <MznTypography
              v-for="[key, val] in Object.entries(editableValues)"
              :key="key"
              variant="caption"
              color="text-neutral"
              style="display: block; margin-left: 8px"
            >
              {{ key }}: {{ val }}
            </MznTypography>
          </div>
        </div>
      </div>
    `,
  }),
};
