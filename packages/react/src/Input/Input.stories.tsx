import Input from '.';

export default {
  title: 'Basic/Input',
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
