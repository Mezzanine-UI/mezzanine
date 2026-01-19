import { Meta, StoryObj } from '@storybook/react-webpack5';
import ContentHeader from '.';
import { DotHorizontalIcon, MenuIcon, PlusIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import Input from '../Input';
import Dropdown from '../Dropdown';

export default {
  title: 'Navigation/ContentHeader',
  component: ContentHeader,
} as Meta<typeof ContentHeader>;

type Story = StoryObj<typeof ContentHeader>;

export const Default: Story = {
  render: () => (
    <>
      <div style={{ display: 'grid', gap: '24px', maxWidth: '1280px' }}>
        <ContentHeader
          size="main"
          title={'ContentHeader with full children'}
          description="main size full content."
        >
          <a
            href="/?path=/story/navigation-contentheader--default&clickBack=main"
            title="back"
          />
          <Input variant="search" placeholder="Search..." />
          <Button variant="destructive-secondary">Destructive</Button>
          <Button variant="base-secondary">Secondary</Button>
          <Button>Primary</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              placement="bottom-end"
              options={[
                { id: '1', name: 'Option 1' },
                { id: '2', name: 'Option 2' },
              ]}
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>

        <ContentHeader
          size="sub"
          title={'ContentHeader with full children'}
          description="sub size full content."
        >
          <a
            href="/?path=/story/navigation-contentheader--default&clickBack=sub"
            title="back"
          />
          <Input variant="search" placeholder="Search..." />
          <Button variant="destructive-secondary">Destructive</Button>
          <Button variant="base-secondary">Secondary</Button>
          <Button>Primary</Button>
          <>
            <Button icon={PlusIcon} />
            <Dropdown
              placement="bottom-end"
              options={[
                { id: '1', name: 'Option 1' },
                { id: '2', name: 'Option 2' },
              ]}
            >
              <Button icon={DotHorizontalIcon} />
            </Dropdown>
          </>
        </ContentHeader>

        <ContentHeader
          title={'ContentHeader only props'}
          description="main size"
          size={'main'}
          onBackClick={() => alert('onBackClick triggered')}
          filter={{
            variant: 'search',
            placeholder: 'Search...',
          }}
          actions={[
            { variant: 'base-primary', children: 'Primary' },
            { variant: 'base-secondary', children: 'Secondary' },
            { variant: 'destructive-secondary', children: 'Destructive' },
          ]}
          utilities={[
            {
              icon: PlusIcon,
              onClick: () => {},
            },
            {
              icon: MenuIcon,
              onClick: () => {},
            },
            // dropdown utility
            {
              options: [
                { id: '1', name: 'Option 1' },
                { id: '2', name: 'Option 2' },
              ],
              children: <Button icon={DotHorizontalIcon} />,
            },
          ]}
        />
      </div>
    </>
  ),
};
