import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import Input from '.';
import Icon from '../../Icon';

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
      error
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
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="請輸入文字"
      size="small"
    />
    <Input
      placeholder="請輸入文字"
      size="medium"
    />
    <Input
      placeholder="請輸入文字"
      size="large"
    />
    <Input
      placeholder="請輸入文字"
      size="small"
      disabled
    />
    <Input
      placeholder="請輸入文字"
      size="medium"
      disabled
    />
    <Input
      placeholder="請輸入文字"
      size="large"
      disabled
    />
    <Input
      placeholder="請輸入文字"
      size="small"
      error
    />
    <Input
      placeholder="請輸入文字"
      size="medium"
      error
    />
    <Input
      placeholder="請輸入文字"
      size="large"
      error
    />
  </div>
);

export const WithIcons = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="請輸入文字"
    />
    <Input
      placeholder="請輸入文字"
      suffix={<Icon icon={PlusIcon} />}
      disabled
    />
    <Input
      placeholder="請輸入文字"
      prefix={<Icon icon={PlusIcon} />}
      error
    />
    <Input
      placeholder="請輸入文字"
      suffix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="請輸入文字"
      prefix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="請輸入文字"
      prefix={<Icon icon={PlusIcon} />}
    />
    <Input
      prefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      suffix="TWD"
      size="large"
    />
    <Input
      prefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      suffix="TWD"
    />
    <Input
      prefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      suffix="TWD"
      size="small"
    />
    <Input
      prefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      suffix="價格"
      size="large"
    />
    <Input
      prefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      suffix="TWD"
    />
    <Input
      prefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      suffix="TWD"
      size="small"
    />
    <Input
      placeholder="搜尋..."
      prefix={<Icon icon={SearchIcon} />}
      size="large"
      clearable
      error
    />
    <Input
      placeholder="搜尋..."
      prefix={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="搜尋..."
      prefix={<Icon icon={SearchIcon} />}
      size="small"
      clearable
    />
  </div>
);
