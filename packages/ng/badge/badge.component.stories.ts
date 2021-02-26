import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MznBadgeComponent, MznBadgeModule } from '.';

export default {
  title: 'Data Display/Badge',
  decorators: [
    moduleMetadata({
      imports: [MznBadgeModule],
    }),
  ],
} as Meta;

export const Playground: Story<MznBadgeComponent> = (args) => ({
  props: args,
  template: `
    <span mznBadgeContainer>
      <mzn-badge [content]="content" [dot]="dot" [overflowCount]="overflowCount"></mzn-badge>
      <div
        [ngStyle]="{
          width: '100px',
          height: '100px',
          backgroundColor: '#e5e5e5'
        }"
      ></div>
    </span>
  `,
});

Playground.args = {
  content: 1,
  dot: false,
  overflowCount: 99,
};

export const Common: Story = (args) => ({
  props: args,
  template: `
    <ng-template #divTemplate>
      <div
        [ngStyle]="{
          width: '100px',
          height: '100px',
          backgroundColor: '#e5e5e5'
        }"
      ></div>
    </ng-template>

    <span mznBadgeContainer [style.margin.px]="24">
      <mzn-badge [content]="0"></mzn-badge>
      <ng-template [ngTemplateOutlet]="divTemplate"></ng-template>
    </span>
    <span mznBadgeContainer [style.margin.px]="24">
      <mzn-badge dot></mzn-badge>
      <ng-template [ngTemplateOutlet]="divTemplate"></ng-template>
    </span>
    <span mznBadgeContainer [style.margin.px]="24">
      <mzn-badge [content]="1"></mzn-badge>
      <ng-template [ngTemplateOutlet]="divTemplate"></ng-template>
    </span>
    <span mznBadgeContainer [style.margin.px]="24">
      <mzn-badge [content]="99"></mzn-badge>
      <ng-template [ngTemplateOutlet]="divTemplate"></ng-template>
    </span>
    <span mznBadgeContainer [style.margin.px]="24">
      <mzn-badge [content]="999" [overflowCount]="999"></mzn-badge>
      <ng-template [ngTemplateOutlet]="divTemplate"></ng-template>
    </span>
    <span mznBadgeContainer [style.margin.px]="24">
      <mzn-badge [content]="1000" [overflowCount]="999"></mzn-badge>
      <ng-template [ngTemplateOutlet]="divTemplate"></ng-template>
    </span>
  `,
});

export const Standalone: Story = (args) => ({
  props: args,
  template: `
    <mzn-badge dot></mzn-badge>
    <mzn-badge [content]="0"></mzn-badge>
    <mzn-badge [content]="99"></mzn-badge>
    <mzn-badge [content]="999" [overflowCount]="999"></mzn-badge>
    <mzn-badge [content]="1000" [overflowCount]="999"></mzn-badge>
  `,
});
