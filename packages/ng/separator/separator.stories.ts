import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznSeparator } from './separator.component';

export default {
  title: 'Internal/Separator',
  decorators: [
    moduleMetadata({
      imports: [MznSeparator],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the separator',
      table: {
        type: { summary: 'SeparatorOrientation' },
        defaultValue: { summary: "'horizontal'" },
      },
    },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: `<hr mznSeparator [orientation]="orientation" />`,
  }),
};

export const Horizontal: Story = {
  render: () => ({
    template: `
      <div style="width: 100%; padding: 16px;">
        <hr mznSeparator orientation="horizontal" />
      </div>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <div style="display: flex; height: 100px; padding: 16px; gap: 16px;">
        <div>Left content</div>
        <hr mznSeparator orientation="vertical" />
        <div>Right content</div>
      </div>
    `,
  }),
};

export const Examples: Story = {
  render: () => ({
    template: `
      <div
        style="padding: 24px; display: flex; flex-direction: column; gap: 24px;"
      >
        <div>
          <h3 style="margin-bottom: 16px;">Horizontal Separator</h3>
          <p style="margin-bottom: 16px;">Content above the separator</p>
          <hr mznSeparator orientation="horizontal" />
          <p style="margin-top: 16px;">Content below the separator</p>
        </div>

        <div>
          <h3 style="margin-bottom: 16px;">Vertical Separator</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span>Left</span>
            <hr mznSeparator orientation="vertical" />
            <span>Middle</span>
            <hr mznSeparator orientation="vertical" />
            <span>Right</span>
          </div>
        </div>
      </div>
    `,
  }),
};
