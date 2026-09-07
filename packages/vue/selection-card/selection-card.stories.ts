import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, defineComponent, ref } from 'vue';
import type {
  SelectionCardDirection,
  SelectionCardImageObjectFit,
  SelectionCardType,
} from '@mezzanine-ui/core/selection-card';
import MznTag from '../tag/tag.vue';
import MznTypography from '../typography/typography.vue';
import MznSelectionCardGroup from './selection-card-group.vue';
import MznSelectionCard from './selection-card.vue';
import type { SelectionCardSelection } from './selection-card-group.types';
import type { SelectionCardProps } from './selection-card.types';

export default {
  title: 'Data Entry/SelectionCard',
  component: MznSelectionCard,
} satisfies Meta<typeof MznSelectionCard>;

const selectorTypes: SelectionCardType[] = ['radio', 'checkbox'];
const directions: SelectionCardDirection[] = ['horizontal', 'vertical'];
const imageObjectFits: SelectionCardImageObjectFit[] = [
  'contain',
  'cover',
  'fill',
  'none',
  'scale-down',
];

/**
 * React's `className` arg spelled the way Vue takes it, and the two handlers —
 * props in React, emits here — so the Controls panel lists the same rows.
 */
type Story = StoryObj<typeof MznSelectionCard>;

type PlaygroundArgs = SelectionCardProps & {
  class?: string;
  onChange?: (event: Event) => void;
  onClick?: (event: MouseEvent) => void;
};

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    checked: undefined,
    defaultChecked: false,
    class: '',
    direction: 'horizontal',
    disabled: false,
    id: undefined,
    image: undefined,
    imageObjectFit: 'cover',
    name: undefined,
    readonly: false,
    selector: 'radio',
    supportingText: 'Supporting text',
    text: 'Selection',
    value: undefined,
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Whether the selection is checked (controlled mode)',
    },
    defaultChecked: {
      control: 'boolean',
      description:
        'Whether the selection is checked by default (uncontrolled mode)',
    },
    class: {
      control: 'text',
    },
    direction: {
      control: 'inline-radio',
      options: directions,
    },
    disabled: {
      control: 'boolean',
    },
    id: {
      control: 'text',
      description: 'The id of the input element',
    },
    image: {
      control: 'text',
      description: 'The image URL of selection',
    },
    imageObjectFit: {
      control: 'select',
      options: imageObjectFits,
      description: 'The object fit of selection image',
    },
    name: {
      control: 'text',
      description: 'The name attribute for form submission',
    },
    onChange: {
      action: 'changed',
      description: 'Invoked by input change event',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when the selection is clicked',
    },
    readonly: {
      control: 'boolean',
    },
    selector: {
      control: 'inline-radio',
      options: selectorTypes,
    },
    supportingText: {
      control: 'text',
    },
    text: {
      control: 'text',
      description: 'The accessible text of selection (required)',
    },
    value: {
      control: 'text',
      description: 'The value of selection for form submission',
    },
  },
};

const Section = defineComponent({
  name: 'SelectionSection',
  components: { MznTypography },
  props: { title: { type: String, required: true } },
  setup: () => ({
    hostStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      marginBottom: '48px',
    },
  }),
  template: `
    <div :style="hostStyle">
      <MznTypography variant="h2">{{ title }}</MznTypography>
      <slot />
    </div>
  `,
});

const SectionItem = defineComponent({
  name: 'SectionItem',
  components: { MznTag },
  props: {
    direction: { type: String, default: 'row' },
    label: { type: String, default: undefined },
  },
  setup: (props: { direction: string }) => ({
    hostStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '100%',
      height: 'auto',
      backgroundColor: '#F3F4F6',
      padding: '32px',
    },
    innerStyle: computed(() => ({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: props.direction,
    })),
  }),
  template: `
    <div :style="hostStyle">
      <MznTag :label="label ?? ''" size="main" type="static" />
      <div :style="innerStyle"><slot /></div>
    </div>
  `,
});

const ItemList = defineComponent({
  name: 'ItemList',
  setup: () => ({
    hostStyle: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '36px',
      alignItems: 'flex-start',
    },
  }),
  template: '<div :style="hostStyle"><slot /></div>',
});

const ItemContent = defineComponent({
  name: 'ItemContent',
  props: { gap: { type: String, default: undefined } },
  setup: (props: { gap?: string }) => ({
    hostStyle: computed(() => ({
      display: 'flex',
      flexDirection: 'column',
      gap: props.gap ?? '8px',
      marginBottom: '16px',
      width: '100%',
    })),
  }),
  template: '<div :style="hostStyle"><slot /></div>',
});

const STORY_COMPONENTS = {
  ItemContent,
  ItemList,
  MznSelectionCard,
  MznSelectionCardGroup,
  MznTypography,
  Section,
  SectionItem,
};

const LOGO = 'https://rytass.com/logo.png';

export const Horizontal: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({ LOGO }),
    template: `
      <Section title="State:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <MznTypography>Radio:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="basic-radio" value="radio-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="basic-radio" value="radio-1" default-checked />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="basic-radio" value="radio-1" :disabled="true" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="basic-radio" value="radio-1" :readonly="true" />
            </ItemContent>
            <ItemContent>
              <MznTypography>Unchecked:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" default-checked />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" :disabled="true" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" :readonly="true" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <MznTypography>Radio:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" :image="LOGO" name="basic-radio" value="radio-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" :image="LOGO" name="basic-radio-image-checked" value="radio-1" default-checked />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" :image="LOGO" name="basic-radio" value="radio-1" :disabled="true" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard selector="radio" text="Radio Selection" supporting-text="This is a radio button" :image="LOGO" name="basic-radio" value="radio-1" :readonly="true" />
            </ItemContent>
            <ItemContent>
              <MznTypography>Unchecked:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" :image="LOGO" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" :image="LOGO" name="basic-checkbox" value="checkbox-1" default-checked />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard selector="checkbox" text="Checkbox Selection" :image="LOGO" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" :disabled="true" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard selector="checkbox" :image="LOGO" text="Checkbox Selection" supporting-text="This is a checkbox" name="basic-checkbox" value="checkbox-1" :readonly="true" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Multiple Items:">
        <form @submit.prevent>
          <ItemList>
            <SectionItem direction="column" label="Radios:">
              <ItemContent gap="var(--mzn-spacing-gap-calm)">
                <MznTypography>Multiple Radios:</MznTypography>
                <MznSelectionCard default-checked name="multiple-radio-three" selector="radio" supporting-text="First option" text="Radio Option 1" value="radio-1" />
                <MznSelectionCard name="multiple-radio-three" selector="radio" supporting-text="Second option" text="Radio Option 2" value="radio-2" />
                <MznSelectionCard name="multiple-radio-three" selector="radio" supporting-text="Third option" text="Radio Option 3" value="radio-3" />
              </ItemContent>
            </SectionItem>
            <SectionItem direction="column" label="Checkboxes:">
              <ItemContent gap="var(--mzn-spacing-gap-calm)">
                <MznTypography>Multiple Checkboxes:</MznTypography>
                <MznSelectionCard default-checked name="multiple-checkbox-three" selector="checkbox" supporting-text="First checkbox" text="Checkbox Option 1" value="checkbox-1" />
                <MznSelectionCard name="multiple-checkbox-three" selector="checkbox" supporting-text="Second checkbox" text="Checkbox Option 2" value="checkbox-2" />
                <MznSelectionCard name="multiple-checkbox-three" selector="checkbox" supporting-text="Third checkbox" text="Checkbox Option 3" value="checkbox-3" />
              </ItemContent>
            </SectionItem>
          </ItemList>
        </form>
      </Section>
    `,
  }),
};

export const Vertical: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({ LOGO }),
    template: `
      <Section title="State:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <MznTypography>Radio:</MznTypography>
              <MznSelectionCard direction="vertical" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-basic-radio" value="radio-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard default-checked direction="vertical" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-basic-radio" value="radio-1" />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard direction="vertical" :disabled="true" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-basic-radio" value="radio-1" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard direction="vertical" :readonly="true" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-basic-radio" value="radio-1" />
            </ItemContent>
            <ItemContent>
              <MznTypography>Unchecked:</MznTypography>
              <MznSelectionCard direction="vertical" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard default-checked direction="vertical" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard direction="vertical" :disabled="true" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard direction="vertical" :readonly="true" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-basic-checkbox" value="checkbox-1" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem label="Text Only:">
            <ItemContent>
              <MznTypography>Radio:</MznTypography>
              <MznSelectionCard direction="vertical" :image="LOGO" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-image-radio" value="radio-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard default-checked direction="vertical" :image="LOGO" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-image-radio" value="radio-1" />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard direction="vertical" :disabled="true" :image="LOGO" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-image-radio" value="radio-1" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard direction="vertical" :image="LOGO" :readonly="true" selector="radio" text="Radio Selection" supporting-text="This is a radio button" name="vertical-image-radio" value="radio-1" />
            </ItemContent>
            <ItemContent>
              <MznTypography>Unchecked:</MznTypography>
              <MznSelectionCard direction="vertical" :image="LOGO" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1" />
              <MznTypography>Checked:</MznTypography>
              <MznSelectionCard default-checked direction="vertical" :image="LOGO" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1" />
              <MznTypography>Disabled:</MznTypography>
              <MznSelectionCard direction="vertical" :disabled="true" :image="LOGO" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1" />
              <MznTypography>Readonly:</MznTypography>
              <MznSelectionCard direction="vertical" :image="LOGO" :readonly="true" selector="checkbox" text="Checkbox Selection" supporting-text="This is a checkbox" name="vertical-image-checkbox" value="checkbox-1" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Multiple Items:">
        <form @submit.prevent>
          <ItemList>
            <SectionItem direction="column" label="Radios:">
              <ItemContent gap="var(--mzn-spacing-gap-calm)">
                <MznTypography>Multiple Radios:</MznTypography>
                <MznSelectionCard default-checked direction="vertical" name="vertical-multiple-radio-three" selector="radio" supporting-text="First option" text="Radio Option 1" value="radio-1" />
                <MznSelectionCard direction="vertical" name="vertical-multiple-radio-three" selector="radio" supporting-text="Second option" text="Radio Option 2" value="radio-2" />
                <MznSelectionCard direction="vertical" name="vertical-multiple-radio-three" selector="radio" supporting-text="Third option" text="Radio Option 3" value="radio-3" />
              </ItemContent>
            </SectionItem>
            <SectionItem direction="column" label="Checkboxes:">
              <ItemContent gap="var(--mzn-spacing-gap-calm)">
                <MznTypography>Multiple Checkboxes:</MznTypography>
                <MznSelectionCard default-checked direction="vertical" name="vertical-multiple-checkbox-three" selector="checkbox" supporting-text="First checkbox" text="Checkbox Option 1" value="checkbox-1" />
                <MznSelectionCard direction="vertical" name="vertical-multiple-checkbox-three" selector="checkbox" supporting-text="Second checkbox" text="Checkbox Option 2" value="checkbox-2" />
                <MznSelectionCard direction="vertical" name="vertical-multiple-checkbox-three" selector="checkbox" supporting-text="Third checkbox" text="Checkbox Option 3" value="checkbox-3" />
              </ItemContent>
            </SectionItem>
          </ItemList>
        </form>
      </Section>
    `,
  }),
};

export const TextMaxWidth: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <Section title="參照中文字建議:">
        <ItemList>
          <SectionItem label="標題 4-8字，子標題 4-12字，溢出時顯示 “...”">
            <ItemContent>
              <MznTypography>短文字（不截斷）:</MznTypography>
              <MznSelectionCard name="text-max-width-zh-short" selector="radio" supporting-text="四個字" text="四個字" text-max-width="112px" supporting-text-max-width="144px" value="short" />
              <MznTypography>剛好到限制（8字 / 12字）:</MznTypography>
              <MznSelectionCard name="text-max-width-zh-exact" selector="radio" supporting-text="適合這個方案選項使用" text="這個選項適合你" text-max-width="112px" supporting-text-max-width="144px" value="exact" />
              <MznTypography>超出限制（截斷）:</MznTypography>
              <MznSelectionCard name="text-max-width-zh-overflow" selector="radio" supporting-text="這是一段超過十二個中文字的說明文字會被截斷" text="這個選項的文字超過八個字會被截斷" text-max-width="112px" supporting-text-max-width="144px" value="overflow" />
              <MznTypography>垂直超出限制 （截斷）:</MznTypography>
              <MznSelectionCard name="text-max-width-zh-overflow-vertical" selector="radio" supporting-text="這是一段超過十二個中文字的說明文字會被截斷" text="這個選項的文字超過八個字會被截斷" text-max-width="112px" direction="vertical" supporting-text-max-width="144px" value="overflow-vertical" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="參照英文字建議:">
        <ItemList>
          <SectionItem label="標題 16-24 字，子標題 20-36 個字，溢出時顯示 “...”">
            <ItemContent>
              <MznTypography>Short text (no truncation):</MznTypography>
              <MznSelectionCard name="text-max-width-en-short" selector="radio" supporting-text="Short desc" text="Short label" text-max-width="168px" supporting-text-max-width="216px" value="short" />
              <MznTypography>Near limit (24 / 36 letters):</MznTypography>
              <MznSelectionCard name="text-max-width-en-exact" selector="radio" supporting-text="Supporting text near limit" text="Label text near limit ok" text-max-width="168px" supporting-text-max-width="216px" value="exact" />
              <MznTypography>Overflow (truncated):</MznTypography>
              <MznSelectionCard name="text-max-width-en-overflow" selector="radio" supporting-text="This supporting text is way too long and will be truncated with ellipsis" text="This label text is too long and will be truncated" text-max-width="168px" supporting-text-max-width="216px" value="overflow" />
              <MznTypography>Overflow Vertical (truncated):</MznTypography>
              <MznSelectionCard name="text-max-width-en-overflow-vertical" selector="radio" supporting-text="This supporting text is way too long and will be truncated with ellipsis" text="This label text is too long and will be truncated" text-max-width="168px" direction="vertical" supporting-text-max-width="216px" value="overflow-vertical" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
    `,
  }),
};

const PLAN_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

type PlanSelectionOptions = {
  checkFirst?: boolean;
  selector?: 'checkbox' | 'radio';
  values?: string[];
  withImage?: boolean;
};

const planSelections = (
  name: string,
  options: PlanSelectionOptions = {},
): SelectionCardSelection[] =>
  PLAN_LETTERS.map((letter, index) => ({
    ...(options.checkFirst && index === 0 ? { defaultChecked: true } : {}),
    ...(options.withImage ? { image: LOGO } : {}),
    name,
    selector: options.selector ?? 'radio',
    supportingText: `適合${letter}方案`,
    text: `${letter}方案`,
    value: options.values?.[index] ?? `${letter}plan`,
  }));

export const SelectionCardGroupBasic: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      disabledSelections: planSelections('disabled-selection').map(
        (selection, index) =>
          index === 0 ? { ...selection, text: '選項 1' } : selection,
      ),
      horizontalBaseSelections: planSelections('horizontal-base-selection'),
      imageSelections: planSelections('plan-selection-image', {
        checkFirst: true,
        withImage: true,
      }),
      interestSelections: planSelections('interest-selection', {
        checkFirst: true,
        selector: 'checkbox',
        values: ['Aplan', 'Bplan', 'Cplan', 'Eplan', 'Fplan', 'Gplan', 'Hplan'],
      }),
      planSelections: planSelections('plan-selection', { checkFirst: true }),
      requiredSelections: planSelections('required-selection').slice(0, 2),
      verticalSelections: planSelections('vertical-selection'),
    }),
    template: `
      <Section title="Radio Group:">
        <ItemList>
          <SectionItem direction="column" label="Basic Radio Group:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in planSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Checkbox Group:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in interestSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem direction="column" label="Radio Group with Image:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in imageSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="States:">
        <ItemList>
          <SectionItem direction="column" label="Required:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in requiredSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Disabled:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in disabledSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="Different Sizes:">
        <ItemList>
          <SectionItem direction="column" label="Horizontal Base:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in horizontalBaseSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Vertical:">
            <ItemContent>
              <MznSelectionCardGroup>
                <MznSelectionCard
                  v-for="selection in verticalSelections"
                  :key="selection.value"
                  v-bind="selection"
                />
              </MznSelectionCardGroup>
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
    `,
  }),
};

export const SelectionCardGroupWithOptions: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const value = ref('option-1');

      const mixedStateSelections = computed((): SelectionCardSelection[] =>
        [
          {
            disabled: true,
            supportingText: '已選取但停用',
            text: '選項 1',
            value: 'option-1',
          },
          {
            disabled: true,
            supportingText: '未選取但停用',
            text: '選項 2',
            value: 'option-2',
          },
          { supportingText: '可選取的選項', text: '選項 3', value: 'option-3' },
          { supportingText: '可選取的選項', text: '選項 4', value: 'option-4' },
        ].map((selection) => ({
          ...selection,
          checked: value.value === selection.value,
          name: 'mixed-states',
          onChange: (event: Event): void => {
            value.value = (event.target as HTMLInputElement).value;
          },
          selector: 'radio' as const,
        })),
      );

      return {
        interestOptions: [
          {
            defaultChecked: true,
            name: 'interest-options',
            selector: 'checkbox' as const,
            supportingText: '閱讀相關內容',
            text: '閱讀',
            value: 'reading',
          },
          {
            name: 'interest-options',
            selector: 'checkbox' as const,
            supportingText: '程式開發相關',
            text: '程式開發',
            value: 'coding',
          },
          {
            name: 'interest-options',
            selector: 'checkbox' as const,
            supportingText: '運動健身相關',
            text: '運動',
            value: 'sports',
          },
          {
            name: 'interest-options',
            selector: 'checkbox' as const,
            supportingText: '音樂相關',
            text: '音樂',
            value: 'music',
          },
        ],
        mixedStateSelections,
        planImageOptions: [
          {
            defaultChecked: true,
            image: LOGO,
            name: 'plan-image-options',
            selector: 'radio' as const,
            supportingText: '適合個人使用',
            text: '基本方案',
            value: 'basic',
          },
          {
            image: LOGO,
            name: 'plan-image-options',
            selector: 'radio' as const,
            supportingText: '適合小型團隊',
            text: '專業方案',
            value: 'professional',
          },
          {
            image: LOGO,
            name: 'plan-image-options',
            selector: 'radio' as const,
            supportingText: '適合大型企業',
            text: '企業方案',
            value: 'enterprise',
          },
        ],
        planOptions: [
          {
            defaultChecked: true,
            name: 'plan-options',
            selector: 'radio' as const,
            supportingText: '適合個人使用',
            text: '基本方案',
            value: 'basic',
          },
          {
            name: 'plan-options',
            selector: 'radio' as const,
            supportingText: '適合小型團隊',
            text: '專業方案',
            value: 'professional',
          },
          {
            name: 'plan-options',
            selector: 'radio' as const,
            supportingText: '適合大型企業',
            text: '企業方案',
            value: 'enterprise',
          },
          {
            name: 'plan-options',
            selector: 'radio' as const,
            supportingText: '適合超大型企業',
            text: '旗艦方案',
            value: 'enterprise-plus',
          },
        ],
        verticalOptions: [
          {
            defaultChecked: true,
            direction: 'vertical' as const,
            name: 'vertical-options',
            selector: 'radio' as const,
            supportingText: '垂直排列選項 1',
            text: '選項 1',
            value: 'option-1',
          },
          {
            direction: 'vertical' as const,
            name: 'vertical-options',
            selector: 'radio' as const,
            supportingText: '垂直排列選項 2',
            text: '選項 2',
            value: 'option-2',
          },
          {
            direction: 'vertical' as const,
            name: 'vertical-options',
            selector: 'radio' as const,
            supportingText: '垂直排列選項 3',
            text: '選項 3',
            value: 'option-3',
          },
        ],
      };
    },
    template: `
      <Section title="Using Selections Array:">
        <ItemList>
          <SectionItem direction="column" label="Radio Group with Selections:">
            <ItemContent>
              <MznSelectionCardGroup :selections="planOptions" />
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Checkbox Group with Selections:">
            <ItemContent>
              <MznSelectionCardGroup :selections="interestOptions" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Image:">
        <ItemList>
          <SectionItem direction="column" label="Radio Group with Image:">
            <ItemContent>
              <MznSelectionCardGroup :selections="planImageOptions" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
      <Section title="With Different States:">
        <ItemList>
          <SectionItem direction="column" label="Mixed States:">
            <ItemContent>
              <MznSelectionCardGroup :selections="mixedStateSelections" />
            </ItemContent>
          </SectionItem>
          <SectionItem direction="column" label="Vertical Direction:">
            <ItemContent>
              <MznSelectionCardGroup :selections="verticalOptions" />
            </ItemContent>
          </SectionItem>
        </ItemList>
      </Section>
    `,
  }),
};
