import { StoryFn, Meta } from '@storybook/react';
import { ReactNode, useCallback, useState } from 'react';
import Modal, {
  ModalSeverity,
  ModalSize,
  ModalProps,
  ModalHeaderProps,
  ModalHeader,
  ModalBody,
  ModalActionsProps,
  ModalActions,
} from '.';
import Button from '../Button';

export default {
  title: 'Feedback/Modal',
} as Meta;

const severities: ModalSeverity[] = [
  'info',
  'error',
  'warning',
  'success',
];

const sizes: ModalSize[] = [
  'small',
  'medium',
  'large',
  'extraLarge',
];

interface PlaygroundArgs
  extends
  Omit<ModalProps, 'title'>,
  Required<Pick<ModalHeaderProps, 'showSeverityIcon' | 'titleLarge'>>,
  Required<Pick<ModalActionsProps, 'cancelText' | 'confirmText'>> {
  title: ReactNode;
  body: ReactNode;
  footer: ReactNode;
}

export const Playground: StoryFn<PlaygroundArgs> = ({
  disableCloseOnBackdropClick,
  disableCloseOnEscapeKeyDown,
  fullScreen,
  hideCloseIcon,
  loading,
  severity,
  size,
  title,
  showSeverityIcon,
  titleLarge,
  body,
  footer,
  cancelText,
  confirmText,
}) => {
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">open</Button>
      <Modal
        disableCloseOnBackdropClick={disableCloseOnBackdropClick}
        disableCloseOnEscapeKeyDown={disableCloseOnEscapeKeyDown}
        fullScreen={fullScreen}
        hideCloseIcon={hideCloseIcon}
        loading={loading}
        onClose={onClose}
        open={open}
        severity={severity}
        size={size}
      >
        <ModalHeader
          showSeverityIcon={showSeverityIcon}
          titleLarge={titleLarge}
        >
          {title}
        </ModalHeader>
        <ModalBody>
          {body}
        </ModalBody>
        <ModalActions
          cancelText={cancelText}
          confirmText={confirmText}
          onCancel={onClose}
          onConfirm={onClose}
        >
          {footer}
        </ModalActions>
      </Modal>
    </>
  );
};

Playground.args = {
  disableCloseOnBackdropClick: false,
  disableCloseOnEscapeKeyDown: false,
  fullScreen: false,
  hideCloseIcon: false,
  loading: false,
  severity: 'info',
  size: 'medium',
  title: 'Title',
  showSeverityIcon: false,
  titleLarge: false,
  // eslint-disable-next-line max-len
  body: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum illum neque soluta atque. Eum dolores placeat unde, molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum illum neque soluta atque. Eum dolores placeat unde, molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum illum neque soluta atque. Eum dolores placeat unde, molestias exercitationem tempore perspiciatis quia porro sapiente vero impedit consequatur recusandae excepturi cumque.',
  footer: 'other actions',
  cancelText: 'cancel',
  confirmText: 'ok',
};

Playground.argTypes = {
  size: {
    control: {
      type: 'select',
      options: sizes,
    },
  },
  severity: {
    control: {
      type: 'select',
      options: severities,
    },
  },
};

export const Layers = () => {
  const [layers, setLayers] = useState<number | null>(null);

  return (
    <>
      Click the button and click the escape key.
      <br />
      <Button
        onClick={() => {
          for (let i = 0; i < 3; i += 1) {
            setTimeout(() => {
              setLayers(i);
            }, i * 500);
          }
        }}
        variant="contained"
      >
        open
      </Button>
      {['Modal 1', 'Modal 2', 'Modal 3'].map((title, index) => {
        const onClose = () => {
          setLayers(() => (index > 0 ? index - 1 : null));
        };

        return (
          <Modal
            key={title}
            open={layers !== null && layers >= index}
            onClose={onClose}
          >
            <ModalHeader>
              {title}
            </ModalHeader>
            <ModalBody>
              content
            </ModalBody>
            <ModalActions
              onCancel={onClose}
              onConfirm={() => {}}
              cancelText="cancel"
              confirmText="OK"
            />
          </Modal>

        );
      })}
    </>
  );
};
