import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import Spin from '.';
import Button from '../Button/Button';
import Modal from '../Modal';
import { Description, DescriptionContent } from '../Description';

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
    <Spin description="Loading..." loading>
      <div style={{ width: '300px', height: '300px' }}>
        <Description title="Test Description">
          <DescriptionContent>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </DescriptionContent>
        </Description>
      </div>
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
        title="Hi"
        modalType="standard"
        onClose={() => setOpen(false)}
        open={open}
        showModalHeader
      >
        <Spin description="內容加載中..." loading stretch>
          <div style={{ width: '100%', height: '200px' }} />
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
