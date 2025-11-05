import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import Loading from '.';
import Alert from '../Alert';
import Button from '../Button/Button';
import Menu, { MenuItem } from '../Menu';
import Modal, { ModalBody, ModalHeader } from '../Modal';

export default {
  title: 'Feedback/Loading',
  component: Loading,
} as Meta<typeof Loading>;

export const Playground: StoryObj<typeof Loading> = {
  args: {
    description: 'Loading...',
    loading: true,
    size: 'main',
    stretch: false,
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-grid',
        gap: 60,
        gridTemplateColumns: 'repeat(3, 140px)',
      }}
    >
      <div style={{ height: '100%', width: '100%' }}>
        <Loading {...args} />
      </div>
      <Loading {...args}>
        <Menu size="medium">
          <MenuItem>item 1</MenuItem>
          <MenuItem>item 2</MenuItem>
          <MenuItem>item 3</MenuItem>
          <MenuItem>item 4</MenuItem>
        </Menu>
      </Loading>
    </div>
  ),
};

const BasicExample = () => (
  <div
    style={{
      display: 'inline-grid',
      gap: 60,
      gridTemplateColumns: 'repeat(3, 140px)',
    }}
  >
    <Loading loading />
    <Loading description="Loading..." loading />
  </div>
);

export const Basic: StoryObj<typeof Loading> = {
  render: () => <BasicExample />,
};

const NestedExample = () => (
  <div
    style={{
      display: 'grid',
      gap: 16,
    }}
  >
    <Loading
      iconProps={{
        size: 24,
      }}
      loading
    >
      <Alert severity="success">成功送出</Alert>
    </Loading>
    <Loading description="Loading..." loading>
      <Menu size="medium">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
        <MenuItem>item 3</MenuItem>
        <MenuItem>item 4</MenuItem>
      </Menu>
    </Loading>
  </div>
);

export const Nested: StoryObj<typeof Loading> = {
  render: () => <NestedExample />,
};

const OnModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="base-primary">
        OPEN
      </Button>
      <Modal onClose={() => setOpen(false)} open={open}>
        <Loading description="元件加載中..." loading stretch>
          <ModalHeader>Hi</ModalHeader>
          <ModalBody>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci
            pariatur aliquid voluptate, totam voluptatum numquam cupiditate
            provident sed sint harum delectus nihil quod sequi vero porro
            excepturi eos facilis quos.
          </ModalBody>
        </Loading>
      </Modal>
    </>
  );
};

export const OnModal: StoryObj<typeof Loading> = {
  render: () => <OnModalExample />,
};

const SizesExample = () => (
  <div
    style={{
      display: 'grid',
      gap: 24,
    }}
  >
    <Loading description="Main size" loading size="main" />
    <Loading description="Sub size" loading size="sub" />
    <Loading description="Minor size" loading size="minor" />
  </div>
);

export const Sizes: StoryObj<typeof Loading> = {
  render: () => <SizesExample />,
};
