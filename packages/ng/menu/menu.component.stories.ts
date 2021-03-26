import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { MznMenuModule } from '.';

export default {
  title: 'Navigation/Menu',
  decorators: [
    moduleMetadata({
      imports: [MznMenuModule],
    }),
  ],
} as Meta;

export const Sizes: Story = (args) => ({
  props: args,
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, 160px)',
        gap: '60px'
      }"
    >
      <ul mzn-menu size="large">
        <li mzn-menu-item>item 1</li>
        <li mzn-menu-item active="active">item 2</li>
        <li mzn-menu-item disabled="disabled">item 3</li>
        <li mzn-menu-item>item 4</li>
      </ul>
      <ul mzn-menu>
        <li mzn-menu-item>item 1</li>
        <li mzn-menu-item active="active">item 2</li>
        <li mzn-menu-item disabled="disabled">item 3</li>
        <li mzn-menu-item>item 4</li>
      </ul>
      <ul mzn-menu size="small">
        <li mzn-menu-item>item 1</li>
        <li mzn-menu-item active="active">item 2</li>
        <li mzn-menu-item disabled="disabled">item 3</li>
        <li mzn-menu-item>item 4</li>
      </ul>
    </div>
  `,
});

Sizes.args = {
  active: false,
  disabled: false,
};

export const WithDivider: Story = () => ({
  template: `
    <ul mzn-menu maxHeight="139" [ngStyle]="{ width: '160px' }">
      <li mzn-menu-item>item 1</li>
      <li mzn-menu-item>item 2</li>
      <li mzn-menu-item>item 3</li>
      <hr mznMenuDivider />
      <li mzn-menu-item>item 4</li>
    </ul>
  `,
});

export const Group: Story = () => ({
  template: `
    <div
      [ngStyle]="{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, 160px)',
        gap: '60px'
      }"
    >
      <ul mzn-menu size="large">
        <li mzn-menu-item-group label="Group A">
          <ul>
            <li mzn-menu-item>item 1</li>
            <li mzn-menu-item>item 2</li>
          </ul>
        </li>
        <li mzn-menu-item-group label="Group B">
          <ul>
            <li mzn-menu-item>item 1</li>
            <li mzn-menu-item>item 2</li>
          </ul>
        </li>
      </ul>
      <ul mzn-menu size="medium">
        <li mzn-menu-item-group label="Group A">
          <ul>
            <li mzn-menu-item>item 1</li>
            <li mzn-menu-item>item 2</li>
          </ul>
        </li>
        <li mzn-menu-item-group label="Group B">
          <ul>
            <li mzn-menu-item>item 1</li>
            <li mzn-menu-item>item 2</li>
          </ul>
        </li>
      </ul>
      <ul mzn-menu size="small">
        <li mzn-menu-item-group label="Group A">
          <ul>
            <li mzn-menu-item>item 1</li>
            <li mzn-menu-item>item 2</li>
          </ul>
        </li>
        <li mzn-menu-item-group label="Group B">
          <ul>
            <li mzn-menu-item>item 1</li>
            <li mzn-menu-item>item 2</li>
          </ul>
        </li>
      </ul>
    </div>
  `,
});
