import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, ref, shallowRef } from 'vue';
import type { FunctionalComponent } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import MznButton from '../button/button.vue';
import MznDrawer from '../drawer/drawer.vue';
import MznModal from '../modal/modal.vue';
import MznSpin from '../spin/spin.vue';
import MznSelect from '../select/select.vue';
import type { SelectValue } from '../select/select.types';
import MznTypography from '../typography/typography.vue';
import MznBackdrop from './backdrop.vue';

export default {
  title: 'Others/Backdrop',
  component: MznBackdrop,
} as Meta<typeof MznBackdrop>;

type Story = StoryObj<typeof MznBackdrop>;

/**
 * React renders `A{value}B` as separate text nodes; a Vue template merges the
 * text and the interpolations into one, so the parts are handed over as an
 * array.
 */
const TextParts: FunctionalComponent<{ parts: (number | string)[] }> = (
  props,
) => props.parts.map((part) => String(part));

const DarkVariantStory = defineComponent({
  components: { MznBackdrop, MznButton, MznTypography, TextParts },
  setup() {
    const open = ref(false);

    return { open };
  },
  template: `
    <div style="margin-bottom: 16px">
      <MznTypography color="text-neutral" variant="body">
        📌 Try scrolling the page before and after opening the backdrop to
        see the scroll lock in action!
      </MznTypography>
    </div>
    <MznButton variant="base-primary" @click="open = true">
      Open Dark Backdrop
    </MznButton>
    <!-- Add content to make page scrollable -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px"
    >
      <div
        v-for="i in 20"
        :key="i"
        style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px"
      >
        <MznTypography variant="body">
          <TextParts
            :parts="[
              'Scrollable content item ',
              i,
              ' - This page has enough content to scroll. When the backdrop opens, scrolling will be locked.',
            ]"
          />
        </MznTypography>
      </div>
    </div>
    <MznBackdrop
      :open="open"
      variant="dark"
      @backdrop-click="open = false"
      @close="open = false"
    >
      <div
        v-if="open"
        style="background: var(--mzn-color-background-base); border-radius: 8px; display: flex; flex-direction: column; gap: 16px; margin: auto; max-width: 400px; padding: 24px; position: relative; top: 50%; transform: translateY(-50%)"
      >
        <MznTypography color="text-brand" variant="h3">
          Dark Variant Modal
        </MznTypography>
        <MznTypography variant="body">
          This is a modal with dark backdrop. Notice the background page
          cannot be scrolled while this is open. Click outside or the
          button to close.
        </MznTypography>
        <MznButton variant="base-primary" @click="open = false">
          Close
        </MznButton>
      </div>
    </MznBackdrop>
  `,
});

export const DarkVariant: Story = {
  render: () => ({
    components: { DarkVariantStory },
    template: '<DarkVariantStory />',
  }),
};

const LightVariantStory = defineComponent({
  components: { MznBackdrop, MznButton, MznSpin, MznTypography, TextParts },
  setup() {
    const open = ref(false);

    return { open };
  },
  template: `
    <div style="margin-bottom: 16px">
      <MznTypography color="text-neutral" variant="body">
        💡 Light variant is commonly used for loading states (like Spin
        component)
      </MznTypography>
    </div>
    <MznButton variant="base-primary" @click="open = true">
      Open Light Backdrop
    </MznButton>
    <!-- Add content to make page scrollable -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px"
    >
      <div
        v-for="i in 15"
        :key="i"
        style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px"
      >
        <MznTypography variant="body">
          <TextParts
            :parts="[
              'Scrollable content item ',
              i,
              ' - Background scroll is locked when backdrop is open.',
            ]"
          />
        </MznTypography>
      </div>
    </div>
    <MznBackdrop
      :open="open"
      variant="light"
      @backdrop-click="open = false"
      @close="open = false"
    >
      <div
        v-if="open"
        style="align-items: center; display: flex; flex-direction: column; gap: 24px; justify-content: center"
      >
        <MznSpin loading />
        <div
          style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center"
        >
          <MznTypography color="text-brand" variant="h3">
            Light Variant Loading
          </MznTypography>
          <MznTypography
            style="margin-top: 8px"
            color="text-neutral"
            variant="body"
          >
            Perfect for loading overlays and component-level blocking
            states
          </MznTypography>
        </div>
        <MznButton variant="base-primary" @click="open = false">
          Close
        </MznButton>
      </div>
    </MznBackdrop>
  `,
});

export const LightVariant: Story = {
  render: () => ({
    components: { LightVariantStory },
    template: '<LightVariantStory />',
  }),
};

const CustomContainerStory = defineComponent({
  components: { MznBackdrop, MznButton, MznTypography },
  setup() {
    const open = ref(false);
    const container = shallowRef<HTMLElement | null>(null);

    const setContainer = (element: unknown): void => {
      container.value = (element as HTMLElement | null) ?? null;
    };

    return { container, open, setContainer };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px">
      <MznButton variant="base-primary" @click="open = true">
        Open Backdrop in Container
      </MznButton>
      <div
        :ref="setContainer"
        style="background: var(--mzn-color-background-base); border: 2px dashed var(--mzn-color-border-neutral); border-radius: 8px; min-height: 300px; padding: 16px; position: relative; width: 100%"
      >
        <div style="padding: 24px">
          <MznTypography variant="body">
            Container Element (Backdrop will be rendered inside this)
          </MznTypography>
        </div>
        <MznBackdrop
          :container="container"
          :open="open"
          variant="dark"
          @backdrop-click="open = false"
        >
          <div
            v-if="open"
            style="align-items: center; display: flex; flex-direction: column; gap: 16px; justify-content: center"
          >
            <div
              style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center"
            >
              <MznTypography color="text-brand" variant="h3">
                Container Backdrop
              </MznTypography>
              <MznTypography
                style="margin-top: 8px"
                color="text-neutral"
                variant="body"
              >
                This overlay is scoped to the container element above
              </MznTypography>
            </div>
            <MznButton variant="base-primary" @click="open = false">
              Close
            </MznButton>
          </div>
        </MznBackdrop>
      </div>
    </div>
  `,
});

export const CustomContainer: Story = {
  render: () => ({
    components: { CustomContainerStory },
    template: '<CustomContainerStory />',
  }),
};

const DisableScrollLockStory = defineComponent({
  components: { MznBackdrop, MznButton, MznTypography, TextParts },
  setup() {
    const open = ref(false);

    return { open };
  },
  template: `
    <div style="margin-bottom: 16px">
      <MznTypography color="text-neutral" variant="body">
        ⚠️ With disableScrollLock=true, you can still scroll the background
        page
      </MznTypography>
    </div>
    <MznButton variant="base-primary" @click="open = true">
      Open Without Scroll Lock
    </MznButton>
    <!-- Add content to make page scrollable -->
    <div
      style="display: flex; flex-direction: column; gap: 16px; margin-top: 24px"
    >
      <div
        v-for="i in 20"
        :key="i"
        style="background: var(--mzn-color-background-neutral-faint); border-radius: 8px; padding: 16px"
      >
        <MznTypography variant="body">
          <TextParts
            :parts="[
              'Scrollable content item ',
              i,
              ' - You can scroll this even when backdrop is open!',
            ]"
          />
        </MznTypography>
      </div>
    </div>
    <MznBackdrop
      disable-scroll-lock
      :open="open"
      variant="dark"
      @backdrop-click="open = false"
      @close="open = false"
    >
      <div
        v-if="open"
        style="background: var(--mzn-color-background-base); border-radius: 8px; display: flex; flex-direction: column; gap: 16px; margin: auto; max-width: 400px; padding: 24px; position: relative; top: 50%; transform: translateY(-50%)"
      >
        <MznTypography color="text-brand" variant="h3">
          Scroll Lock Disabled
        </MznTypography>
        <MznTypography variant="body">
          Try scrolling the page - it still works! This is useful for
          scenarios where you want to allow background interaction.
        </MznTypography>
        <MznButton variant="base-primary" @click="open = false">
          Close
        </MznButton>
      </div>
    </MznBackdrop>
  `,
});

export const DisableScrollLock: Story = {
  render: () => ({
    components: { DisableScrollLockStory },
    template: '<DisableScrollLockStory />',
  }),
};

const DisablePortalStory = defineComponent({
  components: { MznBackdrop, MznButton, MznTypography },
  setup() {
    const open = ref(false);

    return { open };
  },
  template: `
    <div style="display: flex; flex-direction: column; gap: 16px">
      <MznButton variant="base-primary" @click="open = true">
        Toggle Backdrop (No Portal)
      </MznButton>
      <div
        style="background: var(--mzn-color-background-base); border: 2px dashed var(--mzn-color-border-neutral); border-radius: 8px; height: 300px; overflow: hidden; padding: 16px; position: relative; width: 100%"
      >
        <MznTypography variant="body">
          Parent Element (overflow: hidden)
        </MznTypography>
        <MznBackdrop
          disable-portal
          :open="open"
          variant="dark"
          @backdrop-click="open = false"
        >
          <div
            v-if="open"
            style="align-items: center; display: flex; flex-direction: column; gap: 16px; justify-content: center"
          >
            <div
              style="background: var(--mzn-color-background-base); border-radius: 8px; padding: 24px; text-align: center"
            >
              <MznTypography color="text-brand" variant="h3">
                No Portal
              </MznTypography>
              <MznTypography
                style="margin-top: 8px"
                color="text-neutral"
                variant="body"
              >
                Rendered in normal DOM flow, respects parent overflow
              </MznTypography>
            </div>
            <MznButton variant="base-primary" @click="open = false">
              Close
            </MznButton>
          </div>
        </MznBackdrop>
      </div>
    </div>
  `,
});

export const DisablePortal: Story = {
  render: () => ({
    components: { DisablePortalStory },
    template: '<DisablePortalStory />',
  }),
};

const DrawerModalSelectLayeringStory = defineComponent({
  components: { MznButton, MznDrawer, MznModal, MznSelect },
  setup() {
    const drawerOpen = ref(false);
    const modalOpen = ref(false);
    const selectValue = shallowRef<SelectValue | null>(null);

    const options: DropdownOption[] = [
      { id: '1', name: 'Option 1' },
      { id: '2', name: 'Option 2' },
      { id: '3', name: 'Option 3' },
      { id: '4', name: 'Option 4' },
      { id: '5', name: 'Option 5' },
    ];

    const handleDrawerClose = (): void => {
      drawerOpen.value = false;
      modalOpen.value = false;
    };

    const handleChange = (value: SelectValue[] | SelectValue | null): void => {
      selectValue.value = value as SelectValue | null;
    };

    return {
      drawerOpen,
      handleChange,
      handleDrawerClose,
      modalOpen,
      options,
      selectValue,
    };
  },
  template: `
    <MznButton variant="base-primary" @click="drawerOpen = true">
      Open Drawer
    </MznButton>
    <MznDrawer
      header-title="Drawer"
      is-header-display
      :open="drawerOpen"
      size="medium"
      @close="handleDrawerClose"
    >
      <div style="padding: 16px">
        <MznButton variant="base-primary" @click="modalOpen = true">
          Open Modal
        </MznButton>
      </div>
    </MznDrawer>
    <MznModal
      confirm-text="OK"
      cancel-text="Cancel"
      modal-type="standard"
      :open="modalOpen"
      show-dismiss-button
      show-modal-footer
      show-modal-header
      size="regular"
      title="Modal with Select"
      @cancel="modalOpen = false"
      @close="modalOpen = false"
      @confirm="modalOpen = false"
    >
      <MznSelect
        full-width
        :options="options"
        placeholder="Select an option"
        :value="selectValue"
        @change="handleChange"
      />
    </MznModal>
  `,
});

export const DrawerModalSelectLayering: Story = {
  render: () => ({
    components: { DrawerModalSelectLayeringStory },
    template: '<DrawerModalSelectLayeringStory />',
  }),
};

const DisableBackdropClickStory = defineComponent({
  components: { MznBackdrop, MznButton, MznTypography },
  setup() {
    const open = ref(false);

    return { open };
  },
  template: `
    <div style="margin-bottom: 16px">
      <MznTypography color="text-neutral" variant="body">
        🔒 Clicking outside will not close the modal - use the button
      </MznTypography>
    </div>
    <MznButton variant="base-primary" @click="open = true">
      Open Modal (Must Use Button)
    </MznButton>
    <MznBackdrop disable-close-on-backdrop-click :open="open" variant="dark">
      <div
        v-if="open"
        style="background: var(--mzn-color-background-base); border-radius: 8px; display: flex; flex-direction: column; gap: 16px; margin: auto; max-width: 400px; padding: 24px; position: relative; top: 50%; transform: translateY(-50%)"
      >
        <MznTypography
          variant="body"
          color="text-neutral"
          style="margin-bottom: 16px"
        >
          Clicking the backdrop will not close this modal. You must use
          the button below.
        </MznTypography>
        <MznButton variant="base-primary" @click="open = false">
          Close Modal
        </MznButton>
      </div>
    </MznBackdrop>
  `,
});

export const DisableBackdropClick: Story = {
  render: () => ({
    components: { DisableBackdropClickStory },
    template: '<DisableBackdropClickStory />',
  }),
};
