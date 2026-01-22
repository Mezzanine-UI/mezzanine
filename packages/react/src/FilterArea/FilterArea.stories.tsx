import { useState } from 'react';

import { FormFieldSize } from '@mezzanine-ui/core/form';
import { Meta, StoryObj } from '@storybook/react-webpack5';

import { Filter, FilterArea, FilterAreaProps, FilterLine } from '.';
import { AutoComplete } from '../AutoComplete';
import Button from '../Button';
import { CalendarConfigProviderDayjs } from '../Calendar';
import Drawer from '../Drawer';
import { FormField } from '../Form';
import Input from '../Input';
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
    isPanel: {
      control: {
        type: 'boolean',
      },
    },
  },
  args: {
    actionsAlign: 'start',
    submitText: 'Search',
    resetText: 'Reset',
    size: 'main',
    isPanel: false,
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
                <Input placeholder="Enter name" />
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
            <Filter span={6}>
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

export const WithPanel: Story = {
  args: {
    ...Basic.args,
    isPanel: true,
  },
  render: function WithPanelStory() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [autoComplete, setAutoComplete] = useState<SelectValue | null>(null);

    const initialValues = {
      name: '',
      autoComplete: null as SelectValue | null,
    };

    const isDirty = name !== initialValues.name || autoComplete !== initialValues.autoComplete;

    const onSubmit = (values: Record<string, any>) => {
      // eslint-disable-next-line no-console
      console.log('Form submitted:', values);
      setOpen(false);
    };

    const onReset = () => {
      setName(initialValues.name);
      setAutoComplete(initialValues.autoComplete);
    };

    const handleClear = () => {
      onReset();
    };

    const handleSubmit = () => {
      onSubmit({
        name,
        autoComplete,
      });
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>
          Click
        </Button>
        <Drawer
          bottomGhostActionText="清除全部條件"
          bottomOnGhostActionClick={handleClear}
          bottomOnPrimaryActionClick={handleSubmit}
          bottomOnSecondaryActionClick={() => setOpen(false)}
          bottomPrimaryActionText="套用條件"
          bottomSecondaryActionText="取消"
          headerTitle="進階篩選"
          isBottomDisplay
          isHeaderDisplay
          onClose={() => setOpen(false)}
          open={open}
        >
          <FilterArea
            isDirty={isDirty}
            isPanel={true}
            onReset={onReset}
            onSubmit={handleSubmit}
            size="main"
          >
            <FilterLine>
              <Filter>
                <FormField
                  label="名稱"
                  name="name"
                  size={FormFieldSize.VERTICAL}
                >
                  <Input
                    placeholder="請輸入名稱"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormField>
              </Filter>
            </FilterLine>
            <FilterLine>
              <Filter>
                <FormField
                  label="選項"
                  name="autoComplete"
                  size={FormFieldSize.VERTICAL}
                >
                  <AutoComplete
                    fullWidth
                    menuMaxHeight={140}
                    options={autoCompleteOptions}
                    placeholder="請選擇"
                    value={autoComplete}
                    onChange={setAutoComplete}
                  />
                </FormField>
              </Filter>
            </FilterLine>
          </FilterArea>
        </Drawer>
      </>
    );
  },
};
