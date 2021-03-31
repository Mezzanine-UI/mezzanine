import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MznBadgeModule } from '@mezzanine-ui/ng/badge';
import { MznTabsComponent } from './tabs.component';
import { MznTabsModule } from '.';

export default {
  title: 'Navigation/Tabs',
  decorators: [
    moduleMetadata({
      imports: [MznTabsModule, MznBadgeModule],
    }),
  ],
} as Meta;

export const Basic: Story<MznTabsComponent & { selectedIndex: number; }> = (args) => ({
  props: args,
  template: `
    <mzn-tabs
      [(selectedIndex)]="selectedIndex">
      <mzn-tab title="Tab1">
        Content 1
      </mzn-tab>
      <mzn-tab title="Tab2" disabled>
        Content 2
      </mzn-tab>
      <mzn-tab title="Tab3">
        Content 3
      </mzn-tab>
    </mzn-tabs>
  `,
});

Basic.args = {
  selectedIndex: 0,
};

export const WithBadge: Story = () => ({
  template: `
    <mzn-tabs>
      <mzn-tab>
        <ng-template #titleTemplate>
          <span mznBadgeContainer>
            <mzn-badge dot></mzn-badge>
              Tab1
          </span>
        </ng-template>
        Content 1
      </mzn-tab>
      <mzn-tab disabled>
        <ng-template #titleTemplate>
          <span mznBadgeContainer>
            <mzn-badge [content]="999"></mzn-badge>
              Tab2
          </span>
        </ng-template>
        Content 2
      </mzn-tab>
      <mzn-tab>
        <ng-template #titleTemplate>
          <span mznBadgeContainer>
            <mzn-badge [content]="1000" [overflowCount]="999"></mzn-badge>
              Tab3
          </span>
        </ng-template>
        Content 3
      </mzn-tab>
    </mzn-tabs>
  `,
});
