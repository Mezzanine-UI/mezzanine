import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { cardClasses as classes } from '@mezzanine-ui/core/card';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';

/**
 * 快捷操作卡片元件，以圖示加標題呈現快速操作入口。
 *
 * 支援水平與垂直佈局模式，至少需提供 `icon` 或 `title` 其中之一。
 *
 * @example
 * ```html
 * import { MznQuickActionCard } from '@mezzanine-ui/ng/card';
 *
 * <mzn-quick-action-card [icon]="someIcon" title="新增項目" />
 * <mzn-quick-action-card title="設定" mode="vertical" />
 * ```
 */
@Component({
  selector: 'mzn-quick-action-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'disabled() || undefined',
    '[attr.aria-readonly]': 'readOnly() || undefined',
  },
  template: `
    @if (icon()) {
      <i mznIcon [class]="iconClass" [icon]="icon()!" [size]="24"></i>
    }
    @if (title() || subtitle()) {
      <div [class]="contentClass">
        @if (title()) {
          <span [class]="titleClass">{{ title() }}</span>
        }
        @if (subtitle()) {
          <span [class]="subtitleClass">{{ subtitle() }}</span>
        }
      </div>
    }
  `,
})
export class MznQuickActionCard {
  protected readonly iconClass = classes.quickActionIcon;
  protected readonly contentClass = classes.quickActionContent;
  protected readonly titleClass = classes.quickActionTitle;
  protected readonly subtitleClass = classes.quickActionSubtitle;

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /** 圖示。 */
  readonly icon = input<IconDefinition>();

  /**
   * 佈局模式。
   * @default 'horizontal'
   */
  readonly mode = input<'horizontal' | 'vertical'>('horizontal');

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readOnly = input(false);

  /** 副標題。 */
  readonly subtitle = input<string>();

  /** 標題。 */
  readonly title = input<string>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.quickAction, {
      [classes.quickActionDisabled]: this.disabled(),
      [classes.quickActionReadOnly]: this.readOnly(),
      [classes.quickActionVertical]: this.mode() === 'vertical',
    }),
  );
}
