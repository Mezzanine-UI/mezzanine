import type { Meta, StoryObj } from '@storybook/vue3-vite';
import MznBadge from '../badge/badge.vue';
import MznDescriptionContent from './description-content.vue';
import MznDescriptionGroup from './description-group.vue';
import MznDescription from './description.vue';

export default {
  title: 'Data Display/Description/DescriptionGroup',
} as Meta;

type GroupStory = StoryObj<typeof MznDescriptionGroup>;

const STORY_COMPONENTS = {
  MznBadge,
  MznDescription,
  MznDescriptionContent,
  MznDescriptionGroup,
};

/** 基本群組結構（水平、Narrow 標題寬度） */
export const Playground: GroupStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <MznDescriptionGroup>
        <MznDescription title="訂購日期" widthType="narrow">
          <MznDescriptionContent children="2025-11-03" />
        </MznDescription>
        <MznDescription title="訂單編號" widthType="narrow">
          <MznDescriptionContent children="#HXE3901270287719038" />
        </MznDescription>
        <MznDescription title="訂單狀態" widthType="narrow">
          <MznBadge variant="dot-success" text="已出貨" />
        </MznDescription>
      </MznDescriptionGroup>
    `,
  }),
};

/** 水平排列 — 不同標題寬度（Narrow / Wide / Stretch） */
export const HorizontalLayout: GroupStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Narrow</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="訂購日期" widthType="narrow">
                <MznDescriptionContent children="2025-11-03" />
              </MznDescription>
              <MznDescription title="訂單編號" widthType="narrow">
                <MznDescriptionContent children="#HXE3901270287719038" />
              </MznDescription>
              <MznDescription title="訂單狀態" widthType="narrow">
                <MznBadge variant="dot-success" text="已出貨" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>

        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Wide</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="訂購日期" widthType="wide">
                <MznDescriptionContent children="2025-11-03" />
              </MznDescription>
              <MznDescription title="訂單編號" widthType="wide">
                <MznDescriptionContent children="#HXE3901270287719038" />
              </MznDescription>
              <MznDescription title="訂單狀態" widthType="wide">
                <MznBadge variant="dot-success" text="已出貨" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>

        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Stretch（置右排列）</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="訂購日期" widthType="stretch">
                <MznDescriptionContent children="2025-11-03" />
              </MznDescription>
              <MznDescription title="訂單編號" widthType="stretch">
                <MznDescriptionContent children="#HXE3901270287719038" />
              </MznDescription>
              <MznDescription title="訂單狀態" widthType="stretch">
                <MznBadge variant="dot-success" text="已出貨" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>
      </div>
    `,
  }),
};

/** 垂直排列 — 每個 Description 使用 orientation="vertical" */
export const VerticalLayout: GroupStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="width: 320px">
        <MznDescriptionGroup>
          <MznDescription title="訂購日期" orientation="vertical">
            <MznDescriptionContent children="2025-11-03" />
          </MznDescription>
          <MznDescription title="訂單編號" orientation="vertical">
            <MznDescriptionContent children="#HXE3901270287719038" />
          </MznDescription>
          <MznDescription title="訂單狀態" orientation="vertical">
            <MznBadge variant="dot-success" text="已出貨" />
          </MznDescription>
        </MznDescriptionGroup>
      </div>
    `,
  }),
};

/** Sizing Behavior — Fixed Title（Narrow / Wide）、Hug、Stretch 置右示範 */
export const SizingBehavior: GroupStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Fixed Title — Narrow</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="標籤" widthType="narrow">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
              <MznDescription title="較長的標籤名稱" widthType="narrow">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>

        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Fixed Title — Wide</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="標籤" widthType="wide">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
              <MznDescription title="較長的標籤名稱" widthType="wide">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>

        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Hug（依內容收縮）</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="標籤" widthType="hug">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
              <MznDescription title="較長的標籤名稱" widthType="hug">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>

        <div>
          <p style="margin-bottom: 8px; font-weight: 600">Stretch（置右排列）</p>
          <div style="width: 480px">
            <MznDescriptionGroup>
              <MznDescription title="標籤" widthType="stretch">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
              <MznDescription title="較長的標籤名稱" widthType="stretch">
                <MznDescriptionContent children="內容文字" />
              </MznDescription>
            </MznDescriptionGroup>
          </div>
        </div>
      </div>
    `,
  }),
};

/** 群組結構 — 包含多種內容類型的完整情境 */
export const GroupStructure: GroupStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="width: 480px">
        <MznDescriptionGroup>
          <MznDescription title="訂購日期" widthType="narrow">
            <MznDescriptionContent children="2025-11-03" />
          </MznDescription>
          <MznDescription title="訂單編號" widthType="narrow">
            <MznDescriptionContent children="#HXE3901270287719038" />
          </MznDescription>
          <MznDescription title="訂單狀態" widthType="narrow">
            <MznBadge variant="dot-success" text="已出貨" />
          </MznDescription>
          <MznDescription title="訂單金額" widthType="narrow">
            <MznDescriptionContent variant="statistic" children="99,000" />
          </MznDescription>
          <MznDescription title="漲幅" widthType="narrow">
            <MznDescriptionContent variant="trend-up" children="12.5%" />
          </MznDescription>
        </MznDescriptionGroup>
      </div>
    `,
  }),
};
