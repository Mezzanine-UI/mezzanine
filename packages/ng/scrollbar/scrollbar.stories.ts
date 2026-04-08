import { Meta, StoryObj } from '@storybook/angular';
import { MznScrollbar } from './scrollbar.component';

const meta: Meta<MznScrollbar> = {
  title: 'Internal/Scrollbar',
  component: MznScrollbar,
};

export default meta;

type Story = StoryObj<MznScrollbar>;

export const Playground: Story = {
  argTypes: {
    maxHeight: {
      control: 'text',
    },
    maxWidth: {
      control: 'text',
    },
  },
  args: {
    maxHeight: '300px',
    maxWidth: undefined,
  },
  render: (args) => ({
    props: {
      ...args,
      items: Array.from({ length: 20 }, (_, i) => i + 1),
    },
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px;">
        <div mznScrollbar [maxHeight]="maxHeight" [maxWidth]="maxWidth">
          <div style="padding: 16px;">
            @for (i of items; track i) {
              <p style="margin-bottom: 12px;">{{ i }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            }
          </div>
        </div>
      </div>
    `,
  }),
};

export const VerticalScroll: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px;">
        <div mznScrollbar maxHeight="300px">
          <div style="padding: 16px;">
            @for (i of items; track i) {
              <p style="margin-bottom: 12px;">{{ i }}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            }
          </div>
        </div>
      </div>
    `,
    props: {
      items: Array.from({ length: 20 }, (_, i) => i + 1),
    },
  }),
};

export const HorizontalScroll: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px;">
        <div mznScrollbar>
          <div style="display: flex; flex-flow: row nowrap; padding: 16px; white-space: nowrap;">
            @for (i of items; track i) {
              <p style="margin-bottom: 12px; flex-shrink: 0;">{{ i }}. This is a very long line of text that will cause horizontal scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            }
          </div>
        </div>
      </div>
    `,
    props: {
      items: Array.from({ length: 10 }, (_, i) => i + 1),
    },
  }),
};

export const NestedScrollable: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px;">
        <div mznScrollbar maxHeight="400px">
          <div style="padding: 16px;">
            <h3 style="margin-bottom: 16px;">Outer Scrollable Container</h3>
            <p style="margin-bottom: 16px;">This is the outer scrollable area. Below is a nested scrollable container.</p>
            <div style="border: 1px dashed #999; border-radius: 4px; margin-bottom: 16px;">
              <div mznScrollbar maxHeight="150px">
                <div style="display: flex; flex-flow: column; padding: 12px;">
                  <strong style="margin-bottom: 8px;">Nested Scrollable Container</strong>
                  @for (i of nestedItems; track i) {
                    <span style="margin-bottom: 8px; font-size: 0.85em;">Nested item {{ i }}: Lorem ipsum dolor sit amet.</span>
                  }
                </div>
              </div>
            </div>
            @for (i of outerItems; track i) {
              <p style="margin-bottom: 12px;">Outer content item {{ i }}: Sed do eiusmod tempor incididunt ut labore.</p>
            }
          </div>
        </div>
      </div>
    `,
    props: {
      nestedItems: Array.from({ length: 10 }, (_, i) => i + 1),
      outerItems: Array.from({ length: 15 }, (_, i) => i + 1),
    },
  }),
};
