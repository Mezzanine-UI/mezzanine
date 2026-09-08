import type { VNode } from 'vue';

export interface SectionProps {
  /**
   * Accept a `MznContentHeader` element.
   * Other components will trigger a warning.
   *
   * A node rather than a slot, because React takes it as an element prop and
   * the contract counts it as an input.
   */
  contentHeader?: VNode;
  /**
   * Accept a `MznFilterArea` element.
   * Other components will trigger a warning.
   */
  filterArea?: VNode;
  /**
   * Accept a `MznTab` element.
   * Other components will trigger a warning.
   */
  tab?: VNode;
}
