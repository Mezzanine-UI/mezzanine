import type { Meta, StoryObj } from '@storybook/react';
import SelectButton from './SelectButton';

const meta: Meta<typeof SelectButton> = {
  title: 'Data Entry/Input/SelectButton',
  component: SelectButton,
};

export default meta;

type Story = StoryObj<typeof SelectButton>;

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
            <SelectButton size="main" />
            <SelectButton value="www." size="main" />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Size: sub (Normal)</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <SelectButton size="sub" />
            <SelectButton value="www." size="sub" />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Disabled State</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <SelectButton disabled />
            <SelectButton value="www." disabled />
          </div>
        </div>
      </div>
    );
  },
};
