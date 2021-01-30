import { Meta, Story } from '@storybook/react';
import Switch, { SwitchProps, SwitchSize } from '.';

export default {
  title: 'Data Entry/Switch',
} as Meta;

const sizes: SwitchSize[] = [
  'medium',
  'large',
];

export const Playground: Story<SwitchProps> = (args) => (
  <Switch {...args} />
);

Playground.args = {
  checked: true,
  disabled: false,
  loading: false,
  size: 'medium',
};
Playground.argTypes = {
  size: {
    control: {
      type: 'select',
      options: sizes,
    },
  },
};

export const All = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateRows: 'repeat(2, min-content)',
    gridTemplateColumns: 'repeat(5, min-content)',
    gap: 16,
    alignItems: 'center',
  }}
  >
    <Switch defaultChecked />
    <Switch defaultChecked disabled />
    <Switch defaultChecked loading />
    <Switch disabled />
    <Switch loading />

    <Switch size="large" defaultChecked />
    <Switch size="large" defaultChecked disabled />
    <Switch size="large" defaultChecked loading />
    <Switch size="large" disabled />
    <Switch size="large" loading />
  </div>
);
