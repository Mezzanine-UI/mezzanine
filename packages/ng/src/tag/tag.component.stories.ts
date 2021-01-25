import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { MznTagComponent, MznTagModule, TagSize } from '.';

export default {
  title: 'DataDisplay/Tag',
  decorators: [
    moduleMetadata({
      imports: [MznTagModule],
    }),
  ],
} as Meta;

const sizes: TagSize[] = [
  'small',
  'medium',
  'large',
];

export const Playgroud: Story<MznTagComponent & { label: string; }> = (args) => ({
  props: args,
  template: `
    <mzn-tag
      [closable]="closable"
      [disabled]="disabled"
      [size]="size"
      (close)="onClose($event)"
    >
      {{label}}
    </mzn-tag>
  `,
});

Playgroud.args = {
  label: 'Tag',
  closable: false,
  disabled: false,
  size: 'medium',
  onClose: action('onClose'),
};
Playgroud.argTypes = {
  size: {
    control: {
      type: 'select',
      options: sizes,
    },
  },
};

interface CommonStoryArgs {
  onClose: VoidFunction;
}

export const Common: Story<CommonStoryArgs> = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        alignItems: 'center',
        gridAutoFlow: 'column',
        gap: '8px'
      }"
    >
      <mzn-tag>Tag</mzn-tag>
      <mzn-tag>
        <a href="https://www.google.com" target="_blank">Link</a>
      </mzn-tag>
      <mzn-tag disabled>Disabled</mzn-tag>
      <mzn-tag closable (close)="onClose($event)">Closable</mzn-tag>
      <mzn-tag closable disabled (close)="onClose($event)">Disabled</mzn-tag>
    </div>
  `,
});

Common.args = {
  onClose: action('onClose'),
};

export const Sizes: Story = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, min-content)',
        gap: '16px',
        alignItems: 'center'
      }"
    >
      <mzn-tag size="small">Tag</mzn-tag>
      <mzn-tag>medium</mzn-tag>
      <mzn-tag size="large">large</mzn-tag>
    </div>
  `,
});
