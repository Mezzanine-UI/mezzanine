import { Meta, StoryObj } from '@storybook/react-webpack5';
import Badge from '../Badge';
import Description from './Description';
import DescriptionContent from './DescriptionContent';
import DescriptionGroup from './DescriptionGroup';

export default {
  title: 'Data Display/Description/DescriptionGroup',
} as Meta;

type GroupStory = StoryObj<typeof DescriptionGroup>;

export const Playground: GroupStory = {
  render: () => (
    <DescriptionGroup>
      <Description title="訂購日期" widthType="narrow">
        <DescriptionContent>2025-11-03</DescriptionContent>
      </Description>
      <Description title="訂單編號" widthType="narrow">
        <DescriptionContent>#HXE3901270287719038</DescriptionContent>
      </Description>
      <Description title="訂單狀態" widthType="narrow">
        <Badge variant="dot-success" text="已出貨" />
      </Description>
    </DescriptionGroup>
  ),
};
