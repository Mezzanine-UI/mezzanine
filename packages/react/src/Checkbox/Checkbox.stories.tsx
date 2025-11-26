import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChangeEvent, FormEvent, ReactNode, useState } from 'react';
import Checkbox, { CheckboxProps } from '.';
import Tag from '../Tag';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<CheckboxProps>;

const modes: CheckboxProps['mode'][] = ['main', 'sub', 'chip'];

export const Playground: Story = {
  args: {
    id: 'playground-checkbox',
    label: 'Checkbox Label',
    description: 'Supporting text',
    mode: 'main',
    name: 'playground-checkbox',
    checked: false,
    indeterminate: false,
    disabled: false,
    value: 'checkbox-value',
    withEditInput: false,
    editableInput: undefined,
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
      description: 'The label text displayed beside the checkbox',
      table: {
        type: { summary: 'string' },
      },
    },
    description: {
      control: {
        type: 'text',
      },
      description: 'The description text displayed below the label',
      table: {
        type: { summary: 'string' },
      },
    },
    mode: {
      control: {
        type: 'select',
      },
      options: modes,
      description: 'The mode of checkbox',
      table: {
        type: { summary: "'main' | 'sub' | 'chip'" },
        defaultValue: { summary: "'main'" },
      },
    },
    checked: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox is in indeterminate state',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    defaultChecked: {
      control: false,
      table: {
        disable: true,
      },
    },
    inputProps: {
      control: false,
      table: {
        disable: true,
      },
    },
    name: {
      control: false,
      table: {
        disable: true,
      },
    },
    value: {
      control: {
        type: 'text',
      },
      description: 'The value of checkbox. Used when checkbox is inside a CheckboxGroup.',
      table: {
        type: { summary: 'string' },
      },
    },
    onChange: {
      control: false,
      table: {
        disable: true,
      },
    },
    className: {
      control: false,
      table: {
        disable: true,
      },
    },
    withEditInput: {
      control: {
        type: 'boolean',
      },
      description: 'Whether to show an editable input when checkbox is checked',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    editableInput: {
      control: {
        type: 'object',
      },
      description: 'Configuration for editable input. If not provided and withEditInput is true, default values will be used.',
      table: {
        type: { summary: 'Omit<BaseInputProps, "variant"> | undefined' },
      },
    },
  },
  render: (props: CheckboxProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      // eslint-disable-next-line no-console
      console.log('Checkbox changed:', {
        checked: event.target.checked,
        value: event.target.value || props.value || 'no value',
        indeterminate: (event.target as HTMLInputElement).indeterminate,
        label: props.label,
      });
    };

    return <Checkbox {...props} onChange={handleChange} />;
  },
};

export const State = () => {
  return (
    <>
      <ItemList>
        <SectionItem label="Main" direction="column">
          <ItemContent>
            <Typography>Normal:</Typography>
            <InteractiveCheckbox id="state-main-1" label="Checkbox Label" name="state-main-1" description="Supporting text" value="main-1" />
          </ItemContent>
          <ItemContent>
            <Typography>Checked:</Typography>
            <InteractiveCheckbox
              id="state-main-2"
              label="Checkbox Label"
              name="state-main-2"
              description="Supporting text"
              initialChecked
              value="main-2"
            />
          </ItemContent>
          <ItemContent>
            <Typography>Indeterminate:</Typography>
            <Checkbox id="state-main-indeterminate" label="Checkbox Label" name="state-main-indeterminate" description="Supporting text" indeterminate />
          </ItemContent>
          <ItemContent>
            <Typography>Disabled:</Typography>
            <InteractiveCheckbox
              id="state-main-3"
              label="Checkbox Label"
              name="state-main-3"
              description="Supporting text"
              disabled
              value="main-3"
            />
          </ItemContent>
          <ItemContent>
            <Typography>With editable input:</Typography>
            <InteractiveCheckbox
              id="state-main-4"
              label="Checkbox Label"
              name="state-main-4"
              description="Supporting text"
              withEditInput
              value="main-4"
            />
          </ItemContent>
        </SectionItem>
        <SectionItem label="Sub" direction="column">
          <ItemContent>
            <Typography>Normal:</Typography>
            <InteractiveCheckbox id="state-sub-1" label="Checkbox Label" name="state-sub-1" description="Supporting text" mode="sub" value="sub-1" />
          </ItemContent>
          <ItemContent>
            <Typography>Checked:</Typography>
            <InteractiveCheckbox id="state-sub-2" label="Checkbox Label" name="state-sub-2" description="Supporting text" mode="sub" initialChecked value="sub-2" />
          </ItemContent>
          <ItemContent>
            <Typography>Indeterminate:</Typography>
            <Checkbox id="state-sub-indeterminate" label="Checkbox Label" name="state-sub-indeterminate" description="Supporting text" mode="sub" indeterminate />
          </ItemContent>
          <ItemContent>
            <Typography>Disabled:</Typography>
            <Checkbox id="state-sub-disabled" label="Checkbox Label" name="state-sub-disabled" description="Supporting text" mode="sub" disabled />
          </ItemContent>
          <ItemContent>
            <Typography>With editable input:</Typography>
            <InteractiveCheckbox
              id="state-sub-4"
              label="Checkbox Label"
              name="state-sub-4"
              description="Supporting text"
              withEditInput
              value="sub-4"
            />
          </ItemContent>
        </SectionItem>
        <SectionItem label="Chip" direction="column">
          <ItemContent>
            <Typography>Normal:</Typography>
            <Checkbox id="state-chip-1" label="Checkbox Label" name="state-chip-1" description="Supporting text" mode="chip" />
          </ItemContent>
          <ItemContent>
            <Typography>Checked:</Typography>
            <Checkbox id="state-chip-2" label="Checkbox Label" name="state-chip-2" description="Supporting text" mode="chip" checked />
          </ItemContent>
          <ItemContent>
            <Typography>Disabled:</Typography>
            <Checkbox id="state-chip-3" label="Checkbox Label" name="state-chip-3" description="Supporting text" mode="chip" disabled />
          </ItemContent>
        </SectionItem>
      </ItemList>
    </>
  );
};

const SectionItem = ({
  children,
  label,
  direction = 'row',
}: {
  children: ReactNode;
  label?: string;
  direction?: 'column' | 'row';
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      width: '33%',
      height: 'auto',
      backgroundColor: '#F3F4F6',
      padding: 32,
    }}
  >
    <Tag label={label ?? ''} size="main" type="static" />
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: direction === 'row' ? 'center' : 'flex-start',
        height: direction === 'row' ? 'auto' : 'auto',
        flexDirection: direction,
        gap: direction === 'row' ? 8 : 16,
        marginTop: 8,
      }}
    >
      {children}
    </div>
  </div>
);

const ItemList = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', gap: '36px', alignItems: 'flex-start' }}>
    {children}
  </div>
);

const ItemContent = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      marginBottom: 16,
    }}
  >
    {children}
  </div>
);

type InteractiveCheckboxProps = Omit<
  CheckboxProps,
  'checked' | 'indeterminate' | 'defaultChecked' | 'onChange'
> & {
  initialChecked?: boolean;
  initialIndeterminate?: boolean;
};

const InteractiveCheckbox = ({
  initialChecked = false,
  initialIndeterminate = false,
  ...rest
}: InteractiveCheckboxProps) => {
  const [checked, setChecked] = useState(initialChecked);
  const [indeterminate, setIndeterminate] = useState(initialIndeterminate);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextChecked = event.currentTarget.checked;

    // eslint-disable-next-line no-console
    console.log('Checkbox changed:', {
      checked: nextChecked,
      value: event.target.value || rest.value || 'no value',
      indeterminate: (event.target as HTMLInputElement).indeterminate,
      label: rest.label,
    });

    setChecked(nextChecked);

    if (indeterminate) {
      setIndeterminate(false);
    }
  };

  return (
    <Checkbox
      {...rest}
      checked={checked}
      indeterminate={indeterminate}
      onChange={handleChange}
    />
  );
};

export const WithForm: Story = {
  render: () => {
    const SimpleFormExample = () => {
      const [formData, setFormData] = useState({
        agreeToTerms: false,
        subscribeNewsletter: false,
      });

      const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log('Form submitted:', formData);
        alert(`Form Data: ${JSON.stringify(formData, null, 2)}`);
      };

      return (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            maxWidth: '400px',
          }}
        >
          <Typography>簡單表單範例</Typography>

          <Checkbox
            checked={formData.agreeToTerms}
            id="form-agree-to-terms"
            label="我同意服務條款"
            name="agreeToTerms"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                agreeToTerms: e.target.checked,
              }));
            }}
          />

          <Checkbox
            checked={formData.subscribeNewsletter}
            description="訂閱我們的電子報以獲得最新消息"
            id="form-subscribe-newsletter"
            label="訂閱電子報"
            name="subscribeNewsletter"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                subscribeNewsletter: e.target.checked,
              }));
            }}
          />

          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
            type="submit"
          >
            提交
          </button>
        </form>
      );
    };

    return <SimpleFormExample />;
  },
};

export const WithEditableInputAndForm: Story = {
  render: () => {
    const EditableInputFormExample = () => {
      const [formData, setFormData] = useState({
        options: [] as string[],
        otherOption: '',
      });

      const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line no-console
        console.log('Form submitted:', formData);
        alert(`Form Data: ${JSON.stringify(formData, null, 2)}`);
      };

      const isOtherChecked = formData.options.includes('other');

      return (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            maxWidth: '500px',
          }}
        >
          <Typography>表單整合範例</Typography>
          <Typography color="text-neutral">
            選擇「其他」選項後，需要填寫自訂內容才能提交。
          </Typography>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Checkbox
              checked={formData.options.includes('option1')}
              id="form-option-1"
              label="選項 1"
              name="options"
              value="option1"
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  options: e.target.checked
                    ? [...prev.options, value]
                    : prev.options.filter((v) => v !== value),
                }));
              }}
            />

            <Checkbox
              checked={formData.options.includes('option2')}
              id="form-option-2"
              label="選項 2"
              name="options"
              value="option2"
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  options: e.target.checked
                    ? [...prev.options, value]
                    : prev.options.filter((v) => v !== value),
                }));
              }}
            />

            <Checkbox
              checked={isOtherChecked}
              id="form-other"
              label="其他"
              name="options"
              value="other"
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  options: e.target.checked
                    ? [...prev.options, value]
                    : prev.options.filter((v) => v !== value),
                  otherOption: e.target.checked ? prev.otherOption : '',
                }));
              }}
              withEditInput
              editableInput={{
                value: formData.otherOption,
                onChange: (e) => {
                  setFormData((prev) => ({
                    ...prev,
                    otherOption: e.target.value,
                  }));
                },
              }}
            />
          </div>

          {isOtherChecked && !formData.otherOption && (
            <Typography variant="caption" color="text-error">
              請輸入其他選項的內容
            </Typography>
          )}

          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px',
            }}
            disabled={isOtherChecked && !formData.otherOption}
            type="submit"
          >
            提交
          </button>
        </form>
      );
    };

    return <EditableInputFormExample />;
  },
};
