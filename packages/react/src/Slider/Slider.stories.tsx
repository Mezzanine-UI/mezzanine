import { RangeSliderValue, SingleSliderValue } from '@mezzanine-ui/core/slider';
import { StoryFn, Meta } from '@storybook/react-webpack5';
import { useRef, useState } from 'react';
import Slider, { SliderProps } from '.';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Slider',
} as Meta;

type PlaygroundArgs = Pick<SliderProps, 'min' | 'max' | 'step' | 'disabled'>;

export const Single: StoryFn<PlaygroundArgs> = ({
  min,
  max,
  step,
  disabled,
}) => {
  const [value, setValue] = useState<SingleSliderValue>(1);

  return (
    <div
      style={{
        padding: '5rem',
      }}
    >
      <Slider
        value={value}
        onChange={setValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        withInput
      />

      <Typography
        variant="h3"
        style={{
          marginTop: '2rem',
        }}
      >
        {value}
      </Typography>
    </div>
  );
};

Single.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
};

export const Range: StoryFn<PlaygroundArgs> = ({
  min,
  max,
  step,
  disabled,
}) => {
  const [value, setValue] = useState<RangeSliderValue>([10, 50]);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        padding: '5rem',
      }}
    >
      <Slider
        ref={ref}
        value={value}
        onChange={setValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        withInput
      />

      <Typography
        variant="h3"
        style={{
          marginTop: '2rem',
        }}
      >
        <span>{value[0]}</span>
        <span>,</span>
        <span>{value[1]}</span>
      </Typography>
    </div>
  );
};

Range.args = {
  min: 0,
  max: 100,
  step: 1,
  disabled: false,
};
