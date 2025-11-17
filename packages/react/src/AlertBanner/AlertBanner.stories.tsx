import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useCallback, useEffect } from 'react';
import AlertBanner from '.';
import Button, { ButtonGroup } from '../Button';

function formatMessage(content: string) {
  const now = new Date();
  const pad = (value: number) => value.toString().padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return `${content} (${date} ${time})`;
}

export default {
  title: 'Feedback/Alert Banner',
} as Meta;

type Story = StoryObj;

function InfoExample() {
  useEffect(() => () => AlertBanner.destroy(), []);

  const handleAdd = useCallback(() => {
    AlertBanner.info('傳達一般提示、系統狀態或輔助性資訊。', {
      actions: [
        {
          content: '了解更多',
          onClick: () => {
            console.warn('on click:了解更多')
          },
        },
      ],
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <AlertBanner
        actions={[
          {
            content: '了解更多',
            onClick: () => {
              console.warn('on click:了解更多')
            },
          },
        ]}
        message="傳達一般提示、系統狀態或輔助性資訊。"
        severity="info"
      />
      <Button variant="base-primary" onClick={handleAdd}>
        新增 Info AlertBanner
      </Button>
    </div>
  );
}

export const Info: Story = {
  render: () => <InfoExample />,
};

function WarningExample() {
  useEffect(() => () => AlertBanner.destroy(), []);

  const handleAdd = useCallback(() => {
    AlertBanner.warning('提醒潛在風險或需要注意的情況。', {
      actions: [
        {
          content: '查看詳情',
          onClick: () => {
            console.warn('on click:查看詳情')
          },
        },
        {
          content: '忽略',
          onClick: () => {
            console.warn('on click:忽略')
          },
        },
      ],
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <AlertBanner
        actions={[
          {
            content: '查看詳情',
            onClick: () => {
              console.warn('on click:查看詳情')
            },
          },
          {
            content: '忽略',
            onClick: () => {
              console.warn('on click:忽略')
            },
          },
        ]}
        message="您的帳號即將到期，部分功能將在期限屆滿後暫時停用。為確保服務不中斷，請於到期日前完成續約或更新付款資訊。"
        severity="warning"
      />
      <Button variant="base-primary" onClick={handleAdd}>
        新增 Warning AlertBanner
      </Button>
    </div>
  );
}

export const Warning: Story = {
  render: () => <WarningExample />,
};

function ErrorExample() {
  useEffect(() => () => AlertBanner.destroy(), []);

  const handleAdd = useCallback(() => {
    AlertBanner.error('傳達錯誤、失敗或需立即處理的問題。', {
      actions: [
        {
          content: '重試',
          onClick: () => {
            console.warn('on click:重試')
          },
        },
        {
          content: '取消',
          onClick: () => {
            console.warn('on click:取消')
          },
        },
      ],
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <AlertBanner
        actions={[
          {
            content: '重試',
            onClick: () => {
              console.warn('on click:重試')
            },
          },
          {
            content: '取消',
            onClick: () => {
              console.warn('on click:取消')
            },
          },
        ]}
        message="傳達錯誤、失敗或需立即處理的問題。"
        severity="error"
      />
      <Button variant="base-primary" onClick={handleAdd}>
        新增 Error AlertBanner
      </Button>
    </div>
  );
}

export const Error: Story = {
  render: () => <ErrorExample />,
};

function InteractiveExample() {
  useEffect(() => () => AlertBanner.destroy(), []);

  const handleInfo = useCallback(() => {
    AlertBanner.info(formatMessage('傳達一般提示、系統狀態或輔助性資訊。'));
  }, []);

  const handleWarning = useCallback(() => {
    AlertBanner.warning(formatMessage('提醒潛在風險或需要注意的情況。'));
  }, []);

  const handleError = useCallback(() => {
    AlertBanner.error(formatMessage('傳達錯誤、失敗或需立即處理的問題。'));
  }, []);

  const handleDestroy = useCallback(() => {
    AlertBanner.destroy();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <ButtonGroup orientation="vertical">
        <Button variant="base-primary" onClick={handleInfo}>
          新增 Info AlertBanner
        </Button>
        <Button variant="base-primary" onClick={handleWarning}>
          新增 Warning AlertBanner
        </Button>
        <Button variant="base-primary" onClick={handleError}>
          新增 Error AlertBanner
        </Button>
        <Button variant="base-primary" onClick={handleDestroy}>
          清除所有 AlertBanner
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

function ActionsExample() {
  useEffect(() => () => AlertBanner.destroy(), []);

  const handleInfoWithActions = useCallback(() => {
    AlertBanner.info(formatMessage('傳達一般提示、系統狀態或輔助性資訊。'), {
      actions: [
        {
          content: '檢視紀錄',
          onClick: () => {
            console.warn('on click:檢視紀錄')
          },
        },
        {
          content: '瞭解更多',
          onClick: () => {
            console.warn('on click:瞭解更多')
          },
        },
      ],
      onClose: () => {
        console.warn('on close: Info AlertBanner')
      },
    });
  }, []);

  const handleDestroy = useCallback(() => {
    AlertBanner.destroy();
  }, []);

  const handleWarningWithActions = useCallback(() => {
    AlertBanner.warning(formatMessage('提醒潛在風險或需要注意的情況。'), {
      actions: [
        {
          content: '查看詳情',
          onClick: () => {
            console.warn('on click:查看詳情')
          },
        },
        {
          content: '忽略',
          onClick: () => {
            console.warn('on click:忽略')
          },
        },
      ],
      onClose: () => {
        console.warn('on close: Warning AlertBanner')
      },
    });
  }, []);

  const handleErrorWithActions = useCallback(() => {
    AlertBanner.error(formatMessage('傳達錯誤、失敗或需立即處理的問題。'), {
      actions: [
        {
          content: '重試',
          onClick: () => {
            console.warn('on click:重試')
          },
        },
        {
          content: '取消',
          onClick: () => {
            console.warn('on click:取消')
          },
        },
      ],
      onClose: () => {
        console.warn('on close: Error AlertBanner')
      },
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <ButtonGroup orientation="vertical">
        <Button variant="base-primary" onClick={handleInfoWithActions}>
          新增 Info AlertBanner (1 個 action)
        </Button>
        <Button variant="base-primary" onClick={handleWarningWithActions}>
          新增 Warning AlertBanner (2 個 actions)
        </Button>
        <Button variant="base-primary" onClick={handleErrorWithActions}>
          新增 Error AlertBanner (2 個 actions)
        </Button>
        <Button variant="base-primary" onClick={handleDestroy}>
          清除所有 AlertBanner
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const WithActions: Story = {
  render: () => <ActionsExample />,
};
