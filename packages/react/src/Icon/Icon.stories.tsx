import { Story, Meta } from '@storybook/react';
import {
  ArrowRightIcon,
  CalendarIcon,
  CaretRightIcon,
  CheckCircleFilledIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClockIcon,
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
  PercentIcon,
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
  size: {
    control: {
      type: 'number',
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
    CaretRightIcon,
    CheckIcon,
    CheckCircleFilledIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
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
    PercentIcon,
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
        textAlign: 'center',
      }}
    >
      {icons.map((icon) => (
        <div key={icon.name}>
          <Icon icon={icon} size={48} />
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
    }}
  >
    {colors.map((color) => (
      <Icon
        key={color}
        icon={CheckIcon}
        color={color}
        size={48}
      />
    ))}
  </div>
);
