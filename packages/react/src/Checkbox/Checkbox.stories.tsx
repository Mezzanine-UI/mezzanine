import Checkbox from '.';

export default {
  title: 'Basic/Checkbox',
};

export const Basic = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(2, max-content)',
    gap: '16px',
    alignItems: 'center',
  }}
  >
    Unselected
    <Checkbox />
    Disabled Unselected
    <Checkbox disabled />
    Error Unselected
    <Checkbox hasError />
    Disabled Selected
    <Checkbox disabled defaultChecked />
    Enabled Indeterminate
    <Checkbox indeterminate />
    Disabled Indeterminate
    <Checkbox disabled indeterminate />
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, max-content)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Checkbox size="small">預設文字</Checkbox>
    <Checkbox size="small">字</Checkbox>
    <Checkbox size="medium">預設文字</Checkbox>
    <Checkbox size="medium">字</Checkbox>
    <Checkbox size="large">預設文字</Checkbox>
    <Checkbox size="large">字</Checkbox>
  </div>
);

export const Group = () => (
  <div>
    <Checkbox>
      預設文字
    </Checkbox>
  </div>
);

export const Tree = () => (
  <div>
    <Checkbox>
      預設文字
    </Checkbox>
  </div>
);
