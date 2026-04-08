import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import { TypographySemanticType } from '@mezzanine-ui/system/typography';
import { MznTypography } from './typography.directive';

const aligns: TypographyAlign[] = ['left', 'center', 'right', 'justify'];
const colors: TypographyColor[] = [
  'inherit',
  'text-fixed-light',
  'text-neutral-faint',
  'text-neutral-light',
  'text-neutral',
  'text-neutral-strong',
  'text-neutral-solid',
  'text-brand',
  'text-brand-strong',
  'text-brand-solid',
  'text-error',
  'text-error-strong',
  'text-error-solid',
  'text-warning',
  'text-warning-strong',
  'text-success',
  'text-info',
  'text-info-strong',
];
const displays: TypographyDisplay[] = [
  'block',
  'inline-block',
  'flex',
  'inline-flex',
];
const variants: TypographySemanticType[] = [
  'h1',
  'h2',
  'h3',
  'body',
  'body-highlight',
  'body-mono',
  'body-mono-highlight',
  'text-link-body',
  'text-link-caption',
  'caption',
  'caption-highlight',
  'annotation',
  'annotation-highlight',
  'button',
  'button-highlight',
  'input',
  'input-mono',
  'input-highlight',
  'label-primary',
  'label-primary-highlight',
  'label-secondary',
];

export default {
  title: 'Foundation/Typography',
  decorators: [
    moduleMetadata({
      imports: [MznTypography],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    align: {
      options: [undefined, ...aligns],
      control: { type: 'select' },
      description: 'Set text-align on the component.',
      table: {
        type: { summary: aligns.map((a) => `'${a}'`).join(' | ') },
        defaultValue: { summary: '-' },
      },
    },
    color: {
      options: [undefined, ...colors],
      control: { type: 'select' },
      description: 'The color name of the typography.',
      table: {
        type: { summary: colors.map((c) => `'${c}'`).join(' | ') },
        defaultValue: { summary: '-' },
      },
    },
    display: {
      options: [undefined, ...displays],
      control: { type: 'select' },
      description: 'Set display on the component.',
      table: {
        type: { summary: displays.map((d) => `'${d}'`).join(' | ') },
        defaultValue: { summary: '-' },
      },
    },
    ellipsis: {
      control: { type: 'boolean' },
      description:
        'If true, the text will not wrap and will truncate with a text overflow ellipsis.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    noWrap: {
      control: { type: 'boolean' },
      description: 'If true, the text will not wrap.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    variant: {
      options: variants,
      control: { type: 'select' },
      description: 'The semantic variant of the typography.',
      table: {
        type: { summary: variants.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: '-' },
      },
    },
  },
  args: {
    text: 'Hello World!',
    variant: 'body',
    ellipsis: false,
    noWrap: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <p mznTypography
        [variant]="variant"
        [color]="color"
        [align]="align"
        [display]="display"
        [ellipsis]="ellipsis"
        [noWrap]="noWrap"
      >{{ text }}</p>
    `,
  }),
};

export const Variants: Story = {
  render: () => ({
    template: `
      <h1 mznTypography variant="h1">h1. Heading</h1>
      <h2 mznTypography variant="h2">h2. Heading</h2>
      <h3 mznTypography variant="h3">h3. Heading</h3>
      <br />
      <p mznTypography variant="body">
        body. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
        asperiores fuga porro officiis mollitia qui, consectetur sed provident
        suscipit voluptate quae similique minima itaque officia non impedit
        perferendis quis consequatur?
      </p>
      <p mznTypography variant="body-highlight">
        body-highlight. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Neque, asperiores fuga porro officiis mollitia qui, consectetur sed
        provident suscipit voluptate quae similique minima itaque officia non
        impedit perferendis quis consequatur?
      </p>
      <br />
      <p mznTypography variant="body-mono" display="block">
        body-mono. Monospace font for code or technical content.
      </p>
      <p mznTypography variant="body-mono-highlight" display="block">
        body-mono-highlight. Highlighted monospace font.
      </p>
      <br />
      <p mznTypography variant="text-link-body" display="block">
        text-link-body. Link text style for body content.
      </p>
      <p mznTypography variant="text-link-caption" display="block">
        text-link-caption. Link text style for caption content.
      </p>
      <br />
      <p mznTypography variant="caption" display="block">
        caption. Caption text
      </p>
      <p mznTypography variant="caption-highlight" display="block">
        caption-highlight. Highlighted caption text
      </p>
      <br />
      <p mznTypography variant="annotation" display="block">
        annotation. Annotation text
      </p>
      <p mznTypography variant="annotation-highlight" display="block">
        annotation-highlight. Highlighted annotation text
      </p>
      <br />
      <p mznTypography variant="button" display="block">
        button. Button text
      </p>
      <p mznTypography variant="button-highlight" display="block">
        button-highlight. Highlighted button text
      </p>
      <br />
      <p mznTypography variant="input" display="block">
        input. Input text
      </p>
      <p mznTypography variant="input-mono" display="block">
        input-mono. Monospace input text
      </p>
      <p mznTypography variant="input-highlight" display="block">
        input-highlight. Highlighted input text
      </p>
      <br />
      <p mznTypography variant="label-primary" display="block">
        label-primary. Primary label text
      </p>
      <p mznTypography variant="label-primary-highlight" display="block">
        label-primary-highlight. Primary 500 label text
      </p>
      <p mznTypography variant="label-secondary" display="block">
        label-secondary. Secondary label text
      </p>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    props: { colors },
    template: `
      @for (color of colors; track color) {
        <p mznTypography [color]="color" display="block">{{ color }}</p>
      }
    `,
  }),
};

export const MonoFonts: Story = {
  render: () => ({
    template: `
      <p mznTypography variant="body-mono" display="block">
        body-mono: const greeting = &quot;Hello, World!&quot;;
      </p>
      <p mznTypography variant="body-mono-highlight" display="block">
        body-mono-highlight: function add(a, b) {{ '{' }} return a + b; {{ '}' }}
      </p>
      <p mznTypography variant="input-mono" display="block">
        input-mono: user&#64;example.com
      </p>
    `,
  }),
};

export const Ellipsis: Story = {
  render: () => ({
    template: `
      <div style="width: 200px;">
        <p mznTypography [ellipsis]="true">
          This is a very long text that will be truncated with an ellipsis when it
          exceeds the container width
        </p>
      </div>
    `,
  }),
};

export const NoWrap: Story = {
  render: () => ({
    template: `
      <div style="width: 200px; border: 1px solid #ddd; padding: 8px;">
        <p mznTypography [noWrap]="true">
          This is a very long text that will not wrap and will overflow the
          container
        </p>
      </div>
    `,
  }),
};
