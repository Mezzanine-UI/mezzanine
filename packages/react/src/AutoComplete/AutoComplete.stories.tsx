import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useRef, useState } from 'react';
import { AutoComplete } from '.';
import { SelectValue } from '../Select/typings';
import Tag from '../Tag';

const meta: Meta<typeof AutoComplete> = {
  title: 'Data Entry/AutoComplete',
  component: AutoComplete,
};

export default meta;

const originOptions: SelectValue[] = [
  {
    id: 'item1',
    name: 'item1',
  },
  {
    id: 'item2',
    name: 'item2',
  },
  {
    id: 'item3',
    name: 'item3',
  },
  {
    id: 'foo',
    name: 'foo',
  },
  {
    id: 'bar',
    name: 'bar',
  },
  {
    id: 'bob',
    name: 'bob',
  },
  {
    id: 'apple',
    name: 'apple',
  },
  {
    id: 'very very very long',
    name: 'very very very long',
  },
  {
    id: '?><!@#$^$&^&',
    name: '?><!@#$^$&^&',
  },
];

export const Basic: StoryObj<typeof AutoComplete> = {
  render: () => (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(3, 240px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <AutoComplete
        fullWidth
        menuMaxHeight={140}
        options={originOptions}
        placeholder="Placeholder"
        required
      />
      <AutoComplete
        error
        fullWidth
        menuMaxHeight={140}
        options={originOptions}
        placeholder="Placeholder"
        required
      />
      <AutoComplete
        disabled
        fullWidth
        menuMaxHeight={140}
        options={originOptions}
        placeholder="Placeholder"
        required
      />
    </div>
  ),
};

const SingleModeAsyncSearchComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);

  const handleSearch = useCallback((search: string) => {
    if (!search) {
      setOptions(originOptions);
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const filtered = originOptions.filter((opt) =>
          opt.name.toLowerCase().includes(search.toLowerCase())
        );
        setOptions(filtered);
        resolve();
      }, 1000);
    });
  }, []);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 300px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <AutoComplete
        asyncData
        disabledOptionsFilter
        emptyText="沒有符合的選項"
        fullWidth
        loadingText="載入中..."
        menuMaxHeight={200}
        mode="single"
        onSearch={handleSearch}
        options={options}
        placeholder="Placeholder"
      />
    </div>
  );
};

export const SingleModeAsyncSearch: StoryObj<typeof AutoComplete> = {
  render: () => <SingleModeAsyncSearchComponent />,
};

const SingleModeSyncSearchComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);

  const handleSearch = useCallback((search: string) => {
    if (!search) {
      setOptions(originOptions);
      return;
    }

    const filtered = originOptions.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    );

    setOptions(filtered);
  }, []);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 300px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <AutoComplete
        disabledOptionsFilter
        emptyText="沒有符合的選項"
        fullWidth
        menuMaxHeight={200}
        mode="single"
        onSearch={handleSearch}
        options={options}
        placeholder="Placeholder"
      />
    </div>
  );
};

export const SingleModeSyncSearch: StoryObj<typeof AutoComplete> = {
  render: () => <SingleModeSyncSearchComponent />,
};

const KeepSearchTextOnBlurComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);

  const handleSearch = useCallback((search: string) => {
    if (!search) {
      setOptions(originOptions);
      return;
    }

    const filtered = originOptions.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase())
    );

    setOptions(filtered);
  }, []);

  const handleSearchTextChange = useCallback((_search: string) => {
    // This is the extension point for any custom string handling with searchText,
    // such as transformation, validation, API requests, logging, debouncing,
    // multi-field search, or advanced processing scenarios.
    // Use onSearchTextChange here for special requirements on search input.
  }, []);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 300px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <AutoComplete
        disabledOptionsFilter
        emptyText="沒有符合的選項"
        fullWidth
        keepSearchTextOnBlur
        menuMaxHeight={200}
        mode="single"
        onSearch={handleSearch}
        options={options}
        placeholder="輸入後失焦仍保留文字"
        onSearchTextChange={handleSearchTextChange}
      />
      <AutoComplete
        disabledOptionsFilter
        emptyText="沒有符合的選項"
        fullWidth
        menuMaxHeight={200}
        mode="single"
        onSearch={handleSearch}
        options={options}
        placeholder="既有行為（失焦清空）"
        size="sub"
      />
    </div>
  );
};

export const KeepSearchTextOnBlur: StoryObj<typeof AutoComplete> = {
  render: () => <KeepSearchTextOnBlurComponent />,
};

const MultipleComponent = () => {
  const [selections, setSelections] = useState<SelectValue[]>([]);

  return (
    <div
      style={{
        display: 'inline-grid',
        gridTemplateColumns: 'repeat(2, 500px)',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <AutoComplete
        fullWidth
        mode="multiple"
        onChange={(newOptions) => setSelections(newOptions)}
        options={originOptions}
        placeholder="Placeholder"
        required
        value={selections}
      />
    </div>
  );
};

export const Multiple: StoryObj<typeof AutoComplete> = {
  render: () => <MultipleComponent />,
};

const CreatableSingleComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);
  const [selection, setSelection] = useState<SelectValue | null>(null);
  const nextIdRef = useRef(originOptions.length + 1);

  const handleInsert = useCallback(
    (text: string, currentOptions: SelectValue[]): SelectValue[] => {
      const newOption: SelectValue = {
        id: `new-${nextIdRef.current++}`,
        name: text,
      };
      const updatedOptions = [...currentOptions, newOption];

      setOptions(updatedOptions);

      return updatedOptions;
    },
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '400px',
      }}
    >
      <div>
        <h3>單選模式 - 可新增選項</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          輸入文字後按 Enter 或點擊 + 號新增選項
        </p>
        <AutoComplete
          addable
          disabledOptionsFilter
          fullWidth
          mode="single"
          onChange={setSelection}
          onInsert={handleInsert}
          options={options}
          placeholder="輸入文字新增選項..."
          value={selection}
        />
      </div>
      <div>
        <p>已選擇: {selection?.name || '無'}</p>
        <p>選項數量: {options.length}</p>
      </div>
    </div>
  );
};

export const CreatableSingle: StoryObj<typeof AutoComplete> = {
  render: () => <CreatableSingleComponent />,
};

const CreatableMultipleComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);
  const [selections, setSelections] = useState<SelectValue[]>([]);
  const nextIdRef = useRef(originOptions.length + 1);

  const handleInsert = useCallback(
    (text: string, currentOptions: SelectValue[]): SelectValue[] => {
      const newOption: SelectValue = {
        id: `new-${nextIdRef.current++}`,
        name: text,
      };
      const updatedOptions = [...currentOptions, newOption];

      setOptions(updatedOptions);

      return updatedOptions;
    },
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        maxWidth: '500px',
      }}
    >
      <div>
        <h3>多選模式 - 可新增選項</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          輸入文字後按 Enter 或點擊 + 號新增選項
        </p>
        <AutoComplete
          addable
          disabledOptionsFilter
          fullWidth
          mode="multiple"
          onChange={setSelections}
          onInsert={handleInsert}
          options={options}
          placeholder="輸入文字新增選項..."
          value={selections}
        />
      </div>
      <div>
        <p>已選擇數量: {selections.length}</p>
        <p>選項數量: {options.length}</p>
      </div>
    </div>
  );
};

export const CreatableMultiple: StoryObj<typeof AutoComplete> = {
  render: () => <CreatableMultipleComponent />,
};

const BulkCreateComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);
  const [selections, setSelections] = useState<SelectValue[]>([]);
  const nextIdRef = useRef(originOptions.length + 1);

  const handleInsert = useCallback(
    (text: string, currentOptions: SelectValue[]): SelectValue[] => {
      const newOption: SelectValue = {
        id: `new-${nextIdRef.current++}`,
        name: text,
      };
      const updatedOptions = [...currentOptions, newOption];

      setOptions(updatedOptions);

      return updatedOptions;
    },
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '600px',
      }}
    >
      <div>
        <h3>批次新增</h3>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
          <p>功能：</p>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li>
              使用分隔字元批次新增：輸入 &quot;Apple, Banana, Cherry&quot; 或
              &quot;Apple+Banana+Cherry&quot;
            </li>
            <li>按 Enter 新增：輸入文字後按 Enter 鍵</li>
            <li>
              貼上批次新增：貼上包含分隔字元的文字（如 &quot;Item1, Item2,
              Item3&quot;）
            </li>
            <li>自動去除前後空白</li>
            <li>避免重複新增</li>
            <li>自動清理未選擇的新增選項</li>
          </ul>
        </div>
        <AutoComplete
          addable
          createSeparators={[',', '+', '\n']}
          disabledOptionsFilter
          fullWidth
          mode="multiple"
          onChange={setSelections}
          onInsert={handleInsert}
          options={options}
          placeholder="試試輸入: Apple, Banana, Cherry 或 Apple+Banana+Cherry"
          trimOnCreate
          value={selections}
        />
      </div>
      <div
        style={{
          padding: '12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>狀態：</p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          已選擇: {selections.length} 個項目
        </p>
        <p style={{ margin: '4px 0', fontSize: '14px' }}>
          總選項數: {options.length}
        </p>
        {selections.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>
              已選擇的項目：
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {selections.map((item) => (
                <span
                  key={item.id}
                  style={{
                    padding: '2px 8px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const BulkCreate: StoryObj<typeof AutoComplete> = {
  render: () => <BulkCreateComponent />,
};

const InputPositionInsideComponent = () => {
  const [selection, setSelection] = useState<SelectValue | null>(null);
  const [open, setOpen] = useState(false);

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
        <h3>輸入框在內部</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          點擊 Button 展開 AutoComplete，輸入框會顯示在下拉選單內部
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: 'column' }}>
          <Tag
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
              setOpen(!open);
            }}
            type="addable"
            label={open ? '收起選單' : '展開選單'}
          />
          <div style={{ flex: 1 }}>
            <AutoComplete
              fullWidth
              inputPosition="inside"
              mode="single"
              onChange={setSelection}
              onVisibilityChange={setOpen}
              open={open}
              options={originOptions}
              placeholder="請選擇或輸入..."
              value={selection}
            />
          </div>
        </div>
      </div>
      <div>
        <p>已選擇: {selection?.name || '無'}</p>
      </div>
    </div>
  );
};

export const InputPositionInside: StoryObj<typeof AutoComplete> = {
  render: () => <InputPositionInsideComponent />,
};

const LoadMoreOnReachBottomComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(() =>
    originOptions.slice(0, 5)
  );
  const [value, setValue] = useState<SelectValue | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    // 模擬異步加載數據
    setTimeout(() => {
      const currentCount = options.length;
      const nextBatch = originOptions.slice(currentCount, currentCount + 5);

      if (nextBatch.length === 0) {
        setHasMore(false);
      } else {
        setOptions((prev) => [...prev, ...nextBatch]);
      }

      setLoading(false);
      setHasReachedBottom(false);
    }, 1000);
  }, [loading, hasMore, options.length]);

  const handleReachBottom = useCallback(() => {
    if (!hasReachedBottom && !loading && hasMore) {
      setHasReachedBottom(true);
      loadMore();
    }
  }, [hasReachedBottom, loading, hasMore, loadMore]);

  const handleLeaveBottom = useCallback(() => {
    setHasReachedBottom(false);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
      <Tag label={`已載入 ${options.length} / ${originOptions.length} 個選項`} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <AutoComplete
          disabledOptionsFilter
          emptyText="沒有符合的選項"
          fullWidth
          loading={loading}
          loadingText="載入中..."
          menuMaxHeight={120}
          mode="single"
          onReachBottom={handleReachBottom}
          onLeaveBottom={handleLeaveBottom}
          onChange={setValue}
          options={options}
          placeholder="請選擇或輸入..."
          value={value}
        />
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {loading && <div>正在載入更多選項...</div>}
        {!hasMore && <div>已載入所有選項</div>}
      </div>
      {value && (
        <div style={{ fontSize: '12px', color: '#666' }}>
          已選擇: {value.name}
        </div>
      )}
    </div>
  );
};

export const LoadMoreOnReachBottom: StoryObj<typeof AutoComplete> = {
  render: () => <LoadMoreOnReachBottomComponent />,
};