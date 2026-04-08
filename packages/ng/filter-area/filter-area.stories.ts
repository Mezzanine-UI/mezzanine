import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import {
  FilterAreaActionsAlign,
  FilterAreaRowAlign,
  FilterAreaSize,
} from '@mezzanine-ui/core/filter-area';
import { MznFilterArea } from './filter-area.component';
import { MznFilterLine } from './filter-line.component';
import { MznFilter } from './filter.component';

const sizes: FilterAreaSize[] = ['main', 'sub'];
const actionsAligns: FilterAreaActionsAlign[] = ['start', 'center', 'end'];
const rowAligns: FilterAreaRowAlign[] = ['start', 'center', 'end'];

export default {
  title: 'Data Entry/FilterArea',
  decorators: [
    moduleMetadata({
      imports: [MznFilterArea, MznFilterLine, MznFilter],
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
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <mzn-filter-area
        [actionsAlign]="actionsAlign"
        [isDirty]="isDirty"
        [resetText]="resetText"
        [rowAlign]="rowAlign"
        [size]="size"
        [submitText]="submitText"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Name
              <input placeholder="Enter name" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Category
              <input placeholder="Select category" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Status
              <input placeholder="Select status" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
        <mzn-filter-line>
          <mzn-filter [span]="3">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Start Date
              <input type="date" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="3">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              End Date
              <input type="date" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
      </mzn-filter-area>
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: {
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <mzn-filter-area
        actionsAlign="end"
        submitText="Search"
        resetText="Reset"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="請選擇" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="Enter name" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
        <mzn-filter-line>
          <mzn-filter [span]="3">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="請輸入" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="請輸入" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
      </mzn-filter-area>
    `,
  }),
};

export const SubSize: Story = {
  render: () => ({
    props: {
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <mzn-filter-area
        size="sub"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Name
              <input placeholder="Enter name" style="padding: 4px 6px; font-size: 13px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Status
              <input placeholder="Select status" style="padding: 4px 6px; font-size: 13px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
        <mzn-filter-line>
          <mzn-filter [span]="3" [grow]="true">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Description
              <input placeholder="Enter description" style="padding: 4px 6px; font-size: 13px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
      </mzn-filter-area>
    `,
  }),
};

export const SingleLine: Story = {
  render: () => ({
    props: {
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <mzn-filter-area
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Keyword
              <input placeholder="Search..." style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Type
              <input placeholder="Select type" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
      </mzn-filter-area>
    `,
  }),
};

export const IsDirty: Story = {
  render: () => ({
    props: {
      isDirty: false,
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <mzn-filter-area
        submitText="Search"
        resetText="Reset"
        [isDirty]="isDirty"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="Enter name" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="Enter remark" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
      </mzn-filter-area>
    `,
  }),
};

export const VerticalLabel: Story = {
  render: () => ({
    props: {
      onSubmit: (): void => console.log('submit'),
      onReset: (): void => console.log('reset'),
    },
    template: `
      <mzn-filter-area
        actionsAlign="end"
        rowAlign="end"
        submitText="Search"
        resetText="Reset"
        (filterSubmit)="onSubmit()"
        (filterReset)="onReset()"
      >
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="請選擇" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="Enter name" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
        <mzn-filter-line>
          <mzn-filter [span]="2">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="請輸入" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
          <mzn-filter [span]="3">
            <label style="display: flex; flex-direction: column; gap: 4px;">
              Label
              <input placeholder="請輸入" style="padding: 6px 8px;" />
            </label>
          </mzn-filter>
        </mzn-filter-line>
      </mzn-filter-area>
    `,
  }),
};
