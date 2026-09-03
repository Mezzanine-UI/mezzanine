import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { FolderIcon } from '@mezzanine-ui/icons';
import MznTab from './tab.vue';
import MznTabItem from './tab-item.vue';

export default {
  title: 'Navigation/Tab',
} satisfies Meta;

export const All: StoryObj = {
  render: () => ({
    components: { MznTab, MznTabItem },
    setup: () => ({ tabKey: ref('0'), FolderIcon }),
    template: `
      <div style="display: grid; gap: 40px">
        Basic (Horizontal)
        <MznTab :active-key="tabKey" direction="horizontal" @change="tabKey = $event">
          <MznTabItem key="0">TabItem 1</MznTabItem>
          <MznTabItem key="1">TabItem 2</MznTabItem>
          <MznTabItem key="2">TabItem 3</MznTabItem>
        </MznTab>
        WithIcon and Badge
        <MznTab :active-key="tabKey" direction="horizontal" @change="tabKey = $event">
          <MznTabItem key="0" :icon="FolderIcon">TabItem 1</MznTabItem>
          <MznTabItem key="1" :icon="FolderIcon">TabItem 2</MznTabItem>
          <MznTabItem key="2" :icon="FolderIcon" :badge-count="99">TabItem 3</MznTabItem>
        </MznTab>
        Vertical
        <MznTab :active-key="tabKey" direction="vertical" @change="tabKey = $event">
          <MznTabItem key="0" :icon="FolderIcon">TabItem 1</MznTabItem>
          <MznTabItem key="1" :icon="FolderIcon">TabItem 2</MznTabItem>
          <MznTabItem key="2" :icon="FolderIcon" :badge-count="99">TabItem 3</MznTabItem>
          <MznTabItem key="3" :icon="FolderIcon" disabled>Disabled</MznTabItem>
        </MznTab>
        <MznTab direction="vertical">
          <MznTabItem :icon="FolderIcon">TabItem 1</MznTabItem>
          <MznTabItem :icon="FolderIcon">TabItem 2</MznTabItem>
          <MznTabItem :icon="FolderIcon">TabItem 3</MznTabItem>
        </MznTab>
      </div>
    `,
  }),
};

export const Error: StoryObj = {
  render: () => ({
    components: { MznTab, MznTabItem },
    setup: () => ({ tabKey: ref('0'), FolderIcon }),
    template: `
      <div style="display: grid; gap: 40px">
        Error (Horizontal)
        <MznTab :active-key="tabKey" direction="horizontal" @change="tabKey = $event">
          <MznTabItem key="0" :icon="FolderIcon" :badge-count="99" error>Tab1</MznTabItem>
          <MznTabItem key="1">Tab2</MznTabItem>
          <MznTabItem key="2">Tab3</MznTabItem>
        </MznTab>
        Error (Vertical)
        <MznTab :active-key="tabKey" direction="vertical" @change="tabKey = $event">
          <MznTabItem key="0" :icon="FolderIcon" :badge-count="99" error>Tab1</MznTabItem>
          <MznTabItem key="1">Tab2</MznTabItem>
          <MznTabItem key="2">Tab3</MznTabItem>
        </MznTab>
      </div>
    `,
  }),
};

export const TabsSize: StoryObj = {
  render: () => ({
    components: { MznTab, MznTabItem },
    setup: () => ({ tabKey: ref('0') }),
    template: `
      <div style="display: grid; gap: 48px">
        分頁列尺寸（Tabs Size）
        水平分頁列（Horizontal Tabs）
        <div style="display: grid; gap: 24px">
          Main
          <MznTab :active-key="tabKey" direction="horizontal" size="main" @change="tabKey = $event">
            <MznTabItem key="0">Tab 1</MznTabItem>
            <MznTabItem key="1">Tab 2</MznTabItem>
            <MznTabItem key="2">Tab 3</MznTabItem>
            <MznTabItem key="3">Tab 4</MznTabItem>
            <MznTabItem key="4">Tab 5</MznTabItem>
            <MznTabItem key="5">Tab 6</MznTabItem>
            <MznTabItem key="6">Tab 7</MznTabItem>
          </MznTab>
          Sub
          <MznTab :active-key="tabKey" direction="horizontal" size="sub" @change="tabKey = $event">
            <MznTabItem key="0">Tab 1</MznTabItem>
            <MznTabItem key="1">Tab 2</MznTabItem>
            <MznTabItem key="2">Tab 3</MznTabItem>
            <MznTabItem key="3">Tab 4</MznTabItem>
            <MznTabItem key="4">Tab 5</MznTabItem>
            <MznTabItem key="5">Tab 6</MznTabItem>
            <MznTabItem key="6">Tab 7</MznTabItem>
          </MznTab>
        </div>
        垂直分頁列（Vertical Tabs）
        <div style="display: grid; gap: 24px">
          Main
          <MznTab :active-key="tabKey" direction="vertical" size="main" @change="tabKey = $event">
            <MznTabItem key="0">Tab 1</MznTabItem>
            <MznTabItem key="1">Tab 2</MznTabItem>
            <MznTabItem key="2">Tab 3</MznTabItem>
            <MznTabItem key="3">Tab 4</MznTabItem>
            <MznTabItem key="4">Tab 5</MznTabItem>
            <MznTabItem key="5">Tab 6</MznTabItem>
            <MznTabItem key="6">Tab 7</MznTabItem>
            <MznTabItem key="7">Tab 8</MznTabItem>
            <MznTabItem key="8">Tab 9</MznTabItem>
            <MznTabItem key="9">Tab 10</MznTabItem>
          </MznTab>
          Sub
          <MznTab :active-key="tabKey" direction="vertical" size="sub" @change="tabKey = $event">
            <MznTabItem key="0">Tab 1</MznTabItem>
            <MznTabItem key="1">Tab 2</MznTabItem>
            <MznTabItem key="2">Tab 3</MznTabItem>
            <MznTabItem key="3">Tab 4</MznTabItem>
            <MznTabItem key="4">Tab 5</MznTabItem>
            <MznTabItem key="5">Tab 6</MznTabItem>
            <MznTabItem key="6">Tab 7</MznTabItem>
            <MznTabItem key="7">Tab 8</MznTabItem>
            <MznTabItem key="8">Tab 9</MznTabItem>
            <MznTabItem key="9">Tab 10</MznTabItem>
          </MznTab>
        </div>
      </div>
    `,
  }),
};
