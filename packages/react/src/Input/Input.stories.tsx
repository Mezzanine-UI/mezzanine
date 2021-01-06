import { boolean } from '@storybook/addon-knobs';
import Input from '.';

export default {
  title: 'Basic/Input',
};

export const Basic = () => {
  const error = boolean('error', true);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, min-content)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Input />
      <Input disabled />
      <Input error={error} />
      <Input value="Example" />
    </div>
  );
};

export const Sizes = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, min-content)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input inputSize="small" />
    <Input inputSize="medium" />
    <Input inputSize="large" />
  </div>
);
