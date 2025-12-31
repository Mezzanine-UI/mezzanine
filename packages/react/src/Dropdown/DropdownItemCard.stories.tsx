import { Meta, StoryObj } from '@storybook/react-webpack5';
import DropdownItemCard, { DropdownItemCardProps } from './DropdownItemCard';

import { CaretRightIcon, FolderIcon } from '@mezzanine-ui/icons';

import Tag from '../Tag';

export default {
  title: 'Data Entry/Dropdown/DropdownItemCard',
  component: DropdownItemCard,
} satisfies Meta<typeof DropdownItemCard>;

type Story = StoryObj<DropdownItemCardProps>;

export const Playground: Story = {
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    level: {
      control: 'select',
      options: [0, 1, 2],
    },
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
    checkSite: {
      control: 'radio',
      options: ['prepend', 'append', 'none'],
    },
    validate: {
      control: 'select',
      options: ['default', 'danger'],
    },
  },
  args: {
    mode: 'single',
    level: 0,
    label: 'Option',
    subTitle: 'Supporting text',
    appendIcon: FolderIcon,
    disabled: false,
    checked: false,
    checkSite: 'none',
  },
  render: (args) => (
    <div
      style={{
        backgroundColor: '#d3d3d3',
        height: '100px',
        width: '240px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <DropdownItemCard {...args} />
    </div>
  )
};

export const Single: Story = {
  render: () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    }}>
      <div
        style={{
          width: 'fit-content',
          minWidth: '50%',
          height: 285,
          backgroundColor: '#F3F4F6',
          padding: 40,
        }}
      >
        <Tag label="Default" size="main" />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', textAlign: 'center', width: '120px' }}></th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Icon Default</th>
                <th style={{ padding: '8px', textAlign: 'center' }} />
                <th style={{ padding: '8px', textAlign: 'center' }}>Icon Selected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', verticalAlign: 'middle' }}>Enabled / Hover</td>
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    subTitle="Supporting text"
                    appendIcon={FolderIcon}
                    appendContent="New"
                  />
                </td>
                <td />
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    subTitle="Supporting text"
                    appendContent="New"
                    checkSite="append"
                    checked
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', verticalAlign: 'middle' }}>Matched</td>
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    subTitle="Supporting text option"
                    followText="opti"
                    appendIcon={FolderIcon}
                    appendContent="New"
                  />
                </td>
                <td />
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    subTitle="Supporting text option"
                    followText="op"
                    appendContent="New"
                    checkSite="append"
                    checked
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', verticalAlign: 'middle' }}>Disable</td>
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    subTitle="Supporting text"
                    disabled
                    appendIcon={FolderIcon}
                    appendContent="New"
                  />
                </td>
                <td />
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    subTitle="Supporting text"
                    appendIcon={FolderIcon}
                    disabled
                    appendContent="New"
                    checkSite="append"
                    checked
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          width: 'fit-content',
          minWidth: '50%',
          height: 285,
          backgroundColor: '#F3F4F6',
          padding: 40,
        }}
      >
        <Tag label="Danger" size="main" />
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20
        }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '8px', textAlign: 'center', width: '120px' }}></th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Icon Default</th>
                <th style={{ padding: '8px', textAlign: 'center' }} />
                <th style={{ padding: '8px', textAlign: 'center' }}>Icon Selected</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', verticalAlign: 'middle' }}>Enabled / Hover</td>
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    validate="danger"
                    subTitle="Supporting text"
                    appendIcon={FolderIcon}
                    appendContent="New"
                  />
                </td>
                <td />
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    validate="danger"
                    subTitle="Supporting text"
                    appendContent="New"
                    checkSite="append"
                    checked
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', verticalAlign: 'middle' }}>Matched</td>
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    validate="danger"
                    subTitle="Supporting text option"
                    followText="opti"
                    appendIcon={FolderIcon}
                    appendContent="New"
                  />
                </td>
                <td />
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    validate="danger"
                    subTitle="Supporting text option"
                    followText="op"
                    appendContent="New"
                    checkSite="append"
                    checked
                  />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', verticalAlign: 'middle' }}>Disable</td>
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    validate="danger"
                    subTitle="Supporting text"
                    disabled
                    appendIcon={FolderIcon}
                    appendContent="New"
                  />
                </td>
                <td />
                <td style={{ padding: '8px' }}>
                  <DropdownItemCard
                    mode="single"
                    label="Option"
                    validate="danger"
                    subTitle="Supporting text"
                    appendIcon={FolderIcon}
                    disabled
                    appendContent="New"
                    checkSite="append"
                    checked
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};

export const Multiple: Story = {
  render: () => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  }}>
    <div
      style={{
        width: 'fit-content',
        minWidth: '50%',
        height: 285,
        backgroundColor: '#F3F4F6',
        padding: 40,
      }}
    >
      <Tag label="Default" size="main" />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', textAlign: 'center', width: '120px' }}></th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Basic</th>
              <th style={{ padding: '8px', textAlign: 'center' }} />
              <th style={{ padding: '8px', textAlign: 'center' }}>Expandable</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>Enabled / Hover</td>
              <td style={{ padding: '8px' }}>
                <DropdownItemCard
                  mode="multiple"
                  label="Option"
                  subTitle="Supporting text"
                  checkSite="prepend"
                  appendContent="New"
                />
              </td>
              <td />
              <td style={{ padding: '8px' }}>
                <DropdownItemCard
                  mode="multiple"
                  label="Option"
                  subTitle="Supporting text"
                  checkSite="prepend"
                  prependIcon={CaretRightIcon}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>Matched</td>
              <td style={{ padding: '8px' }}>
                <DropdownItemCard
                  mode="multiple"
                  label="Option"
                  subTitle="Supporting text option"
                  followText="opti"
                  checkSite="prepend"
                />
              </td>
              <td />
              <td style={{ padding: '8px' }}>
                <DropdownItemCard
                  mode="multiple"
                  label="Option"
                  subTitle="Supporting text option"
                  followText="op"
                  checkSite="prepend"
                  prependIcon={CaretRightIcon}
                  checked
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', verticalAlign: 'middle' }}>Disable</td>
              <td style={{ padding: '8px' }}>
                <DropdownItemCard
                  mode="multiple"
                  label="Option"
                  subTitle="Supporting text"
                  disabled
                  checkSite="prepend"
                />
              </td>
              <td />
              <td style={{ padding: '8px' }}>
                <DropdownItemCard
                  mode="multiple"
                  label="Option"
                  subTitle="Supporting text"
                  disabled
                  checked
                  checkSite="prepend"
                  prependIcon={CaretRightIcon}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
};
