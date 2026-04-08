import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznDropdownItemCard } from './dropdown-item-card.component';
import { CaretRightIcon, FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Internal/Dropdown/DropdownItemCard',
  decorators: [
    moduleMetadata({
      imports: [MznDropdownItemCard],
    }),
  ],
} satisfies Meta;

type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    mode: {
      options: ['single', 'multiple'],
      control: { type: 'select' },
      description: 'The selection mode.',
      table: {
        type: { summary: "'single' | 'multiple'" },
        defaultValue: { summary: "'single'" },
      },
    },
    level: {
      options: [0, 1, 2],
      control: { type: 'select' },
      description: 'The nesting level.',
      table: {
        type: { summary: '0 | 1 | 2' },
        defaultValue: { summary: '0' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the item is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the item is selected.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    checkSite: {
      options: ['prefix', 'suffix', 'none'],
      control: { type: 'radio' },
      description: 'Position of the check icon.',
      table: {
        type: { summary: "'prefix' | 'suffix' | 'none'" },
        defaultValue: { summary: "'suffix'" },
      },
    },
    validate: {
      options: ['default', 'danger'],
      control: { type: 'select' },
      description: 'Validation style.',
      table: {
        type: { summary: "'default' | 'danger'" },
        defaultValue: { summary: "'default'" },
      },
    },
  },
  args: {
    mode: 'single',
    level: 0,
    label: 'Option',
    subTitle: 'Supporting text',
    disabled: false,
    checked: false,
    checkSite: 'none',
    validate: 'default',
  },
  render: (args) => ({
    props: {
      ...args,
      appendIcon: FolderIcon,
      onClicked(): void {
        console.log('clicked');
      },
    },
    template: `
      <div style="background-color: #d3d3d3; height: 100px; width: 240px; display: flex; align-items: center;">
        <mzn-dropdown-item-card
          [mode]="mode"
          [level]="level"
          [label]="label"
          [subTitle]="subTitle"
          [disabled]="disabled"
          [checked]="checked"
          [checkSite]="checkSite"
          [validate]="validate"
          [appendIcon]="appendIcon"
          (clicked)="onClicked()"
        />
      </div>
    `,
  }),
};

export const Single: Story = {
  render: () => ({
    props: {
      folderIcon: FolderIcon,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="width: fit-content; min-width: 50%; background-color: #F3F4F6; padding: 40px;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">Default</div>
          <table style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; text-align: center; width: 120px;"></th>
                <th style="padding: 8px; text-align: center;">Icon Default</th>
                <th style="padding: 8px; text-align: center;"></th>
                <th style="padding: 8px; text-align: center;">Icon Selected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Enabled / Hover</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" subTitle="Supporting text" [appendIcon]="folderIcon" appendContent="New" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" subTitle="Supporting text" appendContent="New" checkSite="suffix" [checked]="true" />
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Matched</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" subTitle="Supporting text option" [appendIcon]="folderIcon" appendContent="New" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" subTitle="Supporting text option" appendContent="New" checkSite="suffix" [checked]="true" />
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Disable</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" subTitle="Supporting text" [appendIcon]="folderIcon" appendContent="New" [disabled]="true" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" subTitle="Supporting text" [appendIcon]="folderIcon" appendContent="New" checkSite="suffix" [checked]="true" [disabled]="true" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="width: fit-content; min-width: 50%; background-color: #F3F4F6; padding: 40px;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">Danger</div>
          <table style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; text-align: center; width: 120px;"></th>
                <th style="padding: 8px; text-align: center;">Icon Default</th>
                <th style="padding: 8px; text-align: center;"></th>
                <th style="padding: 8px; text-align: center;">Icon Selected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Enabled / Hover</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" validate="danger" subTitle="Supporting text" [appendIcon]="folderIcon" appendContent="New" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" validate="danger" subTitle="Supporting text" appendContent="New" checkSite="suffix" [checked]="true" />
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Matched</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" validate="danger" subTitle="Supporting text option" [appendIcon]="folderIcon" appendContent="New" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" validate="danger" subTitle="Supporting text option" appendContent="New" checkSite="suffix" [checked]="true" />
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Disable</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" validate="danger" subTitle="Supporting text" [appendIcon]="folderIcon" appendContent="New" [disabled]="true" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="single" label="Option" validate="danger" subTitle="Supporting text" [appendIcon]="folderIcon" appendContent="New" checkSite="suffix" [checked]="true" [disabled]="true" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  }),
};

export const Multiple: Story = {
  render: () => ({
    props: {
      caretRightIcon: CaretRightIcon,
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="width: fit-content; min-width: 50%; background-color: #F3F4F6; padding: 40px;">
          <div style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">Default</div>
          <table style="border-collapse: collapse; width: 100%;">
            <thead>
              <tr>
                <th style="padding: 8px; text-align: center; width: 120px;"></th>
                <th style="padding: 8px; text-align: center;">Basic</th>
                <th style="padding: 8px; text-align: center;"></th>
                <th style="padding: 8px; text-align: center;">Expandable</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Enabled / Hover</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="multiple" label="Option" subTitle="Supporting text" checkSite="suffix" appendContent="New" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="multiple" label="Option" subTitle="Supporting text" checkSite="suffix" [prependIcon]="caretRightIcon" />
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Matched</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="multiple" label="Option" subTitle="Supporting text option" checkSite="suffix" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="multiple" label="Option" subTitle="Supporting text option" checkSite="suffix" [prependIcon]="caretRightIcon" [checked]="true" />
                </td>
              </tr>
              <tr>
                <td style="padding: 8px; vertical-align: middle;">Disable</td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="multiple" label="Option" subTitle="Supporting text" [disabled]="true" checkSite="suffix" />
                </td>
                <td></td>
                <td style="padding: 8px;">
                  <mzn-dropdown-item-card mode="multiple" label="Option" subTitle="Supporting text" [disabled]="true" [checked]="true" checkSite="suffix" [prependIcon]="caretRightIcon" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  }),
};
