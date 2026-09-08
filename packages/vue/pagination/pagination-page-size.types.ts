export interface PaginationPageSizeProps {
  /**
   * If `true`, the pagination page size fields are disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Label displayed before select.
   */
  label?: string;
  /**
   * Options for select component.
   * @default [10, 20, 50, 100]
   */
  options?: number[];
  /**
   * Callback to render custom option name.
   * @param pageSize The page size value.
   * @default (p) => `${p}`
   */
  renderOptionName?: (pageSize: number) => string;
  /**
   * Current page size value.
   */
  value?: number;
}
