import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import {
  notificationClasses as classes,
  notificationIcons,
  NotificationSeverity,
} from '@mezzanine-ui/core/notification-center';
import { DrawerSize } from '@mezzanine-ui/core/drawer';
import { CloseIcon, NotificationIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznBadge } from '@mezzanine-ui/ng/badge';
import { NotificationItem } from './notification';

type TimeGroup = 'today' | 'yesterday' | 'past7Days' | 'earlier';

interface GroupedNotification {
  readonly group: TimeGroup;
  readonly groupLabel: string;
  readonly items: readonly NotificationItem[];
}

const TIME_GROUP_ORDER: ReadonlyArray<TimeGroup> = [
  'today',
  'yesterday',
  'past7Days',
  'earlier',
];

function getTimeGroup(timestamp: Date | undefined, now: Date): TimeGroup {
  if (!timestamp) return 'earlier';

  const nowStartOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const tsStartOfDay = new Date(
    timestamp.getFullYear(),
    timestamp.getMonth(),
    timestamp.getDate(),
  );

  if (tsStartOfDay.getTime() === nowStartOfDay.getTime()) {
    return 'today';
  }

  const yesterdayStartOfDay = new Date(nowStartOfDay);
  yesterdayStartOfDay.setDate(yesterdayStartOfDay.getDate() - 1);
  if (tsStartOfDay.getTime() === yesterdayStartOfDay.getTime()) {
    return 'yesterday';
  }

  const diffInDays =
    (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24);
  if (diffInDays <= 7) {
    return 'past7Days';
  }

  return 'earlier';
}

/**
 * 通知中心元件，提供通知列表面板與觸發按鈕。
 *
 * 透過 `notifications` 傳入通知項目陣列，元件會自動計算未讀數量並於觸發按鈕上顯示徽章。
 * 點擊觸發按鈕切換面板開關狀態，面板內依時間分組顯示通知（今天、昨天、過去七天、更早）。
 * 可透過 `filterBar*` 系列 inputs 啟用篩選列，以及透過標籤 inputs 自訂時間分組文字。
 *
 * @example
 * ```html
 * import { MznNotificationCenter } from '@mezzanine-ui/ng/notification-center';
 *
 * <mzn-notification-center
 *   [notifications]="items"
 *   [open]="isPanelOpen"
 *   title="通知中心"
 *   (openChange)="isPanelOpen = $event"
 *   (notificationClick)="onNotificationClick($event)"
 * />
 * ```
 *
 * @see MznIcon
 * @see MznBadge
 */
@Component({
  selector: 'mzn-notification-center',
  standalone: true,
  imports: [MznIcon, MznBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <button type="button" [class]="triggerClasses()" (click)="toggleOpen()">
      @if (unreadCount() > 0) {
        <mzn-badge
          variant="count-alert"
          [count]="unreadCount()"
          [overflowCount]="99"
          [hasChildren]="true"
        >
          <i mznIcon [icon]="notificationIcon"></i>
        </mzn-badge>
      } @else {
        <i mznIcon [icon]="notificationIcon"></i>
      }
    </button>

    @if (open()) {
      <div [class]="panelClasses()">
        <div [class]="toolbarClasses()">
          <span [class]="titleClasses()">{{ title() }}</span>
          <button
            type="button"
            [class]="closeIconClasses()"
            (click)="toggleOpen()"
          >
            <i mznIcon [icon]="closeIcon"></i>
          </button>
        </div>

        @if (notifications().length === 0) {
          <div [class]="emptyClasses()">
            {{ emptyNotificationTitle() }}
          </div>
        } @else {
          <div [class]="listClasses()">
            @for (group of groupedNotifications(); track group.group) {
              <span [class]="prependTipsClass">{{ group.groupLabel }}</span>
              @for (item of group.items; track item.id) {
                <button
                  type="button"
                  [class]="itemClasses(item.severity, item.read)"
                  (click)="onNotificationClick(item)"
                >
                  <div [class]="iconContainerClasses()">
                    @if (item.severity) {
                      <i
                        mznIcon
                        [icon]="severityIcon(item.severity)"
                        [class]="severityIconClasses()"
                      ></i>
                    }
                  </div>
                  <div [class]="bodyClasses()">
                    <div [class]="bodyContentClasses()">
                      <span [class]="itemTitleClasses()">{{ item.title }}</span>
                      @if (item.description) {
                        <span [class]="contentClasses()">{{
                          item.description
                        }}</span>
                      }
                    </div>
                    @if (item.timestamp) {
                      <span [class]="timeStampClasses()">{{
                        formatTimestamp(item.timestamp)
                      }}</span>
                    }
                  </div>
                </button>
              }
            }
          </div>
        }
      </div>
    }
  `,
})
export class MznNotificationCenter {
  /**
   * 面板寬度尺寸。
   * @default 'narrow'
   */
  readonly drawerSize = input<DrawerSize>('narrow');

  /**
   * 「更早」時間分組的標籤文字。
   * @default '更早'
   */
  readonly earlierLabel = input('更早');

  /**
   * 空通知狀態的描述文字。
   * @default '當有新的系統通知時，將會顯示在這裡。'
   */
  readonly emptyNotificationDescription =
    input('當有新的系統通知時，將會顯示在這裡。');

  /**
   * 空通知狀態的標題文字。
   * @default '目前沒有通知'
   */
  readonly emptyNotificationTitle = input('目前沒有通知');

  // Note: Filter bar inputs (filterBarShow, filterBarOptions, etc.) were
  // previously declared but never wired into the template. Removed in slice 5
  // deep audit to prevent deceptive API surface. Re-introduce together with
  // an actual filter bar template if/when needed.

  /** 通知項目陣列。 */
  readonly notifications = input<readonly NotificationItem[]>([]);

  /**
   * 面板是否開啟。
   * @default false
   */
  readonly open = input(false);

  /**
   * 「過去七天」時間分組的標籤文字。
   * @default '過去七天'
   */
  readonly past7DaysLabel = input('過去七天');

  /**
   * 面板標題。
   * @default '通知中心'
   */
  readonly title = input('通知中心');

  /**
   * 「今天」時間分組的標籤文字。
   * @default '今天'
   */
  readonly todayLabel = input('今天');

  /**
   * 「昨天」時間分組的標籤文字。
   * @default '昨天'
   */
  readonly yesterdayLabel = input('昨天');

  /** 當面板開關狀態變更時觸發。 */
  readonly openChange = output<boolean>();

  /** 當點擊通知項目時觸發。 */
  readonly notificationClick = output<NotificationItem>();

  protected readonly notificationIcon = NotificationIcon;
  protected readonly closeIcon = CloseIcon;
  protected readonly prependTipsClass = classes.prependTips;

  protected readonly unreadCount = computed(
    (): number => this.notifications().filter((n) => !n.read).length,
  );

  /** Notifications sorted newest-first, grouped by time. */
  protected readonly groupedNotifications = computed(
    (): readonly GroupedNotification[] => {
      const items = [...this.notifications()].sort((a, b) => {
        const aTime = a.timestamp?.getTime() ?? 0;
        const bTime = b.timestamp?.getTime() ?? 0;
        return bTime - aTime;
      });

      const now = new Date();
      const labels: Record<TimeGroup, string> = {
        today: this.todayLabel(),
        yesterday: this.yesterdayLabel(),
        past7Days: this.past7DaysLabel(),
        earlier: this.earlierLabel(),
      };

      const buckets: Record<TimeGroup, NotificationItem[]> = {
        today: [],
        yesterday: [],
        past7Days: [],
        earlier: [],
      };

      for (const item of items) {
        buckets[getTimeGroup(item.timestamp, now)].push(item);
      }

      return TIME_GROUP_ORDER.filter((g) => buckets[g].length > 0).map((g) => ({
        group: g,
        groupLabel: labels[g],
        items: buckets[g],
      }));
    },
  );

  protected readonly hostClasses = computed((): string => clsx(classes.host));

  protected readonly triggerClasses = computed((): string =>
    clsx(classes.dotIconButton),
  );

  protected readonly panelClasses = computed((): string =>
    clsx(classes.drawer),
  );

  protected readonly toolbarClasses = computed((): string =>
    clsx(classes.toolbar),
  );

  protected readonly titleClasses = computed((): string => clsx(classes.title));

  protected readonly closeIconClasses = computed((): string =>
    clsx(classes.closeIcon),
  );

  protected readonly emptyClasses = computed((): string =>
    clsx(classes.emptyNotifications),
  );

  protected readonly listClasses = computed((): string =>
    clsx(classes.notificationsContainer),
  );

  protected readonly iconContainerClasses = computed((): string =>
    clsx(classes.iconContainer),
  );

  protected readonly severityIconClasses = computed((): string =>
    clsx(classes.severityIcon),
  );

  protected readonly bodyClasses = computed((): string => clsx(classes.body));

  protected readonly bodyContentClasses = computed((): string =>
    clsx(classes.bodyContent),
  );

  protected readonly itemTitleClasses = computed((): string =>
    clsx(classes.title),
  );

  protected readonly contentClasses = computed((): string =>
    clsx(classes.content),
  );

  protected readonly timeStampClasses = computed((): string =>
    clsx(classes.timeStamp),
  );

  protected itemClasses(
    severity?: NotificationSeverity,
    read?: boolean,
  ): string {
    return clsx(
      classes.host,
      classes.type('drawer'),
      severity && classes.severity(severity),
      read && `${classes.host}--read`,
    );
  }

  protected severityIcon(
    severity: NotificationSeverity,
  ): (typeof notificationIcons)[NotificationSeverity] {
    return notificationIcons[severity];
  }

  protected formatTimestamp(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) {
      return 'Just now';
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return `${diffDays}d ago`;
  }

  protected toggleOpen(): void {
    this.openChange.emit(!this.open());
  }

  protected onNotificationClick(item: NotificationItem): void {
    this.notificationClick.emit(item);
  }
}
