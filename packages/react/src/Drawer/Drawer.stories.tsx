import { useCallback, useState } from 'react';
import { StoryObj } from '@storybook/react-webpack5';
import Drawer, { DrawerProps } from '.';
import { Button } from '../index';

export default {
  title: 'Navigation/Drawer',
};

export const Playground: StoryObj<DrawerProps> = {
  argTypes: {
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
  },
  args: {
    disableCloseOnBackdropClick: false,
    disableCloseOnEscapeKeyDown: false,
    size: 'medium',
  },
  render: function Render({
    disableCloseOnBackdropClick,
    disableCloseOnEscapeKeyDown,
    size,
  }) {
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
          bottom={{
            ghostActionText: '更多選項',
            onGhostActionClick: handleClose,
            onPrimaryActionClick: handleClose,
            onSecondaryActionClick: handleClose,
            primaryActionText: '儲存變更',
            secondaryActionText: '取消',
          }}
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          header={{ title: 'Drawer Title' }}
          onClose={handleClose}
          open={open}
          size={size}
        >
          content
        </Drawer>
      </>
    );
  },
};
