import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import Typography from '../Typography';
import Description from './Description';

export default {
  title: 'Data Display/Description/Description',
  component: Description,
} as Meta;

type GroupStory = StoryObj<typeof Description>;

export const Playground: GroupStory = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Normal
        </Typography>
        <Description
          titleProps={{
            children: '訂購日期',
            icon: QuestionOutlineIcon,
            tooltip: 'question',
            widthType: 'wide',
          }}
          contentProps={{
            children: '2025-11-03',
          }}
        />
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Badge
        </Typography>
        <Description
          titleProps={{
            children: '訂單狀態',
            widthType: 'narrow',
          }}
          contentProps={{
            variant: 'badge',
            badge: {
              variant: 'dot-success',
              text: '已訂購',
            },
          }}
        />
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Vertical
        </Typography>
        <Description
          orientation="vertical"
          titleProps={{
            children: '訂購日期',
          }}
          contentProps={{
            children: '2025-11-03',
          }}
        />
      </div>
    </div>
  ),
};
