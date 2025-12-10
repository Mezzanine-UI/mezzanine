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
      <div>
        <PageHeader title="Page Title" description="This is a Description.">
          {/* back button: use component with href prop or <Button /> component */}
          <a href="./">BackButton</a>

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
    </>
  ),
};
