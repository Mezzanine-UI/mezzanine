import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ReactNode, useCallback, useRef } from 'react';
import Tag, { TagProps, TagSize } from '.';
import { TagType } from '@mezzanine-ui/core/tag';
import Typography from '../Typography';
import { useState } from 'react';
import Button from '../Button';
import TagGroup from './TagGroup';
import { AutoComplete } from '../AutoComplete';
import { SelectValue } from '../Select/typings';

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
  onClose: () => void;
  className: string;
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
    className: '',
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
    className: { control: 'text' },
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
      <Section title="Static">
        <ItemList>
          <SectionItem label="Enabled">
            <Tag label="Tag" size="main" type="static" />
          </SectionItem>
          <SectionItem label="Read Only">
            <Tag label="Tag" size="main" type="static" readOnly />
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Counter">
        <SectionItem>
          <Tag count={5} label="Tag" size="main" type="counter" />
        </SectionItem>
      </Section>
      <Section title="Overflow Counter">
        <ItemList>
          <SectionItem label="Enabled">
            <Tag count={5} size="main" type="overflow-counter" />
          </SectionItem>
          <SectionItem label="Disabled">
            <Tag count={5} size="main" type="overflow-counter" disabled />
          </SectionItem>
          <SectionItem label="Read Only">
            <Tag count={5} size="main" type="overflow-counter" readOnly />
          </SectionItem>
        </ItemList>
      </Section>

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
          {/* <SectionItem label="Read Only">
            <Tag
              readOnly
              label="Tag"
              onClose={voidFn}
              size="main"
              type="dismissable"
            />
          </SectionItem> */}
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
            <SectionItem label="Minor">
              <Tag label="Tag" size="minor" type="static" />
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
            <SectionItem label="Minor">
              <Tag label="Tag" size="minor" type="counter" count={5} />
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
            <SectionItem label="Minor">
              <Tag size="minor" type="overflow-counter" count={5} />
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
            <SectionItem label="Minor">
              <Tag
                label="Tag"
                size="minor"
                type="dismissable"
                onClose={voidFn}
              />
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
            <SectionItem label="Minor">
              <Tag label="Tag" size="minor" type="addable" onClick={voidFn} />
            </SectionItem>
          </ItemList>
        </Section>
      </div>
    </div>
  ),
};

const autocompleteOptions: SelectValue[] = [
  { id: 'design', name: 'Design' },
  { id: 'development', name: 'Development' },
  { id: 'product', name: 'Product' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'research', name: 'Research' },
  { id: 'data', name: 'Data' },
];

export const Addable_Interactive = {
  parameters: {
    control: { disable: true },
  },
  render: function Render() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<SelectValue[]>(autocompleteOptions);
    const [selections, setSelections] = useState<SelectValue[]>([]);
    const nextIdRef = useRef(autocompleteOptions.length + 1);

    const handleInsert = useCallback(
      (text: string, currentOptions: SelectValue[]): SelectValue[] => {
        const newOption: SelectValue = {
          id: `new-${nextIdRef.current++}`,
          name: text,
        };
        const updatedOptions = [...currentOptions, newOption];

        setOptions(updatedOptions);

        return updatedOptions;
      },
      [],
    );

    const handleRemoveCreated = useCallback((cleanedOptions: SelectValue[]) => {
      setOptions(cleanedOptions);
    }, []);

    const closeDropdown = useCallback(() => {
      setOpen(false);
    }, []);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <TagGroup>
          {selections.map((selection) => (
            <Tag
              key={selection.id}
              label={selection.name}
              type="dismissable"
              onClose={() =>
                setSelections((prev) =>
                  prev.filter((s) => s.id !== selection.id),
                )
              }
            />
          ))}
          <Tag
            label={open ? '收起選單' : '新增標籤'}
            type="addable"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setOpen((prev) => !prev);
            }}
          />
        </TagGroup>
        <AutoComplete
          addable
          fullWidth
          inputPosition="inside"
          mode="multiple"
          onChange={setSelections}
          onInsert={handleInsert}
          onRemoveCreated={handleRemoveCreated}
          onVisibilityChange={closeDropdown}
          open={open}
          options={options}
          placeholder="搜尋或新增標籤..."
          value={selections}
        />
      </div>
    );
  },
};

const mockTags = Array.from(new Array(5), (_, index) => `Tag${index + 1}`);

export const Tag_Group = {
  parameters: {
    control: { disable: true },
  },
  render: function Render() {
    const [tags, setTags] = useState(mockTags);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Button
          style={{ width: '120px' }}
          onClick={() => {
            setTags((prev) => [...prev, `Tag${tags.length + 1}`]);
          }}
        >
          Add tag
        </Button>

        <TagGroup style={{ maxWidth: '320px' }}>
          {tags.map((tag, index) => (
            <Tag
              key={tag}
              type="dismissable"
              onClose={() =>
                setTags((prev) => {
                  const next = [...prev];
                  next.splice(index, 1);

                  return next;
                })
              }
              label={tag}
            />
          ))}
        </TagGroup>
      </div>
    );
  },
};
