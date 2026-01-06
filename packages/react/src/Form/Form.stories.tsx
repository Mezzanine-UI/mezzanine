import { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconDefinition, InfoOutlineIcon } from '@mezzanine-ui/icons';
import {
  FormFieldCounterColor,
  FormFieldHintTextColor,
  FormFieldSize,
} from '@mezzanine-ui/core/form';
import { ReactNode, useState } from 'react';
import Checkbox, { CheckAll, CheckboxGroup } from '../Checkbox';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Switch from '../Toggle';
import Textarea from '../Textarea';
import { FormField } from '.';

export default {
  title: 'Data Entry/Form',
} as Meta;

interface PlaygroundStoryArgs {
  clearable: boolean;
  counter?: string;
  counterColor: FormFieldCounterColor;
  disabled: boolean;
  fullWidth: boolean;
  hintTextColor?: FormFieldHintTextColor;
  hintText?: string;
  hintTextIcon?: IconDefinition;
  label: string;
  labelInformationText: string;
  message: string;
  name: string;
  remark: string;
  required: boolean;
  showHintTextIcon: boolean;
  showRemarkIcon: boolean;
  size: FormFieldSize;
}

export const Playground: StoryObj<PlaygroundStoryArgs> = {
  args: {
    clearable: false,
    counter: '231/232',
    counterColor: FormFieldCounterColor.INFO,
    disabled: false,
    fullWidth: false,
    hintText: 'hint text',
    label: 'label',
    labelInformationText: 'This is information tooltip text',
    message: 'message',
    name: 'field-name',
    remark: 'remark',
    required: false,
    showHintTextIcon: true,
    showRemarkIcon: false,
    size: FormFieldSize.VERTICAL,
  },
  argTypes: {
    counterColor: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldCounterColor),
    },
    hintTextColor: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldHintTextColor),
    },
    size: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldSize),
    },
  },
  render: function Render({
    clearable,
    counter,
    counterColor,
    disabled,
    fullWidth,
    hintTextColor,
    hintText,
    label,
    labelInformationText,
    name,
    remark,
    required,
    showHintTextIcon,
    showRemarkIcon,
    size,
  }) {
    const renderField = (control: ReactNode) => (
      <FormField
        counter={counter}
        counterColor={counterColor}
        disabled={disabled}
        fullWidth={fullWidth}
        hintText={hintText}
        hintTextColor={hintTextColor}
        hintTextIcon={showHintTextIcon ? InfoOutlineIcon : undefined}
        label={label}
        labelInformationIcon={showRemarkIcon ? InfoOutlineIcon : undefined}
        labelInformationText={labelInformationText}
        labelOptionalMarker={remark}
        name={name}
        required={required}
        size={size}
      >
        {control}
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
  },
};

export const SizeVariants: StoryObj = {
  render: function Render() {
    return (
      <>
        <h2>Horizontal Layouts</h2>

        <h3>Horizontal Base</h3>
        <FormField
          hintText="Label and input on the same row with base spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Username"
          name="username-h-base"
          size={FormFieldSize.HORIZONTAL_BASE}
        >
          <Input placeholder="Enter username" />
        </FormField>

        <h3>Horizontal Tight</h3>
        <FormField
          hintText="Label and input on the same row with tight spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Email"
          name="email-h-tight"
          size={FormFieldSize.HORIZONTAL_TIGHT}
        >
          <Input placeholder="Enter email" />
        </FormField>

        <h3>Horizontal Narrow</h3>
        <FormField
          hintText="Label and input on the same row with narrow spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Phone"
          name="phone-h-narrow"
          size={FormFieldSize.HORIZONTAL_NARROW}
        >
          <Input placeholder="Enter phone" />
        </FormField>

        <h3>Horizontal Wide</h3>
        <FormField
          hintText="Label and input on the same row with wide spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Address"
          name="address-h-wide"
          size={FormFieldSize.HORIZONTAL_WIDE}
        >
          <Input placeholder="Enter address" />
        </FormField>

        <hr style={{ margin: '40px 0' }} />

        <h2>Vertical/Stretch Layouts</h2>

        <h3>Stretch Tight</h3>
        <FormField
          hintText="Compact vertical spacing between label and input"
          hintTextIcon={InfoOutlineIcon}
          label="First Name"
          name="firstname-s-tight"
          size={FormFieldSize.STRETCH_TIGHT}
        >
          <Input placeholder="Enter first name" />
        </FormField>

        <h3>Stretch Narrow</h3>
        <FormField
          hintText="Standard vertical spacing between label and input"
          hintTextIcon={InfoOutlineIcon}
          label="Last Name"
          name="lastname-s-narrow"
          size={FormFieldSize.STRETCH_NARROW}
        >
          <Input placeholder="Enter last name" />
        </FormField>

        <h3>Stretch Wide</h3>
        <FormField
          hintText="Spacious vertical spacing between label and input"
          hintTextIcon={InfoOutlineIcon}
          label="Biography"
          name="bio-s-wide"
          size={FormFieldSize.STRETCH_WIDE}
        >
          <Textarea placeholder="Tell us about yourself" rows={4} />
        </FormField>

        <h3>Vertical</h3>
        <FormField
          hintText="Default vertical layout with standard spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Comments"
          name="comments-vertical"
          required
          size={FormFieldSize.VERTICAL}
        >
          <Textarea placeholder="Add your comments" rows={4} />
        </FormField>
      </>
    );
  },
};
