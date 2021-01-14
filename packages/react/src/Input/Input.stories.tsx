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
      iconEnd={<Icon icon={PlusIcon} />}
      disabled
    />
    <Input
      placeholder="請輸入文字"
      iconStart={<Icon icon={PlusIcon} />}
      error
    />
    <Input
      placeholder="請輸入文字"
      iconEnd={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="請輸入文字"
      iconStart={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="請輸入文字"
      iconStart={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="輸入金額"
      textStart="$"
      textEnd="TWD"
      size="large"
    />
    <Input
      placeholder="輸入金額"
      textStart="$"
      textEnd="TWD"
    />
    <Input
      placeholder="輸入金額"
      textStart="$"
      textEnd="TWD"
      size="small"
    />
    <Input
      placeholder="輸入金額"
      iconStart={<Icon icon={PlusIcon} />}
      textEnd="價格"
      size="large"
    />
    <Input
      placeholder="輸入金額"
      textStart="$"
      textEnd="TWD"
    />
    <Input
      placeholder="輸入金額"
      textStart="$"
      textEnd="TWD"
      size="small"
    />
    <Input
      placeholder="搜尋..."
      iconStart={<Icon icon={SearchIcon} />}
      size="large"
      clearable
    />
    <Input
      placeholder="搜尋..."
      iconStart={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="搜尋..."
      iconStart={<Icon icon={SearchIcon} />}
      size="small"
      clearable
    />
  </div>
);
