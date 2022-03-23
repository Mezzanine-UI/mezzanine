import { Story } from '@storybook/react';
import Textarea, { TextareaProps, TextareaSize } from '.';

export default {
  title: 'Data Entry/Textarea',
};

const sizes: TextareaSize[] = [
  'small',
  'medium',
  'large',
];

export const Playground: Story<TextareaProps> = ({ ...props }) => (
  <Textarea {...props} />
);

Playground.args = {
  clearable: false,
  disabled: false,
  readOnly: false,
  error: false,
  fullWidth: false,
  placeholder: '輸入文字...',
  maxLength: 50,
  size: 'medium',
};

Playground.argTypes = {
  size: {
    control: {
      type: 'select',
      options: sizes,
    },
  },
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateRows: 'repeat(4, auto)',
      gridTemplateColumns: '500px',
      gap: '24px',
    }}
  >
    <Textarea
      clearable
      placeholder="輸入文字..."
      maxLength={100}
      rows={4}
    />
    <Textarea
      placeholder="輸入文字..."
      maxLength={50}
      disabled
    />
    <Textarea
      placeholder="輸入文字..."
      maxLength={50}
      error
      clearable
    />
    <Textarea
      placeholder="輸入文字..."
      maxLength={50}
      value="Example"
      readOnly
    />
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateRows: 'repeat(3, 102px)',
      gridTemplateColumns: '500px',
      gap: '24px',
      justifyItems: 'center',
    }}
  >
    <Textarea
      placeholder="輸入文字..."
      size="small"
      maxLength={20}
    />
    <Textarea
      placeholder="輸入文字..."
    />
    <Textarea
      placeholder="輸入文字..."
      size="large"
    />
  </div>
);
