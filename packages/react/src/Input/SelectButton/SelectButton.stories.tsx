import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import SelectButton from './SelectButton';

const meta: Meta<typeof SelectButton> = {
  title: 'Data Entry/Input/SelectButton',
  component: SelectButton,
};

export default meta;

type Story = StoryObj<typeof SelectButton>;

const options = [
  { id: 'https://', name: 'https://' },
  { id: 'http://', name: 'http://' },
  { id: 'ftp://', name: 'ftp://' },
];

export const Playground: Story = {
  render: function PlaygroundRender() {
    const [selectedValue, setSelectedValue] = useState('https://');

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
            <SelectButton
              options={options}
              size="main"
              value={selectedValue}
              onSelect={setSelectedValue}
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Size: sub (Normal)</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <SelectButton
              options={options}
              size="sub"
              value={selectedValue}
              onSelect={setSelectedValue}
            />
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '12px' }}>Disabled State</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <SelectButton disabled options={options} value="www." />
          </div>
        </div>
      </div>
    );
  },
};
