import { Meta, StoryObj } from '@storybook/react-webpack5';
import Badge from '../Badge';
import Description from './Description';
import DescriptionContent from './DescriptionContent';
import DescriptionGroup from './DescriptionGroup';

export default {
  title: 'Data Display/Description/DescriptionGroup',
} as Meta;

type GroupStory = StoryObj<typeof DescriptionGroup>;

/** 基本群組結構（水平、Narrow 標題寬度） */
export const Playground: GroupStory = {
  render: () => (
    <DescriptionGroup>
      <Description title="訂購日期" widthType="narrow">
        <DescriptionContent>2025-11-03</DescriptionContent>
      </Description>
      <Description title="訂單編號" widthType="narrow">
        <DescriptionContent>#HXE3901270287719038</DescriptionContent>
      </Description>
      <Description title="訂單狀態" widthType="narrow">
        <Badge variant="dot-success" text="已出貨" />
      </Description>
    </DescriptionGroup>
  ),
};

/** 水平排列 — 不同標題寬度（Narrow / Wide / Stretch） */
export const HorizontalLayout: GroupStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Narrow</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="訂購日期" widthType="narrow">
              <DescriptionContent>2025-11-03</DescriptionContent>
            </Description>
            <Description title="訂單編號" widthType="narrow">
              <DescriptionContent>#HXE3901270287719038</DescriptionContent>
            </Description>
            <Description title="訂單狀態" widthType="narrow">
              <Badge variant="dot-success" text="已出貨" />
            </Description>
          </DescriptionGroup>
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Wide</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="訂購日期" widthType="wide">
              <DescriptionContent>2025-11-03</DescriptionContent>
            </Description>
            <Description title="訂單編號" widthType="wide">
              <DescriptionContent>#HXE3901270287719038</DescriptionContent>
            </Description>
            <Description title="訂單狀態" widthType="wide">
              <Badge variant="dot-success" text="已出貨" />
            </Description>
          </DescriptionGroup>
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Stretch（置右排列）</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="訂購日期" widthType="stretch">
              <DescriptionContent>2025-11-03</DescriptionContent>
            </Description>
            <Description title="訂單編號" widthType="stretch">
              <DescriptionContent>#HXE3901270287719038</DescriptionContent>
            </Description>
            <Description title="訂單狀態" widthType="stretch">
              <Badge variant="dot-success" text="已出貨" />
            </Description>
          </DescriptionGroup>
        </div>
      </div>
    </div>
  ),
};

/** 垂直排列 — 每個 Description 使用 orientation="vertical" */
export const VerticalLayout: GroupStory = {
  render: () => (
    <div style={{ width: 320 }}>
      <DescriptionGroup>
        <Description title="訂購日期" orientation="vertical">
          <DescriptionContent>2025-11-03</DescriptionContent>
        </Description>
        <Description title="訂單編號" orientation="vertical">
          <DescriptionContent>#HXE3901270287719038</DescriptionContent>
        </Description>
        <Description title="訂單狀態" orientation="vertical">
          <Badge variant="dot-success" text="已出貨" />
        </Description>
      </DescriptionGroup>
    </div>
  ),
};

/** Sizing Behavior — Fixed Title（Narrow / Wide）、Hug、Stretch 置右示範 */
export const SizingBehavior: GroupStory = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Fixed Title — Narrow</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="標籤" widthType="narrow">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
            <Description title="較長的標籤名稱" widthType="narrow">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
          </DescriptionGroup>
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Fixed Title — Wide</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="標籤" widthType="wide">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
            <Description title="較長的標籤名稱" widthType="wide">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
          </DescriptionGroup>
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Hug（依內容收縮）</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="標籤" widthType="hug">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
            <Description title="較長的標籤名稱" widthType="hug">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
          </DescriptionGroup>
        </div>
      </div>

      <div>
        <p style={{ marginBottom: 8, fontWeight: 600 }}>Stretch（置右排列）</p>
        <div style={{ width: 480 }}>
          <DescriptionGroup>
            <Description title="標籤" widthType="stretch">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
            <Description title="較長的標籤名稱" widthType="stretch">
              <DescriptionContent>內容文字</DescriptionContent>
            </Description>
          </DescriptionGroup>
        </div>
      </div>
    </div>
  ),
};

/** 群組結構 — 包含多種內容類型的完整情境 */
export const GroupStructure: GroupStory = {
  render: () => (
    <div style={{ width: 480 }}>
      <DescriptionGroup>
        <Description title="訂購日期" widthType="narrow">
          <DescriptionContent>2025-11-03</DescriptionContent>
        </Description>
        <Description title="訂單編號" widthType="narrow">
          <DescriptionContent>#HXE3901270287719038</DescriptionContent>
        </Description>
        <Description title="訂單狀態" widthType="narrow">
          <Badge variant="dot-success" text="已出貨" />
        </Description>
        <Description title="訂單金額" widthType="narrow">
          <DescriptionContent variant="statistic">99,000</DescriptionContent>
        </Description>
        <Description title="漲幅" widthType="narrow">
          <DescriptionContent variant="trend-up">12.5%</DescriptionContent>
        </Description>
      </DescriptionGroup>
    </div>
  ),
};
