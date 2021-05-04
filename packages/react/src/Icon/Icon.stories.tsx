import { Story, Meta } from '@storybook/react';
import {
  ArrowRightIcon,
  CalendarIcon,
  CheckCircleFilledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DollarIcon,
  DownloadIcon,
  ExclamationCircleFilledIcon,
  EyeIcon,
  EyeSlashIcon,
  FolderOpenIcon,
  InfoCircleFilledIcon,
  MinusCircleFilledIcon,
  MoreHorizontalIcon,
  MoreVerticalIcon,
  PlusIcon,
  ResetIcon,
  SearchIcon,
  SpinnerIcon,
  TimesCircleFilledIcon,
  TimesIcon,
  UploadIcon,
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
  title: 'General/Icon',
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
    ArrowRightIcon,
    CalendarIcon,
    CheckIcon,
    CheckCircleFilledIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DollarIcon,
    DownloadIcon,
    ExclamationCircleFilledIcon,
    EyeIcon,
    EyeSlashIcon,
    FolderOpenIcon,
    InfoCircleFilledIcon,
    MinusCircleFilledIcon,
    MoreHorizontalIcon,
    MoreVerticalIcon,
    PlusIcon,
    ResetIcon,
    SearchIcon,
    SpinnerIcon,
    TimesIcon,
    TimesCircleFilledIcon,
    UploadIcon,
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
