import { PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import Input from '.';
import Icon from '../Icon';

export default {
  title: 'Data Entry/Input',
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, 200px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="please enter text"
    />
    <Input
      placeholder="please enter text"
      disabled
    />
    <Input
      placeholder="please enter text"
      error
    />
    <Input
      placeholder="please enter text"
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
      placeholder="please enter text"
      size="small"
    />
    <Input
      placeholder="please enter text"
      size="medium"
    />
    <Input
      placeholder="please enter text"
      size="large"
    />
    <Input
      placeholder="please enter text"
      size="small"
      disabled
    />
    <Input
      placeholder="please enter text"
      size="medium"
      disabled
    />
    <Input
      placeholder="please enter text"
      size="large"
      disabled
    />
    <Input
      placeholder="please enter text"
      size="small"
      error
    />
    <Input
      placeholder="please enter text"
      size="medium"
      error
    />
    <Input
      placeholder="please enter text"
      size="large"
      error
    />
  </div>
);

export const PrefixSuffix = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 200px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Input
      placeholder="please enter text"
      prefix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="please enter text"
      suffix={<Icon icon={PlusIcon} />}
    />
    <Input
      placeholder="please enter text"
      suffix={<Icon icon={PlusIcon} />}
      disabled
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      size="small"
      clearable
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      size="large"
      clearable
    />
    <Input
      placeholder="search"
      prefix={<Icon icon={SearchIcon} />}
      clearable
    />
    <Input
      placeholder="please enter text"
      prefix={<Icon icon={PlusIcon} />}
      clearable
      error
    />
  </div>
);
