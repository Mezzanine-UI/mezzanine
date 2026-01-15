import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import Spin from '.';
import Alert from '../Alert';
import Button from '../Button/Button';
import Menu, { MenuItem } from '../Menu';
import Modal from '../Modal';

export default {
  title: 'Feedback/Spin',
  component: Spin,
} as Meta<typeof Spin>;

export const Playground: StoryObj<typeof Spin> = {
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
        <Spin {...args} />
      </div>
      <Spin {...args}>
        <Menu size="medium">
          <MenuItem>item 1</MenuItem>
          <MenuItem>item 2</MenuItem>
          <MenuItem>item 3</MenuItem>
          <MenuItem>item 4</MenuItem>
        </Menu>
      </Spin>
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
    <Spin loading />
    <Spin description="Loading..." loading />
  </div>
);

export const Basic: StoryObj<typeof Spin> = {
  render: () => <BasicExample />,
};

const NestedExample = () => (
  <div
    style={{
      display: 'grid',
      gap: 16,
    }}
  >
    <Spin
      iconProps={{
        size: 24,
      }}
      loading
    >
      <Alert severity="success">成功送出</Alert>
    </Spin>
    <Spin description="Loading..." loading>
      <Menu size="medium">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
        <MenuItem>item 3</MenuItem>
        <MenuItem>item 4</MenuItem>
      </Menu>
    </Spin>
  </div>
);

export const Nested: StoryObj<typeof Spin> = {
  render: () => <NestedExample />,
};

const OnModalExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="base-primary">
        OPEN
      </Button>
      <Modal
        modalHeaderTitle="Hi"
        modalType="standard"
        onClose={() => setOpen(false)}
        open={open}
        showModalHeader
      >
        <Spin description="元件加載中..." loading stretch>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci
          pariatur aliquid voluptate, totam voluptatum numquam cupiditate
          provident sed sint harum delectus nihil quod sequi vero porro
          excepturi eos facilis quos.
        </Spin>
      </Modal>
    </>
  );
};

export const OnModal: StoryObj<typeof Spin> = {
  render: () => <OnModalExample />,
};

const SizesExample = () => (
  <div
    style={{
      display: 'grid',
      gap: 24,
    }}
  >
    <Spin description="Main size" loading size="main" />
    <Spin description="Sub size" loading size="sub" />
    <Spin description="Minor size" loading size="minor" />
  </div>
);

export const Sizes: StoryObj<typeof Spin> = {
  render: () => <SizesExample />,
};
