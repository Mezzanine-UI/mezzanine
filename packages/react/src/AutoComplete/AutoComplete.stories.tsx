import { SearchIcon } from '@mezzanine-ui/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { AutoComplete } from '.';
import Button from '../Button';
import Icon from '../Icon';
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

const BasicComponent = () => {
  const [multipleSelections, setMultipleSelections] = useState<SelectValue[]>(
    [],
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(4, 240px)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <AutoComplete
          menuMaxHeight={140}
          options={originOptions}
          placeholder="單選"
          required
        />
        <AutoComplete
          menuMaxHeight={140}
          mode="multiple"
          onChange={setMultipleSelections}
          options={originOptions}
          placeholder="多選"
          required
          value={multipleSelections}
        />
        <AutoComplete
          error
          menuMaxHeight={140}
          options={originOptions}
          placeholder="錯誤"
          required
        />
        <AutoComplete
          disabled
          menuMaxHeight={140}
          options={originOptions}
          placeholder="已禁用"
          required
        />
      </div>
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(4, 240px)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <AutoComplete
          menuMaxHeight={140}
          options={originOptions}
          placeholder="單選"
          required
          size="sub"
        />
        <AutoComplete
          menuMaxHeight={140}
          mode="multiple"
          onChange={setMultipleSelections}
          options={originOptions}
          placeholder="多選"
          required
          size="sub"
          value={multipleSelections}
        />
        <AutoComplete
          error
          menuMaxHeight={140}
          options={originOptions}
          placeholder="錯誤"
          required
          size="sub"
        />
        <AutoComplete
          disabled
          menuMaxHeight={140}
          options={originOptions}
          placeholder="已禁用"
          required
          size="sub"
        />
      </div>
      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: 'repeat(4, 240px)',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <AutoComplete
          menuMaxHeight={140}
          mode="single"
          options={originOptions}
          placeholder="單選"
          prefix={<Icon icon={SearchIcon} />}
          required
        />
        <AutoComplete
          menuMaxHeight={140}
          mode="single"
          size="sub"
          options={originOptions}
          placeholder="單選 sub 尺寸"
          prefix={<Icon icon={SearchIcon} />}
          required
        />
        <AutoComplete
          menuMaxHeight={140}
          mode="multiple"
          onChange={setMultipleSelections}
          options={originOptions}
          placeholder="多選"
          prefix={<Icon icon={SearchIcon} />}
          required
          value={multipleSelections}
        />
        <AutoComplete
          menuMaxHeight={140}
          mode="multiple"
          onChange={setMultipleSelections}
          options={originOptions}
          size="sub"
          placeholder="多選 sub 尺寸"
          prefix={<Icon icon={SearchIcon} />}
          required
          value={multipleSelections}
        />
      </div>
    </div>
  );
};

export const Basic: StoryObj<typeof AutoComplete> = {
  render: () => <BasicComponent />,
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
          opt.name.toLowerCase().includes(search.toLowerCase()),
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
      opt.name.toLowerCase().includes(search.toLowerCase()),
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
  const [multipleAutoClearSelections, setMultipleAutoClearSelections] =
    useState<SelectValue[]>([]);
  const [singleOptions, setSingleOptions] =
    useState<SelectValue[]>(originOptions);
  const [multipleOptions, setMultipleOptions] =
    useState<SelectValue[]>(originOptions);
  const [multipleSelections, setMultipleSelections] = useState<SelectValue[]>(
    [],
  );

  const handleSingleSearch = useCallback((search: string) => {
    if (!search) {
      setSingleOptions(originOptions);
      return;
    }

    const filtered = originOptions.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()),
    );

    setSingleOptions(filtered);
  }, []);

  const handleMultipleSearch = useCallback((search: string) => {
    if (!search) {
      setMultipleOptions(originOptions);
      return;
    }

    const filtered = originOptions.filter((opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()),
    );

    setMultipleOptions(filtered);
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
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '800px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '16px' }}>單選模式</h3>
        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: 'repeat(2, 300px)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <AutoComplete
            clearSearchText={false}
            disabledOptionsFilter
            emptyText="沒有符合的選項"
            menuMaxHeight={200}
            mode="single"
            onSearch={handleSingleSearch}
            options={singleOptions}
            onSearchTextChange={handleSearchTextChange}
            placeholder="失焦後保留文字"
          />
          <AutoComplete
            disabledOptionsFilter
            emptyText="沒有符合的選項"
            menuMaxHeight={200}
            mode="single"
            onSearch={handleSingleSearch}
            options={singleOptions}
            placeholder="失焦後清空"
          />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '16px' }}>多選模式</h3>
        <div
          style={{
            display: 'inline-grid',
            gridTemplateColumns: 'repeat(2, 300px)',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <AutoComplete
            clearSearchText={false}
            disabledOptionsFilter
            emptyText="沒有符合的選項"
            menuMaxHeight={200}
            mode="multiple"
            onChange={setMultipleSelections}
            onSearch={handleMultipleSearch}
            onSearchTextChange={handleSearchTextChange}
            options={multipleOptions}
            placeholder="失焦後保留文字"
            value={multipleSelections}
          />
          <AutoComplete
            disabledOptionsFilter
            emptyText="沒有符合的選項"
            menuMaxHeight={200}
            mode="multiple"
            onChange={setMultipleAutoClearSelections}
            onSearch={handleMultipleSearch}
            onSearchTextChange={handleSearchTextChange}
            options={multipleOptions}
            placeholder="失焦後清空"
            value={multipleAutoClearSelections}
          />
        </div>
        {multipleSelections.length > 0 && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              已選擇 ({multipleSelections.length} 個):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {multipleSelections.map((item) => (
                <Tag key={item.id} label={item.name} size="sub" type="static" />
              ))}
            </div>
          </div>
        )}
      </div>
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

const OverflowStrategyComponent = () => {
  const [counterSelections, setCounterSelections] = useState<SelectValue[]>([]);
  const [wrapSelections, setWrapSelections] = useState<SelectValue[]>([]);

  // 創建足夠多的選項來觸發溢出
  const manyOptions: SelectValue[] = Array.from({ length: 20 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `選項 ${i + 1}`,
  }));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '800px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '16px' }}>Overflow Strategy: counter</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          當標籤過多時，會顯示部分標籤並用 &quot;+ N&quot; 計數器表示剩餘數量
        </p>
        <div style={{ maxWidth: '300px' }}>
          <AutoComplete
            disabledOptionsFilter
            mode="multiple"
            onChange={setCounterSelections}
            options={manyOptions}
            overflowStrategy="counter"
            placeholder="選擇多個選項..."
            value={counterSelections}
          />
        </div>
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          已選擇: {counterSelections.length} 個
        </p>
      </div>
      <div>
        <h3 style={{ marginBottom: '16px' }}>Overflow Strategy: wrap</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          當標籤過多時，會自動換行顯示所有標籤
        </p>
        <div style={{ maxWidth: '300px' }}>
          <AutoComplete
            disabledOptionsFilter
            mode="multiple"
            onChange={setWrapSelections}
            options={manyOptions}
            overflowStrategy="wrap"
            placeholder="選擇多個選項..."
            value={wrapSelections}
          />
        </div>
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          已選擇: {wrapSelections.length} 個
        </p>
      </div>
    </div>
  );
};

export const OverflowStrategy: StoryObj<typeof AutoComplete> = {
  render: () => <OverflowStrategyComponent />,
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

  const handleRemoveCreated = useCallback((cleanedOptions: SelectValue[]) => {
    setOptions(cleanedOptions);
  }, []);

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
          mode="single"
          onChange={setSelection}
          onInsert={handleInsert}
          onRemoveCreated={handleRemoveCreated}
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

  const handleRemoveCreated = useCallback((cleanedOptions: SelectValue[]) => {
    setOptions(cleanedOptions);
  }, []);

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
        <h3>inside 多選模式 - 單選風格 checked icon</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          下拉視覺採單選風格 checked icon，但行為仍可多選；建立項目維持 New 標記。
        </p>
        <AutoComplete
          addable
          mode="multiple"
          onChange={setSelections}
          onInsert={handleInsert}
          onRemoveCreated={handleRemoveCreated}
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

  const handleRemoveCreated = useCallback((cleanedOptions: SelectValue[]) => {
    setOptions(cleanedOptions);
  }, []);

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
              貼上後逐個確認：貼上如 &quot;Grid chart, Griddle, Grid&quot;
              時，輸入框保留字串，dropdown 僅顯示「建立 &quot;Grid chart&quot;」
            </li>
            <li>
              依序建立：點擊建立後只新增第一個項目，輸入框更新為剩餘字串，再建立下一筆
            </li>
            <li>已存在選項會從字串中濾除，不會重複顯示建立按鈕</li>
            <li>以第一個待建立字串過濾選項；無符合時顯示「沒有符合的項目」</li>
            <li>按 Enter 或點擊建立按鈕新增單筆</li>
            <li>自動去除前後空白、自動清理未選擇的新增選項</li>
          </ul>
        </div>
        <AutoComplete
          addable
          createSeparators={[',', '+', '\n']}
          emptyText="沒有符合的項目"
          mode="multiple"
          onChange={setSelections}
          onInsert={handleInsert}
          onRemoveCreated={handleRemoveCreated}
          options={options}
          placeholder="試試貼上: Grid chart, Griddle, Grid"
          stepByStepBulkCreate
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
            <p
              style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}
            >
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
  const [open, setOpen] = useState(true);
  const [options, setOptions] = useState<SelectValue[]>(originOptions);
  const [selections, setSelections] = useState<SelectValue[]>([originOptions[0]]);
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

  const handleRemoveCreated = useCallback((cleanedOptions: SelectValue[]) => {
    setOptions(cleanedOptions);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '200px',
      }}
    >
      <div>
        <h3>多選模式 - 可新增選項</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          輸入文字後按 Enter 或點擊 + 號新增選項
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            width: '100%',
            marginBlock: '8px',
          }}
        >
          {selections.map((selection) => (
            <Tag
              key={selection.id}
              label={selection.name}
              type="dismissable"
              onClose={() =>
                setSelections(selections.filter((s) => s.id !== selection.id))
              }
            />
          ))}
        </div>
        <Tag
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
          }}
          type="addable"
          label={open ? '收起選單' : '展開選單'}
        />
        <AutoComplete
          addable
          mode="multiple"
          inputPosition="inside"
          onChange={setSelections}
          onInsert={handleInsert}
          onRemoveCreated={handleRemoveCreated}
          onVisibilityChange={closeDropdown}
          options={options}
          open={open}
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

export const InputPositionInside: StoryObj<typeof AutoComplete> = {
  render: () => <InputPositionInsideComponent />,
};

const InsideBulkCreateComponent = () => {
  const [open, setOpen] = useState(true);
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

  const handleRemoveCreated = useCallback((cleanedOptions: SelectValue[]) => {
    setOptions(cleanedOptions);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '620px',
      }}
    >
      <div>
        <h3>inside 多選模式 - 單選風格 checked icon + step-by-step bulk create</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          貼上多個項目後，dropdown 只顯示第一個「建立」，點擊後再顯示下一個。
        </p>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '16px' }}>
          試試貼上：<code>Grid chart, Griddle, Grid</code>
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            width: '100%',
            marginBlock: '8px',
          }}
        >
          {selections.map((selection) => (
            <Tag
              key={selection.id}
              label={selection.name}
              type="dismissable"
              onClose={() =>
                setSelections(selections.filter((s) => s.id !== selection.id))
              }
            />
          ))}
        </div>

        <Tag
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
          }}
          type="addable"
          label={open ? '收起選單' : '展開選單'}
        />

        <AutoComplete
          addable
          createSeparators={[',', '+', '\n']}
          inputPosition="inside"
          mode="multiple"
          onChange={setSelections}
          onInsert={handleInsert}
          onRemoveCreated={handleRemoveCreated}
          onVisibilityChange={closeDropdown}
          options={options}
          open={open}
          placeholder="試試貼上..."
          stepByStepBulkCreate
          trimOnCreate
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

export const InsideBulkCreate: StoryObj<typeof AutoComplete> = {
  render: () => <InsideBulkCreateComponent />,
};

const InsideEmptyComponent = () => {
  const [open, setOpen] = useState(true);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '240px',
      }}
    >
      <div>
        <h3>inside 多選模式 - 單選風格 checked icon + empty</h3>
        <Tag
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
          }}
          type="addable"
          label={open ? '收起選單' : '展開選單'}
        />
        <AutoComplete
          emptyText="沒有符合的項目"
          inputPosition="inside"
          mode="multiple"
          open={open}
          onVisibilityChange={closeDropdown}
          options={[]}
          placeholder="沒有選項可選"
          value={[]}
        />
      </div>
    </div>
  );
};

export const InsideEmpty: StoryObj<typeof AutoComplete> = {
  render: () => <InsideEmptyComponent />,
};

const InsideLoadingComponent = () => {
  const [open, setOpen] = useState(true);

  const closeDropdown = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '240px',
      }}
    >
      <div>
        <h3>inside 多選模式 - 單選風格 checked icon + loading</h3>
        <Tag
          onMouseDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            setOpen(!open);
          }}
          type="addable"
          label={open ? '收起選單' : '展開選單'}
        />
        <AutoComplete
          emptyText="沒有符合的項目"
          inputPosition="inside"
          loading
          loadingPosition="full"
          loadingText="載入中..."
          mode="multiple"
          open={open}
          onVisibilityChange={closeDropdown}
          options={[]}
          placeholder="資料載入中..."
          value={[]}
        />
      </div>
    </div>
  );
};

export const InsideLoading: StoryObj<typeof AutoComplete> = {
  render: () => <InsideLoadingComponent />,
};

const LoadMoreOnReachBottomComponent = () => {
  const [options, setOptions] = useState<SelectValue[]>(() =>
    originOptions.slice(0, 5),
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 320,
      }}
    >
      <Tag
        label={`已載入 ${options.length} / ${originOptions.length} 個選項`}
      />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <AutoComplete
          disabledOptionsFilter
          emptyText="沒有符合的選項"
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

type SearchTextControlRef = {
  reset: () => void;
  setSearchText: Dispatch<SetStateAction<string>>;
};

const SearchTextControlRefComponent = () => {
  const setSearchTextControlRef = useRef<SearchTextControlRef | undefined>(
    undefined,
  );

  const [resetValue, setResetValue] = useState<SelectValue[]>([]);
  const resetControlRef = useRef<SearchTextControlRef | undefined>(undefined);

  const [submitValue, setSubmitValue] = useState<SelectValue[]>([]);
  const [submittedItems, setSubmittedItems] = useState<SelectValue[]>([]);
  const submitControlRef = useRef<SearchTextControlRef | undefined>(undefined);

  const handleSubmit = useCallback(() => {
    if (!submitValue.length) return;
    setSubmittedItems((prev) => [...prev, ...submitValue]);
    setSubmitValue([]);
    submitControlRef.current?.reset();
  }, [submitValue]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        maxWidth: '480px',
      }}
    >
      <div>
        <h3 style={{ marginBottom: '8px' }}>setSearchText — 只清空輸入文字</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          呼叫 <code>setSearchText(&apos;&apos;)</code>{' '}
          僅清除輸入框的搜尋文字，已選取的值與下拉選項狀態不受影響。
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <AutoComplete
              options={originOptions}
              placeholder="輸入後點擊清除文字"
              searchTextControlRef={setSearchTextControlRef}
            />
          </div>
          <Button
            variant="base-secondary"
            onClick={() => setSearchTextControlRef.current?.setSearchText('')}
          >
            清除文字
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '8px' }}>reset — 完整重置</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          呼叫 <code>reset()</code>{' '}
          同時清除搜尋文字、已選取的值與下拉選單狀態，等同回到初始狀態。
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <AutoComplete
              mode="multiple"
              onChange={setResetValue}
              options={originOptions}
              placeholder="選取後點擊重置"
              searchTextControlRef={resetControlRef}
              value={resetValue}
            />
          </div>
          <Button
            size="main"
            variant="base-secondary"
            onClick={() => {
              setResetValue([]);
              resetControlRef.current?.reset();
            }}
          >
            重置
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '8px' }}>Submit 流程</h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          選取後按下送出，呼叫 <code>reset()</code> 清除欄位並記錄已送出的項目。
        </p>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <AutoComplete
              mode="multiple"
              onChange={setSubmitValue}
              options={originOptions}
              placeholder="選取項目後送出"
              searchTextControlRef={submitControlRef}
              value={submitValue}
            />
          </div>
          <Button
            disabled={!submitValue.length}
            size="main"
            onClick={handleSubmit}
          >
            送出
          </Button>
        </div>
        {submittedItems.length > 0 && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              已送出 ({submittedItems.length} 個):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {submittedItems.map((item, index) => (
                <Tag
                  key={`${item.id}-${index}`}
                  label={item.name}
                  size="sub"
                  type="static"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchTextControlRef: StoryObj<typeof AutoComplete> = {
  render: () => <SearchTextControlRefComponent />,
};
