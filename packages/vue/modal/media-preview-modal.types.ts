import type { VNodeChild } from 'vue';
import type { ModalContainerProps } from './modal-container.types';

export interface MediaPreviewModalProps extends ModalContainerProps {
  /**
   * The custom class name applied to the modal container.
   */
  backdropClassName?: string;
  /**
   * The current index of the media being displayed (controlled mode).
   * If provided along with `next` / `prev` listeners, the component operates in controlled mode.
   */
  currentIndex?: number;
  /**
   * The default index when the modal opens (uncontrolled mode).
   * @default 0
   */
  defaultIndex?: number;
  /**
   * Whether to disable the next navigation button.
   * @default false
   */
  disableNext?: boolean;
  /**
   * Whether to disable the previous navigation button.
   * @default false
   */
  disablePrev?: boolean;
  /**
   * Enable circular navigation (wrap around at boundaries).
   * When enabled, navigating past the last item goes to the first,
   * and navigating before the first item goes to the last.
   *
   * Note: This only applies in uncontrolled mode. In controlled mode
   * (when `next` / `prev` are listened to), you must implement circular
   * navigation logic in your handlers.
   * @default false
   */
  enableCircularNavigation?: boolean;
  /**
   * Array of media items to display.
   * Each item should be a valid image URL or a renderable node.
   */
  mediaItems: (string | VNodeChild)[];
  /**
   * Whether to show the pagination indicator.
   * @default true
   */
  showPaginationIndicator?: boolean;
}
