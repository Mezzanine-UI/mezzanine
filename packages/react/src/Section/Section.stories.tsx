'use client';

import { StoryObj, Meta } from '@storybook/react-webpack5';
import Section, { SectionProps } from './Section';
import Breadcrumb from '../Breadcrumb';
import Button from '../Button';
import ContentHeader from '../ContentHeader';
import Dropdown from '../Dropdown';
import { Filter, FilterArea, FilterLine } from '../FilterArea';
import { FormField } from '../Form';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import Input from '../Input';
import PageHeader from '../PageHeader';
import SectionGroup from './SectionGroup';
import Tab, { TabItem } from '../Tab';
import BreadcrumbItem from '../Breadcrumb/BreadcrumbItem';

export default {
  title: 'Data Display/Section',
  component: Section,
} satisfies Meta<typeof Section>;

type Story = StoryObj<SectionProps>;

const sampleContentHeader = (
  <ContentHeader
    description="This is a Description."
    size="sub"
    title="Section Title"
  >
    <Input placeholder="Search..." variant="search" />
    <Button variant="destructive-secondary">Destructive</Button>
    <Button variant="base-secondary">Secondary</Button>
    <Button>Primary</Button>
    <Dropdown
      options={[
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
      ]}
      placement="bottom-end"
    >
      <Button icon={DotHorizontalIcon} />
    </Dropdown>
  </ContentHeader>
);

const sampleFilterArea = (
  <FilterArea
    actionsAlign="end"
    resetText="Reset"
    size="sub"
    submitText="Search"
  >
    <FilterLine>
      <Filter span={2}>
        <FormField
          label="Label"
          name="name"
          density={FormFieldDensity.BASE}
          layout={FormFieldLayout.HORIZONTAL}
        >
          <Input placeholder="Enter" size="sub" />
        </FormField>
      </Filter>
      <Filter span={2}>
        <FormField
          label="Label"
          name="remark"
          density={FormFieldDensity.BASE}
          layout={FormFieldLayout.HORIZONTAL}
        >
          <Input placeholder="Enter" size="sub" />
        </FormField>
      </Filter>
    </FilterLine>
  </FilterArea>
);

const sampleTab = (
  <Tab direction="horizontal">
    <TabItem>TabItem 1</TabItem>
    <TabItem>TabItem 2</TabItem>
    <TabItem>TabItem 3</TabItem>
  </Tab>
);

const sampleContent = (
  <div
    style={{
      backgroundColor: '#F9FAFB',
      padding: '16px',
      minHeight: 'var(--mzn-spacing-size-container-small)',
    }}
  >
    Content of Section
  </div>
);

export const All: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: '#F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--mzn-spacing-gap-calm)',
        padding: '16px',
      }}
    >
      {/* All Props: contentHeader + filterArea + tab */}
      <Section
        contentHeader={sampleContentHeader}
        filterArea={sampleFilterArea}
        tab={sampleTab}
      >
        {sampleContent}
      </Section>

      {/* contentHeader + filterArea */}
      <Section
        contentHeader={sampleContentHeader}
        filterArea={sampleFilterArea}
      >
        {sampleContent}
      </Section>

      {/* contentHeader + tab */}
      <Section contentHeader={sampleContentHeader} tab={sampleTab}>
        {sampleContent}
      </Section>

      {/* filterArea + tab */}
      <Section filterArea={sampleFilterArea} tab={sampleTab}>
        {sampleContent}
      </Section>

      {/* contentHeader only */}
      <Section contentHeader={sampleContentHeader}>{sampleContent}</Section>

      {/* filterArea only */}
      <Section filterArea={sampleFilterArea}>{sampleContent}</Section>

      {/* tab only */}
      <Section tab={sampleTab}>{sampleContent}</Section>

      {/* Content only (no props) */}
      <Section>{sampleContent}</Section>
    </div>
  ),
};

export const SectionVerticalLayout: Story = {
  name: 'Section Vertical',
  render: () => (
    <div
      style={{
        backgroundColor: '#F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--mzn-spacing-gap-calm)',
        padding: '16px',
      }}
    >
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbItem name="Home" href="/" />
          <BreadcrumbItem name="Page" href="/1" />
          <BreadcrumbItem name="History" href="/" />
        </Breadcrumb>
        <ContentHeader title="Page Title">
          <Button variant="base-secondary">Secondary</Button>
          <Button>Primary</Button>
        </ContentHeader>
      </PageHeader>

      <SectionGroup>
        <SectionGroup direction="horizontal">
          <Section contentHeader={sampleContentHeader}>{sampleContent}</Section>
          <Section contentHeader={sampleContentHeader}>{sampleContent}</Section>
        </SectionGroup>

        <Section
          contentHeader={sampleContentHeader}
          filterArea={sampleFilterArea}
          tab={sampleTab}
        >
          {sampleContent}
        </Section>
      </SectionGroup>
    </div>
  ),
};

export const ContentVerticalLayout: Story = {
  name: 'Content Vertical',
  render: () => (
    <div
      style={{
        backgroundColor: '#F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--mzn-spacing-gap-calm)',
        padding: '16px',
      }}
    >
      <PageHeader>
        <ContentHeader title="Page Title" />
      </PageHeader>

      <Section contentHeader={sampleContentHeader}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--mzn-spacing-gap-calm)',
          }}
        >
          <div
            style={{
              backgroundColor: '#F9FAFB',
              minHeight: 'var(--mzn-spacing-size-container-small)',
              padding: '16px',
            }}
          >
            Content of Section 1
          </div>

          <div style={{ display: 'flex', gap: 'var(--mzn-spacing-gap-calm)' }}>
            <div
              style={{
                backgroundColor: '#F9FAFB',
                flex: '1',
                minHeight: 'var(--mzn-spacing-size-container-small)',
                padding: '16px',
              }}
            >
              Content of Section 2
            </div>
            <div
              style={{
                backgroundColor: '#F9FAFB',
                flex: '1',
                minHeight: 'var(--mzn-spacing-size-container-small)',
                padding: '16px',
              }}
            >
              Content of Section 3
            </div>
            <div
              style={{
                backgroundColor: '#F9FAFB',
                flex: '1',
                minHeight: 'var(--mzn-spacing-size-container-small)',
                padding: '16px',
              }}
            >
              Content of Section 4
            </div>
          </div>
        </div>
      </Section>
    </div>
  ),
};
