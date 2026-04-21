import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { MznToggle } from './toggle.component';

export default {
  title: 'Data Entry/Toggle',
  decorators: [
    moduleMetadata({
      imports: [MznToggle, FormsModule],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const All: Story = {
  render: () => ({
    props: {
      mainEnabled: false,
      mainChecked: true,
      subEnabled: false,
      subChecked: true,
    },
    template: `
      <div style="display: grid; gap: 16px; align-items: center;">
        Size: main
        <div style="display: flex; gap: 16px; align-items: center;">
          enable
          <div mznToggle [(ngModel)]="mainEnabled" ></div>
          <div mznToggle [(ngModel)]="mainChecked" ></div>
          disabled
          <div mznToggle [disabled]="true" ></div>
          <div mznToggle [disabled]="true" [(ngModel)]="mainChecked" ></div>
        </div>
        <br />
        Size: sub
        <div style="display: flex; gap: 16px; align-items: center;">
          enable
          <div mznToggle size="sub" [(ngModel)]="subEnabled" ></div>
          <div mznToggle size="sub" [(ngModel)]="subChecked" ></div>
          disabled
          <div mznToggle size="sub" [disabled]="true" ></div>
          <div mznToggle size="sub" [disabled]="true" [(ngModel)]="subChecked" ></div>
        </div>
        <br />
        With text content
        <div style="display: flex; gap: 16px; align-items: center;">
          <div mznToggle label="Toggle Label" supportingText="Toggle Supporting Text" ></div>
          <div mznToggle label="Toggle Label" ></div>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <div mznToggle [disabled]="true" label="Toggle Label" supportingText="Toggle Supporting Text" ></div>
          <div mznToggle [disabled]="true" label="Toggle Label" ></div>
        </div>
      </div>
    `,
  }),
};

export const Playground: Story = {
  argTypes: {
    checked: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    label: {
      control: { type: 'text' },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
    },
  },
  args: {
    checked: true,
    disabled: false,
    label: 'Enable notifications',
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
      enabled: args['checked'] ?? false,
    },
    template: `
      <div mznToggle
        [disabled]="disabled"
        [label]="label"
        [(ngModel)]="enabled"
        [size]="size"
      ></div>
      <p>enabled: {{ enabled }}</p>
    `,
  }),
};
