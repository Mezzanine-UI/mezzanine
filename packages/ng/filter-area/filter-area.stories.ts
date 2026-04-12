import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';
import { FormFieldDensity, FormFieldLayout } from '@mezzanine-ui/core/form';
import { MznAutocomplete } from '@mezzanine-ui/ng/autocomplete';
import { MznFormField } from '@mezzanine-ui/ng/form';
import { MznInput } from '@mezzanine-ui/ng/input';
import { MznSelect } from '@mezzanine-ui/ng/select';
import { MznFilterArea } from './filter-area.component';
import { MznFilterLine } from './filter-line.component';
import { MznFilter } from './filter.component';

const sizes: FilterAreaSize[] = ['main', 'sub'];
const actionsAligns: FilterAreaActionsAlign[] = ['start', 'center', 'end'];
const rowAligns: FilterAreaRowAlign[] = ['start', 'center', 'end'];

const autoCompleteOptions = [
  { id: 'alpha', name: 'alpha' },
  { id: 'bravo', name: 'bravo' },
  { id: 'charlie', name: 'charlie' },
];

export default {
  title: 'Data Entry/FilterArea',
  decorators: [
    moduleMetadata({
      imports: [
        MznAutocomplete,
        MznFilterArea,
        MznFilterLine,
        MznFilter,
        MznFormField,
        MznInput,
        MznSelect,
      ],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    actionsAlign: {
      options: actionsAligns,
      control: { type: 'select' },
    },
    isDirty: {
      control: { type: 'boolean' },
    },
    resetText: {
      control: { type: 'text' },
    },
    rowAlign: {
      options: rowAligns,
      control: { type: 'select' },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
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
    props: {
      ...args,
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
      autoCompleteOptions,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <div mznFilterArea
        [actionsAlign]="actionsAlign"
        [isDirty]="isDirty"
        [resetText]="resetText"
        [rowAlign]="rowAlign"
        [size]="size"
        [submitText]="submitText"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="name" [density]="density" [layout]="layout">
              <div mznSelect [fullWidth]="true" [options]="autoCompleteOptions" placeholder="請選擇"></div>
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="remark" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
        </div>
        <div mznFilterLine>
          <div mznFilter [span]="3">
            <div mznFormField label="Label" name="advanced1" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const Basic: Story = {
  argTypes: {
    actionsAlign: {
      options: actionsAligns,
      control: { type: 'select' },
    },
    submitText: {
      control: { type: 'text' },
    },
    resetText: {
      control: { type: 'text' },
    },
    size: {
      options: sizes,
      control: { type: 'select' },
    },
  },
  args: {
    actionsAlign: 'start',
    submitText: 'Search',
    resetText: 'Reset',
    size: 'main',
  },
  render: (args) => ({
    props: {
      ...args,
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
      autoCompleteOptions,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <div mznFilterArea
        actionsAlign="end"
        [submitText]="submitText"
        [resetText]="resetText"
        [size]="size"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="name" [density]="density" [layout]="layout">
              <div mznSelect [fullWidth]="true" [options]="autoCompleteOptions" placeholder="請選擇"></div>
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="remark" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
        </div>
        <div mznFilterLine>
          <div mznFilter [span]="3">
            <div mznFormField label="Label" name="advanced1" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="advanced3" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const SubSize: Story = {
  args: {
    ...Basic.args,
    size: 'sub',
  },
  render: (args) => ({
    props: {
      ...args,
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
      autoCompleteOptions,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <div mznFilterArea
        actionsAlign="end"
        [size]="size"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="name" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="remark" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
        </div>
        <div mznFilterLine>
          <div mznFilter [span]="3">
            <div mznFormField label="Label" name="advanced1" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
          <div mznFilter [span]="3">
            <div mznFormField label="Label" name="advanced3" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const SingleLine: Story = {
  args: {
    ...Basic.args,
  },
  render: (args) => ({
    props: {
      ...args,
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
      autoCompleteOptions,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <div mznFilterArea
        actionsAlign="end"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="name" [density]="density" [layout]="layout">
              <div mznSelect [fullWidth]="true" [options]="autoCompleteOptions" placeholder="請選擇"></div>
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="remark" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="keyword" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
        </div>
      </div>
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
      control: { type: 'boolean' },
    },
  },
  render: (args) => ({
    props: {
      ...args,
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.HORIZONTAL,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <div mznFilterArea
        [isDirty]="isDirty"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="name" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="remark" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter remark" />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};

export const VerticalLabel: Story = {
  args: {
    ...Basic.args,
  },
  render: (args) => ({
    props: {
      ...args,
      density: FormFieldDensity.BASE,
      layout: FormFieldLayout.VERTICAL,
      autoCompleteOptions,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <div mznFilterArea
        actionsAlign="end"
        rowAlign="end"
        submitText="Search"
        resetText="Reset"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="name" [density]="density" [layout]="layout">
              <div mznSelect [fullWidth]="true" [options]="autoCompleteOptions" placeholder="請選擇"></div>
            </div>
          </div>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="remark" [density]="density" [layout]="layout">
              <input mznInput placeholder="Enter name" />
            </div>
          </div>
        </div>
        <div mznFilterLine>
          <div mznFilter [span]="2">
            <div mznFormField label="Label" name="advanced1" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
          <div mznFilter [span]="3">
            <div mznFormField label="Label" name="advanced3" [density]="density" [layout]="layout">
              <div mznAutocomplete [fullWidth]="true" [menuMaxHeight]="140" [options]="autoCompleteOptions" placeholder="請輸入"></div>
            </div>
          </div>
        </div>
      </div>
    `,
  }),
};
