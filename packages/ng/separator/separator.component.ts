import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  SeparatorOrientation,
  separatorClasses as classes,
} from '@mezzanine-ui/core/separator';
import clsx from 'clsx';

/**
 * 水平或垂直分隔線元件。
 *
 * 透過 `orientation` 切換水平與垂直方向。
 * 垂直方向時會自動設置 `aria-orientation="vertical"` 以符合無障礙規範。
 *
 * @example
 * ```html
 * import { MznSeparator } from '@mezzanine-ui/ng/separator';
 *
 * <hr mznSeparator  />
 * <hr mznSeparator orientation="vertical"  />
 * ```
 */
@Component({
  selector: '[mznSeparator]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'separator',
    '[class]': 'hostClasses()',
    '[attr.aria-orientation]':
      'orientation() === "vertical" ? "vertical" : null',
  },
  template: '',
})
export class MznSeparator {
  /**
   * 分隔線方向。
   * @default 'horizontal'
   */
  readonly orientation = input<SeparatorOrientation>('horizontal');

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.horizontal]: this.orientation() === 'horizontal',
      [classes.vertical]: this.orientation() === 'vertical',
    }),
  );
}
