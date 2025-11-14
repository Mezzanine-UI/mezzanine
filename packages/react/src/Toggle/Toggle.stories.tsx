import { Meta, StoryFn } from '@storybook/react-webpack5';
import Toggle, { ToggleProps, ToggleSize } from '.';

export default {
  title: 'Data Entry/Toggle',
} as Meta;

const sizes: ToggleSize[] = ['medium', 'large'];

export const Playground: StoryFn<ToggleProps> = (args) => <Toggle {...args} />;

Playground.args = {
  checked: true,
  disabled: false,
  loading: false,
  size: 'medium',
};
Playground.argTypes = {
  size: {
    options: sizes,
    control: {
      type: 'select',
    },
  },
};

export const All = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateRows: 'repeat(2, min-content)',
      gridTemplateColumns: 'repeat(5, min-content)',
      gap: 16,
      alignItems: 'center',
    }}
  >
    <Toggle defaultChecked />
    <Toggle defaultChecked disabled />
    <Toggle defaultChecked loading />
    <Toggle disabled />
    <Toggle loading />

    <Toggle size="large" defaultChecked />
    <Toggle size="large" defaultChecked disabled />
    <Toggle size="large" defaultChecked loading />
    <Toggle size="large" disabled />
    <Toggle size="large" loading />
  </div>
);
