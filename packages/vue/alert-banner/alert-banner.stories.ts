import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { onUnmounted } from 'vue';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import { alertBanner } from './alert-banner';
import MznAlertBanner from './alert-banner.vue';

function formatMessage(content: string): string {
  const now = new Date();
  const pad = (value: number): string => value.toString().padStart(2, '0');
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return `${content} (${date} ${time})`;
}

export default {
  title: 'Feedback/Alert Banner',
} as Meta;

type Story = StoryObj;

const infoActions = [
  {
    content: '了解更多',
    onClick: () => {
      console.warn('on click:了解更多');
    },
  },
];

const warningActions = [
  {
    content: '查看詳情',
    onClick: () => {
      console.warn('on click:查看詳情');
    },
  },
  {
    content: '忽略',
    onClick: () => {
      console.warn('on click:忽略');
    },
  },
];

const errorActions = [
  {
    content: '重試',
    onClick: () => {
      console.warn('on click:重試');
    },
  },
  {
    content: '取消',
    onClick: () => {
      console.warn('on click:取消');
    },
  },
];

export const Info: Story = {
  render: () => ({
    components: { MznAlertBanner, MznButton },
    setup: () => {
      onUnmounted(() => alertBanner.destroy());

      return {
        actions: infoActions,
        handleAdd: () =>
          alertBanner.info('傳達一般提示、系統狀態或輔助性資訊。', {
            actions: infoActions,
          }),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
        <MznAlertBanner
          :actions="actions"
          message="傳達一般提示、系統狀態或輔助性資訊。"
          severity="info"
        />
        <MznButton variant="base-primary" @click="handleAdd">
          新增 Info AlertBanner
        </MznButton>
      </div>
    `,
  }),
};

export const Warning: Story = {
  render: () => ({
    components: { MznAlertBanner, MznButton },
    setup: () => {
      onUnmounted(() => alertBanner.destroy());

      return {
        actions: warningActions,
        handleAdd: () =>
          alertBanner.warning('提醒潛在風險或需要注意的情況。', {
            actions: warningActions,
          }),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
        <MznAlertBanner
          :actions="actions"
          message="您的帳號即將到期，部分功能將在期限屆滿後暫時停用。為確保服務不中斷，請於到期日前完成續約或更新付款資訊。"
          severity="warning"
        />
        <MznButton variant="base-primary" @click="handleAdd">
          新增 Warning AlertBanner
        </MznButton>
      </div>
    `,
  }),
};

export const Error: Story = {
  render: () => ({
    components: { MznAlertBanner, MznButton },
    setup: () => {
      onUnmounted(() => alertBanner.destroy());

      return {
        actions: errorActions,
        handleAdd: () =>
          alertBanner.error('傳達錯誤、失敗或需立即處理的問題。', {
            actions: errorActions,
          }),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
        <MznAlertBanner
          :actions="actions"
          message="傳達錯誤、失敗或需立即處理的問題。"
          severity="error"
        />
        <MznButton variant="base-primary" @click="handleAdd">
          新增 Error AlertBanner
        </MznButton>
      </div>
    `,
  }),
};

export const Interactive: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    setup: () => {
      onUnmounted(() => alertBanner.destroy());

      return {
        handleDestroy: () => alertBanner.destroy(),
        handleError: () =>
          alertBanner.error(
            formatMessage('傳達錯誤、失敗或需立即處理的問題。'),
          ),
        handleInfo: () =>
          alertBanner.info(
            formatMessage('傳達一般提示、系統狀態或輔助性資訊。'),
          ),
        handleWarning: () =>
          alertBanner.warning(formatMessage('提醒潛在風險或需要注意的情況。')),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
        <MznButtonGroup orientation="vertical">
          <MznButton variant="base-primary" @click="handleInfo">
            新增 Info AlertBanner
          </MznButton>
          <MznButton variant="base-primary" @click="handleWarning">
            新增 Warning AlertBanner
          </MznButton>
          <MznButton variant="base-primary" @click="handleError">
            新增 Error AlertBanner
          </MznButton>
          <MznButton variant="base-primary" @click="handleDestroy">
            清除所有 AlertBanner
          </MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};

export const WithActions: Story = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    setup: () => {
      onUnmounted(() => alertBanner.destroy());

      return {
        handleDestroy: () => alertBanner.destroy(),
        handleErrorWithActions: () =>
          alertBanner.error(
            formatMessage('傳達錯誤、失敗或需立即處理的問題。'),
            {
              actions: errorActions,
              onClose: () => {
                console.warn('on close: Error AlertBanner');
              },
            },
          ),
        handleInfoWithActions: () =>
          alertBanner.info(
            formatMessage('傳達一般提示、系統狀態或輔助性資訊。'),
            {
              actions: [
                {
                  content: '檢視紀錄',
                  onClick: () => {
                    console.warn('on click:檢視紀錄');
                  },
                },
                {
                  content: '瞭解更多',
                  onClick: () => {
                    console.warn('on click:瞭解更多');
                  },
                },
              ],
              onClose: () => {
                console.warn('on close: Info AlertBanner');
              },
            },
          ),
        handleWarningWithActions: () =>
          alertBanner.warning(formatMessage('提醒潛在風險或需要注意的情況。'), {
            actions: warningActions,
            onClose: () => {
              console.warn('on close: Warning AlertBanner');
            },
          }),
      };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
        <MznButtonGroup orientation="vertical">
          <MznButton variant="base-primary" @click="handleInfoWithActions">
            新增 Info AlertBanner (1 個 action)
          </MznButton>
          <MznButton variant="base-primary" @click="handleWarningWithActions">
            新增 Warning AlertBanner (2 個 actions)
          </MznButton>
          <MznButton variant="base-primary" @click="handleErrorWithActions">
            新增 Error AlertBanner (2 個 actions)
          </MznButton>
          <MznButton variant="base-primary" @click="handleDestroy">
            清除所有 AlertBanner
          </MznButton>
        </MznButtonGroup>
      </div>
    `,
  }),
};
