import { StoryFn, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Tag, { TagProps, TagSize } from '.';
import ConfigProvider from '../Provider';

export default {
  title: 'Data Display/Tag',
} as Meta;

const sizes: TagSize[] = ['small', 'medium', 'large'];

interface PlaygroudStoryArgs
  extends Required<Pick<TagProps, 'closable' | 'disabled' | 'size'>> {
  label: string;
  onClose: VoidFunction;
}

export const Playgroud: StoryFn<PlaygroudStoryArgs> = ({ label, ...args }) => (
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
    options: sizes,
    control: {
      type: 'select',
    },
  },
};

interface CommonStoryArgs {
  onClose: VoidFunction;
}

export const Common: StoryFn<CommonStoryArgs> = ({ onClose }) => (
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
      <a href="https://www.google.com" target="_blank">
        Link
      </a>
    </Tag>
    <Tag disabled>Disabled</Tag>
    <Tag closable onClose={onClose}>
      Closable
    </Tag>
    <Tag closable disabled onClose={onClose}>
      Disabled
    </Tag>
  </div>
);

Common.args = {
  onClose: action('onClose'),
};

export const Sizes: StoryFn = () => (
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
    <ConfigProvider size="large">
      <Tag>large</Tag>
    </ConfigProvider>
  </div>
);
