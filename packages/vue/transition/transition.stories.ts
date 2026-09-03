import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { ref } from 'vue';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import type {
  MotionDurationType,
  MotionEasingType,
} from '@mezzanine-ui/system/motion';
import { ChevronUpIcon } from '@mezzanine-ui/icons';
import MznButton from '../button/button.vue';
import MznIcon from '../icon/icon.vue';
import MznToggle from '../toggle/toggle.vue';
import MznFade from './fade.vue';
import MznRotate from './rotate.vue';
import MznScale from './scale.vue';
import MznSlide from './slide.vue';
import MznTranslate from './translate.vue';
import type { TranslateFrom } from './translate.types';

export default {
  title: 'Motion/Transition',
} as Meta;

const durations: MotionDurationType[] = [
  'fast',
  'moderate',
  'slow',
  'loop',
  'pauseShort',
  'pauseLong',
];

const easings: MotionEasingType[] = ['entrance', 'exit', 'standard'];

interface TransitionStoryArgs {
  durationEnter: MotionDurationType;
  durationExit: MotionDurationType;
  easingEnter: MotionEasingType;
  easingExit: MotionEasingType;
}

const defaultArgs = {
  durationEnter: 'moderate' as const,
  durationExit: 'moderate' as const,
  easingEnter: 'standard' as const,
  easingExit: 'standard' as const,
};

const defaultArgTypes = {
  durationEnter: {
    options: durations,
    control: { type: 'select' as const },
  },
  durationExit: {
    options: durations,
    control: { type: 'select' as const },
  },
  easingEnter: {
    options: easings,
    control: { type: 'select' as const },
  },
  easingExit: {
    options: easings,
    control: { type: 'select' as const },
  },
};

/** Shared by every story: the toggle drives `in`, the box is what moves. */
const transitionSetup = (args: TransitionStoryArgs) => () => {
  const checked = ref(false);

  return {
    args,
    checked,
    duration: {
      enter: MOTION_DURATION[args.durationEnter],
      exit: MOTION_DURATION[args.durationExit],
    },
    easing: {
      enter: MOTION_EASING[args.easingEnter],
      exit: MOTION_EASING[args.easingExit],
    },
  };
};

const box =
  '<div style="width: 200px; height: 200px; background: var(--mzn-color-background-brand)" />';

const toggle =
  '<MznToggle :checked="checked" size="main" @change="checked = !checked" />';

export const FadeStory: StoryObj<TransitionStoryArgs> = {
  name: 'Fade',
  render: (args) => ({
    components: { MznFade, MznToggle },
    setup: transitionSetup(args),
    template: `
      ${toggle}
      <MznFade :in="checked" :duration="duration" :easing="easing">
        ${box}
      </MznFade>
    `,
  }),
  args: defaultArgs,
  argTypes: defaultArgTypes,
};

export const ScaleStory: StoryObj<
  TransitionStoryArgs & { transformOrigin: string }
> = {
  name: 'Scale',
  render: (args) => ({
    components: { MznScale, MznToggle },
    setup: transitionSetup(args),
    template: `
      ${toggle}
      <MznScale
        :in="checked"
        keep-mount
        :duration="duration"
        :easing="easing"
        :transform-origin="args.transformOrigin"
      >
        ${box}
      </MznScale>
    `,
  }),
  args: {
    ...defaultArgs,
    transformOrigin: 'initial',
  },
  argTypes: defaultArgTypes,
};

const translateFrom: TranslateFrom[] = ['top', 'bottom', 'left', 'right'];

export const TranslateStory: StoryObj<
  TransitionStoryArgs & { from: TranslateFrom }
> = {
  name: 'Translate',
  render: (args) => ({
    components: { MznToggle, MznTranslate },
    setup: transitionSetup(args),
    template: `
      ${toggle}
      <MznTranslate
        :in="checked"
        :from="args.from"
        :duration="duration"
        :easing="easing"
      >
        ${box}
      </MznTranslate>
    `,
  }),
  args: {
    ...defaultArgs,
    from: 'top',
  },
  argTypes: {
    ...defaultArgTypes,
    from: {
      options: translateFrom,
      control: { type: 'select' as const },
    },
  },
};

export const SlideStory: StoryObj<TransitionStoryArgs> = {
  name: 'Slide',
  render: (args) => ({
    components: { MznSlide, MznToggle },
    setup: transitionSetup(args),
    template: `
      ${toggle}
      <MznSlide :in="checked" keep-mount :duration="duration" :easing="easing">
        ${box}
      </MznSlide>
    `,
  }),
  args: defaultArgs,
  argTypes: defaultArgTypes,
};

export const RotateStory: StoryObj<
  Pick<TransitionStoryArgs, 'durationEnter' | 'easingEnter'> & {
    degrees: number;
  }
> = {
  name: 'Rotate',
  render: (args) => ({
    components: { MznButton, MznIcon, MznRotate },
    setup: () => ({
      ChevronUpIcon,
      args,
      checked: ref(false),
      duration: MOTION_DURATION[args.durationEnter],
      easing: MOTION_EASING[args.easingEnter],
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px">
        <div>
          <h3 style="margin-bottom: 16px">Rotate Arrow Indicator</h3>
          <MznButton variant="base-secondary" @click="checked = !checked">
            <span>Select Options</span>
            <MznRotate
              :in="checked"
              :degrees="args.degrees"
              :duration="duration"
              :easing="easing"
            >
              <MznIcon :icon="ChevronUpIcon" />
            </MznRotate>
          </MznButton>
        </div>
      </div>
    `,
  }),
  args: {
    durationEnter: 'fast',
    easingEnter: 'standard',
    degrees: 180,
  },
  argTypes: {
    durationEnter: {
      options: durations,
      control: { type: 'select' as const },
    },
    easingEnter: {
      options: easings,
      control: { type: 'select' as const },
    },
    degrees: {
      control: { type: 'number' as const },
    },
  },
};
