import type { ModalProps } from '../modal/modal.types';
import type { CropArea, CropperPropsBase } from './cropper.types';

/**
 * What the confirm callback is handed: the canvas that was drawn on, the crop
 * rectangle in image pixel space, and the source the two refer to.
 */
export interface CropperModalConfirmContext {
  /** The canvas the cropper drew on, reusable as `cropToBlob`'s `canvas`. */
  canvas: HTMLCanvasElement | null;
  /** The crop rectangle, in image pixel space. */
  cropArea: CropArea | null;
  /** The image the crop rectangle belongs to. */
  imageSrc?: string | File | Blob;
}

export type CropperModalResult = CropperModalConfirmContext;

/**
 * 裁切對話框的 props。
 *
 * 除了下列自己的成員之外，其餘一律沿用 MznModal：版面固定是 standard，所以
 * `modalType` 與 extendedSplit 的三個 prop 不開放；`showCancelButton` 也不開放，
 * 取消鈕由 `cancelText` 決定。
 *
 * `onCancel` / `onClose` / `onConfirm` / `onBackdropClick` 都維持 prop 而不是
 * emit：`CropperModal.open()` 是把整份設定當成資料交出去的，emit 沒有辦法放進
 * 那個物件裡；`onConfirm` 另外還有回傳值會被讀取 —— 對話框會等它的 Promise
 * 完成才關閉。使用端仍然可以寫成監聽器（`@confirm`），Vue 會轉成同一個 prop。
 */
export interface CropperModalProps
  extends Omit<
    ModalProps,
    | 'confirmText'
    | 'extendedSplitLeftSideContent'
    | 'extendedSplitRightSideContent'
    | 'extendedSplitSidebarPosition'
    | 'modalType'
    | 'showCancelButton'
    | 'showModalFooter'
    | 'showModalHeader'
    | 'title'
  > {
  /**
   * The text for the confirm button.
   * @default '確認'
   */
  confirmText?: string;
  /**
   * Additional className for the cropper content wrapper.
   */
  cropperContentClassName?: string;
  /**
   * Props for the CropperElement component.
   */
  cropperProps?: CropperPropsBase;
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick?: (event: MouseEvent) => void;
  /**
   * Callback fired when the cancel button is clicked.
   */
  onCancel?: () => void;
  /**
   * Callback fired when the modal asks to be closed.
   */
  onClose?: () => void;
  /**
   * Callback fired when the confirm button is clicked.
   * Receives the cropping context with canvas, cropArea, and imageSrc.
   */
  onConfirm?: (context: CropperModalConfirmContext) => void | Promise<void>;
  /**
   * Whether to show the modal footer with confirm and cancel buttons.
   * @default true
   */
  showModalFooter?: boolean;
  /**
   * Whether to show the modal header.
   * @default true
   */
  showModalHeader?: boolean;
  /**
   * The title of the modal header.
   * @default '圖片裁切'
   */
  title?: string;
}

export type CropperModalOpenOptions = Omit<CropperModalProps, 'open'>;
