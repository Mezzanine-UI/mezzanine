import { useTableRowSelection } from './use-table-row-selection';

interface Row extends Record<string, unknown> {
  key: string;
  subData?: Row[];
}

const parentA: Row = { key: 'a', subData: [{ key: 'a1' }, { key: 'a2' }] };
const parentB: Row = { key: 'b' };

const setup = () =>
  useTableRowSelection<Row>({ getSubData: (record) => record.subData });

describe('useTableRowSelection', () => {
  it('should start with nothing selected', () => {
    const { parentSelectedKeys, totalSelectionCount } = setup();

    expect(parentSelectedKeys.value).toEqual([]);
    expect(totalSelectionCount.value).toBe(0);
  });

  it('should take every sub key when a parent is selected', () => {
    const { getChildSelectedRowKeys, parentOnChange, parentSelectedKeys } =
      setup();

    parentOnChange?.(['a'], parentA, [parentA]);

    expect(parentSelectedKeys.value).toEqual(['a']);
    expect(getChildSelectedRowKeys(parentA)).toEqual(['a1', 'a2']);
  });

  it('should take every sub key of every row on select-all', () => {
    const { parentOnChange, totalSelectionCount } = setup();

    // `selectedRow` is null when the header's select-all fires.
    parentOnChange?.(['a', 'b'], null, [parentA, parentB]);

    // two parents plus a's two children
    expect(totalSelectionCount.value).toBe(4);
  });

  it('should report a parent as indeterminate while only some children are selected', () => {
    const { getChildOnChange, parentGetCheckboxProps } = setup();

    getChildOnChange(parentA)?.(['a1'], null, []);

    expect(parentGetCheckboxProps?.(parentA)).toEqual({
      indeterminate: true,
      selected: false,
    });
  });

  it('should report a parent as selected once every child is', () => {
    const { getChildOnChange, parentGetCheckboxProps } = setup();

    getChildOnChange(parentA)?.(['a1', 'a2'], null, []);

    expect(parentGetCheckboxProps?.(parentA)).toEqual({
      indeterminate: false,
      selected: true,
    });
  });

  it('should say nothing about a row that has no children', () => {
    expect(setup().parentGetCheckboxProps?.(parentB)).toEqual({});
  });

  it('should forget a parent once its children are all cleared', () => {
    const { getChildOnChange, parentSelectedKeys } = setup();

    getChildOnChange(parentA)?.(['a1'], null, []);

    expect(parentSelectedKeys.value).toEqual(['a']);

    getChildOnChange(parentA)?.([], null, []);

    expect(parentSelectedKeys.value).toEqual([]);
  });

  it('should keep the sub keys of the parents the caller did not touch', () => {
    const { getChildOnChange, getChildSelectedRowKeys, parentOnChange } =
      setup();

    getChildOnChange(parentA)?.(['a1'], null, []);
    parentOnChange?.(['a', 'b'], parentB, [parentA, parentB]);

    expect(getChildSelectedRowKeys(parentA)).toEqual(['a1']);
  });
});
