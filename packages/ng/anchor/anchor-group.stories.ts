import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznAnchorGroup } from './anchor-group.component';
import { MznAnchorItem } from './anchor-item.component';
import { AnchorItemData } from './typings';

const meta: Meta<MznAnchorGroup> = {
  title: 'Navigation/Anchor',
  component: MznAnchorGroup,
  decorators: [moduleMetadata({ imports: [MznAnchorGroup, MznAnchorItem] })],
};

export default meta;
type Story = StoryObj;

/**
 * Note: href includes full Storybook path to prevent Storybook from modifying anchor URLs.
 * In normal usage, href only needs the hash (e.g., href: "#anchor-1").
 */
const childrenAnchors: AnchorItemData[] = [
  {
    href: '/?path=/story/navigation-anchor--all#child1',
    id: 'Child 1',
    name: 'Child 1',
    title: 'Child 1',
  },
  {
    children: [
      {
        href: '/?path=/story/navigation-anchor--all#child2-1',
        id: 'Child 2-1',
        name: 'Child 2-1',
        title: 'Child 2-1',
      },
    ],
    href: '/?path=/story/navigation-anchor--all#child2',
    id: 'Child 2',
    name: 'Child 2',
    title: 'Child 2',
  },
];

const anchors: AnchorItemData[] = [
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

export const Playground: Story = {
  name: 'Playground',
  argTypes: {
    anchors: {
      control: 'object',
      description: 'Array of anchor items to display.',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class name.',
    },
  },
  args: {
    anchors: [
      { href: '#section-1', id: 'section-1', name: 'Section 1' },
      { href: '#section-2', id: 'section-2', name: 'Section 2' },
      { href: '#section-3', id: 'section-3', name: 'Section 3' },
    ],
  },
  render: (args) => ({
    props: args,
    template: `<mzn-anchor-group [anchors]="anchors" [className]="className" />`,
  }),
};

export const All: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    props: {
      anchors,
      childrenAnchors,
    },
    template: `
      <div style="display: flex; flex-flow: column; gap: 24px;">
        <mzn-anchor-group [anchors]="childrenAnchors" />
        <mzn-anchor-group [anchors]="anchors" />
      </div>
    `,
  }),
};
