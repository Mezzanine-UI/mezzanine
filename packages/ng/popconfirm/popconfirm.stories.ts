import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznPopconfirm } from './popconfirm.component';
import { MznButton } from '../button/button.directive';

const meta: Meta<MznPopconfirm> = {
  title: 'Feedback/Popconfirm',
  component: MznPopconfirm,
  decorators: [
    moduleMetadata({
      imports: [MznButton],
    }),
  ],
};

export default meta;

type Story = StoryObj<MznPopconfirm>;

export const Basic: Story = {
  render: () => ({
    props: {
      open: false,
      toggle(): void {
        this.open = !this.open;
      },
      onConfirm(): void {
        this.open = false;
      },
      onCancel(): void {
        this.open = false;
      },
    },
    template: `
      <div style="padding: 100px;">
        <button #anchor mznButton variant="base-secondary" (click)="toggle()">
          Delete Item
        </button>
        <div mznPopconfirm
          [anchor]="anchor"
          [open]="open"
          title="Are you sure you want to delete?"
          confirmText="Delete"
          cancelText="Cancel"
          (confirmed)="onConfirm()"
          (cancelled)="onCancel()"
          (closed)="onCancel()"
        ></div>
      </div>
    `,
  }),
};
