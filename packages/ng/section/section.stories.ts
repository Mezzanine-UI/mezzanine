import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznBreadcrumb, MznBreadcrumbItem } from '@mezzanine-ui/ng/breadcrumb';
import { MznContentHeader } from '@mezzanine-ui/ng/content-header';
import {
  MznFilter,
  MznFilterArea,
  MznFilterLine,
} from '@mezzanine-ui/ng/filter-area';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznPageHeader } from '@mezzanine-ui/ng/page-header';
import { MznTabItem, MznTabs } from '@mezzanine-ui/ng/tab';
import { MznSection } from './section.component';
import { MznSectionGroup } from './section-group.component';

const meta: Meta = {
  title: 'Data Display/Section',
  decorators: [
    moduleMetadata({
      imports: [
        MznButton,
        MznBreadcrumb,
        MznBreadcrumbItem,
        MznContentHeader,
        MznFilterArea,
        MznFilter,
        MznFilterLine,
        MznInput,
        MznPageHeader,
        MznSection,
        MznSectionGroup,
        MznTabItem,
        MznTabs,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj;

const sampleContent = `
  <div style="background-color: #F9FAFB; padding: 16px; min-height: 120px;">
    Content of Section
  </div>
`;

export const All: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm, 16px); padding: 16px;">
        <!-- All Props: contentHeader + filterArea + tab -->
        <div mznSection>
          <header mznContentHeader title="Section Title" description="This is a Description." size="sub">
            <div mznInput placeholder="Search..." variant="search" ></div>
            <button mznButton variant="destructive-secondary">Destructive</button>
            <button mznButton variant="base-secondary">Secondary</button>
            <button mznButton>Primary</button>
          </header>
          <mzn-filter-area actionsAlign="end" resetText="Reset" size="sub" submitText="Search">
            <mzn-filter-line>
              <mzn-filter [span]="2">
                <div mznInput placeholder="Enter" size="sub" ></div>
              </mzn-filter>
              <mzn-filter [span]="2">
                <div mznInput placeholder="Enter" size="sub" ></div>
              </mzn-filter>
            </mzn-filter-line>
          </mzn-filter-area>
          <mzn-tabs>
            <mzn-tab-item>TabItem 1</mzn-tab-item>
            <mzn-tab-item>TabItem 2</mzn-tab-item>
            <mzn-tab-item>TabItem 3</mzn-tab-item>
          </mzn-tabs>
          ${sampleContent}
        </div>

        <!-- contentHeader + filterArea -->
        <div mznSection>
          <header mznContentHeader title="Section Title" description="This is a Description." size="sub">
            <button mznButton variant="base-secondary">Secondary</button>
            <button mznButton>Primary</button>
          </header>
          <mzn-filter-area actionsAlign="end" resetText="Reset" size="sub" submitText="Search">
            <mzn-filter-line>
              <mzn-filter [span]="2">
                <div mznInput placeholder="Enter" size="sub" ></div>
              </mzn-filter>
            </mzn-filter-line>
          </mzn-filter-area>
          ${sampleContent}
        </div>

        <!-- contentHeader + tab -->
        <div mznSection>
          <header mznContentHeader title="Section Title" description="This is a Description." size="sub">
            <button mznButton variant="base-secondary">Secondary</button>
            <button mznButton>Primary</button>
          </header>
          <mzn-tabs>
            <mzn-tab-item>TabItem 1</mzn-tab-item>
            <mzn-tab-item>TabItem 2</mzn-tab-item>
            <mzn-tab-item>TabItem 3</mzn-tab-item>
          </mzn-tabs>
          ${sampleContent}
        </div>

        <!-- filterArea + tab -->
        <div mznSection>
          <mzn-filter-area actionsAlign="end" resetText="Reset" size="sub" submitText="Search">
            <mzn-filter-line>
              <mzn-filter [span]="2">
                <div mznInput placeholder="Enter" size="sub" ></div>
              </mzn-filter>
            </mzn-filter-line>
          </mzn-filter-area>
          <mzn-tabs>
            <mzn-tab-item>TabItem 1</mzn-tab-item>
            <mzn-tab-item>TabItem 2</mzn-tab-item>
            <mzn-tab-item>TabItem 3</mzn-tab-item>
          </mzn-tabs>
          ${sampleContent}
        </div>

        <!-- contentHeader only -->
        <div mznSection>
          <header mznContentHeader title="Section Title" description="This is a Description." size="sub">
            <button mznButton>Primary</button>
          </header>
          ${sampleContent}
        </div>

        <!-- filterArea only -->
        <div mznSection>
          <mzn-filter-area actionsAlign="end" resetText="Reset" size="sub" submitText="Search">
            <mzn-filter-line>
              <mzn-filter [span]="2">
                <div mznInput placeholder="Enter" size="sub" ></div>
              </mzn-filter>
            </mzn-filter-line>
          </mzn-filter-area>
          ${sampleContent}
        </div>

        <!-- tab only -->
        <div mznSection>
          <mzn-tabs>
            <mzn-tab-item>TabItem 1</mzn-tab-item>
            <mzn-tab-item>TabItem 2</mzn-tab-item>
            <mzn-tab-item>TabItem 3</mzn-tab-item>
          </mzn-tabs>
          ${sampleContent}
        </div>

        <!-- Content only (no props) -->
        <div mznSection>
          ${sampleContent}
        </div>
      </div>
    `,
  }),
};

export const SectionVerticalLayout: Story = {
  name: 'Section Vertical',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm, 16px); padding: 16px;">
        <header mznPageHeader>
          <nav mznBreadcrumb>
            <span mznBreadcrumbItem name="Home" href="/" ></span>
            <span mznBreadcrumbItem name="Page" href="/1" ></span>
            <span mznBreadcrumbItem name="History" href="/" ></span>
          </nav>
          <header mznContentHeader title="Page Title">
            <button mznButton variant="base-secondary">Secondary</button>
            <button mznButton>Primary</button>
          </header>
        </header>

        <div mznSectionGroup>
          <div mznSectionGroup direction="horizontal">
            <div mznSection>
              <header mznContentHeader title="Section Title" description="This is a Description." size="sub" ></header>
              <div style="background-color: #F9FAFB; padding: 16px; min-height: 120px;">Content of Section</div>
            </div>
            <div mznSection>
              <header mznContentHeader title="Section Title" description="This is a Description." size="sub" ></header>
              <div style="background-color: #F9FAFB; padding: 16px; min-height: 120px;">Content of Section</div>
            </div>
          </div>

          <div mznSection>
            <header mznContentHeader title="Section Title" description="This is a Description." size="sub">
              <button mznButton variant="base-secondary">Secondary</button>
              <button mznButton>Primary</button>
            </header>
            <mzn-filter-area actionsAlign="end" resetText="Reset" size="sub" submitText="Search">
              <mzn-filter-line>
                <mzn-filter [span]="2">
                  <div mznInput placeholder="Enter" size="sub" ></div>
                </mzn-filter>
              </mzn-filter-line>
            </mzn-filter-area>
            <mzn-tabs>
              <mzn-tab-item>TabItem 1</mzn-tab-item>
              <mzn-tab-item>TabItem 2</mzn-tab-item>
              <mzn-tab-item>TabItem 3</mzn-tab-item>
            </mzn-tabs>
            <div style="background-color: #F9FAFB; padding: 16px; min-height: 120px;">Content of Section</div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const ContentVerticalLayout: Story = {
  name: 'Content Vertical',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="background-color: #F3F4F6; display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm, 16px); padding: 16px;">
        <header mznPageHeader>
          <header mznContentHeader title="Page Title" ></header>
        </header>

        <div mznSection>
          <header mznContentHeader title="Section Title" description="This is a Description." size="sub" ></header>
          <div style="display: flex; flex-direction: column; gap: var(--mzn-spacing-gap-calm, 16px);">
            <div style="background-color: #F9FAFB; min-height: 120px; padding: 16px;">
              Content of Section 1
            </div>

            <div style="display: flex; gap: var(--mzn-spacing-gap-calm, 16px);">
              <div style="background-color: #F9FAFB; flex: 1; min-height: 120px; padding: 16px;">
                Content of Section 2
              </div>
              <div style="background-color: #F9FAFB; flex: 1; min-height: 120px; padding: 16px;">
                Content of Section 3
              </div>
              <div style="background-color: #F9FAFB; flex: 1; min-height: 120px; padding: 16px;">
                Content of Section 4
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
