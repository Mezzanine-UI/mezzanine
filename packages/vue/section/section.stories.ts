import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h } from 'vue';
import type { VNode } from 'vue';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import MznBreadcrumbItem from '../breadcrumb/breadcrumb-item.vue';
import MznBreadcrumb from '../breadcrumb/breadcrumb.vue';
import MznButton from '../button/button.vue';
import MznContentHeader from '../content-header/content-header.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznFilterArea from '../filter-area/filter-area.vue';
import MznFilterLine from '../filter-area/filter-line.vue';
import MznFilter from '../filter-area/filter.vue';
import MznFormField from '../form/form-field.vue';
import MznInput from '../input/input.vue';
import MznPageHeader from '../page-header/page-header.vue';
import MznTabItem from '../tab/tab-item.vue';
import MznTab from '../tab/tab.vue';
import MznSectionGroup from './section-group.vue';
import MznSection from './section.vue';
import type { SectionProps } from './section.types';

export default {
  title: 'Data Display/Section',
  component: MznSection,
} satisfies Meta<typeof MznSection>;

type Story = StoryObj<SectionProps>;

/**
 * Factories rather than shared constants: a vnode can only be mounted once,
 * and every story puts these into several sections.
 */
const sampleContentHeader = (): VNode =>
  h(
    MznContentHeader,
    {
      description: 'This is a Description.',
      size: 'sub',
      title: 'Section Title',
    },
    () => [
      h(MznInput, { placeholder: 'Search...', variant: 'search' }),
      h(MznButton, { variant: 'destructive-secondary' }, () => 'Destructive'),
      h(MznButton, { variant: 'base-secondary' }, () => 'Secondary'),
      h(MznButton, null, () => 'Primary'),
      h(
        MznDropdown,
        {
          options: [
            { id: '1', name: 'Option 1' },
            { id: '2', name: 'Option 2' },
          ],
          placement: 'bottom-end',
        },
        {
          default: (trigger: Record<string, unknown>) =>
            h(MznButton, { ...trigger, icon: DotHorizontalIcon }),
        },
      ),
    ],
  );

const sampleFilterArea = (): VNode =>
  h(
    MznFilterArea,
    {
      actionsAlign: 'end',
      resetText: 'Reset',
      size: 'sub',
      submitText: 'Search',
    },
    () =>
      h(MznFilterLine, null, () => [
        h(MznFilter, { span: 2 }, () =>
          h(
            MznFormField,
            {
              density: FormFieldDensity.BASE,
              label: 'Label',
              layout: FormFieldLayout.HORIZONTAL,
              name: 'name',
            },
            () => h(MznInput, { placeholder: 'Enter', size: 'sub' }),
          ),
        ),
        h(MznFilter, { span: 2 }, () =>
          h(
            MznFormField,
            {
              density: FormFieldDensity.BASE,
              label: 'Label',
              layout: FormFieldLayout.HORIZONTAL,
              name: 'remark',
            },
            () => h(MznInput, { placeholder: 'Enter', size: 'sub' }),
          ),
        ),
      ]),
  );

const sampleTab = (): VNode =>
  h(MznTab, { direction: 'horizontal' }, () => [
    h(MznTabItem, null, () => 'TabItem 1'),
    h(MznTabItem, null, () => 'TabItem 2'),
    h(MznTabItem, null, () => 'TabItem 3'),
  ]);

const STORY_COMPONENTS = {
  MznBreadcrumb,
  MznBreadcrumbItem,
  MznButton,
  MznContentHeader,
  MznPageHeader,
  MznSection,
  MznSectionGroup,
};

const SAMPLE_CONTENT_STYLE =
  'background-color: #F9FAFB; padding: 16px; min-height: var(--mzn-spacing-size-container-small)';

const WRAPPER_STYLE =
  'background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); padding: 16px';

export const All: Story = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      SAMPLE_CONTENT_STYLE,
      WRAPPER_STYLE,
      sampleContentHeader,
      sampleFilterArea,
      sampleTab,
    }),
    template: `
      <div :style="WRAPPER_STYLE">
        <!-- All Props: contentHeader + filterArea + tab -->
        <MznSection
          :contentHeader="sampleContentHeader()"
          :filterArea="sampleFilterArea()"
          :tab="sampleTab()"
        >
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- contentHeader + filterArea -->
        <MznSection
          :contentHeader="sampleContentHeader()"
          :filterArea="sampleFilterArea()"
        >
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- contentHeader + tab -->
        <MznSection :contentHeader="sampleContentHeader()" :tab="sampleTab()">
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- filterArea + tab -->
        <MznSection :filterArea="sampleFilterArea()" :tab="sampleTab()">
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- contentHeader only -->
        <MznSection :contentHeader="sampleContentHeader()">
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- filterArea only -->
        <MznSection :filterArea="sampleFilterArea()">
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- tab only -->
        <MznSection :tab="sampleTab()">
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>

        <!-- Content only (no props) -->
        <MznSection>
          <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
        </MznSection>
      </div>
    `,
  }),
};

export const SectionVerticalLayout: Story = {
  name: 'Section Vertical',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({
      SAMPLE_CONTENT_STYLE,
      WRAPPER_STYLE,
      sampleContentHeader,
      sampleFilterArea,
      sampleTab,
    }),
    template: `
      <div :style="WRAPPER_STYLE">
        <MznPageHeader>
          <MznBreadcrumb>
            <MznBreadcrumbItem name="Home" href="/" />
            <MznBreadcrumbItem name="Page" href="/1" />
            <MznBreadcrumbItem name="History" href="/" />
          </MznBreadcrumb>
          <MznContentHeader title="Page Title">
            <MznButton variant="base-secondary">Secondary</MznButton>
            <MznButton>Primary</MznButton>
          </MznContentHeader>
        </MznPageHeader>

        <MznSectionGroup>
          <MznSectionGroup direction="horizontal">
            <MznSection :contentHeader="sampleContentHeader()">
              <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
            </MznSection>
            <MznSection :contentHeader="sampleContentHeader()">
              <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
            </MznSection>
          </MznSectionGroup>

          <MznSection
            :contentHeader="sampleContentHeader()"
            :filterArea="sampleFilterArea()"
            :tab="sampleTab()"
          >
            <div :style="SAMPLE_CONTENT_STYLE">Content of Section</div>
          </MznSection>
        </MznSectionGroup>
      </div>
    `,
  }),
};

export const ContentVerticalLayout: Story = {
  name: 'Content Vertical',
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({ WRAPPER_STYLE, sampleContentHeader }),
    template: `
      <div :style="WRAPPER_STYLE">
        <MznPageHeader>
          <MznContentHeader title="Page Title" />
        </MznPageHeader>

        <MznSection :contentHeader="sampleContentHeader()">
          <div style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm)">
            <div
              style="background-color: #F9FAFB; min-height: var(--mzn-spacing-size-container-small); padding: 16px"
            >
              Content of Section 1
            </div>

            <div style="display: flex; gap: var(--mzn-spacing-gap-calm)">
              <div
                style="background-color: #F9FAFB; flex: 1; min-height: var(--mzn-spacing-size-container-small); padding: 16px"
              >
                Content of Section 2
              </div>
              <div
                style="background-color: #F9FAFB; flex: 1; min-height: var(--mzn-spacing-size-container-small); padding: 16px"
              >
                Content of Section 3
              </div>
              <div
                style="background-color: #F9FAFB; flex: 1; min-height: var(--mzn-spacing-size-container-small); padding: 16px"
              >
                Content of Section 4
              </div>
            </div>
          </div>
        </MznSection>
      </div>
    `,
  }),
};
