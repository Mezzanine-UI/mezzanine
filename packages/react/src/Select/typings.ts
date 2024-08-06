export interface SelectValue<T = string> {
  id: T;
  name: string;
}

export interface TreeSelectOption<T = string> extends SelectValue<T> {
  dynamicChildrenFetching?: boolean;
  siblings?: TreeSelectOption<T>[];
}

export interface SelectControl<T = string> {
  value: SelectValue<T>[] | SelectValue<T> | null;
  onChange: (
    v: SelectValue<T> | null,
  ) => SelectValue<T>[] | SelectValue<T> | null;
}
