import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import * as AllIcons from '@mezzanine-ui/icons';
import { IconColor } from '@mezzanine-ui/core/icon';
import { MznIcon } from './icon.component';

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
  decorators: [
    moduleMetadata({
      imports: [MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    icon: {
      control: false,
      description: 'The icon provided by @mezzanine-ui/icons package.',
      table: {
        type: { summary: 'IconDefinition' },
        defaultValue: { summary: '-' },
      },
    },
    color: {
      options: [undefined, ...colors],
      control: { type: 'select' },
      description: 'Color name provided by palette.',
      table: {
        type: { summary: colors.map((c) => `'${c}'`).join(' | ') },
        defaultValue: { summary: '-' },
      },
    },
    size: {
      control: { type: 'number' },
      description: 'Icon size in px.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '-' },
      },
    },
    spin: {
      control: { type: 'boolean' },
      description: 'Whether to spin the icon or not.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Icon accessible title.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '-' },
      },
    },
  },
  args: {
    icon: PlusIcon,
    color: 'neutral',
    size: 16,
    spin: false,
  },
  render: (args) => ({
    props: args,
    template: `<i mznIcon [icon]="icon" [color]="color" [size]="size" [spin]="spin" ></i>`,
  }),
};

export const All: Story = {
  render: () => {
    const iconCategories = [
      {
        name: 'System',
        icons: [
          { name: 'MenuIcon', def: AllIcons.MenuIcon },
          { name: 'MenuOpenIcon', def: AllIcons.MenuOpenIcon },
          { name: 'MenuCloseIcon', def: AllIcons.MenuCloseIcon },
          { name: 'SearchIcon', def: AllIcons.SearchIcon },
          { name: 'SearchHistoryIcon', def: AllIcons.SearchHistoryIcon },
          { name: 'UserIcon', def: AllIcons.UserIcon },
          { name: 'SlashIcon', def: AllIcons.SlashIcon },
          { name: 'FolderIcon', def: AllIcons.FolderIcon },
          { name: 'FolderOpenIcon', def: AllIcons.FolderOpenIcon },
          { name: 'FolderMoveIcon', def: AllIcons.FolderMoveIcon },
          { name: 'FolderAddIcon', def: AllIcons.FolderAddIcon },
          { name: 'CalendarIcon', def: AllIcons.CalendarIcon },
          { name: 'CalendarTimeIcon', def: AllIcons.CalendarTimeIcon },
          { name: 'ClockIcon', def: AllIcons.ClockIcon },
          { name: 'CurrencyDollarIcon', def: AllIcons.CurrencyDollarIcon },
          { name: 'PercentIcon', def: AllIcons.PercentIcon },
          { name: 'LightIcon', def: AllIcons.LightIcon },
          { name: 'DarkIcon', def: AllIcons.DarkIcon },
          { name: 'NotificationIcon', def: AllIcons.NotificationIcon },
          {
            name: 'NotificationUnreadIcon',
            def: AllIcons.NotificationUnreadIcon,
          },
          { name: 'SiderIcon', def: AllIcons.SiderIcon },
          { name: 'HomeIcon', def: AllIcons.HomeIcon },
          { name: 'SpinnerIcon', def: AllIcons.SpinnerIcon },
          { name: 'LoginIcon', def: AllIcons.LoginIcon },
          { name: 'LogoutIcon', def: AllIcons.LogoutIcon },
          { name: 'SaveIcon', def: AllIcons.SaveIcon },
          { name: 'SystemIcon', def: AllIcons.SystemIcon },
        ],
      },
      {
        name: 'Arrow',
        icons: [
          {
            name: 'LongTailArrowRightIcon',
            def: AllIcons.LongTailArrowRightIcon,
          },
          {
            name: 'LongTailArrowLeftIcon',
            def: AllIcons.LongTailArrowLeftIcon,
          },
          { name: 'LongTailArrowUpIcon', def: AllIcons.LongTailArrowUpIcon },
          {
            name: 'LongTailArrowDownIcon',
            def: AllIcons.LongTailArrowDownIcon,
          },
          {
            name: 'ShortTailArrowRightIcon',
            def: AllIcons.ShortTailArrowRightIcon,
          },
          {
            name: 'ShortTailArrowLeftIcon',
            def: AllIcons.ShortTailArrowLeftIcon,
          },
          { name: 'ShortTailArrowUpIcon', def: AllIcons.ShortTailArrowUpIcon },
          {
            name: 'ShortTailArrowDownIcon',
            def: AllIcons.ShortTailArrowDownIcon,
          },
          { name: 'CaretRightIcon', def: AllIcons.CaretRightIcon },
          { name: 'CaretLeftIcon', def: AllIcons.CaretLeftIcon },
          { name: 'CaretUpIcon', def: AllIcons.CaretUpIcon },
          { name: 'CaretDownIcon', def: AllIcons.CaretDownIcon },
          { name: 'CaretUpFlatIcon', def: AllIcons.CaretUpFlatIcon },
          { name: 'CaretDownFlatIcon', def: AllIcons.CaretDownFlatIcon },
          { name: 'CaretVerticalIcon', def: AllIcons.CaretVerticalIcon },
          { name: 'ChevronRightIcon', def: AllIcons.ChevronRightIcon },
          { name: 'ChevronLeftIcon', def: AllIcons.ChevronLeftIcon },
          { name: 'ChevronUpIcon', def: AllIcons.ChevronUpIcon },
          { name: 'ChevronDownIcon', def: AllIcons.ChevronDownIcon },
          { name: 'ChevronVerticalIcon', def: AllIcons.ChevronVerticalIcon },
          {
            name: 'DoubleChevronRightIcon',
            def: AllIcons.DoubleChevronRightIcon,
          },
          {
            name: 'DoubleChevronLeftIcon',
            def: AllIcons.DoubleChevronLeftIcon,
          },
          { name: 'SwitchVerticalIcon', def: AllIcons.SwitchVerticalIcon },
          { name: 'SwitchHorizontalIcon', def: AllIcons.SwitchHorizontalIcon },
          { name: 'ReverseLeftIcon', def: AllIcons.ReverseLeftIcon },
          { name: 'ReverseRightIcon', def: AllIcons.ReverseRightIcon },
        ],
      },
      {
        name: 'Controls',
        icons: [
          { name: 'CloseIcon', def: AllIcons.CloseIcon },
          { name: 'TrashIcon', def: AllIcons.TrashIcon },
          { name: 'SettingIcon', def: AllIcons.SettingIcon },
          { name: 'FilterIcon', def: AllIcons.FilterIcon },
          { name: 'ResetIcon', def: AllIcons.ResetIcon },
          { name: 'RefreshCcwIcon', def: AllIcons.RefreshCcwIcon },
          { name: 'RefreshCwIcon', def: AllIcons.RefreshCwIcon },
          { name: 'EyeIcon', def: AllIcons.EyeIcon },
          { name: 'EyeInvisibleIcon', def: AllIcons.EyeInvisibleIcon },
          { name: 'PlusIcon', def: AllIcons.PlusIcon },
          { name: 'MinusIcon', def: AllIcons.MinusIcon },
          { name: 'CheckedIcon', def: AllIcons.CheckedIcon },
          { name: 'DotVerticalIcon', def: AllIcons.DotVerticalIcon },
          { name: 'DotHorizontalIcon', def: AllIcons.DotHorizontalIcon },
          { name: 'DotGridIcon', def: AllIcons.DotGridIcon },
          { name: 'DotDragVerticalIcon', def: AllIcons.DotDragVerticalIcon },
          {
            name: 'DotDragHorizontalIcon',
            def: AllIcons.DotDragHorizontalIcon,
          },
          { name: 'ZoomInIcon', def: AllIcons.ZoomInIcon },
          { name: 'ZoomOutIcon', def: AllIcons.ZoomOutIcon },
          { name: 'PinIcon', def: AllIcons.PinIcon },
          { name: 'MaximizeIcon', def: AllIcons.MaximizeIcon },
          { name: 'MinimizeIcon', def: AllIcons.MinimizeIcon },
          { name: 'ResizeHandleIcon', def: AllIcons.ResizeHandleIcon },
          { name: 'LockIcon', def: AllIcons.LockIcon },
          { name: 'UnlockIcon', def: AllIcons.UnlockIcon },
        ],
      },
      {
        name: 'Alert',
        icons: [
          { name: 'CheckedFilledIcon', def: AllIcons.CheckedFilledIcon },
          { name: 'CheckedOutlineIcon', def: AllIcons.CheckedOutlineIcon },
          { name: 'ErrorFilledIcon', def: AllIcons.ErrorFilledIcon },
          { name: 'ErrorOutlineIcon', def: AllIcons.ErrorOutlineIcon },
          { name: 'WarningFilledIcon', def: AllIcons.WarningFilledIcon },
          { name: 'WarningOutlineIcon', def: AllIcons.WarningOutlineIcon },
          { name: 'InfoFilledIcon', def: AllIcons.InfoFilledIcon },
          { name: 'InfoOutlineIcon', def: AllIcons.InfoOutlineIcon },
          { name: 'DangerousFilledIcon', def: AllIcons.DangerousFilledIcon },
          { name: 'DangerousOutlineIcon', def: AllIcons.DangerousOutlineIcon },
          { name: 'QuestionFilledIcon', def: AllIcons.QuestionFilledIcon },
          { name: 'QuestionOutlineIcon', def: AllIcons.QuestionOutlineIcon },
        ],
      },
      {
        name: 'Content',
        icons: [
          { name: 'DownloadIcon', def: AllIcons.DownloadIcon },
          { name: 'UploadIcon', def: AllIcons.UploadIcon },
          { name: 'FileIcon', def: AllIcons.FileIcon },
          { name: 'FileSearchIcon', def: AllIcons.FileSearchIcon },
          { name: 'FileAttachmentIcon', def: AllIcons.FileAttachmentIcon },
          { name: 'EditIcon', def: AllIcons.EditIcon },
          { name: 'CopyIcon', def: AllIcons.CopyIcon },
          { name: 'LinkIcon', def: AllIcons.LinkIcon },
          { name: 'ShareIcon', def: AllIcons.ShareIcon },
          { name: 'LinkExternalIcon', def: AllIcons.LinkExternalIcon },
          { name: 'GalleryIcon', def: AllIcons.GalleryIcon },
          { name: 'ListIcon', def: AllIcons.ListIcon },
          { name: 'AlignLeftIcon', def: AllIcons.AlignLeftIcon },
          { name: 'AlignRightIcon', def: AllIcons.AlignRightIcon },
          { name: 'StarOutlineIcon', def: AllIcons.StarOutlineIcon },
          { name: 'StarFilledIcon', def: AllIcons.StarFilledIcon },
          { name: 'BookmarkOutlineIcon', def: AllIcons.BookmarkOutlineIcon },
          { name: 'BookmarkFilledIcon', def: AllIcons.BookmarkFilledIcon },
          { name: 'BookmarkAddIcon', def: AllIcons.BookmarkAddIcon },
          { name: 'BookmarkRemoveIcon', def: AllIcons.BookmarkRemoveIcon },
          { name: 'BookmarkAddedIcon', def: AllIcons.BookmarkAddedIcon },
          { name: 'ImageIcon', def: AllIcons.ImageIcon },
          { name: 'MailIcon', def: AllIcons.MailIcon },
          { name: 'MailUnreadIcon', def: AllIcons.MailUnreadIcon },
          { name: 'BoxIcon', def: AllIcons.BoxIcon },
          { name: 'CameraIcon', def: AllIcons.CameraIcon },
          { name: 'CameraAddIcon', def: AllIcons.CameraAddIcon },
          { name: 'CodeIcon', def: AllIcons.CodeIcon },
          { name: 'NfcIcon', def: AllIcons.NfcIcon },
        ],
      },
      {
        name: 'Stepper',
        icons: [
          { name: 'Item0Icon', def: AllIcons.Item0Icon },
          { name: 'Item1Icon', def: AllIcons.Item1Icon },
          { name: 'Item2Icon', def: AllIcons.Item2Icon },
          { name: 'Item3Icon', def: AllIcons.Item3Icon },
          { name: 'Item4Icon', def: AllIcons.Item4Icon },
          { name: 'Item5Icon', def: AllIcons.Item5Icon },
          { name: 'Item6Icon', def: AllIcons.Item6Icon },
          { name: 'Item7Icon', def: AllIcons.Item7Icon },
          { name: 'Item8Icon', def: AllIcons.Item8Icon },
          { name: 'Item9Icon', def: AllIcons.Item9Icon },
        ],
      },
    ];

    return {
      props: { iconCategories },
      template: `
        <div style="display: flex; flex-direction: column; gap: 36px;">
          @for (category of iconCategories; track category.name) {
            <div>
              <h3 style="margin-bottom: 16px; font-size: 18px; font-weight: 600; color: var(--mzn-color-text-neutral);">
                {{ category.name }} ({{ category.icons.length }})
              </h3>
              <div style="display: flex; flex-flow: row wrap; column-gap: 8px; row-gap: 16px; color: var(--mzn-color-icon-neutral); text-align: center;">
                @for (item of category.icons; track item.name) {
                  <div style="width: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; cursor: pointer;">
                    <i mznIcon [icon]="item.def" [size]="24" ></i>
                    <div style="font-size: 12px; word-break: break-word;">{{ item.name }}</div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      `,
    };
  },
};

export const Colors: Story = {
  render: () => ({
    props: {
      colors,
      icon: CheckedIcon,
    },
    template: `
      <div style="display: flex; flex-flow: row wrap; gap: 24px;">
        @for (color of colors; track color) {
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--mzn-color-text-neutral);">
            <i mznIcon [icon]="icon" [color]="color" [size]="48" ></i>
            <div style="font-size: 16px; word-break: break-word;">{{ color }}</div>
          </div>
        }
      </div>
    `,
  }),
};
