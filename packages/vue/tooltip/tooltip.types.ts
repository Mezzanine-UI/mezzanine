import type { ComponentPublicInstance } from 'vue';
import type { PopperProps } from '../popper/popper.types';

/**
 * The payload handed to the default slot. Spread all of it onto the trigger
 * element: the mouse handlers drive the pointer flow, `onFocus`/`onBlur` make
 * the tooltip reachable by keyboard, `ref` anchors the popper, and
 * `aria-describedby` exposes the tooltip content to assistive tech while it is
 * open.
 */
export interface TooltipTriggerProps {
  /**
   * Id of the tooltip content node while it is open, otherwise `undefined`.
   */
  'aria-describedby': string | undefined;
  onBlur: () => void;
  onFocus: (event: FocusEvent) => void;
  onMouseenter: (event: MouseEvent) => void;
  onMouseleave: () => void;
  ref: (element: Element | ComponentPublicInstance | null) => void;
}

export interface TooltipProps
  extends Omit<PopperProps, 'arrow' | 'disablePortal'> {
  /**
   * show arrow or not
   * @default true
   */
  arrow?: boolean;
  /**
   * Whether to disable portal. If true, it will be a normal component.
   * @default true
   */
  disablePortal?: boolean;
  /**
   * delay time to hide when mouse leave. unit: s.
   * @default 0.1
   */
  mouseLeaveDelay?: number;
  /**
   * Override tooltip distance to anchor on main axis. Unit: px.
   * @default value of spacing token `gap-base`
   */
  offsetMainAxis?: number;
  /**
   * title of tooltip. Use the `title` slot for anything richer than text.
   */
  title?: string;
}
