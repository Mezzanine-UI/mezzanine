import { StoryObj, Meta } from '@storybook/react-webpack5';
import Breadcrumb, { BreadcrumbProps } from '.';
import Typography from '../Typography';
import BreadcrumbItem from './BreadcrumbItem';

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

type Story = StoryObj<BreadcrumbProps>;

export const Playground: Story = {
  args: {
    items: [
      { name: 'Home', href: '/' },
      { name: 'Category', href: '/Category' },
      { name: 'Parent of Current', href: '/Category/Parent' },
      { name: 'Current' },
    ],
  },
  argTypes: {},
};

const breadcrumbItem: BreadcrumbProps['items'] = [
  {
    name: 'Home',
    href: '/',
  },
  { name: 'Category', href: '/Category', target: '_blank' },
  { name: 'Subcategory', href: '/Category/Subcategory', target: '_blank' },
  { name: 'Tab', href: '/Category/Subcategory/Tab' },
  { name: 'Detail', href: '/Category/Subcategory/Tab/Detail' },
  { name: 'History', href: '/Category/Subcategory/Tab/Detail/History' },
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
        paddingBottom: '160px',
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
            { name: 'Home', href: '/' },
            { name: 'List', href: '/' },
            {
              name: 'History',
              href: '/',
              options: [
                { name: 'History', href: '/' },
                { name: 'Detail', href: '/' },
                { name: 'Order', href: '/' },
              ],
            },
            {
              name: '01',
              href: '/',
              options: [
                { name: '01', href: '/' },
                { name: '02', href: '/' },
                { name: '03', href: '/' },
              ],
            },
          ]}
        />
        <Breadcrumb
          items={[
            { name: 'Home', href: '/' },
            { name: 'List', href: '/' },
            {
              name: 'Tab',
              href: '/',
              options: [
                { name: 'tab1', href: '/' },
                { name: 'tab2', href: '/' },
                { name: 'tab3', href: '/' },
              ],
            },
            {
              name: 'History',
              href: '/',
              options: [
                { name: 'History', href: '/' },
                { name: 'Detail', href: '/' },
                { name: 'Order', href: '/' },
              ],
            },
            {
              name: '01',
              href: '/',
              options: [
                { name: '01', href: '/' },
                { name: '02', href: '/' },
                { name: '03', href: '/' },
              ],
            },
          ]}
        />
        <Breadcrumb>
          <BreadcrumbItem name="Home" href="/" />
          <BreadcrumbItem name="Category" href="/" />
          <BreadcrumbItem name="Subcategory" href="/" />
          <BreadcrumbItem name="Tab" href="/" />
          <BreadcrumbItem name="Detail" href="/" />
          <BreadcrumbItem name="History" href="/" />
        </Breadcrumb>
      </div>
    </div>
  ),
};
