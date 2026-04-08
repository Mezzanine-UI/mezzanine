import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznDescription } from './description.component';
import { MznDescriptionContent } from './description-content.component';
import { MznDescriptionGroup } from './description-group.component';

export default {
  title: 'Data Display/Description/DescriptionGroup',
  decorators: [
    moduleMetadata({
      imports: [
        MznDescription,
        MznDescriptionContent,
        MznDescriptionGroup,
        MznBadge,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  render: () => ({
    template: `
      <div mznDescriptionGroup>
        <div mznDescription title="訂購日期" widthType="narrow">
          <span mznDescriptionContent>2025-11-03</span>
        </div>
        <div mznDescription title="訂單編號" widthType="narrow">
          <span mznDescriptionContent>#HXE3901270287719038</span>
        </div>
        <div mznDescription title="訂單狀態" widthType="narrow">
          <span mznBadge variant="dot-success" text="已出貨" ></span>
        </div>
      </div>
    `,
  }),
};

export const HorizontalLayout: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Narrow</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="訂購日期" widthType="narrow">
                <span mznDescriptionContent>2025-11-03</span>
              </div>
              <div mznDescription title="訂單編號" widthType="narrow">
                <span mznDescriptionContent>#HXE3901270287719038</span>
              </div>
              <div mznDescription title="訂單狀態" widthType="narrow">
                <span mznBadge variant="dot-success" text="已出貨" ></span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Wide</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="訂購日期" widthType="wide">
                <span mznDescriptionContent>2025-11-03</span>
              </div>
              <div mznDescription title="訂單編號" widthType="wide">
                <span mznDescriptionContent>#HXE3901270287719038</span>
              </div>
              <div mznDescription title="訂單狀態" widthType="wide">
                <span mznBadge variant="dot-success" text="已出貨" ></span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Stretch（置右排列）</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="訂購日期" widthType="stretch">
                <span mznDescriptionContent>2025-11-03</span>
              </div>
              <div mznDescription title="訂單編號" widthType="stretch">
                <span mznDescriptionContent>#HXE3901270287719038</span>
              </div>
              <div mznDescription title="訂單狀態" widthType="stretch">
                <span mznBadge variant="dot-success" text="已出貨" ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const VerticalLayout: Story = {
  render: () => ({
    template: `
      <div style="width: 320px;">
        <div mznDescriptionGroup>
          <div mznDescription title="訂購日期" orientation="vertical">
            <span mznDescriptionContent>2025-11-03</span>
          </div>
          <div mznDescription title="訂單編號" orientation="vertical">
            <span mznDescriptionContent>#HXE3901270287719038</span>
          </div>
          <div mznDescription title="訂單狀態" orientation="vertical">
            <span mznBadge variant="dot-success" text="已出貨" ></span>
          </div>
        </div>
      </div>
    `,
  }),
};

export const SizingBehavior: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 48px;">
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Fixed Title — Narrow</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="標籤" widthType="narrow">
                <span mznDescriptionContent>內容文字</span>
              </div>
              <div mznDescription title="較長的標籤名稱" widthType="narrow">
                <span mznDescriptionContent>內容文字</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Fixed Title — Wide</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="標籤" widthType="wide">
                <span mznDescriptionContent>內容文字</span>
              </div>
              <div mznDescription title="較長的標籤名稱" widthType="wide">
                <span mznDescriptionContent>內容文字</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Hug（依內容收縮）</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="標籤" widthType="hug">
                <span mznDescriptionContent>內容文字</span>
              </div>
              <div mznDescription title="較長的標籤名稱" widthType="hug">
                <span mznDescriptionContent>內容文字</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Stretch（置右排列）</p>
          <div style="width: 480px;">
            <div mznDescriptionGroup>
              <div mznDescription title="標籤" widthType="stretch">
                <span mznDescriptionContent>內容文字</span>
              </div>
              <div mznDescription title="較長的標籤名稱" widthType="stretch">
                <span mznDescriptionContent>內容文字</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const GroupStructure: Story = {
  render: () => ({
    template: `
      <div style="width: 480px;">
        <div mznDescriptionGroup>
          <div mznDescription title="訂購日期" widthType="narrow">
            <span mznDescriptionContent>2025-11-03</span>
          </div>
          <div mznDescription title="訂單編號" widthType="narrow">
            <span mznDescriptionContent>#HXE3901270287719038</span>
          </div>
          <div mznDescription title="訂單狀態" widthType="narrow">
            <span mznBadge variant="dot-success" text="已出貨" ></span>
          </div>
          <div mznDescription title="訂單金額" widthType="narrow">
            <span mznDescriptionContent variant="statistic">99,000</span>
          </div>
          <div mznDescription title="漲幅" widthType="narrow">
            <span mznDescriptionContent variant="trend-up">12.5%</span>
          </div>
        </div>
      </div>
    `,
  }),
};
