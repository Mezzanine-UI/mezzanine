import { Story, Meta } from '@storybook/react';
import {
  CheckIcon,
  CheckCircleFilledIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ExclamationCircleFilledIcon,
  EyeIcon,
  EyeSlashIcon,
  InfoCircleFilledIcon,
  PlusIcon,
  SearchIcon,
  SpinnerIcon,
  TimesIcon,
  TimesCircleFilledIcon,
  FolderOpenIcon,
} from '@mezzanine-ui/icons';
import Icon, { IconColor, IconProps } from '.';

const colors: IconColor[] = [
  'inherit',
  'primary',
  'secondary',
  'error',
  'warning',
  'success',
  'disabled',
];

export default {
  title: 'Basic/Icon',
} as Meta;

export const Playgroud: Story<IconProps> = ({ children, ...props }) => (
  <Icon {...props} icon={PlusIcon} />
);

Playgroud.args = {
  icon: PlusIcon,
  spin: false,
};
Playgroud.argTypes = {
  color: {
    control: {
      type: 'select',
      options: [undefined, ...colors],
    },
  },
};

interface AllStoryArgs {
  search: string;
}

export const All: Story<AllStoryArgs> = ({ search }) => {
  const icons = [
    CheckIcon,
    CheckCircleFilledIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ExclamationCircleFilledIcon,
    EyeIcon,
    EyeSlashIcon,
    InfoCircleFilledIcon,
    PlusIcon,
    SearchIcon,
    SpinnerIcon,
    TimesIcon,
    TimesCircleFilledIcon,
    FolderOpenIcon,
  ].filter((icon) => !search || icon.name.includes(search));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: '16px',
        color: 'var(--mzn-color-action-inactive)',
        fontSize: 48,
        textAlign: 'center',
      }}
    >
      {icons.map((icon) => (
        <div key={icon.name}>
          <Icon icon={icon} />
          <div style={{ fontSize: 20 }}>{icon.name}</div>
        </div>
      ))}
    </div>
  );
};

All.args = {
  search: '',
};

export const Colors = () => (
  <div
    style={{
      color: 'var(--mzn-color-action-inactive)',
      fontSize: 48,
    }}
  >
    {colors.map((color) => (
      <Icon
        key={color}
        icon={CheckIcon}
        color={color}
      />
    ))}
  </div>
);
