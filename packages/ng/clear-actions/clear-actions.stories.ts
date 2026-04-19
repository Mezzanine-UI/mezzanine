import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  ClearActionsEmbeddedVariant,
  ClearActionsStandardVariant,
  ClearActionsType,
} from '@mezzanine-ui/core/clear-actions';
import { MznClearActions } from './clear-actions.component';

interface AppearanceOption {
  readonly value: string;
  readonly label: string;
  readonly backgroundColor: string;
  readonly type: ClearActionsType;
  readonly variant?: ClearActionsStandardVariant | ClearActionsEmbeddedVariant;
}

/**
 * 對齊 React `appearanceOptions`:設計系統批准的 5 種 ClearActions 組合,
 * 每個組合鎖定 `type` + `variant` + 示範用 `backgroundColor`。
 */
const appearanceOptions: ReadonlyArray<AppearanceOption> = [
  {
    value: 'standard-base',
    label: 'Standard · Base Button',
    backgroundColor: '#F3F4F6',
    type: 'standard',
    variant: 'base',
  },
  {
    value: 'standard-inverse',
    label: 'Standard · Inverse Button',
    backgroundColor: '#4F565F',
    type: 'standard',
    variant: 'inverse',
  },
  {
    value: 'embedded-contrast',
    label: 'Embedded · Contrast Button',
    backgroundColor: '#F3F4F6',
    type: 'embedded',
    variant: 'contrast',
  },
  {
    value: 'embedded-emphasis',
    label: 'Embedded · Emphasis Button',
    backgroundColor: '#F3F4F6',
    type: 'embedded',
    variant: 'emphasis',
  },
  {
    value: 'clearable-base',
    label: 'Clearable · Base Button',
    backgroundColor: '#F3F4F6',
    type: 'clearable',
  },
];

const appearanceByValue = appearanceOptions.reduce<
  Record<string, AppearanceOption>
>((acc, option) => {
  acc[option.value] = option;

  return acc;
}, {});

const appearanceLabels = appearanceOptions.reduce<Record<string, string>>(
  (acc, option) => {
    acc[option.value] = option.label;

    return acc;
  },
  {},
);

/**
 * 對齊 React `renderWithinBackground` helper:外層 100×100 方塊帶背景色,
 * 內層 flex center 讓 `<button mznClearActions>` 置中 — 保留兩層 `<div>`
 * 以匹配 React DOM 深度。
 */
const renderWithBackground = (
  backgroundColor: string,
  type: ClearActionsType,
  variant?: ClearActionsStandardVariant | ClearActionsEmbeddedVariant,
): string => {
  const variantAttr = variant ? ` variant="${variant}"` : '';

  return `
    <div style="width: 100px; height: 100px; background-color: ${backgroundColor};">
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
        <button mznClearActions type="${type}"${variantAttr} ></button>
      </div>
    </div>
  `;
};

const logOnClick = (): void => {
  // eslint-disable-next-line no-console
  console.log('ClearActions clicked');
};

const meta: Meta<MznClearActions> = {
  title: 'Internal/ClearActions',
  component: MznClearActions,
  decorators: [moduleMetadata({ imports: [MznClearActions] })],
  argTypes: {
    type: {
      control: false,
      table: { disable: true },
      description:
        'Contextual type is controlled via the appearance selector in stories.',
    },
    variant: {
      control: false,
      table: { disable: true },
      description:
        'Variants are derived from the selected appearance in stories.',
    },
  },
};

export default meta;
type Story = StoryObj<MznClearActions>;

interface PlaygroundArgs {
  appearance: string;
}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    appearance: 'standard-base',
  },
  argTypes: {
    appearance: {
      options: appearanceOptions.map((o) => o.value),
      control: { type: 'select' },
      // `labels` 是 Storybook argType 專用欄位,在 control 中把 option value
      // 映射成可讀的標籤(與 React 版 `labels: appearanceLabels` 對齊)。
      labels: appearanceLabels,
      description: 'Select one of the five design-approved combinations.',
    },
  },
  render: ({ appearance }) => {
    const option =
      appearanceByValue[appearance] ?? appearanceByValue['standard-base'];
    const variantAttr = option.variant ? ` variant="${option.variant}"` : '';

    return {
      props: {
        onClicked: logOnClick,
      },
      template: `
        <div style="width: 100px; height: 100px; background-color: ${option.backgroundColor};">
          <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
            <button mznClearActions type="${option.type}"${variantAttr} (clicked)="onClicked($event)" ></button>
          </div>
        </div>
      `,
    };
  },
};

export const StandardBase: Story = {
  render: () => ({
    template: renderWithBackground('#F3F4F6', 'standard', 'base'),
  }),
};

export const StandardInverse: Story = {
  render: () => ({
    template: renderWithBackground('#4F565F', 'standard', 'inverse'),
  }),
};

export const EmbeddedContrast: Story = {
  render: () => ({
    template: renderWithBackground('#F3F4F6', 'embedded', 'contrast'),
  }),
};

export const EmbeddedEmphasis: Story = {
  render: () => ({
    template: renderWithBackground('#F3F4F6', 'embedded', 'emphasis'),
  }),
};

export const ClearableBase: Story = {
  render: () => ({
    template: renderWithBackground('#F3F4F6', 'clearable'),
  }),
};
