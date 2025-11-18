import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode } from 'react';

import Progress, { ProgressProps } from '.';
import Tag from '../Tag';
import Typography from '../Typography';

export default {
  title: 'Feedback/Progress',
  component: Progress,
} satisfies Meta<typeof Progress>;

type Story = StoryObj<ProgressProps>;

const types: ProgressProps['type'][] = ['progress', 'percent', 'icon'];
const statuses: ProgressProps['status'][] = ['enabled', 'success', 'error'];

export const Playground: Story = {
  args: {
    percent: 50,
    type: 'progress',
    status: 'enabled',
    tick: undefined,
  },
  argTypes: {
    percent: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'The progress percent(0~100)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    type: {
      control: {
        type: 'select',
      },
      options: types,
      description: 'The type of progress display',
      table: {
        type: { summary: "'progress' | 'percent' | 'icon'" },
        defaultValue: { summary: "'progress'" },
      },
    },
    status: {
      control: {
        type: 'select',
      },
      options: [...statuses],
      description: 'Force mark the progress status. automatically set if not defined. (enabled(0~99) or success(100) depending on percent)',
      table: {
        type: { summary: "'enabled' | 'success' | 'error' | undefined" },
      },
    },
    tick: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'The tick of progress (0~100). Only shows when tick < 100',
      table: {
        type: { summary: 'number | undefined' },
        defaultValue: { summary: 'undefined' },
      },
    },
    icons: {
      control: false,
      table: {
        disable: true,
      },
    },
    percentProps: {
      control: false,
      table: {
        disable: true,
      },
    },
    className: {
      control: false,
      table: {
        disable: true,
      },
    },
  },
  render: (props) => <Progress {...props} />,
};

const Section = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: 48,
    }}
  >
    <Typography variant="h2">{title}</Typography>
    {children}
  </div>
);

const SectionItem = ({
  children,
  label,
  direction = 'row',
}: {
  children: ReactNode;
  label?: string;
  direction?: 'column' | 'row';
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '33%',
      height: 'auto',
      backgroundColor: '#F3F4F6',
      padding: 32,
    }}
  >
    <Tag label={label ?? ''} size="main" type="static" />
    <div style={
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: direction === 'row' ? '20px' : 'auto',
        flexDirection: direction,
      }
    }
    >{children}</div>
  </div>
);

const ItemList = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start' }}>
    {children}
  </div>
);

const ItemContent = ({ children }: { children: ReactNode }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    marginBottom: 16,
  }}>
    {children}
  </div>
);

export const Line = () => {
  return (
    <>
      <Section title="Type:">
        <ItemList>
          <SectionItem label="Progress">
            <Progress percent={40} />
          </SectionItem>
          <SectionItem label="Without Progress Status">
            <Progress
              percent={50}
              type="percent"
            />
          </SectionItem>
          <SectionItem label="With Icon">
            <Progress
              percent={100}
              status="success"
              type="icon"
            />
          </SectionItem>
        </ItemList>
      </Section>

      <Section title="Variant:">
        <ItemList>
          <SectionItem label="Enabled" direction="column">
            <ItemContent>
              <Typography>Without Progress Status</Typography>
              <Progress
                percent={45}
                status="enabled"
                tick={20}
              />
            </ItemContent>
            <ItemContent>
              <Typography>With Percent</Typography>
              <Progress
                percent={45}
                status="enabled"
                type="percent"
              />
            </ItemContent>
          </SectionItem>
          <SectionItem label="Success" direction="column">
            <ItemContent>
              <Typography>Without Progress Status</Typography>
              <Progress
                percent={100}
                status="success"
                tick={90}
              />
            </ItemContent>
            <ItemContent>
              <Typography>With Percent</Typography>
              <Progress
                percent={100}
                status="success"
                type="percent"
              />
            </ItemContent>
            <ItemContent>
              <Typography>With Icon</Typography>
              <Progress
                percent={100}
                status="success"
                type="icon"
              />
            </ItemContent>
          </SectionItem>
          <SectionItem label="Error" direction="column">
            <ItemContent>
              <Typography>Without Progress Status</Typography>
              <Progress
                percent={60}
                status="error"
                tick={90}
              />
            </ItemContent>
            <ItemContent>
              <Typography>With Percent</Typography>
              <Progress
                percent={60}
                status="error"
                type="percent"
              />
            </ItemContent>
            <ItemContent>
              <Typography>With Icon</Typography>
              <Progress
                percent={60}
                status="error"
                type="icon"
              />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
    </>
  );
};
