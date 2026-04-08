import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { navigationIconButtonClasses as classes } from '@mezzanine-ui/core/navigation';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 導覽列圖示按鈕元件。
 *
 * @example
 * ```html
 * <mzn-navigation-icon-button [icon]="someIcon" [active]="true" />
 * ```
 */
@Component({
  selector: 'mzn-navigation-icon-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button type="button">
      <i mznIcon [icon]="icon()" [size]="16"></i>
    </button>
  `,
})
export class MznNavigationIconButton {
  /**
   * 是否為啟用狀態。
   * @default false
   */
  readonly active = input(false);

  /** 圖示。 */
  readonly icon = input.required<IconDefinition>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.active]: this.active(),
    }),
  );
}
