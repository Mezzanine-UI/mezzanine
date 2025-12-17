import { StoryObj, Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import {
  MotionDurationType,
  MotionEasingType,
  MOTION_DURATION,
  MOTION_EASING,
} from '@mezzanine-ui/system/motion';
import { ChevronUpIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import Toggle from '../Toggle';
import Button from '../Button';
import { Fade, Rotate, Scale, TranslateFrom, Translate, Slide } from '.';

export default {
  title: 'Utility/Transition',
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

export const FadeStory: StoryObj<TransitionStoryArgs> = {
  render: function FadeRender({
    durationEnter,
    durationExit,
    easingEnter,
    easingExit,
  }) {
    const [checked, setChecked] = useState(false);

    return (
      <>
        <Toggle
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
          size="main"
        />
        <Fade
          in={checked}
          duration={{
            enter: MOTION_DURATION[durationEnter],
            exit: MOTION_DURATION[durationExit],
          }}
          easing={{
            enter: MOTION_EASING[easingEnter],
            exit: MOTION_EASING[easingExit],
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: 'var(--mzn-color-background-brand)',
            }}
          />
        </Fade>
      </>
    );
  },
  args: defaultArgs,
  argTypes: defaultArgTypes,
};

FadeStory.storyName = 'Fade';

export const ScaleStory: StoryObj<
  TransitionStoryArgs & { transformOrigin: string }
> = {
  render: function ScaleRender({
    durationEnter,
    durationExit,
    easingEnter,
    easingExit,
    transformOrigin,
  }) {
    const [checked, setChecked] = useState(false);

    return (
      <>
        <Toggle
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
          size="main"
        />
        <Scale
          in={checked}
          keepMount
          duration={{
            enter: MOTION_DURATION[durationEnter],
            exit: MOTION_DURATION[durationExit],
          }}
          easing={{
            enter: MOTION_EASING[easingEnter],
            exit: MOTION_EASING[easingExit],
          }}
          transformOrigin={transformOrigin}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: 'var(--mzn-color-background-brand)',
            }}
          />
        </Scale>
      </>
    );
  },
  args: {
    ...defaultArgs,
    transformOrigin: 'initial',
  },
  argTypes: defaultArgTypes,
};

ScaleStory.storyName = 'Scale';

const translateFrom: TranslateFrom[] = ['top', 'bottom', 'left', 'right'];

export const TranslateStory: StoryObj<
  TransitionStoryArgs & { from: TranslateFrom }
> = {
  render: function TranslateRender({
    from,
    durationEnter,
    durationExit,
    easingEnter,
    easingExit,
  }) {
    const [checked, setChecked] = useState(false);

    return (
      <>
        <Toggle
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
          size="main"
        />
        <Translate
          in={checked}
          from={from}
          duration={{
            enter: MOTION_DURATION[durationEnter],
            exit: MOTION_DURATION[durationExit],
          }}
          easing={{
            enter: MOTION_EASING[easingEnter],
            exit: MOTION_EASING[easingExit],
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: 'var(--mzn-color-background-brand)',
            }}
          />
        </Translate>
      </>
    );
  },
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

TranslateStory.storyName = 'Translate';

export const SlideStory: StoryObj<TransitionStoryArgs> = {
  render: function SlideRender({
    durationEnter,
    durationExit,
    easingEnter,
    easingExit,
  }) {
    const [checked, setChecked] = useState(false);

    return (
      <>
        <Toggle
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
          size="main"
        />
        <Slide
          in={checked}
          keepMount
          duration={{
            enter: MOTION_DURATION[durationEnter],
            exit: MOTION_DURATION[durationExit],
          }}
          easing={{
            enter: MOTION_EASING[easingEnter],
            exit: MOTION_EASING[easingExit],
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              background: 'var(--mzn-color-background-brand)',
            }}
          />
        </Slide>
      </>
    );
  },
  args: defaultArgs,
  argTypes: defaultArgTypes,
};

SlideStory.storyName = 'Slide';

export const RotateStory: StoryObj<
  Pick<TransitionStoryArgs, 'durationEnter' | 'easingEnter'> & {
    degrees: number;
  }
> = {
  render: function RotateRender({ degrees, durationEnter, easingEnter }) {
    const [checked, setChecked] = useState(false);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '16px' }}>Rotate Arrow Indicator</h3>
          <Button
            variant="base-secondary"
            onClick={() => setChecked((prev) => !prev)}
          >
            <span>Select Options</span>
            <Rotate
              in={checked}
              degrees={degrees}
              duration={MOTION_DURATION[durationEnter]}
              easing={MOTION_EASING[easingEnter]}
            >
              <Icon icon={ChevronUpIcon} />
            </Rotate>
          </Button>
        </div>
      </div>
    );
  },
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

RotateStory.storyName = 'Rotate';
