import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChangeEvent, useState } from 'react';
import Checkbox from './Checkbox';
import CheckboxGroup, {
  CheckboxGroupChangeEvent,
  CheckboxGroupProps,
} from './CheckboxGroup';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Checkbox/Group',
  component: CheckboxGroup,
} satisfies Meta<typeof CheckboxGroup>;

type Story = StoryObj<CheckboxGroupProps>;

const defaultOptions = [
  { label: 'Checkbox Label', value: '1' },
  { label: 'Checkbox Label', value: '2' },
  { label: 'Checkbox Label', value: '3', disabled: true },
  { label: 'Checkbox Label', value: '4' },
  { label: 'Checkbox Label', value: '5' },
  { label: 'Checkbox Label', value: '6' },
  { label: 'Checkbox Label', value: '7' },
  { label: 'Checkbox Label', value: '8' },
  { label: 'Checkbox Label', value: '9' },
  { label: 'Checkbox Label', value: '10' },
  { label: 'Checkbox Label', value: '11' },
  { label: 'Checkbox Label', value: '12' },
  { label: 'Checkbox Label', value: '13' },
  { label: 'Checkbox Label', value: '14' },
  { label: 'Checkbox Label', value: '15' },
  { label: 'Checkbox Label', value: '16' },
  { label: 'Checkbox Label', value: '17' },
  { label: 'Checkbox Label', value: '18' },
  { label: 'Checkbox Label', value: '19' },
  { label: 'Checkbox Label', value: '20' },
];

type CheckboxGroupStoryContentProps = {
  layout?: CheckboxGroupProps['layout'];
  level?: CheckboxGroupProps['level'];
  mode?: CheckboxGroupProps['mode'];
  initialValue?: string[];
  useChildren?: boolean;
};

const CheckboxGroupStoryContent = ({
  layout,
  level,
  mode,
  initialValue = [],
  useChildren = false,
}: CheckboxGroupStoryContentProps) => {
  const [value, setValue] = useState<string[]>(initialValue);

  const handleChange = (event: CheckboxGroupChangeEvent) => {
    setValue(event.target.values || []);
  };

  if (useChildren) {
    return (
      <CheckboxGroup
        layout={layout}
        level={level}
        mode={mode}
        value={value}
        onChange={handleChange}
      >
        <Checkbox label="Checkbox Label" value="1" />
        <Checkbox label="Checkbox Label" value="2" />
        <Checkbox label="Checkbox Label" value="3" disabled />
        <Checkbox label="Checkbox Label" value="4" />
        <Checkbox label="Checkbox Label" value="5" />
        <Checkbox label="Checkbox Label" value="6" />
        <Checkbox label="Checkbox Label" value="7" />
        <Checkbox label="Checkbox Label" value="8" />
        <Checkbox label="Checkbox Label" value="9" />
        <Checkbox label="Checkbox Label" value="10" />
        <Checkbox label="Checkbox Label" value="11" />
        <Checkbox label="Checkbox Label" value="12" />
        <Checkbox label="Checkbox Label" value="13" />
        <Checkbox label="Checkbox Label" value="14" />
        <Checkbox label="Checkbox Label" value="15" />
        <Checkbox label="Checkbox Label" value="16" />
        <Checkbox label="Checkbox Label" value="17" />
        <Checkbox label="Checkbox Label" value="18" />
        <Checkbox label="Checkbox Label" value="19" />
        <Checkbox label="Checkbox Label" value="20" />
      </CheckboxGroup>
    );
  }

  return (
    <CheckboxGroup
      layout={layout}
      level={level}
      mode={mode}
      options={defaultOptions}
      value={value}
      onChange={handleChange}
    />
  );
};

export const Playground: Story = {
  args: {
    options: defaultOptions,
    layout: 'horizontal',
    disabled: false,
    value: ['2'],
    level: {
      active: false,
      label: 'Select All',
      disabled: false,
    },
  },
  argTypes: {
    options: {
      control: {
        type: 'object',
      },
      description: 'The options array for checkbox group',
      table: {
        type: { summary: 'CheckboxGroupOptionInput[]' },
      },
    },
    layout: {
      control: {
        type: 'select',
      },
      options: ['horizontal', 'vertical'],
      description: 'The layout of checkbox group',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" },
      },
    },
    level: {
      control: {
        type: 'object',
      },
      description: 'The level control configuration',
      table: {
        type: { summary: 'CheckboxGroupLevelConfig' },
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
      description: 'Whether the checkbox group is disabled',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    value: {
      control: {
        type: 'object',
      },
      description: 'The value of checkbox group (controlled)',
      table: {
        type: { summary: 'string[]' },
      },
    },
    defaultValue: {
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
    onChange: {
      control: false,
      table: {
        disable: true,
      },
    },
    children: {
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
  render: (props: CheckboxGroupProps) => {
    const PlaygroundContent = () => {
      const [value, setValue] = useState<string[]>(props.value || []);

      const handleChange = (event: CheckboxGroupChangeEvent) => {
        const newValue = event.target.values || [];
        setValue(newValue);
        // eslint-disable-next-line no-console
        console.log('CheckboxGroup changed:', newValue);
      };

      const levelWithOnChange = props.level
        ? {
          ...props.level,
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            // eslint-disable-next-line no-console
            console.log('Level control changed:', {
              checked: event.target.checked,
              value: event.target.value,
            });
            if (props.level?.onChange) {
              props.level.onChange(event);
            }
          },
        }
        : undefined;

      return (
        <CheckboxGroup
          {...props}
          level={levelWithOnChange}
          value={value}
          onChange={handleChange}
        />
      );
    };

    return <PlaygroundContent key={props.layout} />;
  },
};

export const Horizontal: Story = {
  render: () => {
    return <CheckboxGroupStoryContent layout="horizontal" />;
  },
};

export const Vertical: Story = {
  render: () => {
    return <CheckboxGroupStoryContent layout="vertical" />;
  },
};

export const HorizontalChips: Story = {
  render: () => {
    return <CheckboxGroupStoryContent layout="horizontal" mode="chip" />;
  },
};

export const VerticalChips: Story = {
  render: () => {
    return <CheckboxGroupStoryContent layout="vertical" mode="chip" />;
  },
};

export const WithLevelControlCustomization: Story = {
  render: () => {
    const CustomLevelControlExample = () => {
      const [value, setValue] = useState<string[]>(['2', '4']);

      const handleChange = (event: CheckboxGroupChangeEvent) => {
        const newValue = event.target.values || [];
        setValue(newValue);
      };

      return (
        <CheckboxGroup
          level={{
            active: true,
            label: '全選',
            disabled: false,
          }}
          options={defaultOptions}
          value={value}
          onChange={handleChange}
        />
      );
    };

    return <CustomLevelControlExample />;
  },
};

export const WithChildren: Story = {
  render: () => {
    return <CheckboxGroupStoryContent useChildren />;
  },
};

export const SimpleExample: Story = {
  render: () => {
    const SimpleCheckboxGroupExample = () => {
      const [selectedValues, setSelectedValues] = useState<string[]>([]);

      const options = [
        { label: '選項 1', value: 'option1' },
        { label: '選項 2', value: 'option2' },
        { label: '選項 3', value: 'option3' },
      ];

      const handleChange = (event: CheckboxGroupChangeEvent) => {
        setSelectedValues(event.target.values || []);
        // eslint-disable-next-line no-console
        console.log('選中的值:', event.target.values);
      };

      return (
        <div style={{ padding: '24px' }}>
          <Typography variant="heading-6" style={{ marginBottom: '16px' }}>
            簡單的 CheckboxGroup 範例
          </Typography>
          <CheckboxGroup
            name="simple-group"
            options={options}
            value={selectedValues}
            onChange={handleChange}
          />
          {selectedValues.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
              <Typography variant="body">已選中: {selectedValues.join(', ')}</Typography>
            </div>
          )}
        </div>
      );
    };

    return <SimpleCheckboxGroupExample />;
  },
};

export const SimpleLevelControl: Story = {
  render: () => {
    const SimpleLevelControlExample = () => {
      const [selectedValues, setSelectedValues] = useState<string[]>([]);

      const options = [
        { label: '閱讀', value: 'reading' },
        { label: '程式設計', value: 'coding' },
        { label: '運動', value: 'sports' },
        { label: '音樂', value: 'music' },
        { label: '旅行', value: 'travel' },
      ];

      const handleChange = (event: CheckboxGroupChangeEvent) => {
        setSelectedValues(event.target.values || []);
        // eslint-disable-next-line no-console
        console.log('選中的興趣:', event.target.values);
      };

      return (
        <div style={{ padding: '24px' }}>
          <Typography variant="heading-6" style={{ marginBottom: '16px' }}>
            使用 Level Control 的範例
          </Typography>
          <Typography variant="caption" style={{ marginBottom: '16px', color: '#6b7280' }}>
            點擊「全選」可以一次選擇或取消所有選項
          </Typography>
          <CheckboxGroup
            level={{
              active: true,
              label: '全選',
            }}
            name="interests"
            options={options}
            value={selectedValues}
            onChange={handleChange}
          />
          {selectedValues.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
              <Typography variant="body">
                已選擇 {selectedValues.length} 個興趣: {selectedValues.join(', ')}
              </Typography>
            </div>
          )}
        </div>
      );
    };

    return <SimpleLevelControlExample />;
  },
};
