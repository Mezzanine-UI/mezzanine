import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import type { TypographySemanticType } from '@mezzanine-ui/system/typography';
import MznTypography from './typography.vue';
import type { TypographyProps } from './typography.types';

export default {
  title: 'Foundation/Typography',
  component: MznTypography,
} as Meta<typeof MznTypography>;

type Story = StoryObj<TypographyProps & { children?: string }>;

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

export const Playground: Story = {
  args: {
    children: 'Hello World!',
    ellipsis: false,
    noWrap: false,
    variant: 'body',
  },
  argTypes: {
    align: {
      control: {
        type: 'select',
      },
      options: [undefined, ...aligns],
    },
    color: {
      control: {
        type: 'select',
      },
      options: [undefined, ...colors],
    },
    display: {
      control: {
        type: 'select',
      },
      options: [undefined, ...displays],
    },
    variant: {
      control: {
        type: 'select',
      },
      options: variants,
    },
  },
  render: ({ children, ...args }) => ({
    components: { MznTypography },
    setup: () => ({ args, children }),
    template: '<MznTypography v-bind="args">{{ children }}</MznTypography>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { MznTypography },
    template: `
      <MznTypography variant="h1">h1. Heading</MznTypography>
      <MznTypography variant="h2">h2. Heading</MznTypography>
      <MznTypography variant="h3">h3. Heading</MznTypography>
      <br />
      <MznTypography variant="body">
        body. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
        asperiores fuga porro officiis mollitia qui, consectetur sed provident
        suscipit voluptate quae similique minima itaque officia non impedit
        perferendis quis consequatur?
      </MznTypography>
      <MznTypography variant="body-highlight">
        body-highlight. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Neque, asperiores fuga porro officiis mollitia qui, consectetur sed
        provident suscipit voluptate quae similique minima itaque officia non
        impedit perferendis quis consequatur?
      </MznTypography>
      <br />
      <MznTypography variant="body-mono" display="block">
        body-mono. Monospace font for code or technical content.
      </MznTypography>
      <MznTypography variant="body-mono-highlight" display="block">
        body-mono-highlight. Highlighted monospace font.
      </MznTypography>
      <br />
      <MznTypography variant="text-link-body" display="block">
        text-link-body. Link text style for body content.
      </MznTypography>
      <MznTypography variant="text-link-caption" display="block">
        text-link-caption. Link text style for caption content.
      </MznTypography>
      <br />
      <MznTypography variant="caption" display="block">
        caption. Caption text
      </MznTypography>
      <MznTypography variant="caption-highlight" display="block">
        caption-highlight. Highlighted caption text
      </MznTypography>
      <br />
      <MznTypography variant="annotation" display="block">
        annotation. Annotation text
      </MznTypography>
      <MznTypography variant="annotation-highlight" display="block">
        annotation-highlight. Highlighted annotation text
      </MznTypography>
      <br />
      <MznTypography variant="button" display="block">
        button. Button text
      </MznTypography>
      <MznTypography variant="button-highlight" display="block">
        button-highlight. Highlighted button text
      </MznTypography>
      <br />
      <MznTypography variant="input" display="block">
        input. Input text
      </MznTypography>
      <MznTypography variant="input-mono" display="block">
        input-mono. Monospace input text
      </MznTypography>
      <MznTypography variant="input-highlight" display="block">
        input-highlight. Highlighted input text
      </MznTypography>
      <br />
      <MznTypography variant="label-primary" display="block">
        label-primary. Primary label text
      </MznTypography>
      <MznTypography variant="label-primary-highlight" display="block">
        label-primary-highlight. Primary 500 label text
      </MznTypography>
      <MznTypography variant="label-secondary" display="block">
        label-secondary. Secondary label text
      </MznTypography>
    `,
  }),
};

export const Colors: Story = {
  render: () => ({
    components: { MznTypography },
    setup: () => ({ colors }),
    template: `
      <MznTypography
        v-for="color in colors"
        :key="color"
        :color="color"
        display="block"
      >{{ color }}</MznTypography>
    `,
  }),
};

export const MonoFonts: Story = {
  /**
   * Authored with `h()` because the middle line mixes static text with a JSX
   * expression, which React renders as two adjacent text nodes; a template
   * would merge them into one. See the `architecting-vue-components` skill.
   */
  render: () => () => [
    h(
      MznTypography,
      { variant: 'body-mono', display: 'block' },
      () => 'body-mono: const greeting = "Hello, World!";',
    ),
    h(
      MznTypography,
      { variant: 'body-mono-highlight', display: 'block' },
      () => ['body-mono-highlight: function add(a, b) ', '{ return a + b; }'],
    ),
    h(
      MznTypography,
      { variant: 'input-mono', display: 'block' },
      () => 'input-mono: user@example.com',
    ),
  ],
};

export const Ellipsis: Story = {
  render: () => ({
    components: { MznTypography },
    // Kept on one line: `title` is an attribute and is compared verbatim, so
    // the surrounding template whitespace must not leak into it.
    template:
      '<div style="width: 200px"><MznTypography ellipsis>This is a very long text that will be truncated with an ellipsis when it exceeds the container width</MznTypography></div>',
  }),
};

export const NoWrap: Story = {
  render: () => ({
    components: { MznTypography },
    template: `
      <div style="width: 200px; border: 1px solid #ddd; padding: 8px">
        <MznTypography noWrap>
          This is a very long text that will not wrap and will overflow the
          container
        </MznTypography>
      </div>
    `,
  }),
};
