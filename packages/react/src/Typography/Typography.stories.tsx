import { Story, Meta } from '@storybook/react';
import Typography, {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyProps,
  TypographyVariant,
} from '.';

export default {
  title: 'Basic/Typography',
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

export const Playgroud: Story<TypographyProps> = ({ children, ...props }) => (
  <Typography {...props}>{children}</Typography>
);

Playgroud.args = {
  children: 'Hello World!',
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

export const Variants = () => (
  <>
    <Typography variant="h1">h1. Heading</Typography>
    <Typography variant="h2">h2. Heading</Typography>
    <Typography variant="h3">h3. Heading</Typography>
    <Typography variant="h4">h4. Heading</Typography>
    <Typography variant="h5">h5. Heading</Typography>
    <Typography variant="h6">h6. Heading</Typography>
    <br />
    <Typography variant="body1">
      body1. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Neque, asperiores fuga porro officiis mollitia qui,
      consectetur sed provident suscipit voluptate quae
      similique minima itaque officia non impedit perferendis quis consequatur?
    </Typography>
    <Typography variant="body2">
      body2. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Neque, asperiores fuga porro officiis mollitia qui,
      consectetur sed provident suscipit voluptate quae
      similique minima itaque officia non impedit perferendis quis consequatur?
    </Typography>
    <br />
    <Typography variant="button1" display="block">button 1</Typography>
    <Typography variant="button2" display="block">button 2</Typography>
    <Typography variant="button3" display="block">button 3</Typography>
    <Typography variant="input1" display="block">input 1</Typography>
    <Typography variant="input2" display="block">input 2</Typography>
    <Typography variant="input3" display="block">input 3</Typography>
    <Typography variant="caption" display="block">caption text</Typography>
  </>
);

export const Colors = () => (
  <>
    {colors.map((color) => (
      <Typography key={color} color={color}>
        {color}
      </Typography>
    ))}
  </>
);
