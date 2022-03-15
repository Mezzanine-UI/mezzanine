import { Story } from '@storybook/react';
import { useState } from 'react';
import Select, {
  Option,
  OptionGroup,
  TreeSelectOption,
  SelectValue,
  TreeSelect,
  TreeSelectProps,
} from '.';
import Typography from '../Typography';
import Button from '../Button';
import Modal, { ModalHeader, ModalBody } from '../Modal';

export default {
  title: 'Data Entry/Select',
};

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, 300px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <Select
      clearable
      fullWidth
      required
      placeholder="預設文字"
    >
      <Option value="1">item1 has very long description</Option>
      <Option value="2">item2</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      disabled
      fullWidth
      placeholder="預設文字"
    >
      <Option value="1">item1</Option>
      <Option value="2">item2</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      error
      fullWidth
      placeholder="預設文字"
    >
      <Option value="1">item1</Option>
      <Option value="2">item2</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      defaultValue={[{
        id: '1',
        name: 'item123',
      }, {
        id: '2',
        name: 'item26666',
      }]}
      fullWidth
      mode="multiple"
      placeholder="我是多選"
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
    <Select
      clearable
      defaultValue={[{
        id: '1',
        name: 'item123',
      }, {
        id: '2',
        name: 'item26666',
      }]}
      disabled
      fullWidth
      mode="multiple"
      placeholder="我是多選"
    >
      <Option value="1">item123</Option>
      <Option value="2">item26666</Option>
      <Option value="3">item3</Option>
    </Select>
  </div>
);

export const Group = () => (
  <div style={{
    display: 'inline-grid',
    gridTemplateColumns: 'repeat(3, 160px)',
    gap: 60,
  }}
  >
    <Select
      fullWidth
      menuSize="large"
      placeholder="預設"
      size="large"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      fullWidth
      menuSize="medium"
      placeholder="預設"
      size="medium"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      fullWidth
      menuSize="small"
      placeholder="預設"
      size="small"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      fullWidth
      placeholder="預設"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      defaultValue={{
        id: '1',
        name: 'item 1',
      }}
      fullWidth
      placeholder="預設"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select
      disabled
      defaultValue={{
        id: '1',
        name: 'item 1',
      }}
      fullWidth
      placeholder="預設"
    >
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
  </div>
);

const treeSelectOptions: TreeSelectOption[] = [
  {
    id: '1',
    name: 'label 1',
    siblings: [
      {
        id: '1-1',
        name: 'label 1-1',
        siblings: [
          {
            id: '1-1-1',
            name: 'label 1-1-1',
          },
          {
            id: '1-1-2',
            name: 'label 1-1-2',
          },
        ],
      },
      {
        id: '1-2',
        name: 'label 1-2',
      },
    ],
  },
  {
    id: '2',
    name: 'label 2',
  },
];

type TreeSelectPlaygroundArgs = Pick<TreeSelectProps,
| 'clearable'
| 'disabled'
| 'error'
| 'fullWidth'
| 'itemsInView'
| 'menuSize'
| 'mode'
| 'placeholder'
| 'sameWidth'
| 'size'
>;

export const TreeSelectPlayground: Story<TreeSelectPlaygroundArgs> = ({
  clearable,
  disabled,
  error,
  fullWidth,
  itemsInView,
  menuSize,
  mode,
  placeholder,
  sameWidth,
  size,
}) => {
  const [value, setValue] = useState<SelectValue[]>([]);

  function mapValues() {
    return value.reduce((acc, current) => {
      if (!acc.length) { return current.id; }

      return `${acc}, ${current.id}`;
    }, '');
  }

  return (
    <>
      <Typography component="p" variant="input2" style={{ marginBottom: '12px' }}>
        {`current value: [${mapValues()}]`}
      </Typography>
      <TreeSelect
        options={treeSelectOptions}
        clearable={clearable}
        disabled={disabled}
        error={error}
        fullWidth={fullWidth}
        mode={mode}
        size={size}
        itemsInView={itemsInView}
        menuSize={menuSize}
        placeholder={placeholder}
        sameWidth={sameWidth}
        onChange={setValue}
        value={value}
      />
    </>
  );
};

TreeSelectPlayground.argTypes = {
  menuSize: {
    control: {
      type: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
  mode: {
    control: {
      type: 'select',
      options: ['single', 'multiple'],
    },
  },
  size: {
    control: {
      type: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

TreeSelectPlayground.args = {
  clearable: false,
  disabled: false,
  error: false,
  fullWidth: false,
  itemsInView: 4,
  menuSize: 'medium',
  mode: 'single',
  placeholder: 'Choose option',
  sameWidth: false,
  size: 'medium',
};

export const FullControl = () => {
  const [value, setValue] = useState<SelectValue | null>({ id: '1', name: 'item1' });

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: '150px repeat(2, 100px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Select
        clearable
        fullWidth
        required
        value={value}
        onChange={(newOption: SelectValue) => setValue(newOption)}
        onClear={() => setValue(null)}
        placeholder="預設文字"
      >
        <Option value="1">item1</Option>
        <Option value="2">item2</Option>
        <Option value="3">item3</Option>
      </Select>
      <Button variant="contained" onClick={() => setValue({ id: '2', name: 'item2' })}>set 2</Button>
      <Button variant="contained" onClick={() => setValue(null)}>reset</Button>
    </div>
  );
};

export const OnModal = () => (
  <Modal
    fullScreen
    open
  >
    <ModalHeader>
      Hi
    </ModalHeader>
    <ModalBody>
      <Select
        clearable
        required
        placeholder="預設文字"
      >
        <Option value="1">item1</Option>
        <Option value="2">item2</Option>
        <Option value="3">item3</Option>
      </Select>
    </ModalBody>
  </Modal>
);
