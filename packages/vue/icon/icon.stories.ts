import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import * as AllIcons from '@mezzanine-ui/icons';
import type { IconColor } from '@mezzanine-ui/core/icon';
import MznIcon from './icon.vue';
import type { IconProps } from './icon.types';

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
  component: MznIcon,
} satisfies Meta<typeof MznIcon>;

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
  render: (args) => ({
    components: { MznIcon },
    setup: () => ({ args, PlusIcon }),
    template: '<MznIcon v-bind="args" :icon="PlusIcon" />',
  }),
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
          AllIcons.SaveIcon,
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
          AllIcons.SwitchHorizontalIcon,
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
          AllIcons.MailIcon,
          AllIcons.MailUnreadIcon,
          AllIcons.BoxIcon,
          AllIcons.CameraIcon,
          AllIcons.CameraAddIcon,
          AllIcons.CodeIcon,
          AllIcons.NfcIcon,
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

    /**
     * Authored with `h()` rather than a template on purpose. React's
     * `<h3>{name} ({count})</h3>` emits four separate text nodes; a Vue (or
     * Angular) template merges adjacent interpolations into one, which the
     * DOM differ correctly reports as a mismatch. `h()` gives byte-level
     * control over the children array.
     */
    return () =>
      h(
        'div',
        { style: { display: 'flex', flexDirection: 'column', gap: '36px' } },
        iconCategories.map((category) =>
          h('div', { key: category.name }, [
            h(
              'h3',
              {
                style: {
                  marginBottom: '16px',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--mzn-color-text-neutral)',
                },
              },
              [category.name, ' (', String(category.icons.length), ')'],
            ),
            h(
              'div',
              {
                style: {
                  display: 'flex',
                  flexFlow: 'row wrap',
                  columnGap: '8px',
                  rowGap: '16px',
                  color: 'var(--mzn-color-icon-neutral)',
                  textAlign: 'center',
                },
              },
              category.icons.map((icon) =>
                h(
                  'div',
                  {
                    key: icon.name,
                    style: {
                      width: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    },
                  },
                  [
                    h(MznIcon, { icon, size: 24 }),
                    h(
                      'div',
                      { style: { fontSize: '12px', wordBreak: 'break-word' } },
                      icon.name,
                    ),
                  ],
                ),
              ),
            ),
          ]),
        ),
      );
  },
};

export const Colors: Story = {
  render: () => () =>
    h(
      'div',
      { style: { display: 'flex', flexFlow: 'row wrap', gap: '24px' } },
      colors.map((color) =>
        h(
          'div',
          {
            key: color,
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--mzn-color-text-neutral)',
            },
          },
          [
            h(MznIcon, { icon: CheckedIcon, color, size: 48 }),
            h(
              'div',
              { style: { fontSize: '16px', wordBreak: 'break-word' } },
              color,
            ),
          ],
        ),
      ),
    ),
};
