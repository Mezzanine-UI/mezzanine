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
      <mzn-description-group>
        <mzn-description title="訂購日期" widthType="narrow">
          <mzn-description-content>2025-11-03</mzn-description-content>
        </mzn-description>
        <mzn-description title="訂單編號" widthType="narrow">
          <mzn-description-content>#HXE3901270287719038</mzn-description-content>
        </mzn-description>
        <mzn-description title="訂單狀態" widthType="narrow">
          <span mznBadge variant="dot-success" text="已出貨" ></span>
        </mzn-description>
      </mzn-description-group>
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
            <mzn-description-group>
              <mzn-description title="訂購日期" widthType="narrow">
                <mzn-description-content>2025-11-03</mzn-description-content>
              </mzn-description>
              <mzn-description title="訂單編號" widthType="narrow">
                <mzn-description-content>#HXE3901270287719038</mzn-description-content>
              </mzn-description>
              <mzn-description title="訂單狀態" widthType="narrow">
                <span mznBadge variant="dot-success" text="已出貨" ></span>
              </mzn-description>
            </mzn-description-group>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Wide</p>
          <div style="width: 480px;">
            <mzn-description-group>
              <mzn-description title="訂購日期" widthType="wide">
                <mzn-description-content>2025-11-03</mzn-description-content>
              </mzn-description>
              <mzn-description title="訂單編號" widthType="wide">
                <mzn-description-content>#HXE3901270287719038</mzn-description-content>
              </mzn-description>
              <mzn-description title="訂單狀態" widthType="wide">
                <span mznBadge variant="dot-success" text="已出貨" ></span>
              </mzn-description>
            </mzn-description-group>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Stretch（置右排列）</p>
          <div style="width: 480px;">
            <mzn-description-group>
              <mzn-description title="訂購日期" widthType="stretch">
                <mzn-description-content>2025-11-03</mzn-description-content>
              </mzn-description>
              <mzn-description title="訂單編號" widthType="stretch">
                <mzn-description-content>#HXE3901270287719038</mzn-description-content>
              </mzn-description>
              <mzn-description title="訂單狀態" widthType="stretch">
                <span mznBadge variant="dot-success" text="已出貨" ></span>
              </mzn-description>
            </mzn-description-group>
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
        <mzn-description-group>
          <mzn-description title="訂購日期" orientation="vertical">
            <mzn-description-content>2025-11-03</mzn-description-content>
          </mzn-description>
          <mzn-description title="訂單編號" orientation="vertical">
            <mzn-description-content>#HXE3901270287719038</mzn-description-content>
          </mzn-description>
          <mzn-description title="訂單狀態" orientation="vertical">
            <span mznBadge variant="dot-success" text="已出貨" ></span>
          </mzn-description>
        </mzn-description-group>
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
            <mzn-description-group>
              <mzn-description title="標籤" widthType="narrow">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
              <mzn-description title="較長的標籤名稱" widthType="narrow">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
            </mzn-description-group>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Fixed Title — Wide</p>
          <div style="width: 480px;">
            <mzn-description-group>
              <mzn-description title="標籤" widthType="wide">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
              <mzn-description title="較長的標籤名稱" widthType="wide">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
            </mzn-description-group>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Hug（依內容收縮）</p>
          <div style="width: 480px;">
            <mzn-description-group>
              <mzn-description title="標籤" widthType="hug">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
              <mzn-description title="較長的標籤名稱" widthType="hug">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
            </mzn-description-group>
          </div>
        </div>
        <div>
          <p style="margin-bottom: 8px; font-weight: 600;">Stretch（置右排列）</p>
          <div style="width: 480px;">
            <mzn-description-group>
              <mzn-description title="標籤" widthType="stretch">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
              <mzn-description title="較長的標籤名稱" widthType="stretch">
                <mzn-description-content>內容文字</mzn-description-content>
              </mzn-description>
            </mzn-description-group>
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
        <mzn-description-group>
          <mzn-description title="訂購日期" widthType="narrow">
            <mzn-description-content>2025-11-03</mzn-description-content>
          </mzn-description>
          <mzn-description title="訂單編號" widthType="narrow">
            <mzn-description-content>#HXE3901270287719038</mzn-description-content>
          </mzn-description>
          <mzn-description title="訂單狀態" widthType="narrow">
            <span mznBadge variant="dot-success" text="已出貨" ></span>
          </mzn-description>
          <mzn-description title="訂單金額" widthType="narrow">
            <mzn-description-content variant="statistic">99,000</mzn-description-content>
          </mzn-description>
          <mzn-description title="漲幅" widthType="narrow">
            <mzn-description-content variant="trend-up">12.5%</mzn-description-content>
          </mzn-description>
        </mzn-description-group>
      </div>
    `,
  }),
};
