import { useState, useCallback } from 'react';
import { StoryFn, Meta } from '@storybook/react-webpack5';
import Drawer, { DrawerProps } from '.';
import { Button } from '../index';

export default {
  title: 'Navigation/Drawer',
} as Meta;

type PlaygroundStoryArgs = DrawerProps;

export const Playground: StoryFn<PlaygroundStoryArgs> = ({
  disableCloseOnBackdropClick,
  disableCloseOnEscapeKeyDown,
  size,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={() => handleClick()} variant="base-text-link">
        OPEN
      </Button>

      <Drawer
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
        onClose={handleClose}
        open={open}
        header={{ title: 'Drawer Title' }}
        size={size}
        bottom={{
          ghostActionText: '更多選項',
          onGhostActionClick: handleClose,
          secondaryActionText: '取消',
          onSecondaryActionClick: handleClose,
          primaryActionText: '儲存變更',
          onPrimaryActionClick: handleClose,
        }}
      >
        content
      </Drawer>
    </>
  );
};

Playground.args = {
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  size: 'medium',
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
  size: {
    control: {
      type: 'radio',
    },
    options: ['narrow', 'medium', 'wide'],
  },
};
