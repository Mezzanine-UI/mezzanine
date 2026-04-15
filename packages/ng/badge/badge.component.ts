import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  BadgeTextSize,
  BadgeVariant,
  badgeClasses as classes,
  badgePrefix,
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
 * 計數型徽章可設定 `overflowCount` 限制最大顯示數值；`count` 為 0 時徽章自動隱藏。
 * 使用 content projection 時（僅限 dot 型），徽章會以覆疊方式出現在子元素右上角；
 * 是否存在投影內容由元件自動偵測，不需手動設定。
 *
 * @example
 * ```html
 * import { MznBadge } from '@mezzanine-ui/ng/badge';
 *
 * <div mznBadge variant="count-alert" [count]="5"></div>
 * <div mznBadge variant="count-brand" [count]="120" [overflowCount]="99"></div>
 * <div mznBadge variant="dot-error">
 *   <i mznIcon [icon]="BellIcon"></i>
 * </div>
 * <div mznBadge variant="text-success" text="NEW"></div>
 * ```
 */
@Component({
  selector: 'div[mznBadge]',
  host: {
    '[class]': 'containerClasses()',
    '[attr.variant]': 'null',
    '[attr.count]': 'null',
    '[attr.overflowCount]': 'null',
    '[attr.size]': 'null',
    '[attr.text]': 'null',
    '[attr.className]': 'null',
  },
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    <span [class]="hostClasses()">{{ displayText() }}</span>
  `,
})
export class MznBadge {
  /** 徽章的視覺變體。 */
  readonly variant = input.required<BadgeVariant>();

  /** 計數型徽章的數字。 */
  readonly count = input<number>();

  /** 計數上限，超過時顯示 `{overflowCount}+`。 */
  readonly overflowCount = input<number>();

  /** 文字型或圓點帶文字徽章的尺寸。 */
  readonly size = input<BadgeTextSize>();

  /** 文字型或圓點帶文字徽章的文字內容。 */
  readonly text = input<string>();

  /** 自訂 CSS class，附加於內層 badge span 上。 */
  readonly className = input<string>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _hasChildren = signal(false);

  protected readonly isCountVariant = computed((): boolean =>
    COUNT_VARIANTS.includes(this.variant()),
  );

  protected readonly containerClasses = computed((): string =>
    classes.container(this._hasChildren()),
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

  constructor() {
    afterNextRender(() => {
      const host = this.elementRef.nativeElement;
      const detect = (): void => {
        const hasProjected = Array.from(host.children).some(
          (el) => !el.classList.contains(badgePrefix),
        );

        this._hasChildren.set(hasProjected);
      };

      detect();

      const observer = new MutationObserver(detect);

      observer.observe(host, { childList: true });
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
