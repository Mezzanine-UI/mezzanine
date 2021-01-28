import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { PlusIcon } from '@mezzanine-ui/icons';
import { MznIconModule } from '../icon';
import { MznButtonModule } from '.';

export default {
  title: 'General/Button/IconButton',
  decorators: [
    moduleMetadata({
      imports: [MznButtonModule, MznIconModule],
    }),
  ],
} as Meta;

export const All: Story = (args) => ({
  props: {
    ...args,
    plusIcon: PlusIcon,
  },
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center'
      }"
    >
      <button mzn-icon-button="outlined" size="small">
        <i [mzn-icon]="plusIcon"></i>
      </button>
      <button mzn-icon-button="outlined">
        <i [mzn-icon]="plusIcon"></i>
      </button>
      <button mzn-icon-button="outlined" size="large">
        <i [mzn-icon]="plusIcon"></i>
      </button>
      <button mzn-icon-button="contained" size="small">
        <i [mzn-icon]="plusIcon"></i>
      </button>
      <button mzn-icon-button="contained">
        <i [mzn-icon]="plusIcon"></i>
      </button>
      <button mzn-icon-button="contained" size="large">
        <i [mzn-icon]="plusIcon"></i>
      </button>
    </div>
  `,
});
