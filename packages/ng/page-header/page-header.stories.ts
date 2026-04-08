import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ChevronLeftIcon, MenuIcon } from '@mezzanine-ui/icons';
import { MznPageHeader } from './page-header.component';
import { MznBreadcrumb } from '@mezzanine-ui/ng/breadcrumb';
import { MznContentHeader } from '@mezzanine-ui/ng/content-header';
import { MznButton, MznButtonGroup } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';

export default {
  title: 'Navigation/PageHeader',
  decorators: [
    moduleMetadata({
      imports: [
        MznPageHeader,
        MznBreadcrumb,
        MznContentHeader,
        MznButton,
        MznButtonGroup,
        MznIcon,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    props: {
      ChevronLeftIcon,
      MenuIcon,
      breadcrumbItems: [
        { name: 'Home', href: '/' },
        { name: 'Category', href: '/category' },
        { name: 'Detail', href: '/detail' },
        { name: 'History', href: '/history' },
      ],
    },
    template: `
      <div style="display: grid; gap: 24px;">
        <div>
          <header mznPageHeader>
            <nav mznBreadcrumb [items]="breadcrumbItems" ></nav>

            <header mznContentHeader title="Page Title" description="This is a Description.">
              <a contentHeaderBackButton href="./" title="back">
                <button mznButton variant="base-tertiary" iconType="icon-only">
                  <i mznIcon [icon]="ChevronLeftIcon" ></i>
                </button>
              </a>

              <div mznButtonGroup contentHeaderActions>
                <button mznButton variant="base-secondary">Secondary</button>
                <button mznButton>Primary</button>
              </div>
              <div contentHeaderUtilities>
                <button mznButton variant="base-secondary" iconType="icon-only">
                  <i mznIcon [icon]="MenuIcon" ></i>
                </button>
              </div>
            </header>
          </header>
        </div>
      </div>
    `,
  }),
};
