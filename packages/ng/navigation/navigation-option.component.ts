import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { navigationOptionClasses as classes } from '@mezzanine-ui/core/navigation';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  MZN_NAVIGATION_ACTIVATED,
  MZN_NAVIGATION_OPTION_LEVEL,
  NavigationActivatedState,
  NavigationOptionLevel,
} from './navigation-context';

/**
 * 導覽選項元件，支援多層巢狀子選項。
 *
 * 從 `MZN_NAVIGATION_ACTIVATED` 與 `MZN_NAVIGATION_OPTION_LEVEL` 取得啟用與層級資訊。
 * 具有子選項時可展開/收合。
 *
 * 使用 element selector 而非 attribute directive 以避免 HTML5 `<li>` 巢狀時
 * auto-close 破壞 Angular template parse。Host 套 `display: contents`
 * 讓 `<mzn-navigation-option>` 在 layout 上透明，內層 `<li>` 依然是 `<ul>`
 * 的直接子項。
 *
 * @example
 * ```html
 * <mzn-navigation-option title="首頁" href="/" [icon]="homeIcon" />
 * <mzn-navigation-option title="設定" [icon]="settingsIcon" [hasChildren]="true">
 *   <mzn-navigation-option title="一般" href="/settings/general" />
 *   <mzn-navigation-option title="安全性" href="/settings/security" />
 * </mzn-navigation-option>
 * ```
 */
@Component({
  selector: 'mzn-navigation-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon],
  providers: [
    {
      provide: MZN_NAVIGATION_OPTION_LEVEL,
      useExisting: forwardRef(() => MznNavigationOption),
    },
  ],
  host: {
    '[style.display]': "'contents'",
  },
  template: `
    <li [class]="hostClasses()" [attr.data-id]="currentKey()">
      <div
        [class]="contentClasses()"
        role="menuitem"
        tabindex="0"
        (click)="onTriggerClick()"
        (keydown.enter)="onTriggerClick()"
        (keydown.space)="onTriggerClick(); $event.preventDefault()"
      >
        @if (icon()) {
          <i mznIcon [class]="iconClass" [icon]="icon()!"></i>
        }
        <span [class]="titleWrapperClass">
          <span [class]="titleClass">{{ title() }}</span>
        </span>
        <ng-content select="[navBadge]" />
        @if (hasChildren()) {
          <i mznIcon [class]="toggleIconClass" [icon]="toggleIcon()"></i>
        }
      </div>
      @if (hasChildren() && open()) {
        <div [class]="childrenWrapperClass">
          <ul [class]="groupClass">
            <ng-content />
          </ul>
        </div>
      }
    </li>
  `,
})
export class MznNavigationOption implements NavigationOptionLevel {
  private readonly navState = inject<NavigationActivatedState>(
    MZN_NAVIGATION_ACTIVATED,
    { optional: true },
  );
  private readonly parentLevel = inject<NavigationOptionLevel>(
    MZN_NAVIGATION_OPTION_LEVEL,
    { optional: true, skipSelf: true },
  );

  protected readonly childrenWrapperClass = classes.childrenWrapper;
  protected readonly iconClass = classes.icon;
  protected readonly groupClass = classes.group;
  protected readonly titleClass = classes.title;
  protected readonly titleWrapperClass = classes.titleWrapper;
  protected readonly toggleIconClass = classes.toggleIcon;

  protected readonly open = signal(false);

  /**
   * 是否為啟用狀態（手動覆蓋）。
   */
  readonly active = input<boolean>();

  /**
   * 是否有子選項。
   * @default false
   */
  readonly hasChildren = input(false);

  /** 連結目標。 */
  readonly href = input<string>();

  /** 圖示。 */
  readonly icon = input<IconDefinition>();

  /** 選項唯一識別碼。 */
  readonly optionId = input<string>();

  /** 選項標題。 */
  readonly title = input.required<string>();

  /**
   * 預設展開。
   * @default false
   */
  readonly defaultOpen = input(false);

  /** 觸發點擊事件。 */
  readonly triggerClick = output<{
    path: readonly string[];
    key: string;
    href?: string;
  }>();

  readonly currentLevel = computed(
    (): number => (this.parentLevel?.level ?? 0) + 1,
  );

  readonly currentKey = computed(
    (): string => this.optionId() || this.title() || this.href() || '',
  );

  readonly currentPath = computed((): readonly string[] => [
    ...(this.parentLevel?.path ?? []),
    this.currentKey(),
  ]);

  /** Implements NavigationOptionLevel. */
  get level(): number {
    return this.currentLevel();
  }

  /** Implements NavigationOptionLevel. */
  get path(): readonly string[] {
    return this.currentPath();
  }

  protected readonly toggleIcon = computed(() =>
    this.open() ? ChevronUpIcon : ChevronDownIcon,
  );

  protected readonly hostClasses = computed((): string => {
    const key = this.currentKey();
    const level = this.currentLevel();
    const activatedPath = this.navState?.activatedPath ?? [];
    const isActive = this.active() ?? activatedPath[level - 1] === key;

    return clsx(classes.host, {
      [classes.open]: this.open(),
      [classes.basic]: !this.hasChildren(),
      [classes.active]: isActive,
      [classes.collapsed]: this.navState?.collapsed,
    });
  });

  protected readonly contentClasses = computed((): string =>
    clsx(classes.content, classes.level(this.currentLevel())),
  );

  constructor() {
    if (this.defaultOpen()) {
      this.open.set(true);
    }

    // Auto-open when the activated path matches or is a descendant of
    // this option's current path (prefix match). Mirrors React's
    // `useEffect` in `NavigationOption.tsx` that listens to
    // `activatedPathKey`.
    effect(() => {
      const activatedPath = this.navState?.activatedPath;

      if (!activatedPath || activatedPath.length === 0) return;

      const current = this.currentPath();

      if (current.length === 0 || current.length > activatedPath.length) {
        return;
      }

      for (let i = 0; i < current.length; i += 1) {
        if (current[i] !== activatedPath[i]) return;
      }

      this.open.set(true);
    });
  }

  protected onTriggerClick(): void {
    if (this.hasChildren()) {
      this.open.update((v) => !v);
    }

    this.triggerClick.emit({
      path: this.currentPath(),
      key: this.currentKey(),
      href: this.href(),
    });

    if (!this.hasChildren() && this.navState) {
      this.navState.setActivatedPath(this.currentPath());
    }

    if (this.navState?.collapsed) {
      this.navState.handleCollapseChange(false);
    }
  }
}
