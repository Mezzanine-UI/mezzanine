import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import { boolean } from '@storybook/addon-knobs';
import Input from '.';
import Icon from '../Icon';

export default {
  title: 'Basic/Input',
};

export const Basic = () => {
  const error = boolean('error', true);

  return (
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
        error={error}
      />
      <Input
        placeholder="請輸入文字"
        value="Example"
        readOnly
      />
    </div>
  );
};

export const Sizes = () => {
  const error = boolean('error', true);

  return (
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
        error={error}
      />
      <Input
        placeholder="請輸入文字"
        size="medium"
        error={error}
      />
      <Input
        placeholder="請輸入文字"
        size="large"
        error={error}
      />
    </div>
  );
};

export const WithIcons = () => {
  const error = boolean('error', true);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, 200px)',
        gridTemplateRows: '60px',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Input placeholder="請輸入文字" />
      <Input
        placeholder="請輸入文字"
        iconEnd={<Icon icon={PlusIcon} />}
        disabled
      />
      <Input
        placeholder="請輸入文字"
        iconStart={<Icon icon={PlusIcon} />}
        error={error}
      />
      <Input
        placeholder="請輸入文字"
        iconEnd={<Icon icon={PlusIcon} />}
        size="small"
      />
      <Input
        placeholder="請輸入文字"
        iconStart={<Icon icon={PlusIcon} />}
        size="small"
      />
      <Input
        placeholder="請輸入文字"
        iconStart={<Icon icon={PlusIcon} />}
        size="large"
      />
      <Input
        placeholder="輸入金額"
        textStart="$"
        textEnd="TWD"
        size="large"
        numberOnly
      />
      <Input
        placeholder="輸入金額"
        textStart="$"
        textEnd="TWD"
        numberOnly
      />
      <Input
        placeholder="輸入金額"
        textStart="$"
        textEnd="TWD"
        size="small"
        numberOnly
      />
      <Input
        placeholder="輸入金額"
        iconStart={<Icon icon={PlusIcon} />}
        textEnd="價格"
        size="large"
        numberOnly
      />
      <Input
        placeholder="輸入金額"
        textStart="$"
        textEnd="TWD"
        numberOnly
      />
      <Input
        placeholder="輸入金額"
        textStart="$"
        textEnd="TWD"
        size="small"
        numberOnly
      />
      <Input
        maxLength={20}
        placeholder="搜尋..."
        iconStart={<Icon icon={SearchIcon} />}
        size="large"
        clearable
      />
    </div>
  );
};
