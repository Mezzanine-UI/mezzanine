import { Meta, StoryObj } from '@storybook/react-webpack5';
import Typography, {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographySemanticType,
} from '.';

export default {
  title: 'Foundation/Typography',
  component: Typography,
} as Meta<typeof Typography>;

type Story = StoryObj<typeof Typography>;

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
};

export const Variants: Story = {
  render: () => (
    <>
      <Typography variant="h1">h1. Heading</Typography>
      <Typography variant="h2">h2. Heading</Typography>
      <Typography variant="h3">h3. Heading</Typography>
      <br />
      <Typography variant="body">
        body. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
        asperiores fuga porro officiis mollitia qui, consectetur sed provident
        suscipit voluptate quae similique minima itaque officia non impedit
        perferendis quis consequatur?
      </Typography>
      <Typography variant="body-highlight">
        body-highlight. Lorem ipsum dolor sit amet consectetur adipisicing elit.
        Neque, asperiores fuga porro officiis mollitia qui, consectetur sed
        provident suscipit voluptate quae similique minima itaque officia non
        impedit perferendis quis consequatur?
      </Typography>
      <br />
      <Typography variant="body-mono" display="block">
        body-mono. Monospace font for code or technical content.
      </Typography>
      <Typography variant="body-mono-highlight" display="block">
        body-mono-highlight. Highlighted monospace font.
      </Typography>
      <br />
      <Typography variant="text-link-body" display="block">
        text-link-body. Link text style for body content.
      </Typography>
      <Typography variant="text-link-caption" display="block">
        text-link-caption. Link text style for caption content.
      </Typography>
      <br />
      <Typography variant="caption" display="block">
        caption. Caption text
      </Typography>
      <Typography variant="caption-highlight" display="block">
        caption-highlight. Highlighted caption text
      </Typography>
      <br />
      <Typography variant="annotation" display="block">
        annotation. Annotation text
      </Typography>
      <Typography variant="annotation-highlight" display="block">
        annotation-highlight. Highlighted annotation text
      </Typography>
      <br />
      <Typography variant="button" display="block">
        button. Button text
      </Typography>
      <Typography variant="button-highlight" display="block">
        button-highlight. Highlighted button text
      </Typography>
      <br />
      <Typography variant="input" display="block">
        input. Input text
      </Typography>
      <Typography variant="input-mono" display="block">
        input-mono. Monospace input text
      </Typography>
      <Typography variant="input-highlight" display="block">
        input-highlight. Highlighted input text
      </Typography>
      <br />
      <Typography variant="label-primary" display="block">
        label-primary. Primary label text
      </Typography>
      <Typography variant="label-primary-highlight" display="block">
        label-primary-highlight. Primary 500 label text
      </Typography>
      <Typography variant="label-secondary" display="block">
        label-secondary. Secondary label text
      </Typography>
    </>
  ),
};

export const Colors: Story = {
  render: () => (
    <>
      {colors.map((color) => (
        <Typography key={color} color={color} display="block">
          {color}
        </Typography>
      ))}
    </>
  ),
};

export const MonoFonts: Story = {
  render: () => (
    <>
      <Typography variant="body-mono" display="block">
        body-mono: const greeting = &quot;Hello, World!&quot;;
      </Typography>
      <Typography variant="body-mono-highlight" display="block">
        body-mono-highlight: function add(a, b) {'{ return a + b; }'}
      </Typography>
      <Typography variant="input-mono" display="block">
        input-mono: user@example.com
      </Typography>
    </>
  ),
};

export const Ellipsis: Story = {
  render: () => (
    <div style={{ width: '200px' }}>
      <Typography ellipsis>
        This is a very long text that will be truncated with an ellipsis when it
        exceeds the container width
      </Typography>
    </div>
  ),
};

export const NoWrap: Story = {
  render: () => (
    <div style={{ width: '200px', border: '1px solid #ddd', padding: '8px' }}>
      <Typography noWrap>
        This is a very long text that will not wrap and will overflow the
        container
      </Typography>
    </div>
  ),
};
