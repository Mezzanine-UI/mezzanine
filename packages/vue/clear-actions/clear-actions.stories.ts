import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznClearActions from './clear-actions.vue';
import type { ClearActionsProps } from './clear-actions.types';

const appearanceOptions = [
  {
    value: 'standard-base',
    label: 'Standard · Base Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'standard',
      variant: 'base',
    } as ClearActionsProps,
  },
  {
    value: 'standard-inverse',
    label: 'Standard · Inverse Button',
    backgroundColor: '#4F565F',
    props: {
      type: 'standard',
      variant: 'inverse',
    } as ClearActionsProps,
  },
  {
    value: 'embedded-contrast',
    label: 'Embedded · Contrast Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'embedded',
      variant: 'contrast',
    } as ClearActionsProps,
  },
  {
    value: 'embedded-emphasis',
    label: 'Embedded · Emphasis Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'embedded',
      variant: 'emphasis',
    } as ClearActionsProps,
  },
  {
    value: 'clearable-base',
    label: 'Clearable · Base Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'clearable',
    } as ClearActionsProps,
  },
] as const;

type ClearActionsAppearance = (typeof appearanceOptions)[number]['value'];

const appearanceMap = appearanceOptions.reduce<
  Record<ClearActionsAppearance, (typeof appearanceOptions)[number]>
>(
  (acc, option) => {
    acc[option.value] = option;

    return acc;
  },
  {} as Record<ClearActionsAppearance, (typeof appearanceOptions)[number]>,
);

const appearanceLabels = appearanceOptions.reduce<
  Record<ClearActionsAppearance, string>
>(
  (acc, option) => {
    acc[option.value] = option.label;

    return acc;
  },
  {} as Record<ClearActionsAppearance, string>,
);

const getAppearanceOption = <T extends ClearActionsAppearance>(value: T) =>
  appearanceMap[value] as Extract<
    (typeof appearanceOptions)[number],
    { value: T }
  >;

type PlaygroundArgs = Omit<ClearActionsProps, 'type' | 'variant'> & {
  appearance: ClearActionsAppearance;
};

const meta = {
  title: 'Internal/ClearActions',
  component: MznClearActions,
  argTypes: {
    type: {
      control: false,
      table: {
        disable: true,
      },
      description:
        'Contextual type is controlled via the appearance selector in stories.',
    },
    variant: {
      control: false,
      table: {
        disable: true,
      },
      description:
        'Variants are derived from the selected appearance in stories.',
    },
  },
} satisfies Meta<typeof MznClearActions>;

export default meta;

type Story = StoryObj<ClearActionsProps>;

const logOnClick = () => {
  // eslint-disable-next-line no-console
  console.log('ClearActions clicked');
};

const renderWithinBackground =
  (backgroundColor: string) => (args: Record<string, unknown>) => ({
    components: { MznClearActions },
    setup: () => ({ args, backgroundColor, logOnClick }),
    template: `
      <div :style="{ width: '100px', height: '100px', backgroundColor }">
        <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%">
          <MznClearActions v-bind="args" @click="logOnClick" />
        </div>
      </div>
    `,
  });

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    appearance: 'standard-base',
  },
  argTypes: {
    appearance: {
      control: {
        type: 'select',
      },
      options: appearanceOptions.map((option) => option.value),
      labels: appearanceLabels,
      description: 'Select one of the five design-approved combinations.',
    },
  },
  render: ({ appearance }) => {
    const option = appearanceMap[appearance];

    return {
      components: { MznClearActions },
      setup: () => ({
        finalProps: option.props,
        backgroundColor: option.backgroundColor,
        logOnClick,
      }),
      template: `
        <div :style="{ width: '100px', height: '100px', backgroundColor }">
          <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%">
            <MznClearActions v-bind="finalProps" @click="logOnClick" />
          </div>
        </div>
      `,
    };
  },
};

export const StandardBase: Story = {
  args: {
    type: 'standard',
    variant: 'base',
  },
  render: renderWithinBackground(
    getAppearanceOption('standard-base').backgroundColor,
  ),
};

export const StandardInverse: Story = {
  args: {
    type: 'standard',
    variant: 'inverse',
  },
  render: renderWithinBackground(
    getAppearanceOption('standard-inverse').backgroundColor,
  ),
};

export const EmbeddedContrast: Story = {
  args: {
    type: 'embedded',
    variant: 'contrast',
  },
  render: renderWithinBackground(
    getAppearanceOption('embedded-contrast').backgroundColor,
  ),
};

export const EmbeddedEmphasis: Story = {
  args: {
    type: 'embedded',
    variant: 'emphasis',
  },
  render: renderWithinBackground(
    getAppearanceOption('embedded-emphasis').backgroundColor,
  ),
};

export const ClearableBase: Story = {
  args: {
    type: 'clearable',
  },
  render: renderWithinBackground(
    getAppearanceOption('clearable-base').backgroundColor,
  ),
};
