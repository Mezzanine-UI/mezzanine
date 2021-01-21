import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { MznIconModule } from '../icon';
import { ButtonGroupOrientation, MznButtonGroupComponent, MznButtonModule } from '.';

export default {
  title: 'Basic/Button/ButtonGroup',
  decorators: [
    moduleMetadata({
      imports: [MznButtonModule, MznIconModule],
    }),
  ],
} as Meta;

const orientations: ButtonGroupOrientation[] = [
  'horizontal',
  'vertical',
];

export const Playgroud: Story<MznButtonGroupComponent> = (args) => ({
  props: args,
  template: `
    <mzn-button-group
      [attached]="attached"
      [orientation]="orientation"
      variant="contained"
    >
      <button mzn-button>one</button>
      <button mzn-button>two</button>
      <button mzn-button>trhee</button>
    </mzn-button-group>
    <br />
    <br />
    <mzn-button-group
      [attached]="attached"
      [orientation]="orientation"
      variant="outlined"
    >
      <button mzn-button>one</button>
      <button mzn-button>two</button>
      <button mzn-button>trhee</button>
    </mzn-button-group>
    <br />
    <br />
    <mzn-button-group
      [attached]="attached"
      [orientation]="orientation"
    >
      <button mzn-button>one</button>
      <button mzn-button>two</button>
      <button mzn-button>trhee</button>
    </mzn-button-group>
  `,
});

Playgroud.args = {
  attached: false,
  orientation: 'horizontal',
};
Playgroud.argTypes = {
  orientation: {
    control: {
      type: 'select',
      options: orientations,
    },
  },
};

export const DropdownLike: Story = (args) => ({
  props: args,
  template: `
    <mzn-button-group
      attached
      [color]="color"
      [disabled]="disabled"
      [error]="error"
      [size]="size"
      [variant]="variant"
    >
      <button mzn-button>click</button>
      <button mzn-icon-button>
        <i [mzn-icon]="icon"></i>
      </button>
    </mzn-button-group>
    <br />
    <br />
    <mzn-button-group
      attached
      color="primary"
      variant="outlined"
    >
      <button mzn-button>click</button>
      <button mzn-icon-button>
        <i [mzn-icon]="icon"></i>
      </button>
    </mzn-button-group>
  `,
});

DropdownLike.args = {
  color: 'primary',
  disabled: false,
  error: false,
  size: 'medium',
  variant: 'contained',
  icon: ChevronDownIcon,
};
