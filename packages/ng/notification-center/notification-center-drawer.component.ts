import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { notificationClasses as classes } from '@mezzanine-ui/core/notification-center';
import { DrawerSize } from '@mezzanine-ui/core/drawer';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznDrawer } from '@mezzanine-ui/ng/drawer';
import { MznEmpty } from '@mezzanine-ui/ng/empty';
import { MznNotificationCenter } from './notification-center.component';
import type { NotificationItem } from './notification';

type TimeGroup = 'today' | 'yesterday' | 'past7Days' | 'earlier';

interface GroupedItem extends NotificationItem {
  readonly _prependTips?: string;
}

const TIME_GROUP_ORDER: ReadonlyArray<TimeGroup> = [
  'today',
  'yesterday',
  'past7Days',
  'earlier',
];

const isValidTime = (ts: string | number | Date | undefined): boolean => {
  if (ts === undefined || ts === null) return false;
  const d = ts instanceof Date ? ts : new Date(ts);
  return !Number.isNaN(d.getTime());
};

const getValidTime = (ts: string | number | Date | undefined): number => {
  if (ts === undefined || ts === null) return 0;
  const d = ts instanceof Date ? ts : new Date(ts);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
};

function getTimeGroup(
  ts: string | number | Date | undefined,
  now: Date,
): TimeGroup {
  if (!isValidTime(ts)) return 'earlier';
  const d = ts instanceof Date ? ts : new Date(ts as string | number);
  const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tsStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (tsStart.getTime() === nowStart.getTime()) return 'today';
  const yesterdayStart = new Date(nowStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  if (tsStart.getTime() === yesterdayStart.getTime()) return 'yesterday';
  const diffInDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
  if (diffInDays <= 7) return 'past7Days';
  return 'earlier';
}

/**
 * 通知中心抽屜面板，對齊 React `<NotificationCenterDrawer>`。
 *
 * 有兩種資料輸入方式：
 * 1. `[notificationList]` 傳入通知資料陣列，元件自動依 `timeStamp` 做
 *    「今天／昨天／過去七天／更早」分組，並為每組第一項附上 prependTips。
 * 2. 直接投射一或多個 `<div mznNotificationCenter type="drawer">` 子節點。
 *
 * 空狀態時自動顯示 `<div mznEmpty type="notification">`。
 *
 * @example
 * ```html
 * <!-- notificationList 模式 -->
 * <div mznNotificationCenterDrawer
 *   [open]="open()"
 *   title="通知中心"
 *   [notificationList]="items"
 *   (closed)="open.set(false)"
 * ></div>
 *
 * <!-- children 模式 -->
 * <div mznNotificationCenterDrawer [open]="open()" title="通知中心">
 *   <div mznNotificationCenter type="drawer" severity="info" title="..." />
 *   <div mznNotificationCenter type="drawer" severity="warning" title="..." />
 * </div>
 * ```
 */
@Component({
  selector: '[mznNotificationCenterDrawer]',
  standalone: true,
  imports: [MznDrawer, MznEmpty, MznNotificationCenter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.open]': 'null',
    '[attr.drawerSize]': 'null',
    '[attr.earlierLabel]': 'null',
    '[attr.emptyNotificationDescription]': 'null',
    '[attr.emptyNotificationTitle]': 'null',
    '[attr.notificationList]': 'null',
    '[attr.past7DaysLabel]': 'null',
    '[attr.title]': 'null',
    '[attr.todayLabel]': 'null',
    '[attr.yesterdayLabel]': 'null',
  },
  template: `
    <div
      mznDrawer
      [className]="drawerClass"
      [open]="open()"
      [size]="drawerSize()"
      [headerTitle]="title() ?? ''"
      [isHeaderDisplay]="!!title()"
      [filterAreaShow]="filterBarShow()"
      [filterAreaDefaultValue]="filterBarDefaultValue()"
      [filterAreaValue]="filterBarValue()"
      [filterAreaAllRadioLabel]="filterBarAllRadioLabel()"
      [filterAreaReadRadioLabel]="filterBarReadRadioLabel()"
      [filterAreaUnreadRadioLabel]="filterBarUnreadRadioLabel()"
      [filterAreaShowUnreadButton]="filterBarShowUnreadButton()"
      [filterAreaCustomButtonLabel]="filterBarCustomButtonLabel() ?? '全部已讀'"
      [filterAreaOptions]="filterBarOptions()"
      [filterAreaIsEmpty]="isEmpty()"
      (closed)="closed.emit()"
      (filterAreaRadioChange)="filterBarOnRadioChange.emit($event)"
      (filterAreaCustomButtonClick)="filterBarOnCustomButtonClick.emit()"
      (filterAreaSelect)="filterBarOnSelect.emit($event)"
    >
      @if (isEmpty()) {
        <div [class]="emptyClass">
          <div
            mznEmpty
            type="notification"
            size="main"
            [title]="emptyNotificationTitle()"
            [description]="emptyNotificationDescription()"
          ></div>
        </div>
      } @else {
        <div [class]="notificationsContainerClass">
          @if (notificationList() && notificationList()!.length > 0) {
            @for (item of groupedItems(); track item.key) {
              <div
                mznNotificationCenter
                type="drawer"
                [severity]="item.severity ?? 'info'"
                [title]="item.title ?? ''"
                [description]="item.description ?? ''"
                [timeStamp]="resolvedTimeStamp(item)"
                [timeStampLocale]="item.timeStampLocale ?? 'zh-TW'"
                [prependTips]="item._prependTips ?? null"
                [appendTips]="item.appendTips ?? null"
                [showBadge]="item.showBadge ?? false"
                [options]="item.options ?? []"
                [reference]="item.key ?? item.id ?? ''"
              ></div>
            }
          } @else {
            <ng-content />
          }
        </div>
      }
    </div>
  `,
})
export class MznNotificationCenterDrawer {
  /** 抽屜開關狀態。 */
  readonly open = input(false);

  /** 抽屜寬度。@default 'narrow' */
  readonly drawerSize = input<DrawerSize>('narrow');

  /** 抽屜標題。 */
  readonly title = input<string>();

  /** `notificationList` 模式下的通知資料。 */
  readonly notificationList = input<ReadonlyArray<NotificationItem>>();

  /** 「今天」分組標籤。@default '今天' */
  readonly todayLabel = input<string>('今天');

  /** 「昨天」分組標籤。@default '昨天' */
  readonly yesterdayLabel = input<string>('昨天');

  /** 「過去七天」分組標籤。@default '過去七天' */
  readonly past7DaysLabel = input<string>('過去七天');

  /** 「更早」分組標籤。@default '更早' */
  readonly earlierLabel = input<string>('更早');

  /** 空狀態標題。@default '目前沒有新的通知' */
  readonly emptyNotificationTitle = input<string>('目前沒有新的通知');

  /** 空狀態描述。@default '當有新的系統通知時，將會顯示在這裡。' */
  readonly emptyNotificationDescription =
    input<string>('當有新的系統通知時，將會顯示在這裡。');

  // ─── Filter bar (maps to MznDrawer filterArea* API) ─────────────────
  readonly filterBarShow = input<boolean>(false);
  readonly filterBarDefaultValue = input<string>();
  readonly filterBarValue = input<string>();
  readonly filterBarAllRadioLabel = input<string>();
  readonly filterBarReadRadioLabel = input<string>();
  readonly filterBarUnreadRadioLabel = input<string>();
  readonly filterBarShowUnreadButton = input<boolean>(false);
  readonly filterBarCustomButtonLabel = input<string>();
  readonly filterBarOptions = input<ReadonlyArray<DropdownOption>>();

  /** 抽屜關閉事件（點擊 backdrop 或 X）。 */
  readonly closed = output<void>();

  /** filter bar radio 變更。 */
  readonly filterBarOnRadioChange = output<string>();

  /** filter bar 自訂按鈕點擊。 */
  readonly filterBarOnCustomButtonClick = output<void>();

  /** filter bar Dropdown 選項選取。 */
  readonly filterBarOnSelect = output<DropdownOption>();

  protected readonly drawerClass = classes.drawer;
  protected readonly emptyClass = classes.emptyNotifications;
  protected readonly notificationsContainerClass =
    classes.notificationsContainer;

  protected readonly isEmpty = computed((): boolean => {
    const list = this.notificationList();
    if (list) return list.length === 0;
    // children projection — we can't easily count projected nodes from a
    // signal-based computed; treat falsy children as non-empty by default.
    return false;
  });

  protected readonly groupedItems = computed((): ReadonlyArray<GroupedItem> => {
    const list = this.notificationList();
    if (!list || list.length === 0) return [];
    const sorted = [...list].sort(
      (a, b) =>
        getValidTime(resolveTimeStamp(b)) - getValidTime(resolveTimeStamp(a)),
    );
    const now = new Date();
    const buckets: Record<TimeGroup, NotificationItem[]> = {
      today: [],
      yesterday: [],
      past7Days: [],
      earlier: [],
    };
    for (const item of sorted) {
      buckets[getTimeGroup(resolveTimeStamp(item), now)].push(item);
    }
    const labels: Record<TimeGroup, string> = {
      today: this.todayLabel(),
      yesterday: this.yesterdayLabel(),
      past7Days: this.past7DaysLabel(),
      earlier: this.earlierLabel(),
    };
    const out: GroupedItem[] = [];
    for (const group of TIME_GROUP_ORDER) {
      const items = buckets[group];
      if (!items.length) continue;
      items.forEach((item, idx) => {
        out.push({
          ...item,
          _prependTips: idx === 0 ? labels[group] : undefined,
        });
      });
    }
    return out;
  });

  protected resolvedTimeStamp(item: NotificationItem): string | number | Date {
    return resolveTimeStamp(item) ?? new Date();
  }
}

function resolveTimeStamp(
  item: NotificationItem,
): string | number | Date | undefined {
  return item.timeStamp ?? item.timestamp;
}
