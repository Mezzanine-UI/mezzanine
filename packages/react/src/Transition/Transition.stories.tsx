import { StoryFn, Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import {
  MotionDurationType,
  MotionEasingType,
  MOTION_DURATION,
  MOTION_EASING,
} from '@mezzanine-ui/system/motion';
import Switch from '../Toggle';
import { Collapse, Fade, Grow, SlideFadeDirection, SlideFade, Zoom } from '.';

export default {
  title: 'Utility/Transition',
} as Meta;

const durations: MotionDurationType[] = [
  'shortest',
  'shorter',
  'short',
  'standard',
  'long',
];

const easings: MotionEasingType[] = [
  'standard',
  'emphasized',
  'decelerated',
  'accelerated',
];

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
  durationEnter: 'standard',
  durationExit: 'standard',
  easingEnter: 'decelerated',
  easingExit: 'accelerated',
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
      <Switch
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        size="large"
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
            background: 'var(--mzn-color-primary)',
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
      <Switch
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        size="large"
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
            background: 'var(--mzn-color-primary)',
          }}
        />
      </Fade>
    </>
  );
};

FadeStory.storyName = 'Fade';
FadeStory.args = args;
FadeStory.argTypes = argTypes;

export const GrowStory: TransitionStory<{ transformOrigin: string }> = ({
  durationEnter,
  durationExit,
  easingEnter,
  easingExit,
  transformOrigin,
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Switch
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        size="large"
      />
      <Grow
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
            background: 'var(--mzn-color-primary)',
          }}
        />
      </Grow>
    </>
  );
};

GrowStory.storyName = 'Grow';
GrowStory.args = {
  ...args,
  transformOrigin: 'initial',
};
GrowStory.argTypes = argTypes;

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
      <Switch
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        size="large"
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
            background: 'var(--mzn-color-primary)',
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

export const ZoomStory: TransitionStory = ({
  durationEnter,
  durationExit,
  easingEnter,
  easingExit,
}) => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Switch
        checked={checked}
        onChange={() => setChecked((prev) => !prev)}
        size="large"
      />
      <Zoom
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
            background: 'var(--mzn-color-primary)',
          }}
        />
      </Zoom>
    </>
  );
};

ZoomStory.storyName = 'Zoom';
ZoomStory.args = args;
ZoomStory.argTypes = argTypes;
