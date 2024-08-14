import { StoryFn, Meta } from '@storybook/react';
import Typography, {
  TypographyAlign,
  TypographyColor,
  TypographyDisplay,
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
} from '.';

export default {
  title: 'General/Typography',
} as Meta;

const aligns: TypographyAlign[] = ['left', 'center', 'right', 'justify'];
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
const weights: TypographyWeight[] = [
  100, 200, 300, 400, 500, 600, 700, 800, 900,
];

export const Playgroud: StoryFn<TypographyProps<any>> = ({
  children,
  ...props
}) => <Typography {...props}>{children}</Typography>;

Playgroud.args = {
  children: 'Hello World!',
  variant: 'body1',
  ellipsis: false,
  noWrap: false,
};
Playgroud.argTypes = {
  align: {
    options: [undefined, ...aligns],
    control: {
      type: 'select',
    },
  },
  color: {
    options: [undefined, ...colors],
    control: {
      type: 'select',
    },
  },
  display: {
    options: [undefined, ...displays],
    control: {
      type: 'select',
    },
  },
  variant: {
    options: variants,
    control: {
      type: 'select',
    },
  },
  weight: {
    options: [undefined, ...weights],
    control: {
      type: 'select',
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
      body1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
      asperiores fuga porro officiis mollitia qui, consectetur sed provident
      suscipit voluptate quae similique minima itaque officia non impedit
      perferendis quis consequatur?
    </Typography>
    <Typography variant="body2">
      body2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque,
      asperiores fuga porro officiis mollitia qui, consectetur sed provident
      suscipit voluptate quae similique minima itaque officia non impedit
      perferendis quis consequatur?
    </Typography>
    <br />
    <Typography variant="button1" display="block">
      button 1
    </Typography>
    <Typography variant="button2" display="block">
      button 2
    </Typography>
    <Typography variant="button3" display="block">
      button 3
    </Typography>
    <Typography variant="input1" display="block">
      input 1
    </Typography>
    <Typography variant="input2" display="block">
      input 2
    </Typography>
    <Typography variant="input3" display="block">
      input 3
    </Typography>
    <Typography variant="caption" display="block">
      caption text
    </Typography>
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

export const Weights = () => (
  <>
    {weights.map((weight) => (
      <Typography key={weight} weight={weight}>
        {`Font Weight: ${weight}`}
      </Typography>
    ))}
  </>
);
