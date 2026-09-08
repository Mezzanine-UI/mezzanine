import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { flip, offset, shift } from '@floating-ui/dom';
import { getCSSVariableValue } from '../_internal/css-variable';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznPopper from './popper.vue';
import type { PopperPlacement } from './popper.types';

export default {
  title: 'Internal/Popper',
  component: MznPopper,
} as Meta<typeof MznPopper>;

type Story = StoryObj<typeof MznPopper>;

const DemoPopperContent = {
  components: { MznTypography },
  template: `
    <div
      style="align-items: center; background-color: white; border-radius: 5px; box-shadow: 0px 2px 4px grey; display: flex; justify-content: center; padding: 10px; width: 80px"
    >
      <MznTypography color="text-neutral">Content</MznTypography>
    </div>
  `,
};

const gapOffset = () =>
  offset({
    mainAxis:
      Number(getCSSVariableValue('--mzn-spacing-gap-base').replace('rem', '')) *
      16,
  });

export const Basic: Story = {
  render: () => ({
    components: { DemoPopperContent, MznButton, MznPopper },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);

      function toggle(event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;

        anchor.value = anchor.value === target ? null : target;
      }

      function enter(event: MouseEvent): void {
        anchor.value = event.currentTarget as HTMLElement;
      }

      function leave(): void {
        anchor.value = null;
      }

      return { anchor, enter, leave, toggle };
    },
    template: `
      <div style="display: flex; gap: 10px">
        <MznPopper :anchor="anchor" :open="Boolean(anchor)">
          <DemoPopperContent />
        </MznPopper>
        <MznButton variant="base-primary" @mouseenter="enter" @mouseleave="leave">
          Hover me
        </MznButton>
        <MznButton variant="base-primary" @click="toggle">
          Click me
        </MznButton>
      </div>
    `,
  }),
};

const placementGrid = (arrow: boolean): Story['render'] =>
  (() => ({
    components: { DemoPopperContent, MznButton, MznPopper },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);
      const placement = ref<PopperPlacement>('top');
      const arrowOptions = arrow
        ? { className: 'foo', enabled: true, padding: 0 }
        : undefined;

      function pick(next: PopperPlacement, event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;

        placement.value = next;
        anchor.value = anchor.value === target ? null : target;
      }

      const options = ref({
        get placement() {
          return placement.value;
        },
        middleware: [gapOffset()],
      });

      return { anchor, arrowOptions, options, pick };
    },
    template: `
      <div
        style="display: inline-grid; gap: 30px; grid-auto-rows: minmax(min-content, max-content); grid-template-columns: repeat(5, max-content); justify-content: center; margin-top: 50px; width: 100%"
      >
        <MznPopper
          :anchor="anchor"
          :arrow="arrowOptions"
          :open="Boolean(anchor)"
          :options="options"
        >
          <DemoPopperContent />
        </MznPopper>
        <div />
        <MznButton variant="base-primary" @click="pick('top-start', $event)">top-start</MznButton>
        <MznButton variant="base-primary" @click="pick('top', $event)">top</MznButton>
        <MznButton variant="base-primary" @click="pick('top-end', $event)">top-end</MznButton>
        <div />
        <MznButton variant="base-primary" @click="pick('left-start', $event)">left-start</MznButton>
        <div />
        <div />
        <div />
        <MznButton variant="base-primary" @click="pick('right-start', $event)">right-start</MznButton>
        <MznButton variant="base-primary" @click="pick('left', $event)">left</MznButton>
        <div />
        <div />
        <div />
        <MznButton variant="base-primary" @click="pick('right', $event)">right</MznButton>
        <MznButton variant="base-primary" @click="pick('left-end', $event)">left-end</MznButton>
        <div />
        <div />
        <div />
        <MznButton variant="base-primary" @click="pick('right-end', $event)">right-end</MznButton>
        <div />
        <MznButton variant="base-primary" @click="pick('bottom-start', $event)">bottom-start</MznButton>
        <MznButton variant="base-primary" @click="pick('bottom', $event)">bottom</MznButton>
        <MznButton variant="base-primary" @click="pick('bottom-end', $event)">bottom-end</MznButton>
        <div />
      </div>
    `,
  })) as Story['render'];

export const Placement: Story = {
  render: placementGrid(false),
};

export const WithArrow: Story = {
  render: placementGrid(true),
};

export const WithMiddleware: Story = {
  render: () => ({
    components: { DemoPopperContent, MznButton, MznPopper },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);
      const arrowOptions = {
        className: 'custom-arrow',
        enabled: true,
        padding: 0,
      };
      const options = {
        placement: 'top' as PopperPlacement,
        middleware: [
          gapOffset(),
          shift(),
          flip({ fallbackAxisSideDirection: 'end' as const }),
        ],
      };

      function toggle(event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;

        anchor.value = anchor.value === target ? null : target;
      }

      return { anchor, arrowOptions, options, toggle };
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; height: 200vh; padding-top: 50vh">
        <div>Scroll to test flip and shift middleware</div>
        <MznPopper
          :anchor="anchor"
          :arrow="arrowOptions"
          :open="Boolean(anchor)"
          :options="options"
        >
          <DemoPopperContent />
        </MznPopper>
        <MznButton variant="base-primary" @click="toggle">
          Click me (with flip &amp; shift)
        </MznButton>
      </div>
    `,
  }),
};

export const DisablePortal: Story = {
  render: () => ({
    components: { DemoPopperContent, MznButton, MznPopper },
    setup: () => {
      const anchor = ref<HTMLElement | null>(null);
      const options = {
        placement: 'bottom' as PopperPlacement,
        middleware: [gapOffset()],
      };

      function toggle(event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;

        anchor.value = anchor.value === target ? null : target;
      }

      return { anchor, options, toggle };
    },
    template: `
      <div style="display: flex; gap: 10px; position: relative">
        <MznPopper
          :anchor="anchor"
          disable-portal
          :open="Boolean(anchor)"
          :options="options"
        >
          <DemoPopperContent />
        </MznPopper>
        <MznButton variant="base-primary" @click="toggle">
          Click me (no portal)
        </MznButton>
      </div>
    `,
  }),
};
