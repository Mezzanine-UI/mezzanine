import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznAnchor from './anchor.vue';
import MznAnchorGroup from './anchor-group.vue';
import type { AnchorPropsWithAnchors } from './anchor.types';

export default {
  title: 'Navigation/Anchor',
  component: MznAnchor,
} satisfies Meta<typeof MznAnchor>;

type Story = StoryObj;

/**
 * Note: href includes full Storybook path to prevent Storybook from modifying anchor URLs.
 * In normal usage, href only needs the hash (e.g., href: "#anchor-1").
 */
const anchors: AnchorPropsWithAnchors['anchors'] = [
  {
    href: '/?path=/story/navigation-anchor--all#anchor1',
    id: 'Anchor1',
    name: 'Anchor 1',
  },
  {
    children: [
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--all#anchor2-1-1',
            id: 'Anchor2-1-1',
            name: 'Anchor 2-1-1',
          },
        ],
        href: '/?path=/story/navigation-anchor--all#anchor2-1',
        id: 'Anchor2-1',
        name: 'Anchor 2-1',
      },
      {
        children: [
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--all#anchor2-2-1',
            id: 'Anchor2-2-1',
            name: 'Anchor 2-2-1',
          },
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--all#anchor2-2-2',
            id: 'Anchor2-2-2',
            name: 'Anchor 2-2-2',
          },
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--all#anchor2-2-3',
            id: 'Anchor2-2-3',
            name: 'Anchor 2-2-3',
          },
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--all#anchor2-2-4',
            id: 'Anchor2-2-4',
            name: 'Anchor 2-2-4',
          },
        ],
        href: '/?path=/story/navigation-anchor--all#anchor2-2',
        id: 'Anchor2-2',
        name: 'Anchor 2-2',
      },
    ],
    href: '/?path=/story/navigation-anchor--all#anchor2',
    id: 'Anchor2',
    name: 'Anchor 2',
  },
  {
    children: [
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--all#anchor3-1-1',
            id: 'Anchor3-1-1',
            name: 'Anchor 3-1-1',
          },
        ],
        href: '/?path=/story/navigation-anchor--all#anchor3-1',
        id: 'Anchor3-1',
        name: 'Anchor 3-1',
      },
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--all#anchor3-2-1',
            id: 'Anchor3-2-1',
            name: 'Anchor 3-2-1',
          },
        ],
        href: '/?path=/story/navigation-anchor--all#anchor3-2',
        id: 'Anchor3-2',
        name: 'Anchor 3-2',
      },
    ],
    disabled: true,
    href: '/?path=/story/navigation-anchor--all#anchor3',
    id: 'Anchor3',
    name: 'Anchor 3',
    title: 'Anchor 3',
  },
  {
    href: '/?path=/story/navigation-anchor--all#anchor4',
    id: 'Anchor4',
    name: 'Anchor 4',
  },
  {
    href: '/?path=/story/navigation-anchor--all#anchor5',
    id: 'Anchor5',
    name: 'Anchor 5',
  },
];

export const All: Story = {
  render: () => ({
    components: { MznAnchor, MznAnchorGroup },
    setup: () => ({ anchors }),
    template: `
      <div style="display: flex; flex-flow: column; gap: 24px">
        <MznAnchorGroup>
          <MznAnchor href="/?path=/story/navigation-anchor--all#child1" title="Child 1">
            Child 1
          </MznAnchor>
          <MznAnchor href="/?path=/story/navigation-anchor--all#child2" title="Child 2">
            Child 2
            <MznAnchor href="/?path=/story/navigation-anchor--all#child2-1" title="Child 2-1">Child 2-1</MznAnchor>
          </MznAnchor>
        </MznAnchorGroup>

        <MznAnchorGroup :anchors="anchors" />
      </div>
    `,
  }),
};
