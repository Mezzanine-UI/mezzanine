'use client';

import { StoryObj, Meta } from '@storybook/react-webpack5';
import Section, { SectionProps } from './Section';
import ContentHeader from '../ContentHeader';
import Input from '../Input';
import Button from '../Button';
import Dropdown from '../Dropdown';
import { DotHorizontalIcon } from '@mezzanine-ui/icons';
import { Filter, FilterArea, FilterLine } from '../FilterArea';
import { FormField } from '../Form';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import Tab, { TabItem } from '../Tab';

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
        gap: '24px',
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
