import { Meta, StoryObj } from '@storybook/react-webpack5';
import PageToolbar from '.';
import Button from '../Button';
import { DotHorizontalIcon, MenuIcon, PlusIcon } from '@mezzanine-ui/icons';
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
          filter={<Input variant="search" placeholder="搜尋..." />}
          actions={{
            primaryButton: <Button>Primary</Button>,
            secondaryButton: <Button>Secondary</Button>,
            destructiveButton: <Button>Destructive</Button>,
          }}
          utilities={
            <>
              <Button
                title="Button description"
                onClick={() => {}}
                icon={{ src: PlusIcon, position: 'icon-only' }}
              />
              <Button
                title="Button description"
                onClick={() => {}}
                icon={{ src: MenuIcon, position: 'icon-only' }}
              />
              <Button
                onClick={() => {}}
                icon={{ src: DotHorizontalIcon, position: 'icon-only' }}
              />
            </>
          }
        />

        <PageToolbar
          size={'sub'}
          filter={<Input variant="search" placeholder="搜尋..." />}
          actions={{
            primaryButton: <Button>Primary</Button>,
            secondaryButton: <Button>Secondary</Button>,
            destructiveButton: <Button>Destructive</Button>,
          }}
          utilities={
            <>
              <Button
                title="Button description"
                onClick={() => {}}
                icon={{ src: PlusIcon, position: 'icon-only' }}
              />
              <Button
                title="Button description"
                onClick={() => {}}
                icon={{ src: MenuIcon, position: 'icon-only' }}
              />
              <Button
                onClick={() => {}}
                icon={{ src: DotHorizontalIcon, position: 'icon-only' }}
              />
            </>
          }
        />

        <PageToolbar
          size={'sub'}
          filter={<Input variant="search" placeholder="搜尋..." />}
          actions={<Button>Primary</Button>}
          utilities={
            <Button icon={{ src: DotHorizontalIcon, position: 'icon-only' }} />
          }
        />
      </div>
    </>
  ),
};
