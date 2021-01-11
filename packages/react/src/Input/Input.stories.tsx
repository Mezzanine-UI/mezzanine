import { PlusIcon } from '@mezzanine-ui/icons';
import Input from '.';
import Icon from '../Icon';

export default {
  title: 'Basic/Input',
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gridTemplateRows: '60px',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="請輸入文字"
    />
    <Input
      placeholder="請輸入文字"
      disabled
    />
    <Input
      placeholder="請輸入文字"
      errorMessage="錯誤提示！"
    />
    <Input
      placeholder="請輸入文字"
      value="Example"
      readOnly
    />
  </div>
);

export const Sizes = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gridTemplateRows: '60px',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input inputSize="small" />
    <Input inputSize="medium" />
    <Input inputSize="large" />
    <Input inputSize="small" disabled />
    <Input inputSize="medium" disabled />
    <Input inputSize="large" disabled />
    <Input inputSize="small" errorMessage="錯誤提示！" />
    <Input inputSize="medium" errorMessage="錯誤提示！" />
    <Input inputSize="large" errorMessage="錯誤提示！" />
  </div>
);

export const WithIcons = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gridTemplateRows: '60px',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input />
    <Input
      iconEnd={<Icon icon={PlusIcon} />}
      disabled
    />
    <Input
      iconStart={<Icon icon={PlusIcon} />}
      errorMessage="錯誤提示！"
    />
    <Input
      iconEnd={<Icon icon={PlusIcon} />}
      inputSize="small"
    />
    <Input
      iconStart={<Icon icon={PlusIcon} />}
      inputSize="small"
    />
    <Input
      iconStart={<Icon icon={PlusIcon} />}
      inputSize="large"
    />
    <Input
      placeholder="請輸入金額"
      textStart="$"
      textEnd="TWD"
      inputSize="large"
    />
    <Input
      placeholder="請輸入金額"
      textStart="$"
      textEnd="TWD"
    />
    <Input
      placeholder="請輸入金額"
      textStart="$"
      textEnd="TWD"
      inputSize="small"
    />
    <Input
      placeholder="請輸入金額"
      iconStart={<Icon icon={PlusIcon} />}
      textEnd="價格"
      inputSize="large"
    />
    <Input
      placeholder="請輸入金額"
      textStart="$"
      textEnd="TWD"
    />
    <Input
      placeholder="請輸入金額"
      textStart="$"
      textEnd="TWD"
      inputSize="small"
    />
  </div>
);
