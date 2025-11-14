import { Meta, StoryObj } from '@storybook/react-webpack5';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import PageFooter from '.';

export default {
  title: 'Navigation/PageFooter',
  component: PageFooter,
} as Meta<typeof PageFooter>;

type Story = StoryObj<typeof PageFooter>;

export const Basic: Story = {
  args: {},
};

export const StandardType: Story = {
  args: {
    type: 'standard',
    actions: {
      primaryButtonProps: {
        children: '發佈',
      },
      secondaryButtonProps: {
        children: '儲存草稿',
      },
    },
    annotation: '查看發佈紀錄',
    onAnnotationClick: () => {
      alert('Annotation button clicked!');
    },
  },
};

export const OverflowType: Story = {
  args: {
    type: 'overflow',
    actions: {
      primaryButtonProps: {
        children: '發佈',
      },
      secondaryButtonProps: {
        children: '儲存草稿',
      },
    },
    /** @TODO dropdown replacement */
    annotation: {
      position: 'icon-only',
      src: DotVerticalIcon,
    },
    onAnnotationClick: () => {
      alert('Overflow button clicked!');
    },
  },
};

export const InformationType: Story = {
  args: {
    type: 'information',
    actions: {
      primaryButtonProps: {
        children: '發佈',
      },
      secondaryButtonProps: {
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
      primaryButtonProps: {
        children: '發佈',
      },
      secondaryButtonProps: {
        children: '儲存草稿',
      },
    },
    annotation: '查看發佈紀錄',
    annotationClassName: 'foo',
    warningMessage: '部分內容未通過驗證，請調整後重試',
  },
};

export const LoadingState: Story = {
  args: {
    type: 'standard',
    actions: {
      primaryButtonProps: {
        children: 'Saving...',
        loading: true,
      },
      secondaryButtonProps: {
        children: 'Cancel',
        disabled: true,
      },
    },
    annotation: '查看說明',
    warningMessage: 'Please wait while we save your changes',
  },
};

export const DangerAction: Story = {
  args: {
    type: 'information',
    actions: {
      primaryButtonProps: {
        children: 'Delete',
        variant: 'destructive-primary',
      },
      secondaryButtonProps: {
        children: 'Cancel',
      },
    },
    annotation: '此操作將永久刪除資料',
    warningMessage: 'This action cannot be undone',
  },
};
