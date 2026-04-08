import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';
import { MznSlider } from './slider.component';

export default {
  title: 'Data Entry/Slider',
  decorators: [
    moduleMetadata({
      imports: [MznSlider, FormsModule],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Single: Story = {
  argTypes: {
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      value: 1,
      PlusIcon,
      MinusIcon,
    },
    template: `
      <div style="padding: 2rem 5rem; display: grid; gap: 2rem;">
        <div style="display: grid; gap: 0.5rem;">
          <h3>With input</h3>
          <div mznSlider
            [(ngModel)]="value"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [withInput]="true"
          ></div>
        </div>
        <div style="display: grid; gap: 0.5rem;">
          <h3>With Icon</h3>
          <div mznSlider
            [(ngModel)]="value"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [prefixIcon]="MinusIcon"
            [suffixIcon]="PlusIcon"
          ></div>
        </div>
        <div style="display: grid; gap: 0.5rem;">
          <h3>Slice 3 ticks between min and max</h3>
          <div mznSlider
            [(ngModel)]="value"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [withTick]="3"
          ></div>
        </div>
        <div style="display: grid; gap: 0.5rem;">
          <h3>Custom tick marks: [10, 20, 30, 75]</h3>
          <div mznSlider
            [(ngModel)]="value"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [withTick]="[10, 20, 30, 75]"
          ></div>
        </div>
        <h3 style="margin-top: 2rem;">{{ value }}</h3>
      </div>
    `,
  }),
};

export const Range: Story = {
  argTypes: {
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
    step: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  render: (args) => ({
    props: {
      ...args,
      rangeValue: [10, 50] as [number, number],
      PlusIcon,
      MinusIcon,
    },
    template: `
      <div style="padding: 2rem 5rem; display: grid; gap: 2rem;">
        <div style="display: grid; gap: 0.5rem;">
          <h3>With input</h3>
          <div mznSlider
            [value]="rangeValue"
            (valueChange)="rangeValue = $any($event)"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [withInput]="true"
          ></div>
        </div>
        <div style="display: grid; gap: 0.5rem;">
          <h3>With prefixIcon and suffixIcon</h3>
          <div mznSlider
            [value]="rangeValue"
            (valueChange)="rangeValue = $any($event)"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [prefixIcon]="MinusIcon"
            [suffixIcon]="PlusIcon"
          ></div>
        </div>
        <div style="display: grid; gap: 0.5rem;">
          <h3>Slice 3 ticks between min and max</h3>
          <div mznSlider
            [value]="rangeValue"
            (valueChange)="rangeValue = $any($event)"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [withTick]="3"
          ></div>
        </div>
        <div style="display: grid; gap: 0.5rem;">
          <h3>Custom tick marks: [10, 20, 30, 75]</h3>
          <div mznSlider
            [value]="rangeValue"
            (valueChange)="rangeValue = $any($event)"
            [min]="min"
            [max]="max"
            [step]="step"
            [disabled]="disabled"
            [withTick]="[10, 20, 30, 75]"
          ></div>
        </div>
        <h3 style="margin-top: 2rem;">{{ rangeValue[0] }}, {{ rangeValue[1] }}</h3>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-slider-with-icon-custom-click',
  standalone: true,
  imports: [MznSlider, FormsModule],
  template: `
    <div style="padding: 2rem 5rem; display: grid; gap: 2rem;">
      <div style="display: grid; gap: 0.5rem;">
        <h3>Single - 自訂 onClick（每次 +/- 10）</h3>
        <p>透過 prefixIconClick / suffixIconClick 自訂點擊行為。</p>
        <div
          mznSlider
          [(ngModel)]="singleValue"
          [min]="0"
          [max]="100"
          [prefixIcon]="MinusIcon"
          [suffixIcon]="PlusIcon"
          [onPrefixIconClick]="decreaseSingleFn"
          [onSuffixIconClick]="increaseSingleFn"
        ></div>
        <h3>{{ singleValue() }}</h3>
      </div>
      <div style="display: grid; gap: 0.5rem;">
        <h3>Range - 自訂 onClick（整體位移 10）</h3>
        <p>prefixIconClick 整體左移，suffixIconClick 整體右移。</p>
        <div
          mznSlider
          [value]="rangeValue()"
          (valueChange)="rangeValue.set($any($event))"
          [min]="0"
          [max]="100"
          [prefixIcon]="MinusIcon"
          [suffixIcon]="PlusIcon"
          [onPrefixIconClick]="shiftRangeLeftFn"
          [onSuffixIconClick]="shiftRangeRightFn"
        ></div>
        <h3>{{ rangeValue()[0] }}, {{ rangeValue()[1] }}</h3>
      </div>
    </div>
  `,
})
class SliderWithIconCustomClickComponent {
  protected readonly MinusIcon = MinusIcon;
  protected readonly PlusIcon = PlusIcon;

  readonly singleValue = signal(50);
  readonly rangeValue = signal<[number, number]>([20, 70]);

  readonly decreaseSingleFn = (): void => {
    this.singleValue.update((v) => Math.max(0, v - 10));
  };

  readonly increaseSingleFn = (): void => {
    this.singleValue.update((v) => Math.min(100, v + 10));
  };

  readonly shiftRangeLeftFn = (): void => {
    this.rangeValue.update(
      ([a, b]) =>
        [Math.max(0, a - 10), Math.max(a - 10 + (b - a), 0)] as [
          number,
          number,
        ],
    );
  };

  readonly shiftRangeRightFn = (): void => {
    this.rangeValue.update(
      ([a, b]) =>
        [Math.min(a + 10, 100), Math.min(b + 10, 100)] as [number, number],
    );
  };
}

export const WithIconCustomClick: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [SliderWithIconCustomClickComponent],
    }),
  ],
  render: () => ({
    template: `<story-slider-with-icon-custom-click />`,
  }),
};

@Component({
  selector: 'story-slider-with-icon',
  standalone: true,
  imports: [MznSlider, FormsModule],
  template: `
    <div style="padding: 2rem 5rem; display: grid; gap: 2rem;">
      <div style="display: grid; gap: 0.5rem;">
        <h3>Single</h3>
        <p>透過點擊（Click）圖示（Icon）來觸發值的變化。</p>
        <div
          mznSlider
          [(ngModel)]="singleValue"
          [min]="0"
          [max]="100"
          [prefixIcon]="MinusIcon"
          [suffixIcon]="PlusIcon"
        ></div>
        <h3>{{ singleValue() }}</h3>
      </div>
      <div style="display: grid; gap: 0.5rem;">
        <h3>Range</h3>
        <p>點擊「-」減少下限，點擊「+」增加上限。</p>
        <div
          mznSlider
          [value]="rangeValue()"
          (valueChange)="rangeValue.set($any($event))"
          [min]="0"
          [max]="100"
          [prefixIcon]="MinusIcon"
          [suffixIcon]="PlusIcon"
        ></div>
        <h3>{{ rangeValue()[0] }}, {{ rangeValue()[1] }}</h3>
      </div>
    </div>
  `,
})
class SliderWithIconComponent {
  protected readonly MinusIcon = MinusIcon;
  protected readonly PlusIcon = PlusIcon;

  readonly singleValue = signal(50);
  readonly rangeValue = signal<[number, number]>([20, 70]);
}

export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [SliderWithIconComponent],
    }),
  ],
  render: () => ({
    template: `<story-slider-with-icon />`,
  }),
};
