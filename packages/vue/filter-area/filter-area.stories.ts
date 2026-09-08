import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import type {
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';
import MznAutoComplete from '../auto-complete/auto-complete.vue';
import MznCalendarConfigProviderDayjs from '../calendar/calendar-config-provider-dayjs.vue';
import MznFormField from '../form/form-field.vue';
import MznInput from '../input/input.vue';
import MznSelect from '../select/select.vue';
import type { SelectValue } from '../select/select.types';
import MznFilterArea from './filter-area.vue';
import MznFilterLine from './filter-line.vue';
import MznFilter from './filter.vue';
import type { FilterAreaProps } from './filter-area.types';

export default {
  title: 'Data Entry/FilterArea',
  component: MznFilterArea,
} satisfies Meta<typeof MznFilterArea>;

const autoCompleteOptions: SelectValue[] = [
  { id: 'alpha', name: 'alpha' },
  { id: 'bravo', name: 'bravo' },
  { id: 'charlie', name: 'charlie' },
];

type Story = StoryObj<FilterAreaProps>;

const STORY_COMPONENTS = {
  MznAutoComplete,
  MznCalendarConfigProviderDayjs,
  MznFilter,
  MznFilterArea,
  MznFilterLine,
  MznFormField,
  MznInput,
  MznSelect,
};

const horizontal = {
  density: FormFieldDensity.BASE,
  layout: FormFieldLayout.HORIZONTAL,
};

const vertical = {
  density: FormFieldDensity.BASE,
  layout: FormFieldLayout.VERTICAL,
};

export const Playground: Story = {
  argTypes: {
    actionsAlign: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'] satisfies FilterAreaActionsAlign[],
    },
    isDirty: {
      control: { type: 'boolean' },
    },
    resetText: {
      control: { type: 'text' },
    },
    rowAlign: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'] satisfies FilterAreaRowAlign[],
    },
    size: {
      control: { type: 'select' },
      options: ['main', 'sub'] satisfies FilterAreaSize[],
    },
    submitText: {
      control: { type: 'text' },
    },
  },
  args: {
    actionsAlign: 'end',
    isDirty: true,
    resetText: 'Reset',
    rowAlign: 'center',
    size: 'main',
    submitText: 'Search',
  },
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ args, autoCompleteOptions, horizontal }),
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznFilterArea v-bind="args">
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="name"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznSelect
                  fullWidth
                  :options="autoCompleteOptions"
                  placeholder="請選擇"
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="remark"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
          <MznFilterLine>
            <MznFilter :span="3">
              <MznFormField
                label="Label"
                name="advanced1"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznAutoComplete
                  fullWidth
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
        </MznFilterArea>
      </MznCalendarConfigProviderDayjs>
    `,
  }),
};

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
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ args, autoCompleteOptions, horizontal }),
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznFilterArea v-bind="args" actionsAlign="end">
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="name"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznSelect
                  :options="autoCompleteOptions"
                  placeholder="請選擇"
                  fullWidth
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="remark"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
          <MznFilterLine>
            <MznFilter :span="3">
              <MznFormField
                label="Label"
                name="advanced1"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznAutoComplete
                  fullWidth
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="advanced3"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznAutoComplete
                  fullWidth
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
        </MznFilterArea>
      </MznCalendarConfigProviderDayjs>
    `,
  }),
};

export const SubSize: Story = {
  args: {
    ...Basic.args,
    size: 'sub',
  },
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ args, autoCompleteOptions, horizontal }),
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznFilterArea v-bind="args" actionsAlign="end">
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="name"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput name="name" placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="remark"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput name="remark" placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
          <MznFilterLine>
            <MznFilter :span="3">
              <MznFormField
                label="Label"
                name="advanced1"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznAutoComplete
                  fullWidth
                  name="advanced1"
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="3">
              <MznFormField
                label="Label"
                name="advanced3"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznAutoComplete
                  fullWidth
                  name="advanced3"
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
        </MznFilterArea>
      </MznCalendarConfigProviderDayjs>
    `,
  }),
};

export const SingleLine: Story = {
  args: {
    ...Basic.args,
  },
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ args, autoCompleteOptions, horizontal }),
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznFilterArea v-bind="args" actionsAlign="end">
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="name"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznSelect
                  fullWidth
                  :options="autoCompleteOptions"
                  placeholder="請選擇"
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="remark"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="keyword"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznAutoComplete
                  fullWidth
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
        </MznFilterArea>
      </MznCalendarConfigProviderDayjs>
    `,
  }),
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
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ args, horizontal }),
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznFilterArea v-bind="args">
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="name"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="remark"
                :density="horizontal.density"
                :layout="horizontal.layout"
              >
                <MznInput placeholder="Enter remark" />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
        </MznFilterArea>
      </MznCalendarConfigProviderDayjs>
    `,
  }),
};

export const VerticalLabel: Story = {
  args: {
    ...Basic.args,
  },
  render: (args) => ({
    components: STORY_COMPONENTS,
    setup: () => ({ args, autoCompleteOptions, vertical }),
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznFilterArea v-bind="args" rowAlign="end">
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="name"
                :density="vertical.density"
                :layout="vertical.layout"
              >
                <MznSelect
                  fullWidth
                  :options="autoCompleteOptions"
                  placeholder="請選擇"
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="remark"
                :density="vertical.density"
                :layout="vertical.layout"
              >
                <MznInput placeholder="Enter name" />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
          <MznFilterLine>
            <MznFilter :span="2">
              <MznFormField
                label="Label"
                name="advanced1"
                :density="vertical.density"
                :layout="vertical.layout"
              >
                <MznAutoComplete
                  fullWidth
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
            <MznFilter :span="3">
              <MznFormField
                label="Label"
                name="advanced3"
                :density="vertical.density"
                :layout="vertical.layout"
              >
                <MznAutoComplete
                  fullWidth
                  :menuMaxHeight="140"
                  :options="autoCompleteOptions"
                  placeholder="請輸入"
                />
              </MznFormField>
            </MznFilter>
          </MznFilterLine>
        </MznFilterArea>
      </MznCalendarConfigProviderDayjs>
    `,
  }),
};
