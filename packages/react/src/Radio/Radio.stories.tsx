import { StoryFn } from '@storybook/react';
import Typography from '../Typography';
import Radio, {
  RadioSize,
  RadioProps,
  RadioGroup,
  RadioGroupProps,
  RadioGroupOption,
  RadioGroupOrientation,
} from '.';
import ConfigProvider from '../Provider';

export default {
  title: 'Data Entry/Radio',
};

const orientations: RadioGroupOrientation[] = [
  'horizontal',
  'vertical',
];

const sizes: RadioSize[] = [
  'small',
  'medium',
  'large',
];

export const Playground : StoryFn<RadioProps> = ({
  children,
  ...props
}) => (
  <Radio {...props}>
    {children}
  </Radio>
);

Playground.args = {
  children: 'label',
  error: false,
  disabled: false,
  defaultChecked: false,
  size: 'medium',
};

Playground.argTypes = {
  size: {
    options: sizes,
    control: {
      type: 'select',
    },
  },
};

export const Standalone = () => (
  <>
    <Radio />
    <Radio error />
    <Radio disabled defaultChecked />
    <Radio disabled />
  </>
);

export const Sizes = () => (
  <div style={{
    width: 'fit-content',
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }}
  >
    <Radio size="small">Small</Radio>
    <Radio size="medium">Medium</Radio>
    <ConfigProvider size="large">
      <Radio>Large</Radio>
    </ConfigProvider>
  </div>
);

export const Group: StoryFn<RadioGroupProps> = ({
  disabled,
  orientation,
  size,
}) => {
  const options: RadioGroupOption[] = [
    {
      value: 'option-1',
      label: 'Option 1',
    },
    {
      value: 'option-2',
      label: 'Option 2',
    },
    {
      value: 'option-disabled',
      label: 'Option 3',
      disabled: true,
    },
  ];

  return (
    <>
      <Typography variant="h5">From children</Typography>
      <RadioGroup
        disabled={disabled}
        orientation={orientation}
        size={size}
      >
        {options.map(({ disabled: optionDisabled, label, value }) => (
          <Radio
            key={value}
            disabled={optionDisabled}
            value={value}
          >
            {label}
          </Radio>
        ))}
      </RadioGroup>
      <br />
      <br />
      <Typography variant="h5">From options</Typography>
      <RadioGroup
        disabled={disabled}
        options={options}
        orientation={orientation}
        size={size}
      />
    </>
  );
};

Group.args = {
  disabled: false,
  orientation: 'horizontal',
  size: 'medium',
};
Group.argTypes = {
  orientation: {
    control: {
      type: 'radio',
      options: orientations,
    },
  },
  size: {
    control: {
      type: 'radio',
      options: sizes,
    },
  },
};
