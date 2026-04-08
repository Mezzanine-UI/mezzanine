import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import {
  BadgeTextSize,
  BadgeVariant,
  badgeClasses as classes,
} from '@mezzanine-ui/core/badge';
import clsx from 'clsx';

const COUNT_VARIANTS: readonly string[] = [
  'count-alert',
  'count-inactive',
  'count-inverse',
  'count-brand',
  'count-info',
];

/**
 * 徽章元件，用於顯示數字計數、狀態圓點或文字標籤。
 *
 * 透過 `variant` 切換顯示模式：`count-*` 顯示數字、`dot-*` 顯示狀態圓點、`text-*` 顯示文字標籤。
 * 計數型徽章可設定 `overflowCount` 限制最大顯示數值。
 * 使用 content projection 時，徽章會以覆疊方式出現在子元素右上角。
 *
 * @example
 * ```html
 * import { MznBadge } from '@mezzanine-ui/ng/badge';
 *
 * <mzn-badge variant="count-alert" [count]="5" />
 * <mzn-badge variant="count-brand" [count]="120" [overflowCount]="99" />
 * <mzn-badge variant="dot-error"><i mznIcon [icon]="BellIcon" ></i></mzn-badge>
 * <mzn-badge variant="text-brand" text="NEW" />
 * ```
 */
@Component({
  selector: 'mzn-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClasses()">
      <ng-content />
      <span [class]="hostClasses()">{{ displayText() }}</span>
    </div>
  `,
})
export class MznBadge {
  /** 徽章的視覺變體。 */
  readonly variant = input.required<BadgeVariant>();

  /** 計數型徽章的數字。 */
  readonly count = input<number>();

  /** 計數上限，超過時顯示 `{overflowCount}+`。 */
  readonly overflowCount = input<number>();

  /** 文字型徽章的尺寸。 */
  readonly size = input<BadgeTextSize>();

  /** 文字型或圓點帶文字徽章的文字內容。 */
  readonly text = input<string>();

  /** 是否有 projected content（由外部設定）。 */
  readonly hasChildren = input(false);

  /** 自訂 CSS class。 */
  readonly className = input<string>();

  protected readonly isCountVariant = computed((): boolean =>
    COUNT_VARIANTS.includes(this.variant()),
  );

  protected readonly containerClasses = computed((): string =>
    classes.container(this.hasChildren()),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.variant(this.variant()),
      {
        [classes.hide]: this.isCountVariant() && this.count() === 0,
      },
      this.size() && classes.size(this.size()!),
      this.className(),
    ),
  );

  protected readonly displayText = computed((): string | number => {
    if (this.isCountVariant()) {
      const count = this.count() ?? 0;
      const overflow = this.overflowCount();

      return overflow && count > overflow ? `${overflow}+` : count;
    }

    return this.text() ?? '';
  });
}
