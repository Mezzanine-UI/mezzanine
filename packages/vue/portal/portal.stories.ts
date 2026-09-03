import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref, useTemplateRef } from 'vue';
import MznButton from '../button/button.vue';
import MznTypography from '../typography/typography.vue';
import MznPortal from './portal.vue';

export default {
  title: 'Others/Portal',
  component: MznPortal,
} as Meta<typeof MznPortal>;

type Story = StoryObj<typeof MznPortal>;

/**
 * JSX emits one text node per child, so `Content line {i + 1}` is two of them
 * and `{show ? 'Hide' : 'Show'} Portal` likewise. A Vue template merges
 * adjacent text and interpolation into one node, which the DOM diff correctly
 * reports — so these two are authored with `h()` (SKILL.md §7).
 */
const ContentLine = (props: { line: number }) =>
  h(MznTypography, { style: 'margin-bottom: 8px' }, () => [
    'Content line ',
    String(props.line),
  ]);

const ToggleText = (props: { label: string; shown: boolean }) => [
  props.shown ? 'Hide' : 'Show',
  ` ${props.label}`,
];

const DemoElement = {
  template: `
    <div
      style="width: 100px; height: 100px; background-image: radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a); border-radius: 100%"
    />
  `,
};

export const CustomContainer: Story = {
  name: 'Custom Container (Using Ref)',
  render: () => ({
    components: { DemoElement, MznPortal, MznTypography },
    setup: () => ({ container: useTemplateRef<HTMLElement>('container') }),
    template: `
      <div style="width: 100%; height: 100px; background-color: #d9d9d9">
        <MznTypography>The container wrapping portal.</MznTypography>
        <MznPortal :container="container"><DemoElement /></MznPortal>
      </div>
      <div ref="container" style="width: 100%; height: 100px; background-color: #e5e5e5">
        <MznTypography>The portal destination.</MznTypography>
      </div>
    `,
  }),
};

export const DefaultLayer: Story = {
  name: 'Default Layer (Auto Portal)',
  render: () => ({
    components: {
      DemoElement,
      MznButton,
      MznPortal,
      MznTypography,
      ToggleText,
    },
    setup: () => ({ show: ref(false) }),
    template: `
      <div style="padding: 20px">
        <MznTypography variant="h1" style="margin-bottom: 16px">
          Default Portal Layer
        </MznTypography>
        <MznTypography style="margin-bottom: 16px">
          Click the button to show a portal element in the default layer. The
          element will be rendered in <code>#mzn-portal-container</code>.
        </MznTypography>
        <MznButton @click="show = !show"><ToggleText label="Portal" :shown="show" /></MznButton>
        <MznPortal layer="default">
          <div
            v-if="show"
            style="place-self: center; padding: 24px; background-color: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 8px; pointer-events: auto"
          >
            <MznTypography variant="h2" style="margin-bottom: 8px">
              Portal Content
            </MznTypography>
            <MznTypography>
              This is rendered in the default portal layer.
            </MznTypography>
            <DemoElement />
          </div>
        </MznPortal>
      </div>
    `,
  }),
};

export const AlertLayer: Story = {
  name: 'Alert Layer (Above Root)',
  render: () => ({
    components: { ContentLine, MznButton, MznPortal, MznTypography },
    setup: () => {
      const alerts = ref<string[]>([]);

      function addAlert(): void {
        alerts.value = [...alerts.value, `Alert ${alerts.value.length + 1}`];
      }

      function removeAlert(index: number): void {
        alerts.value = alerts.value.filter((_, i) => i !== index);
      }

      const lines = Array.from({ length: 20 }).map((_, i) => i + 1);

      return { addAlert, alerts, lines, removeAlert };
    },
    template: `
      <div style="padding: 20px">
        <MznTypography variant="h1" style="margin-bottom: 16px">
          Alert Portal Layer
        </MznTypography>
        <MznTypography style="margin-bottom: 16px">
          Alert layer renders at the top of the page, outside the root element. It
          uses <code>position: sticky</code> and automatically adjusts the default
          portal layer position.
        </MznTypography>
        <MznButton @click="addAlert">Add Alert Banner</MznButton>
        <div style="margin-top: 24px; height: 400px; overflow-y: auto">
          <MznTypography variant="h2" style="margin-bottom: 16px">
            Scrollable Content
          </MznTypography>
          <ContentLine v-for="line in lines" :key="line" :line="line" />
        </div>
        <MznPortal v-for="(alert, index) in alerts" :key="index" layer="alert">
          <div
            :style="{
              padding: '16px 24px',
              backgroundColor: index % 2 === 0 ? '#4caf50' : '#2196f3',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: 'auto',
            }"
          >
            <MznTypography style="color: #fff">{{ alert }}</MznTypography>
            <button
              type="button"
              style="background: none; border: none; color: #fff; cursor: pointer; font-size: 20px; padding: 0 8px"
              @click="removeAlert(index)"
            >×</button>
          </div>
        </MznPortal>
      </div>
    `,
  }),
};

export const DisablePortal: Story = {
  name: 'Disable Portal',
  render: () => ({
    components: { DemoElement, MznPortal, MznTypography },
    template: `
      <div style="padding: 20px">
        <MznTypography variant="h2" style="margin-bottom: 16px">
          Disabled Portal
        </MznTypography>
        <MznTypography style="margin-bottom: 16px">
          When <code>disablePortal</code> is true, the content renders in normal
          DOM flow instead of being portaled.
        </MznTypography>
        <div style="padding: 16px; background-color: #f5f5f5; border-radius: 8px">
          <MznTypography style="margin-bottom: 16px">
            Parent Container
          </MznTypography>
          <MznPortal disable-portal>
            <div style="padding: 16px; background-color: #e0e0e0; border-radius: 4px">
              <MznTypography>This content is NOT portaled</MznTypography>
              <DemoElement />
            </div>
          </MznPortal>
        </div>
      </div>
    `,
  }),
};

export const LayerComparison: Story = {
  name: 'Layer Comparison',
  render: () => ({
    components: { MznButton, MznPortal, MznTypography, ToggleText },
    setup: () => ({ showAlert: ref(false), showDefault: ref(false) }),
    template: `
      <div style="padding: 20px">
        <MznTypography variant="h2" style="margin-bottom: 16px">
          Portal Layers Comparison
        </MznTypography>
        <MznTypography style="margin-bottom: 16px">
          Compare the difference between alert and default layers:
        </MznTypography>
        <div style="display: flex; gap: 12px; margin-bottom: 24px">
          <MznButton variant="base-primary" @click="showAlert = !showAlert">
            <ToggleText label="Alert Layer" :shown="showAlert" />
          </MznButton>
          <MznButton variant="base-secondary" @click="showDefault = !showDefault">
            <ToggleText label="Default Layer" :shown="showDefault" />
          </MznButton>
        </div>
        <div style="height: 200vh; padding: 16px; background-color: #f5f5f5; border-radius: 8px">
          <MznTypography variant="h3">Page Content</MznTypography>
          <MznTypography>
            The alert layer appears above this content with sticky positioning.
            The default layer uses fixed positioning inside the root.
          </MznTypography>
        </div>
        <MznPortal v-if="showAlert" layer="alert">
          <div style="padding: 16px 24px; background-color: #ff9800; color: #fff; pointer-events: auto">
            <MznTypography style="color: #fff">Alert Layer</MznTypography>
          </div>
        </MznPortal>
        <MznPortal v-if="showDefault" layer="default">
          <div
            style="width: 200px; height: 100%; justify-self: flex-end; padding: 24px; background-color: rgba(33, 150, 243, 0.95); color: #fff; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); pointer-events: auto"
          >
            <MznTypography style="color: #fff">Default Layer</MznTypography>
          </div>
        </MznPortal>
      </div>
    `,
  }),
};
