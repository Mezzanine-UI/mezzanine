import { StoryObj, Meta } from '@storybook/react-webpack5';
import Breadcrumb, { BreadcrumbProps } from '.';
import Typography from '../Typography';
import BreadcrumbItem from './BreadcrumbItem';

export default {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>;

type Story = StoryObj<BreadcrumbProps>;

const breadcrumbItem: BreadcrumbProps['items'] = [
  {
    id: 'home',
    name: 'Home',
    href: '/',
  },
  { id: 'category', name: 'Category', href: '/Category', target: '_blank' },
  {
    id: 'subcategory',
    name: 'Subcategory',
    href: '/Category/Subcategory',
    target: '_blank',
  },
  { id: 'tab', name: 'Tab', href: '/Category/Subcategory/Tab' },
  { id: 'detail', name: 'Detail', href: '/Category/Subcategory/Tab/Detail' },
  {
    id: 'history',
    name: 'History',
    href: '/Category/Subcategory/Tab/Detail/History',
  },
];

export const Basic: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '64px',
        paddingBottom: '160px',
      }}
    >
      <div style={{ display: 'grid', gap: '40px' }}>
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
    </div>
  ),
};

export const WithDropdown: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '64px',
        paddingBottom: '160px',
      }}
    >
      <div style={{ display: 'grid', gap: '40px' }}>
        <Typography variant="h2">Item With Dropdown</Typography>
        <Breadcrumb>
          <BreadcrumbItem name="Home" href="/" />
          <BreadcrumbItem name="List" href="/" />
          <BreadcrumbItem name="History" href="/" />
          <BreadcrumbItem
            name="01"
            onSelect={(v) => alert(v.name)}
            options={[
              { id: '01', name: '01' },
              { id: '02', name: '02' },
              { id: '03', name: '03' },
            ]}
          />
        </Breadcrumb>
        <Breadcrumb
          items={[
            { id: 'Home', name: 'Home', href: '/' },
            { id: 'List', name: 'List', href: '/' },
            {
              id: 'Tab',
              name: 'Tab',
              options: [
                { id: 'tab1', name: 'tab1' },
                { id: 'tab2', name: 'tab2' },
                { id: 'tab3', name: 'tab3' },
              ],
            },
            {
              name: 'History',
              options: [
                { id: 'history', name: 'History' },
                { id: 'detail', name: 'Detail' },
                { id: 'order', name: 'Order' },
              ],
            },
            {
              name: '01',
              options: [
                { id: '01', name: '01' },
                { id: '02', name: '02' },
                { id: '03', name: '03' },
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

export const Playground: Story = {
  args: {
    items: [
      { id: 'home', name: 'Home', href: '/' },
      { id: 'category', name: 'Category', href: '/Category' },
      { id: 'parent', name: 'Parent of Current', href: '/Category/Parent' },
      { id: 'current', name: 'Current' },
    ],
  },
  argTypes: {},
};
