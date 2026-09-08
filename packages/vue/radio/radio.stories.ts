import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import type {
  RadioGroupOrientation,
  RadioSize,
} from '@mezzanine-ui/core/radio';
import { LightIcon } from '@mezzanine-ui/icons';
import MznTypography from '../typography/typography.vue';
import MznRadio from './radio.vue';
import MznRadioGroup from './radio-group.vue';
import type { RadioGroupOption } from './radio-group.types';

export default {
  title: 'Data Entry/Radio',
} as Meta;

const orientations: RadioGroupOrientation[] = ['horizontal', 'vertical'];

const sizes: RadioSize[] = ['sub', 'main'];

export const Playground: StoryObj<typeof MznRadio> = {
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: sizes,
    },
  },
  args: {
    defaultChecked: false,
    disabled: false,
    error: false,
    size: 'main',
  },
  render: (args) => ({
    components: { MznRadio },
    setup: () => {
      const inputText = ref('first');

      const withInput = computed(() => ({
        width: 140,
        onChange: (event: Event) => {
          inputText.value = (event.target as HTMLInputElement).value;
        },
        value: inputText.value,
      }));

      return {
        args,
        disabledInput: { width: 140, disabled: true },
        withInput,
      };
    },
    template: `
      <div style="display: flex; flex-direction: column">
        <MznRadio v-bind="args">Radio Button Label</MznRadio>
        <MznRadio v-bind="args" :with-input-config="withInput">
          Radio Button Label
        </MznRadio>
        <MznRadio v-bind="args" hint="Support text">
          Radio Button Label
        </MznRadio>
        <MznRadio
          v-bind="args"
          hint="Support text"
          :with-input-config="disabledInput"
        >
          Radio Button Label
        </MznRadio>
      </div>
    `,
  }),
};

export const Standalone: StoryObj = {
  render: () => ({
    components: { MznRadio },
    // React returns a fragment here, so the template keeps four roots too.
    template: `
      <MznRadio />
      <MznRadio error />
      <MznRadio disabled default-checked />
      <MznRadio disabled />
    `,
  }),
};

export const Sizes: StoryObj = {
  render: () => ({
    components: { MznRadio },
    template: `
      <div
        style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start"
      >
        <MznRadio size="sub">Sub</MznRadio>
        <MznRadio size="main">Main</MznRadio>
      </div>
    `,
  }),
};

export const Group: StoryObj<typeof MznRadioGroup> = {
  argTypes: {
    orientation: {
      control: {
        type: 'radio',
      },
      options: orientations,
    },
    size: {
      control: {
        type: 'select',
      },
      options: sizes,
    },
  },
  args: {
    disabled: false,
    orientation: 'horizontal',
    size: 'main',
  },
  render: (args) => ({
    components: { MznRadio, MznRadioGroup, MznTypography },
    setup: () => {
      const inputText = ref('first');

      const options = computed((): RadioGroupOption[] => [
        {
          id: 'option-1',
          name: 'Option 1',
          withInputConfig: {
            width: 140,
            onChange: (event: Event) => {
              inputText.value = (event.target as HTMLInputElement).value;
            },
            value: inputText.value,
          },
        },
        {
          id: 'option-2',
          name: 'Option 2',
          hint: 'option2 support text',
        },
        {
          id: 'option-disabled',
          name: 'Option 3',
          disabled: true,
        },
        {
          id: 'option-error',
          name: 'Option 4',
          error: true,
        },
      ]);

      return { args, options };
    },
    // React returns a fragment here, so the template keeps several roots too.
    template: `
      <MznTypography variant="h2">From children</MznTypography>
      <MznRadioGroup v-bind="args">
        <MznRadio
          v-for="option in options"
          :key="option.id"
          :disabled="option.disabled"
          :error="option.error"
          :hint="option.hint"
          :value="option.id"
          :with-input-config="option.withInputConfig"
        >
          {{ option.name }}
        </MznRadio>
      </MznRadioGroup>
      <br />
      <br />
      <MznTypography variant="h2">From options</MznTypography>
      <MznRadioGroup v-bind="args" :options="options" />
      <MznTypography variant="h2">Vertical</MznTypography>
      <MznRadioGroup v-bind="args" :options="options" orientation="vertical" />
    `,
  }),
};

export const Segmented: StoryObj = {
  render: () => ({
    components: { MznRadio, MznRadioGroup, MznTypography },
    setup: () => ({ LightIcon }),
    template: `
      <div
        style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px"
      >
        <div>
          <MznTypography variant="h2">Main</MznTypography>
          <MznRadioGroup type="segment">
            <MznRadio value="op1" type="segment" :icon="LightIcon">
              Option1
            </MznRadio>
            <MznRadio value="op2" type="segment" :icon="LightIcon">
              Option2
            </MznRadio>
            <MznRadio value="op3" type="segment" :icon="LightIcon">
              Option3
            </MznRadio>
            <MznRadio value="op4" type="segment" :icon="LightIcon" disabled>
              Option4
            </MznRadio>
          </MznRadioGroup>
        </div>
        <div>
          <MznTypography variant="h2">Sub</MznTypography>
          <MznRadioGroup type="segment" size="sub">
            <MznRadio value="op1" type="segment">全部</MznRadio>
            <MznRadio value="op2" type="segment">已發佈</MznRadio>
            <MznRadio value="op3" type="segment">未發佈</MznRadio>
          </MznRadioGroup>
        </div>
        <div>
          <MznTypography variant="h2">Minor</MznTypography>
          <MznRadioGroup type="segment" size="minor">
            <MznRadio value="op1" type="segment">Option1</MznRadio>
            <MznRadio value="op2" type="segment">Option2</MznRadio>
            <MznRadio value="op3" type="segment">Option3</MznRadio>
            <MznRadio value="op4" type="segment" disabled>Option4</MznRadio>
          </MznRadioGroup>
        </div>
      </div>
    `,
  }),
};
