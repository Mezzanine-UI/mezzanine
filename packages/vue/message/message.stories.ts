import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { onUnmounted } from 'vue';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import { message } from './message';
import type { MessageData } from './message.types';

export default {
  title: 'Feedback/Message',
} satisfies Meta<MessageData>;

type Story = StoryObj<MessageData>;

function createRandomNumber(): number {
  return Math.floor(Math.random() ** 7 * 1000000);
}

export const Basic: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    setup: () => {
      onUnmounted(() => message.destroy());

      return {
        addBasic: () =>
          message.add({ children: `基礎訊息：${createRandomNumber()}` }),
        addError: () => message.error(`錯誤訊息：${createRandomNumber()}`),
        addInfo: () => message.info(`資訊訊息：${createRandomNumber()}`),
        addLoading: () => message.loading('資料載入中...'),
        addSuccess: () => message.success(`成功訊息：${createRandomNumber()}`),
        addWarning: () => message.warning(`警告訊息：${createRandomNumber()}`),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
        訊息上限為 4 筆，每筆訊息預設停留 3 秒鐘。 滑鼠懸停於訊息上可暫停計時器。
        <MznButtonGroup orientation="vertical">
          <MznButton variant="base-primary" @click="addBasic">Add</MznButton>
          <MznButton variant="base-primary" @click="addSuccess">Success</MznButton>
          <MznButton variant="base-primary" @click="addWarning">Warning</MznButton>
          <MznButton variant="base-primary" @click="addError">Error</MznButton>
          <MznButton variant="base-primary" @click="addInfo">Info</MznButton>
          <MznButton variant="base-primary" @click="addLoading">
            Loading (不會自動關閉)
          </MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};

export const LoadingUpdate: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    setup: () => {
      onUnmounted(() => message.destroy());

      function handleLoadingSuccess(): void {
        const key = message.loading('正在加載資料...');

        // 模擬 2 秒後加載成功
        setTimeout(() => {
          message.success('資料加載成功！', { key });
        }, 2000);
      }

      function handleLoadingError(): void {
        const key = message.loading('正在處理請求...');

        // 模擬 2 秒後加載失敗
        setTimeout(() => {
          message.error('處理失敗，請稍後再試', { key });
        }, 2000);
      }

      function handleMultipleSteps(): void {
        const key = message.loading('步驟 1/3：準備資料...');

        setTimeout(() => {
          message.loading('步驟 2/3：上傳中...', { key });
        }, 1500);

        setTimeout(() => {
          message.loading('步驟 3/3：處理中...', { key });
        }, 3000);

        setTimeout(() => {
          message.success('所有步驟完成！', { key });
        }, 4500);
      }

      return { handleLoadingError, handleLoadingSuccess, handleMultipleSteps };
    },
    template: `
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 16px">
        <p style="margin: 0">
          Loading 訊息預設不會自動關閉，可以透過相同的 key 更新為
          success/error/info 等其他狀態。 你可以透過儲存回傳 key 達到同樣效果
          (useState, useRef)
        </p>
        <MznButtonGroup orientation="vertical">
          <MznButton variant="base-primary" @click="handleLoadingSuccess">
            Loading → Success (2秒後)
          </MznButton>
          <MznButton variant="base-primary" @click="handleLoadingError">
            Loading → Error (2秒後)
          </MznButton>
          <MznButton variant="base-primary" @click="handleMultipleSteps">
            多步驟更新 (Loading → Loading → Success)
          </MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};
