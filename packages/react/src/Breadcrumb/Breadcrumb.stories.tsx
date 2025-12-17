import { StoryObj, Meta } from '@storybook/react-webpack5';
import Breadcrumb, { BreadcrumbProps } from '.';
import Typography from '../Typography';

export default {
  title: 'Data Display/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

type Story = StoryObj<BreadcrumbProps>;

export const Playground: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Category', href: '/Category' },
      { label: 'Parent of Current', href: '/Category/Parent' },
      { label: 'Current' },
    ],
  },
  argTypes: {},
};

const breadcrumbItem: BreadcrumbProps['items'] = [
  {
    label: 'Home',
    href: '/',
  },
  { label: 'Category', href: '/Category', target: '_blank' },
  { label: 'Subcategory', href: '/Category/Subcategory', target: '_blank' },
  { label: 'Tab', href: '/Category/Subcategory/Tab' },
  { label: 'Detail', href: '/Category/Subcategory/Tab/Detail' },
  { label: 'History', href: '/Category/Subcategory/Tab/Detail/History' },
];

export const All: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '40px',
      }}
    >
      <div style={{ display: 'grid', gap: '24px' }}>
        <Typography variant="h2">Default</Typography>

        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">3 items</Typography>
          <Breadcrumb items={breadcrumbItem.slice(0, 3)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">4 items</Typography>
          <Breadcrumb items={breadcrumbItem.slice(0, 4)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">5 items</Typography>
          <Breadcrumb items={breadcrumbItem.slice(0, 5)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">6 items</Typography>
          <Breadcrumb items={breadcrumbItem} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        <Typography variant="h2">Condensed Mode</Typography>

        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">2 items</Typography>
          <Breadcrumb condensed items={breadcrumbItem.slice(0, 2)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">3 items</Typography>
          <Breadcrumb condensed items={breadcrumbItem.slice(0, 3)} />
        </div>
        <div style={{ display: 'grid', gap: '8px' }}>
          <Typography variant="caption-highlight">4 items</Typography>
          <Breadcrumb condensed items={breadcrumbItem.slice(0, 4)} />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        <Typography variant="h2">Item With Dropdown</Typography>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'List', href: '/' },
            {
              label: 'History',
              href: '/',
              options: [
                { label: 'History', href: '/' },
                { label: 'Detail', href: '/' },
                { label: 'Order', href: '/' },
              ],
            },
            {
              label: '01',
              href: '/',
              options: [
                { label: '01', href: '/' },
                { label: '02', href: '/' },
                { label: '03', href: '/' },
              ],
            },
          ]}
        />
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Category', href: '/' },
            { label: 'Subcategory', href: '/' },
            { label: 'Tab', href: '/' },
            { label: 'Detail', href: '/' },
            { label: 'History', href: '/' },
          ]}
        />
      </div>
    </div>
  ),
};
