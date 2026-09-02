import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import MznTypography from '../typography/typography.vue';
import MznScrollbar from './scrollbar.vue';
import type { ScrollbarProps } from './scrollbar.types';

export default {
  title: 'Internal/Scrollbar',
  component: MznScrollbar,
} satisfies Meta<typeof MznScrollbar>;

type Story = StoryObj<ScrollbarProps>;

/**
 * The content helpers are authored with `h()` rather than templates. React's
 * `{i + 1}. Lorem ipsum…` emits two adjacent text nodes — the number and the
 * rest of the sentence — and a template compiler would merge them into one.
 */
const LongContent = {
  render: () =>
    h(
      'div',
      { style: { padding: '16px' } },
      Array.from({ length: 20 }, (_, i) =>
        h(
          MznTypography,
          { key: i, variant: 'body', style: { marginBottom: '12px' } },
          () => [
            String(i + 1),
            '. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
          ],
        ),
      ),
    ),
};

const WideContent = {
  render: () =>
    h(
      'div',
      {
        style: {
          display: 'flex',
          flexFlow: 'row nowrap',
          padding: '16px',
          whiteSpace: 'nowrap',
        },
      },
      Array.from({ length: 10 }, (_, i) =>
        h(
          MznTypography,
          {
            key: i,
            variant: 'body',
            style: { marginBottom: '12px', flexShrink: 0 },
          },
          () => [
            String(i + 1),
            '. This is a very long line of text that will cause horizontal scrolling. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          ],
        ),
      ),
    ),
};

export const Playground: StoryObj<ScrollbarProps> = {
  args: {
    maxHeight: 300,
    maxWidth: undefined,
  },
  argTypes: {
    maxHeight: {
      control: 'number',
    },
    maxWidth: {
      control: 'number',
    },
  },
  render: (args) => ({
    components: { MznScrollbar, LongContent },
    setup: () => ({ args }),
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px">
        <MznScrollbar v-bind="args">
          <LongContent />
        </MznScrollbar>
      </div>
    `,
  }),
};

export const VerticalScroll: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    components: { MznScrollbar, LongContent },
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px">
        <MznScrollbar :max-height="300">
          <LongContent />
        </MznScrollbar>
      </div>
    `,
  }),
};

export const HorizontalScroll: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    components: { MznScrollbar, WideContent },
    template: `
      <div style="border: 1px solid #e0e0e0; border-radius: 4px">
        <MznScrollbar>
          <WideContent />
        </MznScrollbar>
      </div>
    `,
  }),
};

export const NestedScrollable: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => () =>
    h('div', { style: { border: '1px solid #e0e0e0', borderRadius: '4px' } }, [
      h(MznScrollbar, { maxHeight: 400 }, () =>
        h('div', { style: { padding: '16px' } }, [
          h(
            MznTypography,
            { variant: 'h3', style: { marginBottom: '16px' } },
            () => 'Outer Scrollable Container',
          ),
          h(
            MznTypography,
            { variant: 'body', style: { marginBottom: '16px' } },
            () =>
              'This is the outer scrollable area. Below is a nested scrollable container.',
          ),
          h(
            'div',
            {
              style: {
                border: '1px dashed #999',
                borderRadius: '4px',
                marginBottom: '16px',
              },
            },
            [
              h(MznScrollbar, { maxHeight: 150 }, () =>
                h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      flexFlow: 'column',
                      padding: '12px',
                    },
                  },
                  [
                    h(
                      MznTypography,
                      {
                        variant: 'body-highlight',
                        style: { marginBottom: '8px' },
                      },
                      () => 'Nested Scrollable Container',
                    ),
                    ...Array.from({ length: 10 }, (_, i) =>
                      h(
                        MznTypography,
                        {
                          key: i,
                          variant: 'caption',
                          style: { marginBottom: '8px' },
                        },
                        () => [
                          'Nested item ',
                          String(i + 1),
                          ': Lorem ipsum dolor sit amet.',
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          ...Array.from({ length: 15 }, (_, i) =>
            h(
              MznTypography,
              { key: i, variant: 'body', style: { marginBottom: '12px' } },
              () => [
                'Outer content item ',
                String(i + 1),
                ': Sed do eiusmod tempor incididunt ut labore.',
              ],
            ),
          ),
        ]),
      ),
    ]),
};
