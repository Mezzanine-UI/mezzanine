import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { type Placement } from '@floating-ui/dom';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MZN_NAVIGATION_ACTIVATED } from './navigation-context';

/**
 * 導覽列使用者選單元件，顯示頭像 + 使用者名稱 + 下拉選單。
 *
 * 對應 React 的 `NavigationUserMenu`。
 *
 * Angular 端採用 **element selector** (`<mzn-navigation-user-menu>`)，host 以
 * `display: contents` 在 layout 中透明，內層 `<button>` 為實際的 toggle；
 * 下拉選單以 `MznDropdown` + `MznPopper` 做浮動定位。收合狀態下
 * placement 會切換為 `collapsedPlacement` 以模擬 React 版行為。
 *
 * 使用者名稱透過 `<span userName>...</span>` slot 投影；若使用者名稱因寬度
 * 受限而 truncate，`userNameOverflow` signal 會自動更新（由 `ResizeObserver`
 * 追蹤），供外部 tooltip 判斷使用。
 *
 * @example
 * ```html
 * import { MznNavigationUserMenu } from '@mezzanine-ui/ng/navigation';
 *
 * <mzn-navigation-user-menu imgSrc="/avatar.png" placement="top-end">
 *   <span userName>John Doe</span>
 *   <ng-template menuContent>
 *     <div mznDropdownItemCard label="個人設定" />
 *     <div mznDropdownItemCard label="登出" />
 *   </ng-template>
 * </mzn-navigation-user-menu>
 * ```
 *
 * @see MznNavigation
 * @see MznDropdown
 */
@Component({
  selector: 'mzn-navigation-user-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznDropdown],
  host: {
    '[style.display]': "'contents'",
  },
  template: `
    <button
      #menuBtn
      type="button"
      [class]="hostClasses()"
      (click)="toggleMenu()"
    >
      <span [class]="classes.content">
        <span [class]="classes.avatar">
          @if (!imgError() && imgSrc()) {
            <img
              [src]="imgSrc()!"
              alt="User avatar"
              [class]="classes.avatar"
              (error)="imgError.set(true)"
            />
          } @else {
            <i mznIcon [icon]="userIcon"></i>
          }
        </span>
        <span [class]="classes.userName">
          <span #userNameEl>
            <ng-content select="[userName]" />
          </span>
        </span>
        <i mznIcon [class]="classes.icon" [icon]="chevronDownIcon"></i>
      </span>
    </button>
    <div
      mznDropdown
      [anchor]="menuBtn"
      [open]="isOpen()"
      [placement]="currentPlacement()"
      [options]="options()"
      (selected)="handleOptionSelected($event)"
      (closed)="handleClose()"
    ></div>
  `,
})
export class MznNavigationUserMenu {
  protected readonly classes = classes;
  protected readonly userIcon = UserIcon;
  protected readonly chevronDownIcon = ChevronDownIcon;

  private readonly navigation = inject(MZN_NAVIGATION_ACTIVATED, {
    optional: true,
  });
  private readonly destroyRef = inject(DestroyRef);
  private readonly userNameEl =
    viewChild<ElementRef<HTMLSpanElement>>('userNameEl');

  /** 使用者頭像圖片 URL。未提供或載入失敗時會 fallback 到 user icon。 */
  readonly imgSrc = input<string>();

  /**
   * 下拉選單項目。使用 `DropdownOption`（與 `MznDropdown` 相同）以
   * 保持整個 design system 對 menu item 定義的一致。
   */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /**
   * 展開時的下拉選單 placement。
   * @default 'top-end'
   */
  readonly placement = input<Placement>('top-end');

  /**
   * 導覽列收合狀態下的下拉選單 placement。
   * @default 'right-end'
   */
  readonly collapsedPlacement = input<Placement>('right-end');

  /** 選單顯示狀態變更事件（true = 展開，false = 收合）。 */
  readonly visibilityChange = output<boolean>();

  /** 選取某個 menu item 的事件，攜帶被選中的 `DropdownOption`。 */
  readonly optionSelected = output<DropdownOption>();

  /** 選單關閉事件（點擊外部或 click-away 觸發）。 */
  readonly closed = output<void>();

  protected readonly imgError = signal(false);
  protected readonly isOpen = signal(false);
  protected readonly userNameOverflow = signal(false);

  protected readonly collapsed = computed(
    (): boolean => this.navigation?.collapsed ?? false,
  );

  protected readonly currentPlacement = computed(
    (): Placement =>
      this.collapsed() ? this.collapsedPlacement() : this.placement(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, this.isOpen() && classes.open),
  );

  constructor() {
    // Observe userName span size; flag overflow so external tooltips can react.
    effect((onCleanup) => {
      const el = this.userNameEl()?.nativeElement;
      if (!el || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => {
        this.userNameOverflow.set(el.scrollWidth > el.offsetWidth);
      });
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
    // Safety net: tear down any lingering state on component destroy.
    this.destroyRef.onDestroy(() => {
      this.isOpen.set(false);
    });
  }

  protected toggleMenu(): void {
    this.isOpen.update((v) => !v);
    this.visibilityChange.emit(this.isOpen());
  }

  protected handleClose(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.visibilityChange.emit(false);
    this.closed.emit();
  }

  protected handleOptionSelected(option: DropdownOption): void {
    this.optionSelected.emit(option);
    this.handleClose();
  }
}
