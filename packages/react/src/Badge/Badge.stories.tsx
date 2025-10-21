import { StoryFn, Meta } from '@storybook/react-webpack5';
import Badge, { BadgeContainer, BadgeProps } from '.';

export default {
  title: 'Data Display/Badge',
} as Meta;

const DemoChildren = () => (
  <div
    style={{
      width: '100px',
      height: '100px',
      backgroundColor: '#E5E5E5',
    }}
  />
);

interface PlaygroundArgs
  extends Required<Pick<BadgeProps, 'dot' | 'overflowCount'>> {
  content: number;
}

export const Playgroud: StoryFn<PlaygroundArgs> = ({
  content,
  dot,
  overflowCount,
}) => (
  <>
    <BadgeContainer>
      <Badge dot={dot} overflowCount={overflowCount}>
        {content}
      </Badge>
      <DemoChildren />
    </BadgeContainer>
  </>
);

Playgroud.args = {
  content: 1,
  dot: false,
  overflowCount: 99,
};

Playgroud.argTypes = {
  overflowCount: {
    control: {
      type: 'number',
    },
  },
};

const commonBadgeStyle = {
  margin: '24px',
};

export const Common = () => (
  <>
    <BadgeContainer style={commonBadgeStyle}>
      <Badge>{0}</Badge>
      <DemoChildren />
    </BadgeContainer>
    <BadgeContainer style={commonBadgeStyle}>
      <Badge dot />
      <DemoChildren />
    </BadgeContainer>
    <BadgeContainer style={commonBadgeStyle}>
      <Badge>{1}</Badge>
      <DemoChildren />
    </BadgeContainer>
    <BadgeContainer style={commonBadgeStyle}>
      <Badge>{99}</Badge>
      <DemoChildren />
    </BadgeContainer>
    <BadgeContainer style={commonBadgeStyle}>
      <Badge overflowCount={999}>{999}</Badge>
      <DemoChildren />
    </BadgeContainer>
    <BadgeContainer style={commonBadgeStyle}>
      <Badge overflowCount={999}>{1000}</Badge>
      <DemoChildren />
    </BadgeContainer>
  </>
);

export const Standalone = () => (
  <>
    <Badge dot />
    <Badge>{0}</Badge>
    <Badge>{99}</Badge>
    <Badge overflowCount={999}>{999}</Badge>
    <Badge overflowCount={999}>{1000}</Badge>
  </>
);
