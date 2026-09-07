export interface PaginationJumperProps {
  /**
   * The text displayed in the `button` content.
   */
  buttonText?: string;
  /**
   * If `true`, the pagination jumper fields are disabled.
   */
  disabled?: true;
  /**
   * The hint text displayed in front of input.
   */
  hintText?: string;
  /**
   * The placeholder displayed in the input before the user enters a value.
   */
  inputPlaceholder?: string;
  /**
   * Number of items per page.
   * @default 5
   */
  pageSize?: number;
  /**
   * Total number of items.
   * @default 0
   */
  total?: number;
}
