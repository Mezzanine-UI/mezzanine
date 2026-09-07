import type { TagSize } from '@mezzanine-ui/core/tag';
import type { ElementGetter } from '../_internal/get-element';
import type { PopperPlacement } from '../popper/popper.types';

export interface OverflowTooltipProps {
  /**
   * Popper anchor that tells the tooltip which trigger element or DOM node to follow.
   */
  anchor: ElementGetter;
  /**
   * Controls whether the tooltip is rendered; true mounts the Popper and computes placement.
   */
  open: boolean;
  /**
   * Popper placement, allowing consumers to change the tooltip direction.
   * @default 'top-start'
   */
  placement?: PopperPlacement;
  /**
   * Read only state.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Size of tags.
   * @default 'main'
   */
  tagSize?: TagSize;
  /**
   * List of tag labels to render; each entry becomes a dismissable tag.
   */
  tags: string[];
}
