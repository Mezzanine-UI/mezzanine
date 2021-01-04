import { boolean } from '@storybook/addon-knobs';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { Icon } from '..';
import Button, { ButtonGroup, IconButton } from '.';

export default {
  title: 'Basic/Button/ButtonGroup',
};

export const Group = () => {
  const orientation = boolean('vertical', false) ? 'vertical' : 'horizontal';
  const attached = boolean('attached', false);

  return (
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
        color="error"
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
