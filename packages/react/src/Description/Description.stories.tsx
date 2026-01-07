import { Meta, StoryObj } from '@storybook/react-webpack5';
import Typography from '../Typography';
import DescriptionTitle from './DescriptionTitle';
import DescriptionContent from './DescriptionContent';
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
          Horizontal
        </Typography>
        <Description widthType="narrow">
          <DescriptionTitle>訂購日期</DescriptionTitle>
          <DescriptionContent>2025-11-03</DescriptionContent>
        </Description>
      </div>
      <div>
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Vertical
        </Typography>
        <Description orientation="vertical">
          <DescriptionTitle>聯絡信箱</DescriptionTitle>
          <DescriptionContent>sample@rytass.com</DescriptionContent>
        </Description>
      </div>
    </div>
  ),
};
