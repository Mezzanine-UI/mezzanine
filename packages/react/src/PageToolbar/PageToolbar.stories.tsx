import { Meta, StoryObj } from '@storybook/react-webpack5';
import PageToolbar from '.';
import { DotHorizontalIcon, MenuIcon, PlusIcon } from '@mezzanine-ui/icons';
import Button from '../Button';
import Input from '../Input';

export default {
  title: 'Navigation/PageToolbar',
  component: PageToolbar,
} as Meta<typeof PageToolbar>;

type Story = StoryObj<typeof PageToolbar>;

export const Default: Story = {
  render: () => (
    <>
      <div style={{ display: 'grid', gap: '24px' }}>
        <PageToolbar
          size={'main'}
          filter={{
            variant: 'search',
            placeholder: '搜尋...',
          }}
          actions={{
            primaryButton: { children: 'Primary', onClick: () => {} },
            secondaryButton: { children: 'Secondary', onClick: () => {} },
            destructiveButton: { children: 'Destructive', onClick: () => {} },
          }}
          utilities={[
            {
              icon: PlusIcon,
              onClick: () => {},
            },
            {
              icon: MenuIcon,
              onClick: () => {},
            },
            {
              icon: DotHorizontalIcon,
              onClick: () => {},
            },
          ]}
        />

        <PageToolbar
          size={'sub'}
          filter={{
            variant: 'search',
            placeholder: '搜尋...',
          }}
          actions={{
            primaryButton: { children: 'Primary', onClick: () => {} },
          }}
          utilities={[
            {
              icon: DotHorizontalIcon,
              onClick: () => {},
            },
          ]}
        />

        <PageToolbar size="sub">
          <Input variant="search" placeholder="Search..." />
          <Button>Destructive</Button>
          <Button>Secondary</Button>
          <Button>Primary</Button>
          <>
            <Button icon={PlusIcon} iconType="icon-only" />
            <Button icon={DotHorizontalIcon} iconType="icon-only" />
          </>
        </PageToolbar>
      </div>
    </>
  ),
};
