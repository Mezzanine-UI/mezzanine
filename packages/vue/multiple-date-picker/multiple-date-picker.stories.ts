import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { FunctionalComponent } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import MznCalendarConfigProviderMoment from '../calendar/calendar-config-provider-moment.vue';
import MznTypography from '../typography/typography.vue';
import MznMultipleDatePicker from './multiple-date-picker.vue';

const meta: Meta<typeof MznMultipleDatePicker> = {
  title: 'Data Entry/MultipleDatePicker',
  component: MznMultipleDatePicker,
};

export default meta;

type Story = StoryObj<typeof MznMultipleDatePicker>;

/**
 * React renders `A{value}B` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

const STORY_COMPONENTS = {
  MznCalendarConfigProviderMoment,
  MznMultipleDatePicker,
  MznTypography,
  TextParts,
};

const CONTAINER_STYLE = 'margin: 0 0 24px 0';
const TYPO_STYLE = 'margin: 0 0 12px 0';

export const Playground: Story = {
  args: {
    clearable: true,
    disabled: false,
    error: false,
    fullWidth: false,
    overflowStrategy: 'counter',
    placeholder: 'Select dates',
    readOnly: false,
    size: 'main',
  },
  argTypes: {
    overflowStrategy: {
      control: {
        type: 'radio',
      },
      options: ['counter', 'wrap'],
    },
    size: {
      control: {
        type: 'radio',
      },
      options: ['main', 'sub'],
    },
  },
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const value = ref<DateType[]>([]);

      return { TYPO_STYLE, args, value };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <MznTypography :style="TYPO_STYLE" variant="h3">{{ 'Selected: ' + value.length + ' date(s)' }}</MznTypography>
        <MznTypography :style="TYPO_STYLE" variant="body">{{ value.length > 0 ? value.join(', ') : 'No dates selected' }}</MznTypography>
        <MznMultipleDatePicker v-bind="args" :value="value" @change="value = $event" />
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const value = ref<DateType[]>([]);

      return { CONTAINER_STYLE, TYPO_STYLE, value };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Basic Multiple Date Picker</MznTypography>
          <MznTypography :style="TYPO_STYLE" variant="body">Click on dates to select/deselect. Click Confirm to apply changes.</MznTypography>
          <!-- Recommend to wrap MultipleDatePicker with a container to control width -->
          <div style="width: 400px">
            <MznMultipleDatePicker
              placeholder="Select multiple dates"
              :value="value"
              @change="value = $event"
            />
          </div>
        </div>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Selected dates:</MznTypography>
          <ul v-if="value.length > 0">
            <li v-for="(date, index) in value" :key="index">{{ String(date) }}</li>
          </ul>
          <MznTypography v-else :style="TYPO_STYLE" variant="caption">No dates selected</MznTypography>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const MaxSelections: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const value = ref<DateType[]>([]);

      return { CONTAINER_STYLE, TYPO_STYLE, value };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Max 3 Selections</MznTypography>
          <MznTypography :style="TYPO_STYLE" variant="body">You can only select up to 3 dates. Once reached, other dates become
          disabled.</MznTypography>
          <MznMultipleDatePicker
            :max-selections="3"
            placeholder="Select up to 3 dates"
            :value="value"
            @change="value = $event"
          />
        </div>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3"><TextParts :parts="['Selected: ', value.length, '/3']" /></MznTypography>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const OverflowStrategies: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const dates: DateType[] = [
        '2025-01-01',
        '2025-01-05',
        '2025-01-10',
        '2025-01-15',
        '2025-01-20',
      ];
      const counterValue = ref<DateType[]>([...dates]);
      const wrapValue = ref<DateType[]>([...dates]);

      return { CONTAINER_STYLE, TYPO_STYLE, counterValue, wrapValue };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Overflow Strategy: counter (default)</MznTypography>
          <MznTypography :style="TYPO_STYLE" variant="body">Shows visible tags with a counter for hidden ones.</MznTypography>
          <div style="max-width: 300px">
            <MznMultipleDatePicker
              overflow-strategy="counter"
              :value="counterValue"
              @change="counterValue = $event"
            />
          </div>
        </div>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Overflow Strategy: wrap</MznTypography>
          <MznTypography :style="TYPO_STYLE" variant="body">Wraps tags to multiple lines.</MznTypography>
          <div style="max-width: 300px">
            <MznMultipleDatePicker
              overflow-strategy="wrap"
              :value="wrapValue"
              @change="wrapValue = $event"
            />
          </div>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      CONTAINER_STYLE,
      TYPO_STYLE,
      sampleValue: ['2025-01-01', '2025-01-15'] as DateType[],
    }),
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Disabled</MznTypography>
          <MznMultipleDatePicker disabled :value="sampleValue" />
        </div>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Read Only</MznTypography>
          <MznMultipleDatePicker read-only :value="sampleValue" />
        </div>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Error</MznTypography>
          <MznMultipleDatePicker error :value="sampleValue" />
        </div>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Full Width</MznTypography>
          <MznMultipleDatePicker full-width :value="sampleValue" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const CustomActions: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const value = ref<DateType[]>([]);

      return {
        CONTAINER_STYLE,
        TYPO_STYLE,
        actions: {
          primaryButtonProps: { children: '確認' },
          secondaryButtonProps: { children: '取消' },
        },
        value,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Custom Action Button Text</MznTypography>
          <MznTypography :style="TYPO_STYLE" variant="body">Override confirm/cancel button text via actions prop.</MznTypography>
          <MznMultipleDatePicker
            :actions="actions"
            placeholder="選擇日期"
            :value="value"
            @change="value = $event"
          />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const DisabledDates: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const value = ref<DateType[]>([]);

      return {
        CONTAINER_STYLE,
        TYPO_STYLE,
        // Disable weekends
        isDateDisabled: (date: DateType): boolean => {
          const day = new Date(date as string).getDay();

          return day === 0 || day === 6;
        },
        value,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="CONTAINER_STYLE">
          <MznTypography :style="TYPO_STYLE" variant="h3">Disabled Dates (Weekends)</MznTypography>
          <MznTypography :style="TYPO_STYLE" variant="body">Weekends (Saturday and Sunday) are disabled.</MznTypography>
          <MznMultipleDatePicker
            :is-date-disabled="isDateDisabled"
            placeholder="Select weekdays only"
            :value="value"
            @change="value = $event"
          />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};
