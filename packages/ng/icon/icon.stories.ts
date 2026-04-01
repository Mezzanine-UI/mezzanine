import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  PlusIcon,
  SearchIcon,
  CheckedIcon,
  MenuIcon,
  CloseIcon,
  InfoFilledIcon,
  WarningFilledIcon,
  CheckedFilledIcon,
  ErrorFilledIcon,
} from '@mezzanine-ui/icons';
import { IconColor } from '@mezzanine-ui/core/icon';
import { MznIcon } from './icon.component';

const colors: IconColor[] = [
  'inherit',
  'neutral',
  'neutral-strong',
  'brand',
  'brand-strong',
  'error',
  'error-strong',
  'warning',
  'warning-strong',
  'success',
  'success-strong',
  'info',
  'info-strong',
];

export default {
  title: 'Foundation/Icon',
  component: MznIcon,
  decorators: [
    moduleMetadata({
      imports: [MznIcon],
    }),
  ],
} satisfies Meta<MznIcon>;

type Story = StoryObj<MznIcon>;

export const Playground: Story = {
  argTypes: {
    color: {
      options: [undefined, ...colors],
      control: { type: 'select' },
    },
    size: {
      control: { type: 'number' },
    },
    spin: {
      control: { type: 'boolean' },
    },
  },
  args: {
    icon: PlusIcon,
    color: 'neutral',
    size: 24,
    spin: false,
  },
  render: (args) => ({
    props: args,
    template: `<mzn-icon [icon]="icon" [color]="color" [size]="size" [spin]="spin" />`,
  }),
};

export const Colors: Story = {
  render: () => ({
    props: {
      colors,
      icon: CheckedFilledIcon,
    },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(4, 120px); gap: 16px; align-items: center;">
        @for (color of colors; track color) {
          <div style="display: flex; align-items: center; gap: 8px;">
            <mzn-icon [icon]="icon" [color]="color" [size]="24" />
            <span style="font-size: 12px;">{{ color }}</span>
          </div>
        }
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      icon: SearchIcon,
      sizes: [12, 16, 20, 24, 32, 48],
    },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        @for (s of sizes; track s) {
          <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
            <mzn-icon [icon]="icon" [size]="s" color="neutral" />
            <span style="font-size: 12px;">{{ s }}px</span>
          </div>
        }
      </div>
    `,
  }),
};

export const Spin: Story = {
  render: () => ({
    props: { icon: PlusIcon },
    template: `
      <div style="display: flex; gap: 24px; align-items: center;">
        <mzn-icon [icon]="icon" [size]="24" color="brand" [spin]="true" />
        <mzn-icon [icon]="icon" [size]="32" color="success" [spin]="true" />
        <mzn-icon [icon]="icon" [size]="48" color="error" [spin]="true" />
      </div>
    `,
  }),
};

export const Gallery: Story = {
  render: () => {
    const icons = [
      { name: 'PlusIcon', def: PlusIcon },
      { name: 'SearchIcon', def: SearchIcon },
      { name: 'CheckedIcon', def: CheckedIcon },
      { name: 'MenuIcon', def: MenuIcon },
      { name: 'CloseIcon', def: CloseIcon },
      { name: 'InfoFilledIcon', def: InfoFilledIcon },
      { name: 'WarningFilledIcon', def: WarningFilledIcon },
      { name: 'CheckedFilledIcon', def: CheckedFilledIcon },
      { name: 'ErrorFilledIcon', def: ErrorFilledIcon },
    ];

    return {
      props: { icons },
      template: `
        <div style="display: inline-grid; grid-template-columns: repeat(3, 140px); gap: 16px;">
          @for (item of icons; track item.name) {
            <div style="display: flex; align-items: center; gap: 8px; padding: 8px; border: 1px solid rgba(128,128,128,0.2); border-radius: 4px;">
              <mzn-icon [icon]="item.def" [size]="20" color="neutral" />
              <span style="font-size: 12px;">{{ item.name }}</span>
            </div>
          }
        </div>
      `,
    };
  },
};
