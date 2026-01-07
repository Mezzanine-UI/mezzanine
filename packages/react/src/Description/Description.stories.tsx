import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import Typography from '../Typography';
import Description from './Description';

export default {
  title: 'Data Display/Description/Description',
} as Meta;

type GroupStory = StoryObj<typeof Description>;

export const Playground: GroupStory = {
  render: () => (
    <div
      style={{
        width: 280,
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
            widthType: 'narrow',
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
          Button
        </Typography>
        <Description
          titleProps={{
            children: '訂單連結',
            widthType: 'narrow',
          }}
          contentProps={{
            variant: 'button',
            button: {
              variant: 'base-text-link',
              children: '連結',
              size: 'sub',
            },
          }}
        />
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Progress
        </Typography>
        <Description
          titleProps={{
            children: '訂單進度',
            widthType: 'narrow',
          }}
          contentProps={{
            variant: 'progress',
            progress: {
              percent: 80,
              type: 'percent',
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
            icon: QuestionOutlineIcon,
            tooltip: 'tooltip',
            tooltipPlacement: 'top-start',
          }}
          contentProps={{
            children: '2025-11-03',
          }}
        />
      </div>
    </div>
  ),
};
