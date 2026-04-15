import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MZN_TABS_CONTEXT, TabsContext } from './tab-context';

/**
 * 單一 Tab 項目。
 *
 * 由父 `MznTabs` 的 `activeKey` 決定是否為使用中狀態。
 *
 * @example
 * ```html
 * <button mznTabItem [key]="0">Tab 1</button>
 * <button mznTabItem [key]="1" [badgeCount]="99">通知</button>
 * ```
 */
@Component({
  selector: '[mznTabItem]',
  standalone: true,
  imports: [MznIcon, MznBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    style: 'display: contents',
    '[attr.key]': 'null',
    '[attr.badgeCount]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.icon]': 'null',
  },
  template: `
    <button
      #buttonEl
      type="button"
      [class]="hostClasses()"
      [disabled]="disabled()"
      [attr.aria-disabled]="disabled()"
      (click)="onTabClick()"
    >
      @if (icon()) {
        <i mznIcon [icon]="icon()!" [class]="iconClass" [size]="16"></i>
      }
      <ng-content />
      @if (badgeCount() !== undefined) {
        <div
          mznBadge
          [className]="badgeClass"
          [variant]="badgeCountVariant()"
          [count]="badgeCount()!"
        ></div>
      }
    </button>
  `,
})
export class MznTabItem {
  private readonly tabsContext = inject<TabsContext>(MZN_TABS_CONTEXT, {
    optional: true,
  });
  private readonly buttonRef =
    viewChild<ElementRef<HTMLButtonElement>>('buttonEl');

  /** Tab 的唯一識別 key。 */
  readonly key = input.required<string | number>();

  /** 徽章計數。顯示於 Tab 標籤右側，未設定時不顯示。 */
  readonly badgeCount = input<number | undefined>(undefined);

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 是否為錯誤狀態。 */
  readonly error = input(false);

  /** Tab 圖示。 */
  readonly icon = input<IconDefinition>();

  /** 點擊事件（供外部消費者監聽）。 */
  readonly clicked = output<void>();

  /** 是否為使用中（由父 Tabs 的 activeKey 決定）。 */
  protected readonly isActive = computed(
    (): boolean => this.tabsContext?.resolvedActiveKey() === this.key(),
  );

  /** 徽章 variant，根據 error/active 狀態決定顏色。 */
  protected readonly badgeCountVariant = computed(() => {
    if (this.error()) return 'count-alert' as const;
    if (this.isActive()) return 'count-brand' as const;
    return 'count-inactive' as const;
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.tabItem, {
      [classes.tabItemActive]: this.isActive(),
      [classes.tabItemError]: this.error(),
    }),
  );

  protected readonly iconClass = classes.tabItemIcon;
  protected readonly badgeClass = classes.tabItemBadge;

  /** 取得按鈕元素（供父元件計算 active bar 位置）。 */
  getButtonElement(): HTMLButtonElement | undefined {
    return this.buttonRef()?.nativeElement;
  }

  /** 處理點擊：通知父元件並發出事件。 */
  protected onTabClick(): void {
    if (this.disabled()) {
      return;
    }

    // Notify parent Tabs about the click
    if (this.tabsContext) {
      const items = this.tabsContext.tabItems();
      const index = items.indexOf(this);

      this.tabsContext.handleTabClick(this.key(), index);
    }

    // Also emit clicked output for external consumers
    this.clicked.emit();
  }
}
