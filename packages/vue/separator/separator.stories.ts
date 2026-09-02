import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznSeparator from './separator.vue';
import type { SeparatorProps } from './separator.types';

const meta: Meta<typeof MznSeparator> = {
  title: 'Internal/Separator',
  component: MznSeparator,
};

export default meta;

type Story = StoryObj<SeparatorProps>;

export const Playground: Story = {
  args: {
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
      table: {
        type: { summary: 'SeparatorOrientation' },
        defaultValue: { summary: "'horizontal'" },
      },
    },
  },
};

export const Horizontal: Story = {
  render: () => ({
    components: { MznSeparator },
    template: `
      <div style="width: 100%; padding: 16px">
        <MznSeparator orientation="horizontal" />
      </div>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    components: { MznSeparator },
    template: `
      <div style="display: flex; height: 100px; padding: 16px; gap: 16px">
        <div>Left content</div>
        <MznSeparator orientation="vertical" />
        <div>Right content</div>
      </div>
    `,
  }),
};

export const Examples: Story = {
  render: () => ({
    components: { MznSeparator },
    template: `
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px">
        <div>
          <h3 style="margin-bottom: 16px">Horizontal Separator</h3>
          <p style="margin-bottom: 16px">Content above the separator</p>
          <MznSeparator orientation="horizontal" />
          <p style="margin-top: 16px">Content below the separator</p>
        </div>

        <div>
          <h3 style="margin-bottom: 16px">Vertical Separator</h3>
          <div style="display: flex; align-items: center; gap: 16px">
            <span>Left</span>
            <MznSeparator orientation="vertical" />
            <span>Middle</span>
            <MznSeparator orientation="vertical" />
            <span>Right</span>
          </div>
        </div>
      </div>
    `,
  }),
};
