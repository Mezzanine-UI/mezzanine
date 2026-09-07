import type { Meta, StoryFn, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent } from 'vue';
import MznTag from '../tag/tag.vue';
import MznTypography from '../typography/typography.vue';
import MznProgress from './progress.vue';
import type { ProgressProps } from './progress.types';

export default {
  component: MznProgress,
  title: 'Feedback/Progress',
} as Meta;

type Story = StoryObj<typeof MznProgress>;

const types: ProgressProps['type'][] = ['progress', 'percent', 'icon'];
const statuses: ProgressProps['status'][] = ['enabled', 'success', 'error'];

export const Playground: Story = {
  args: {
    percent: 50,
    status: 'enabled',
    tick: undefined,
    type: 'progress',
  },
  argTypes: {
    icons: {
      control: false,
      table: {
        disable: true,
      },
    },
    percent: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'The progress percent(0~100)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    percentProps: {
      control: false,
      table: {
        disable: true,
      },
    },
    status: {
      control: {
        type: 'select',
      },
      options: [...statuses],
      description:
        'Force mark the progress status. automatically set if not defined. (enabled(0~99) or success(100) depending on percent)',
      table: {
        type: { summary: "'enabled' | 'success' | 'error' | undefined" },
      },
    },
    tick: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'The tick of progress (0~100). Only shows when tick < 100',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    type: {
      control: {
        type: 'select',
      },
      options: types,
      description: 'The type of progress display',
      table: {
        type: { summary: "'progress' | 'percent' | 'icon'" },
        defaultValue: { summary: "'progress'" },
      },
    },
  },
  render: (args) => ({
    components: { MznProgress },
    setup: () => ({ args }),
    template: '<MznProgress v-bind="args" />',
  }),
};

const ProgressSection = defineComponent({
  name: 'ProgressSection',
  components: { MznTypography },
  props: { title: { type: String, required: true } },
  setup: () => ({
    hostStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '48px',
    },
  }),
  template: `
    <div :style="hostStyle">
      <MznTypography variant="h2">{{ title }}</MznTypography>
      <slot />
    </div>
  `,
});

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
      justifyContent: 'center',
      alignItems: 'center',
      height: props.direction === 'row' ? '20px' : 'auto',
      flexDirection: props.direction,
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
      gap: '8px',
      width: '100%',
      marginBottom: '16px',
    },
  }),
  template: '<div :style="hostStyle"><slot /></div>',
});

export const Line: StoryFn<Record<string, unknown>> = () => ({
  components: {
    ItemContent,
    ItemList,
    MznProgress,
    MznTypography,
    ProgressSection,
    SectionItem,
  },
  // React returns a fragment here, so the template keeps both roots too.
  template: `
    <ProgressSection title="Type:">
      <ItemList>
        <SectionItem label="Progress">
          <MznProgress :percent="40" />
        </SectionItem>
        <SectionItem label="Without Progress Status">
          <MznProgress :percent="50" type="percent" />
        </SectionItem>
        <SectionItem label="With Icon">
          <MznProgress :percent="100" status="success" type="icon" />
        </SectionItem>
      </ItemList>
    </ProgressSection>

    <ProgressSection title="Variant:">
      <ItemList>
        <SectionItem label="Enabled" direction="column">
          <ItemContent>
            <MznTypography>Without Progress Status</MznTypography>
            <MznProgress :percent="45" status="enabled" :tick="20" />
          </ItemContent>
          <ItemContent>
            <MznTypography>With Percent</MznTypography>
            <MznProgress :percent="45" status="enabled" type="percent" />
          </ItemContent>
        </SectionItem>
        <SectionItem label="Success" direction="column">
          <ItemContent>
            <MznTypography>Without Progress Status</MznTypography>
            <MznProgress :percent="100" status="success" :tick="90" />
          </ItemContent>
          <ItemContent>
            <MznTypography>With Percent</MznTypography>
            <MznProgress :percent="100" status="success" type="percent" />
          </ItemContent>
          <ItemContent>
            <MznTypography>With Icon</MznTypography>
            <MznProgress :percent="100" status="success" type="icon" />
          </ItemContent>
        </SectionItem>
        <SectionItem label="Error" direction="column">
          <ItemContent>
            <MznTypography>Without Progress Status</MznTypography>
            <MznProgress :percent="60" status="error" :tick="90" />
          </ItemContent>
          <ItemContent>
            <MznTypography>With Percent</MznTypography>
            <MznProgress :percent="60" status="error" type="percent" />
          </ItemContent>
          <ItemContent>
            <MznTypography>With Icon</MznTypography>
            <MznProgress :percent="60" status="error" type="icon" />
          </ItemContent>
        </SectionItem>
      </ItemList>
    </ProgressSection>
  `,
});
