import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, ref } from 'vue';
import MznSpin from './spin.vue';
import MznButton from '../button/button.vue';
import MznModal from '../modal/modal.vue';
import { MznDescription, MznDescriptionContent } from '../description';

export default {
  title: 'Feedback/Spin',
  component: MznSpin,
} as Meta<typeof MznSpin>;

export const Playground: StoryObj<typeof MznSpin> = {
  args: {
    description: 'Loading...',
    loading: true,
    size: 'main',
    stretch: false,
  },
  render: (args) => ({
    components: { MznSpin },
    setup: () => ({ args }),
    template: `
      <div
        style="display: inline-grid; gap: 60px; grid-template-columns: repeat(3, 140px)"
      >
        <div style="height: 100%; width: 100%">
          <MznSpin v-bind="args" />
        </div>
      </div>
    `,
  }),
};

const BasicExample = defineComponent({
  components: { MznSpin },
  template: `
    <div
      style="display: inline-grid; gap: 60px; grid-template-columns: repeat(3, 140px)"
    >
      <MznSpin loading />
      <MznSpin description="Loading..." loading />
    </div>
  `,
});

export const Basic: StoryObj<typeof MznSpin> = {
  render: () => ({
    components: { BasicExample },
    template: '<BasicExample />',
  }),
};

const NestedExample = defineComponent({
  components: { MznDescription, MznDescriptionContent, MznSpin },
  template: `
    <div style="display: grid; gap: 16px">
      <MznSpin description="Loading..." loading>
        <div style="width: 300px; height: 300px">
          <MznDescription title="Test Description">
            <MznDescriptionContent
              children="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
          </MznDescription>
        </div>
      </MznSpin>
    </div>
  `,
});

export const Nested: StoryObj<typeof MznSpin> = {
  render: () => ({
    components: { NestedExample },
    template: '<NestedExample />',
  }),
};

const OnModalExample = defineComponent({
  components: { MznButton, MznModal, MznSpin },
  setup() {
    const open = ref(false);

    return { open };
  },
  template: `
    <MznButton variant="base-primary" @click="open = true">OPEN</MznButton>
    <MznModal
      title="Hi"
      modal-type="standard"
      :open="open"
      show-modal-header
      @close="open = false"
    >
      <MznSpin description="內容加載中..." loading stretch size="sub">
        <div style="width: 100%; height: 200px" />
      </MznSpin>
    </MznModal>
  `,
});

export const OnModal: StoryObj<typeof MznSpin> = {
  render: () => ({
    components: { OnModalExample },
    template: '<OnModalExample />',
  }),
};

const SizesExample = defineComponent({
  components: { MznSpin },
  template: `
    <div style="display: grid; gap: 24px">
      <MznSpin description="Main size" loading size="main" />
      <MznSpin description="Sub size" loading size="sub" />
      <MznSpin description="Minor size" loading size="minor" />
    </div>
  `,
});

export const Sizes: StoryObj<typeof MznSpin> = {
  render: () => ({
    components: { SizesExample },
    template: '<SizesExample />',
  }),
};

const CustomColorsExample = defineComponent({
  components: { MznSpin },
  template: `
    <div style="display: grid; gap: 24px">
      <div
        style="background: #1976d2; padding: 24px; border-radius: 8px; display: inline-flex; gap: 24px; align-items: center"
      >
        <MznSpin
          loading
          color="white"
          track-color="rgba(255,255,255,0.3)"
          description="On dark background"
        />
      </div>
      <div
        style="background: #f5f5f5; padding: 24px; border-radius: 8px; display: inline-flex; gap: 24px; align-items: center"
      >
        <MznSpin
          loading
          color="#e53935"
          track-color="rgba(229,57,53,0.15)"
          description="Custom brand color"
        />
      </div>
      <div
        style="background: #212121; padding: 24px; border-radius: 8px; display: inline-flex; gap: 24px; align-items: center"
      >
        <MznSpin
          loading
          color="#69f0ae"
          track-color="rgba(105,240,174,0.2)"
          description="On black background"
        />
      </div>
    </div>
  `,
});

export const CustomColors: StoryObj<typeof MznSpin> = {
  render: () => ({
    components: { CustomColorsExample },
    template: '<CustomColorsExample />',
  }),
};
