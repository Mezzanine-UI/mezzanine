
import { useState, useCallback } from 'react';
import {
  AutoComplete,
} from '.';

export default {
  title: 'Data Entry/AutoComplete',
};

const originOptions: string[] = ['item1', 'item2', 'item3', 'foo', 'bar', 'bob', 'apple'];

export const Basic = () => (
  <div
    style={{
      display: 'inline-grid',
      gridTemplateColumns: 'repeat(2, 150px)',
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

export const FullyControlled = () => {
  const [selection, setSelection] = useState<string>('');
  const [options, setOptions] = useState<string[]>(originOptions);
  const onSearch = useCallback((search: string) => {
    setOptions(originOptions.filter((opt) => ~opt.search(search)));
  }, []);

  const onChange = useCallback((s: string) => {
    setSelection(s);
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
        onChange={onChange}
        onSearch={onSearch}
        placeholder="預設文字"
      />
      <span>
        {`current value: ${selection}`}
      </span>
    </div>
  );
};

export const Addable = () => {
  const [options, setOptions] = useState<string[]>(originOptions);
  const onInsert = useCallback((newOption: string) => {
    setOptions((prevOptions) => ([
      ...prevOptions,
      newOption,
    ]));

    return true;
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
        addable
        fullWidth
        required
        options={options}
        onInsert={onInsert}
        placeholder="預設文字"
      />
    </div>
  );
};
