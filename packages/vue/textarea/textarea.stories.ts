import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznTypography from '../typography/typography.vue';
import MznTextarea from './textarea.vue';
import type { TextareaProps } from './textarea.types';

export default {
  title: 'Data Entry/Textarea',
  component: MznTextarea,
} satisfies Meta<typeof MznTextarea>;

/**
 * `className`, `id` and `placeholder` are native attributes, not props. React's
 * story reaches them through `TextareaProps`' native-element base; the Vue props
 * interface deliberately carries only the component's own props, so the story
 * spells them out here and the template binds them as attributes.
 */
type StoryArgs = TextareaProps & {
  className?: string;
  id?: string;
  placeholder?: string;
};

type Story = StoryObj<StoryArgs>;

export const Playground: Story = {
  args: {
    className: '',
    disabled: false,
    id: 'test-id-01',
    placeholder: '輸入文字...',
    readOnly: false,
    resize: 'none',
    type: 'default',
    textareaClassName: '',
  },
  argTypes: {
    className: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    readOnly: { control: 'boolean' },
    resize: {
      control: 'inline-radio',
      options: ['none', 'both', 'horizontal', 'vertical'],
    },
    type: {
      control: 'select',
      options: ['default', 'warning', 'error'],
    },
    textareaClassName: { control: 'text' },
  },
  render: (args) => ({
    components: { MznTextarea },
    setup: () => ({ args }),
    template: `
      <MznTextarea
        :class="args.className"
        :disabled="args.disabled"
        :id="args.id"
        :placeholder="args.placeholder"
        :read-only="args.readOnly"
        :resize="args.resize"
        :type="args.type"
        textarea-class-name="aa"
      />
    `,
  }),
};

const TypeRow = {
  components: { MznTypography },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  template: `
    <div>
      <MznTypography variant="h2">{{ title }}</MznTypography>
      <div style="display: flex; gap: 24px"><slot /></div>
    </div>
  `,
};

const TypeRowItem = {
  components: { MznTypography },
  props: {
    caption: {
      type: String,
      required: true,
    },
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px">
      <MznTypography variant="caption">{{ caption }}</MznTypography>
      <slot />
    </div>
  `,
};

export const Types: Story = {
  render: () => ({
    components: { MznTextarea, TypeRow, TypeRowItem },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <TypeRow title="Default">
          <TypeRowItem caption="Default">
            <MznTextarea
              type="default"
              placeholder="Enter a description..."
              resize="horizontal"
            />
          </TypeRowItem>
          <TypeRowItem caption="Filled">
            <MznTextarea
              type="default"
              placeholder="輸入文字..."
              defaultValue="Lorem ipsum dolor sit amet"
            />
          </TypeRowItem>
        </TypeRow>
        <TypeRow title="Warning">
          <TypeRowItem caption="Default">
            <MznTextarea type="warning" placeholder="Enter a description..." />
          </TypeRowItem>
          <TypeRowItem caption="Filled">
            <MznTextarea
              type="warning"
              placeholder="輸入文字..."
              defaultValue="Lorem ipsum dolor sit amet"
            />
          </TypeRowItem>
        </TypeRow>
        <TypeRow title="Error">
          <TypeRowItem caption="Default">
            <MznTextarea type="error" placeholder="Enter a description..." />
          </TypeRowItem>
          <TypeRowItem caption="Filled">
            <MznTextarea
              type="error"
              placeholder="輸入文字..."
              defaultValue="Lorem ipsum dolor sit amet"
            />
          </TypeRowItem>
        </TypeRow>
      </div>
    `,
  }),
};
