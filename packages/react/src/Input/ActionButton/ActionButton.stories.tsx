import type { Meta, StoryObj } from '@storybook/react';
import ActionButton from './ActionButton';
import { EyeIcon } from '@mezzanine-ui/icons';

const meta: Meta<typeof ActionButton> = {
  title: 'Data Entry/Input/ActionButton',
  component: ActionButton,
};

export default meta;

type Story = StoryObj<typeof ActionButton>;

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
          <div style={{ display: 'flex', gap: '12px' }}>
            <ActionButton size="main" />
            <ActionButton icon={EyeIcon} label="View" size="main" />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Size: sub (Normal)</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <ActionButton size="sub" />
            <ActionButton icon={EyeIcon} label="View" size="sub" />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Disabled State</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <ActionButton disabled />
            <ActionButton icon={EyeIcon} label="View" disabled />
          </div>
        </div>
      </div>
    );
  },
};
