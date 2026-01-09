import { StoryObj, Meta } from '@storybook/react-webpack5';
import Anchor, { AnchorProps } from './Anchor';

export default {
  title: 'Navigation/Anchor',
  component: Anchor,
} satisfies Meta<typeof Anchor>;

type Story = StoryObj<AnchorProps>;

/**
 * Note: href includes full Storybook path to prevent Storybook from modifying anchor URLs.
 * In normal usage, href only needs the hash (e.g., href: "#anchor-1").
 */
const anchors: AnchorProps['anchors'] = [
  {
    href: '/?path=/story/navigation-anchor--basics#anchor1',
    id: 'Anchor1',
    name: 'Anchor 1',
  },
  {
    children: [
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--basics#anchor2-1-1',
            id: 'Anchor2-1-1',
            name: 'Anchor 2-1-1',
          },
        ],
        href: '/?path=/story/navigation-anchor--basics#anchor2-1',
        id: 'Anchor2-1',
        name: 'Anchor 2-1',
      },
      {
        children: [
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--basics#anchor2-2-1',
            id: 'Anchor2-2-1',
            name: 'Anchor 2-2-1',
          },
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--basics#anchor2-2-2',
            id: 'Anchor2-2-2',
            name: 'Anchor 2-2-2',
          },
        ],
        href: '/?path=/story/navigation-anchor--basics#anchor2-2',
        id: 'Anchor2-2',
        name: 'Anchor 2-2',
      },
    ],
    href: '/?path=/story/navigation-anchor--basics#anchor2',
    id: 'Anchor2',
    name: 'Anchor 2',
  },
  {
    children: [
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--basics#anchor3-1-1',
            id: 'Anchor3-1-1',
            name: 'Anchor 3-1-1',
          },
        ],
        href: '/?path=/story/navigation-anchor--basics#anchor3-1',
        id: 'Anchor3-1',
        name: 'Anchor 3-1',
      },
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--basics#anchor3-2-1',
            id: 'Anchor3-2-1',
            name: 'Anchor 3-2-1',
          },
        ],
        href: '/?path=/story/navigation-anchor--basics#anchor3-2',
        id: 'Anchor3-2',
        name: 'Anchor 3-2',
      },
    ],
    disabled: true,
    href: '/?path=/story/navigation-anchor--basics#anchor3',
    id: 'Anchor3',
    name: 'Anchor 3',
  },
];

export const All: Story = {
  render: () => <Anchor anchors={anchors} />,
};
