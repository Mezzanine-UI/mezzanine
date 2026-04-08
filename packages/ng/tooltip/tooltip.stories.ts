import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import { MznTooltip } from './tooltip.directive';
import { MznButton } from '../button/button.directive';
import { MznIcon } from '../icon/icon.component';

export default {
  title: 'Data Display/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [MznTooltip, MznButton, MznIcon],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    props: { InfoFilledIcon },
    template: `
      <div style="width: 100%; padding: 48px 24px 0; display: grid; align-items: center; grid-template-columns: repeat(3, 120px); grid-gap: 30px;">
        <i mznIcon
          [mznTooltip]="'Tooltip'"
          tooltipPlacement="top-start"
          [icon]="InfoFilledIcon"
          color="neutral"
        ></i>
        <i mznIcon
          [mznTooltip]="'Custom Element'"
          tooltipPlacement="top-start"
          [icon]="InfoFilledIcon"
          color="neutral"
        ></i>
        <button
          mznButton
          variant="base-primary"
          [mznTooltip]="'預設文字可能是很長的一段文字，但是受到最大寬度限制所以會換行'"
          tooltipPlacement="bottom-start"
        >
          Max Width
        </button>
      </div>
    `,
  }),
};

export const Placement: Story = {
  render: () => ({
    template: `
      <div style="width: 100%; margin-top: 50px; display: inline-grid; grid-template-columns: repeat(5, max-content); grid-auto-rows: minmax(min-content, max-content); gap: 30px; justify-content: center;">
        <div></div>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字可能是一段很長的描述文字，用來說明按鈕的功能或用途。'" tooltipPlacement="top-start">top-start</button>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字可能是一段很長的描述文字，用來說明按鈕的功能或用途。'" tooltipPlacement="top">top</button>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字可能是一段很長的描述文字，用來說明按鈕的功能或用途。'" tooltipPlacement="top-end">top-end</button>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字'" tooltipPlacement="left">left</button>
        <div></div>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字'" tooltipPlacement="bottom" [tooltipArrow]="false">No Arrow</button>
        <div></div>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字'" tooltipPlacement="right">right</button>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字'" tooltipPlacement="bottom-start">bottom-start</button>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字'" tooltipPlacement="bottom">bottom</button>
        <button mznButton variant="base-primary" [mznTooltip]="'預設文字'" tooltipPlacement="bottom-end">bottom-end</button>
        <div></div>
      </div>
    `,
  }),
};

export const OverflowFlip: Story = {
  render: () => ({
    template: `
      <div style="width: 100%; height: 100%; overflow: auto; position: relative;">
        <div style="width: 200vw; height: 200vh; padding: 80px 40px; box-sizing: border-box; display: flex; align-items: flex-start; position: relative;">
          <button
            mznButton
            variant="base-primary"
            [mznTooltip]="'當 Tooltip 遇到視窗邊界會自動偏移/翻轉位置以避免被截斷'"
            tooltipPlacement="top"
          >
            Scroll and Hover Me
          </button>
        </div>
      </div>
    `,
  }),
};
