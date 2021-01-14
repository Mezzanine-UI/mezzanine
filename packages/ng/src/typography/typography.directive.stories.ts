import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';

import {
  MznTypographyDirective,
  MznTypographyModule,
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
} from '.';

export default {
  title: 'Basic/Typography',
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

export const Playgroud: Story<MznTypographyDirective & { content: string; }> = (args) => ({
  props: args,
  template: `
    <p
      [mznTypography]="variant"
      [mznTypographyAlign]="align"
      [mznTypographyColor]="color"
      [mznTypographyDisplay]="display"
      [mznTypographyEllipsis]="ellipsis"
      [mznTypographyNoWrap]="noWrap"
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
    <h1 mznTypography="h1">h1. Heading</h1>
    <h2 mznTypography="h2">h2. Heading</h2>
    <h3 mznTypography="h3">h3. Heading</h3>
    <h4 mznTypography="h4">h4. Heading</h4>
    <h5 mznTypography="h5">h5. Heading</h5>
    <h6 mznTypography="h6">h6. Heading</h6>
    <p mznTypography>
      body1. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Neque, asperiores fuga porro officiis mollitia qui,
      consectetur sed provident suscipit voluptate quae
      similique minima itaque officia non impedit perferendis quis consequatur?
    </p>
    <p mznTypography="body2">
      body2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Neque, asperiores fuga porro officiis mollitia qui,
      consectetur sed provident suscipit voluptate quae
      similique minima itaque officia non impedit perferendis quis consequatur?
    </p>
    <span mznTypography="button1" mznTypographyDisplay="block">button 1</span>
    <span mznTypography="button2" mznTypographyDisplay="block">button 2</span>
    <span mznTypography="button3" mznTypographyDisplay="block">button 3</span>
    <span mznTypography="input1" mznTypographyDisplay="block">input 1</span>
    <span mznTypography="input2" mznTypographyDisplay="block">input 2</span>
    <span mznTypography="input3" mznTypographyDisplay="block">input 3</span>
    <span mznTypography="caption" mznTypographyDisplay="block">caption text</span>
  `,
});

export const Colors: Story = (args) => ({
  props: args,
  template: `
    <p mznTypography mznTypographyColor="inherit">inherit</p>
    <p mznTypography mznTypographyColor="primary">primary</p>
    <p mznTypography mznTypographyColor="secondary">secondary</p>
    <p mznTypography mznTypographyColor="error">error</p>
    <p mznTypography mznTypographyColor="warning">warning</p>
    <p mznTypography mznTypographyColor="success">success</p>
    <p mznTypography mznTypographyColor="text-primary">text-primary</p>
    <p mznTypography mznTypographyColor="text-secondary">text-secondary</p>
    <p mznTypography mznTypographyColor="text-disabled">text-disabled</p>
  `,
});
