import { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  CheckedOutlineIcon,
  ErrorOutlineIcon,
  IconDefinition,
  InfoFilledIcon,
  InfoOutlineIcon,
  QuestionOutlineIcon,
  WarningOutlineIcon,
} from '@mezzanine-ui/icons';
import {
  ControlFieldSlotLayout,
  FormFieldCounterColor,
  FormFieldDensity,
  FormFieldLabelSpacing,
  FormFieldLayout,
} from '@mezzanine-ui/core/form';
import { ChangeEvent, ReactNode, useRef, useState } from 'react';
import Checkbox, { CheckAll, CheckboxGroup } from '../Checkbox';
import Input from '../Input';
import Radio, { RadioGroup } from '../Radio';
import Switch from '../Toggle';
import Textarea from '../Textarea';
import { FormField, FormGroup } from '.';
import { SeverityWithInfo } from '@mezzanine-ui/system/severity';

const hintTextIconOptions = {
  none: undefined,
  InfoOutlineIcon,
  InfoFilledIcon,
  WarningOutlineIcon,
  ErrorOutlineIcon,
  CheckedOutlineIcon,
  QuestionOutlineIcon,
} satisfies Record<string, IconDefinition | undefined>;

type HintTextIconOptionKey = keyof typeof hintTextIconOptions;

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
  hintTextIcon: HintTextIconOptionKey;
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
    hintTextIcon: 'InfoFilledIcon',
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
    hintTextIcon: {
      control: {
        type: 'select',
      },
      options: Object.keys(hintTextIconOptions),
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
    hintTextIcon,
    label,
    labelInformationText,
    labelSpacing,
    layout,
    name,
    remark,
    required,
    showHintTextIcon,
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
        hintTextIcon={hintTextIconOptions[hintTextIcon]}
        showHintTextIcon={showHintTextIcon}
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

export const HorizontalBase: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.BASE}
        hintText="Label and input on the same row with base spacing"
        hintTextIcon={InfoFilledIcon}
        label="Username"
        layout={FormFieldLayout.HORIZONTAL}
        name="username-h-base"
      >
        <Input placeholder="Enter username" />
      </FormField>
    );
  },
};

export const HorizontalTight: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.TIGHT}
        hintText="Label and input on the same row with tight spacing"
        hintTextIcon={InfoFilledIcon}
        label="Email"
        layout={FormFieldLayout.HORIZONTAL}
        name="email-h-tight"
      >
        <Input placeholder="Enter email" />
      </FormField>
    );
  },
};

export const HorizontalNarrow: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.NARROW}
        hintText="Label and input on the same row with narrow spacing"
        hintTextIcon={InfoFilledIcon}
        label="Phone"
        layout={FormFieldLayout.HORIZONTAL}
        name="phone-h-narrow"
      >
        <Input placeholder="Enter phone" />
      </FormField>
    );
  },
};

export const HorizontalWide: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.WIDE}
        hintText="Label and input on the same row with wide spacing"
        hintTextIcon={InfoFilledIcon}
        label="Address"
        layout={FormFieldLayout.HORIZONTAL}
        name="address-h-wide"
      >
        <Input placeholder="Enter address" />
      </FormField>
    );
  },
};

export const StretchTight: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.TIGHT}
        hintText="Compact vertical spacing between label and input"
        hintTextIcon={InfoFilledIcon}
        label="First Name"
        layout={FormFieldLayout.STRETCH}
        name="firstname-s-tight"
      >
        <Input placeholder="Enter first name" />
      </FormField>
    );
  },
};

export const StretchNarrow: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.NARROW}
        hintText="Standard vertical spacing between label and input"
        hintTextIcon={InfoFilledIcon}
        label="Last Name"
        layout={FormFieldLayout.STRETCH}
        name="lastname-s-narrow"
      >
        <Input placeholder="Enter last name" />
      </FormField>
    );
  },
};

export const StretchWide: StoryObj = {
  render: function Render() {
    return (
      <FormField
        density={FormFieldDensity.WIDE}
        hintText="Spacious vertical spacing between label and input"
        hintTextIcon={InfoFilledIcon}
        label="Company"
        layout={FormFieldLayout.STRETCH}
        name="company-s-wide"
      >
        <Input placeholder="Enter company name" />
      </FormField>
    );
  },
};

export const Vertical: StoryObj = {
  render: function Render() {
    return (
      <FormField
        hintText="Default vertical layout with standard spacing"
        hintTextIcon={InfoFilledIcon}
        label="Name"
        layout={FormFieldLayout.VERTICAL}
        name="name-vertical"
        required
      >
        <Input placeholder="Enter your name" />
      </FormField>
    );
  },
};

export const ControlFieldSlotColumnsExample: StoryObj = {
  render: function Render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField
          label="持卡人姓名："
          layout={FormFieldLayout.VERTICAL}
          name="cardholder-name"
        >
          <Input placeholder="請輸入姓名" />
        </FormField>
        <FormField
          controlFieldSlotColumns={4}
          label="信用卡號："
          layout={FormFieldLayout.VERTICAL}
          name="card-number"
        >
          <Input placeholder="0000" />
          <Input placeholder="0000" />
          <Input placeholder="0000" />
          <Input placeholder="0000" />
        </FormField>
        <FormField
          controlFieldSlotColumns={2}
          label="信用卡到期日："
          layout={FormFieldLayout.VERTICAL}
          name="card-expiry"
        >
          <Input placeholder="mm" />
          <Input placeholder="yy" />
        </FormField>
        <FormField
          label="信用卡檢查碼："
          layout={FormFieldLayout.VERTICAL}
          name="card-cvv"
        >
          <Input placeholder="請輸入檢查碼" />
        </FormField>
      </div>
    );
  },
};

export const CreditCardRecipeExample: StoryObj = {
  render: function Render() {
    const [cardSegments, setCardSegments] = useState(['', '', '', '']);
    const [expireMonth, setExpireMonth] = useState('');
    const [expireYear, setExpireYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const cardRefs = [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
    ];
    const expireYearRef = useRef<HTMLInputElement>(null);
    const cvvRef = useRef<HTMLInputElement>(null);

    const handleCardSegmentChange =
      (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
        const next = [...cardSegments];
        next[index] = value;
        setCardSegments(next);
        if (value.length === 4 && index < 3) {
          cardRefs[index + 1].current?.focus();
        }
      };

    const handleExpireMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
      setExpireMonth(value);
      if (value.length === 2) {
        expireYearRef.current?.focus();
      }
    };

    const handleExpireYearChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, '').slice(0, 2);
      setExpireYear(value);
      if (value.length === 2) {
        cvvRef.current?.focus();
      }
    };

    const isCardComplete = cardSegments.every((s) => s.length === 4);
    const isExpireComplete =
      expireMonth.length === 2 && expireYear.length === 2;
    const isCvvComplete = cvv.length >= 3;
    const isNameComplete = name.trim().length > 0;

    const cardSeverity: SeverityWithInfo =
      submitted && !isCardComplete ? 'error' : 'info';
    const expireSeverity: SeverityWithInfo =
      submitted && !isExpireComplete ? 'error' : 'info';
    const cvvSeverity: SeverityWithInfo =
      submitted && !isCvvComplete ? 'error' : 'info';
    const nameSeverity: SeverityWithInfo =
      submitted && !isNameComplete ? 'error' : 'info';

    return (
      <div style={{ maxWidth: 480 }}>
        <FormGroup title="信用卡資訊">
          <FormField
            hintText={
              submitted && !isNameComplete ? '請輸入持卡人姓名' : undefined
            }
            label="持卡人姓名："
            layout={FormFieldLayout.VERTICAL}
            name="cardholder-name"
            severity={nameSeverity}
          >
            <Input
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              value={name}
            />
          </FormField>
          <FormField
            controlFieldSlotColumns={4}
            hintText={
              submitted && !isCardComplete ? '請輸入完整卡號' : undefined
            }
            label="信用卡號："
            layout={FormFieldLayout.VERTICAL}
            name="card-number"
            severity={cardSeverity}
          >
            {cardSegments.map((segment, i) => (
              <Input
                key={i}
                inputRef={cardRefs[i]}
                onChange={handleCardSegmentChange(i)}
                placeholder="0000"
                value={segment}
              />
            ))}
          </FormField>
          <FormField
            controlFieldSlotColumns={2}
            hintText={
              submitted && !isExpireComplete ? '請輸入有效期限' : undefined
            }
            label="有效期限："
            layout={FormFieldLayout.VERTICAL}
            name="card-expiry"
            severity={expireSeverity}
          >
            <Input
              onChange={handleExpireMonthChange}
              placeholder="MM"
              value={expireMonth}
            />
            <Input
              inputRef={expireYearRef}
              onChange={handleExpireYearChange}
              placeholder="YY"
              value={expireYear}
            />
          </FormField>
          <FormField
            hintText={submitted && !isCvvComplete ? '請輸入 CVV' : undefined}
            label="檢查碼："
            layout={FormFieldLayout.VERTICAL}
            name="card-cvv"
            severity={cvvSeverity}
          >
            <Input
              inputRef={cvvRef}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
              }
              placeholder="CVV"
              value={cvv}
            />
          </FormField>
        </FormGroup>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => setSubmitted(true)} type="button">
            送出
          </button>
          {submitted &&
            isCardComplete &&
            isExpireComplete &&
            isCvvComplete &&
            isNameComplete && (
              <span style={{ marginLeft: 12, color: 'green' }}>✓ 驗證通過</span>
            )}
        </div>
      </div>
    );
  },
};
