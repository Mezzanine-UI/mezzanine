export interface AccordionGroupProps {
  /**
   * If true, only one accordion can be expanded at a time.
   * @default false
   */
  exclusive?: boolean;
  /**
   * The size of accordion group, which will be passed to each Accordion in the group.
   * @default 'main'
   */
  size?: 'main' | 'sub';
}
