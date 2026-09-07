import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import MznPageFooter from './page-footer.vue';

export default {
  title: 'Navigation/PageFooter',
  component: MznPageFooter,
} as Meta<typeof MznPageFooter>;

type Story = StoryObj<typeof MznPageFooter>;

export const Basic: Story = {
  args: {},
};

export const StandardType: Story = {
  args: {
    type: 'standard',
    actions: {
      primaryButton: {
        children: '發佈',
      },
      secondaryButton: {
        children: '儲存草稿',
      },
    },
    supportingActionName: '查看發佈紀錄',
    supportingActionOnClick: () => {
      alert('Supporting action clicked!');
    },
    supportingActionType: 'button',
    supportingActionVariant: 'base-ghost',
  },
};

export const OverflowType: Story = {
  args: {
    type: 'overflow',
    actions: {
      primaryButton: {
        children: '發佈',
      },
      secondaryButton: {
        children: '儲存草稿',
      },
    },
    supportingActionIcon: DotHorizontalIcon,
    dropdownProps: {
      options: [
        {
          id: '1',
          name: 'Option 1',
        },
      ],
      onSelect: () => {},
      placement: 'bottom',
    },
  },
};

export const InformationType: Story = {
  args: {
    type: 'information',
    actions: {
      primaryButton: {
        children: '發佈',
      },
      secondaryButton: {
        children: '儲存草稿',
      },
    },
    annotation: '發佈後將無法編輯，請確認內容無誤',
  },
};

export const WithWarningMessage: Story = {
  args: {
    type: 'standard',
    actions: {
      primaryButton: {
        children: '發佈',
      },
      secondaryButton: {
        children: '儲存草稿',
      },
    },
    supportingActionName: '查看發佈紀錄',
    supportingActionType: 'button',
    annotationClassName: 'foo',
    warningMessage: '部分內容未通過驗證，請調整後重試',
  },
};

export const LoadingState: Story = {
  args: {
    type: 'standard',
    actions: {
      primaryButton: {
        children: 'Saving...',
        loading: true,
      },
      secondaryButton: {
        children: 'Cancel',
        disabled: true,
      },
    },
    supportingActionName: '查看說明',
    supportingActionType: 'button',
    warningMessage: 'Please wait while we save your changes',
  },
};

export const DangerAction: Story = {
  args: {
    type: 'information',
    actions: {
      primaryButton: {
        children: 'Delete',
        variant: 'destructive-primary',
      },
      secondaryButton: {
        children: 'Cancel',
      },
    },
    annotation: '此操作將永久刪除資料',
    warningMessage: 'This action cannot be undone',
  },
};
