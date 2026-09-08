import type { VNodeChild } from 'vue';
import type { ButtonGroupProps } from '../button/button-group.types';

export interface AccordionActionsProps extends ButtonGroupProps {
  /**
   * The content of the component. <br />
   * Only `MznButton` or `MznDropdown` is allowed.
   *
   * Read when this object is handed to `MznAccordionTitle`'s `actions` prop,
   * which is the shape React gives it. Written as a component, put the buttons
   * in the default slot instead.
   */
  children?: VNodeChild;
}
