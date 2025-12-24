import { useState } from 'react';
import { StoryObj } from '@storybook/react-webpack5';
import { LightIcon } from '@mezzanine-ui/icons';
import Typography from '../Typography';
import Radio, {
  RadioSize,
  RadioProps,
  RadioGroup,
  RadioGroupProps,
  RadioGroupNormalOption,
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
    error: false,
    disabled: false,
    defaultChecked: false,
    size: 'main',
  },
  render: function Render({ ...props }) {
    const [inputText, setInputText] = useState<string>('first');

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Radio {...props}>Radio Button Label</Radio>
        <Radio
          {...props}
          withInputConfig={{
            width: 140,
            onChange: (e) => setInputText(e.target.value),
            value: inputText,
          }}
        >
          Radio Button Label
        </Radio>
        <Radio {...props} hint="Support text">
          Radio Button Label
        </Radio>
        <Radio
          {...props}
          hint="Support text"
          withInputConfig={{
            width: 140,
            disabled: true,
          }}
        >
          Radio Button Label
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
  render: function Render({ ...props }) {
    const [inputText, setInputText] = useState<string>('first');

    const options: RadioGroupNormalOption[] = [
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
        <RadioGroup {...props}>
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
        <RadioGroup {...props} options={options} />
        <Typography variant="h2">Vertical</Typography>
        <RadioGroup {...props} options={options} orientation="vertical" />
      </>
    );
  },
};

export const Segmented: StoryObj = {
  render: function Render() {
    return (
      <div
        style={{
          width: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <div>
          <Typography variant="h2">Main</Typography>
          <RadioGroup type="segment">
            <Radio value="op1" type="segment" icon={LightIcon}>
              Option1
            </Radio>
            <Radio value="op2" type="segment" icon={LightIcon}>
              Option2
            </Radio>
            <Radio value="op3" type="segment" icon={LightIcon}>
              Option3
            </Radio>
            <Radio value="op4" type="segment" icon={LightIcon} disabled>
              Option4
            </Radio>
          </RadioGroup>
        </div>
        <div>
          <Typography variant="h2">Sub</Typography>
          <RadioGroup type="segment" size="sub">
            <Radio value="op1" type="segment">
              全部
            </Radio>
            <Radio value="op2" type="segment">
              已發佈
            </Radio>
            <Radio value="op3" type="segment">
              未發佈
            </Radio>
          </RadioGroup>
        </div>
        <div>
          <Typography variant="h2">Minor</Typography>
          <RadioGroup type="segment" size="minor">
            <Radio value="op1" type="segment">
              Option1
            </Radio>
            <Radio value="op2" type="segment">
              Option2
            </Radio>
            <Radio value="op3" type="segment">
              Option3
            </Radio>
            <Radio value="op4" type="segment" disabled>
              Option4
            </Radio>
          </RadioGroup>
        </div>
      </div>
    );
  },
};
