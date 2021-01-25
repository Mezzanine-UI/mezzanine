import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Tag, { TagProps, TagSize } from '.';

export default {
  title: 'DataDisplay/Tag',
} as Meta;

const sizes: TagSize[] = [
  'small',
  'medium',
  'large',
];

interface PlaygroudStoryArgs extends Required<Pick<TagProps, 'closable' | 'disabled' | 'size'>> {
  label: string;
  onClose: VoidFunction;
}

export const Playgroud: Story<PlaygroudStoryArgs> = ({ label, ...args }) => (
  <Tag {...args}>{label}</Tag>
);

Playgroud.args = {
  label: 'Tag',
  closable: false,
  disabled: false,
  size: 'medium',
  onClose: action('onClose'),
};
Playgroud.argTypes = {
  size: {
    control: {
      type: 'select',
      options: sizes,
    },
  },
};

interface CommonStoryArgs {
  onClose: VoidFunction;
}

export const Common: Story<CommonStoryArgs> = ({ onClose }) => (
  <div
    style={{
      display: 'inline-grid',
      alignItems: 'center',
      gridAutoFlow: 'column',
      gap: 8,
    }}
  >
    <Tag>Tag</Tag>
    <Tag>
      <a href="https://www.google.com" target="_blank">Link</a>
    </Tag>
    <Tag disabled>Disabled</Tag>
    <Tag closable onClose={onClose}>Closable</Tag>
    <Tag closable disabled onClose={onClose}>Disabled</Tag>
  </div>
);

Common.args = {
  onClose: action('onClose'),
};

export const Sizes: Story = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, min-content)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Tag size="small">small</Tag>
    <Tag>medium</Tag>
    <Tag size="large">large</Tag>
  </div>
);
