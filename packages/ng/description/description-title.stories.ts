import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
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
  render: () => ({
    props: { questionIcon: QuestionOutlineIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div mznDescriptionTitle>Title</div>
        <div mznDescriptionTitle badge="dot-success" text="Title"></div>
        <div
          mznDescriptionTitle
          tooltip="tooltip"
          tooltipPlacement="top-end"
          [icon]="questionIcon"
        >Title</div>
        <div
          mznDescriptionTitle
          badge="dot-success"
          text="Title"
          [icon]="questionIcon"
        ></div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div mznDescriptionTitle size="main">Main Title</div>
        <div mznDescriptionTitle size="sub">Sub Title</div>
        <div mznDescriptionTitle size="main" badge="dot-success" text="Main with Badge"></div>
        <div mznDescriptionTitle size="sub" badge="dot-success" text="Sub with Badge"></div>
      </div>
    `,
  }),
};

export const WidthTypes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="width: fit-content;">
          <div mznDescriptionTitle widthType="narrow">Narrow</div>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
        <div style="width: fit-content;">
          <div mznDescriptionTitle widthType="wide">Wide</div>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
        <div style="width: auto;">
          <div mznDescriptionTitle widthType="stretch">Stretch</div>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
        <div style="width: fit-content;">
          <div mznDescriptionTitle widthType="hug">Hug</div>
          <div style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16;"></div>
        </div>
      </div>
    `,
  }),
};
