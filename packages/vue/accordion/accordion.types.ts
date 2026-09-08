import type { AccordionTitleProps } from './accordion-title.types';

export interface AccordionProps {
  /**
   * The actions displayed on the right side of the accordion title. <br />
   * Only `Button` or `Dropdown` is allowed.
   */
  actions?: AccordionTitleProps['actions'];
  /**
   * If true, expands the accordion by default.
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * If true, the accordion will be displayed in a disabled state.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, expands the accordion, otherwise collapse it. Setting this prop enables control over the accordion.
   */
  expanded?: boolean;
  /**
   * The size of accordion.
   * @default 'main'
   */
  size?: 'main' | 'sub';
  /**
   * The title of accordion.
   */
  title?: string;
}
