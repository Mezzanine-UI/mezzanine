import { StoryFn, Meta } from '@storybook/react-webpack5';
import { InfoCircleFilledIcon } from '@mezzanine-ui/icons';
import { Severity } from '@mezzanine-ui/system/severity';
import { ReactNode, useState } from 'react';
import Icon from '../Icon';
import Checkbox, { CheckboxGroup, CheckAll } from '../Checkbox';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Switch from '../Toggle';
import Textarea from '../Textarea';
import { FormField, FormLabel, FormHintText } from '.';

export default {
  title: 'V1/Form',
} as Meta;

const severities: Severity[] = ['error', 'success', 'warning'];

interface PlaygroundStoryArgs {
  clearable: boolean;
  disabled: boolean;
  fullWidth: boolean;
  label: string;
  message: string;
  remark: string;
  required: boolean;
  severity?: Severity;
  showRemarkIcon: boolean;
}

export const Playground: StoryFn<PlaygroundStoryArgs> = ({
  clearable,
  disabled,
  fullWidth,
  label,
  message,
  remark,
  required,
  severity,
  showRemarkIcon,
}) => {
  const renderField = (control: ReactNode) => (
    <FormField
      disabled={disabled}
      fullWidth={fullWidth}
      required={required}
      severity={severity}
    >
      <FormLabel
        remark={remark}
        remarkIcon={showRemarkIcon && <Icon icon={InfoCircleFilledIcon} />}
      >
        {label}
      </FormLabel>
      {control}
      <FormHintText>{message}</FormHintText>
    </FormField>
  );
  const CheckAllExample = () => {
    const [value, setValue] = useState(['2']);
    const options = [
      {
        label: 'Option 1',
        value: '1',
      },
      {
        label: 'Option 2',
        value: '2',
      },
      {
        disabled: true,
        label: 'Option 3',
        value: '3',
      },
    ];

    return renderField(
      <CheckAll label="Check All">
        <CheckboxGroup onChange={setValue} options={options} value={value} />
      </CheckAll>,
    );
  };

  return (
    <>
      {renderField(
        <Input clearable={clearable} placeholder="please enter text" />,
      )}
      <br />
      <br />
      {renderField(
        <Textarea
          clearable={clearable}
          placeholder="please enter text"
          rows={4}
        />,
      )}
      <br />
      <br />
      {renderField(<Switch />)}
      <br />
      <br />
      {renderField(
        <RadioGroup>
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
          <Radio disabled value="3">
            Option 3
          </Radio>
        </RadioGroup>,
      )}
      <br />
      <br />
      {renderField(
        <CheckboxGroup>
          <Checkbox value="1">Option 1</Checkbox>
          <Checkbox value="2">Option 2</Checkbox>
          <Checkbox disabled value="3">
            Option 3
          </Checkbox>
        </CheckboxGroup>,
      )}
      <br />
      <br />
      <CheckAllExample />
    </>
  );
};

Playground.args = {
  clearable: false,
  disabled: false,
  fullWidth: false,
  label: 'label',
  message: 'message',
  required: false,
  remark: 'remark',
  severity: undefined,
  showRemarkIcon: false,
};
Playground.argTypes = {
  severity: {
    options: [undefined, ...severities],
    control: {
      type: 'select',
    },
  },
};
