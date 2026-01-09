import { Meta, StoryObj } from '@storybook/react-webpack5';
import Description from './Description';
import DescriptionGroup from './DescriptionGroup';

export default {
  title: 'Data Display/Description/DescriptionGroup',
} as Meta;

type GroupStory = StoryObj<typeof DescriptionGroup>;

export const Playground: GroupStory = {
  render: () => (
    <DescriptionGroup>
      <Description
        titleProps={{
          widthType: 'narrow',
          children: '訂購日期',
        }}
        contentProps={{
          children: '2025-11-03',
        }}
      />
      <Description
        titleProps={{
          widthType: 'narrow',
          children: '訂單編號',
        }}
        contentProps={{
          children: '#HXE3901270287719038',
        }}
      />
      <Description
        titleProps={{
          widthType: 'narrow',
          children: '訂單狀態',
        }}
        contentProps={{
          variant: 'badge',
          badge: {
            variant: 'dot-success',
            text: '已出貨',
          },
        }}
      />
    </DescriptionGroup>
  ),
};
