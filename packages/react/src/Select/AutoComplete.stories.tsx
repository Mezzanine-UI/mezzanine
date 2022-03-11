
import { useState, useCallback } from 'react';
import {
  AutoComplete,
} from '.';
import { SelectValue } from './typings';

export default {
  title: 'Data Entry/AutoComplete',
};

const originOptions: SelectValue[] = [{
  id: 'item1',
  name: 'item1',
}, {
  id: 'item2',
  name: 'item2',
}, {
  id: 'item3',
  name: 'item3',
}, {
  id: 'foo',
  name: 'foo',
}, {
  id: 'bar',
  name: 'bar',
}, {
  id: 'bob',
  name: 'bob',
}, {
  id: 'apple',
  name: 'apple',
}, {
  id: 'very very very long',
  name: 'very very very long',
}];

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, 160px)',
      gap: '16px',
      alignItems: 'center',
    }}
  >
    <AutoComplete
      fullWidth
      required
      options={originOptions}
      placeholder="預設文字"
    />
    <AutoComplete
      error
      fullWidth
      required
      options={originOptions}
      placeholder="預設文字"
    />
    <AutoComplete
      disabled
      fullWidth
      required
      options={originOptions}
      placeholder="預設文字"
    />
  </div>
);

export const Multiple = () => {
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
        required
        mode="multiple"
        options={originOptions}
        onChange={(newOptions) => setSelections(newOptions)}
        value={selections}
        placeholder="新增關鍵字"
      />
    </div>
  );
};

export const FullyControlled = () => {
  const [selection, setSelection] = useState<SelectValue | null>(originOptions[0]);
  const [options, setOptions] = useState<SelectValue[]>(originOptions);
  const onSearch = useCallback((search: string) => {
    setOptions(originOptions.filter((opt) => !!opt.name.includes(search)));
  }, []);

  const onChange = useCallback((option: SelectValue | null) => {
    setSelection(option);
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
        fullWidth
        required
        options={options}
        value={selection}
        onChange={onChange}
        onSearch={onSearch}
        onClear={() => onChange(null)}
        placeholder="預設文字"
      />
      <span>
        {`current value: ${selection?.name || ''}`}
      </span>
    </div>
  );
};

export const Addable = () => {
  const [options, setOptions] = useState<SelectValue[]>(originOptions);
  const onInsert = useCallback((text: string) => {
    const newOption = {
      id: text,
      name: text,
    };

    setOptions((prevOptions) => ([
      ...prevOptions,
      newOption,
    ]));

    return newOption;
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
      <div>
        <p>Single</p>
        <AutoComplete
          addable
          fullWidth
          required
          options={options}
          onInsert={onInsert}
          placeholder="預設文字"
        />
      </div>
      <div>
        <p>Multiple</p>
        <AutoComplete
          addable
          fullWidth
          required
          mode="multiple"
          options={options}
          onInsert={onInsert}
          placeholder="新增關鍵字"
        />
      </div>
    </div>
  );
};
