import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import MznIcon from '../icon/icon.vue';
import MznTag from '../tag/tag.vue';
import MznTypography from '../typography/typography.vue';
import MznOverflowCounterTag from './overflow-counter-tag.vue';
import MznOverflowTooltip from './overflow-tooltip.vue';

export default {
  component: MznOverflowTooltip,
  subcomponents: { MznOverflowCounterTag },
  title: 'Internal/OverflowTooltip',
} as Meta;

type TooltipStory = StoryObj<typeof MznOverflowTooltip>;

const onTagDismiss = (tagIndex: number): void => {
  // eslint-disable-next-line no-console
  console.log(`Dismiss tag at index: ${tagIndex}`);
};

const anchorStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '999px',
  backgroundColor: 'white',
};

export const Playground: TooltipStory = {
  args: {
    open: true,
    placement: 'top-start',
    tagSize: 'main',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
  },
  parameters: {
    controls: {
      include: ['className', 'placement', 'tagSize', 'tags', 'open'],
    },
  },
  render: (args) => ({
    components: { MznOverflowTooltip },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);

      return { anchor, anchorStyle, args, onTagDismiss };
    },
    template: `
      <div style="padding: 100px">
        <div ref="anchor" :style="anchorStyle" />
        <MznOverflowTooltip v-bind="args" :anchor="anchor" @tag-dismiss="onTagDismiss" />
      </div>
    `,
  }),
};

export const States: TooltipStory = {
  args: {
    open: true,
    placement: 'top-start',
    tagSize: 'main',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
  },
  parameters: { controls: { disable: true } },
  render: (args) => ({
    components: { MznOverflowTooltip, MznTypography },
    setup: () => {
      const anchor1 = ref<HTMLElement | null>(null);
      const anchor2 = ref<HTMLElement | null>(null);

      return { anchor1, anchor2, anchorStyle, args, onTagDismiss };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 100px; padding-top: 100px">
        <div ref="anchor1" :style="anchorStyle">
          <MznTypography variant="h2">Enabled</MznTypography>
        </div>
        <MznOverflowTooltip v-bind="args" :anchor="anchor1" @tag-dismiss="onTagDismiss" />
        <div
          ref="anchor2"
          style="width: fit-content; border-radius: 999px; background-color: white"
        >
          <MznTypography variant="h2">Read only</MznTypography>
        </div>
        <MznOverflowTooltip v-bind="args" :anchor="anchor2" read-only />
      </div>
    `,
  }),
};

const PLACEMENT_TAGS = ['Option 2', 'Option 3', 'Option 4', 'Option 5'];

/** React's `PlacementItem`: a labelled anchor with its tooltip already open. */
const PlacementItem = {
  components: { MznOverflowTooltip, MznTypography },
  props: {
    label: { type: String, required: true },
    placement: { type: String, required: true },
  },
  setup: () => {
    const anchor = ref<HTMLElement | null>(null);

    return { PLACEMENT_TAGS, anchor };
  },
  template: `
    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        paddingTop: placement.startsWith('bottom') ? '0' : '80px',
        paddingBottom: placement.startsWith('bottom') ? '80px' : '0',
      }"
    >
      <MznTypography variant="caption">{{ label }}</MznTypography>
      <div
        ref="anchor"
        style="display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border: 1px solid #d9d9d9; border-radius: 4px; background-color: white; font-size: 14px; white-space: nowrap"
      >
        Tag 1 × &nbsp;<strong>+ 3</strong>
      </div>
      <MznOverflowTooltip
        :anchor="anchor"
        open
        :placement="placement"
        :tags="PLACEMENT_TAGS"
        tag-size="main"
      />
    </div>
  `,
};

export const Placement: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { PlacementItem },
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px">
        <PlacementItem label="top-start" placement="top-start" />
        <PlacementItem label="top" placement="top" />
        <PlacementItem label="top-end" placement="top-end" />
        <PlacementItem label="bottom-start" placement="bottom-start" />
        <PlacementItem label="bottom" placement="bottom" />
        <PlacementItem label="bottom-end" placement="bottom-end" />
      </div>
    `,
  }),
};

const MOCK_VISIBLE_TAG = 'Option 1';

/** React's `MockSelectWithOverflow`: a fake select showing one tag plus the counter. */
const MockSelectWithOverflow = {
  components: { MznIcon, MznOverflowCounterTag, MznTag },
  props: {
    placement: { type: String, required: true },
  },
  setup: () => ({
    ChevronDownIcon,
    MOCK_VISIBLE_TAG,
    PLACEMENT_TAGS,
    iconStyle: { color: '#8c8c8c', flexShrink: 0 },
  }),
  template: `
    <div
      style="display: inline-flex; align-items: center; gap: 4px; padding: 0 8px; border: 1px solid #d9d9d9; border-radius: 4px; background-color: white; min-width: 200px; height: 36px; box-sizing: border-box"
    >
      <div style="flex: 1; display: flex; align-items: center; gap: 4px; overflow: hidden">
        <MznTag type="dismissable" :label="MOCK_VISIBLE_TAG" size="main" @close="() => {}" />
        <MznOverflowCounterTag
          :placement="placement"
          :tags="PLACEMENT_TAGS"
          tag-size="main"
        />
      </div>
      <MznIcon :icon="ChevronDownIcon" :style="iconStyle" />
    </div>
  `,
};

export const PlacementOnClick: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { MockSelectWithOverflow, MznTypography },
    setup: () => ({
      placements: [
        'top-start',
        'top',
        'top-end',
        'bottom-start',
        'bottom',
        'bottom-end',
      ],
    }),
    template: `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 24px">
        <div
          v-for="placement in placements"
          :key="placement"
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            paddingTop: placement.startsWith('bottom') ? '0' : '100px',
            paddingBottom: placement.startsWith('bottom') ? '100px' : '0',
          }"
        >
          <MznTypography variant="caption">{{ placement }}</MznTypography>
          <MockSelectWithOverflow :placement="placement" />
        </div>
      </div>
    `,
  }),
};

export const SingleTag: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { MznOverflowTooltip },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);

      return { anchor, anchorStyle };
    },
    template: `
      <div style="padding: 100px">
        <div ref="anchor" :style="anchorStyle" />
        <MznOverflowTooltip
          :anchor="anchor"
          open
          placement="top-start"
          :tags="['Tag 1']"
          tag-size="main"
        />
      </div>
    `,
  }),
};

export const DismissableTags: TooltipStory = {
  parameters: { controls: { disable: true } },
  render: () => ({
    components: { MznOverflowTooltip },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);
      const tags = ref(['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5']);

      const dismiss = (tagIndex: number): void => {
        tags.value = tags.value.filter((_, index) => index !== tagIndex);
      };

      return { anchor, anchorStyle, dismiss, tags };
    },
    template: `
      <div style="padding: 100px">
        <div ref="anchor" :style="anchorStyle" />
        <MznOverflowTooltip
          :anchor="anchor"
          open
          placement="top-start"
          :tags="tags"
          tag-size="main"
          @tag-dismiss="dismiss"
        />
      </div>
    `,
  }),
};

type CounterTagStory = StoryObj<typeof MznOverflowCounterTag>;

export const OverflowCounterTagPlayground: CounterTagStory = {
  args: {
    disabled: false,
    placement: 'top-start',
    readOnly: false,
    tagSize: 'main',
    tags: ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5'],
  },
  parameters: {
    component: MznOverflowCounterTag,
    controls: {
      include: [
        'className',
        'placement',
        'tagSize',
        'tags',
        'disabled',
        'readOnly',
      ],
    },
  },
  render: (args) => ({
    components: { MznOverflowCounterTag },
    setup: () => ({ args, onTagDismiss }),
    template: `
      <div style="padding: 100px">
        <MznOverflowCounterTag v-bind="args" @tag-dismiss="onTagDismiss" />
      </div>
    `,
  }),
};
