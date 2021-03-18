import { Story, Meta } from '@storybook/react';
import { InfoCircleFilledIcon } from '@mezzanine-ui/icons';
import { Severity } from '@mezzanine-ui/system/severity';
import { ReactNode } from 'react';
import Icon from '../Icon';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Switch from '../Switch';
import Textarea from '../Textarea';
import {
  FormField,
  FormLabel,
  FormMessage,
} from '.';

export default {
  title: 'Data Entry/Form',
} as Meta;

const severities: Severity[] = [
  'error',
  'success',
  'warning',
];

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

export const Playground: Story<PlaygroundStoryArgs> = ({
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
      <FormMessage>{message}</FormMessage>
    </FormField>
  );

  return (
    <>
      {renderField(
        <Input
          clearable={clearable}
          placeholder="please enter text"
        />,
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
      {renderField(
        <Switch />,
      )}
      <br />
      <br />
      {renderField(
        <RadioGroup>
          <Radio value="1">Option 1</Radio>
          <Radio value="2">Option 2</Radio>
          <Radio disabled value="3">Option 3</Radio>
        </RadioGroup>,
      )}
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
    control: {
      type: 'select',
      options: [
        undefined,
        ...severities,
      ],
    },
  },
};
