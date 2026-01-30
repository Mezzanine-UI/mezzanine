
import { FormFieldSize } from '@mezzanine-ui/core/form';
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
    const horizontal = FormFieldSize.HORIZONTAL_BASE;

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args} actionsAlign="end">
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                size={horizontal}
              >
                <Select options={autoCompleteOptions} placeholder="請選擇" fullWidth />

              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                size={horizontal}
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
                size={horizontal}
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
                size={horizontal}
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
    const horizontal = FormFieldSize.HORIZONTAL_BASE;

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <FilterArea {...args} actionsAlign="end">
          <FilterLine>
            <Filter span={2}>
              <FormField
                label="Label"
                name="name"
                size={horizontal}
              >
                <Input name="name" size="sub" placeholder="Enter name" />
              </FormField>
            </Filter>
            <Filter span={2}>
              <FormField
                label="Label"
                name="remark"
                size={horizontal}
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
                size={horizontal}
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
                size={horizontal}
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
