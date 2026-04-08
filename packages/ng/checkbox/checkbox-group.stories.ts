import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MznCheckbox } from './checkbox.component';
import { MznCheckboxGroup } from './checkbox-group.component';

export default {
  title: 'Data Entry/Checkbox/Group',
  decorators: [
    moduleMetadata({
      imports: [MznCheckbox, MznCheckboxGroup, FormsModule],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox group is disabled',
    },
    layout: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
      description: 'The layout of checkbox group',
    },
    mode: {
      options: ['default', 'chip'],
      control: { type: 'select' },
      description: 'The mode of checkboxes in the group',
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
      description: 'The size of checkboxes in the group',
    },
  },
  args: {
    disabled: false,
    layout: 'horizontal',
    mode: 'default',
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
      groupValues: ['a'],
    },
    template: `
      <mzn-checkbox-group
        [(ngModel)]="groupValues"
        name="demo"
        [disabled]="disabled"
        [layout]="layout"
        [mode]="mode"
        [size]="size"
      >
        <mzn-checkbox value="a">Option A</mzn-checkbox>
        <mzn-checkbox value="b">Option B</mzn-checkbox>
        <mzn-checkbox value="c">Option C</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ groupValues }}</p>
    `,
  }),
};

export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
    },
    template: `
      <mzn-checkbox-group [(ngModel)]="values" name="horizontal-group" layout="horizontal">
        <mzn-checkbox value="1">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="2">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="3" [disabled]="true">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="4">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="5">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="6">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="7">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="8">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="9">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="10">Checkbox Label</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ values }}</p>
    `,
  }),
};

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
    },
    template: `
      <mzn-checkbox-group [(ngModel)]="values" name="vertical-group" layout="vertical">
        <mzn-checkbox value="1">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="2">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="3" [disabled]="true">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="4">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="5">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="6">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="7">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="8">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="9">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="10">Checkbox Label</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ values }}</p>
    `,
  }),
};

export const HorizontalChips: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
    },
    template: `
      <mzn-checkbox-group [(ngModel)]="values" name="horizontal-chips-group" layout="horizontal" mode="chip">
        <mzn-checkbox value="1" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="2" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="3" mode="chip" [disabled]="true">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="4" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="5" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="6" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="7" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="8" mode="chip">Checkbox Label</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ values }}</p>
    `,
  }),
};

export const VerticalChips: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
    },
    template: `
      <mzn-checkbox-group [(ngModel)]="values" name="vertical-chips-group" layout="vertical" mode="chip">
        <mzn-checkbox value="1" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="2" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="3" mode="chip" [disabled]="true">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="4" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="5" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="6" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="7" mode="chip">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="8" mode="chip">Checkbox Label</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ values }}</p>
    `,
  }),
};

export const ChipsWithLevelControl: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: ['2', '4'] as string[],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
        <p style="margin: 0; font-weight: bold;">Chip 模式搭配 Level 控制範例</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">使用 chip 模式的 checkbox 組件，並搭配 level（全選）功能。</p>
        <mzn-checkbox-group [(ngModel)]="values" name="chips-level-group" layout="horizontal" mode="chip">
          <mzn-checkbox value="1" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="2" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="3" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="4" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="5" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="6" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="7" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="8" mode="chip">Checkbox Label</mzn-checkbox>
        </mzn-checkbox-group>
        <p>selected: {{ values }}</p>
      </div>
    `,
  }),
};

export const ChipsWithLevelControlVertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: ['2', '4'] as string[],
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
        <p style="margin: 0; font-weight: bold;">Chip 模式搭配 Level 控制範例（垂直佈局）</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">使用 chip 模式的 checkbox 組件，並搭配 level（全選）功能，垂直排列。</p>
        <mzn-checkbox-group [(ngModel)]="values" name="chips-level-group-vertical" layout="vertical" mode="chip">
          <mzn-checkbox value="1" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="2" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="3" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="4" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="5" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="6" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="7" mode="chip">Checkbox Label</mzn-checkbox>
          <mzn-checkbox value="8" mode="chip">Checkbox Label</mzn-checkbox>
        </mzn-checkbox-group>
        <p>selected: {{ values }}</p>
      </div>
    `,
  }),
};

export const WithLevelControlCustomization: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: ['2', '4'] as string[],
    },
    template: `
      <mzn-checkbox-group [(ngModel)]="values" name="level-control-group">
        <mzn-checkbox value="1">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="2">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="3">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="4">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="5">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="6">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="7">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="8">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="9">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="10">Checkbox Label</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ values }}</p>
    `,
  }),
};

export const WithChildren: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
    },
    template: `
      <mzn-checkbox-group [(ngModel)]="values" name="children-group">
        <mzn-checkbox value="1">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="2">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="3" [disabled]="true">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="4">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="5">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="6">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="7">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="8">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="9">Checkbox Label</mzn-checkbox>
        <mzn-checkbox value="10">Checkbox Label</mzn-checkbox>
      </mzn-checkbox-group>
      <p>selected: {{ values }}</p>
    `,
  }),
};

export const WithEditableInput: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
      otherText: '',
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
        <p style="margin: 0; font-weight: bold;">CheckboxGroup 可編輯輸入範例</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">選擇「其他」選項後，會顯示輸入框讓您輸入自訂內容。</p>
        <mzn-checkbox-group [(ngModel)]="values" name="editable-group" layout="vertical">
          <mzn-checkbox value="option1">選項 1</mzn-checkbox>
          <mzn-checkbox value="option2">選項 2</mzn-checkbox>
          <mzn-checkbox value="other">其他</mzn-checkbox>
          <mzn-checkbox value="option3">選項 3</mzn-checkbox>
        </mzn-checkbox-group>
        <input
          *ngIf="values.includes('other')"
          type="text"
          [(ngModel)]="otherText"
          name="otherText"
          placeholder="請輸入其他內容"
          style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px;"
        />
        <div *ngIf="values.length > 0" style="padding: 12px; background-color: #f3f4f6; border-radius: 4px;">
          <span style="font-size: 12px; color: #6b7280;">已選擇：{{ values.join(', ') }}</span>
        </div>
      </div>
    `,
  }),
};

export const WithEditableInputMultiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      values: [] as string[],
      custom1Text: '',
      custom2Text: '',
      otherText: '',
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;">
        <p style="margin: 0; font-weight: bold;">多個可編輯輸入範例</p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">多個選項都可以有可編輯輸入框，勾選後會自動顯示。</p>
        <mzn-checkbox-group [(ngModel)]="values" name="multiple-editable-group" layout="vertical">
          <mzn-checkbox value="custom1">自訂選項 1</mzn-checkbox>
          <input
            *ngIf="values.includes('custom1')"
            type="text"
            [(ngModel)]="custom1Text"
            name="custom1Text"
            placeholder="請輸入自訂選項 1 內容"
            style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; margin-left: 24px;"
          />
          <mzn-checkbox value="custom2">自訂選項 2</mzn-checkbox>
          <input
            *ngIf="values.includes('custom2')"
            type="text"
            [(ngModel)]="custom2Text"
            name="custom2Text"
            placeholder="請輸入自訂選項 2 內容"
            style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; margin-left: 24px;"
          />
          <mzn-checkbox value="normal">一般選項</mzn-checkbox>
          <mzn-checkbox value="other">其他</mzn-checkbox>
          <input
            *ngIf="values.includes('other')"
            type="text"
            [(ngModel)]="otherText"
            name="otherText"
            placeholder="請輸入其他內容"
            style="padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; margin-left: 24px;"
          />
        </mzn-checkbox-group>
        <div *ngIf="values.length > 0" style="padding: 12px; background-color: #f3f4f6; border-radius: 4px;">
          <span style="font-size: 12px; color: #6b7280;">已選擇：{{ values.join(', ') }}</span>
        </div>
      </div>
    `,
  }),
};
