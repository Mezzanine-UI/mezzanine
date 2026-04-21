import { computed, Directive, input } from '@angular/core';
import {
  cropperClasses as classes,
  CropperSize,
} from '@mezzanine-ui/core/cropper';
import clsx from 'clsx';

/**
 * Cropper 容器 directive，提供語意化的 `<div class="mzn-cropper">` shell。
 *
 * 對應 React `<Cropper component="div">`。本身不帶任何互動邏輯，
 * 實際的裁切功能由子 `MznCropperElement` 或 `MznCropperModal` 提供。
 *
 * @example
 * ```html
 * import { MznCropper, MznCropperElement } from '@mezzanine-ui/ng/cropper';
 *
 * <div mznCropper size="main">
 *   <div mznCropperElement imageSrc="..."></div>
 * </div>
 * ```
 *
 * @see MznCropperElement
 */
@Directive({
  selector: '[mznCropper]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[attr.size]': 'null',
  },
})
export class MznCropper {
  /**
   * 元件尺寸。
   * @default 'main'
   */
  readonly size = input<CropperSize>('main');

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size())),
  );
}
