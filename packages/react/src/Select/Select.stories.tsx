import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useCallback, useRef, useState } from 'react';
import Select from '.';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Select',
  component: Select,
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
      description: '是否顯示清除按鈕',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用',
      table: { defaultValue: { summary: 'false' } },
    },
    error: {
      control: { type: 'boolean' },
      description: '是否為錯誤狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '是否撐滿父容器寬度',
      table: { defaultValue: { summary: 'false' } },
    },
    loading: {
      control: { type: 'boolean' },
      description: '是否顯示載入狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    loadingText: {
      control: { type: 'text' },
      description: '載入狀態顯示的文字',
    },
    menuMaxHeight: {
      control: { type: 'number' },
      description: '下拉選單最大高度',
    },
    mode: {
      control: { type: 'select' },
      options: ['single', 'multiple'],
      description: '選擇模式',
      table: { defaultValue: { summary: 'single' } },
    },
    overflowStrategy: {
      control: { type: 'select' },
      options: ['counter', 'wrap'],
      description: '多選時 tag 的溢出策略（僅 multiple 模式有效）',
      table: { defaultValue: { summary: 'counter' } },
    },
    placeholder: {
      control: { type: 'text' },
      description: '未選擇時的提示文字',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: '是否為唯讀狀態',
      table: { defaultValue: { summary: 'false' } },
    },
    required: {
      control: { type: 'boolean' },
      description: '是否為必填',
      table: { defaultValue: { summary: 'false' } },
    },
    size: {
      control: { type: 'select' },
      options: ['main', 'sub'],
      description: '輸入框尺寸',
      table: { defaultValue: { summary: 'main' } },
    },
  },
} satisfies Meta<typeof Select>;

const BasicComponent = () => {
  const [value, setValue] = useState<{ id: string; name: string } | null>(null);

  const basicOptions: DropdownOption[] = [
    { id: '1', name: 'item1 has very long description' },
    { id: '2', name: 'item2 has very long description' },
    { id: '3', name: 'item3 has very long description' },
    { id: '4', name: 'item4 has very long description' },
    { id: '5', name: 'item5 has very long description' },
  ];

  const simpleOptions: DropdownOption[] = [
    { id: '1', name: 'item1' },
    { id: '2', name: 'item2' },
    { id: '3', name: 'item3' },
  ];

  const multipleOptions: DropdownOption[] = [
    { id: '1', name: 'item123' },
    { id: '2', name: 'item26666' },
    { id: '3', name: 'item3' },
  ];

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
        options={basicOptions}
        placeholder="預設文字"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
      <Select
        disabled
        fullWidth
        options={simpleOptions}
        placeholder="預設文字"
      />
      <Select error fullWidth options={simpleOptions} placeholder="預設文字" />
      <Select
        clearable
        defaultValue={[
          { id: '1', name: 'item123' },
          { id: '2', name: 'item26666' },
        ]}
        fullWidth
        mode="multiple"
        options={multipleOptions}
        placeholder="我是多選"
      />
    </div>
  );
};

export const Basic: StoryObj<typeof Select> = {
  render: () => <BasicComponent />,
};

const WithSizeComponent = () => {
  const sizeOptions: DropdownOption[] = [
    { id: '1', name: 'item1' },
    { id: '2', name: 'item2' },
    { id: '3', name: 'item3' },
  ];

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 300px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          size = main (default)
        </Typography>
        <Select
          fullWidth
          options={sizeOptions}
          placeholder="預設文字"
          size="main"
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          size = sub
        </Typography>
        <Select
          fullWidth
          options={sizeOptions}
          placeholder="預設文字"
          size="sub"
        />
      </div>
    </div>
  );
};

export const Size: StoryObj<typeof Select> = {
  render: () => <WithSizeComponent />,
};

const MultipleComponent = () => {
  const [value, setValue] = useState<{ id: string; name: string }[]>([]);

  const multipleOptions: DropdownOption[] = [
    { id: '1', name: 'item1' },
    { id: '2', name: 'item2' },
    { id: '3', name: 'item3' },
    { id: '4', name: 'item4' },
    { id: '5', name: 'item5' },
    { id: '6', name: 'item6' },
  ];

  return (
    <div style={{ maxWidth: '300px' }}>
      <Select
        clearable
        fullWidth
        mode="multiple"
        onChange={setValue}
        options={multipleOptions}
        overflowStrategy="wrap"
        placeholder="請選擇多個項目"
        value={value}
      />
    </div>
  );
};

export const Multiple: StoryObj<typeof Select> = {
  render: () => <MultipleComponent />,
};

const WithReadOnlyComponent = () => {
  const [value, setValue] = useState<{ id: string; name: string } | null>({
    id: '1',
    name: 'item1',
  });

  const readOnlyOptions: DropdownOption[] = [
    { id: '1', name: 'item1' },
    { id: '2', name: 'item2' },
    { id: '3', name: 'item3' },
  ];

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 300px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          readOnly = false (default)
        </Typography>
        <Select
          clearable
          fullWidth
          options={readOnlyOptions}
          placeholder="預設文字"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          readOnly = true
        </Typography>
        <Select
          clearable
          fullWidth
          options={readOnlyOptions}
          readOnly
          placeholder="預設文字"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
    </div>
  );
};

export const WithReadOnly: StoryObj<typeof Select> = {
  render: () => <WithReadOnlyComponent />,
};

const WithScrollComponent = () => {
  const [options, setOptions] = useState<DropdownOption[]>(
    Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      name: `item${i + 1}`,
    })),
  );
  const [loading, setLoading] = useState(false);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const isFetchingRef = useRef(false);

  const loadMore = useCallback(() => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    setTimeout(() => {
      setOptions((prev) => [
        ...prev,
        ...Array.from({ length: 10 }, (_, i) => ({
          id: String(prev.length + i + 1),
          name: `item${prev.length + i + 1}`,
        })),
      ]);
      setLoading(false);
      isFetchingRef.current = false;
      setHasReachedBottom(false);
    }, 1000);
  }, []);

  const handleReachBottom = useCallback(() => {
    if (!hasReachedBottom && !isFetchingRef.current) {
      setHasReachedBottom(true);
      loadMore();
    }
  }, [hasReachedBottom, loadMore]);

  const handleLeaveBottom = useCallback(() => {
    setHasReachedBottom(false);
  }, []);

  return (
    <div style={{ maxWidth: '300px' }}>
      <Select
        clearable
        fullWidth
        loading={loading}
        loadingText="載入中..."
        menuMaxHeight={200}
        onLeaveBottom={handleLeaveBottom}
        onReachBottom={handleReachBottom}
        options={options}
        placeholder="滾動載入更多"
      />
    </div>
  );
};

export const WithScroll: StoryObj<typeof Select> = {
  render: () => <WithScrollComponent />,
};

const treeOptions: DropdownOption[] = [
  {
    name: '前端框架',
    id: 'frontend',
    children: [
      {
        name: 'React',
        id: 'react',
        children: [
          { name: 'React.js', id: 'reactjs' },
          { name: 'React Native', id: 'react-native' },
          { name: 'Next.js', id: 'nextjs' },
        ],
      },
      { name: 'Vue', id: 'vue' },
      { name: 'Angular', id: 'angular' },
    ],
  },
  {
    name: '後端框架',
    id: 'backend',
    children: [
      { name: 'Node.js', id: 'nodejs' },
      { name: 'Express', id: 'express' },
      { name: 'NestJS', id: 'nestjs' },
    ],
  },
  {
    name: '資料庫',
    id: 'database',
    children: [
      { name: 'PostgreSQL', id: 'postgresql' },
      { name: 'MySQL', id: 'mysql' },
      { name: 'MongoDB', id: 'mongodb' },
    ],
  },
];

const WithTreeComponent = () => {
  const [value, setValue] = useState<{ id: string; name: string }[]>([]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '400px',
      }}
    >
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          Multiple Mode (Tree) - 所有選項都有 checkbox:
        </Typography>
        <Select
          clearable
          fullWidth
          mode="multiple"
          options={treeOptions}
          placeholder="請選擇多個技術棧"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        />
      </div>
      {value.length > 0 && (
        <div
          style={{
            padding: '8px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <Typography variant="body" style={{ marginBottom: '4px' }}>
            已選擇 ({value.length} 項):
          </Typography>
          {value.map((v) => (
            <Typography key={v.id} variant="body" style={{ fontSize: '12px' }}>
              • {v.name} (ID: {v.id})
            </Typography>
          ))}
        </div>
      )}
    </div>
  );
};

export const WithTree: StoryObj<typeof Select> = {
  render: () => <WithTreeComponent />,
};
