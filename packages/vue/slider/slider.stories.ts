import type { Meta, StoryFn } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { FunctionalComponent } from 'vue';
import type {
  RangeSliderValue,
  SingleSliderValue,
} from '@mezzanine-ui/core/slider';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
import MznTypography from '../typography/typography.vue';
import MznSlider from './slider.vue';
import type { SliderProps } from './slider.types';

export default {
  title: 'Data Entry/Slider',
} as Meta;

type PlaygroundArgs = Pick<SliderProps, 'min' | 'max' | 'step' | 'disabled'>;

/**
 * React renders `{a}, {b}` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

export const Single: StoryFn<PlaygroundArgs> = (args) => ({
  components: { MznSlider, MznTypography },
  setup: () => {
    const value = ref<SingleSliderValue>(1);

    return { MinusIcon, PlusIcon, args, value };
  },
  template: `
    <div style="padding: 2rem 5rem; display: grid; gap: 2rem">
      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">With input</MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          with-input
          @change="value = $event"
        />
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">With Icon</MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          :suffix-icon="PlusIcon"
          :prefix-icon="MinusIcon"
          @change="value = $event"
        />
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">Slice 3 ticks between min and max</MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          :with-tick="3"
          @change="value = $event"
        />
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">
          Custom tick marks: [10, 20, 30, 75]
        </MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          :with-tick="[10, 20, 30, 75]"
          @change="value = $event"
        />
      </div>

      <MznTypography variant="h3" style="margin-top: 2rem">{{ value }}</MznTypography>
    </div>
  `,
});

Single.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
};

export const Range: StoryFn<PlaygroundArgs> = (args) => ({
  components: { MznSlider, MznTypography },
  setup: () => {
    const value = ref<RangeSliderValue>([10, 50]);

    return { MinusIcon, PlusIcon, args, value };
  },
  template: `
    <div style="padding: 2rem 5rem; display: grid; gap: 2rem">
      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">With input</MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          with-input
          @change="value = $event"
        />
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">With prefixIcon and suffixIcon</MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          :prefix-icon="MinusIcon"
          :suffix-icon="PlusIcon"
          @change="value = $event"
        />
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">Slice 3 ticks between min and max</MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          :with-tick="3"
          @change="value = $event"
        />
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">
          Custom tick marks: [10, 20, 30, 75]
        </MznTypography>
        <MznSlider
          :value="value"
          :min="args.min"
          :max="args.max"
          :step="args.step"
          :disabled="args.disabled"
          :with-tick="[10, 20, 30, 75]"
          @change="value = $event"
        />
      </div>

      <MznTypography variant="h3" style="margin-top: 2rem">
        <span>{{ value[0] }}</span>
        <span>,</span>
        <span>{{ value[1] }}</span>
      </MznTypography>
    </div>
  `,
});

Range.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
};

export const WithIconCustomClick: StoryFn = () => ({
  components: { MznSlider, MznTypography, TextParts },
  setup: () => {
    const singleValue = ref<SingleSliderValue>(50);
    const rangeValue = ref<RangeSliderValue>([20, 70]);

    return {
      MinusIcon,
      PlusIcon,
      onRangePrefixIconClick: (): void => {
        const value = rangeValue.value;

        rangeValue.value = [
          Math.max(0, value[0] - 10),
          Math.max(value[0] - 10 + (value[1] - value[0]), 0),
        ];
      },
      onRangeSuffixIconClick: (): void => {
        const value = rangeValue.value;

        rangeValue.value = [
          Math.min(value[0] + 10, 100),
          Math.min(value[1] + 10, 100),
        ];
      },
      onSinglePrefixIconClick: (): void => {
        singleValue.value = Math.max(0, singleValue.value - 10);
      },
      onSingleSuffixIconClick: (): void => {
        singleValue.value = Math.min(100, singleValue.value + 10);
      },
      rangeValue,
      singleValue,
    };
  },
  template: `
    <div style="padding: 2rem 5rem; display: grid; gap: 2rem">
      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">Single - 自訂 onClick（每次 +/- 10）</MznTypography>
        <MznTypography variant="body">
          透過 onPrefixIconClick / onSuffixIconClick 自訂點擊行為。
        </MznTypography>
        <MznSlider
          :value="singleValue"
          :prefix-icon="MinusIcon"
          :suffix-icon="PlusIcon"
          @change="singleValue = $event"
          @prefix-icon-click="onSinglePrefixIconClick"
          @suffix-icon-click="onSingleSuffixIconClick"
        />
        <MznTypography variant="h3">{{ singleValue }}</MznTypography>
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">Range - 自訂 onClick（整體位移 10）</MznTypography>
        <MznTypography variant="body">
          onPrefixIconClick 整體左移，onSuffixIconClick 整體右移。
        </MznTypography>
        <MznSlider
          :value="rangeValue"
          :prefix-icon="MinusIcon"
          :suffix-icon="PlusIcon"
          @change="rangeValue = $event"
          @prefix-icon-click="onRangePrefixIconClick"
          @suffix-icon-click="onRangeSuffixIconClick"
        />
        <MznTypography variant="h3">
          <TextParts :parts="[rangeValue[0], ', ', rangeValue[1]]" />
        </MznTypography>
      </div>
    </div>
  `,
});

export const WithIcon: StoryFn = () => ({
  components: { MznSlider, MznTypography, TextParts },
  setup: () => {
    const singleValue = ref<SingleSliderValue>(50);
    const rangeValue = ref<RangeSliderValue>([20, 70]);

    return { MinusIcon, PlusIcon, rangeValue, singleValue };
  },
  template: `
    <div style="padding: 2rem 5rem; display: grid; gap: 2rem">
      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">Single</MznTypography>
        <MznTypography variant="body">透過點擊（Click）圖示（Icon）來觸發值的變化。</MznTypography>
        <MznSlider
          :value="singleValue"
          :prefix-icon="MinusIcon"
          :suffix-icon="PlusIcon"
          @change="singleValue = $event"
        />
        <MznTypography variant="h3">{{ singleValue }}</MznTypography>
      </div>

      <div style="display: grid; gap: 0.5rem">
        <MznTypography variant="h3">Range</MznTypography>
        <MznTypography variant="body">點擊「-」減少下限，點擊「+」增加上限。</MznTypography>
        <MznSlider
          :value="rangeValue"
          :prefix-icon="MinusIcon"
          :suffix-icon="PlusIcon"
          @change="rangeValue = $event"
        />
        <MznTypography variant="h3">
          <TextParts :parts="[rangeValue[0], ', ', rangeValue[1]]" />
        </MznTypography>
      </div>
    </div>
  `,
});
