import { Meta, StoryObj } from '@storybook/react-webpack5';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import Typography from '../Typography';
import Badge from '../Badge';
import Button from '../Button';
import Progress from '../Progress';
import Tag from '../Tag';
import TagGroup from '../Tag/TagGroup';
import Description from './Description';
import DescriptionContent from './DescriptionContent';

export default {
  title: 'Data Display/Description/Description',
} as Meta;

type Story = StoryObj<typeof Description>;

export const Playground: Story = {
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
        <Description title="訂購日期" widthType="narrow">
          <DescriptionContent>2025-11-03</DescriptionContent>
        </Description>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Badge
        </Typography>
        <Description title="訂單狀態" widthType="narrow">
          <Badge variant="dot-success" text="已訂購" />
        </Description>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Button
        </Typography>
        <Description title="訂單連結" widthType="narrow">
          <Button variant="base-text-link" size="sub">
            連結
          </Button>
        </Description>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Progress
        </Typography>
        <Description title="訂單進度" widthType="narrow">
          <Progress percent={80} type="percent" />
        </Description>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Tags
        </Typography>
        <Description title="訂單標籤" widthType="narrow">
          <TagGroup>
            <Tag label="快速" />
            <Tag label="冷藏" />
            <Tag label="特價" />
          </TagGroup>
        </Description>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Vertical
        </Typography>
        <Description
          orientation="vertical"
          title="訂購日期"
          icon={QuestionOutlineIcon}
          tooltip="tooltip"
          tooltipPlacement="top-start"
        >
          <DescriptionContent>2025-11-03</DescriptionContent>
        </Description>
      </div>
    </div>
  ),
};
