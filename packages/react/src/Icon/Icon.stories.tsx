import { StoryObj, Meta } from '@storybook/react-webpack5';
import * as AllIcons from '@mezzanine-ui/icons';
import Icon, { IconColor, IconProps } from '.';

const { PlusIcon, CheckedIcon } = AllIcons;

const colors: IconColor[] = [
  'inherit',
  'fixed-light',
  'neutral-faint',
  'neutral-light',
  'neutral',
  'neutral-strong',
  'neutral-bold',
  'neutral-solid',
  'brand',
  'brand-strong',
  'brand-solid',
  'error',
  'error-strong',
  'error-solid',
  'warning',
  'warning-strong',
  'success',
  'success-strong',
  'info',
  'info-strong',
];

export default {
  title: 'Foundation/Icon',
  component: Icon,
} satisfies Meta<typeof Icon>;

type Story = StoryObj<IconProps>;

export const Playground: Story = {
  argTypes: {
    color: {
      options: [undefined, ...colors],
      control: {
        type: 'select',
      },
    },
    size: {
      control: {
        type: 'number',
      },
    },
  },
  args: {
    color: 'neutral',
    icon: PlusIcon,
    spin: false,
    size: 16,
  },
  render: ({ ...props }) => <Icon {...props} icon={PlusIcon} />,
};

export const All: Story = {
  render: () => {
    const iconCategories = [
      {
        name: 'System',
        icons: [
          AllIcons.MenuIcon,
          AllIcons.MenuOpenIcon,
          AllIcons.MenuCloseIcon,
          AllIcons.SearchIcon,
          AllIcons.SearchHistoryIcon,
          AllIcons.UserIcon,
          AllIcons.SlashIcon,
          AllIcons.FolderIcon,
          AllIcons.FolderOpenIcon,
          AllIcons.FolderMoveIcon,
          AllIcons.FolderAddIcon,
          AllIcons.CalendarIcon,
          AllIcons.CalendarTimeIcon,
          AllIcons.ClockIcon,
          AllIcons.CurrencyDollarIcon,
          AllIcons.PercentIcon,
          AllIcons.LightIcon,
          AllIcons.DarkIcon,
          AllIcons.NotificationIcon,
          AllIcons.NotificationUnreadIcon,
          AllIcons.SiderIcon,
          AllIcons.HomeIcon,
          AllIcons.SpinnerIcon,
          AllIcons.LoginIcon,
          AllIcons.LogoutIcon,
          AllIcons.SystemIcon,
        ],
      },
      {
        name: 'Arrow',
        icons: [
          AllIcons.LongTailArrowRightIcon,
          AllIcons.LongTailArrowLeftIcon,
          AllIcons.LongTailArrowUpIcon,
          AllIcons.LongTailArrowDownIcon,
          AllIcons.ShortTailArrowRightIcon,
          AllIcons.ShortTailArrowLeftIcon,
          AllIcons.ShortTailArrowUpIcon,
          AllIcons.ShortTailArrowDownIcon,
          AllIcons.CaretRightIcon,
          AllIcons.CaretLeftIcon,
          AllIcons.CaretUpIcon,
          AllIcons.CaretDownIcon,
          AllIcons.CaretUpFlatIcon,
          AllIcons.CaretDownFlatIcon,
          AllIcons.CaretVerticalIcon,
          AllIcons.ChevronRightIcon,
          AllIcons.ChevronLeftIcon,
          AllIcons.ChevronUpIcon,
          AllIcons.ChevronDownIcon,
          AllIcons.ChevronVerticalIcon,
          AllIcons.DoubleChevronRightIcon,
          AllIcons.DoubleChevronLeftIcon,
          AllIcons.SwitchVerticalIcon,
          AllIcons.ReverseLeftIcon,
          AllIcons.ReverseRightIcon,
        ],
      },
      {
        name: 'Controls',
        icons: [
          AllIcons.CloseIcon,
          AllIcons.TrashIcon,
          AllIcons.SettingIcon,
          AllIcons.FilterIcon,
          AllIcons.ResetIcon,
          AllIcons.RefreshCcwIcon,
          AllIcons.RefreshCwIcon,
          AllIcons.EyeIcon,
          AllIcons.EyeInvisibleIcon,
          AllIcons.PlusIcon,
          AllIcons.MinusIcon,
          AllIcons.CheckedIcon,
          AllIcons.DotVerticalIcon,
          AllIcons.DotHorizontalIcon,
          AllIcons.DotGridIcon,
          AllIcons.DotDragVerticalIcon,
          AllIcons.DotDragHorizontalIcon,
          AllIcons.ZoomInIcon,
          AllIcons.ZoomOutIcon,
          AllIcons.PinIcon,
          AllIcons.MaximizeIcon,
          AllIcons.MinimizeIcon,
          AllIcons.ResizeHandleIcon,
          AllIcons.LockIcon,
          AllIcons.UnlockIcon,
        ],
      },
      {
        name: 'Alert',
        icons: [
          AllIcons.CheckedFilledIcon,
          AllIcons.CheckedOutlineIcon,
          AllIcons.ErrorFilledIcon,
          AllIcons.ErrorOutlineIcon,
          AllIcons.WarningFilledIcon,
          AllIcons.WarningOutlineIcon,
          AllIcons.InfoFilledIcon,
          AllIcons.InfoOutlineIcon,
          AllIcons.DangerousFilledIcon,
          AllIcons.DangerousOutlineIcon,
          AllIcons.QuestionFilledIcon,
          AllIcons.QuestionOutlineIcon,
        ],
      },
      {
        name: 'Content',
        icons: [
          AllIcons.DownloadIcon,
          AllIcons.UploadIcon,
          AllIcons.FileIcon,
          AllIcons.FileSearchIcon,
          AllIcons.FileAttachmentIcon,
          AllIcons.EditIcon,
          AllIcons.CopyIcon,
          AllIcons.LinkIcon,
          AllIcons.ShareIcon,
          AllIcons.LinkExternalIcon,
          AllIcons.GalleryIcon,
          AllIcons.ListIcon,
          AllIcons.AlignLeftIcon,
          AllIcons.AlignRightIcon,
          AllIcons.StarOutlineIcon,
          AllIcons.StarFilledIcon,
          AllIcons.BookmarkOutlineIcon,
          AllIcons.BookmarkFilledIcon,
          AllIcons.BookmarkAddIcon,
          AllIcons.BookmarkRemoveIcon,
          AllIcons.BookmarkAddedIcon,
          AllIcons.ImageIcon,
          AllIcons.BoxIcon,
          AllIcons.CodeIcon,
        ],
      },
      {
        name: 'Stepper',
        icons: [
          AllIcons.Item0Icon,
          AllIcons.Item1Icon,
          AllIcons.Item2Icon,
          AllIcons.Item3Icon,
          AllIcons.Item4Icon,
          AllIcons.Item5Icon,
          AllIcons.Item6Icon,
          AllIcons.Item7Icon,
          AllIcons.Item8Icon,
          AllIcons.Item9Icon,
        ],
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        {iconCategories.map((category) => (
          <div key={category.name}>
            <h3
              style={{
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--mzn-color-text-neutral)',
              }}
            >
              {category.name} ({category.icons.length})
            </h3>
            <div
              style={{
                display: 'flex',
                flexFlow: 'row wrap',
                columnGap: '8px',
                rowGap: '16px',
                color: 'var(--mzn-color-icon-neutral)',
                textAlign: 'center',
              }}
            >
              {category.icons.map((icon) => (
                <div
                  key={icon.name}
                  style={{
                    width: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <Icon icon={icon} size={24} />
                  <div style={{ fontSize: 12, wordBreak: 'break-word' }}>
                    {icon.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Colors: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row wrap',
        gap: '24px',
      }}
    >
      {colors.map((color) => (
        <div
          key={color}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--mzn-color-text-neutral)',
          }}
        >
          <Icon icon={CheckedIcon} color={color} size={48} />
          <div style={{ fontSize: 16, wordBreak: 'break-word' }}>{color}</div>
        </div>
      ))}
    </div>
  ),
};
