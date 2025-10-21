import { StoryFn, Meta } from '@storybook/react-webpack5';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { ButtonGroupOrientation } from '@mezzanine-ui/core/button';
import { Icon } from '..';
import Button, { ButtonGroup, ButtonGroupProps, IconButton } from '.';
import ConfigProvider from '../Provider';

export default {
  title: 'General/Button/ButtonGroup',
} as Meta;

const orientations: ButtonGroupOrientation[] = ['horizontal', 'vertical'];

export const Playground: StoryFn<ButtonGroupProps> = ({
  attached,
  orientation,
}) => (
  <>
    <ConfigProvider size="large">
      <ButtonGroup
        attached={attached}
        color="primary"
        variant="contained"
        orientation={orientation}
      >
        <Button>one</Button>
        <Button>two</Button>
        <Button>three</Button>
      </ButtonGroup>
    </ConfigProvider>
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

Playground.args = {
  attached: false,
  orientation: 'horizontal',
};
Playground.argTypes = {
  orientation: {
    options: orientations,
    control: {
      type: 'select',
    },
  },
};

export const DropdownLike = () => (
  <>
    <ButtonGroup attached color="primary" variant="contained">
      <Button>click</Button>
      <IconButton>
        <Icon icon={ChevronDownIcon} />
      </IconButton>
    </ButtonGroup>
    <br />
    <br />
    <ButtonGroup attached color="primary" variant="outlined">
      <Button>click</Button>
      <IconButton>
        <Icon icon={ChevronDownIcon} />
      </IconButton>
    </ButtonGroup>
  </>
);
