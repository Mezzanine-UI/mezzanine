import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { CloseIcon, PlusIcon } from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznModal from '../modal/modal.vue';
import MznFloatingButton from './floating-button.vue';

export default {
  title: 'Others/Floating Button',
  component: MznFloatingButton,
} as Meta;

type Story = StoryObj<typeof MznFloatingButton>;

export const Basic: Story = {
  render: () => ({
    components: { MznFloatingButton },
    setup: () => ({ PlusIcon }),
    template: `
      <div style="width: 100%; height: 200vh">
        Scroll down
        <MznFloatingButton :icon="PlusIcon" icon-type="leading">Button</MznFloatingButton>
      </div>
    `,
  }),
};

export const IconOnly: Story = {
  render: () => ({
    components: { MznFloatingButton },
    setup: () => ({ PlusIcon }),
    template: `
      <div style="width: 100%; height: 200vh">
        Scroll down
        <MznFloatingButton :icon="PlusIcon" icon-type="icon-only">加入清單</MznFloatingButton>
      </div>
    `,
  }),
};

export const AutoHideWhenOpen: Story = {
  render: () => ({
    components: { MznButton, MznFloatingButton },
    setup: () => {
      const open = ref(false);

      return { CloseIcon, open };
    },
    template: `
      <div style="width: 100%; height: 200vh; display: flex; flex-flow: row">
        <div style="flex: 1">
          Scroll down
          <MznFloatingButton
            auto-hide-when-open
            :open="open"
            @click="open = !open"
          >Open</MznFloatingButton>
        </div>
        <div
          v-if="open"
          style="width: 250px; height: 100%; background-color: rgba(0,0,0,0.1)"
        >
          <MznButton :icon="CloseIcon" icon-type="icon-only" @click="open = false" />
        </div>
      </div>
    `,
  }),
};

export const WithModal: Story = {
  render: () => ({
    components: { MznFloatingButton, MznModal },
    setup: () => {
      const open = ref(false);

      return { open };
    },
    template: `
      <div style="width: 100%; height: 200vh">
        Scroll down
        <MznFloatingButton :open="open" @click="open = true">Open Modal</MznFloatingButton>
        <MznModal
          modal-type="standard"
          :open="open"
          title="Modal Title"
          show-modal-header
          @close="open = false"
        >
          Modal Content
        </MznModal>
      </div>
    `,
  }),
};
