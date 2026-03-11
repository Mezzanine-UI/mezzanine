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
        <Typography variant="h3">With Icon</Typography>
        <Slider
          value={value}
          onChange={setValue}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          suffixIcon={PlusIcon}
          prefixIcon={MinusIcon}
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

export const WithIconCustomClick: StoryFn = () => {
  const [singleValue, setSingleValue] = useState<SingleSliderValue>(50);
  const [rangeValue, setRangeValue] = useState<RangeSliderValue>([20, 70]);

  return (
    <div
      style={{
        padding: '2rem 5rem',
        display: 'grid',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">Single - 自訂 onClick（每次 +/- 10）</Typography>
        <Typography variant="body">
          透過 onPrefixIconClick / onSuffixIconClick 自訂點擊行為。
        </Typography>
        <Slider
          value={singleValue}
          onChange={setSingleValue}
          prefixIcon={MinusIcon}
          suffixIcon={PlusIcon}
          onPrefixIconClick={() => setSingleValue((v) => Math.max(0, v - 10))}
          onSuffixIconClick={() => setSingleValue((v) => Math.min(100, v + 10))}
        />
        <Typography variant="h3">{singleValue}</Typography>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">Range - 自訂 onClick（整體位移 10）</Typography>
        <Typography variant="body">
          onPrefixIconClick 整體左移，onSuffixIconClick 整體右移。
        </Typography>
        <Slider
          value={rangeValue}
          onChange={setRangeValue}
          prefixIcon={MinusIcon}
          suffixIcon={PlusIcon}
          onPrefixIconClick={() =>
            setRangeValue((v) => [Math.max(0, v[0] - 10), Math.max(v[0] - 10 + (v[1] - v[0]), 0)])
          }
          onSuffixIconClick={() =>
            setRangeValue((v) => [Math.min(v[0] + 10, 100), Math.min(v[1] + 10, 100)])
          }
        />
        <Typography variant="h3">
          {rangeValue[0]}, {rangeValue[1]}
        </Typography>
      </div>
    </div>
  );
};

export const WithIcon: StoryFn = () => {
  const [singleValue, setSingleValue] = useState<SingleSliderValue>(50);
  const [rangeValue, setRangeValue] = useState<RangeSliderValue>([20, 70]);

  return (
    <div
      style={{
        padding: '2rem 5rem',
        display: 'grid',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">Single</Typography>
        <Typography variant="body">透過點擊（Click）圖示（Icon）來觸發值的變化。</Typography>
        <Slider
          value={singleValue}
          onChange={setSingleValue}
          prefixIcon={MinusIcon}
          suffixIcon={PlusIcon}
        />
        <Typography variant="h3">{singleValue}</Typography>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <Typography variant="h3">Range</Typography>
        <Typography variant="body">點擊「-」減少下限，點擊「+」增加上限。</Typography>
        <Slider
          value={rangeValue}
          onChange={setRangeValue}
          prefixIcon={MinusIcon}
          suffixIcon={PlusIcon}
        />
        <Typography variant="h3">
          {rangeValue[0]}, {rangeValue[1]}
        </Typography>
      </div>
    </div>
  );
};
