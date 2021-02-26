import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MznEmptyComponent, MznEmptyModule } from '.';

export default {
  title: 'Data Display/Empty',
  decorators: [
    moduleMetadata({
      imports: [MznEmptyModule],
    }),
  ],
} as Meta;

export const Playground: Story<MznEmptyComponent & { description: string; }> = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        width: '100%',
        height: '270px',
        marginBottom: '24px',
        backgroundColor: 'var(--mzn-color-divider)'
      }"
    >
      <mzn-empty
        [fullHeight]="fullHeight"
        [title]="title"
      >
        {{description}}
      </mzn-empty>
    </div>
    <div
      [ngStyle]="{
        width: '100%',
        height: '270px',
        backgroundColor: 'var(--mzn-color-divider)'
      }"
    >
      <mzn-empty
        [fullHeight]="fullHeight"
        [image]="image"
        [title]="title"
      >
        <ng-template #image>
          <div
            [ngStyle]="{
              width: '100px',
              height: '100px',
              marginBottom: '4px',
              backgroundImage: 'radial-gradient(circle, #778de8, #7b83c6, #797aa6, #737287, #6a6a6a)',
              borderRadius: '100%'
            }"
          ></div>
        </ng-template>
        {{description}}
      </mzn-empty>
    </div>
  `,
});

Playground.args = {
  description: '找不到符合條件的資料',
  title: '查無資料',
  fullHeight: false,
};
