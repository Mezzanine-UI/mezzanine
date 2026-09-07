import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, ref } from 'vue';
import type { CheckboxMode, CheckboxSize } from '@mezzanine-ui/core/checkbox';
import MznTag from '../tag/tag.vue';
import MznTypography from '../typography/typography.vue';
import MznCheckbox from './checkbox.vue';
import type { CheckboxProps } from './checkbox.types';

export default {
  component: MznCheckbox,
  title: 'Data Entry/Checkbox',
} as Meta;

type Story = StoryObj<typeof MznCheckbox>;

const modes: CheckboxMode[] = ['default', 'chip'];
const sizesChip: CheckboxSize[] = ['main', 'sub', 'minor'];

export const Playground: Story = {
  args: {
    checked: false,
    description: 'Supporting text',
    disabled: false,
    editableInput: undefined,
    id: 'playground-checkbox',
    indeterminate: false,
    label: 'Checkbox Label',
    mode: 'default',
    name: 'playground-checkbox',
    severity: 'info',
    size: 'main',
    value: 'checkbox-value',
    withEditInput: false,
  },
  argTypes: {
    checked: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      control: false,
      table: {
        disable: true,
      },
    },
    description: {
      control: {
        type: 'text',
      },
      description: 'The description text displayed below the label',
      table: {
        type: { summary: 'string' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    editableInput: {
      control: {
        type: 'object',
      },
      description:
        'Configuration for editable input. If not provided and withEditInput is true, default values will be used.',
      table: {
        type: { summary: 'Omit<BaseInputProps, "variant"> | undefined' },
      },
    },
    indeterminate: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox is in indeterminate state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    inputProps: {
      control: false,
      table: {
        disable: true,
      },
    },
    label: {
      control: {
        type: 'text',
      },
      description: 'The label text displayed beside the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    mode: {
      control: {
        type: 'select',
      },
      options: modes,
      description: 'The mode of checkbox',
      table: {
        type: { summary: 'CheckboxMode' },
        defaultValue: { summary: "'main'" },
      },
    },
    name: {
      control: false,
      table: {
        disable: true,
      },
    },
    severity: {
      control: {
        type: 'select',
      },
      options: ['info', 'error'],
      description:
        'Visual severity: info for hint state, error for error state.',
      table: {
        type: { summary: "'info' | 'error'" },
      },
    },
    size: {
      control: {
        type: 'select',
      },
      options: sizesChip,
      description:
        'The size of checkbox. When mode is "chip", size can be "main" | "sub" | "minor". When mode is "default", size can be "main" | "sub".',
      table: {
        type: { summary: 'CheckboxSize' },
        defaultValue: { summary: "'main'" },
      },
    },
    value: {
      control: {
        type: 'text',
      },
      description:
        'The value of checkbox. Used when checkbox is inside a CheckboxGroup.',
      table: {
        type: { summary: 'string' },
      },
    },
    withEditInput: {
      control: {
        type: 'boolean',
      },
      description: 'Whether to show an editable input when checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
  },
  render: (args) => ({
    components: { MznCheckbox },
    setup: () => {
      const handleChange = (event: Event): void => {
        const target = event.target as HTMLInputElement;

        // eslint-disable-next-line no-console
        console.log('Checkbox changed:', {
          checked: target.checked,
          value: target.value || args.value || 'no value',
          indeterminate: target.indeterminate,
          label: args.label,
        });
      };

      // 確保 size 與 mode 匹配：當 mode 為 'default' 時，如果 size 是 'minor'，則重置為 'main'
      const validSize = computed(
        (): CheckboxSize =>
          args.mode === 'default' && args.size === 'minor'
            ? 'main'
            : (args.size ?? 'main'),
      );

      return { args, handleChange, validSize };
    },
    template: `
      <MznCheckbox v-bind="args" :size="validSize" @change="handleChange" />
    `,
  }),
};

/** React's `SectionItem`: a labelled panel holding a column of items. */
const SectionItem = defineComponent({
  name: 'SectionItem',
  components: { MznTag },
  props: {
    direction: { type: String, default: 'row' },
    label: { type: String, default: undefined },
  },
  setup: (props: { direction: string }) => ({
    hostStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '33%',
      height: 'auto',
      backgroundColor: '#F3F4F6',
      padding: '32px',
    },
    innerStyle: computed(() => ({
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: props.direction === 'row' ? 'center' : 'flex-start',
      height: 'auto',
      flexDirection: props.direction,
      gap: props.direction === 'row' ? '8px' : '16px',
      marginTop: '8px',
    })),
  }),
  template: `
    <div :style="hostStyle">
      <MznTag :label="label ?? ''" size="main" type="static" />
      <div :style="innerStyle"><slot /></div>
    </div>
  `,
});

const ItemList = defineComponent({
  name: 'ItemList',
  template: `
    <div style="display: flex; gap: 36px; align-items: flex-start">
      <slot />
    </div>
  `,
});

const ItemContent = defineComponent({
  name: 'ItemContent',
  setup: () => ({
    hostStyle: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginBottom: '16px',
    },
  }),
  template: '<div :style="hostStyle"><slot /></div>',
});

/** React's `InteractiveCheckbox`: holds its own checked state. */
const InteractiveCheckbox = defineComponent({
  name: 'InteractiveCheckbox',
  components: { MznCheckbox },
  props: {
    description: { type: String, default: undefined },
    disabled: { type: Boolean, default: undefined },
    id: { type: String, default: undefined },
    initialChecked: { type: Boolean, default: false },
    initialIndeterminate: { type: Boolean, default: false },
    label: { type: String, default: undefined },
    name: { type: String, default: undefined },
    size: { type: String, default: undefined },
    value: { type: String, default: undefined },
    withEditInput: { type: Boolean, default: false },
  },
  setup: (props: {
    initialChecked: boolean;
    initialIndeterminate: boolean;
    label?: string;
    value?: string;
  }) => {
    const checked = ref(props.initialChecked);
    const indeterminate = ref(props.initialIndeterminate);

    return {
      checked,
      handleChange: (event: Event): void => {
        const target = event.currentTarget as HTMLInputElement;

        // eslint-disable-next-line no-console
        console.log('Checkbox changed:', {
          checked: target.checked,
          value:
            (event.target as HTMLInputElement).value ||
            props.value ||
            'no value',
          indeterminate: (event.target as HTMLInputElement).indeterminate,
          label: props.label,
        });

        checked.value = target.checked;

        if (indeterminate.value) indeterminate.value = false;
      },
      indeterminate,
    };
  },
  template: `
    <MznCheckbox
      :checked="checked"
      :description="description"
      :disabled="disabled"
      :id="id"
      :indeterminate="indeterminate"
      :label="label"
      :name="name"
      :size="size"
      :value="value"
      :with-edit-input="withEditInput"
      @change="handleChange"
    />
  `,
});

export const Severity: Story = {
  render: () => ({
    components: {
      ItemContent,
      ItemList,
      MznCheckbox,
      MznTypography,
      SectionItem,
    },
    template: `
      <ItemList>
        <SectionItem label="Default mode" direction="column">
          <ItemContent>
            <MznTypography>Info:</MznTypography>
            <MznCheckbox
              id="severity-default-info"
              label="Info checkbox"
              name="severity-default-info"
              severity="info"
            />
          </ItemContent>
          <ItemContent>
            <MznTypography>Error:</MznTypography>
            <MznCheckbox
              id="severity-default-error"
              label="Error checkbox"
              name="severity-default-error"
              severity="error"
            />
          </ItemContent>
        </SectionItem>
        <SectionItem label="Chip mode" direction="column">
          <ItemContent>
            <MznTypography>Info:</MznTypography>
            <MznCheckbox
              id="severity-chip-info"
              label="Info chip"
              mode="chip"
              name="severity-chip-info"
              severity="info"
            />
          </ItemContent>
          <ItemContent>
            <MznTypography>Error:</MznTypography>
            <MznCheckbox
              id="severity-chip-error"
              label="Error chip"
              mode="chip"
              name="severity-chip-error"
              severity="error"
            />
          </ItemContent>
        </SectionItem>
      </ItemList>
    `,
  }),
};

export const State: StoryFn<Record<string, unknown>> = () => ({
  components: {
    InteractiveCheckbox,
    ItemContent,
    ItemList,
    MznCheckbox,
    MznTypography,
    SectionItem,
  },
  // React returns a fragment here, so the template keeps several roots too.
  template: `
    <p>Check</p>
    <ItemList>
      <SectionItem label="Main" direction="column">
        <ItemContent>
          <MznTypography>Normal:</MznTypography>
          <InteractiveCheckbox id="state-main-1" label="Checkbox Label" name="state-main-1" description="Supporting text" value="main-1" />
        </ItemContent>
        <ItemContent>
          <MznTypography>Checked:</MznTypography>
          <InteractiveCheckbox
            id="state-main-2"
            label="Checkbox Label"
            name="state-main-2"
            description="Supporting text"
            initial-checked
            value="main-2"
          />
        </ItemContent>
        <ItemContent>
          <MznTypography>Indeterminate:</MznTypography>
          <MznCheckbox id="state-main-indeterminate" label="Checkbox Label" name="state-main-indeterminate" description="Supporting text" indeterminate />
        </ItemContent>
        <ItemContent>
          <MznTypography>Disabled:</MznTypography>
          <InteractiveCheckbox
            id="state-main-3"
            label="Checkbox Label"
            name="state-main-3"
            description="Supporting text"
            disabled
            value="main-3"
          />
        </ItemContent>
        <ItemContent>
          <MznTypography>With editable input:</MznTypography>
          <InteractiveCheckbox
            id="state-main-4"
            label="Checkbox Label"
            name="state-main-4"
            description="Supporting text"
            with-edit-input
            value="main-4"
          />
        </ItemContent>
      </SectionItem>
      <SectionItem label="Sub" direction="column">
        <ItemContent>
          <MznTypography>Normal:</MznTypography>
          <InteractiveCheckbox id="state-sub-1" label="Checkbox Label" name="state-sub-1" description="Supporting text" size="sub" value="sub-1" />
        </ItemContent>
        <ItemContent>
          <MznTypography>Checked:</MznTypography>
          <InteractiveCheckbox id="state-sub-2" label="Checkbox Label" name="state-sub-2" description="Supporting text" size="sub" initial-checked value="sub-2" />
        </ItemContent>
        <ItemContent>
          <MznTypography>Indeterminate:</MznTypography>
          <MznCheckbox id="state-sub-indeterminate" label="Checkbox Label" name="state-sub-indeterminate" description="Supporting text" size="sub" indeterminate />
        </ItemContent>
        <ItemContent>
          <MznTypography>Disabled:</MznTypography>
          <MznCheckbox id="state-sub-disabled" label="Checkbox Label" name="state-sub-disabled" description="Supporting text" size="sub" disabled />
        </ItemContent>
        <ItemContent>
          <MznTypography>With editable input:</MznTypography>
          <InteractiveCheckbox
            id="state-sub-4"
            label="Checkbox Label"
            name="state-sub-4"
            description="Supporting text"
            with-edit-input
            value="sub-4"
          />
        </ItemContent>
      </SectionItem>
    </ItemList>
    <p>Checkbox in Chip mode</p>
    <ItemList>
      <SectionItem label="Chip Main" direction="column">
        <ItemContent>
          <MznTypography>Normal:</MznTypography>
          <MznCheckbox id="state-chip-1" label="Checkbox Label" name="state-chip-1" description="Supporting text" mode="chip" />
        </ItemContent>
        <ItemContent>
          <MznTypography>Checked:</MznTypography>
          <MznCheckbox id="state-chip-2" label="Checkbox Label" name="state-chip-2" description="Supporting text" mode="chip" checked />
        </ItemContent>
        <ItemContent>
          <MznTypography>Disabled:</MznTypography>
          <MznCheckbox id="state-chip-3" label="Checkbox Label" name="state-chip-3" description="Supporting text" mode="chip" disabled />
        </ItemContent>
      </SectionItem>
      <SectionItem label="Chip Sub" direction="column">
        <ItemContent>
          <MznTypography>Normal:</MznTypography>
          <MznCheckbox id="state-chip-sub-1" label="Checkbox Label" name="state-chip-sub-1" description="Supporting text" mode="chip" size="sub" />
        </ItemContent>
        <ItemContent>
          <MznTypography>Checked:</MznTypography>
          <MznCheckbox id="state-chip-sub-2" label="Checkbox Label" name="state-chip-sub-2" description="Supporting text" mode="chip" size="sub" checked />
        </ItemContent>
        <ItemContent>
          <MznTypography>Disabled:</MznTypography>
          <MznCheckbox id="state-chip-sub-3" label="Checkbox Label" name="state-chip-sub-3" description="Supporting text" mode="chip" size="sub" disabled />
        </ItemContent>
      </SectionItem>
      <SectionItem label="Chip Minor" direction="column">
        <ItemContent>
          <MznTypography>Normal:</MznTypography>
          <MznCheckbox id="state-chip-minor-1" label="Checkbox Label" name="state-chip-minor-1" description="Supporting text" mode="chip" size="minor" />
        </ItemContent>
        <ItemContent>
          <MznTypography>Checked:</MznTypography>
          <MznCheckbox id="state-chip-minor-2" label="Checkbox Label" name="state-chip-minor-2" description="Supporting text" mode="chip" size="minor" checked />
        </ItemContent>
        <ItemContent>
          <MznTypography>Disabled:</MznTypography>
          <MznCheckbox id="state-chip-minor-3" label="Checkbox Label" name="state-chip-minor-3" description="Supporting text" mode="chip" size="minor" disabled />
        </ItemContent>
      </SectionItem>
    </ItemList>
  `,
});

export const WithForm: Story = {
  render: () => ({
    components: { MznCheckbox, MznTypography },
    setup: () => {
      const formData = ref({
        agreeToTerms: false,
        subscribeNewsletter: false,
      });

      return {
        formData,
        formStyle: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          maxWidth: '400px',
        },
        handleSubmit: (event: Event): void => {
          event.preventDefault();
          // eslint-disable-next-line no-console
          console.log('Form submitted:', formData.value);
          alert(`Form Data: ${JSON.stringify(formData.value, null, 2)}`);
        },
        submitStyle: {
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px',
        },
      };
    },
    template: `
      <form :style="formStyle" @submit="handleSubmit">
        <MznTypography>簡單表單範例</MznTypography>

        <MznCheckbox
          :checked="formData.agreeToTerms"
          id="form-agree-to-terms"
          label="我同意服務條款"
          name="agreeToTerms"
          @change="formData = { ...formData, agreeToTerms: $event.target.checked }"
        />

        <MznCheckbox
          :checked="formData.subscribeNewsletter"
          description="訂閱我們的電子報以獲得最新消息"
          id="form-subscribe-newsletter"
          label="訂閱電子報"
          name="subscribeNewsletter"
          @change="formData = { ...formData, subscribeNewsletter: $event.target.checked }"
        />

        <button :style="submitStyle" type="submit">
          提交
        </button>
      </form>
    `,
  }),
};

export const WithEditableInputAndForm: Story = {
  render: () => ({
    components: { MznCheckbox, MznTypography },
    setup: () => {
      const formData = ref<{ options: string[]; otherOption: string }>({
        options: [],
        otherOption: '',
      });

      const isOtherChecked = computed((): boolean =>
        formData.value.options.includes('other'),
      );

      const toggleOption = (event: Event): void => {
        const target = event.target as HTMLInputElement;
        const { value } = target;

        formData.value = {
          ...formData.value,
          options: target.checked
            ? [...formData.value.options, value]
            : formData.value.options.filter((v) => v !== value),
        };
      };

      const editableInput = computed((): CheckboxProps['editableInput'] => ({
        value: formData.value.otherOption,
        onChange: (event: Event) => {
          formData.value = {
            ...formData.value,
            otherOption: (event.target as HTMLInputElement).value,
          };
        },
      }));

      return {
        editableInput,
        formData,
        formStyle: {
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          maxWidth: '500px',
        },
        handleSubmit: (event: Event): void => {
          event.preventDefault();
          // eslint-disable-next-line no-console
          console.log('Form submitted:', formData.value);
          alert(`Form Data: ${JSON.stringify(formData.value, null, 2)}`);
        },
        isOtherChecked,
        submitStyle: {
          padding: '8px 16px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '8px',
        },
        toggleOption,
        toggleOther: (event: Event): void => {
          const target = event.target as HTMLInputElement;
          const { value } = target;

          formData.value = {
            ...formData.value,
            options: target.checked
              ? [...formData.value.options, value]
              : formData.value.options.filter((v) => v !== value),
            otherOption: target.checked ? formData.value.otherOption : '',
          };
        },
      };
    },
    template: `
      <form :style="formStyle" @submit="handleSubmit">
        <MznTypography>表單整合範例</MznTypography>
        <MznTypography color="text-neutral">
          選擇「其他」選項後，需要填寫自訂內容才能提交。
        </MznTypography>

        <div style="display: flex; flex-direction: column; gap: 12px">
          <MznCheckbox
            :checked="formData.options.includes('option1')"
            id="form-option-1"
            label="選項 1"
            name="options"
            value="option1"
            @change="toggleOption"
          />

          <MznCheckbox
            :checked="formData.options.includes('option2')"
            id="form-option-2"
            label="選項 2"
            name="options"
            value="option2"
            @change="toggleOption"
          />

          <MznCheckbox
            :checked="isOtherChecked"
            :editable-input="editableInput"
            id="form-other"
            label="其他"
            name="options"
            value="other"
            with-edit-input
            @change="toggleOther"
          />
        </div>

        <MznTypography
          v-if="isOtherChecked && !formData.otherOption"
          variant="caption"
          color="text-error"
        >
          請輸入其他選項的內容
        </MznTypography>

        <button
          :disabled="isOtherChecked && !formData.otherOption"
          :style="submitStyle"
          type="submit"
        >
          提交
        </button>
      </form>
    `,
  }),
};
