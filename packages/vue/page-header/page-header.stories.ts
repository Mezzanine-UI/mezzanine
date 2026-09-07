import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { MenuIcon } from '@mezzanine-ui/icons';
import MznBreadcrumbItem from '../breadcrumb/breadcrumb-item.vue';
import MznBreadcrumb from '../breadcrumb/breadcrumb.vue';
import MznButton from '../button/button.vue';
import MznContentHeader from '../content-header/content-header.vue';
import MznDropdown from '../dropdown/dropdown.vue';
import MznPageHeader from './page-header.vue';

export default {
  title: 'Navigation/PageHeader',
  component: MznPageHeader,
} as Meta<typeof MznPageHeader>;

type Story = StoryObj<typeof MznPageHeader>;

export const Default: Story = {
  render: () => ({
    components: {
      MznBreadcrumb,
      MznBreadcrumbItem,
      MznButton,
      MznContentHeader,
      MznDropdown,
      MznPageHeader,
    },
    setup: () => ({
      MenuIcon,
      dropdownOptions: [
        { id: '1', name: 'Option 1' },
        { id: '2', name: 'Option 2' },
      ],
    }),
    template: `
      <div style="display: grid; gap: 24px">
        <div>
          <MznPageHeader>
            <MznBreadcrumb>
              <MznBreadcrumbItem href="/" name="Home" />
              <MznBreadcrumbItem href="/category" name="Category" />
              <MznBreadcrumbItem href="/detail" name="Detail" />
              <MznBreadcrumbItem href="/history" name="History" />
            </MznBreadcrumb>

            <MznContentHeader
              title="Page Title"
              description="This is a Description."
            >
              <!-- back button: use component with href prop or MznButton -->
              <a href="./" title="back" />

              <MznButton variant="base-secondary">Secondary</MznButton>
              <MznButton>Primary</MznButton>

              <MznDropdown placement="bottom-end" :options="dropdownOptions">
                <template #default="trigger">
                  <MznButton v-bind="trigger" :icon="MenuIcon" />
                </template>
              </MznDropdown>
            </MznContentHeader>
          </MznPageHeader>
        </div>
      </div>
    `,
  }),
};
