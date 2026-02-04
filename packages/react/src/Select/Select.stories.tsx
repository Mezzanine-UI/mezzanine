import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useRef, useState } from 'react';
import Select, { Option } from '.';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Select',
} satisfies Meta<typeof Select>;

const BasicComponent = () => {
  const [value, setValue] = useState<{ id: string; name: string } | null>(null);

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
        placeholder="預設文字"
        value={value}
        onChange={(newValue) => setValue(newValue)}
      >
        <Option value="1">item1 has very long description</Option>
        <Option value="2">item2 has very long description</Option>
        <Option value="3">item3 has very long description</Option>
        <Option value="4">item4 has very long description</Option>
        <Option value="5">item5 has very long description</Option>
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
          { id: '1', name: 'item123' },
          { id: '2', name: 'item26666' },
        ]}
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

export const Basic: StoryObj<typeof Select> = {
  render: () => <BasicComponent />,
};

const WithReadOnlyComponent = () => {
  const [value, setValue] = useState<{ id: string; name: string } | null>({
    id: '1',
    name: 'item1',
  });

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
          placeholder="預設文字"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Option value="1">item1</Option>
          <Option value="2">item2</Option>
          <Option value="3">item3</Option>
        </Select>
      </div>
      <div>
        <Typography variant="body" style={{ marginBottom: '8px' }}>
          readOnly = true
        </Typography>
        <Select
          clearable
          fullWidth
          readOnly
          placeholder="預設文字"
          value={value}
          onChange={(newValue) => setValue(newValue)}
        >
          <Option value="1">item1</Option>
          <Option value="2">item2</Option>
          <Option value="3">item3</Option>
        </Select>
      </div>
    </div>
  );
};

export const WithReadOnly: StoryObj<typeof Select> = {
  render: () => <WithReadOnlyComponent />,
};

const WithScrollComponent = () => {
  const [options, setOptions] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      name: `item${i + 1}`,
    })),
  );
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);

  return (
    <div style={{ maxWidth: '300px' }}>
      <Select
        clearable
        fullWidth
        menuMaxHeight={200}
        onScroll={({ scrollTop, maxScrollTop }) => {
          if (scrollTop + 40 >= maxScrollTop && !isFetchingRef.current) {
            setIsLoading(true);
            isFetchingRef.current = true;

            setTimeout(() => {
              setOptions((prev) => [
                ...prev,
                ...Array.from({ length: 10 }, (_, i) => ({
                  id: String(prev.length + i + 1),
                  name: `item${prev.length + i + 1}`,
                })),
              ]);
              setIsLoading(false);
              isFetchingRef.current = false;
            }, 1000);
          }
        }}
        placeholder="滾動載入更多"
      >
        {options.map((opt) => (
          <Option key={opt.id} value={opt.id}>
            {opt.name}
          </Option>
        ))}
      </Select>
      {isLoading && (
        <div style={{ padding: '8px', textAlign: 'center', marginTop: '8px' }}>
          <Typography variant="body">載入中...</Typography>
        </div>
      )}
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
