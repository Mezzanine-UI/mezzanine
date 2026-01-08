import { Meta } from '@storybook/react-webpack5';
import Anchor from './Anchor';

export default {
  title: 'Navigation/Anchor',
} as Meta;

const anchors = [
  {
    href: '/?path=/story/navigation-anchor--basics#anchor1',
    id: 'Anchor1',
    name: 'Anchor 1',
  },
  {
    children: [
      {
        href: '/?path=/story/navigation-anchor--basics#anchor2-1',
        id: 'Anchor2-1',
        name: 'Anchor 2-1',
        children: [
          {
            href: '/?path=/story/navigation-anchor--basics#anchor2-1-1',
            id: 'Anchor2-1-1',
            name: 'Anchor 2-1-1',
          },
        ],
      },
      {
        href: '/?path=/story/navigation-anchor--basics#anchor2-2',
        id: 'Anchor2-2',
        name: 'Anchor 2-2',
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
      },
    ],
    href: '/?path=/story/navigation-anchor--basics#anchor2',
    id: 'Anchor2',
    name: 'Anchor 2',
  },
  {
    disabled: true,
    href: '/?path=/story/navigation-anchor--basics#anchor3',
    id: 'Anchor3',
    name: 'Anchor 3',
    children: [
      {
        href: '/?path=/story/navigation-anchor--basics#anchor3-1',
        id: 'Anchor3-1',
        name: 'Anchor 3-1',
        children: [
          {
            href: '/?path=/story/navigation-anchor--basics#anchor3-1-1',
            id: 'Anchor3-1-1',
            name: 'Anchor 3-1-1',
          },
        ],
      },
      {
        href: '/?path=/story/navigation-anchor--basics#anchor3-2',
        id: 'Anchor3-2',
        name: 'Anchor 3-2',
        children: [
          {
            href: '/?path=/story/navigation-anchor--basics#anchor3-2-1',
            id: 'Anchor3-2-1',
            name: 'Anchor 3-2-1',
          },
        ],
      },
    ],
  },
];

export const All = () => (
  <Anchor anchors={anchors} />
);
