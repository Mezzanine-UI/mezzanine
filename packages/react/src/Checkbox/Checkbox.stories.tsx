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
