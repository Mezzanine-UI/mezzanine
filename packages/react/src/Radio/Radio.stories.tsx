import { useState } from 'react';
import { StoryObj } from '@storybook/react-webpack5';
import Typography from '../Typography';
import Radio, {
  RadioSize,
  RadioProps,
  RadioGroup,
  RadioGroupProps,
  RadioGroupOption,
  RadioGroupOrientation,
} from '.';

export default {
  title: 'Data Entry/Radio',
};

const orientations: RadioGroupOrientation[] = ['horizontal', 'vertical'];

const sizes: RadioSize[] = ['minor', 'sub', 'main'];

export const Playground: StoryObj<RadioProps> = {
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: sizes,
    },
  },
  args: {
    children: 'Radio Button Label',
    error: false,
    disabled: false,
    defaultChecked: false,
    size: 'main',
  },
  render: function Render({ children, ...props }) {
    const [inputText, setInputText] = useState<string>('first');

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Radio {...props}>{children}</Radio>
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
  },
};

export const Standalone: StoryObj = {
  render: function Render() {
    return (
      <>
        <Radio />
        <Radio error />
        <Radio disabled defaultChecked />
        <Radio disabled />
      </>
    );
  },
};

export const Sizes: StoryObj = {
  render: function Render() {
    return (
      <div
        style={{
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        <Radio size="minor">Minor</Radio>
        <Radio size="sub">Sub</Radio>
        <Radio size="main">Main</Radio>
      </div>
    );
  },
};

export const Group: StoryObj<RadioGroupProps> = {
  argTypes: {
    orientation: {
      control: {
        type: 'radio',
      },
      options: orientations,
    },
    size: {
      control: {
        type: 'select',
      },
      options: sizes,
    },
  },
  args: {
    disabled: false,
    orientation: 'horizontal',
    size: 'main',
  },
  render: function Render({ disabled, orientation, size }) {
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
        <Typography variant="h2">Vertical</Typography>
        <RadioGroup
          disabled={disabled}
          options={options}
          orientation="vertical"
          size={size}
        />
      </>
    );
  },
};
