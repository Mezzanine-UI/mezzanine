import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznDescriptionTitle } from './description-title.component';

export default {
  title: 'Data Display/Description/DescriptionTitle',
  decorators: [
    moduleMetadata({
      imports: [MznDescriptionTitle],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    widthType: {
      options: ['narrow', 'wide'],
      control: { type: 'select' },
    },
  },
  args: {
    widthType: 'narrow',
  },
  render: (args) => ({
    props: args,
    template: `
      <mzn-description-title [widthType]="widthType">欄位名稱</mzn-description-title>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <mzn-description-title size="main">Main Title</mzn-description-title>
        <mzn-description-title size="sub">Sub Title</mzn-description-title>
        <mzn-description-title size="main" badge="dot-success">Main with Badge</mzn-description-title>
        <mzn-description-title size="sub" badge="dot-success">Sub with Badge</mzn-description-title>
      </div>
    `,
  }),
};

export const WidthTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="width: fit-content;">
          <mzn-description-title widthType="narrow">Narrow</mzn-description-title>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
        <div style="width: fit-content;">
          <mzn-description-title widthType="wide">Wide</mzn-description-title>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
        <div style="width: auto;">
          <mzn-description-title widthType="stretch">Stretch</mzn-description-title>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
        <div style="width: fit-content;">
          <mzn-description-title widthType="hug">Hug</mzn-description-title>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
      </div>
    `,
  }),
};
