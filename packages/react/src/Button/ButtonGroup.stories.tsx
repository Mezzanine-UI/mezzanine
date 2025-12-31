import { StoryObj, Meta } from '@storybook/react-webpack5';
import { PlusIcon } from '@mezzanine-ui/icons';
import { ButtonGroupOrientation } from '@mezzanine-ui/core/button';
import Button, { ButtonGroup, ButtonGroupProps } from '.';

export default {
  title: 'Foundation/Button/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>;

type Story = StoryObj<ButtonGroupProps>;

const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

export const Playground: Story = {
  argTypes: {
    orientation: {
      options: orientations,
      control: {
        type: 'select',
      },
    },
  },
  args: {
    orientation: 'horizontal',
  },
  render: ({ orientation }) => (
    <>
      <ButtonGroup variant="base-primary" size="main" orientation={orientation}>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <br />
      <br />
      <ButtonGroup
        variant="base-secondary"
        size="sub"
        orientation={orientation}
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
      <br />
      <br />
      <ButtonGroup
        variant="destructive-primary"
        size="minor"
        orientation={orientation}
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </>
  ),
};

export const Variants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ButtonGroup variant="base-primary">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="base-secondary">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="base-tertiary">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="destructive-primary">
        <Button>Delete</Button>
        <Button>Remove</Button>
        <Button>Clear</Button>
      </ButtonGroup>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ButtonGroup variant="base-primary">
        <Button icon={{ position: 'leading', src: PlusIcon }}>Add</Button>
        <Button icon={{ position: 'leading', src: PlusIcon }}>Create</Button>
        <Button icon={{ position: 'leading', src: PlusIcon }}>New</Button>
      </ButtonGroup>

      <ButtonGroup variant="base-secondary">
        <Button icon={{ position: 'icon-only', src: PlusIcon }} />
        <Button icon={{ position: 'icon-only', src: PlusIcon }} />
        <Button icon={{ position: 'icon-only', src: PlusIcon }} />
      </ButtonGroup>
    </div>
  ),
};

export const Orientation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '48px' }}>
      <ButtonGroup variant="base-primary" orientation="horizontal">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="base-secondary" orientation="vertical">
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ButtonGroup variant="base-primary" fullWidth>
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>

      <ButtonGroup variant="base-secondary" fullWidth>
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ButtonGroup variant="base-primary">
        <Button variant="base-secondary">Normal</Button>
        <Button variant="base-tertiary" disabled>
          Disabled
        </Button>
        <Button loading>Loading</Button>
      </ButtonGroup>

      <ButtonGroup variant="base-primary" disabled>
        <Button>All</Button>
        <Button>Disabled</Button>
        <Button>Group</Button>
      </ButtonGroup>
    </div>
  ),
};
