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
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
    },
  },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: `<mzn-separator [orientation]="orientation" />`,
  }),
};

export const Horizontal: Story = {
  render: () => ({
    template: `
      <div>
        <p>Content above</p>
        <mzn-separator />
        <p>Content below</p>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px; height: 40px;">
        <span>Left</span>
        <mzn-separator orientation="vertical" />
        <span>Right</span>
      </div>
    `,
  }),
};

export const Examples: Story = {
  render: () => ({
    template: `
      <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 16px;">Horizontal Separator</h3>
          <p style="margin-bottom: 16px;">Content above the separator</p>
          <mzn-separator orientation="horizontal" />
          <p style="margin-top: 16px;">Content below the separator</p>
        </div>

        <div>
          <h3 style="margin-bottom: 16px;">Vertical Separator</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span>Left</span>
            <mzn-separator orientation="vertical" />
            <span>Middle</span>
            <mzn-separator orientation="vertical" />
            <span>Right</span>
          </div>
        </div>
      </div>
    `,
  }),
};
