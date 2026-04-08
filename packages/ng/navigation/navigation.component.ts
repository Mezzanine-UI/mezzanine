import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { navigationClasses as classes } from '@mezzanine-ui/core/navigation';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import {
  MZN_NAVIGATION_ACTIVATED,
  MZN_NAVIGATION_OPTION_LEVEL,
  NavigationActivatedState,
  NavigationOptionLevel,
} from './navigation-context';
import { MznNavigationOption } from './navigation-option.component';
import { MznNavigationOptionCategory } from './navigation-option-category.component';

/**
 * 單一導覽選項的設定物件。
 */
export interface NavigationOptionConfig {
  /** 是否為啟用狀態（手動覆蓋）。 */
  active?: boolean;
  /** 巢狀子選項。 */
  children?: NavigationOptionConfig[];
  /** 預設展開。 */
  defaultOpen?: boolean;
  /** 連結目標。 */
  href?: string;
  /** 圖示。 */
  icon?: IconDefinition;
  /** 選項唯一識別碼（對應 Angular 的 optionId input）。 */
  id?: string;
  /** 選項標題。 */
  title: string;
}

/**
 * 導覽分類的設定物件。
 */
export interface NavigationCategoryConfig {
  /** 分類下的子選項。 */
  children?: NavigationOptionConfig[];
  /** 分類標題。 */
  title: string;
  /** 識別為分類型別。 */
  type: 'category';
}

/**
 * `items` input 接受的單一項目型別，可為導覽選項或分類群組。
 */
export type NavigationItemConfig =
  | NavigationCategoryConfig
  | NavigationOptionConfig;

/**
 * 側邊導覽列元件，支援展開/收合、多層選項與分類群組。
 *
 * 透過 `MZN_NAVIGATION_ACTIVATED` 與 `MZN_NAVIGATION_OPTION_LEVEL`
 * InjectionToken 向子元件提供啟用路徑與層級資訊。
 *
 * @example
 * ```html
 * import { MznNavigation, MznNavigationOption, MznNavigationHeader, MznNavigationFooter } from '@mezzanine-ui/ng/navigation';
 *
 * <mzn-navigation [collapsed]="isCollapsed" (collapseChange)="isCollapsed = $event">
 *   <mzn-navigation-header>
 *     <span title>My App</span>
 *   </mzn-navigation-header>
 *   <mzn-navigation-option title="首頁" href="/" [icon]="homeIcon" />
 *   <mzn-navigation-option title="設定" [icon]="settingsIcon" [hasChildren]="true">
 *     <mzn-navigation-option title="一般" href="/settings/general" />
 *   </mzn-navigation-option>
 *   <mzn-navigation-footer>
 *     <button>登出</button>
 *   </mzn-navigation-footer>
 * </mzn-navigation>
 * ```
 */
@Component({
  selector: 'mzn-navigation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznNavigationOption, MznNavigationOptionCategory],
  providers: [
    {
      provide: MZN_NAVIGATION_ACTIVATED,
      useFactory: (nav: MznNavigation): NavigationActivatedState => ({
        get activatedPath(): readonly string[] {
          return nav.resolvedActivatedPath();
        },
        get collapsed(): boolean {
          return nav.resolvedCollapsed();
        },
        setActivatedPath(path: readonly string[]): void {
          nav.onActivatedPathChange(path);
        },
        handleCollapseChange(collapsed: boolean): void {
          nav.onCollapseChange(collapsed);
        },
      }),
      deps: [MznNavigation],
    },
    {
      provide: MZN_NAVIGATION_OPTION_LEVEL,
      useValue: { level: 0, path: [] } as NavigationOptionLevel,
    },
  ],
  host: {
    '[class]': 'hostClasses()',
    role: 'navigation',
  },
  template: `
    <ng-content select="mzn-navigation-header" />
    <div [class]="contentClass">
      <ul [class]="listClass">
        @if (items(); as itemList) {
          @for (item of itemList; track item.title) {
            @if (isCategoryConfig(item)) {
              <mzn-navigation-option-category [title]="item.title">
                @for (child of item.children ?? []; track child.title) {
                  <mzn-navigation-option
                    [active]="child.active"
                    [defaultOpen]="child.defaultOpen ?? false"
                    [hasChildren]="(child.children?.length ?? 0) > 0"
                    [href]="child.href"
                    [icon]="child.icon"
                    [optionId]="child.id"
                    [title]="child.title"
                  >
                    @for (
                      grandchild of child.children ?? [];
                      track grandchild.title
                    ) {
                      <mzn-navigation-option
                        [active]="grandchild.active"
                        [defaultOpen]="grandchild.defaultOpen ?? false"
                        [hasChildren]="(grandchild.children?.length ?? 0) > 0"
                        [href]="grandchild.href"
                        [icon]="grandchild.icon"
                        [optionId]="grandchild.id"
                        [title]="grandchild.title"
                      />
                    }
                  </mzn-navigation-option>
                }
              </mzn-navigation-option-category>
            } @else {
              <mzn-navigation-option
                [active]="item.active"
                [defaultOpen]="item.defaultOpen ?? false"
                [hasChildren]="(item.children?.length ?? 0) > 0"
                [href]="item.href"
                [icon]="item.icon"
                [optionId]="item.id"
                [title]="item.title"
              >
                @for (child of item.children ?? []; track child.title) {
                  <mzn-navigation-option
                    [active]="child.active"
                    [defaultOpen]="child.defaultOpen ?? false"
                    [hasChildren]="(child.children?.length ?? 0) > 0"
                    [href]="child.href"
                    [icon]="child.icon"
                    [optionId]="child.id"
                    [title]="child.title"
                  >
                    @for (
                      grandchild of child.children ?? [];
                      track grandchild.title
                    ) {
                      <mzn-navigation-option
                        [active]="grandchild.active"
                        [defaultOpen]="grandchild.defaultOpen ?? false"
                        [hasChildren]="(grandchild.children?.length ?? 0) > 0"
                        [href]="grandchild.href"
                        [icon]="grandchild.icon"
                        [optionId]="grandchild.id"
                        [title]="grandchild.title"
                      />
                    }
                  </mzn-navigation-option>
                }
              </mzn-navigation-option>
            }
          }
        } @else {
          <ng-content />
        }
      </ul>
    </div>
    <ng-content select="mzn-navigation-footer" />
  `,
})
export class MznNavigation {
  private readonly internalCollapsed = signal(false);
  private readonly internalActivatedPath = signal<readonly string[]>([]);

  protected readonly contentClass = classes.content;
  protected readonly listClass = classes.list;

  /** 啟用的路徑陣列。 */
  readonly activatedPath = input<readonly string[]>();

  /**
   * 是否收合。
   * @default false
   */
  readonly collapsed = input<boolean>();

  /**
   * 收合狀態下 tooltip 的顯示位置。
   * @default 'right'
   */
  readonly collapsedPlacement = input<'right' | 'left' | 'top' | 'bottom'>(
    'right',
  );

  /**
   * 是否使用精確路徑比對來決定啟用狀態。
   * @default false
   */
  readonly exactActivatedMatch = input(false);

  /**
   * 是否顯示搜尋過濾輸入框。
   * @default false
   */
  readonly filter = input(false);

  /**
   * 宣告式導覽項目設定陣列。提供時將取代 `<ng-content>` 的子元件用法。
   * 每個項目可為 `NavigationOptionConfig` 或 `NavigationCategoryConfig`（含 `type: 'category'`）。
   *
   * @example
   * ```ts
   * items = [
   *   { title: '首頁', href: '/', icon: HomeIcon },
   *   { type: 'category', title: '管理', children: [
   *     { title: '使用者', href: '/admin/users' },
   *   ]},
   * ];
   * ```
   */
  readonly items = input<readonly NavigationItemConfig[]>();

  /** 收合狀態變更事件。 */
  readonly collapseChange = output<boolean>();

  /** 選項點擊事件。 */
  readonly optionClick = output<readonly string[]>();

  readonly resolvedCollapsed = computed(
    (): boolean => this.collapsed() ?? this.internalCollapsed(),
  );

  readonly resolvedActivatedPath = computed(
    (): readonly string[] =>
      this.activatedPath() ?? this.internalActivatedPath(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.collapsed]: this.resolvedCollapsed(),
      [classes.expand]: !this.resolvedCollapsed(),
    }),
  );

  /** @internal */
  isCategoryConfig(
    item: NavigationItemConfig,
  ): item is NavigationCategoryConfig {
    return (item as NavigationCategoryConfig).type === 'category';
  }

  /** @internal */
  onCollapseChange(collapsed: boolean): void {
    this.internalCollapsed.set(collapsed);
    this.collapseChange.emit(collapsed);
  }

  /** @internal */
  onActivatedPathChange(path: readonly string[]): void {
    this.internalActivatedPath.set(path);
    this.optionClick.emit(path);
  }
}
