import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useRef, useState } from 'react';
import Button from '../Button';
import Typography from '../Typography';
import Portal from './Portal';

export default {
  title: 'Others/Portal',
  component: Portal,
} as Meta<typeof Portal>;

type Story = StoryObj<typeof Portal>;

const demoElement = (
  <div
    style={{
      width: '100px',
      height: '100px',
      backgroundImage:
        'radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a)',
      borderRadius: '100%',
    }}
  />
);

function CustomContainerExample() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100px',
          backgroundColor: '#d9d9d9',
        }}
      >
        <Typography>The container wrapping portal.</Typography>
        <Portal container={containerRef}>{demoElement}</Portal>
      </div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100px',
          backgroundColor: '#e5e5e5',
        }}
      >
        <Typography>The portal destination.</Typography>
      </div>
    </>
  );
}

export const CustomContainer: Story = {
  name: 'Custom Container (Using Ref)',
  render: () => <CustomContainerExample />,
};

function DefaultLayerExample() {
  const [show, setShow] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h1" style={{ marginBottom: '16px' }}>
        Default Portal Layer
      </Typography>
      <Typography style={{ marginBottom: '16px' }}>
        Click the button to show a portal element in the default layer. The
        element will be rendered in <code>#mzn-portal-container</code>.
      </Typography>
      <Button onClick={() => setShow(!show)}>
        {show ? 'Hide' : 'Show'} Portal
      </Button>
      <Portal layer="default">
        {show ? (
          <div
            style={{
              placeSelf: 'center',
              padding: '24px',
              backgroundColor: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              pointerEvents: 'auto',
            }}
          >
            <Typography variant="h2" style={{ marginBottom: '8px' }}>
              Portal Content
            </Typography>
            <Typography>
              This is rendered in the default portal layer.
            </Typography>
            {demoElement}
          </div>
        ) : null}
      </Portal>
    </div>
  );
}

export const DefaultLayer: Story = {
  name: 'Default Layer (Auto Portal)',
  render: () => <DefaultLayerExample />,
};

function AlertLayerExample() {
  const [alerts, setAlerts] = useState<string[]>([]);

  const addAlert = () => {
    setAlerts((prev) => [...prev, `Alert ${prev.length + 1}`]);
  };

  const removeAlert = (index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h1" style={{ marginBottom: '16px' }}>
        Alert Portal Layer
      </Typography>
      <Typography style={{ marginBottom: '16px' }}>
        Alert layer renders at the top of the page, outside the root element. It
        uses <code>position: sticky</code> and automatically adjusts the default
        portal layer position.
      </Typography>
      <Button onClick={addAlert}>Add Alert Banner</Button>
      <div style={{ marginTop: '24px', height: '400px', overflowY: 'auto' }}>
        <Typography variant="h2" style={{ marginBottom: '16px' }}>
          Scrollable Content
        </Typography>
        {Array.from({ length: 20 }).map((_, i) => (
          <Typography key={i} style={{ marginBottom: '8px' }}>
            Content line {i + 1}
          </Typography>
        ))}
      </div>
      {alerts.map((alert, index) => (
        <Portal key={index} layer="alert">
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: index % 2 === 0 ? '#4caf50' : '#2196f3',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'auto',
            }}
          >
            <Typography style={{ color: '#fff' }}>{alert}</Typography>
            <button
              onClick={() => removeAlert(index)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '20px',
                padding: '0 8px',
              }}
              type="button"
            >
              ×
            </button>
          </div>
        </Portal>
      ))}
    </div>
  );
}

export const AlertLayer: Story = {
  name: 'Alert Layer (Above Root)',
  render: () => <AlertLayerExample />,
};

export const DisablePortal: Story = {
  name: 'Disable Portal',
  render: () => (
    <div style={{ padding: '20px' }}>
      <Typography variant="h2" style={{ marginBottom: '16px' }}>
        Disabled Portal
      </Typography>
      <Typography style={{ marginBottom: '16px' }}>
        When <code>disablePortal</code> is true, the content renders in normal
        DOM flow instead of being portaled.
      </Typography>
      <div
        style={{
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Typography style={{ marginBottom: '16px' }}>
          Parent Container
        </Typography>
        <Portal disablePortal>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            }}
          >
            <Typography>This content is NOT portaled</Typography>
            {demoElement}
          </div>
        </Portal>
      </div>
    </div>
  ),
};

function LayerComparisonExample() {
  const [showDefault, setShowDefault] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h2" style={{ marginBottom: '16px' }}>
        Portal Layers Comparison
      </Typography>
      <Typography style={{ marginBottom: '16px' }}>
        Compare the difference between alert and default layers:
      </Typography>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <Button onClick={() => setShowAlert(!showAlert)} variant="base-primary">
          {showAlert ? 'Hide' : 'Show'} Alert Layer
        </Button>
        <Button
          onClick={() => setShowDefault(!showDefault)}
          variant="base-secondary"
        >
          {showDefault ? 'Hide' : 'Show'} Default Layer
        </Button>
      </div>
      <div
        style={{
          height: '200vh',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h3">Page Content</Typography>
        <Typography>
          The alert layer appears above this content with sticky positioning.
          The default layer uses fixed positioning inside the root.
        </Typography>
      </div>
      {showAlert && (
        <Portal layer="alert">
          <div
            style={{
              padding: '16px 24px',
              backgroundColor: '#ff9800',
              color: '#fff',
              pointerEvents: 'auto',
            }}
          >
            <Typography style={{ color: '#fff' }}>Alert Layer</Typography>
          </div>
        </Portal>
      )}
      {showDefault && (
        <Portal layer="default">
          <div
            style={{
              width: '200px',
              height: '100%',
              justifySelf: 'flex-end',
              padding: '24px',
              backgroundColor: 'rgba(33, 150, 243, 0.95)',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              pointerEvents: 'auto',
            }}
          >
            <Typography style={{ color: '#fff' }}>Default Layer</Typography>
          </div>
        </Portal>
      )}
    </div>
  );
}

export const LayerComparison: Story = {
  name: 'Layer Comparison',
  render: () => <LayerComparisonExample />,
};
