import { Story, Meta } from '@storybook/react';
import { InfoCircleFilledIcon } from '@mezzanine-ui/icons';
import { Severity } from '@mezzanine-ui/system/severity';
import Icon from '../Icon';
import Input from '../Input';
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
}) => (
  <>
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
      <Input
        clearable={clearable}
        placeholder="please enter text"
      />
      <FormMessage>{message}</FormMessage>
    </FormField>
    <br />
    <br />
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
      <Textarea
        clearable={clearable}
        placeholder="please enter text"
        rows={4}
      />
      <FormMessage>{message}</FormMessage>
    </FormField>
  </>
);

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
