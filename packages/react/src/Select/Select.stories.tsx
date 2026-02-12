import { DropdownOption } from '@mezzanine-ui/core/dropdown/dropdown';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useRef, useState } from 'react';
import Select from '.';
import Typography from '../Typography';

export default {
  title: 'Data Entry/Select',
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
      <Select disabled fullWidth options={simpleOptions} placeholder="預設文字" />
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
  const [isLoading, setIsLoading] = useState(false);
  const isFetchingRef = useRef(false);

  return (
    <div style={{ maxWidth: '300px' }}>
      <Select
        clearable
        fullWidth
        menuMaxHeight={200}
        options={options}
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
      />
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
