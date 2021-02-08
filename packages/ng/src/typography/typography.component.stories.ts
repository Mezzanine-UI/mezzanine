import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';

import {
  MznTypographyComponent,
  MznTypographyModule,
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
} from '.';

export default {
  title: 'General/Typography',
  decorators: [
    moduleMetadata({
      imports: [MznTypographyModule],
    }),
  ],
} as Meta;

const aligns: TypographyAlign[] = [
  'left',
  'center',
  'right',
  'justify',
];
const colors: TypographyColor[] = [
  'inherit',
  'primary',
  'secondary',
  'error',
  'warning',
  'success',
  'text-primary',
  'text-secondary',
  'text-disabled',
];
const displays: TypographyDisplay[] = [
  'block',
  'inline-block',
  'flex',
  'inline-flex',
];
const variants: TypographyVariant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body1',
  'body2',
  'button1',
  'button2',
  'button3',
  'input1',
  'input2',
  'input3',
  'caption',
];

export const Playgroud: Story<MznTypographyComponent & { content: string; }> = (args) => ({
  props: args,
  template: `
    <p
      [mzn-typography]="variant"
      [align]="align"
      [color]="color"
      [display]="display"
      [ellipsis]="ellipsis"
      [noWrap]="noWrap"
    >
      {{content}}
    </p>
  `,
});

Playgroud.args = {
  content: 'Hello World!',
  variant: 'body1',
  ellipsis: false,
  noWrap: false,
};
Playgroud.argTypes = {
  align: {
    control: {
      type: 'select',
      options: [undefined, ...aligns],
    },
  },
  color: {
    control: {
      type: 'select',
      options: [undefined, ...colors],
    },
  },
  display: {
    control: {
      type: 'select',
      options: [undefined, ...displays],
    },
  },
  variant: {
    control: {
      type: 'select',
      options: variants,
    },
  },
};

export const Variants: Story = (args) => ({
  props: args,
  template: `
    <h1 mzn-typography="h1">h1. Heading</h1>
    <h2 mzn-typography="h2">h2. Heading</h2>
    <h3 mzn-typography="h3">h3. Heading</h3>
    <h4 mzn-typography="h4">h4. Heading</h4>
    <h5 mzn-typography="h5">h5. Heading</h5>
    <h6 mzn-typography="h6">h6. Heading</h6>
    <p mzn-typography>
      body1. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Neque, asperiores fuga porro officiis mollitia qui,
      consectetur sed provident suscipit voluptate quae
      similique minima itaque officia non impedit perferendis quis consequatur?
    </p>
    <p mzn-typography="body2">
      body2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Neque, asperiores fuga porro officiis mollitia qui,
      consectetur sed provident suscipit voluptate quae
      similique minima itaque officia non impedit perferendis quis consequatur?
    </p>
    <span mzn-typography="button1" display="block">button 1</span>
    <span mzn-typography="button2" display="block">button 2</span>
    <span mzn-typography="button3" display="block">button 3</span>
    <span mzn-typography="input1" display="block">input 1</span>
    <span mzn-typography="input2" display="block">input 2</span>
    <span mzn-typography="input3" display="block">input 3</span>
    <span mzn-typography="caption" display="block">caption text</span>
  `,
});

export const Colors: Story = (args) => ({
  props: args,
  template: `
    <p mzn-typography color="inherit">inherit</p>
    <p mzn-typography color="primary">primary</p>
    <p mzn-typography color="secondary">secondary</p>
    <p mzn-typography color="error">error</p>
    <p mzn-typography color="warning">warning</p>
    <p mzn-typography color="success">success</p>
    <p mzn-typography color="text-primary">text-primary</p>
    <p mzn-typography color="text-secondary">text-secondary</p>
    <p mzn-typography color="text-disabled">text-disabled</p>
  `,
});
