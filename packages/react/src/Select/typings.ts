export interface SelectValue {
  id: string;
  name: string;
}

export interface TreeSelectOption extends SelectValue {
  siblings?: TreeSelectOption[]
}

export interface SelectControl {
  value: SelectValue[] | SelectValue | null;
  onChange: (v: SelectValue | null) => SelectValue[] | SelectValue | null;
}
