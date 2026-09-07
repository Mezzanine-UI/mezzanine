import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { TagSize, TagType } from '@mezzanine-ui/core/tag';
import MznAutoComplete from '../auto-complete/auto-complete.vue';
import MznButton from '../button/button.vue';
import type { SelectValue } from '../select/select.types';
import MznTypography from '../typography/typography.vue';
import MznTag from './tag.vue';
import MznTagGroup from './tag-group.vue';

export default {
  component: MznTag,
  title: 'Data Display/Tag',
} as Meta;

const types: TagType[] = [
  'static',
  'counter',
  'overflow-counter',
  'dismissable',
  'addable',
];
const sizes: TagSize[] = ['main', 'sub'];

type Story = StoryObj<typeof MznTag>;

type PlaygroundArgs = {
  active: boolean;
  className: string;
  count: number;
  disabled: boolean;
  label: string;
  readOnly: boolean;
  size: TagSize;
  type: TagType;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    active: false,
    className: '',
    count: 5,
    disabled: false,
    label: 'Tag',
    readOnly: false,
    size: 'main',
    type: 'static',
  },
  argTypes: {
    active: { control: 'boolean' },
    className: { control: 'text' },
    count: { control: 'number' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: sizes,
    },
    type: {
      control: 'select',
      options: types,
    },
  },
  render: (args) => ({
    components: { MznTag },
    setup: () => {
      const { className, ...rest } = args;

      return { className, rest };
    },
    template: '<MznTag v-bind="rest" :class="className" />',
  }),
};

const voidFn = (): void => {};

/** React's `Section`: a heading over its items. */
const Section = {
  components: { MznTypography },
  props: { title: { type: String, required: true } },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px">
      <MznTypography variant="h2">{{ title }}</MznTypography>
      <slot />
    </div>
  `,
};

/** React's `SectionItem`: an item with its caption underneath. */
const SectionItem = {
  components: { MznTypography },
  props: { label: { type: String, default: undefined } },
  setup: () => ({ labelStyle: { marginInline: 'auto' } }),
  template: `
    <div style="display: flex; flex-direction: column; gap: 8px">
      <slot />
      <MznTypography variant="body" :style="labelStyle">{{ label }}</MznTypography>
    </div>
  `,
};

const ItemList = {
  template: `
    <div style="display: flex; gap: 36px; align-items: flex-end">
      <slot />
    </div>
  `,
};

export const Types: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    components: { ItemList, MznTag, Section, SectionItem },
    setup: () => ({ voidFn }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <Section title="Static">
          <ItemList>
            <SectionItem label="Enabled">
              <MznTag label="Tag" size="main" type="static" />
            </SectionItem>
            <SectionItem label="Read Only">
              <MznTag label="Tag" size="main" type="static" read-only />
            </SectionItem>
          </ItemList>
        </Section>
        <Section title="Counter">
          <SectionItem>
            <MznTag :count="5" label="Tag" size="main" type="counter" />
          </SectionItem>
        </Section>
        <Section title="Overflow Counter">
          <ItemList>
            <SectionItem label="Enabled">
              <MznTag :count="5" size="main" type="overflow-counter" />
            </SectionItem>
            <SectionItem label="Disabled">
              <MznTag :count="5" size="main" type="overflow-counter" disabled />
            </SectionItem>
            <SectionItem label="Read Only">
              <MznTag :count="5" size="main" type="overflow-counter" read-only />
            </SectionItem>
          </ItemList>
        </Section>

        <Section title="Dismissable">
          <ItemList>
            <SectionItem label="Enabled">
              <MznTag label="Tag" size="main" type="dismissable" @close="voidFn" />
            </SectionItem>
            <SectionItem label="Hover">
              <MznTag
                class="is-hover"
                label="Tag"
                size="main"
                type="dismissable"
                @close="voidFn"
              />
            </SectionItem>
            <SectionItem label="Active">
              <MznTag
                active
                label="Tag"
                size="main"
                type="dismissable"
                @close="voidFn"
              />
            </SectionItem>

            <SectionItem label="Disabled">
              <MznTag
                disabled
                label="Tag"
                size="main"
                type="dismissable"
                @close="voidFn"
              />
            </SectionItem>
          </ItemList>
        </Section>

        <Section title="Addable">
          <ItemList>
            <SectionItem label="Enabled">
              <MznTag label="Tag" size="main" type="addable" @click="voidFn" />
            </SectionItem>
            <SectionItem label="Hover">
              <MznTag
                class="is-hover"
                label="Tag"
                size="main"
                type="addable"
                @click="voidFn"
              />
            </SectionItem>
            <SectionItem label="Active">
              <MznTag
                active
                label="Tag"
                size="main"
                type="addable"
                @click="voidFn"
              />
            </SectionItem>

            <SectionItem label="Disabled">
              <MznTag
                disabled
                label="Tag"
                size="main"
                type="addable"
                @click="voidFn"
              />
            </SectionItem>
          </ItemList>
        </Section>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => ({
    components: { ItemList, MznTag, Section, SectionItem },
    setup: () => ({ voidFn }),
    template: `
      <div style="display: flex; gap: 72px">
        <div style="display: flex; flex-direction: column; gap: 48px">
          <Section title="Static">
            <ItemList>
              <SectionItem label="Main">
                <MznTag label="Tag" size="main" type="static" />
              </SectionItem>
              <SectionItem label="Sub">
                <MznTag label="Tag" size="sub" type="static" />
              </SectionItem>
              <SectionItem label="Minor">
                <MznTag label="Tag" size="minor" type="static" />
              </SectionItem>
            </ItemList>
          </Section>

          <Section title="Counter">
            <ItemList>
              <SectionItem label="Main">
                <MznTag label="Tag" size="main" type="counter" :count="5" />
              </SectionItem>
              <SectionItem label="Sub">
                <MznTag label="Tag" size="sub" type="counter" :count="5" />
              </SectionItem>
              <SectionItem label="Minor">
                <MznTag label="Tag" size="minor" type="counter" :count="5" />
              </SectionItem>
            </ItemList>
          </Section>
          <Section title="Overflow Counter">
            <ItemList>
              <SectionItem label="Main">
                <MznTag size="main" type="overflow-counter" :count="5" />
              </SectionItem>
              <SectionItem label="Sub">
                <MznTag size="sub" type="overflow-counter" :count="5" />
              </SectionItem>
              <SectionItem label="Minor">
                <MznTag size="minor" type="overflow-counter" :count="5" />
              </SectionItem>
            </ItemList>
          </Section>
        </div>
        <div style="display: flex; flex-direction: column; gap: 48px">
          <Section title="Dismissable">
            <ItemList>
              <SectionItem label="Main">
                <MznTag label="Tag" size="main" type="dismissable" @close="voidFn" />
              </SectionItem>
              <SectionItem label="Sub">
                <MznTag label="Tag" size="sub" type="dismissable" @close="voidFn" />
              </SectionItem>
              <SectionItem label="Minor">
                <MznTag label="Tag" size="minor" type="dismissable" @close="voidFn" />
              </SectionItem>
            </ItemList>
          </Section>
          <Section title="Addable">
            <ItemList>
              <SectionItem label="Main">
                <MznTag label="Tag" size="main" type="addable" @click="voidFn" />
              </SectionItem>
              <SectionItem label="Sub">
                <MznTag label="Tag" size="sub" type="addable" @click="voidFn" />
              </SectionItem>
              <SectionItem label="Minor">
                <MznTag label="Tag" size="minor" type="addable" @click="voidFn" />
              </SectionItem>
            </ItemList>
          </Section>
        </div>
      </div>
    `,
  }),
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
  render: () => ({
    components: { MznAutoComplete, MznTag, MznTagGroup },
    setup: () => {
      const open = ref(false);
      const options = ref<SelectValue[]>(autocompleteOptions);
      const selections = ref<SelectValue[]>([]);
      let nextId = autocompleteOptions.length + 1;

      return {
        handleInsert: (
          text: string,
          currentOptions: SelectValue[],
        ): SelectValue[] => {
          const newOption: SelectValue = { id: `new-${nextId}`, name: text };

          nextId += 1;

          const updatedOptions = [...currentOptions, newOption];

          options.value = updatedOptions;

          return updatedOptions;
        },
        handleRemoveCreated: (cleanedOptions: SelectValue[]): void => {
          options.value = cleanedOptions;
        },
        open,
        options,
        selections,
        stopPropagation: (event: MouseEvent) => event.stopPropagation(),
        toggleOpen: (event: MouseEvent) => {
          event.stopPropagation();
          open.value = !open.value;
        },
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px">
        <MznTagGroup>
          <MznTag
            v-for="selection in selections"
            :key="selection.id"
            :label="selection.name"
            type="dismissable"
            @close="selections = selections.filter((s) => s.id !== selection.id)"
          />
          <MznTag
            :label="open ? '收起選單' : '新增標籤'"
            type="addable"
            @click="toggleOpen"
            @mousedown="stopPropagation"
          />
        </MznTagGroup>
        <MznAutoComplete
          addable
          full-width
          input-position="inside"
          mode="multiple"
          :on-insert="handleInsert"
          :options="options"
          :open="open"
          placeholder="搜尋或新增標籤..."
          :value="selections"
          @change="selections = $event"
          @remove-created="handleRemoveCreated"
          @visibility-change="open = false"
        />
      </div>
    `,
  }),
};

const mockTags = Array.from(new Array(5), (_, index) => `Tag${index + 1}`);

export const Tag_Group = {
  parameters: {
    control: { disable: true },
  },
  render: () => ({
    components: { MznButton, MznTag, MznTagGroup },
    setup: () => {
      const tags = ref<string[]>(mockTags);

      return {
        addTag: () => {
          tags.value = [...tags.value, `Tag${tags.value.length + 1}`];
        },
        removeTag: (index: number) => {
          const next = [...tags.value];

          next.splice(index, 1);
          tags.value = next;
        },
        tags,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <MznButton style="width: 120px" @click="addTag">
          Add tag
        </MznButton>

        <MznTagGroup style="max-width: 320px">
          <MznTag
            v-for="(tag, index) in tags"
            :key="tag"
            type="dismissable"
            :label="tag"
            @close="removeTag(index)"
          />
        </MznTagGroup>
      </div>
    `,
  }),
};
