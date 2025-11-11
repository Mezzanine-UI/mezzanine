import { Meta, StoryObj } from '@storybook/react-webpack5';
import DismissButton, { DismissButtonProps } from '.';

const appearanceOptions = [
  {
    value: 'standard-base',
    label: 'Standard · Base Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'standard',
      variant: 'base',
    } as Pick<DismissButtonProps, 'type' | 'variant'>,
  },
  {
    value: 'standard-inverse',
    label: 'Standard · Inverse Button',
    backgroundColor: '#4F565F',
    props: {
      type: 'standard',
      variant: 'inverse',
    } as Pick<DismissButtonProps, 'type' | 'variant'>,
  },
  {
    value: 'embedded-contrast',
    label: 'Embedded · Contrast Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'embedded',
      variant: 'contrast',
    } as Pick<DismissButtonProps, 'type' | 'variant'>,
  },
  {
    value: 'embedded-emphasis',
    label: 'Embedded · Emphasis Button',
    backgroundColor: '#F3F4F6',
    props: {
      type: 'embedded',
      variant: 'emphasis',
    } as Pick<DismissButtonProps, 'type' | 'variant'>,
  },
] as const;

type DismissButtonAppearance =
  (typeof appearanceOptions)[number]['value'];

const appearanceMap = appearanceOptions.reduce<
  Record<
    DismissButtonAppearance,
    (typeof appearanceOptions)[number]
  >
>((acc, option) => {
  acc[option.value] = option;

  return acc;
}, {} as Record<DismissButtonAppearance, (typeof appearanceOptions)[number]>);

const appearanceLabels = appearanceOptions.reduce<
  Record<DismissButtonAppearance, string>
>((acc, option) => {
  acc[option.value] = option.label;

  return acc;
}, {} as Record<DismissButtonAppearance, string>);

const getAppearanceOption = <T extends DismissButtonAppearance>(
  value: T,
) =>
  appearanceMap[value] as Extract<
    (typeof appearanceOptions)[number],
    { value: T }
  >;

type PlaygroundArgs = Omit<DismissButtonProps, 'type' | 'variant'> & {
  appearance: DismissButtonAppearance;
};

const meta: Meta<typeof DismissButton> = {
  title: 'Internal/DismissButton',
  component: DismissButton,
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
};

export default meta;

type Story = StoryObj<typeof DismissButton>;

const renderWithinBackground =
  (backgroundColor: string) =>
    (args: DismissButtonProps) =>
    (
      <div style={{ width: '100px', height: '100px', backgroundColor }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <DismissButton {...args} />
        </div>
      </div>
    );

const logOnClick = () => {
  // eslint-disable-next-line no-console
  console.log('DismissButton clicked');
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    appearance: 'standard-base',
    onClick: logOnClick,
  },
  argTypes: {
    appearance: {
      control: {
        type: 'select',
      },
      options: appearanceOptions.map((option) => option.value),
      labels: appearanceLabels,
      description:
        'Select one of the four design-approved combinations.',
    },
  },
  render: ({ appearance, ...rest }) => {
    const option = appearanceMap[appearance];
    const finalProps = {
      ...rest,
      ...option.props,
    } as DismissButtonProps;

    return (
      <div
        style={{
          width: '100px',
          height: '100px',
          backgroundColor: option.backgroundColor,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <DismissButton {...finalProps} />
        </div>
      </div>
    );
  },
};

export const StandardBase: Story = {
  args: {
    onClick: logOnClick,
    type: 'standard',
    variant: 'base',
  },
  render: renderWithinBackground(
    getAppearanceOption('standard-base').backgroundColor,
  ),
};

export const StandardInverse: Story = {
  args: {
    onClick: logOnClick,
    type: 'standard',
    variant: 'inverse',
  },
  render: renderWithinBackground(
    getAppearanceOption('standard-inverse').backgroundColor,
  ),
};

export const EmbeddedContrast: Story = {
  args: {
    onClick: logOnClick,
    type: 'embedded',
    variant: 'contrast',
  },
  render: renderWithinBackground(
    getAppearanceOption('embedded-contrast').backgroundColor,
  ),
};

export const EmbeddedEmphasis: Story = {
  args: {
    onClick: logOnClick,
    type: 'embedded',
    variant: 'emphasis',
  },
  render: renderWithinBackground(
    getAppearanceOption('embedded-emphasis').backgroundColor,
  ),
};
