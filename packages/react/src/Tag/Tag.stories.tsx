import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode } from 'react';
import Tag, { TagProps, TagSize } from '.';
import { TagType } from '@mezzanine-ui/core/tag';
import Typography from '../Typography';

export default {
  title: 'Data Display/Tag',
  component: Tag,
} satisfies Meta<typeof Tag>;

const types: TagType[] = [
  'static',
  'counter',
  'overflow-counter',
  'dismissable',
  'addable',
];
const sizes: TagSize[] = ['main', 'sub'];

type Story = StoryObj<TagProps>;

type PlaygroundArgs = {
  type: TagType;
  size: TagSize;
  label: string;
  count: number;
  active: boolean;
  disabled: boolean;
  readOnly: boolean;
  onAdd: () => void;
  onClose: () => void;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    type: 'static',
    size: 'main',
    label: 'Tag',
    count: 5,
    active: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: types,
    },
    size: {
      control: 'inline-radio',
      options: sizes,
    },
    count: { control: 'number' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    onAdd: { control: false, table: { disable: true } },
    onClose: { control: false, table: { disable: true } },
  },
};

const voidFn = () => {};

const Section = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}
  >
    <Typography variant="h2">{title}</Typography>
    {children}
  </div>
);

const SectionItem = ({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
  >
    {children}
    <Typography variant="body" style={{ marginInline: 'auto' }}>
      {label}
    </Typography>
  </div>
);

const ItemList = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-end' }}>
    {children}
  </div>
);

export const Types: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '48px',
      }}
    >
      <div style={{ display: 'flex', gap: '80px' }}>
        <Section title="Static">
          <SectionItem>
            <Tag label="Tag" size="main" type="static" />
          </SectionItem>
        </Section>
        <Section title="Counter">
          <SectionItem>
            <Tag count={5} label="Tag" size="main" type="counter" />
          </SectionItem>
        </Section>
        <Section title="Overflow Counter">
          <SectionItem>
            <Tag count={5} size="main" type="overflow-counter" />
          </SectionItem>
        </Section>
      </div>

      <Section title="Dismissable">
        <ItemList>
          <SectionItem label="Enabled">
            <Tag label="Tag" onClose={voidFn} size="main" type="dismissable" />
          </SectionItem>
          <SectionItem label="Hover">
            <Tag
              className="is-hover"
              label="Tag"
              onClose={voidFn}
              size="main"
              type="dismissable"
            />
          </SectionItem>
          <SectionItem label="Active">
            <Tag
              active
              label="Tag"
              onClose={voidFn}
              size="main"
              type="dismissable"
            />
          </SectionItem>

          <SectionItem label="Disabled">
            <Tag
              disabled
              label="Tag"
              onClose={voidFn}
              size="main"
              type="dismissable"
            />
          </SectionItem>
          <SectionItem label="Read Only">
            <Tag
              readOnly
              label="Tag"
              onClose={voidFn}
              size="main"
              type="dismissable"
            />
          </SectionItem>
        </ItemList>
      </Section>

      <Section title="Addable">
        <ItemList>
          <SectionItem label="Enabled">
            <Tag label="Tag" onClick={voidFn} size="main" type="addable" />
          </SectionItem>
          <SectionItem label="Hover">
            <Tag
              className="is-hover"
              label="Tag"
              onClick={voidFn}
              size="main"
              type="addable"
            />
          </SectionItem>
          <SectionItem label="Active">
            <Tag
              active
              label="Tag"
              onClick={voidFn}
              size="main"
              type="addable"
            />
          </SectionItem>

          <SectionItem label="Disabled">
            <Tag
              disabled
              label="Tag"
              onClick={voidFn}
              size="main"
              type="addable"
            />
          </SectionItem>
        </ItemList>
      </Section>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '72px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        <Section title="Static">
          <ItemList>
            <SectionItem label="Main">
              <Tag label="Tag" size="main" type="static" />
            </SectionItem>
            <SectionItem label="Sub">
              <Tag label="Tag" size="sub" type="static" />
            </SectionItem>
          </ItemList>
        </Section>

        <Section title="Counter">
          <ItemList>
            <SectionItem label="Main">
              <Tag label="Tag" size="main" type="counter" count={5} />
            </SectionItem>
            <SectionItem label="Sub">
              <Tag label="Tag" size="sub" type="counter" count={5} />
            </SectionItem>
          </ItemList>
        </Section>
        <Section title="Overflow Counter">
          <ItemList>
            <SectionItem label="Main">
              <Tag size="main" type="overflow-counter" count={5} />
            </SectionItem>
            <SectionItem label="Sub">
              <Tag size="sub" type="overflow-counter" count={5} />
            </SectionItem>
          </ItemList>
        </Section>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '48px',
        }}
      >
        <Section title="Dismissable">
          <ItemList>
            <SectionItem label="Main">
              <Tag
                label="Tag"
                size="main"
                type="dismissable"
                onClose={voidFn}
              />
            </SectionItem>
            <SectionItem label="Sub">
              <Tag label="Tag" size="sub" type="dismissable" onClose={voidFn} />
            </SectionItem>
          </ItemList>
        </Section>
        <Section title="Addable">
          <ItemList>
            <SectionItem label="Main">
              <Tag label="Tag" size="main" type="addable" onClick={voidFn} />
            </SectionItem>
            <SectionItem label="Sub">
              <Tag label="Tag" size="sub" type="addable" onClick={voidFn} />
            </SectionItem>
          </ItemList>
        </Section>
      </div>
    </div>
  ),
};
