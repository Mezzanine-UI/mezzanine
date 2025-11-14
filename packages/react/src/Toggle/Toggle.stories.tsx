import { Meta, StoryFn } from '@storybook/react-webpack5';
import Toggle, { ToggleProps } from '.';

export default {
  title: 'Data Entry/Toggle',
} as Meta;

export const All: StoryFn<ToggleProps> = () => (
  <div
    style={{
      display: 'grid',
      gap: 16,
      alignItems: 'center',
    }}
  >
    Size: main
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      enable
      <Toggle />
      <Toggle defaultChecked />
      disabled
      <Toggle disabled />
      <Toggle defaultChecked disabled />
    </div>
    <br />
    Size: sub
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      enable
      <Toggle size="sub" />
      <Toggle size="sub" defaultChecked />
      disabled
      <Toggle size="sub" disabled />
      <Toggle size="sub" defaultChecked disabled />
    </div>
    <br />
    With text content
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Toggle label="Toggle Label" supportingText="Toggle Supporting Text" />
      <Toggle label="Toggle Label" />
    </div>
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Toggle
        disabled
        label="Toggle Label"
        supportingText="Toggle Supporting Text"
      />
      <Toggle disabled label="Toggle Label" />
    </div>
  </div>
);

export const Playground: StoryFn<ToggleProps> = (args) => <Toggle {...args} />;

Playground.args = {
  checked: true,
  disabled: false,
  size: 'main',
};
Playground.argTypes = {
  size: { control: 'select', options: ['main', 'sub'] },
};
