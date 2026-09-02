import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import { NotificationIcon } from '@mezzanine-ui/icons';
import type {
  BadgeCountVariant,
  BadgeDotVariant,
} from '@mezzanine-ui/core/badge';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import MznBadge from './badge.vue';
import type { BadgeProps } from './badge.types';

export default {
  title: 'Data Display/Badge',
  component: MznBadge,
} satisfies Meta<typeof MznBadge>;

type Story = StoryObj<BadgeProps>;

const variants = [
  'dot-success',
  'dot-error',
  'dot-warning',
  'dot-info',
  'dot-inactive',
  'count-alert',
  'count-inactive',
  'count-inverse',
  'count-brand',
  'count-info',
] as const;

type PlaygroundArgs = {
  className: string;
  count: number;
  text: string;
  variant: BadgeDotVariant | BadgeCountVariant;
  overflowCount: number;
  children: string;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    className: '',
    count: undefined,
    text: '',
    variant: variants[0],
    overflowCount: undefined,
    children: undefined,
  },
  argTypes: {
    className: { control: 'text' },
    children: { control: false },
    count: { control: 'number' },
    overflowCount: { control: 'number' },
    text: { control: 'text' },
    variant: {
      control: 'select',
      options: variants,
    },
  },
  /**
   * Authored with `h()` so the default slot can be left genuinely absent. The
   * container class is derived from whether children exist, and a template
   * would always supply a slot function — flipping the class even when the
   * `children` arg is empty.
   */
  render:
    ({ children, className, ...args }) =>
    () =>
      h(
        MznBadge,
        { ...args, class: className } as never,
        children ? { default: () => children } : undefined,
      ),
};

const MockIconButton = {
  components: { MznIcon },
  setup: () => ({ NotificationIcon }),
  template: `
    <button
      type="button"
      style="display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background-color: transparent"
    >
      <MznIcon :icon="NotificationIcon" :size="16" />
    </button>
  `,
};

export const Variants: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    components: { MznBadge, MznTypography, MockIconButton },
    template: `
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); row-gap: 32px">
        <div style="display: flex; flex-direction: column; gap: 24px">
          <MznTypography variant="h2">Dot</MznTypography>

          <div style="display: flex; align-items: center">
            <MznTypography variant="body">Success</MznTypography>
            <MznBadge variant="dot-success">
              <MockIconButton />
            </MznBadge>
          </div>

          <div style="display: flex; align-items: center">
            <MznTypography variant="body">Error</MznTypography>
            <MznBadge variant="dot-error">
              <MockIconButton />
            </MznBadge>
          </div>

          <div style="display: flex; align-items: center">
            <MznTypography variant="body">Warning</MznTypography>
            <MznBadge variant="dot-warning">
              <MockIconButton />
            </MznBadge>
          </div>

          <div style="display: flex; align-items: center">
            <MznTypography variant="body">Info</MznTypography>
            <MznBadge variant="dot-info">
              <MockIconButton />
            </MznBadge>
          </div>

          <div style="display: flex; align-items: center">
            <MznTypography variant="body">Inactive</MznTypography>
            <MznBadge variant="dot-inactive">
              <MockIconButton />
            </MznBadge>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <MznTypography variant="h2">Dot with text</MznTypography>

          <div style="display: flex; align-items: center; gap: 8px">
            Success
            <MznBadge variant="dot-success" text="States" size="main" />
            <MznBadge variant="dot-success" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Error
            <MznBadge variant="dot-error" text="States" size="main" />
            <MznBadge variant="dot-error" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Warning
            <MznBadge variant="dot-warning" text="States" size="main" />
            <MznBadge variant="dot-warning" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Info
            <MznBadge variant="dot-info" text="States" size="main" />
            <MznBadge variant="dot-info" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Inactive
            <MznBadge variant="dot-inactive" text="States" size="main" />
            <MznBadge variant="dot-inactive" text="States" size="sub" />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <MznTypography variant="h2">Text only</MznTypography>

          <div style="display: flex; align-items: center; gap: 8px">
            Success
            <MznBadge variant="text-success" text="States" size="main" />
            <MznBadge variant="text-success" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Error
            <MznBadge variant="text-error" text="States" size="main" />
            <MznBadge variant="text-error" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Warning
            <MznBadge variant="text-warning" text="States" size="main" />
            <MznBadge variant="text-warning" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Info
            <MznBadge variant="text-info" text="States" size="main" />
            <MznBadge variant="text-info" text="States" size="sub" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Inactive
            <MznBadge variant="text-inactive" text="States" size="main" />
            <MznBadge variant="text-inactive" text="States" size="sub" />
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 24px">
          <MznTypography variant="h2">Count</MznTypography>

          <div style="display: flex; align-items: center; gap: 8px">
            Alert
            <MznBadge variant="count-alert" :count="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Inactive
            <MznBadge variant="count-inactive" :count="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Inverse
            <MznBadge variant="count-inverse" :count="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Brand
            <MznBadge variant="count-brand" :count="5" />
          </div>

          <div style="display: flex; align-items: center; gap: 8px">
            Info
            <MznBadge variant="count-info" :count="5" />
          </div>
        </div>
      </div>
    `,
  }),
};
