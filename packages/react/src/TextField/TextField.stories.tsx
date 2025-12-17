import { StoryObj, Meta } from '@storybook/react';
import { useState } from 'react';
import {
  SearchIcon,
  EyeIcon,
  WarningFilledIcon,
  InfoFilledIcon,
  EyeInvisibleIcon,
  ChevronDownIcon,
} from '@mezzanine-ui/icons';
import TextField, { TextFieldProps, TextFieldSize } from '.';
import Icon from '../Icon';

export default {
  title: 'Data Entry/TextField',
  component: TextField,
} satisfies Meta<typeof TextField>;

type Story = StoryObj<TextFieldProps>;

const sizes: TextFieldSize[] = ['main', 'sub'];

export const Playground: Story = {
  argTypes: {
    size: {
      options: sizes,
      control: {
        type: 'select',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    readonly: {
      control: {
        type: 'boolean',
      },
    },
    error: {
      control: {
        type: 'boolean',
      },
    },
    clearable: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    size: 'main',
    error: false,
    clearable: false,
  },
  render: function PlaygroundStory(args: any) {
    const [value, setValue] = useState('');

    // Build props based on discriminated union rules
    const baseProps = {
      size: args.size as TextFieldSize,
      error: args.error as boolean,
      children: (
        <input
          type="text"
          placeholder="Enter text..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={args.disabled}
          readOnly={args.readonly}
        />
      ),
    };

    // Construct the proper discriminated union type
    let fieldProps: TextFieldProps;

    if (args.clearable) {
      fieldProps = {
        ...baseProps,
        clearable: true,
        onClear: () => setValue(''),
      };
    } else {
      fieldProps = {
        ...baseProps,
      };
    }

    if (args.disabled) {
      fieldProps = {
        ...fieldProps,
        disabled: true,
      } as TextFieldProps;
    } else if (args.readonly) {
      fieldProps = {
        ...fieldProps,
        readonly: true,
      } as TextFieldProps;
    }

    return <TextField {...fieldProps} />;
  },
};

export const Sizes: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
      }}
    >
      <TextField size="main">
        <input type="text" placeholder="Main size" />
      </TextField>

      <TextField size="sub">
        <input type="text" placeholder="Sub size" />
      </TextField>
    </div>
  ),
};

export const States: Story = {
  render: function StatesStory() {
    const [typingValue, setTypingValue] = useState('');

    return (
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
        }}
      >
        <TextField>
          <input
            type="text"
            placeholder="Default state"
            value={typingValue}
            onChange={(e) => setTypingValue(e.target.value)}
          />
        </TextField>
        <TextField readonly>
          <input type="text" value="Readonly state" readOnly />
        </TextField>
        <TextField disabled>
          <input type="text" value="Disabled state" disabled />
        </TextField>
      </div>
    );
  },
};

export const ErrorState: Story = {
  render: function ErrorStateStory() {
    const [email, setEmail] = useState('invalid@');

    return (
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
        }}
      >
        <TextField error>
          <input
            type="email"
            placeholder="Error default"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </TextField>
        <TextField error suffix={<Icon icon={WarningFilledIcon} />}>
          <input type="email" placeholder="Error with icon" />
        </TextField>
      </div>
    );
  },
};

export const WithAffix: Story = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
      }}
    >
      <TextField prefix={<Icon icon={SearchIcon} />}>
        <input type="text" placeholder="Prefix icon" />
      </TextField>

      <TextField suffix={<Icon icon={InfoFilledIcon} />}>
        <input type="text" placeholder="Suffix icon" />
      </TextField>

      <PasswordFieldExample />
    </div>
  ),
};

const PasswordFieldExample = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('secret123');

  return (
    <TextField
      suffix={
        <Icon
          icon={showPassword ? EyeInvisibleIcon : EyeIcon}
          onClick={() => setShowPassword(!showPassword)}
        />
      }
    >
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder="Password with toggle visibility"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </TextField>
  );
};

export const Clearable: Story = {
  render: function ClearableStory() {
    const [value1, setValue1] = useState('Clearable text');
    const [value2, setValue2] = useState('With prefix icon');

    return (
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
        }}
      >
        <TextField clearable onClear={() => setValue1('')}>
          <input
            type="text"
            placeholder="Clearable (hover/focus to see)"
            value={value1}
            onChange={(e) => setValue1(e.target.value)}
          />
        </TextField>

        <TextField
          clearable
          onClear={() => setValue2('')}
          prefix={<Icon icon={SearchIcon} />}
        >
          <input
            type="text"
            placeholder="Clearable with prefix"
            value={value2}
            onChange={(e) => setValue2(e.target.value)}
          />
        </TextField>
      </div>
    );
  },
};

export const ComponentsExample: Story = {
  render: function ComponentsExampleStory() {
    const [textareaValue, setTextareaValue] = useState('');
    const [selectOpen, setSelectOpen] = useState(false);
    const [selectValue, setSelectValue] = useState('');
    const [autocompleteValue, setAutocompleteValue] = useState('');
    const [autocompleteOpen, setAutocompleteOpen] = useState(false);

    const options = ['Option 1', 'Option 2', 'Option 3', 'Very Long Option 4'];
    const filteredOptions = options.filter((opt) =>
      opt.toLowerCase().includes(autocompleteValue.toLowerCase()),
    );

    return (
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: '1fr',
          gap: '32px',
          minWidth: '320px',
        }}
      >
        {/* Textarea Example - 使用 paddingClassName 讓 resize handle 不會內縮 */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
            Textarea (with resize)
          </h3>
          <TextField>
            {({ paddingClassName }) => (
              <textarea
                placeholder="Textarea with text-field padding"
                rows={4}
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                className={paddingClassName}
              />
            )}
          </TextField>
        </div>

        {/* Select-like Example - 展示如何實作類似 Select 的元件 */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
            Select-like Component
          </h3>
          <div style={{ position: 'relative' }}>
            <TextField
              role="combobox"
              aria-expanded={selectOpen}
              aria-haspopup="listbox"
              aria-controls="select-listbox"
              active={selectOpen}
              onClick={() => setSelectOpen(!selectOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectOpen(!selectOpen);
                }
              }}
              suffix={
                <Icon
                  icon={ChevronDownIcon}
                  style={{
                    transform: selectOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              }
            >
              <div
                style={{
                  width: '100%',
                }}
              >
                {selectValue || (
                  <span style={{ color: '#999' }}>Select an option...</span>
                )}
              </div>
            </TextField>
            {selectOpen && (
              <div
                id="select-listbox"
                role="listbox"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {options.map((opt) => (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={selectValue === opt}
                    tabIndex={0}
                    onClick={() => {
                      setSelectValue(opt);
                      setSelectOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectValue(opt);
                        setSelectOpen(false);
                      }
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      background:
                        selectValue === opt ? '#f0f0f0' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        selectValue === opt ? '#f0f0f0' : 'transparent';
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AutoComplete-like Example - 展示如何實作類似 AutoComplete 的元件 */}
        <div>
          <h3 style={{ marginTop: 0, marginBottom: '8px' }}>
            AutoComplete-like Component
          </h3>
          <div style={{ position: 'relative' }}>
            <TextField
              role="combobox"
              aria-expanded={autocompleteOpen && filteredOptions.length > 0}
              aria-haspopup="listbox"
              aria-autocomplete="list"
              aria-controls="autocomplete-listbox"
              clearable={!!autocompleteValue}
              onClear={() => {
                setAutocompleteValue('');
                setAutocompleteOpen(false);
              }}
              prefix={<Icon icon={SearchIcon} />}
            >
              <input
                type="text"
                placeholder="Type to search..."
                value={autocompleteValue}
                onChange={(e) => {
                  setAutocompleteValue(e.target.value);
                  setAutocompleteOpen(e.target.value.length > 0);
                }}
                onFocus={() => {
                  if (autocompleteValue) setAutocompleteOpen(true);
                }}
              />
            </TextField>
            {autocompleteOpen && filteredOptions.length > 0 && (
              <div
                id="autocomplete-listbox"
                role="listbox"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflow: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={autocompleteValue === opt}
                    tabIndex={0}
                    onClick={() => {
                      setAutocompleteValue(opt);
                      setAutocompleteOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setAutocompleteValue(opt);
                        setAutocompleteOpen(false);
                      }
                    }}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f0f0f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};
