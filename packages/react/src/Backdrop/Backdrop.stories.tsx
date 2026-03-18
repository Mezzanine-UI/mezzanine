import { useRef, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import Button from '../Button';
import Drawer from '../Drawer';
import Modal from '../Modal';
import Spin from '../Spin';
import Select from '../Select';
import Typography from '../Typography';
import Backdrop from '.';

export default {
  title: 'Others/Backdrop',
  component: Backdrop,
} as Meta<typeof Backdrop>;

type Story = StoryObj<typeof Backdrop>;

export const DarkVariant: Story = {
  render: function DarkVariantStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <Typography color="text-neutral" variant="body">
            📌 Try scrolling the page before and after opening the backdrop to
            see the scroll lock in action!
          </Typography>
        </div>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Dark Backdrop
        </Button>
        {/* Add content to make page scrollable */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--mzn-color-background-neutral-faint)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <Typography variant="body">
                Scrollable content item {i + 1} - This page has enough content
                to scroll. When the backdrop opens, scrolling will be locked.
              </Typography>
            </div>
          ))}
        </div>
        <Backdrop
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
                This is a modal with dark backdrop. Notice the background page
                cannot be scrolled while this is open. Click outside or the
                button to close.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="base-primary">
                Close
              </Button>
            </div>
          ) : null}
        </Backdrop>
      </>
    );
  },
};

export const LightVariant: Story = {
  render: function LightVariantStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <Typography color="text-neutral" variant="body">
            💡 Light variant is commonly used for loading states (like Spin
            component)
          </Typography>
        </div>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Light Backdrop
        </Button>
        {/* Add content to make page scrollable */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--mzn-color-background-neutral-faint)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <Typography variant="body">
                Scrollable content item {i + 1} - Background scroll is locked
                when backdrop is open.
              </Typography>
            </div>
          ))}
        </div>
        <Backdrop
          onBackdropClick={() => setOpen(false)}
          onClose={() => setOpen(false)}
          open={open}
          variant="light"
        >
          {open ? (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                justifyContent: 'center',
              }}
            >
              <Spin loading />
              <div
                style={{
                  background: 'var(--mzn-color-background-base)',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <Typography color="text-brand" variant="h3">
                  Light Variant Loading
                </Typography>
                <Typography
                  style={{ marginTop: '8px' }}
                  color="text-neutral"
                  variant="body"
                >
                  Perfect for loading overlays and component-level blocking
                  states
                </Typography>
              </div>
              <Button onClick={() => setOpen(false)} variant="base-primary">
                Close
              </Button>
            </div>
          ) : null}
        </Backdrop>
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
          Open Backdrop in Container
        </Button>
        <div
          ref={containerRef}
          style={{
            background: 'var(--mzn-color-background-base)',
            border: '2px dashed var(--mzn-color-border-neutral)',
            borderRadius: '8px',
            minHeight: '300px',
            padding: '16px',
            position: 'relative',
            width: '100%',
          }}
        >
          <div style={{ padding: '24px' }}>
            <Typography variant="body">
              Container Element (Backdrop will be rendered inside this)
            </Typography>
          </div>
          <Backdrop
            container={containerRef}
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
                <div
                  style={{
                    background: 'var(--mzn-color-background-base)',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <Typography color="text-brand" variant="h3">
                    Container Backdrop
                  </Typography>
                  <Typography
                    style={{ marginTop: '8px' }}
                    color="text-neutral"
                    variant="body"
                  >
                    This overlay is scoped to the container element above
                  </Typography>
                </div>
                <Button onClick={() => setOpen(false)} variant="base-primary">
                  Close
                </Button>
              </div>
            ) : null}
          </Backdrop>
        </div>
      </div>
    );
  },
};

export const DisableScrollLock: Story = {
  render: function DisableScrollLockStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <Typography color="text-neutral" variant="body">
            ⚠️ With disableScrollLock=true, you can still scroll the background
            page
          </Typography>
        </div>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Without Scroll Lock
        </Button>
        {/* Add content to make page scrollable */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--mzn-color-background-neutral-faint)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <Typography variant="body">
                Scrollable content item {i + 1} - You can scroll this even when
                backdrop is open!
              </Typography>
            </div>
          ))}
        </div>
        <Backdrop
          disableScrollLock
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
                Scroll Lock Disabled
              </Typography>
              <Typography variant="body">
                Try scrolling the page - it still works! This is useful for
                scenarios where you want to allow background interaction.
              </Typography>
              <Button onClick={() => setOpen(false)} variant="base-primary">
                Close
              </Button>
            </div>
          ) : null}
        </Backdrop>
      </>
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
          Toggle Backdrop (No Portal)
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
          <Backdrop
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
                <div
                  style={{
                    background: 'var(--mzn-color-background-base)',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <Typography color="text-brand" variant="h3">
                    No Portal
                  </Typography>
                  <Typography
                    style={{ marginTop: '8px' }}
                    color="text-neutral"
                    variant="body"
                  >
                    Rendered in normal DOM flow, respects parent overflow
                  </Typography>
                </div>
                <Button onClick={() => setOpen(false)} variant="base-primary">
                  Close
                </Button>
              </div>
            ) : null}
          </Backdrop>
        </div>
      </div>
    );
  },
};

export const DrawerModalSelectLayering: Story = {
  render: function DrawerModalSelectLayeringStory() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectValue, setSelectValue] = useState<DropdownOption | null>(null);

    const options: DropdownOption[] = [
      { id: '1', name: 'Option 1' },
      { id: '2', name: 'Option 2' },
      { id: '3', name: 'Option 3' },
      { id: '4', name: 'Option 4' },
      { id: '5', name: 'Option 5' },
    ];

    return (
      <>
        <Button onClick={() => setDrawerOpen(true)} variant="base-primary">
          Open Drawer
        </Button>
        <Drawer
          headerTitle="Drawer"
          isHeaderDisplay
          onClose={() => {
            setDrawerOpen(false);
            setModalOpen(false);
          }}
          open={drawerOpen}
          size="medium"
        >
          <div style={{ padding: '16px' }}>
            <Button onClick={() => setModalOpen(true)} variant="base-primary">
              Open Modal
            </Button>
          </div>
        </Drawer>
        <Modal
          confirmText="OK"
          cancelText="Cancel"
          modalType="standard"
          onClose={() => setModalOpen(false)}
          onConfirm={() => setModalOpen(false)}
          onCancel={() => setModalOpen(false)}
          open={modalOpen}
          showDismissButton
          showModalFooter
          showModalHeader
          size="regular"
          title="Modal with Select"
        >
          <Select
            fullWidth
            options={options}
            placeholder="Select an option"
            value={selectValue}
            onChange={(v) => setSelectValue(v)}
          />
        </Modal>
      </>
    );
  },
};

export const DisableBackdropClick: Story = {
  render: function DisableBackdropClickStory() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <div style={{ marginBottom: '16px' }}>
          <Typography color="text-neutral" variant="body">
            🔒 Clicking outside will not close the modal - use the button
          </Typography>
        </div>
        <Button onClick={() => setOpen(true)} variant="base-primary">
          Open Modal (Must Use Button)
        </Button>
        <Backdrop disableCloseOnBackdropClick open={open} variant="dark">
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
              <Typography
                variant="body"
                color="text-neutral"
                style={{ marginBottom: 16 }}
              >
                Clicking the backdrop will not close this modal. You must use
                the button below.
              </Typography>
              <Button variant="base-primary" onClick={() => setOpen(false)}>
                Close Modal
              </Button>
            </div>
          ) : null}
        </Backdrop>
      </>
    );
  },
};
