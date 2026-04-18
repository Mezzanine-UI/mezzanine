import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
} from '@angular/core';
import type { ModalSize } from '@mezzanine-ui/core/modal';
import {
  CropperModalConfirmContext,
  CropperPropsBase,
  MznCropperModal,
} from './cropper-modal.component';

/** `MznCropperModalService.open()` 的結果。`null` 代表使用者取消或關閉。 */
export type CropperModalResult = CropperModalConfirmContext;

/** `MznCropperModalService.open()` 的參數。 */
export interface CropperModalOpenOptions {
  readonly cancelText?: string;
  readonly confirmText?: string;
  readonly cropperContentClassName?: string;
  readonly cropperProps?: CropperPropsBase;
  readonly dialogStyle?: Record<string, string>;
  readonly disableCloseOnBackdropClick?: boolean;
  readonly disableCloseOnEscapeKeyDown?: boolean;
  readonly fullScreen?: boolean;
  readonly loading?: boolean;
  readonly onCancel?: () => void;
  readonly onClose?: () => void;
  readonly onConfirm?: (
    context: CropperModalConfirmContext,
  ) => void | Promise<void>;
  readonly showModalFooter?: boolean;
  readonly showModalHeader?: boolean;
  readonly size?: ModalSize;
  readonly supportingText?: string;
  readonly title?: string;
}

const EXIT_ANIMATION_MS = 300;

/**
 * Cropper Modal 的 imperative 開啟 API。
 *
 * 對應 React `CropperModal.open(options): Promise<result>`。內部透過
 * `createComponent` 動態掛載 `MznCropperModal` 至 `document.body`，
 * 使用者確認時以 Promise 解析 `{canvas, cropArea, imageSrc}`，
 * 取消或關閉時解析為 `null`。
 *
 * @example
 * ```ts
 * import { MznCropperModalService, cropToDataURL } from '@mezzanine-ui/ng/cropper';
 *
 * const modal = inject(MznCropperModalService);
 * const result = await modal.open({
 *   title: '裁切頁首圖片',
 *   cropperProps: { imageSrc: file, aspectRatio: 4 / 3 },
 * });
 * if (result) {
 *   const dataUrl = await cropToDataURL(result);
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class MznCropperModalService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  /**
   * 開啟裁切 Modal。回傳 Promise：使用者確認時 resolve 為裁切上下文，
   * 取消或關閉時 resolve 為 `null`。
   */
  open(options: CropperModalOpenOptions): Promise<CropperModalResult | null> {
    return new Promise<CropperModalResult | null>((resolve) => {
      const ref = createComponent(MznCropperModal, {
        environmentInjector: this.injector,
      });
      const host = ref.location.nativeElement as HTMLElement;
      document.body.appendChild(host);
      this.appRef.attachView(ref.hostView);

      let resolved = false;
      let destroyed = false;

      const destroy = (): void => {
        if (destroyed) return;
        destroyed = true;
        this.appRef.detachView(ref.hostView);
        ref.destroy();
        if (host.parentNode) {
          host.parentNode.removeChild(host);
        }
      };

      const resolveOnce = (result: CropperModalResult | null): void => {
        if (resolved) return;
        resolved = true;
        resolve(result);
        ref.setInput('open', false);
        setTimeout(destroy, EXIT_ANIMATION_MS);
      };

      const passthroughKeys: ReadonlyArray<keyof CropperModalOpenOptions> = [
        'cancelText',
        'confirmText',
        'cropperContentClassName',
        'cropperProps',
        'dialogStyle',
        'disableCloseOnBackdropClick',
        'disableCloseOnEscapeKeyDown',
        'fullScreen',
        'loading',
        'showModalFooter',
        'showModalHeader',
        'size',
        'supportingText',
        'title',
      ];

      for (const key of passthroughKeys) {
        const value = options[key];
        if (value !== undefined) {
          ref.setInput(key, value);
        }
      }
      ref.setInput('open', true);

      ref.instance.confirmed.subscribe(
        async (context: CropperModalConfirmContext): Promise<void> => {
          try {
            await options.onConfirm?.(context);
            resolveOnce(context);
          } catch (error) {
            console.error('MznCropperModalService onConfirm failed:', error);
            resolveOnce(null);
          }
        },
      );

      ref.instance.cancelled.subscribe((): void => {
        options.onCancel?.();
        resolveOnce(null);
      });

      ref.instance.closed.subscribe((): void => {
        options.onClose?.();
        resolveOnce(null);
      });
    });
  }
}
