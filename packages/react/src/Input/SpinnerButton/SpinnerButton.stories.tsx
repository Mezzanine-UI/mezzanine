import type { Meta, StoryObj } from '@storybook/react';
import SpinnerButton from './SpinnerButton';

const meta: Meta<typeof SpinnerButton> = {
  title: 'Data Entry/Input/SpinnerButton',
  component: SpinnerButton,
};

export default meta;

type Story = StoryObj<typeof SpinnerButton>;

export const Playground: Story = {
  render: () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <div>
          <h3 style={{ marginBottom: '12px' }}>Size: main (Normal)</h3>
          <div
            style={{
              width: '160px',
              height: '40px',
              border: '1px solid #9b9b9b',
              position: 'relative',
            }}
          >
            <SpinnerButton type="up" size="main" />
            <SpinnerButton type="down" size="main" />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Size: sub (Normal)</h3>
          <div
            style={{
              width: '160px',
              height: '32px',
              border: '1px solid #9b9b9b',
              position: 'relative',
            }}
          >
            <SpinnerButton type="up" size="sub" />
            <SpinnerButton type="down" size="sub" />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Disabled</h3>
          <div
            style={{
              width: '160px',
              height: '40px',
              border: '1px solid #9b9b9b',
              background: 'var(--mzn-color-background-neutral-subtle)',
              position: 'relative',
            }}
          >
            <SpinnerButton type="up" disabled />
            <SpinnerButton type="down" disabled />
          </div>
        </div>
      </div>
    );
  },
};
