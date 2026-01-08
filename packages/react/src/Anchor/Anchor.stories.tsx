import { Meta } from '@storybook/react-webpack5';
import Anchor from './Anchor';

export default {
  title: 'Navigation/Anchor',
} as Meta;

const anchorList = [
  {
    id: 'Anchor1',
    name: 'Anchor1',
    href: '/?path=/story/navigation-anchor--basics#anchor1',
  },
  {
    id: 'Anchor2',
    name: 'Anchor2',
    href: '/?path=/story/navigation-anchor--basics#anchor2',
  },
  {
    id: 'lorem ipsum lorem ipsum lorem ipsum',
    name: 'lorem ipsum lorem ipsum lorem ipsum',
    href: '/?path=/story/navigation-anchor--basics#lorem-ipsum',
  },
  {
    id: 'Anchor4',
    name: 'Anchor4',
    href: '/?path=/story/navigation-anchor--basics#anchor4',
  },
  {
    id: 'Anchor5',
    name: 'Anchor5',
    href: '/?path=/story/navigation-anchor--basics#anchor5',
  },
];

const nestedAnchorList = [
  {
    id: 'introduction',
    name: 'Introduction',
    href: '/?path=/story/navigation-anchor--data-driven-nested#introduction',
  },
  {
    children: [
      {
        id: 'installation',
        name: 'Installation',
        href: '/?path=/story/navigation-anchor--data-driven-nested#installation',
      },
      {
        children: [
          {
            id: 'basic-setup',
            name: 'Basic Setup',
            href: '/?path=/story/navigation-anchor--data-driven-nested#basic-setup',
          },
          {
            id: 'advanced-setup',
            name: 'Advanced Setup',
            href: '/?path=/story/navigation-anchor--data-driven-nested#advanced-setup',
          },
          {
            id: 'advanced-setup-3',
            name: 'Advanced Setup-3',
            href: '/?path=/story/navigation-anchor--data-driven-nested#advanced-setup-3',
          },
          {
            id: 'advanced-setup-4',
            name: 'Advanced Setup-4',
            href: '/?path=/story/navigation-anchor--data-driven-nested#advanced-setup-4',
          },
        ],
        id: 'configuration',
        name: 'Configuration',
        href: '/?path=/story/navigation-anchor--data-driven-nested#configuration',
      },
      {
        id: 'first-steps',
        name: 'First Steps',
        href: '/?path=/story/navigation-anchor--data-driven-nested#first-steps',
      },
    ],
    id: 'getting-started',
    name: 'Getting Started',
    href: '/?path=/story/navigation-anchor--data-driven-nested#getting-started',
  },
  {
    children: [
      {
        id: 'components',
        name: 'Components',
        href: '/?path=/story/navigation-anchor--data-driven-nested#components',
      },
      {
        id: 'hooks',
        name: 'Hooks',
        href: '/?path=/story/navigation-anchor--data-driven-nested#hooks',
      },
    ],
    id: 'api-reference',
    name: 'API Reference',
    href: '/?path=/story/navigation-anchor--data-driven-nested#api-reference',
  },
  {
    id: 'examples',
    name: 'Examples',
    href: '/?path=/story/navigation-anchor--data-driven-nested#examples',
  },
];

export const Basics = () => (
  <Anchor anchors={anchorList} />
);

export const DataDrivenNested = () => (
  <Anchor anchors={nestedAnchorList} />
);

export const JSXNested = () => (
  <Anchor>
    <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-1">Child-1</Anchor>
    <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2">
      Child-2
      <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-1">Child-2-1</Anchor>
      <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-2">
        Child-2-2
        <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-2-1">Child-2-2-1</Anchor>
        <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-2-2">Child-2-2-2</Anchor>
        <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-2-3">Child-2-2-3</Anchor>
        <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-2-4">Child-2-2-4</Anchor>
      </Anchor>
      <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-2-3">Child-2-3</Anchor>
    </Anchor>
    <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-3">
      Child-3
      <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-3-1">Child-3-1</Anchor>
      <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-3-2">Child-3-2</Anchor>
    </Anchor>
    <Anchor href="/?path=/story/navigation-anchor--jsx-nested#child-4">Child-4</Anchor>
  </Anchor>
);

export const WithDisabledItems = () => (
  <Anchor
    anchors={[
      {
        href: '/?path=/story/navigation-anchor--with-disabled-items#enabled',
        id: 'enabled',
        name: 'Enabled Item',
      },
      {
        disabled: true,
        href: '/?path=/story/navigation-anchor--with-disabled-items#disabled',
        id: 'disabled',
        name: 'Disabled Item',
      },
      {
        children: [
          {
            href: '/?path=/story/navigation-anchor--with-disabled-items#nested-enabled',
            id: 'nested-enabled',
            name: 'Nested Enabled',
          },
          {
            disabled: true,
            href: '/?path=/story/navigation-anchor--with-disabled-items#nested-disabled',
            id: 'nested-disabled',
            name: 'Nested Disabled',
          },
        ],
        href: '/?path=/story/navigation-anchor--with-disabled-items#parent',
        id: 'parent',
        name: 'Parent with Mixed Children',
      },
      {
        children: [
          {
            disabled: false,
            href: '/?path=/story/navigation-anchor--with-disabled-items#child-1',
            id: 'child-1',
            name: 'Child 1 (disabled=false, but parent disabled)',
          },
          {
            href: '/?path=/story/navigation-anchor--with-disabled-items#child-2',
            id: 'child-2',
            name: 'Child 2 (no disabled prop, but parent disabled)',
          },
        ],
        disabled: true,
        href: '/?path=/story/navigation-anchor--with-disabled-items#disabled-parent',
        id: 'disabled-parent',
        name: 'Disabled Parent (all children also disabled)',
      },
    ]}
  />
);
