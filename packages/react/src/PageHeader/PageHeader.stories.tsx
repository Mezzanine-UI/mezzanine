import { Meta, StoryObj } from '@storybook/react-webpack5';
import PageHeader from '.';
import ContentHeader from '../ContentHeader';
import Button from '../Button';
import { MenuIcon } from '@mezzanine-ui/icons';
import Breadcrumb from '../Breadcrumb';
import BreadcrumbItem from '../Breadcrumb/BreadcrumbItem';
import Dropdown from '../Dropdown';

export default {
  title: 'Navigation/PageHeader',
  component: PageHeader,
} as Meta<typeof PageHeader>;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  render: () => (
    <>
      <div style={{ display: 'grid', gap: '24px' }}>
        <div>
          <PageHeader>
            <Breadcrumb>
              <BreadcrumbItem href="/" name="Home" />
              <BreadcrumbItem href="/category" name="Category" />
              <BreadcrumbItem href="/detail" name="Detail" />
              <BreadcrumbItem href="/history" name="History" />
            </Breadcrumb>

            <ContentHeader
              title="Page Title"
              description="This is a Description."
            >
              {/* back button: use component with href prop or <Button /> component */}
              <a href="./" title="back" />

              <Button variant="base-secondary">Secondary</Button>
              <Button>Primary</Button>

              <Dropdown
                placement="bottom-end"
                options={[
                  { id: '1', name: 'Option 1' },
                  { id: '2', name: 'Option 2' },
                ]}
              >
                <Button icon={MenuIcon} />
              </Dropdown>
            </ContentHeader>
          </PageHeader>
        </div>
      </div>
    </>
  ),
};
