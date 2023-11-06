import { useState, useCallback } from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Drawer, { DrawerProps, DrawerPlacement } from '.';
import Button from '../Button';

export default {
  title: 'Navigation/Drawer',
} as Meta;

type PlaygroundStoryArgs = DrawerProps;

const placements: DrawerPlacement[] = ['top', 'right', 'bottom', 'left'];

export const Playground: StoryFn<PlaygroundStoryArgs> = ({
  disableCloseOnBackdropClick,
  disableCloseOnEscapeKeyDown,
  placement,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button
        onClick={() => handleClick()}
        variant="contained"
      >
        OPEN
      </Button>

      <Drawer
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
        onClose={handleClose}
        open={open}
        placement={placement}
      >
        content
      </Drawer>
    </>
  );
};

Playground.args = {
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
};

Playground.argTypes = {
  disableCloseOnBackdropClick: {
    control: {
      type: 'boolean',
    },
  },
  disableCloseOnEscapeKeyDown: {
    control: {
      type: 'boolean',
    },
  },
  placement: {
    control: {
      type: 'select',
      options: placements,
    },
  },
};
