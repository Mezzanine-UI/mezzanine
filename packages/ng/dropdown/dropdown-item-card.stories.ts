import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznDropdownItemCard } from './dropdown-item-card.component';
import { CaretRightIcon, FolderIcon } from '@mezzanine-ui/icons';

export default {
  title: 'Internal/Dropdown/DropdownItemCard',
  decorators: [
    moduleMetadata({
      imports: [MznDropdownItemCard, MznTag],
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
      <div
        style="background-color: #d3d3d3; height: 100px; width: 240px; display: flex; align-items: center;"
      >
        <div
          mznDropdownItemCard
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
        ></div>
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
        <div
          style="width: fit-content; min-width: 50%; height: 285px; background-color: #F3F4F6; padding: 40px;"
        >
          <div mznTag label="Default" size="main"></div>
          <div style="display: flex; flex-direction: column; gap: 20px;">
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
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      subTitle="Supporting text"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      subTitle="Supporting text"
                      appendContent="New"
                      checkSite="suffix"
                      [checked]="true"
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; vertical-align: middle;">Matched</td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      subTitle="Supporting text option"
                      followText="opti"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      subTitle="Supporting text option"
                      followText="op"
                      appendContent="New"
                      checkSite="suffix"
                      [checked]="true"
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; vertical-align: middle;">Disable</td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      subTitle="Supporting text"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                      [disabled]="true"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      subTitle="Supporting text"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                      checkSite="suffix"
                      [checked]="true"
                      [disabled]="true"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div
          style="width: fit-content; min-width: 50%; height: 285px; background-color: #F3F4F6; padding: 40px;"
        >
          <div mznTag label="Danger" size="main"></div>
          <div style="display: flex; flex-direction: column; gap: 20px;">
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
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      subTitle="Supporting text"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      subTitle="Supporting text"
                      appendContent="New"
                      checkSite="suffix"
                      [checked]="true"
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; vertical-align: middle;">Matched</td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      subTitle="Supporting text option"
                      followText="opti"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      subTitle="Supporting text option"
                      followText="op"
                      appendContent="New"
                      checkSite="suffix"
                      [checked]="true"
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; vertical-align: middle;">Disable</td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      subTitle="Supporting text"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                      [disabled]="true"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      subTitle="Supporting text"
                      [appendIcon]="folderIcon"
                      appendContent="New"
                      checkSite="suffix"
                      [checked]="true"
                      [disabled]="true"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
        <div
          style="width: fit-content; min-width: 50%; height: 285px; background-color: #F3F4F6; padding: 40px;"
        >
          <div mznTag label="Default" size="main"></div>
          <div style="display: flex; flex-direction: column; gap: 20px;">
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
                    <div
                      mznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      subTitle="Supporting text"
                      checkSite="suffix"
                      appendContent="New"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      subTitle="Supporting text"
                      checkSite="suffix"
                      [prependIcon]="caretRightIcon"
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; vertical-align: middle;">Matched</td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      subTitle="Supporting text option"
                      followText="opti"
                      checkSite="suffix"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      subTitle="Supporting text option"
                      followText="op"
                      checkSite="suffix"
                      [prependIcon]="caretRightIcon"
                      [checked]="true"
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px; vertical-align: middle;">Disable</td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      subTitle="Supporting text"
                      [disabled]="true"
                      checkSite="suffix"
                    ></div>
                  </td>
                  <td></td>
                  <td style="padding: 8px;">
                    <div
                      mznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      subTitle="Supporting text"
                      [disabled]="true"
                      [checked]="true"
                      checkSite="suffix"
                      [prependIcon]="caretRightIcon"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `,
  }),
};
