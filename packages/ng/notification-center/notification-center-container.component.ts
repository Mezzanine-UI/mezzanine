import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  output,
  TemplateRef,
} from '@angular/core';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';
import { MznButton } from '@mezzanine-ui/ng/button';

const DEFAULT_MAX_VISIBLE_NOTIFICATIONS = 3;

/**
 * 通知 toast 堆疊容器，對齊 React `NotificationCenterContainer`。
 *
 * 當 `items.length > maxVisibleNotifications`（預設 3）時，會在可見項目
 * 後面渲染「查看更多」按鈕。點擊該按鈕會觸發 `viewAllClicked` 事件——
 * 典型用法是由上層清空 toast 堆疊並開啟 `MznNotificationCenterDrawer`。
 *
 * 每個 toast 的實際渲染由使用者透過 `<ng-template #itemTemplate let-item>`
 * 定義；Container 僅負責 slicing 與 overflow 按鈕，不綁死 item 型別。
 *
 * host 預設套用 `mzn-notification-center-root` class，取得與 React 完全
 * 一致的 `position: fixed` / top-right 定位與 `pointer-events` 級聯。
 *
 * @example
 * ```html
 * <div
 *   mznNotificationCenterContainer
 *   [items]="toasts()"
 *   (viewAllClicked)="onViewAll()"
 * >
 *   <ng-template #itemTemplate let-item>
 *     <div
 *       mznNotificationCenter
 *       type="notification"
 *       [severity]="item.severity"
 *       [title]="item.title"
 *       [description]="item.description"
 *       [reference]="item.key"
 *       (closed)="remove($event)"
 *     ></div>
 *   </ng-template>
 * </div>
 * ```
 */
@Component({
  selector: '[mznNotificationCenterContainer]',
  standalone: true,
  imports: [NgTemplateOutlet, MznButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.items]': 'null',
    '[attr.maxVisibleNotifications]': 'null',
    '[attr.viewAllButtonText]': 'null',
  },
  template: `
    @for (item of visibleItems(); track item.key ?? $index) {
      <ng-container
        [ngTemplateOutlet]="itemTemplate()"
        [ngTemplateOutletContext]="{ $implicit: item }"
      />
    }
    @if (hasOverflow()) {
      <div [class]="viewAllButtonClass">
        <button
          mznButton
          variant="base-secondary"
          size="main"
          [class]="viewAllButtonTextClass"
          (click)="viewAllClicked.emit()"
        >
          {{ viewAllButtonText() }}
        </button>
      </div>
    }
  `,
})
export class MznNotificationCenterContainer<
  T extends { readonly key?: string | number },
> {
  /** Toast 項目集合；順序決定顯示順序。 */
  readonly items = input.required<ReadonlyArray<T>>();

  /**
   * 最多顯示的 toast 數量，超過時會顯示「查看更多」按鈕。
   * @default 3
   */
  readonly maxVisibleNotifications = input<number>(
    DEFAULT_MAX_VISIBLE_NOTIFICATIONS,
  );

  /**
   * 「查看更多」按鈕文字。
   * @default '查看更多'
   */
  readonly viewAllButtonText = input<string>('查看更多');

  /**
   * 「查看更多」按鈕被點擊時觸發；通常搭配清空 toast 並開啟 drawer 使用。
   */
  readonly viewAllClicked = output<void>();

  /** 使用者提供的單項 toast 樣板。 */
  protected readonly itemTemplate =
    contentChild.required<TemplateRef<{ $implicit: T }>>('itemTemplate');

  protected readonly hostClass = classes.root;
  protected readonly viewAllButtonClass = classes.viewAllButton;
  protected readonly viewAllButtonTextClass = classes.viewAllButtonText;

  protected readonly visibleItems = computed(
    (): ReadonlyArray<T> =>
      this.items().slice(0, this.maxVisibleNotifications()),
  );

  protected readonly hasOverflow = computed(
    (): boolean => this.items().length > this.maxVisibleNotifications(),
  );
}
