import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type { FunctionalComponent } from 'vue';
import { DotHorizontalIcon, PlusIcon, SearchIcon } from '@mezzanine-ui/icons';
import type { ButtonSize, ButtonVariant } from '@mezzanine-ui/core/button';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { getNumericCSSVariablePixelValue } from '../_internal/css-variable';
import MznDropdown from '../dropdown/dropdown.vue';
import MznButton from './button.vue';
import type { ButtonProps } from './button.types';

export default {
  component: MznButton,
  title: 'Foundation/Button',
} as Meta;

type Story = StoryObj<typeof MznButton>;

/** React's Playground puts the label in `children`; here it is the slot. */
type PlaygroundArgs = Required<
  Pick<ButtonProps, 'disabled' | 'loading' | 'size' | 'variant'>
> & {
  children: string;
};

const sizes: ButtonSize[] = ['main', 'sub', 'minor'];
const variants: ButtonVariant[] = [
  'base-primary',
  'base-secondary',
  'base-tertiary',
  'base-ghost',
  'base-dashed',
  'base-text-link',
  'destructive-primary',
  'destructive-secondary',
  'destructive-ghost',
  'destructive-text-link',
  'inverse',
  'inverse-ghost',
];

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    loading: {
      control: {
        type: 'boolean',
      },
    },
    size: {
      options: sizes,
      control: {
        type: 'select',
      },
    },
    variant: {
      options: variants,
      control: {
        type: 'select',
      },
    },
  },
  args: {
    children: 'Button',
    disabled: false,
    loading: false,
    size: 'main',
    variant: 'base-primary',
  },
  render: (args) => ({
    components: { MznButton },
    setup: () => ({ args }),
    template: '<MznButton v-bind="args">{{ args.children }}</MznButton>',
  }),
};

export const Variants: Story = {
  render: () => ({
    components: { MznButton },
    template: `
      <div style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px">
        <MznButton variant="base-primary">Primary</MznButton>
        <MznButton variant="base-secondary">Secondary</MznButton>
        <MznButton variant="base-tertiary">Tertiary</MznButton>

        <MznButton variant="base-ghost">Ghost</MznButton>
        <MznButton variant="base-dashed">Dashed</MznButton>
        <MznButton variant="base-text-link">Text Link</MznButton>

        <MznButton variant="destructive-primary">Destructive Primary</MznButton>
        <MznButton variant="destructive-secondary">Destructive Secondary</MznButton>
        <MznButton variant="destructive-ghost">Destructive Ghost</MznButton>

        <MznButton variant="destructive-text-link">Destructive Text Link</MznButton>
        <MznButton variant="inverse">Inverse</MznButton>
        <MznButton variant="inverse-ghost">Inverse Ghost</MznButton>
        <MznButton variant="base-primary" disabled>
          Disabled
        </MznButton>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { MznButton },
    template: `
      <div
        style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px; align-items: center"
      >
        <MznButton size="main">Main</MznButton>
        <MznButton size="sub">Sub</MznButton>
        <MznButton size="minor">Minor</MznButton>

        <MznButton variant="base-secondary" size="main">
          Main
        </MznButton>
        <MznButton variant="base-secondary" size="sub">
          Sub
        </MznButton>
        <MznButton variant="base-secondary" size="minor">
          Minor
        </MznButton>

        <MznButton variant="destructive-primary" size="main">
          Main
        </MznButton>
        <MznButton variant="destructive-primary" size="sub">
          Sub
        </MznButton>
        <MznButton variant="destructive-primary" size="minor">
          Minor
        </MznButton>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: () => ({
    components: { MznButton },
    setup: () => ({ PlusIcon, SearchIcon }),
    template: `
      <div
        style="display: inline-grid; grid-template-columns: repeat(4, min-content); gap: 16px; align-items: center"
      >
        <!-- Leading icons -->
        <MznButton :icon="PlusIcon" icon-type="leading" variant="base-primary">
          Leading Icon
        </MznButton>
        <MznButton :icon="PlusIcon" icon-type="leading" variant="base-secondary">
          Leading Icon
        </MznButton>
        <MznButton :icon="PlusIcon" icon-type="leading" variant="destructive-primary">
          Leading Icon
        </MznButton>
        <MznButton
          disabled
          :icon="PlusIcon"
          icon-type="leading"
          variant="base-primary"
        >
          Disabled
        </MznButton>

        <!-- Trailing icons -->
        <MznButton :icon="SearchIcon" icon-type="trailing" variant="base-primary">
          Trailing Icon
        </MznButton>
        <MznButton :icon="SearchIcon" icon-type="trailing" variant="base-secondary">
          Trailing Icon
        </MznButton>
        <MznButton
          :icon="SearchIcon"
          icon-type="trailing"
          variant="destructive-primary"
        >
          Trailing Icon
        </MznButton>
        <MznButton
          :icon="SearchIcon"
          icon-type="trailing"
          size="sub"
          variant="base-primary"
        >
          Sub Size
        </MznButton>

        <!-- Icon only with tooltip (default behavior) -->
        <MznButton :icon="PlusIcon" icon-type="icon-only" variant="base-primary">
          Add new item
        </MznButton>
        <MznButton :icon="SearchIcon" icon-type="icon-only" variant="base-secondary">
          Search
        </MznButton>
        <MznButton
          :icon="PlusIcon"
          icon-type="icon-only"
          variant="destructive-primary"
        >
          Delete
        </MznButton>
        <MznButton
          :icon="PlusIcon"
          icon-type="icon-only"
          size="minor"
          variant="base-primary"
        >
          Add
        </MznButton>
      </div>
    `,
  }),
};

export const IconOnlyWithTooltip: Story = {
  render: () => ({
    components: { MznButton },
    setup: () => ({
      PlusIcon,
      SearchIcon,
      // React's style object appends `px` to a number; Vue's does not.
      gap: `${getNumericCSSVariablePixelValue('--mzn-spacing-gap-base')}px`,
    }),
    template: `
      <div
        :style="{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(4, min-content)',
          gap,
          alignItems: 'center',
          padding: '60px',
        }"
      >
        <!-- Default tooltip (bottom) -->
        <MznButton :icon="PlusIcon" icon-type="icon-only" variant="base-primary">
          Add new item
        </MznButton>

        <!-- Tooltip on top -->
        <MznButton
          :icon="SearchIcon"
          icon-type="icon-only"
          tooltip-position="top"
          variant="base-secondary"
        >
          Search
        </MznButton>

        <!-- Disabled tooltip -->
        <MznButton
          disabled-tooltip
          :icon="PlusIcon"
          icon-type="icon-only"
          variant="base-primary"
        >
          This tooltip is disabled
        </MznButton>

        <!-- Without children - no tooltip -->
        <MznButton :icon="SearchIcon" icon-type="icon-only" variant="base-secondary" />
      </div>
    `,
  }),
};

export const Loading: Story = {
  render: () => ({
    components: { MznButton },
    setup: () => ({ PlusIcon }),
    template: `
      <div
        style="display: inline-grid; grid-template-columns: repeat(4, min-content); gap: 16px; align-items: center"
      >
        <MznButton loading variant="base-primary">
          Loading
        </MznButton>
        <MznButton loading variant="base-secondary">
          Loading
        </MznButton>
        <MznButton :icon="PlusIcon" icon-type="leading" loading variant="base-primary">
          With Icon
        </MznButton>
        <MznButton
          :icon="PlusIcon"
          icon-type="icon-only"
          loading
          variant="base-primary"
        />
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    components: { MznButton },
    template: `
      <div
        style="display: inline-grid; grid-template-columns: repeat(3, min-content); gap: 16px; align-items: center"
      >
        <MznButton variant="base-primary">Normal</MznButton>
        <MznButton variant="base-primary" disabled>
          Disabled
        </MznButton>
        <MznButton variant="base-primary" loading>
          Loading
        </MznButton>

        <MznButton variant="base-secondary">Normal</MznButton>
        <MznButton variant="base-secondary" disabled>
          Disabled
        </MznButton>
        <MznButton variant="base-secondary" loading>
          Loading
        </MznButton>

        <MznButton variant="destructive-primary">Normal</MznButton>
        <MznButton variant="destructive-primary" disabled>
          Disabled
        </MznButton>
        <MznButton variant="destructive-primary" loading>
          Loading
        </MznButton>
      </div>
    `,
  }),
};

export const AsLink: Story = {
  render: () => ({
    components: { MznButton },
    setup: () => ({ SearchIcon }),
    template: `
      <div
        style="display: inline-grid; grid-template-columns: repeat(2, min-content); gap: 16px; align-items: center"
      >
        <!-- Native <a> tag -->
        <MznButton
          component="a"
          href="https://github.com/Mezzanine-UI/mezzanine"
          rel="noopener noreferrer"
          target="_blank"
          variant="base-primary"
        >
          GitHub (Opens in new tab)
        </MznButton>

        <MznButton component="a" href="#example" variant="base-secondary">
          Anchor Link
        </MznButton>

        <MznButton
          component="a"
          href="https://www.npmjs.com/package/@mezzanine-ui/react"
          :icon="SearchIcon"
          icon-type="trailing"
          rel="noopener noreferrer"
          target="_blank"
          variant="base-text-link"
        >
          NPM Package
        </MznButton>

        <MznButton
          component="a"
          disabled
          href="#disabled-link"
          variant="base-primary"
        >
          Disabled Link
        </MznButton>
      </div>
    `,
  }),
};

const dropdownOptions: DropdownOption[] = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
];

export const WithDropdown: Story = {
  render: () => ({
    components: { MznButton, MznDropdown },
    setup: () => ({ DotHorizontalIcon, dropdownOptions }),
    template: `
      <div>
        <MznDropdown :options="dropdownOptions" placement="bottom-start">
          <template #default="triggerProps">
            <MznButton
              v-bind="triggerProps"
              :icon="DotHorizontalIcon"
              icon-type="icon-only"
              variant="base-secondary"
            />
          </template>
        </MznDropdown>
      </div>
    `,
  }),
};

export const CustomComponent: Story = {
  render: () => {
    // Example: Custom Link component
    // This could be useful with Nuxt's NuxtLink, vue-router's RouterLink, etc.
    const CustomLink: FunctionalComponent<{ href?: string }> = (
      props,
      { attrs, slots },
    ) =>
      h(
        'a',
        {
          ...attrs,
          href: props.href,
          onClick: (event: MouseEvent) => {
            event.preventDefault();
            alert(`Navigating to: ${props.href}`);
          },
        },
        slots.default?.(),
      );

    CustomLink.props = { href: { type: String, required: false } };

    return {
      components: { MznButton },
      setup: () => ({ CustomLink, PlusIcon }),
      template: `
        <div
          style="display: inline-grid; grid-template-columns: repeat(2, min-content); gap: 16px; align-items: center"
        >
          <MznButton
            :component="CustomLink"
            href="/dashboard"
            variant="base-primary"
          >
            Custom Link Component
          </MznButton>

          <MznButton
            :component="CustomLink"
            href="/profile"
            :icon="PlusIcon"
            icon-type="leading"
            variant="base-secondary"
          >
            With Icon
          </MznButton>
        </div>
      `,
    };
  },
};
