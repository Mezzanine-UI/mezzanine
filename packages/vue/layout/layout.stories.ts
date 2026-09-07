import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { FileIcon, HomeIcon, PlusIcon, UserIcon } from '@mezzanine-ui/icons';
import MznFloatingButton from '../floating-button/floating-button.vue';
import MznNavigationFooter from '../navigation/navigation-footer.vue';
import MznNavigationHeader from '../navigation/navigation-header.vue';
import MznNavigationOption from '../navigation/navigation-option.vue';
import MznNavigation from '../navigation/navigation.vue';
import MznLayoutLeftPanel from './layout-left-panel.vue';
import MznLayoutMain from './layout-main.vue';
import MznLayoutRightPanel from './layout-right-panel.vue';
import MznLayout from './layout.vue';

const meta: Meta<typeof MznLayout> = {
  title: 'Foundation/Layout',
  component: MznLayout,
};

export default meta;

const STORY_COMPONENTS = {
  MznFloatingButton,
  MznLayout,
  MznLayoutLeftPanel,
  MznLayoutMain,
  MznLayoutRightPanel,
  MznNavigation,
  MznNavigationFooter,
  MznNavigationHeader,
  MznNavigationOption,
};

export const Playground: StoryObj<typeof MznLayout> = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const activatedPath = ref(['首頁']);
      const rightOpen = ref(false);

      return {
        FileIcon,
        HomeIcon,
        PlusIcon,
        UserIcon,
        activatedPath,
        onOptionClick: (path?: string[]): void => {
          if (path) activatedPath.value = path;
        },
        rightOpen,
      };
    },
    template: `
      <MznLayout navigationClassName="foo" contentWrapperClassName="bar">
        <MznNavigation :activatedPath="activatedPath" @option-click="onOptionClick">
          <MznNavigationHeader title="Mezzanine" />
          <MznNavigationOption :icon="HomeIcon" title="首頁" />
          <MznNavigationOption :icon="FileIcon" title="數據分析">
            <MznNavigationOption title="流量報表" />
            <MznNavigationOption title="轉換率分析" />
          </MznNavigationOption>
          <MznNavigationOption :icon="UserIcon" title="會員管理" />
          <MznNavigationFooter />
        </MznNavigation>
        <MznLayoutMain class="main-foo">
          <div style="height: 100vh; padding: var(--mzn-spacing-primitive-24)">
            <h1>Main Content</h1>
            <p>
              Click the floating button to open the right panel, and drag the
              separator line to resize it.
            </p>
          </div>
          <MznFloatingButton
            autoHideWhenOpen
            :icon="PlusIcon"
            iconType="icon-only"
            :open="rightOpen"
            @click="rightOpen = true"
          >
            Open Panel
          </MznFloatingButton>
        </MznLayoutMain>
        <MznLayoutRightPanel :defaultWidth="320" :open="rightOpen">
          <div style="padding: var(--mzn-spacing-primitive-24)">
            <h2>Right Panel</h2>
            <p>This panel is in-flow and scrolls independently.</p>
            <button @click="rightOpen = false">Close</button>
          </div>
        </MznLayoutRightPanel>
      </MznLayout>
    `,
  }),
};

export const WithDualPanels: StoryObj<typeof MznLayout> = {
  name: 'With Dual Panels (Left + Right)',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => {
      const activatedPath = ref(['首頁']);
      const leftOpen = ref(true);
      const rightOpen = ref(false);

      return {
        FileIcon,
        HomeIcon,
        UserIcon,
        activatedPath,
        leftOpen,
        onOptionClick: (path?: string[]): void => {
          if (path) activatedPath.value = path;
        },
        rightOpen,
      };
    },
    template: `
      <MznLayout>
        <MznNavigation :activatedPath="activatedPath" @option-click="onOptionClick">
          <MznNavigationHeader title="Mezzanine" />
          <MznNavigationOption :icon="HomeIcon" title="首頁" />
          <MznNavigationOption :icon="FileIcon" title="數據分析">
            <MznNavigationOption title="流量報表" />
            <MznNavigationOption title="轉換率分析" />
          </MznNavigationOption>
          <MznNavigationOption :icon="UserIcon" title="會員管理" />
          <MznNavigationFooter />
        </MznNavigation>
        <MznLayoutLeftPanel :defaultWidth="240" :open="leftOpen">
          <div style="padding: var(--mzn-spacing-primitive-24)">
            <h2>Left Panel</h2>
            <p>Sidebar content, navigation trees, filters, etc.</p>
            <button @click="leftOpen = false">Close</button>
          </div>
        </MznLayoutLeftPanel>
        <MznLayoutMain>
          <div style="height: 100vh; padding: var(--mzn-spacing-primitive-24)">
            <h1>Main Content</h1>
            <p>
              The main area fills remaining space and scrolls independently.
            </p>
            <div style="display: flex; gap: var(--mzn-spacing-primitive-8)">
              <button v-if="!leftOpen" @click="leftOpen = true">Open Left</button>
              <button v-if="!rightOpen" @click="rightOpen = true">Open Right</button>
            </div>
          </div>
        </MznLayoutMain>
        <MznLayoutRightPanel :defaultWidth="320" :open="rightOpen">
          <div style="padding: var(--mzn-spacing-primitive-24)">
            <h2>Right Panel</h2>
            <p>Detail view, preview, contextual actions, etc.</p>
            <button @click="rightOpen = false">Close</button>
          </div>
        </MznLayoutRightPanel>
      </MznLayout>
    `,
  }),
};
