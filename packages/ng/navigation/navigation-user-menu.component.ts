import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
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
import { MznTooltip } from '@mezzanine-ui/ng/tooltip';
import { MZN_NAVIGATION_ACTIVATED } from './navigation-context';

/**
 * 導覽列使用者選單元件，顯示使用者頭像與名稱，並提供下拉選單。
 *
 * 當使用者名稱溢出或導覽列收合時，自動以 Tooltip 顯示完整名稱。
 *
 * @example
 * ```html
 * import { MznNavigationUserMenu } from '@mezzanine-ui/ng/navigation';
 *
 * <button mznNavigationUserMenu imgSrc="/avatar.png" placement="top-end">
 *   <span userName>John Doe</span>
 *   <ng-template #menuContent>
 *     <div mznDropdownItemCard label="個人設定" ></div>
 *     <div mznDropdownItemCard label="登出" ></div>
 *   </ng-template>
 * </button>
 * ```
 *
 * @see MznNavigation
 * @see MznDropdown
 */
@Component({
  selector: '[mznNavigationUserMenu]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznDropdown, MznTooltip],
  host: {
    '[class]': 'hostClasses()',
    '[attr.imgSrc]': 'null',
    '[attr.placement]': 'null',
    '[attr.collapsedPlacement]': 'null',
  },
  template: `
    <button
      #menuAnchor
      type="button"
      [class]="buttonClasses()"
      (click)="toggleMenu()"
    >
      <span [class]="classes.content" #contentEl>
        <span [class]="classes.avatar">
          @if (!imgError() && imgSrc()) {
            <img
              [src]="imgSrc()"
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
      [anchor]="menuAnchor"
      [open]="isOpen()"
      [placement]="currentPlacement()"
      (closed)="handleClose()"
    >
      <ng-content select="[menuContent], ng-template" />
    </div>
  `,
})
export class MznNavigationUserMenu implements OnInit, OnDestroy {
  protected readonly classes = classes;
  protected readonly userIcon = UserIcon;
  protected readonly chevronDownIcon = ChevronDownIcon;

  private readonly navigation = inject(MZN_NAVIGATION_ACTIVATED, {
    optional: true,
  });
  private resizeObserver: ResizeObserver | null = null;
  private readonly userNameEl =
    viewChild<ElementRef<HTMLSpanElement>>('userNameEl');

  /** 使用者頭像圖片 URL。 */
  readonly imgSrc = input<string>();

  /**
   * 下拉選單位置。
   * @default 'top-end'
   */
  readonly placement = input<string>('top-end');

  /**
   * 導覽列收合時的下拉選單位置。
   * @default 'right-end'
   */
  readonly collapsedPlacement = input<string>('right-end');

  /** 選單開啟/關閉事件。 */
  readonly visibilityChange = output<boolean>();

  /** 選單關閉事件。 */
  readonly closed = output<void>();

  protected readonly imgError = signal(false);
  protected readonly isOpen = signal(false);
  protected readonly userNameOverflow = signal(false);

  protected readonly collapsed = computed(
    (): boolean => this.navigation?.collapsed ?? false,
  );

  protected readonly currentPlacement = computed(
    (): Placement =>
      (this.collapsed()
        ? this.collapsedPlacement()
        : this.placement()) as Placement,
  );

  protected readonly tooltipTitle = computed((): string | undefined => {
    if ((this.collapsed() || this.userNameOverflow()) && !this.isOpen()) {
      return undefined; // Will use projected content as tooltip
    }

    return undefined;
  });

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, this.isOpen() && classes.open),
  );

  protected readonly buttonClasses = computed((): string =>
    clsx(classes.host, this.isOpen() && classes.open),
  );

  ngOnInit(): void {
    this.observeUserNameOverflow();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  protected handleVisibilityChange(): void {
    this.isOpen.update((v) => !v);
    this.visibilityChange.emit(this.isOpen());
  }

  protected toggleMenu(): void {
    this.handleVisibilityChange();
  }

  protected handleClose(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  private observeUserNameOverflow(): void {
    const el = this.userNameEl()?.nativeElement;

    if (!el) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.userNameOverflow.set(el.scrollWidth > el.offsetWidth);
    });

    this.resizeObserver.observe(el);
  }
}
