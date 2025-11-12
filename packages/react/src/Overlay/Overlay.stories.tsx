import { useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Button from '../Button';
import Typography from '../Typography';
import Overlay from './Overlay';

export default {
  title: 'Others/Overlay',
  component: Overlay,
} as Meta<typeof Overlay>;

type Story = StoryObj<typeof Overlay>;

export const DarkVariant: Story = {
  render: function DarkVariantStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Dark Overlay
        </Button>
        <Overlay
          onBackdropClick={() => setOpen(false)}
          onClose={() => setOpen(false)}
          open={open}
          variant="dark"
        >
          {open ? (
            <div
              style={{
                background: 'var(--mzn-color-background-base)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                margin: 'auto',
                maxWidth: '400px',
                padding: '24px',
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <Typography color="text-brand" variant="h3">
                Dark Variant Modal
              </Typography>
              <Typography variant="body">
                This is a modal with dark backdrop. Click outside or the button
                to close.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="base-primary">
                Close
              </Button>
            </div>
          ) : null}
        </Overlay>
      </>
    );
  },
};

export const CustomContainer: Story = {
  render: function CustomContainerStory() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Overlay in Container
        </Button>
        <div
          ref={containerRef}
          style={{
            background: 'var(--mzn-color-background-base)',
            border: '2px dashed var(--mzn-color-border-neutral)',
            borderRadius: '8px',
            padding: '16px',
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              height: '200px',
              padding: '24px',
            }}
          >
            <Typography variant="body">
              Container Element (Overlay will be rendered inside this)
            </Typography>
          </div>
          <Overlay
            container={containerRef}
            onBackdropClick={() => setOpen(false)}
            open={open}
            variant="light"
          >
            {open ? (
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text-brand" variant="h3">
                  Container Overlay
                </Typography>
                <Typography align="center" variant="body">
                  This overlay is rendered inside the container element above,
                  perfect for component-level loading states like Spin.
                </Typography>
                <Button onClick={() => setOpen(false)} variant="base-primary">
                  Close
                </Button>
              </div>
            ) : null}
          </Overlay>
        </div>
      </div>
    );
  },
};

export const DisablePortal: Story = {
  render: function DisablePortalStory() {
    const [open, setOpen] = useState(false);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Toggle Overlay (No Portal)
        </Button>
        <div
          style={{
            background: 'var(--mzn-color-background-base)',
            border: '2px dashed var(--mzn-color-border-neutral)',
            borderRadius: '8px',
            height: '300px',
            overflow: 'hidden',
            padding: '16px',
            position: 'relative',
            width: '100%',
          }}
        >
          <Typography variant="body">
            Parent Element (overflow: hidden)
          </Typography>
          <Overlay
            disablePortal
            onBackdropClick={() => setOpen(false)}
            open={open}
            variant="dark"
          >
            {open ? (
              <div
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text-brand" variant="h3">
                  No Portal
                </Typography>
                <Typography align="center" variant="body">
                  This overlay is rendered in the normal DOM flow without
                  portal. Notice it respects parent overflow.
                </Typography>
                <Button onClick={() => setOpen(false)} variant="base-primary">
                  Close
                </Button>
              </div>
            ) : null}
          </Overlay>
        </div>
      </div>
    );
  },
};

export const DisableBackdropClick: Story = {
  render: function DisableBackdropClickStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Modal (Must Use Button)
        </Button>
        <Overlay disableCloseOnBackdropClick open={open} variant="dark">
          {open ? (
            <div
              style={{
                background: 'var(--mzn-color-background-base)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                margin: 'auto',
                maxWidth: '400px',
                padding: '24px',
                position: 'relative',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            >
              <Typography color="text-brand" variant="h3">
                Disable Backdrop Click
              </Typography>
              <Typography variant="body">
                Clicking the backdrop will not close this modal. You must use
                the button below.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="base-primary">
                Close
              </Button>
            </div>
          ) : null}
        </Overlay>
      </>
    );
  },
};
