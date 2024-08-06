import { StoryFn } from '@storybook/react';
import { useRef, useState } from 'react';
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
import ConfigProvider from '../Provider';
import Loading from '../Loading/Loading';

export default {
  title: 'Data Entry/Select',
};

const defaultOpts = [
  {
    value: '1',
    label: 'item1 has very long description',
  },
  {
    value: '2',
    label: 'item2 has very long description',
  },
  {
    value: '3',
    label: 'item3 has very long description',
  },
  {
    value: '4',
    label: 'item4 has very long description',
  },
  {
    value: '5',
    label: 'item5 has very long description',
  },
];

export const Basic = () => {
  const [options] = useState(defaultOpts);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 300px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <Select clearable fullWidth required placeholder="預設文字">
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
      <Select disabled fullWidth placeholder="預設文字">
        <Option value="1">item1</Option>
        <Option value="2">item2</Option>
        <Option value="3">item3</Option>
      </Select>
      <Select error fullWidth placeholder="預設文字">
        <Option value="1">item1</Option>
        <Option value="2">item2</Option>
        <Option value="3">item3</Option>
      </Select>
      <Select
        clearable
        defaultValue={[
          {
            id: '1',
            name: 'item123',
          },
          {
            id: '2',
            name: 'item26666',
          },
        ]}
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
        defaultValue={[
          {
            id: '1',
            name: 'item123',
          },
          {
            id: '2',
            name: 'item26666',
          },
        ]}
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
};

export const DynamicFetching = () => {
  const [options, setOptions] = useState(defaultOpts);
  const isFetchingSnapshot = useRef<boolean>(false);
  const [isLoading, toggleLoading] = useState(false);

  return (
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
        onMenuScroll={({ scrollTop, maxScrollTop }) => {
          /** your custom fetch more logic */
          const { current: isFetching } = isFetchingSnapshot;

          if (scrollTop + 40 >= maxScrollTop && !isFetching) {
            toggleLoading(true);
            isFetchingSnapshot.current = true;

            setTimeout(() => {
              setOptions((prev) => [
                ...prev,
                ...Array.from(Array(10)).map((_, idx) => ({
                  value: `${(idx + 1) * 10 * Math.random()}`,
                  label: `${(idx + 1) * 10 * Math.random()} item`,
                })),
              ]);

              toggleLoading(false);
              isFetchingSnapshot.current = false;
            }, 2000);
          }
        }}
        placeholder="預設文字"
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
        {isLoading ? <Loading loading iconProps={{ size: 24 }} /> : null}
      </Select>
    </div>
  );
};

export const Group = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(3, 160px)',
      gap: 60,
    }}
  >
    <ConfigProvider size="large">
      <Select fullWidth placeholder="預設">
        <OptionGroup label="Group A">
          <Option value="1">item 1</Option>
          <Option value="2">item 2</Option>
        </OptionGroup>
        <OptionGroup label="Group B">
          <Option value="3">item 1</Option>
          <Option value="4">item 2</Option>
        </OptionGroup>
      </Select>
    </ConfigProvider>
    <Select fullWidth menuSize="medium" placeholder="預設" size="medium">
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select fullWidth menuSize="small" placeholder="預設" size="small">
      <OptionGroup label="Group A">
        <Option value="1">item 1</Option>
        <Option value="2">item 2</Option>
      </OptionGroup>
      <OptionGroup label="Group B">
        <Option value="3">item 1</Option>
        <Option value="4">item 2</Option>
      </OptionGroup>
    </Select>
    <Select fullWidth placeholder="預設">
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

export const TreeSelectDynamicLoading = () => {
  const [nodes, setNodes] = useState<TreeSelectOption[]>([
    {
      id: '1',
      name: 'Dynamic Loading',
      dynamicChildrenFetching: true,
    },
    {
      id: '2',
      name: 'Dynamic Loading 2',
      dynamicChildrenFetching: true,
    },
  ]);

  const [value, setValue] = useState<SelectValue[]>([]);

  function mapValues() {
    return value.reduce((acc, current) => {
      if (!acc.length) {
        return current.id;
      }

      return `${acc}, ${current.id}`;
    }, '');
  }

  return (
    <>
      <Typography
        component="p"
        variant="input2"
        style={{ marginBottom: '12px' }}
      >
        {`current value: [${mapValues()}]`}
      </Typography>
      <TreeSelect
        options={nodes}
        clearable
        mode="single"
        placeholder="Dynamic loading options"
        onChange={setValue}
        onExpand={(nodeValue) => {
          const deepFindTarget = (
            targetNodes: TreeSelectOption[],
            v: string,
            children: TreeSelectOption[],
          ) => {
            const target = targetNodes.find((n) => n.id === v);

            /** 確認找到的目標是需要動態抓取的 */
            if (target && target.dynamicChildrenFetching) {
              /** 已經動態抓取過，所以修改成 false */
              target.dynamicChildrenFetching = false;
              /** assign API 結果（如果為空，那麼展開箭頭就會不見） */
              target.siblings = children;

              return target;
            }

            /** deep find */
            targetNodes.forEach((node) => {
              if (node.siblings?.length) {
                deepFindTarget(node.siblings, v, children);
              }
            });
          };

          setTimeout(() => {
            setNodes((prev) => {
              const prevCopy = prev.slice(0);

              /** 自行決定如何修改 tree nodes */
              deepFindTarget(
                prevCopy,
                `${nodeValue}`,
                /** 假設 API response 如下 */
                [
                  {
                    dynamicChildrenFetching: true,
                    name: 'Dynamic Nodes',
                    id: `${Math.random() * 1000}`,
                  },
                  {
                    name: 'Static Node',
                    id: `${Math.random() * 1005}`,
                  },
                ],
              );

              return prevCopy;
            });
          }, 2000);
        }}
        value={value}
      />
    </>
  );
};

type TreeSelectPlaygroundArgs = Pick<
  TreeSelectProps,
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

export const TreeSelectPlayground: StoryFn<TreeSelectPlaygroundArgs> = ({
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
  const [nodes] = useState<TreeSelectOption[]>([
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
  ]);

  const [value, setValue] = useState<SelectValue[]>([]);

  function mapValues() {
    return value.reduce((acc, current) => {
      if (!acc.length) {
        return current.id;
      }

      return `${acc}, ${current.id}`;
    }, '');
  }

  return (
    <>
      <Typography
        component="p"
        variant="input2"
        style={{ marginBottom: '12px' }}
      >
        {`current value: [${mapValues()}]`}
      </Typography>
      <TreeSelect
        options={nodes}
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
    options: ['small', 'medium', 'large'],
    control: {
      type: 'select',
    },
  },
  mode: {
    options: ['single', 'multiple'],
    control: {
      type: 'select',
    },
  },
  size: {
    options: ['small', 'medium', 'large'],
    control: {
      type: 'select',
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
  const [value, setValue] = useState<SelectValue | null>({
    id: '1',
    name: 'item1',
  });

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
      <Button
        variant="contained"
        onClick={() => setValue({ id: '2', name: 'item2' })}
      >
        set 2
      </Button>
      <Button variant="contained" onClick={() => setValue(null)}>
        reset
      </Button>
    </div>
  );
};

export const OnModal = () => (
  <Modal fullScreen open>
    <ModalHeader>Hi</ModalHeader>
    <ModalBody>
      <Select clearable required placeholder="預設文字">
        <Option value="1">item1</Option>
        <Option value="2">item2</Option>
        <Option value="3">item3</Option>
      </Select>
    </ModalBody>
  </Modal>
);
