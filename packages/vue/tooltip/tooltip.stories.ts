import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { InfoFilledIcon } from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznIcon from '../icon/icon.vue';
import MznTooltip from './tooltip.vue';
import type { PopperOptions } from '../popper/popper.types';

export default {
  title: 'Data Display/Tooltip',
  component: MznTooltip,
} as Meta;

type Story = StoryObj<typeof MznTooltip>;

const topStart: PopperOptions = { placement: 'top-start' };
const bottomStart: PopperOptions = { placement: 'bottom-start' };
const top: PopperOptions = { placement: 'top' };

export const Basic: Story = {
  render: () => ({
    components: { MznButton, MznIcon, MznTooltip },
    setup: () => ({ InfoFilledIcon, bottomStart, topStart }),
    template: `
      <div
        style="width: 100%; padding: 48px 24px 0; display: grid; align-items: center; grid-template-columns: repeat(3, 120px); grid-gap: 30px"
      >
        <MznTooltip :options="topStart" title="Tooltip">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznIcon
              :ref="ref"
              color="neutral"
              :icon="InfoFilledIcon"
              @mouseenter="onMouseenter"
              @mouseleave="onMouseleave"
            />
          </template>
        </MznTooltip>
        <MznTooltip :options="topStart">
          <template #title>
            <div style="display: flex; flex-flow: row">
              <span>Custom Element</span>
            </div>
          </template>
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznIcon
              :ref="ref"
              color="neutral"
              :icon="InfoFilledIcon"
              @mouseenter="onMouseenter"
              @mouseleave="onMouseleave"
            />
          </template>
        </MznTooltip>
        <MznTooltip
          :options="bottomStart"
          title="預設文字可能是很長的一段文字，但是受到最大寬度限制所以會換行"
        >
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton
              :ref="ref"
              variant="base-primary"
              @mouseenter="onMouseenter"
              @mouseleave="onMouseleave"
            >
              Max Width
            </MznButton>
          </template>
        </MznTooltip>
      </div>
    `,
  }),
};

export const Placement: Story = {
  render: () => ({
    components: { MznButton, MznTooltip },
    setup: () => {
      const titleFor = (placement: string): string =>
        placement.startsWith('top')
          ? '預設文字可能是一段很長的描述文字，用來說明按鈕的功能或用途。'
          : '預設文字';

      const optionsFor = (placement: string): PopperOptions => ({
        placement: placement as PopperOptions['placement'],
      });

      return { optionsFor, titleFor };
    },
    template: `
      <div
        style="width: 100%; margin-top: 50px; display: inline-grid; grid-template-columns: repeat(5, max-content); grid-auto-rows: minmax(min-content, max-content); gap: 30px; justify-content: center"
      >
        <div />
        <MznTooltip :options="optionsFor('top-start')" :title="titleFor('top-start')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">top-start</MznButton>
          </template>
        </MznTooltip>
        <MznTooltip :options="optionsFor('top')" :title="titleFor('top')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">top</MznButton>
          </template>
        </MznTooltip>
        <MznTooltip :options="optionsFor('top-end')" :title="titleFor('top-end')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">top-end</MznButton>
          </template>
        </MznTooltip>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <MznTooltip :options="optionsFor('left')" :title="titleFor('left')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">left</MznButton>
          </template>
        </MznTooltip>
        <div />
        <MznTooltip :arrow="false" :options="optionsFor('bottom')" :title="titleFor('bottom')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">No Arrow</MznButton>
          </template>
        </MznTooltip>
        <div />
        <MznTooltip :options="optionsFor('right')" :title="titleFor('right')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">right</MznButton>
          </template>
        </MznTooltip>
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <MznTooltip :options="optionsFor('bottom-start')" :title="titleFor('bottom-start')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">bottom-start</MznButton>
          </template>
        </MznTooltip>
        <MznTooltip :options="optionsFor('bottom')" :title="titleFor('bottom')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">bottom</MznButton>
          </template>
        </MznTooltip>
        <MznTooltip :options="optionsFor('bottom-end')" :title="titleFor('bottom-end')">
          <template #default="{ onMouseenter, onMouseleave, ref }">
            <MznButton :ref="ref" variant="base-primary" @mouseenter="onMouseenter" @mouseleave="onMouseleave">bottom-end</MznButton>
          </template>
        </MznTooltip>
        <div />
      </div>
    `,
  }),
};

export const OverflowFlip: Story = {
  render: () => ({
    components: { MznButton, MznTooltip },
    setup: () => ({ top }),
    template: `
      <div style="width: 100%; height: 100%; overflow: auto; position: relative">
        <div
          style="width: 200vw; height: 200vh; padding: 80px 40px; box-sizing: border-box; display: flex; align-items: flex-start; position: relative"
        >
          <MznTooltip
            :options="top"
            title="當 Tooltip 遇到視窗邊界會自動偏移/翻轉位置以避免被截斷"
          >
            <template #default="{ onMouseenter, onMouseleave, ref }">
              <MznButton
                :ref="ref"
                variant="base-primary"
                @mouseenter="onMouseenter"
                @mouseleave="onMouseleave"
              >
                Scroll and Hover Me
              </MznButton>
            </template>
          </MznTooltip>
        </div>
      </div>
    `,
  }),
};
