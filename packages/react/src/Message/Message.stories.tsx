import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useEffect } from 'react';
import Button, { ButtonGroup } from '../Button';
import Message from '.';

export default {
  title: 'Feedback/Message',
  component: Message,
} as Meta;

type Story = StoryObj<typeof Message>;

function createRandomNumber() {
  return Math.floor(Math.random() ** 7 * 1000000);
}

function BasicExample() {
  useEffect(() => () => Message.destroy(), []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      訊息上限為 4 筆，每筆訊息預設停留 3 秒鐘。 滑鼠懸停於訊息上可暫停計時器。
      <ButtonGroup orientation="vertical">
        <Button
          variant="base-primary"
          onClick={() => {
            Message.add({
              children: `基礎訊息：${createRandomNumber()}`,
            });
          }}
        >
          Add
        </Button>
        <Button
          variant="base-primary"
          onClick={() => {
            Message.success(`成功訊息：${createRandomNumber()}`);
          }}
        >
          Success
        </Button>
        <Button
          variant="base-primary"
          onClick={() => {
            Message.warning(`警告訊息：${createRandomNumber()}`);
          }}
        >
          Warning
        </Button>
        <Button
          variant="base-primary"
          onClick={() => {
            Message.error(`錯誤訊息：${createRandomNumber()}`);
          }}
        >
          Error
        </Button>
        <Button
          variant="base-primary"
          onClick={() => {
            Message.info(`資訊訊息：${createRandomNumber()}`);
          }}
        >
          Info
        </Button>
        <Button
          variant="base-primary"
          onClick={() => {
            Message.loading('資料載入中...');
          }}
        >
          Loading (不會自動關閉)
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicExample />,
};

function LoadingUpdateExample() {
  useEffect(() => () => Message.destroy(), []);

  const handleLoadingSuccess = () => {
    const key = Message.loading('正在加載資料...');

    // 模擬 2 秒後加載成功
    setTimeout(() => {
      Message.success('資料加載成功！', { key });
    }, 2000);
  };

  const handleLoadingError = () => {
    const key = Message.loading('正在處理請求...');

    // 模擬 2 秒後加載失敗
    setTimeout(() => {
      Message.error('處理失敗，請稍後再試', { key });
    }, 2000);
  };

  const handleMultipleSteps = () => {
    const key = Message.loading('步驟 1/3：準備資料...');

    setTimeout(() => {
      Message.loading('步驟 2/3：上傳中...', { key });
    }, 1500);

    setTimeout(() => {
      Message.loading('步驟 3/3：處理中...', { key });
    }, 3000);

    setTimeout(() => {
      Message.success('所有步驟完成！', { key });
    }, 4500);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <p style={{ margin: 0 }}>
        Loading 訊息預設不會自動關閉，可以透過相同的 key 更新為
        success/error/info 等其他狀態。 你可以透過儲存回傳 key 達到同樣效果
        (useState, useRef)
      </p>
      <ButtonGroup orientation="vertical">
        <Button variant="base-primary" onClick={handleLoadingSuccess}>
          Loading → Success (2秒後)
        </Button>
        <Button variant="base-primary" onClick={handleLoadingError}>
          Loading → Error (2秒後)
        </Button>
        <Button variant="base-primary" onClick={handleMultipleSteps}>
          多步驟更新 (Loading → Loading → Success)
        </Button>
      </ButtonGroup>
    </div>
  );
}

export const LoadingUpdate: Story = {
  render: () => <LoadingUpdateExample />,
};
