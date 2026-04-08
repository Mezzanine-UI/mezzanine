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
          <mzn-toggle [(ngModel)]="mainEnabled" />
          <mzn-toggle [(ngModel)]="mainChecked" />
          disabled
          <mzn-toggle [disabled]="true" />
          <mzn-toggle [disabled]="true" [(ngModel)]="mainChecked" />
        </div>
        <br />
        Size: sub
        <div style="display: flex; gap: 16px; align-items: center;">
          enable
          <mzn-toggle size="sub" [(ngModel)]="subEnabled" />
          <mzn-toggle size="sub" [(ngModel)]="subChecked" />
          disabled
          <mzn-toggle size="sub" [disabled]="true" />
          <mzn-toggle size="sub" [disabled]="true" [(ngModel)]="subChecked" />
        </div>
        <br />
        With text content
        <div style="display: flex; gap: 16px; align-items: center;">
          <mzn-toggle label="Toggle Label" supportingText="Toggle Supporting Text" />
          <mzn-toggle label="Toggle Label" />
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <mzn-toggle [disabled]="true" label="Toggle Label" supportingText="Toggle Supporting Text" />
          <mzn-toggle [disabled]="true" label="Toggle Label" />
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
      <mzn-toggle
        [disabled]="disabled"
        [label]="label"
        [(ngModel)]="enabled"
        [size]="size"
      />
      <p>enabled: {{ enabled }}</p>
    `,
  }),
};
