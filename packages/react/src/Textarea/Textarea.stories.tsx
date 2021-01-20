import Textarea from '.';

export default {
  title: 'Basic/Textarea',
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 102px)',
      gap: '24px',
      justifyItems: 'center',
    }}
  >
    <Textarea
      clearable
      placeholder="輸入文字..."
      maxLength={50}
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
      gridTemplateColumns: '500px',
      gridTemplateRows: 'repeat(8, 102px)',
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
    <Textarea
      placeholder="輸入文字..."
      size="small"
      disabled
    />
    <Textarea
      placeholder="輸入文字..."
      size="medium"
      disabled
    />
    <Textarea
      placeholder="輸入文字..."
      size="large"
      disabled
    />
    <Textarea
      placeholder="輸入文字..."
      size="small"
      error
    />
    <Textarea
      placeholder="輸入文字..."
      size="medium"
      error
    />
    <Textarea
      placeholder="輸入文字..."
      size="large"
      error
    />
  </div>
);
