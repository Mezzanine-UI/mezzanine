import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import { Meta, StoryObj } from '@storybook/react-webpack5';

import { Filter, FilterArea, FilterAreaProps, FilterLine } from '.';
import { AutoComplete } from '../AutoComplete';
import { CalendarConfigProviderDayjs } from '../Calendar';
import { FormField } from '../Form';
import Input from '../Input';
import Select from '../Select';
import { SelectValue } from '../Select/typings';

export default {
  title: 'Data Entry/FilterArea',
  component: FilterArea,
} as Meta;

const autoCompleteOptions: SelectValue[] = [
  { id: 'alpha', name: 'alpha' },
  { id: 'bravo', name: 'bravo' },
  { id: 'charlie', name: 'charlie' },
];

type Story = StoryObj<FilterAreaProps>;

export const Basic: Story = {
  argTypes: {
    actionsAlign: {
      control: {
        type: 'select',
      },
      options: ['start', 'center', 'end'],
    },
    submitText: {
      control: {
        type: 'text',
      },
    },
    resetText: {
      control: {
        type: 'text',
      },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['main', 'sub'],
    },
  },
  args: {
    actionsAlign: 'start',
    submitText: 'Search',
    resetText: 'Reset',
    size: 'main',
  },
  render: function BasicStory(args) {
    const horizontal = {
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
    };

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args} actionsAlign="end">
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Select
                  options={autoCompleteOptions}
                  placeholder="請選擇"
                  fullWidth
                />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Input placeholder="Enter name" />
              </FormField>
            </Filter>
          </FilterLine>
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="進階搜尋 1"
                name="advanced1"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <AutoComplete
                  fullWidth
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                />
              </FormField>
            </Filter>
            <Filter span={6}>
              <FormField
                label="進階搜尋 3"
                name="advanced3"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <AutoComplete
                  fullWidth
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>
      </CalendarConfigProviderDayjs>
    );
  },
};

export const SubSize: Story = {
  args: {
    ...Basic.args,
    size: 'sub',
  },
  render: function SubSizeStory(args) {
    const horizontal = {
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
    };

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args} actionsAlign="end">
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Input name="name" size="sub" placeholder="Enter name" />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Input name="remark" size="sub" placeholder="Enter name" />
              </FormField>
            </Filter>
          </FilterLine>
          <FilterLine>
            <Filter span={6}>
              <FormField
                label="進階搜尋 1"
                name="advanced1"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <AutoComplete
                  fullWidth
                  name="advanced1"
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                  size="sub"
                />
              </FormField>
            </Filter>
            <Filter span={6}>
              <FormField
                label="進階搜尋 3"
                name="advanced3"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <AutoComplete
                  fullWidth
                  name="advanced3"
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                  size="sub"
                />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>
      </CalendarConfigProviderDayjs>
    );
  },
};

export const SingleLine: Story = {
  args: {
    ...Basic.args,
  },
  render: function SingleLineStory(args) {
    const horizontal = {
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
    };

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args} actionsAlign="end">
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Select
                  fullWidth
                  options={autoCompleteOptions}
                  placeholder="請選擇"
                />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Input placeholder="Enter name" />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="keyword"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <AutoComplete
                  fullWidth
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>
      </CalendarConfigProviderDayjs>
    );
  },
};

export const IsDirty: Story = {
  args: {
    ...Basic.args,
    isDirty: false,
  },
  argTypes: {
    isDirty: {
      control: {
        type: 'boolean',
      },
    },
  },
  render: function IsDirtyStory(args) {
    const horizontal = {
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
    };

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args}>
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Input placeholder="Enter name" />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                density={horizontal.density}
                layout={horizontal.layout}
              >
                <Input placeholder="Enter remark" />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>
      </CalendarConfigProviderDayjs>
    );
  },
};

export const VerticalLabel: Story = {
  args: {
    ...Basic.args,
  },
  render: function VerticalLabelStory(args) {
    const vertical = {
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.VERTICAL,
    };

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args}>
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                density={vertical.density}
                layout={vertical.layout}
              >
                <Select
                  fullWidth
                  options={autoCompleteOptions}
                  placeholder="請選擇"
                />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                density={vertical.density}
                layout={vertical.layout}
              >
                <Input placeholder="Enter name" />
              </FormField>
            </Filter>
          </FilterLine>
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="進階搜尋 1"
                name="advanced1"
                density={vertical.density}
                layout={vertical.layout}
              >
                <AutoComplete
                  fullWidth
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                />
              </FormField>
            </Filter>
            <Filter span={6}>
              <FormField
                label="進階搜尋 3"
                name="advanced3"
                density={vertical.density}
                layout={vertical.layout}
              >
                <AutoComplete
                  fullWidth
                  menuMaxHeight={140}
                  options={autoCompleteOptions}
                  placeholder="請輸入"
                />
              </FormField>
            </Filter>
          </FilterLine>
        </FilterArea>
      </CalendarConfigProviderDayjs>
    );
  },
};
