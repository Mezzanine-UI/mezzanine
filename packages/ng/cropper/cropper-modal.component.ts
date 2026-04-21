import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  cropperClasses as classes,
  CropperSize,
} from '@mezzanine-ui/core/cropper';
import { modalClasses, type ModalSize } from '@mezzanine-ui/core/modal';
import clsx from 'clsx';
import {
  MznModal,
  MznModalFooter,
  MznModalHeader,
} from '@mezzanine-ui/ng/modal';
import { CropArea, MznCropperElement } from './cropper-element.component';

/**
 * Cropper modal 提供給 `MznCropperModalService.open()` 使用的裁切資料子集。
 * 對應 React `CropperPropsBase` 的資料部分（事件回呼改走 Angular output）。
 */
export interface CropperPropsBase {
  readonly aspectRatio?: number;
  readonly imageSrc?: string | File | Blob;
  readonly initialCropArea?: CropArea;
  readonly minHeight?: number;
  readonly minWidth?: number;
  readonly size?: CropperSize;
}

/** `MznCropperModal` 確認時回傳的裁切上下文。 */
export interface CropperModalConfirmContext {
  readonly canvas: HTMLCanvasElement | null;
  readonly cropArea: CropArea | null;
  readonly imageSrc?: string | File | Blob;
}

/**
 * 包裹 `MznCropperElement` 的 Modal 元件，對應 React `<CropperModal>`。
 *
 * 以 `MznModal` + `MznModalHeader` + `MznModalFooter` 組合 header/body/footer；
 * 使用者點擊確認時，`confirmed` output 回傳包含 `canvas`、`cropArea`、
 * `imageSrc` 的上下文，可直接餵給 `cropToBlob`/`cropToDataURL`。
 *
 * 常見用法為透過 `MznCropperModalService.open()` 的 imperative API 呼叫，
 * 該 service 會自動處理渲染與 Promise 回傳。
 *
 * @example
 * ```html
 * import { MznCropperModal } from '@mezzanine-ui/ng/cropper';
 *
 * <div mznCropperModal
 *   [open]="isOpen()"
 *   title="裁切頁首圖片"
 *   [cropperProps]="{ imageSrc: src, aspectRatio: 1 }"
 *   (confirmed)="onConfirm($event)"
 *   (cancelled)="isOpen.set(false)"
 *   (closed)="isOpen.set(false)"
 * ></div>
 * ```
 *
 * @see MznCropperModalService
 * @see MznCropperElement
 */
@Component({
  selector: '[mznCropperModal]',
  standalone: true,
  imports: [MznCropperElement, MznModal, MznModalFooter, MznModalHeader],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.cancelText]': 'null',
    '[attr.confirmText]': 'null',
    '[attr.cropperContentClassName]': 'null',
    '[attr.cropperProps]': 'null',
    '[attr.disableCloseOnBackdropClick]': 'null',
    '[attr.disableCloseOnEscapeKeyDown]': 'null',
    '[attr.fullScreen]': 'null',
    '[attr.loading]': 'null',
    '[attr.open]': 'null',
    '[attr.dialogStyle]': 'null',
    '[attr.showModalFooter]': 'null',
    '[attr.showModalHeader]': 'null',
    '[attr.size]': 'null',
    '[attr.supportingText]': 'null',
    '[attr.title]': 'null',
  },
  template: `
    <div
      mznModal
      modalType="standard"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick()"
      [disableCloseOnEscapeKeyDown]="disableCloseOnEscapeKeyDown()"
      [fullScreen]="fullScreen()"
      [loading]="loading()"
      [open]="open()"
      [showModalFooter]="showModalFooter()"
      [showModalHeader]="showModalHeader()"
      [size]="size()"
      [dialogStyle]="dialogStyle() ?? null"
      (closed)="closed.emit()"
    >
      @if (showModalHeader()) {
        <div
          mznModalHeader
          [title]="title()"
          [supportingText]="supportingText()"
        ></div>
      }

      <div [class]="bodyContainerClass">
        <div
          mznCropperElement
          [aspectRatio]="cropperAspectRatio()"
          [class]="contentClasses()"
          [imageSrc]="cropperImageSrc()"
          [initialCropArea]="cropperInitialCropArea()"
          [minHeight]="cropperMinHeight()"
          [minWidth]="cropperMinWidth()"
          [size]="cropperSize()"
          (cropChange)="handleCropChange($event)"
          (cropDragEnd)="cropDragEnd.emit($event)"
          (imageDragEnd)="imageDragEnd.emit()"
          (imageError)="imageError.emit($event)"
          (imageLoad)="imageLoad.emit()"
          (scaleChange)="scaleChange.emit($event)"
        ></div>
      </div>

      @if (showModalFooter()) {
        <div
          mznModalFooter
          [cancelText]="cancelText()"
          [confirmText]="confirmText()"
          (cancelled)="cancelled.emit()"
          (confirmed)="onConfirmClicked()"
        ></div>
      }
    </div>
  `,
})
export class MznCropperModal {
  /**
   * 取消按鈕文字。
   * @default '取消'
   */
  readonly cancelText = input('取消');

  /**
   * 確認按鈕文字。
   * @default '確認'
   */
  readonly confirmText = input('確認');

  /** 附加到 cropper content wrapper 的自訂 class。 */
  readonly cropperContentClassName = input<string>();

  /** Cropper 資料 props（imageSrc、aspectRatio 等）。 */
  readonly cropperProps = input<CropperPropsBase>();

  /**
   * 是否禁用點擊遮罩關閉。
   * @default false
   */
  readonly disableCloseOnBackdropClick = input(false);

  /**
   * 是否禁用 Escape 鍵關閉。
   * @default false
   */
  readonly disableCloseOnEscapeKeyDown = input(false);

  /**
   * 是否全螢幕。
   * @default false
   */
  readonly fullScreen = input(false);

  /**
   * 是否載入中。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 套用在 Modal dialog 節點上的 inline style（passthrough 到 MznModal.dialogStyle）。
   * 對應 React `ModalProps.style`，用於在 `size='wide'`（`width: max-content`）時
   * 鎖定固定寬度，例如 `{ width: '640px', maxWidth: '640px' }`。
   */
  readonly dialogStyle = input<Record<string, string>>();

  /**
   * 是否開啟 Modal。
   * @default false
   */
  readonly open = input(false);

  /**
   * 是否顯示底部操作列。
   * @default true
   */
  readonly showModalFooter = input(true);

  /**
   * 是否顯示標題列。
   * @default true
   */
  readonly showModalHeader = input(true);

  /**
   * Modal 尺寸。
   * @default 'wide'
   */
  readonly size = input<ModalSize>('wide');

  /** 輔助說明文字。 */
  readonly supportingText = input<string>();

  /**
   * 標題文字。
   * @default '圖片裁切'
   */
  readonly title = input('圖片裁切');

  /** 確認事件。 */
  readonly confirmed = output<CropperModalConfirmContext>();

  /** 取消事件。 */
  readonly cancelled = output<void>();

  /** 關閉事件（遮罩或 Escape 關閉）。 */
  readonly closed = output<void>();

  /** 裁切區域變更事件。 */
  readonly cropChange = output<CropArea>();

  /** 裁切區域拖曳結束事件。 */
  readonly cropDragEnd = output<CropArea>();

  /** 圖片拖曳結束事件。 */
  readonly imageDragEnd = output<void>();

  /** 圖片載入成功事件。 */
  readonly imageLoad = output<void>();

  /** 圖片載入失敗事件。 */
  readonly imageError = output<Error>();

  /** 縮放倍率變更事件。 */
  readonly scaleChange = output<number>();

  private readonly cropperEl = viewChild(MznCropperElement);
  private currentCropArea: CropArea | null = null;

  protected readonly bodyContainerClass = modalClasses.modalBodyContainer;

  protected readonly contentClasses = computed((): string =>
    clsx(classes.content, this.cropperContentClassName()),
  );

  protected readonly cropperAspectRatio = computed(
    (): number | undefined => this.cropperProps()?.aspectRatio,
  );

  protected readonly cropperImageSrc = computed(
    (): string | File | Blob | undefined => this.cropperProps()?.imageSrc,
  );

  protected readonly cropperInitialCropArea = computed(
    (): CropArea | undefined => this.cropperProps()?.initialCropArea,
  );

  protected readonly cropperMinHeight = computed(
    (): number => this.cropperProps()?.minHeight ?? 50,
  );

  protected readonly cropperMinWidth = computed(
    (): number => this.cropperProps()?.minWidth ?? 50,
  );

  protected readonly cropperSize = computed(
    (): CropperSize => this.cropperProps()?.size ?? 'main',
  );

  protected handleCropChange(area: CropArea): void {
    this.currentCropArea = area;
    this.cropChange.emit(area);
  }

  protected onConfirmClicked(): void {
    this.confirmed.emit({
      canvas: this.cropperEl()?.getCanvas() ?? null,
      cropArea: this.currentCropArea,
      imageSrc: this.cropperImageSrc(),
    });
  }
}
