import { Story, Meta } from '@storybook/react';
import Typography from '../Typography';
import Empty, { EmptyProps } from './Empty';

export default {
  title: 'Data Display/Empty',
} as Meta;

type PlaygroundArgs = Required<Pick<EmptyProps, 'children' | 'fullHeight' | 'title'>>;

const demoImage = (
  <div style={{
    width: '100px',
    height: '100px',
    marginBottom: '4px',
    backgroundImage: 'radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a)',
    borderRadius: '100%',
  }}
  />
);

export const Playgroud: Story<PlaygroundArgs> = ({ children, title, ...args }) => (
  <>
    <Typography variant="h4">
      預設 Icon
    </Typography>
    <div style={{
      width: '100%',
      height: '270px',
      margin: '0 0 24px 0',
      backgroundColor: '#e5e5e5',
    }}
    >
      <Empty
        title={title}
        {...args}
      >
        {children}
      </Empty>
    </div>
    <Typography variant="h4">
      自定義 Image
    </Typography>
    <div style={{
      width: '100%',
      height: '270px',
      backgroundColor: '#e5e5e5',
    }}
    >
      <Empty
        title={title}
        image={demoImage}
        {...args}
      >
        {children}
      </Empty>
    </div>
  </>
);

Playgroud.args = {
  children: '找不到符合條件的資料',
  title: '查無資料',
  fullHeight: false,
};

Playgroud.argTypes = {
  children: {
    control: {
      type: 'text',
    },
  },
  title: {
    control: {
      type: 'text',
    },
  },
  fullHeight: {
    control: {
      type: 'boolean',
    },
  },
};
