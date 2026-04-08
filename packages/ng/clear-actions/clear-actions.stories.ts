import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
  ClearActionsType,
} from '@mezzanine-ui/core/clear-actions';
import { MznClearActions } from './clear-actions.component';

const meta: Meta<MznClearActions> = {
  title: 'Internal/ClearActions',
  component: MznClearActions,
  decorators: [moduleMetadata({ imports: [MznClearActions] })],
};

export default meta;
type Story = StoryObj<MznClearActions>;

export const Playground: Story = {
  argTypes: {
    type: {
      options: ['standard', 'embedded', 'clearable'] as ClearActionsType[],
      control: { type: 'select' },
      description: '清除操作類型。',
      table: {
        type: { summary: "'standard' | 'embedded' | 'clearable'" },
        defaultValue: { summary: "'standard'" },
      },
    },
    variant: {
      options: [undefined, 'base', 'inverse', 'contrast', 'emphasis'] as Array<
        ClearActionsEmbeddedVariant | ClearActionsStandardVariant | undefined
      >,
      control: { type: 'select' },
      description:
        '視覺變體，依 type 而定。standard: base | inverse；embedded: contrast | emphasis。',
      table: {
        type: { summary: "'base' | 'inverse' | 'contrast' | 'emphasis'" },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  args: {
    type: 'standard',
    variant: undefined,
  },
  render: (args) => ({
    props: args,
    template: `<mzn-clear-actions [type]="type" [variant]="variant" (clicked)="clicked($event)" />`,
  }),
};

export const StandardBase: Story = {
  render: () => ({
    template: `
      <div style="width: 100px; height: 100px; background-color: #F3F4F6; display: flex; justify-content: center; align-items: center;">
        <mzn-clear-actions type="standard" variant="base" />
      </div>
    `,
  }),
};

export const StandardInverse: Story = {
  render: () => ({
    template: `
      <div style="width: 100px; height: 100px; background-color: #4F565F; display: flex; justify-content: center; align-items: center;">
        <mzn-clear-actions type="standard" variant="inverse" />
      </div>
    `,
  }),
};

export const EmbeddedContrast: Story = {
  render: () => ({
    template: `
      <div style="width: 100px; height: 100px; background-color: #F3F4F6; display: flex; justify-content: center; align-items: center;">
        <mzn-clear-actions type="embedded" variant="contrast" />
      </div>
    `,
  }),
};

export const EmbeddedEmphasis: Story = {
  render: () => ({
    template: `
      <div style="width: 100px; height: 100px; background-color: #F3F4F6; display: flex; justify-content: center; align-items: center;">
        <mzn-clear-actions type="embedded" variant="emphasis" />
      </div>
    `,
  }),
};

export const ClearableBase: Story = {
  render: () => ({
    template: `
      <div style="width: 100px; height: 100px; background-color: #F3F4F6; display: flex; justify-content: center; align-items: center;">
        <mzn-clear-actions type="clearable" />
      </div>
    `,
  }),
};
