import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import MznDescriptionTitle from './description-title.vue';

export default {
  title: 'Data Display/Description/DescriptionTitle',
} as Meta;

type TitleStory = StoryObj<typeof MznDescriptionTitle>;

const STORY_COMPONENTS = { MznDescriptionTitle };

export const Playground: TitleStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    setup: () => ({ QuestionOutlineIcon }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px">
        <MznDescriptionTitle children="Title" />
        <MznDescriptionTitle badge="dot-success" children="Title" />
        <MznDescriptionTitle
          tooltip="tooltip"
          tooltipPlacement="top-end"
          :icon="QuestionOutlineIcon"
          children="Title"
        />
        <MznDescriptionTitle
          badge="dot-success"
          :icon="QuestionOutlineIcon"
          children="Title"
        />
      </div>
    `,
  }),
};

export const Sizes: TitleStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px">
        <MznDescriptionTitle size="main" children="Main Title" />
        <MznDescriptionTitle size="sub" children="Sub Title" />
        <MznDescriptionTitle
          size="main"
          badge="dot-success"
          children="Main with Badge"
        />
        <MznDescriptionTitle
          size="sub"
          badge="dot-success"
          children="Sub with Badge"
        />
      </div>
    `,
  }),
};

export const WidthTypes: TitleStory = {
  render: () => ({
    components: STORY_COMPONENTS,
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px">
        <div style="width: fit-content">
          <MznDescriptionTitle widthType="narrow" children="Narrow" />
          <div
            style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16"
          />
        </div>

        <div style="width: fit-content">
          <MznDescriptionTitle widthType="wide" children="Wide" />
          <div
            style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16"
          />
        </div>

        <div style="width: auto">
          <MznDescriptionTitle widthType="stretch" children="Stretch" />
          <div
            style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16"
          />
        </div>

        <div style="width: fit-content">
          <MznDescriptionTitle widthType="hug" children="Hug" />
          <div
            style="width: 100%; height: 2px; background-color: #F03740; opacity: 0.16"
          />
        </div>
      </div>
    `,
  }),
};
