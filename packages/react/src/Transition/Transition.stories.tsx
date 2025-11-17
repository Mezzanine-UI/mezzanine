import { StoryFn, Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import {
  MotionDurationType,
  MotionEasingType,
  MOTION_DURATION,
  MOTION_EASING,
} from '@mezzanine-ui/system/motion';
import Toggle from '../Toggle';
import { Collapse, Fade, Scale, SlideFadeDirection, SlideFade } from '.';

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

type TransitionStory<Args = Record<string, any>> = StoryFn<
  TransitionStoryArgs & Args
>;

const args = {
  durationEnter: 'moderate',
  durationExit: 'moderate',
  easingEnter: 'entrance',
  easingExit: 'exit',
} as const;

const argTypes = {
  durationEnter: {
    options: durations,
    control: {
      type: 'select',
    },
  },
  durationExit: {
    options: durations,
    control: {
      type: 'select',
    },
  },
  easingEnter: {
    options: easings,
    control: {
      type: 'select',
    },
  },
  easingExit: {
    options: easings,
    control: {
      type: 'select',
    },
  },
} as const;

export const CollapseStory: TransitionStory<{ collapsedHeight: number }> = ({
  collapsedHeight,
  durationEnter,
  durationExit,
  easingEnter,
  easingExit,
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Toggle
        size="main"
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
      />
      <Collapse
        in={checked}
        collapsedHeight={collapsedHeight}
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
      </Collapse>
    </>
  );
};

CollapseStory.storyName = 'Collapse';
CollapseStory.args = {
  ...args,
  collapsedHeight: 0,
};
CollapseStory.argTypes = argTypes;

export const FadeStory: TransitionStory = ({
  durationEnter,
  durationExit,
  easingEnter,
  easingExit,
}) => {
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
};

FadeStory.storyName = 'Fade';
FadeStory.args = args;
FadeStory.argTypes = argTypes;

export const ScaleStory: TransitionStory<{ transformOrigin: string }> = ({
  durationEnter,
  durationExit,
  easingEnter,
  easingExit,
  transformOrigin,
}) => {
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
};

ScaleStory.storyName = 'Scale';
ScaleStory.args = {
  ...args,
  transformOrigin: 'initial',
};
ScaleStory.argTypes = argTypes;

const slideFadeDirections: SlideFadeDirection[] = [
  'up',
  'down',
  'left',
  'right',
];

export const SlideFadeStory: TransitionStory<{
  direction: SlideFadeDirection;
}> = ({ direction, durationEnter, durationExit, easingEnter, easingExit }) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Toggle
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        size="main"
      />
      <SlideFade
        in={checked}
        direction={direction}
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
      </SlideFade>
    </>
  );
};

SlideFadeStory.storyName = 'SlideFade';
SlideFadeStory.args = {
  ...args,
  direction: 'down',
};
SlideFadeStory.argTypes = {
  ...argTypes,
  direction: {
    options: slideFadeDirections,
    control: {
      type: 'select',
    },
  },
};
