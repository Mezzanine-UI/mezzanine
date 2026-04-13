import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { LightIcon } from '@mezzanine-ui/icons';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznRadio, RadioWithInputConfig } from './radio.component';
import { MznRadioGroup, RadioGroupOption } from './radio-group.component';

export default {
  title: 'Data Entry/Radio',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, MznInput, MznRadio, MznRadioGroup, MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

@Component({
  selector: 'story-radio-playground',
  standalone: true,
  imports: [MznRadio],
  template: `
    <div style="display: flex; flex-direction: column;">
      <div
        mznRadio
        value="plain"
        [disabled]="disabled"
        [error]="error"
        [size]="size"
        >Radio Button Label</div
      >
      <div
        mznRadio
        value="with-input"
        [disabled]="disabled"
        [error]="error"
        [size]="size"
        [withInputConfig]="inputConfig"
        >Radio Button Label</div
      >
      <div
        mznRadio
        value="hint"
        hint="Support text"
        [disabled]="disabled"
        [error]="error"
        [size]="size"
        >Radio Button Label</div
      >
      <div
        mznRadio
        value="hint-disabled-input"
        hint="Support text"
        [disabled]="disabled"
        [error]="error"
        [size]="size"
        [withInputConfig]="disabledInputConfig"
        >Radio Button Label</div
      >
    </div>
  `,
})
class StoryRadioPlayground {
  disabled = false;
  error = false;
  size: 'main' | 'sub' = 'main';

  inputText = 'first';

  readonly inputConfig: RadioWithInputConfig = {
    width: 140,
    onValueChange: (value: string): void => {
      this.inputText = value;
    },
  };

  readonly disabledInputConfig: RadioWithInputConfig = {
    width: 140,
    disabled: true,
  };
}

export const Playground: Story = {
  argTypes: {
    size: {
      options: ['sub', 'main'],
      control: { type: 'select' },
    },
  },
  args: {
    error: false,
    disabled: false,
    size: 'main',
  },
  decorators: [moduleMetadata({ imports: [StoryRadioPlayground] })],
  render: (args) => ({
    props: args,
    template: `
      <story-radio-playground
        [disabled]="disabled"
        [error]="error"
        [size]="size"
      />
    `,
  }),
};

export const Standalone: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div mznRadio value="plain"></div>
      <div mznRadio value="error" [error]="true"></div>
      <div mznRadio value="disabled-checked" [disabled]="true" [checked]="true"></div>
      <div mznRadio value="disabled" [disabled]="true"></div>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start;">
        <div mznRadio value="sub" size="sub">Sub</div>
        <div mznRadio value="main" size="main">Main</div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-radio-group',
  standalone: true,
  imports: [FormsModule, MznRadio, MznRadioGroup, MznTypography],
  template: `
    <h2 mznTypography variant="h2">From children</h2>
    <div
      mznRadioGroup
      [(ngModel)]="selectedChildren"
      name="group-children"
      [disabled]="disabled"
      [orientation]="orientation"
      [size]="size"
    >
      <div mznRadio value="option-1" [withInputConfig]="inputConfig"
        >Option 1</div
      >
      <div mznRadio value="option-2" hint="option2 support text">Option 2</div>
      <div mznRadio value="option-disabled" [disabled]="true">Option 3</div>
      <div mznRadio value="option-error" [error]="true">Option 4</div>
    </div>
    <br /><br />
    <h2 mznTypography variant="h2">From options</h2>
    <div
      mznRadioGroup
      [(ngModel)]="selectedOptions"
      name="group-options"
      [disabled]="disabled"
      [options]="options"
      [orientation]="orientation"
      [size]="size"
    ></div>
    <h2 mznTypography variant="h2">Vertical</h2>
    <div
      mznRadioGroup
      [(ngModel)]="selectedVertical"
      name="group-vertical"
      [disabled]="disabled"
      [options]="options"
      [size]="size"
      orientation="vertical"
    ></div>
  `,
})
class StoryRadioGroup {
  disabled = false;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  size: 'main' | 'sub' = 'main';

  selectedChildren = '';
  selectedOptions = '';
  selectedVertical = '';
  inputText = 'first';

  readonly inputConfig: RadioWithInputConfig = {
    width: 140,
    onValueChange: (value: string): void => {
      this.inputText = value;
    },
  };

  readonly options: RadioGroupOption[] = [
    {
      id: 'option-1',
      name: 'Option 1',
      withInputConfig: {
        width: 140,
        onValueChange: (value: string): void => {
          this.inputText = value;
        },
      },
    },
    { id: 'option-2', name: 'Option 2', hint: 'option2 support text' },
    { id: 'option-disabled', name: 'Option 3', disabled: true },
    { id: 'option-error', name: 'Option 4', error: true },
  ];
}

export const Group: Story = {
  argTypes: {
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'radio' },
    },
    size: {
      options: ['sub', 'main'],
      control: { type: 'select' },
    },
  },
  args: {
    disabled: false,
    orientation: 'horizontal',
    size: 'main',
  },
  decorators: [moduleMetadata({ imports: [StoryRadioGroup] })],
  render: (args) => ({
    props: args,
    template: `
      <story-radio-group
        [disabled]="disabled"
        [orientation]="orientation"
        [size]="size"
      />
    `,
  }),
};

export const Segmented: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      LightIcon,
      selectedMain: '',
      selectedSub: '',
      selectedMinor: '',
    },
    template: `
      <div style="width: fit-content; display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 8px;">
        <div>
          <h2 mznTypography variant="h2">Main</h2>
          <div mznRadioGroup [(ngModel)]="selectedMain" name="segment-main" type="segment">
            <div mznRadio value="op1" type="segment" [icon]="LightIcon">Option1</div>
            <div mznRadio value="op2" type="segment" [icon]="LightIcon">Option2</div>
            <div mznRadio value="op3" type="segment" [icon]="LightIcon">Option3</div>
            <div mznRadio value="op4" type="segment" [icon]="LightIcon" [disabled]="true">Option4</div>
          </div>
        </div>
        <div>
          <h2 mznTypography variant="h2">Sub</h2>
          <div mznRadioGroup [(ngModel)]="selectedSub" name="segment-sub" type="segment" size="sub">
            <div mznRadio value="op1" type="segment">全部</div>
            <div mznRadio value="op2" type="segment">已發佈</div>
            <div mznRadio value="op3" type="segment">未發佈</div>
          </div>
        </div>
        <div>
          <h2 mznTypography variant="h2">Minor</h2>
          <div mznRadioGroup [(ngModel)]="selectedMinor" name="segment-minor" type="segment" size="minor">
            <div mznRadio value="op1" type="segment">Option1</div>
            <div mznRadio value="op2" type="segment">Option2</div>
            <div mznRadio value="op3" type="segment">Option3</div>
            <div mznRadio value="op4" type="segment" [disabled]="true">Option4</div>
          </div>
        </div>
      </div>
    `,
  }),
};
