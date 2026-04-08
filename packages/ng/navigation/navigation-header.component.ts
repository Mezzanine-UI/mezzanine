import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { navigationHeaderClasses as classes } from '@mezzanine-ui/core/navigation';
import { SiderIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  MZN_NAVIGATION_ACTIVATED,
  NavigationActivatedState,
} from './navigation-context';

/**
 * 導覽列標頭元件，含收合/展開切換按鈕與品牌區域。
 *
 * 透過 `title` 顯示導覽列名稱（收合時僅顯示第一個字元）。
 * 子內容（如 logo 圖示）透過 `<ng-content>` 插入品牌圖示區域。
 * `brandClick` 輸出可讓品牌區域具備點擊互動。
 *
 * @example
 * ```html
 * <mzn-navigation-header title="My App">
 *   <img src="logo.svg" alt="Logo" />
 * </mzn-navigation-header>
 * ```
 *
 * @see MznNavigation
 */
@Component({
  selector: 'mzn-navigation-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button
      type="button"
      [class]="iconButtonClass"
      (click)="onToggleCollapse()"
    >
      <i mznIcon [icon]="siderIcon" [size]="16"></i>
    </button>
    <span [class]="contentClass" (click)="brandClick.emit()">
      <span [class]="childrenWrapperClass">
        <ng-content />
      </span>
      <span [class]="titleClass">{{ displayTitle() }}</span>
    </span>
  `,
})
export class MznNavigationHeader {
  private readonly navState = inject<NavigationActivatedState>(
    MZN_NAVIGATION_ACTIVATED,
    { optional: true },
  );

  protected readonly siderIcon = SiderIcon;
  protected readonly contentClass = classes.content;
  protected readonly childrenWrapperClass = classes.childrenWrapper;
  protected readonly titleClass = classes.title;
  protected readonly iconButtonClass = 'mzn-navigation-icon-button';

  /**
   * 導覽列標題文字。收合時僅顯示第一個字元。
   */
  readonly title = input<string>();

  /** 品牌區點擊事件。 */
  readonly brandClick = output<void>();

  protected readonly isCollapsed = computed(
    (): boolean => this.navState?.collapsed ?? false,
  );

  protected readonly displayTitle = computed((): string => {
    const t = this.title() ?? '';
    return this.isCollapsed() ? (t[0] ?? '') : t;
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.collapsed]: this.isCollapsed(),
      [classes.hasChildren]: true,
    }),
  );

  protected onToggleCollapse(): void {
    if (this.navState) {
      this.navState.handleCollapseChange(!this.navState.collapsed);
    }
  }
}
