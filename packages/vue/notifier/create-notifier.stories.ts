import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, onUnmounted, ref } from 'vue';
import MznButton from '../button/button.vue';
import MznButtonGroup from '../button/button-group.vue';
import { createNotifier } from './create-notifier';
import type { NotifierData, NotifierKey } from './notifier.types';

export default {
  title: 'Internal/Notifier',
} as Meta;

type TestNotifierData = NotifierData & {
  reference?: NotifierKey;
};

const Notifier = createNotifier<TestNotifierData>({
  duration: 3000,
  maxCount: 4,
  render: ({ children, reference }) =>
    h(
      'div',
      {
        key: reference,
        style: {
          padding: '12px 16px',
          marginBottom: '8px',
          background: '#1976d2',
          color: 'white',
          borderRadius: '4px',
        },
      },
      // Wrapped in an array because `h`'s children parameter does not accept a
      // bare `VNodeChild`; the rendered DOM is the same.
      [children],
    ),
  setRoot: (root) => {
    root.style.position = 'fixed';
    root.style.top = '16px';
    root.style.right = '16px';
    root.style.zIndex = '9999';
    root.style.minWidth = '300px';
  },
});

export const Common: StoryObj = {
  render: () => ({
    components: { MznButton, MznButtonGroup },
    setup: () => {
      const messageKeys = ref<NotifierKey[]>([]);

      onUnmounted(() => {
        Notifier.destroy();
      });

      function addNotification(): void {
        messageKeys.value = [
          ...messageKeys.value,
          Notifier.add({ children: 'foo' }),
        ];
      }

      function destroyAll(): void {
        Notifier.destroy();
        messageKeys.value = [];
      }

      function removeFirst(): void {
        Notifier.remove(messageKeys.value[0]);
        messageKeys.value = messageKeys.value.slice(1);
      }

      return { addNotification, destroyAll, messageKeys, removeFirst };
    },
    template: `
      <MznButtonGroup style="margin-bottom: 16px">
        <MznButton variant="base-primary" @click="addNotification">
          Add a notification
        </MznButton>
        <MznButton variant="base-primary" @click="destroyAll">
          Destroy all notifications
        </MznButton>
        <MznButton v-if="messageKeys.length" variant="base-primary" @click="removeFirst">
          remove first notification
        </MznButton>
      </MznButtonGroup>
    `,
  }),
};
