import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MznCheckbox } from './checkbox.component';
import { MznCheckboxGroup } from './checkbox-group.component';
import { MznTypography } from '@mezzanine-ui/ng/typography';

export default {
  title: 'Data Entry/Checkbox/Group',
  decorators: [
    moduleMetadata({
      imports: [MznCheckbox, MznCheckboxGroup, FormsModule, MznTypography],
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
      groupValues: ['2'],
    },
    template: `
      <div mznCheckboxGroup
        [(ngModel)]="groupValues"
        name="playground-checkbox-group"
        [disabled]="disabled"
        [layout]="layout"
        [mode]="mode"
        [size]="size"
      >
        <div mznCheckbox value="1">Checkbox Label</div>
        <div mznCheckbox value="2">Checkbox Label</div>
        <div mznCheckbox value="3" [disabled]="true">Checkbox Label</div>
        <div mznCheckbox value="4">Checkbox Label</div>
        <div mznCheckbox value="5">Checkbox Label</div>
        <div mznCheckbox value="6">Checkbox Label</div>
        <div mznCheckbox value="7">Checkbox Label</div>
        <div mznCheckbox value="8">Checkbox Label</div>
        <div mznCheckbox value="9">Checkbox Label</div>
        <div mznCheckbox value="10">Checkbox Label</div>
        <div mznCheckbox value="11">Checkbox Label</div>
        <div mznCheckbox value="12">Checkbox Label</div>
        <div mznCheckbox value="13">Checkbox Label</div>
        <div mznCheckbox value="14">Checkbox Label</div>
        <div mznCheckbox value="15">Checkbox Label</div>
        <div mznCheckbox value="16">Checkbox Label</div>
        <div mznCheckbox value="17">Checkbox Label</div>
        <div mznCheckbox value="18">Checkbox Label</div>
        <div mznCheckbox value="19">Checkbox Label</div>
        <div mznCheckbox value="20">Checkbox Label</div>
      </div>
    `,
  }),
};

export const Horizontal: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { values: [] as string[] },
    template: `
      <div mznCheckboxGroup [(ngModel)]="values" name="horizontal-group" layout="horizontal">
        <div mznCheckbox value="1">Checkbox Label</div>
        <div mznCheckbox value="2">Checkbox Label</div>
        <div mznCheckbox value="3" [disabled]="true">Checkbox Label</div>
        <div mznCheckbox value="4">Checkbox Label</div>
        <div mznCheckbox value="5">Checkbox Label</div>
        <div mznCheckbox value="6">Checkbox Label</div>
        <div mznCheckbox value="7">Checkbox Label</div>
        <div mznCheckbox value="8">Checkbox Label</div>
        <div mznCheckbox value="9">Checkbox Label</div>
        <div mznCheckbox value="10">Checkbox Label</div>
        <div mznCheckbox value="11">Checkbox Label</div>
        <div mznCheckbox value="12">Checkbox Label</div>
        <div mznCheckbox value="13">Checkbox Label</div>
        <div mznCheckbox value="14">Checkbox Label</div>
        <div mznCheckbox value="15">Checkbox Label</div>
        <div mznCheckbox value="16">Checkbox Label</div>
        <div mznCheckbox value="17">Checkbox Label</div>
        <div mznCheckbox value="18">Checkbox Label</div>
        <div mznCheckbox value="19">Checkbox Label</div>
        <div mznCheckbox value="20">Checkbox Label</div>
      </div>
    `,
  }),
};

export const Vertical: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { values: [] as string[] },
    template: `
      <div mznCheckboxGroup [(ngModel)]="values" name="vertical-group" layout="vertical">
        <div mznCheckbox value="1">Checkbox Label</div>
        <div mznCheckbox value="2">Checkbox Label</div>
        <div mznCheckbox value="3" [disabled]="true">Checkbox Label</div>
        <div mznCheckbox value="4">Checkbox Label</div>
        <div mznCheckbox value="5">Checkbox Label</div>
        <div mznCheckbox value="6">Checkbox Label</div>
        <div mznCheckbox value="7">Checkbox Label</div>
        <div mznCheckbox value="8">Checkbox Label</div>
        <div mznCheckbox value="9">Checkbox Label</div>
        <div mznCheckbox value="10">Checkbox Label</div>
        <div mznCheckbox value="11">Checkbox Label</div>
        <div mznCheckbox value="12">Checkbox Label</div>
        <div mznCheckbox value="13">Checkbox Label</div>
        <div mznCheckbox value="14">Checkbox Label</div>
        <div mznCheckbox value="15">Checkbox Label</div>
        <div mznCheckbox value="16">Checkbox Label</div>
        <div mznCheckbox value="17">Checkbox Label</div>
        <div mznCheckbox value="18">Checkbox Label</div>
        <div mznCheckbox value="19">Checkbox Label</div>
        <div mznCheckbox value="20">Checkbox Label</div>
      </div>
    `,
  }),
};

export const HorizontalChips: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { values: [] as string[] },
    template: `
      <div mznCheckboxGroup [(ngModel)]="values" name="horizontal-chips-group" layout="horizontal" mode="chip">
        <div mznCheckbox value="1" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="2" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="3" mode="chip" [disabled]="true">Checkbox Label</div>
        <div mznCheckbox value="4" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="5" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="6" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="7" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="8" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="9" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="10" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="11" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="12" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="13" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="14" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="15" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="16" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="17" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="18" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="19" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="20" mode="chip">Checkbox Label</div>
      </div>
    `,
  }),
};

export const VerticalChips: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { values: [] as string[] },
    template: `
      <div mznCheckboxGroup [(ngModel)]="values" name="vertical-chips-group" layout="vertical" mode="chip">
        <div mznCheckbox value="1" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="2" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="3" mode="chip" [disabled]="true">Checkbox Label</div>
        <div mznCheckbox value="4" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="5" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="6" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="7" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="8" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="9" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="10" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="11" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="12" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="13" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="14" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="15" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="16" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="17" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="18" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="19" mode="chip">Checkbox Label</div>
        <div mznCheckbox value="20" mode="chip">Checkbox Label</div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-chips-level-horizontal',
  standalone: true,
  imports: [MznCheckbox, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;"
    >
      <p mznTypography variant="body">Chip 模式搭配 Level 控制範例</p>
      <p mznTypography variant="body" color="text-neutral">
        使用 chip 模式的 checkbox 組件，並搭配 level（全選）功能。
      </p>
      <div
        style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;"
      >
        <div
          mznCheckbox
          mode="chip"
          [checked]="isAllSelected()"
          [indeterminate]="isIndeterminate()"
          (change)="onSelectAll($event)"
          >全選</div
        >
        <i class="mzn-checkbox-group--level-control-separator"></i>
        @for (opt of options; track opt.id) {
          <div
            mznCheckbox
            mode="chip"
            [checked]="values.includes(opt.id)"
            [disabled]="opt.disabled ?? false"
            (change)="onToggle(opt.id, $event)"
            >Checkbox Label</div
          >
        }
      </div>
    </div>
  `,
})
class ChipsWithLevelHorizontalComponent {
  readonly options = [
    { id: '1' },
    { id: '2' },
    { id: '3', disabled: true },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ];

  private readonly allIds = this.options.map((o) => o.id);
  values: string[] = ['2', '4'];

  isAllSelected(): boolean {
    return this.allIds.every((id) => this.values.includes(id));
  }

  isIndeterminate(): boolean {
    return this.values.length > 0 && !this.isAllSelected();
  }

  onSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.values = checked ? [...this.allIds] : [];
  }

  onToggle(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.values = checked
      ? [...this.values, id]
      : this.values.filter((v) => v !== id);
  }
}

export const ChipsWithLevelControl: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [ChipsWithLevelHorizontalComponent] }),
  ],
  render: () => ({
    template: `<story-chips-level-horizontal />`,
  }),
};

@Component({
  selector: 'story-chips-level-vertical',
  standalone: true,
  imports: [MznCheckbox, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;"
    >
      <p mznTypography variant="body"
        >Chip 模式搭配 Level 控制範例（垂直佈局）</p
      >
      <p mznTypography variant="body" color="text-neutral">
        使用 chip 模式的 checkbox 組件，並搭配 level（全選）功能，垂直排列。
      </p>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div
          mznCheckbox
          mode="chip"
          [checked]="isAllSelected()"
          [indeterminate]="isIndeterminate()"
          (change)="onSelectAll($event)"
          >全選</div
        >
        @for (opt of options; track opt.id) {
          <div
            mznCheckbox
            mode="chip"
            [checked]="values.includes(opt.id)"
            [disabled]="opt.disabled ?? false"
            (change)="onToggle(opt.id, $event)"
            >Checkbox Label</div
          >
        }
      </div>
    </div>
  `,
})
class ChipsWithLevelVerticalComponent {
  readonly options = [
    { id: '1' },
    { id: '2' },
    { id: '3', disabled: true },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
  ];

  private readonly allIds = this.options.map((o) => o.id);
  values: string[] = ['2', '4'];

  isAllSelected(): boolean {
    return this.allIds.every((id) => this.values.includes(id));
  }

  isIndeterminate(): boolean {
    return this.values.length > 0 && !this.isAllSelected();
  }

  onSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.values = checked ? [...this.allIds] : [];
  }

  onToggle(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.values = checked
      ? [...this.values, id]
      : this.values.filter((v) => v !== id);
  }
}

export const ChipsWithLevelControlVertical: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [ChipsWithLevelVerticalComponent] })],
  render: () => ({
    template: `<story-chips-level-vertical />`,
  }),
};

@Component({
  selector: 'story-level-control-customization',
  standalone: true,
  imports: [FormsModule, MznCheckbox, MznCheckboxGroup],
  template: `
    <div
      mznCheckbox
      [checked]="isAllSelected()"
      [indeterminate]="isIndeterminate()"
      (change)="onSelectAll($event)"
      >全選</div
    >
    <div mznCheckboxGroup [(ngModel)]="values" name="level-control-group">
      <div mznCheckbox value="1">Checkbox Label</div>
      <div mznCheckbox value="2">Checkbox Label</div>
      <div mznCheckbox value="3">Checkbox Label</div>
      <div mznCheckbox value="4">Checkbox Label</div>
      <div mznCheckbox value="5">Checkbox Label</div>
      <div mznCheckbox value="6">Checkbox Label</div>
      <div mznCheckbox value="7">Checkbox Label</div>
      <div mznCheckbox value="8">Checkbox Label</div>
      <div mznCheckbox value="9">Checkbox Label</div>
      <div mznCheckbox value="10">Checkbox Label</div>
      <div mznCheckbox value="11">Checkbox Label</div>
      <div mznCheckbox value="12">Checkbox Label</div>
      <div mznCheckbox value="13">Checkbox Label</div>
      <div mznCheckbox value="14">Checkbox Label</div>
      <div mznCheckbox value="15">Checkbox Label</div>
      <div mznCheckbox value="16">Checkbox Label</div>
      <div mznCheckbox value="17">Checkbox Label</div>
      <div mznCheckbox value="18">Checkbox Label</div>
      <div mznCheckbox value="19">Checkbox Label</div>
      <div mznCheckbox value="20">Checkbox Label</div>
    </div>
  `,
})
class LevelControlCustomizationComponent {
  private readonly allIds = Array.from({ length: 20 }, (_, i) => String(i + 1));
  values: string[] = ['2', '4'];

  isAllSelected(): boolean {
    return this.allIds.every((id) => this.values.includes(id));
  }

  isIndeterminate(): boolean {
    return this.values.length > 0 && !this.isAllSelected();
  }

  onSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.values = checked ? [...this.allIds] : [];
  }
}

export const WithLevelControlCustomization: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [LevelControlCustomizationComponent] }),
  ],
  render: () => ({
    template: `<story-level-control-customization />`,
  }),
};

export const WithChildren: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { values: [] as string[] },
    template: `
      <div mznCheckboxGroup [(ngModel)]="values" name="children-group">
        <div mznCheckbox value="1">Checkbox Label</div>
        <div mznCheckbox value="2">Checkbox Label</div>
        <div mznCheckbox value="3" [disabled]="true">Checkbox Label</div>
        <div mznCheckbox value="4">Checkbox Label</div>
        <div mznCheckbox value="5">Checkbox Label</div>
        <div mznCheckbox value="6">Checkbox Label</div>
        <div mznCheckbox value="7">Checkbox Label</div>
        <div mznCheckbox value="8">Checkbox Label</div>
        <div mznCheckbox value="9">Checkbox Label</div>
        <div mznCheckbox value="10">Checkbox Label</div>
        <div mznCheckbox value="11">Checkbox Label</div>
        <div mznCheckbox value="12">Checkbox Label</div>
        <div mznCheckbox value="13">Checkbox Label</div>
        <div mznCheckbox value="14">Checkbox Label</div>
        <div mznCheckbox value="15">Checkbox Label</div>
        <div mznCheckbox value="16">Checkbox Label</div>
        <div mznCheckbox value="17">Checkbox Label</div>
        <div mznCheckbox value="18">Checkbox Label</div>
        <div mznCheckbox value="19">Checkbox Label</div>
        <div mznCheckbox value="20">Checkbox Label</div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-checkbox-group-editable',
  standalone: true,
  imports: [FormsModule, MznCheckbox, MznCheckboxGroup, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;"
    >
      <p mznTypography variant="body">CheckboxGroup 可編輯輸入範例</p>
      <p mznTypography variant="body" color="text-neutral">
        選擇「其他」選項後，會顯示輸入框讓您輸入自訂內容。只設置 withEditInput
        即可使用默認配置。
      </p>
      <div
        mznCheckboxGroup
        [(ngModel)]="values"
        name="editable-group"
        layout="vertical"
      >
        <div mznCheckbox value="option1">選項 1</div>
        <div mznCheckbox value="option2">選項 2</div>
        <div
          mznCheckbox
          value="other"
          [withEditInput]="true"
          [editableInputValue]="otherText"
          (editableInputChange)="otherText = $event"
          >其他</div
        >
        <div mznCheckbox value="option3">選項 3</div>
      </div>
      @if (values.length > 0) {
        <div
          style="padding: 12px; background-color: #f3f4f6; border-radius: 4px; margin-top: 8px;"
        >
          <span mznTypography variant="caption" color="text-neutral">
            已選擇：{{ values.join(', ') }}
          </span>
          @if (otherText) {
            <span
              mznTypography
              variant="caption"
              color="text-neutral"
              style="display: block; margin-top: 4px;"
            >
              其他選項內容：{{ otherText }}
            </span>
          }
        </div>
      }
    </div>
  `,
})
class WithEditableInputDemoComponent {
  values: string[] = [];
  otherText = '';
}

export const WithEditableInput: Story = {
  parameters: { controls: { disable: true } },
  decorators: [moduleMetadata({ imports: [WithEditableInputDemoComponent] })],
  render: () => ({
    template: `<story-checkbox-group-editable />`,
  }),
};

@Component({
  selector: 'story-checkbox-group-editable-multiple',
  standalone: true,
  imports: [FormsModule, MznCheckbox, MznCheckboxGroup, MznTypography],
  template: `
    <div
      style="display: flex; flex-direction: column; gap: 16px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px; max-width: 600px;"
    >
      <p mznTypography variant="body">多個可編輯輸入範例</p>
      <p mznTypography variant="body" color="text-neutral">
        多個選項都可以有可編輯輸入框，勾選後會自動顯示。
      </p>
      <div
        mznCheckboxGroup
        [(ngModel)]="values"
        name="multiple-editable-group"
        layout="vertical"
      >
        <div
          mznCheckbox
          value="custom1"
          [withEditInput]="true"
          [editableInputValue]="editableValues['custom1'] ?? ''"
          (editableInputChange)="onEditableChange('custom1', $event)"
          >自訂選項 1</div
        >
        <div
          mznCheckbox
          value="custom2"
          [withEditInput]="true"
          [editableInputValue]="editableValues['custom2'] ?? ''"
          (editableInputChange)="onEditableChange('custom2', $event)"
          >自訂選項 2</div
        >
        <div mznCheckbox value="normal">一般選項</div>
        <div
          mznCheckbox
          value="other"
          [withEditInput]="true"
          [editableInputValue]="editableValues['other'] ?? ''"
          (editableInputChange)="onEditableChange('other', $event)"
          >其他</div
        >
      </div>
      @if (values.length > 0) {
        <div
          style="padding: 12px; background-color: #f3f4f6; border-radius: 4px; margin-top: 8px;"
        >
          <span mznTypography variant="caption" color="text-neutral">
            已選擇：{{ values.join(', ') }}
          </span>
          @if (hasEditableValues()) {
            <div style="margin-top: 8px;">
              <span
                mznTypography
                variant="caption"
                color="text-neutral"
                style="display: block; margin-bottom: 4px;"
              >
                已輸入的內容：
              </span>
              @for (entry of editableEntries(); track entry[0]) {
                <span
                  mznTypography
                  variant="caption"
                  color="text-neutral"
                  style="display: block; margin-left: 8px;"
                >
                  {{ entry[0] }}: {{ entry[1] }}
                </span>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
class WithEditableInputMultipleDemoComponent {
  values: string[] = [];
  editableValues: Record<string, string> = {};

  onEditableChange(key: string, value: string): void {
    this.editableValues = { ...this.editableValues, [key]: value };
  }

  hasEditableValues(): boolean {
    return Object.values(this.editableValues).some((v) => v.length > 0);
  }

  editableEntries(): [string, string][] {
    return Object.entries(this.editableValues).filter(([, v]) => v.length > 0);
  }
}

export const WithEditableInputMultiple: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [WithEditableInputMultipleDemoComponent] }),
  ],
  render: () => ({
    template: `<story-checkbox-group-editable-multiple />`,
  }),
};
