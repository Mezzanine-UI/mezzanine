import { RangeSliderValue, SingleSliderValue } from '@mezzanine-ui/core/slider';
import { StoryFn, Meta } from '@storybook/react-webpack5';
import { useRef, useState } from 'react';
import Slider, { SliderProps } from '.';
import Typography from '../Typography';
import { MinusIcon, PlusIcon } from '@mezzanine-ui/icons';

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
        padding: '2rem 5rem',
        display: 'grid',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">With input</Typography>
        <Slider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          withInput
        />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">With suffixIcon</Typography>
        <Slider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          suffixIcon={PlusIcon}
        />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">Slice 3 ticks between min and max</Typography>
        <Slider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          withTick={3}
        />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">
          Custom tick marks: [10, 20, 30, 75]
        </Typography>
        <Slider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          withTick={[10, 20, 30, 75]}
        />
      </div>

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
        padding: '2rem 5rem',
        display: 'grid',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">With input</Typography>
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
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">With prefixIcon and suffixIcon</Typography>
        <Slider
          ref={ref}
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          prefixIcon={MinusIcon}
          suffixIcon={PlusIcon}
        />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">Slice 3 ticks between min and max</Typography>
        <Slider
          ref={ref}
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          withTick={3}
        />
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">
          Custom tick marks: [10, 20, 30, 75]
        </Typography>
        <Slider
          ref={ref}
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          withTick={[10, 20, 30, 75]}
        />
      </div>

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
