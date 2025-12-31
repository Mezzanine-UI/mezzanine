import { useCallback, useState } from 'react';
import { StoryObj } from '@storybook/react-webpack5';
import Drawer, { DrawerProps } from '.';
import { Button } from '../index';

export default {
  title: 'Feedback/Drawer',
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
    isBottomDisplay: {
      control: {
        type: 'boolean',
      },
    },
    isHeaderDisplay: {
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
    isBottomDisplay: true,
    isHeaderDisplay: true,
    size: 'medium',
  },
  render: function Render({
    disableCloseOnBackdropClick,
    disableCloseOnEscapeKeyDown,
    isBottomDisplay,
    isHeaderDisplay,
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
          bottomGhostActionText="更多選項"
          bottomOnGhostActionClick={handleClose}
          bottomOnPrimaryActionClick={handleClose}
          bottomOnSecondaryActionClick={handleClose}
          bottomPrimaryActionText="儲存變更"
          bottomSecondaryActionText="取消"
          disableCloseOnBackdropClick={disableCloseOnBackdropClick}
          disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
          headerTitle="Drawer Title"
          isBottomDisplay={isBottomDisplay}
          isHeaderDisplay={isHeaderDisplay}
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
