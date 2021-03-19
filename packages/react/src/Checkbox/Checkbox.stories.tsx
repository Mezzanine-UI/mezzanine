import { useMemo, useState } from 'react';
import { Story } from '@storybook/react';
import Typography from '../Typography';
import Checkbox, {
  CheckboxSize,
  CheckboxGroupOption,
  CheckboxGroupOrientation,
  CheckboxGroupProps,
  CheckboxGroup,
  CheckAll,
} from '.';

export default {
  title: 'Data Entry/Checkbox',
};

const orientations: CheckboxGroupOrientation[] = [
  'horizontal',
  'vertical',
];

const sizes: CheckboxSize[] = [
  'small',
  'medium',
  'large',
];

export const Standalone = () => (
  <>
    <Checkbox defaultChecked />
    <Checkbox error defaultChecked />
    <Checkbox disabled />
    <Checkbox disabled defaultChecked />
    <Checkbox indeterminate defaultChecked />
    <Checkbox indeterminate defaultChecked disabled />
  </>
);

export const Sizes = () => (
  <>
    <Checkbox size="small">Small</Checkbox>
    <br />
    <br />
    <Checkbox size="medium">Medium</Checkbox>
    <br />
    <br />
    <Checkbox size="large">Large</Checkbox>
  </>
);

export const Group: Story<CheckboxGroupProps> = ({
  disabled,
  orientation,
  size,
}) => {
  const options: CheckboxGroupOption[] = useMemo(() => [
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
  ], []);

  return (
    <>
      <Typography>From children</Typography>
      <CheckboxGroup
        disabled={disabled}
        orientation={orientation}
        size={size}
      >
        {options.map(({ disabled: optionDisabled, label, value }) => (
          <Checkbox
            key={value}
            disabled={optionDisabled}
            value={value}
          >
            {label}
          </Checkbox>
        ))}
      </CheckboxGroup>
      <br />
      <br />
      <Typography>From options</Typography>
      <CheckboxGroup
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

export const CheckAllStory: Story<CheckboxGroupProps> = ({
  disabled,
  orientation,
  size,
}) => {
  const options: CheckboxGroupOption[] = useMemo(() => [
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
  ], []);
  const [value, setValue] = useState([options[0].value]);

  return (
    <CheckAll
      label="Check All"
    >
      <CheckboxGroup
        disabled={disabled}
        options={options}
        onChange={setValue}
        orientation={orientation}
        size={size}
        value={value}
      />
    </CheckAll>
  );
};

CheckAllStory.storyName = 'Check All';
CheckAllStory.args = {
  disabled: false,
  orientation: 'horizontal',
  size: 'medium',
};
CheckAllStory.argTypes = {
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
