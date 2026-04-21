import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznAnchorGroup } from './anchor-group.component';
import { AnchorItemData } from './typings';

const meta: Meta<MznAnchorGroup> = {
  title: 'Navigation/Anchor',
  component: MznAnchorGroup,
  decorators: [moduleMetadata({ imports: [MznAnchorGroup] })],
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

export const All: Story = {
  parameters: {
    controls: { disable: true },
  },
  argTypes: {
    anchors: {
      control: false,
      description: '錨點項目資料陣列,支援最多三層巢狀(每層最多三項)。',
      table: {
        category: 'MznAnchorGroup Inputs',
        type: { summary: 'AnchorItemData[]' },
      },
    },
    className: {
      control: 'text',
      description: '附加到 host 的自訂 CSS class。',
      table: {
        category: 'MznAnchorGroup Inputs',
        type: { summary: 'string' },
      },
    },
    'AnchorItemData.id': {
      name: 'id',
      control: false,
      description: '唯一識別碼,作為 `@for` track 值。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'string' },
      },
    },
    'AnchorItemData.name': {
      name: 'name',
      control: false,
      description: '顯示名稱。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'string' },
      },
    },
    'AnchorItemData.href': {
      name: 'href',
      control: false,
      description: '連結目標,通常包含 hash(如 `#section-1`)。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'string' },
      },
    },
    'AnchorItemData.title': {
      name: 'title',
      control: false,
      description: '對應 HTML `title` 屬性。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'string' },
      },
    },
    'AnchorItemData.autoScrollTo': {
      name: 'autoScrollTo',
      control: false,
      description:
        '點擊時是否以 `scrollIntoView({ behavior: "smooth" })` 平滑捲動到目標。父層設定 `true` 會繼承給子項目。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    'AnchorItemData.disabled': {
      name: 'disabled',
      control: false,
      description: '是否停用此錨點。父層停用時,所有子 anchor 一併停用。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    'AnchorItemData.onClick': {
      name: 'onClick',
      control: false,
      description: '點擊此錨點時觸發的 callback。',
      table: {
        category: 'AnchorItemData',
        type: { summary: '() => void' },
      },
    },
    'AnchorItemData.children': {
      name: 'children',
      control: false,
      description: '子錨點陣列。最多三層巢狀,每層最多三項,超過部分會被忽略。',
      table: {
        category: 'AnchorItemData',
        type: { summary: 'AnchorItemData[]' },
      },
    },
  },
  render: () => ({
    props: {
      anchors,
      childrenAnchors,
    },
    template: `
      <div style="display: flex; flex-flow: column; gap: 24px;">
        <div mznAnchorGroup [anchors]="childrenAnchors"></div>
        <div mznAnchorGroup [anchors]="anchors"></div>
      </div>
    `,
  }),
};
