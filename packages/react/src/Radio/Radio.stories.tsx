import { useState } from 'react';
import { StoryFn } from '@storybook/react-webpack5';
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

const orientations: RadioGroupOrientation[] = ['horizontal', 'vertical'];

const sizes: RadioSize[] = ['small', 'medium', 'large'];

export const Playground: StoryFn<RadioProps> = ({ children, ...props }) => {
  const [inputText, setInputText] = useState<string>('first');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Radio
        {...props}
        withInputConfig={{
          width: 140,
          onChange: (e) => setInputText(e.target.value),
          value: inputText,
        }}
      >
        {children}
      </Radio>
      <Radio {...props} hint="Support text">
        {children}
      </Radio>
      <Radio
        {...props}
        hint="Support text"
        withInputConfig={{
          width: 140,
          disabled: true,
        }}
      >
        {children}
      </Radio>
    </div>
  );
};

Playground.args = {
  children: 'Radio Button Label',
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
  <div
    style={{
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
  const [inputText, setInputText] = useState<string>('first');

  const options: RadioGroupOption[] = [
    {
      value: 'option-1',
      label: 'Option 1',
      withInputConfig: {
        width: 140,
        onChange: (e) => setInputText(e.target.value),
        value: inputText,
      },
    },
    {
      value: 'option-2',
      label: 'Option 2',
      hint: 'option2 support text',
    },
    {
      value: 'option-disabled',
      label: 'Option 3',
      disabled: true,
    },
    {
      value: 'option-error',
      label: 'Option 4',
      error: true,
    },
  ];

  return (
    <>
      <Typography variant="h2">From children</Typography>
      <RadioGroup disabled={disabled} orientation={orientation} size={size}>
        {options.map(
          ({
            disabled: optionDisabled,
            error: optionError,
            hint,
            label,
            value,
            withInputConfig,
          }) => (
            <Radio
              key={value}
              disabled={optionDisabled}
              error={optionError}
              hint={hint}
              value={value}
              withInputConfig={withInputConfig}
            >
              {label}
            </Radio>
          ),
        )}
      </RadioGroup>
      <br />
      <br />
      <Typography variant="h2">From options</Typography>
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
