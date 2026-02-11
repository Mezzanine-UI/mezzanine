import { Meta, StoryObj } from '@storybook/react-webpack5';
import { IconDefinition, InfoOutlineIcon } from '@mezzanine-ui/icons';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { ReactNode, useState } from 'react';
import Checkbox, { CheckAll, CheckboxGroup } from '../Checkbox';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Switch from '../Toggle';
import Textarea from '../Textarea';
import { FormField } from '.';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

export default {
  title: 'Data Entry/Form',
} as Meta;

interface PlaygroundStoryArgs {
  clearable: boolean;
  controlFieldSlotLayout: ControlFieldSlotLayout;
  counter?: string;
  counterColor: FormFieldCounterColor;
  density?: FormFieldDensity;
  disabled: boolean;
  fullWidth: boolean;
  hintText?: string;
  hintTextIcon?: IconDefinition;
  label: string;
  labelInformationText: string;
  labelSpacing: FormFieldLabelSpacing;
  layout: FormFieldLayout;
  message: string;
  name: string;
  remark: string;
  required: boolean;
  showHintTextIcon: boolean;
  showRemarkIcon: boolean;
  severity?: SeverityWithInfo;
}

export const Playground: StoryObj<PlaygroundStoryArgs> = {
  args: {
    clearable: false,
    controlFieldSlotLayout: ControlFieldSlotLayout.MAIN,
    counter: '231/232',
    counterColor: FormFieldCounterColor.INFO,
    density: FormFieldDensity.BASE,
    disabled: false,
    fullWidth: false,
    hintText: 'hint text',
    label: 'label',
    labelInformationText: 'This is information tooltip text',
    labelSpacing: FormFieldLabelSpacing.MAIN,
    layout: FormFieldLayout.VERTICAL,
    message: 'message',
    name: 'field-name',
    remark: 'remark',
    required: false,
    showHintTextIcon: true,
    showRemarkIcon: false,
    severity: 'info',
  },
  argTypes: {
    controlFieldSlotLayout: {
      control: {
        type: 'select',
      },
      options: Object.values(ControlFieldSlotLayout),
    },
    counterColor: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldCounterColor),
    },
    density: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldDensity),
    },
    labelSpacing: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldLabelSpacing),
    },
    layout: {
      control: {
        type: 'select',
      },
      options: Object.values(FormFieldLayout),
    },
    severity: {
      control: {
        type: 'select',
      },
      options: ['info', 'success', 'warning', 'error'],
    },
  },
  render: function Render({
    clearable,
    controlFieldSlotLayout,
    counter,
    counterColor,
    density,
    disabled,
    fullWidth,
    hintText,
    label,
    labelInformationText,
    labelSpacing,
    layout,
    name,
    remark,
    required,
    showRemarkIcon,
    severity,
  }) {
    const renderField = (control: ReactNode) => (
      <FormField
        controlFieldSlotLayout={controlFieldSlotLayout}
        counter={counter}
        counterColor={counterColor}
        density={density}
        disabled={disabled}
        fullWidth={fullWidth}
        hintText={hintText}
        label={label}
        labelInformationIcon={showRemarkIcon ? InfoOutlineIcon : undefined}
        labelInformationText={labelInformationText}
        labelOptionalMarker={remark}
        labelSpacing={labelSpacing}
        layout={layout}
        name={name}
        required={required}
        severity={severity}
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
          <CheckboxGroup
            onChange={(event) => setValue(event.target.values)}
            options={options}
            value={value}
          />
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
        {renderField(<Textarea placeholder="please enter text" rows={4} />)}
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
          density={FormFieldDensity.BASE}
          hintText="Label and input on the same row with base spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Username"
          layout={FormFieldLayout.HORIZONTAL}
          name="username-h-base"
        >
          <Input placeholder="Enter username" />
        </FormField>

        <h3>Horizontal Tight</h3>
        <FormField
          density={FormFieldDensity.TIGHT}
          hintText="Label and input on the same row with tight spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Email"
          layout={FormFieldLayout.HORIZONTAL}
          name="email-h-tight"
        >
          <Input placeholder="Enter email" />
        </FormField>

        <h3>Horizontal Narrow</h3>
        <FormField
          density={FormFieldDensity.NARROW}
          hintText="Label and input on the same row with narrow spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Phone"
          layout={FormFieldLayout.HORIZONTAL}
          name="phone-h-narrow"
        >
          <Input placeholder="Enter phone" />
        </FormField>

        <h3>Horizontal Wide</h3>
        <FormField
          density={FormFieldDensity.WIDE}
          hintText="Label and input on the same row with wide spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Address"
          layout={FormFieldLayout.HORIZONTAL}
          name="address-h-wide"
        >
          <Input placeholder="Enter address" />
        </FormField>

        <hr style={{ margin: '40px 0' }} />

        <h2>Vertical/Stretch Layouts</h2>

        <h3>Stretch Tight</h3>
        <FormField
          density={FormFieldDensity.TIGHT}
          hintText="Compact vertical spacing between label and input"
          hintTextIcon={InfoOutlineIcon}
          label="First Name"
          layout={FormFieldLayout.STRETCH}
          name="firstname-s-tight"
        >
          <Input placeholder="Enter first name" />
        </FormField>

        <h3>Stretch Narrow</h3>
        <FormField
          density={FormFieldDensity.NARROW}
          hintText="Standard vertical spacing between label and input"
          hintTextIcon={InfoOutlineIcon}
          label="Last Name"
          layout={FormFieldLayout.STRETCH}
          name="lastname-s-narrow"
        >
          <Input placeholder="Enter last name" />
        </FormField>

        <h3>Stretch Wide</h3>
        <FormField
          density={FormFieldDensity.WIDE}
          hintText="Spacious vertical spacing between label and input"
          hintTextIcon={InfoOutlineIcon}
          label="Biography"
          layout={FormFieldLayout.STRETCH}
          name="bio-s-wide"
        >
          <Textarea placeholder="Tell us about yourself" rows={4} />
        </FormField>

        <h3>Vertical</h3>
        <FormField
          hintText="Default vertical layout with standard spacing"
          hintTextIcon={InfoOutlineIcon}
          label="Comments"
          layout={FormFieldLayout.VERTICAL}
          name="comments-vertical"
          required
        >
          <Textarea placeholder="Add your comments" rows={4} />
        </FormField>
      </>
    );
  },
};
