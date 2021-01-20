import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
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
      gridTemplateRows: '60px',
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
      inputSuffix={<Icon icon={PlusIcon} />}
      disabled
    />
    <Input
      placeholder="請輸入文字"
      inputPrefix={<Icon icon={PlusIcon} />}
      error
    />
    <Input
      placeholder="請輸入文字"
      inputSuffix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="請輸入文字"
      inputPrefix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="請輸入文字"
      inputPrefix={<Icon icon={PlusIcon} />}
    />
    <Input
      inputPrefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      inputSuffix="TWD"
      size="large"
    />
    <Input
      inputPrefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      inputSuffix="TWD"
    />
    <Input
      inputPrefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      inputSuffix="TWD"
      size="small"
    />
    <Input
      inputPrefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      inputSuffix="價格"
      size="large"
    />
    <Input
      inputPrefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      inputSuffix="TWD"
    />
    <Input
      inputPrefix={<Icon icon={PlusIcon} />}
      placeholder="輸入金額"
      inputSuffix="TWD"
      size="small"
    />
    <Input
      placeholder="搜尋..."
      inputPrefix={<Icon icon={SearchIcon} />}
      size="large"
      clearable
    />
    <Input
      placeholder="搜尋..."
      inputPrefix={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="搜尋..."
      inputPrefix={<Icon icon={SearchIcon} />}
      size="small"
      clearable
    />
  </div>
);
