import { Component } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznBreadcrumb, MznBreadcrumbItem } from '@mezzanine-ui/ng/breadcrumb';
import { MznContentHeader } from '@mezzanine-ui/ng/content-header';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import {
  MznFilter,
  MznFilterArea,
  MznFilterLine,
} from '@mezzanine-ui/ng/filter-area';
import { MznFormField } from '@mezzanine-ui/ng/form';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznPageHeader } from '@mezzanine-ui/ng/page-header';
import { MznTabItem, MznTabs } from '@mezzanine-ui/ng/tab';
import { MznSection } from './section.component';
import { MznSectionGroup } from './section-group.component';

const SECTION_STORY_IMPORTS = [
  MznButton,
  MznButtonGroup,
  MznBreadcrumb,
  MznBreadcrumbItem,
  MznContentHeader,
  MznDropdown,
  MznFilterArea,
  MznFilter,
  MznFilterLine,
  MznFormField,
  MznIcon,
  MznInput,
  MznPageHeader,
  MznSection,
  MznSectionGroup,
  MznTabItem,
  MznTabs,
];

const dropdownOptions = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
];

const sampleContentHeader = (index: number): string => `
  <header mznContentHeader title="Section Title" description="This is a Description." size="sub">
    <div mznInput contentHeaderFilter variant="search" placeholder="Search..." size="sub" ></div>
    <div mznButtonGroup contentHeaderActions>
      <button mznButton variant="destructive-secondary" size="sub" type="button">Destructive</button>
      <button mznButton variant="base-secondary" size="sub" type="button">Secondary</button>
      <button mznButton size="sub" type="button">Primary</button>
    </div>
    <span contentHeaderUtilities style="display: contents">
      <button #sectionMoreAnchor${index} mznButton variant="base-secondary" size="sub" iconType="icon-only" type="button">
        <i mznIcon [icon]="dotHorizontalIcon" [size]="16"></i>
      </button>
      <div mznDropdown
        [anchor]="sectionMoreAnchor${index}"
        [open]="false"
        [options]="dropdownOptions"
        placement="bottom-end"
      ></div>
    </span>
  </header>
`;

const sampleFilterArea = `
  <div mznFilterArea actionsAlign="end" resetText="Reset" size="sub" submitText="Search">
    <div mznFilterLine>
      <div mznFilter [span]="2">
        <div mznFormField label="Label" name="name" [density]="filterDensity" [layout]="filterLayout">
          <div mznInput placeholder="Enter" size="sub" ></div>
        </div>
      </div>
      <div mznFilter [span]="2">
        <div mznFormField label="Label" name="remark" [density]="filterDensity" [layout]="filterLayout">
          <div mznInput placeholder="Enter" size="sub" ></div>
        </div>
      </div>
    </div>
  </div>
`;

const sampleTab = `
  <div mznTabs direction="horizontal">
    <button mznTabItem key="0" type="button">TabItem 1</button>
    <button mznTabItem key="1" type="button">TabItem 2</button>
    <button mznTabItem key="2" type="button">TabItem 3</button>
  </div>
`;

const sampleContent = `
  <div style="background-color: #F9FAFB; padding: 16px; min-height: var(--mzn-spacing-size-container-small);">
    Content of Section
  </div>
`;

@Component({
  selector: '[storySectionAll]',
  standalone: true,
  imports: SECTION_STORY_IMPORTS,
  host: {
    style:
      'background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); padding: 16px;',
  },
  template: `
    <!-- All Props: contentHeader + filterArea + tab -->
    <div mznSection>
      ${sampleContentHeader(0)} ${sampleFilterArea} ${sampleTab}
      ${sampleContent}
    </div>

    <!-- contentHeader + filterArea -->
    <div mznSection>
      ${sampleContentHeader(1)} ${sampleFilterArea} ${sampleContent}
    </div>

    <!-- contentHeader + tab -->
    <div mznSection>
      ${sampleContentHeader(2)} ${sampleTab} ${sampleContent}
    </div>

    <!-- filterArea + tab -->
    <div mznSection> ${sampleFilterArea} ${sampleTab} ${sampleContent} </div>

    <!-- contentHeader only -->
    <div mznSection> ${sampleContentHeader(3)} ${sampleContent} </div>

    <!-- filterArea only -->
    <div mznSection> ${sampleFilterArea} ${sampleContent} </div>

    <!-- tab only -->
    <div mznSection> ${sampleTab} ${sampleContent} </div>

    <!-- Content only (no props) -->
    <div mznSection> ${sampleContent} </div>
  `,
})
class StorySectionAll {
  readonly dotHorizontalIcon = DotHorizontalIcon;
  readonly dropdownOptions = dropdownOptions;
  readonly filterDensity = FormFieldDensity.BASE;
  readonly filterLayout = FormFieldLayout.HORIZONTAL;
}

@Component({
  selector: '[storySectionVertical]',
  standalone: true,
  imports: SECTION_STORY_IMPORTS,
  host: {
    style:
      'background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); padding: 16px;',
  },
  template: `
    <header mznPageHeader>
      <nav mznBreadcrumb [items]="breadcrumbItems"></nav>
      <header mznContentHeader title="Page Title">
        <div mznButtonGroup contentHeaderActions>
          <button mznButton variant="base-secondary" type="button"
            >Secondary</button
          >
          <button mznButton type="button">Primary</button>
        </div>
      </header>
    </header>

    <div mznSectionGroup>
      <div mznSectionGroup direction="horizontal">
        <div mznSection> ${sampleContentHeader(0)} ${sampleContent} </div>
        <div mznSection> ${sampleContentHeader(1)} ${sampleContent} </div>
      </div>

      <div mznSection>
        ${sampleContentHeader(2)} ${sampleFilterArea} ${sampleTab}
        ${sampleContent}
      </div>
    </div>
  `,
})
class StorySectionVertical {
  readonly dotHorizontalIcon = DotHorizontalIcon;
  readonly dropdownOptions = dropdownOptions;
  readonly filterDensity = FormFieldDensity.BASE;
  readonly filterLayout = FormFieldLayout.HORIZONTAL;
  readonly breadcrumbItems = [
    { id: 'home', name: 'Home', href: '/' },
    { id: 'page', name: 'Page', href: '/1' },
    { id: 'history', name: 'History', href: '/' },
  ];
}

@Component({
  selector: '[storySectionContentVertical]',
  standalone: true,
  imports: SECTION_STORY_IMPORTS,
  host: {
    style:
      'background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm); padding: 16px;',
  },
  template: `
    <header mznPageHeader>
      <header mznContentHeader title="Page Title"></header>
    </header>

    <div mznSection>
      ${sampleContentHeader(0)}
      <div
        style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm);"
      >
        <div
          style="background-color: #F9FAFB; min-height: var(--mzn-spacing-size-container-small); padding: 16px;"
        >
          Content of Section 1
        </div>

        <div style="display: flex; gap: var(--mzn-spacing-gap-calm);">
          <div
            style="background-color: #F9FAFB; flex: 1; min-height: var(--mzn-spacing-size-container-small); padding: 16px;"
          >
            Content of Section 2
          </div>
          <div
            style="background-color: #F9FAFB; flex: 1; min-height: var(--mzn-spacing-size-container-small); padding: 16px;"
          >
            Content of Section 3
          </div>
          <div
            style="background-color: #F9FAFB; flex: 1; min-height: var(--mzn-spacing-size-container-small); padding: 16px;"
          >
            Content of Section 4
          </div>
        </div>
      </div>
    </div>
  `,
})
class StorySectionContentVertical {
  readonly dotHorizontalIcon = DotHorizontalIcon;
  readonly dropdownOptions = dropdownOptions;
}

const meta: Meta = {
  title: 'Data Display/Section',
  decorators: [
    moduleMetadata({
      imports: [
        StorySectionAll,
        StorySectionVertical,
        StorySectionContentVertical,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

export const All: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({ template: `<div storySectionAll></div>` }),
};

export const SectionVerticalLayout: Story = {
  name: 'Section Vertical',
  parameters: { controls: { disable: true } },
  render: () => ({ template: `<div storySectionVertical></div>` }),
};

export const ContentVerticalLayout: Story = {
  name: 'Content Vertical',
  parameters: { controls: { disable: true } },
  render: () => ({ template: `<div storySectionContentVertical></div>` }),
};
