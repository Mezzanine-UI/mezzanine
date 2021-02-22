import { Story, Meta } from '@storybook/react';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { ButtonGroupOrientation } from '@mezzanine-ui/core/button';
import { Icon } from '..';
import Button, { ButtonGroup, ButtonGroupProps, IconButton } from '.';

export default {
  title: 'General/Button/ButtonGroup',
} as Meta;

const orientations: ButtonGroupOrientation[] = [
  'horizontal',
  'vertical',
];

export const Playgroud: Story<ButtonGroupProps> = ({ attached, orientation }) => (
  <>
    <ButtonGroup
      attached={attached}
      color="primary"
      variant="contained"
      size="large"
      orientation={orientation}
    >
      <Button>one</Button>
      <Button>two</Button>
      <Button>three</Button>
    </ButtonGroup>
    <br />
    <br />
    <ButtonGroup
      attached={attached}
      color="secondary"
      variant="outlined"
      size="medium"
      orientation={orientation}
    >
      <Button>one</Button>
      <Button>two</Button>
      <Button>three</Button>
    </ButtonGroup>
    <br />
    <br />
    <ButtonGroup
      attached={attached}
      danger
      variant="text"
      size="small"
      orientation={orientation}
    >
      <Button>one</Button>
      <Button>two</Button>
      <Button>three</Button>
    </ButtonGroup>
  </>
);

Playgroud.args = {
  attached: false,
  orientation: 'horizontal',
};
Playgroud.argTypes = {
  orientation: {
    control: {
      type: 'select',
      options: orientations,
    },
  },
};

export const DropdownLike = () => (
  <>
    <ButtonGroup
      attached
      color="primary"
      variant="contained"
    >
      <Button>click</Button>
      <IconButton>
        <Icon icon={ChevronDownIcon} />
      </IconButton>
    </ButtonGroup>
    <br />
    <br />
    <ButtonGroup
      attached
      color="primary"
      variant="outlined"
    >
      <Button>click</Button>
      <IconButton>
        <Icon icon={ChevronDownIcon} />
      </IconButton>
    </ButtonGroup>
  </>
);
