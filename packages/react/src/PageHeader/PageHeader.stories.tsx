import { Meta, StoryObj } from '@storybook/react-webpack5';
import PageHeader from '.';
import PageToolbar from '../PageToolbar';
import Button from '../Button';
import { MenuIcon } from '@mezzanine-ui/icons';
import Breadcrumb from '../Breadcrumb';

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
          Default
          <PageHeader title="Test Title" description="This is a description." />
        </div>
        <div>
          With Back Button
          <PageHeader title="Test Title" description="This is a description.">
            <a href="./" title="back" />
          </PageHeader>
          <PageHeader
            title="Page Title"
            description="This is a Description."
            onBackClick={() => {
              alert('Back button clicked');
            }}
          />
        </div>
        <div>
          With Breadcrumb
          <PageHeader title="Test Title" description="This is a description.">
            <Breadcrumb
              items={[
                { href: '/', label: 'Home' },
                { href: '/category', label: 'Category' },
              ]}
            />
          </PageHeader>
        </div>
        <div>
          Full features
          <PageHeader title="Page Title" description="This is a Description.">
            {/* back button: use component with href prop or <Button /> component */}
            <a href="./" title="back" />

            <Breadcrumb
              items={[
                { label: 'Home', href: '/' },
                { label: 'Category', href: '/' },
                { label: 'Detail', href: '/' },
                { label: 'History', href: '/' },
              ]}
            />

            <PageToolbar
              actions={{
                primaryButton: <Button>Primary</Button>,
                secondaryButton: <Button>Secondary</Button>,
              }}
              utilities={
                <Button
                  title="Button description"
                  icon={{ src: MenuIcon, position: 'icon-only' }}
                />
              }
            />
          </PageHeader>
        </div>
      </div>
    </>
  ),
};
