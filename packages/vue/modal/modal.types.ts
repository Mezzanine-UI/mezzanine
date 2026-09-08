import type { VNodeChild } from 'vue';
import type {
  ModalSize,
  ModalStatusType,
  ModalType,
} from '@mezzanine-ui/core/modal';
import type { ModalContainerProps } from './modal-container.types';
import type { ModalFooterProps } from './modal-footer.types';
import type { ModalHeaderProps } from './modal-header.types';

/**
 * React 交叉出來的變體攤平成單一 interface。
 *
 * 三組判別各自成立：`modalType: 'extendedSplit'` 時左右內容必填、其餘型別禁止
 * 給；`showModalHeader` 為真時 `title` 必填、為假時禁止給；`showModalFooter`
 * 同樣決定 `confirmText` / `cancelText` / `showCancelButton` 能不能出現。
 * Vue 的 `defineProps` 解析這種 union 會得到無法使用的結果，因此全部列成選用的
 * prop。
 *
 * prop 名稱、型別與執行期行為都沒有變；失去的只是編譯期保證。
 */
export interface ModalProps
  extends ModalContainerProps,
    Omit<ModalFooterProps, 'cancelText' | 'confirmText' | 'showCancelButton'>,
    Pick<
      ModalHeaderProps,
      'statusTypeIconLayout' | 'supportingTextAlign' | 'titleAlign'
    > {
  /**
   * The custom class name applied to the modal container.
   */
  backdropClassName?: string;
  /**
   * The cancel button text of the modal footer.
   * Only used when `showModalFooter` is true.
   */
  cancelText?: VNodeChild;
  /**
   * The confirm button text of the modal footer.
   * Required when `showModalFooter` is true.
   */
  confirmText?: string;
  /**
   * Content for the left side in extendedSplit layout.
   * Required when `modalType` is 'extendedSplit'.
   */
  extendedSplitLeftSideContent?: VNodeChild;
  /**
   * Content for the right side in extendedSplit layout.
   * Required when `modalType` is 'extendedSplit'.
   */
  extendedSplitRightSideContent?: VNodeChild;
  /**
   * Controls which side the sidebar panel (narrow column with footer) appears on.
   * - `'left'`: sidebar on the left, wide content on the right
   * - `'right'`: wide content on the left, sidebar on the right
   * @default 'right'
   */
  extendedSplitSidebarPosition?: 'left' | 'right';
  /**
   * Whether to force full screen on any breakpoint.
   * @default false
   */
  fullScreen?: boolean;
  /**
   * Whether the modal is loading.
   * Controls the loading prop of confirm button in modal actions.
   * @default false
   */
  loading?: boolean;
  /**
   * Controls whether or not to display status icon before title.
   * Notice that giving a status will only display the regular title.
   * @default 'info'
   */
  modalStatusType?: ModalStatusType;
  /**
   * Controls the type/layout of the modal.
   * - 'standard': Default modal with body container
   * - 'extended': Modal with left and right content areas
   * - 'extendedSplit': Modal with split layout (footer inside left content)
   * - 'mediaPreview': Modal for media preview
   * - 'verification': Modal for verification flows
   * @default 'standard'
   */
  modalType?: ModalType;
  /**
   * Whether to show the cancel button of the modal footer.
   * Only used when `showModalFooter` is true.
   */
  showCancelButton?: boolean;
  /**
   * Controls whether or not to show dismiss button at top-end.
   * @default true
   */
  showDismissButton?: boolean;
  /**
   * Whether to show modal footer.
   * @default false
   */
  showModalFooter?: boolean;
  /**
   * Whether to show modal header.
   * @default false
   */
  showModalHeader?: boolean;
  /**
   * Whether to show status type icon.
   * @default false
   */
  showStatusTypeIcon?: boolean;
  /**
   * Controls the size of the modal.
   * For the extendedSplit type, only 'wide' is allowed.
   * @default 'regular'
   */
  size?: ModalSize;
  /**
   * Supporting text displayed below the title.
   */
  supportingText?: string;
  /**
   * The title of the modal header.
   * Required when `showModalHeader` is true.
   */
  title?: string;
}
