import type { AnchorItemData } from './anchor-item.types';

export interface AnchorGroupProps {
  /**
   * The anchors to render. When omitted, the default slot is parsed for
   * `MznAnchor` children instead.
   */
  anchors?: AnchorItemData[];
}
