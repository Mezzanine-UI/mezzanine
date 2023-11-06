import { StoryFn, Meta } from '@storybook/react';
import { useState } from 'react';
import Loading, { LoadingProps } from '.';
import Alert from '../Alert';
import Button from '../Button/Button';
import Menu, { MenuItem } from '../Menu';
import Modal, { ModalHeader, ModalBody } from '../Modal';

export default {
  title: 'Feedback/Loading',
} as Meta;

type PlaygroundArgs = LoadingProps;

export const Playground: StoryFn<PlaygroundArgs> = ({
  stretch,
  loading,
  tip,
}) => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(3, 140px)',
    gap: 60,
  }}
  >
    <div style={{ width: '100%', height: '100%' }}>
      <Loading stretch={stretch} loading={loading} tip={tip} />
    </div>
    <Loading stretch={stretch} loading={loading} tip={tip}>
      <Menu size="medium">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
        <MenuItem>item 3</MenuItem>
        <MenuItem>item 4</MenuItem>
      </Menu>
    </Loading>
  </div>
);

Playground.args = {
  loading: true,
  stretch: false,
  tip: '',
};

export const Basic = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(3, 140px)',
    gap: 60,
  }}
  >
    <Loading loading />
    <Loading loading tip="Loading..." />
  </div>
);

export const Nested = () => (
  <div style={{
    display: 'grid',
    gap: 16,
  }}
  >
    <Loading
      loading
      iconProps={{
        size: 24,
      }}
    >
      <Alert severity="success">
        成功送出
      </Alert>
    </Loading>
    <Loading loading tip="Loading...">
      <Menu size="medium">
        <MenuItem>item 1</MenuItem>
        <MenuItem>item 2</MenuItem>
        <MenuItem>item 3</MenuItem>
        <MenuItem>item 4</MenuItem>
      </Menu>
    </Loading>
  </div>
);

export const OnModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
      >
        OPEN
      </Button>
      <Modal onClose={() => setOpen(false)} open={open}>
        <Loading stretch loading tip="元件加載中...">
          <ModalHeader>
            Hi
          </ModalHeader>
          <ModalBody>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Adipisci pariatur aliquid voluptate, totam voluptatum numquam cupiditate provident
            sed sint harum delectus nihil quod sequi vero porro excepturi eos facilis quos.
          </ModalBody>
        </Loading>
      </Modal>
    </>
  );
};
