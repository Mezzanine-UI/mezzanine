import { Story } from '@storybook/react';
import Typography from '../Typography';
import Radio, {
  RadioSize,
  RadioGroup,
  RadioGroupProps,
  RadioGroupOption,
  RadioGroupOrientation,
} from '.';

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

export const Standalone = () => (
  <>
    <Radio />
    <Radio error />
    <Radio disabled defaultChecked />
    <Radio disabled />
  </>
);

export const Sizes = () => (
  <>
    <Radio size="small">預設文字</Radio>
    <br />
    <br />
    <Radio size="medium">預設文字</Radio>
    <br />
    <br />
    <Radio size="large">預設文字</Radio>
  </>
);

export const Group: Story<RadioGroupProps> = ({
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
      <Typography>From children</Typography>
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
      <Typography>From options</Typography>
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
