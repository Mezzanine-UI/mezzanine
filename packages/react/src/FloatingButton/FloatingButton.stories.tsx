import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import FloatingButton from './FloatingButton';
import { PlusIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import Modal from '../Modal';
import { CloseIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Others/Floating Button',
  component: FloatingButton,
} as Meta;

type Story = StoryObj<typeof FloatingButton>;

export const Basic: Story = {
  render: function BasicStory() {
    return (
      <div style={{ width: '100%', height: '200vh' }}>
        Scroll down
        <FloatingButton icon={PlusIcon} iconType="leading">
          Button
        </FloatingButton>
      </div>
    );
  },
};

export const IconOnly: Story = {
  render: function IconOnlyStory() {
    return (
      <div style={{ width: '100%', height: '200vh' }}>
        Scroll down
        <FloatingButton icon={PlusIcon} iconType="icon-only">
          加入清單
        </FloatingButton>
      </div>
    );
  },
};

export const AutoHideWhenOpen: Story = {
  render: function AutoHideWhenOpenStory() {
    const [open, setOpen] = useState(false);

    return (
      <div
        style={{
          width: '100%',
          height: '200vh',
          display: 'flex',
          flexFlow: 'row',
        }}
      >
        <div style={{ flex: 1 }}>
          Scroll down
          <FloatingButton
            autoHideWhenOpen
            open={open}
            onClick={() => setOpen((prev) => !prev)}
          >
            Open
          </FloatingButton>
        </div>
        {open && (
          <div
            style={{
              width: '250px',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          >
            <Button
              onClick={() => setOpen(false)}
              icon={CloseIcon}
              iconType="icon-only"
            />
          </div>
        )}
      </div>
    );
  },
};

export const WithModal: Story = {
  render: function WithModalStory() {
    const [open, setOpen] = useState(false);

    return (
      <div style={{ width: '100%', height: '200vh' }}>
        Scroll down
        <FloatingButton open={open} onClick={() => setOpen(true)}>
          Open Modal
        </FloatingButton>
        <Modal
          modalType="standard"
          open={open}
          onClose={() => setOpen(false)}
          title="Modal Title"
          showModalHeader
        >
          Modal Content
        </Modal>
      </div>
    );
  },
};
