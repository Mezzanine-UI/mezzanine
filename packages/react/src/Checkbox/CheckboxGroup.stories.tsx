import { Meta, StoryObj } from '@storybook/react-webpack5';
import { ChangeEvent, useState } from 'react';
import Checkbox from './Checkbox';
import CheckboxGroup, {
  CheckboxGroupChangeEvent,
  CheckboxGroupProps,
} from './CheckboxGroup';

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
        name="checkbox-group-children"
        value={value}
        onChange={handleChange}
      >
        <Checkbox id="group-child-1" label="Checkbox Label" value="1" />
        <Checkbox id="group-child-2" label="Checkbox Label" value="2" />
        <Checkbox id="group-child-3" label="Checkbox Label" value="3" disabled />
        <Checkbox id="group-child-4" label="Checkbox Label" value="4" />
        <Checkbox id="group-child-5" label="Checkbox Label" value="5" />
        <Checkbox id="group-child-6" label="Checkbox Label" value="6" />
        <Checkbox id="group-child-7" label="Checkbox Label" value="7" />
        <Checkbox id="group-child-8" label="Checkbox Label" value="8" />
        <Checkbox id="group-child-9" label="Checkbox Label" value="9" />
        <Checkbox id="group-child-10" label="Checkbox Label" value="10" />
        <Checkbox id="group-child-11" label="Checkbox Label" value="11" />
        <Checkbox id="group-child-12" label="Checkbox Label" value="12" />
        <Checkbox id="group-child-13" label="Checkbox Label" value="13" />
        <Checkbox id="group-child-14" label="Checkbox Label" value="14" />
        <Checkbox id="group-child-15" label="Checkbox Label" value="15" />
        <Checkbox id="group-child-16" label="Checkbox Label" value="16" />
        <Checkbox id="group-child-17" label="Checkbox Label" value="17" />
        <Checkbox id="group-child-18" label="Checkbox Label" value="18" />
        <Checkbox id="group-child-19" label="Checkbox Label" value="19" />
        <Checkbox id="group-child-20" label="Checkbox Label" value="20" />
      </CheckboxGroup>
    );
  }

  return (
    <CheckboxGroup
      layout={layout}
      level={level}
      mode={mode}
      name="checkbox-group-options"
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
          name={props.name || 'playground-checkbox-group'}
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
          name="level-control-group"
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
