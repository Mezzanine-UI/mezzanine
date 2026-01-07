import { Meta, StoryObj } from '@storybook/react-webpack5';
import Typography from '../Typography';
import Badge from '../Badge';
import DescriptionTitle from './DescriptionTitle';
import DescriptionContent from './DescriptionContent';
import DescriptionGroup from './DescriptionGroup';

export default {
  title: 'Data Display/Description/DescriptionGroup',
  component: DescriptionGroup,
} as Meta;

type GroupStory = StoryObj<typeof DescriptionGroup>;

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
          Horizontal
        </Typography>
        <DescriptionGroup widthType="narrow">
          <DescriptionTitle>訂購日期</DescriptionTitle>
          <DescriptionContent>2025-11-03</DescriptionContent>
        </DescriptionGroup>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Vertical
        </Typography>
        <DescriptionGroup orientation="vertical">
          <DescriptionTitle>聯絡信箱</DescriptionTitle>
          <DescriptionContent>sample@rytass.com</DescriptionContent>
        </DescriptionGroup>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Group
        </Typography>
        <DescriptionGroup orientation="vertical" isWrapGroup>
          <DescriptionGroup widthType="narrow">
            <DescriptionTitle>訂購日期</DescriptionTitle>
            <DescriptionContent>2025-11-03</DescriptionContent>
          </DescriptionGroup>
          <DescriptionGroup widthType="narrow">
            <DescriptionTitle>訂單編號</DescriptionTitle>
            <DescriptionContent>#HXE3901270287719038</DescriptionContent>
          </DescriptionGroup>
          <DescriptionGroup widthType="narrow">
            <DescriptionTitle>訂單狀態</DescriptionTitle>
            <Badge variant="dot-success" text="已出貨" />
          </DescriptionGroup>
        </DescriptionGroup>
      </div>
    </div>
  ),
};
