import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { CaretRightIcon, FolderIcon } from '@mezzanine-ui/icons';
import MznTag from '../tag/tag.vue';
import MznDropdownItemCard from './dropdown-item-card.vue';

export default {
  component: MznDropdownItemCard,
  title: 'Internal/Dropdown/DropdownItemCard',
} as Meta;

type Story = StoryObj<typeof MznDropdownItemCard>;

export const Playground: Story = {
  argTypes: {
    checkSite: {
      control: 'radio',
      options: ['prepend', 'append', 'none'],
    },
    checked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    level: {
      control: 'select',
      options: [0, 1, 2],
    },
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    validate: {
      control: 'select',
      options: ['default', 'danger'],
    },
  },
  args: {
    appendIcon: FolderIcon,
    checkSite: 'none',
    checked: false,
    disabled: false,
    label: 'Option',
    level: 0,
    mode: 'single',
    subTitle: 'Supporting text',
  },
  render: (args) => ({
    components: { MznDropdownItemCard },
    setup: () => ({ args }),
    template: `
      <div
        style="background-color: #d3d3d3; height: 100px; width: 240px; display: flex; align-items: center"
      >
        <MznDropdownItemCard v-bind="args" />
      </div>
    `,
  }),
};

const panelStyle =
  'width: fit-content; min-width: 50%; height: 285px; background-color: #F3F4F6; padding: 40px';
const stackStyle = 'display: flex; flex-direction: column; gap: 20px';
const tableStyle = 'border-collapse: collapse; width: 100%';
const headCellStyle = 'padding: 8px; text-align: center';
const headLabelCellStyle = 'padding: 8px; text-align: center; width: 120px';
const bodyLabelCellStyle = 'padding: 8px; vertical-align: middle';
const cellStyle = 'padding: 8px';

export const Single: Story = {
  render: () => ({
    components: { MznDropdownItemCard, MznTag },
    setup: () => ({
      FolderIcon,
      bodyLabelCellStyle,
      cellStyle,
      headCellStyle,
      headLabelCellStyle,
      panelStyle,
      stackStyle,
      tableStyle,
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px">
        <div :style="panelStyle">
          <MznTag label="Default" size="main" />
          <div :style="stackStyle">
            <table :style="tableStyle">
              <thead>
                <tr>
                  <th :style="headLabelCellStyle"></th>
                  <th :style="headCellStyle">Icon Default</th>
                  <th :style="headCellStyle" />
                  <th :style="headCellStyle">Icon Selected</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td :style="bodyLabelCellStyle">Enabled / Hover</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      sub-title="Supporting text"
                      :append-icon="FolderIcon"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      sub-title="Supporting text"
                      append-content="New"
                      check-site="suffix"
                      checked
                    />
                  </td>
                </tr>
                <tr>
                  <td :style="bodyLabelCellStyle">Matched</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      sub-title="Supporting text option"
                      follow-text="opti"
                      :append-icon="FolderIcon"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      sub-title="Supporting text option"
                      follow-text="op"
                      append-content="New"
                      check-site="suffix"
                      checked
                    />
                  </td>
                </tr>
                <tr>
                  <td :style="bodyLabelCellStyle">Disable</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      sub-title="Supporting text"
                      disabled
                      :append-icon="FolderIcon"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      sub-title="Supporting text"
                      :append-icon="FolderIcon"
                      disabled
                      append-content="New"
                      check-site="suffix"
                      checked
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div :style="panelStyle">
          <MznTag label="Danger" size="main" />
          <div :style="stackStyle">
            <table :style="tableStyle">
              <thead>
                <tr>
                  <th :style="headLabelCellStyle"></th>
                  <th :style="headCellStyle">Icon Default</th>
                  <th :style="headCellStyle" />
                  <th :style="headCellStyle">Icon Selected</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td :style="bodyLabelCellStyle">Enabled / Hover</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      sub-title="Supporting text"
                      :append-icon="FolderIcon"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      sub-title="Supporting text"
                      append-content="New"
                      check-site="suffix"
                      checked
                    />
                  </td>
                </tr>
                <tr>
                  <td :style="bodyLabelCellStyle">Matched</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      sub-title="Supporting text option"
                      follow-text="opti"
                      :append-icon="FolderIcon"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      sub-title="Supporting text option"
                      follow-text="op"
                      append-content="New"
                      check-site="suffix"
                      checked
                    />
                  </td>
                </tr>
                <tr>
                  <td :style="bodyLabelCellStyle">Disable</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      sub-title="Supporting text"
                      disabled
                      :append-icon="FolderIcon"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="single"
                      label="Option"
                      validate="danger"
                      sub-title="Supporting text"
                      :append-icon="FolderIcon"
                      disabled
                      append-content="New"
                      check-site="suffix"
                      checked
                    />
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
    components: { MznDropdownItemCard, MznTag },
    setup: () => ({
      CaretRightIcon,
      bodyLabelCellStyle,
      cellStyle,
      headCellStyle,
      headLabelCellStyle,
      panelStyle,
      stackStyle,
      tableStyle,
    }),
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px">
        <div :style="panelStyle">
          <MznTag label="Default" size="main" />
          <div :style="stackStyle">
            <table :style="tableStyle">
              <thead>
                <tr>
                  <th :style="headLabelCellStyle"></th>
                  <th :style="headCellStyle">Basic</th>
                  <th :style="headCellStyle" />
                  <th :style="headCellStyle">Expandable</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td :style="bodyLabelCellStyle">Enabled / Hover</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      sub-title="Supporting text"
                      check-site="suffix"
                      append-content="New"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      sub-title="Supporting text"
                      check-site="suffix"
                      :prepend-icon="CaretRightIcon"
                    />
                  </td>
                </tr>
                <tr>
                  <td :style="bodyLabelCellStyle">Matched</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      sub-title="Supporting text option"
                      follow-text="opti"
                      check-site="suffix"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      sub-title="Supporting text option"
                      follow-text="op"
                      check-site="suffix"
                      :prepend-icon="CaretRightIcon"
                      checked
                    />
                  </td>
                </tr>
                <tr>
                  <td :style="bodyLabelCellStyle">Disable</td>
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      sub-title="Supporting text"
                      disabled
                      check-site="suffix"
                    />
                  </td>
                  <td />
                  <td :style="cellStyle">
                    <MznDropdownItemCard
                      mode="multiple"
                      label="Option"
                      sub-title="Supporting text"
                      disabled
                      checked
                      check-site="suffix"
                      :prepend-icon="CaretRightIcon"
                    />
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
