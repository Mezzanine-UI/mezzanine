import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import {
  drawerClasses as classes,
  DrawerSize,
} from '@mezzanine-ui/core/drawer';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { DotHorizontalIcon, IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznBackdrop } from '@mezzanine-ui/ng/backdrop';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { FormsModule } from '@angular/forms';
import { MznRadio } from '@mezzanine-ui/ng/radio';
import { MznRadioGroup } from '@mezzanine-ui/ng/radio';
import { MznSlide } from '@mezzanine-ui/ng/transition';
import { EscapeKeyService } from '@mezzanine-ui/ng/services';
import { TopStackService } from '@mezzanine-ui/ng/services';

/**
 * 底部操作按鈕的設定物件。
 * 當傳入此 config 時，Drawer 會在底部渲染對應的按鈕，
 * 優先於 `[mznDrawerBottom]` ng-content slot。
 */
export interface DrawerActionConfig {
  /** 按鈕文字。 */
  text: string;
  /** 是否禁用按鈕。 */
  disabled?: boolean;
  /** 按鈕圖示。 */
  icon?: IconDefinition;
  /** 圖示排列方式。 */
  iconType?: ButtonIconType;
  /** 是否顯示載入狀態。 */
  loading?: boolean;
  /** 按鈕尺寸。 */
  size?: ButtonSize;
  /** 按鈕 variant。 */
  variant?: ButtonVariant;
}

/**
 * 篩選區域的設定物件。
 * 當傳入此 config 時，Drawer 會在標題列下方渲染篩選列，
 * 優先於 `[mznDrawerFilter]` ng-content slot。
 */
export interface DrawerFilterConfig {
  /** 「全部」radio 的標籤文字。 */
  allRadioLabel?: string;
  /** 自訂按鈕文字。@default '全部已讀' */
  customButtonLabel?: string;
  /** radio 群組的預設值。 */
  defaultValue?: string;
  /** 是否為空（用於禁用自訂按鈕）。 */
  isEmpty?: boolean;
  /** 「已讀」radio 的標籤文字。 */
  readRadioLabel?: string;
  /** 是否顯示未讀按鈕。 */
  showUnreadButton?: boolean;
  /** 「未讀」radio 的標籤文字。 */
  unreadRadioLabel?: string;
  /** radio 群組目前的值（受控模式）。 */
  value?: string;
  /** 下拉選單選項列表。有值時渲染 Dropdown；無值時渲染自訂按鈕。 */
  options?: ReadonlyArray<DropdownOption>;
}

/**
 * 從右側滑入的抽屜面板元件。
 *
 * 使用 `MznBackdrop` 作為遮罩層，並以 slide-right 動畫過渡。
 * 支援標題列、篩選區域、底部操作按鈕等，皆透過 content projection 或 input config 設定。
 * 當多個 Drawer 同時開啟時，Escape 鍵只會關閉最上層的 Drawer。
 *
 * **底部按鈕**：可傳入 `bottomGhostAction`、`bottomPrimaryAction`、`bottomSecondaryAction` config
 * 讓 Drawer 自動渲染底部按鈕；若未傳入則回退到 `[mznDrawerBottom]` ng-content slot。
 *
 * **篩選區域**：可傳入 `filterConfig` config 讓 Drawer 自動渲染篩選列；
 * 若未傳入則回退到 `[mznDrawerFilter]` ng-content slot。
 *
 * @example
 * ```html
 * import { MznDrawer } from '@mezzanine-ui/ng/drawer';
 *
 * <!-- 使用 config inputs 宣告式設定底部按鈕 -->
 * <div mznDrawer
 *   [open]="isOpen"
 *   headerTitle="編輯資料"
 *   [bottomPrimaryAction]="{ text: '確認', variant: 'base-primary' }"
 *   [bottomSecondaryAction]="{ text: '取消', variant: 'base-secondary' }"
 *   (bottomPrimaryActionClick)="onSubmit()"
 *   (bottomSecondaryActionClick)="isOpen = false"
 *   (closed)="isOpen = false"
 * >
 *   <p>Drawer 內容</p>
 * </div>
 *
 * <!-- 使用 ng-content slot（Angular 慣用方式） -->
 * <div mznDrawer [open]="isOpen" headerTitle="詳細資料" (closed)="isOpen = false">
 *   <p>抽屜內容</p>
 *   <div mznDrawerBottom>
 *     <button mznButton variant="base-primary">確認</button>
 *   </div>
 * </div>
 * ```
 *
 * @see MznModal
 * @see MznBackdrop
 */
@Component({
  selector: '[mznDrawer]',
  host: {
    '[attr.bottomGhostAction]': 'null',
    '[attr.bottomPrimaryAction]': 'null',
    '[attr.bottomSecondaryAction]': 'null',
    '[attr.contentKey]': 'null',
    '[attr.disableCloseOnBackdropClick]': 'null',
    '[attr.disableCloseOnEscapeKeyDown]': 'null',
    '[attr.disablePortal]': 'null',
    '[attr.filterConfig]': 'null',
    '[attr.headerTitle]': 'null',
    '[attr.isBottomDisplay]': 'null',
    '[attr.isHeaderDisplay]': 'null',
    '[attr.open]': 'null',
    '[attr.size]': 'null',
  },
  standalone: true,
  imports: [
    FormsModule,
    MznBackdrop,
    MznButton,
    MznClearActions,
    MznDropdown,
    MznIcon,
    MznRadio,
    MznRadioGroup,
    MznSlide,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      mznBackdrop
      [open]="open()"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick()"
      [disablePortal]="disablePortal()"
      (closed)="closed.emit()"
      (backdropClick)="backdropClick.emit()"
    >
      <div mznSlide [in]="open()" from="right">
        <div [class]="hostClasses()">
          @if (isHeaderDisplay() || headerTitle()) {
            <div [class]="headerClass">
              {{ headerTitle() }}
              <button mznClearActions (clicked)="closed.emit()"></button>
            </div>
          }

          @if (hasFilterConfig()) {
            <div [class]="filterAreaClass()">
              @if (hasFilterRadios()) {
                <div
                  mznRadioGroup
                  size="minor"
                  type="segment"
                  [ngModel]="resolvedFilterValue()"
                  (valueChange)="onFilterRadioChange($event)"
                >
                  @if (filterConfig()?.allRadioLabel) {
                    <div mznRadio type="segment" value="all">{{
                      filterConfig()?.allRadioLabel
                    }}</div>
                  }
                  @if (filterConfig()?.readRadioLabel) {
                    <div mznRadio type="segment" value="read">{{
                      filterConfig()?.readRadioLabel
                    }}</div>
                  }
                  @if (
                    filterConfig()?.showUnreadButton &&
                    filterConfig()?.unreadRadioLabel
                  ) {
                    <div mznRadio type="segment" value="unread">{{
                      filterConfig()?.unreadRadioLabel
                    }}</div>
                  }
                </div>
              }
              @if (hasFilterButton()) {
                @if (filterConfig()?.options?.length) {
                  <button
                    #filterDropdownAnchor
                    mznButton
                    variant="base-ghost"
                    size="minor"
                    type="button"
                    iconType="icon-only"
                    (click)="filterDropdownOpen.set(!filterDropdownOpen())"
                  >
                    <i mznIcon [icon]="dotHorizontalIcon"></i>
                  </button>
                  <div
                    mznDropdown
                    [anchor]="filterDropdownAnchor"
                    [open]="filterDropdownOpen()"
                    [options]="filterConfig()!.options!"
                    placement="bottom-end"
                    (selected)="onFilterOptionSelected($event)"
                    (closed)="filterDropdownOpen.set(false)"
                  ></div>
                } @else {
                  <button
                    mznButton
                    variant="base-ghost"
                    size="minor"
                    type="button"
                    [disabled]="filterConfig()?.isEmpty"
                    (click)="filterCustomButtonClick.emit()"
                  >
                    {{ filterConfig()?.customButtonLabel ?? '全部已讀' }}
                  </button>
                }
              }
            </div>
          } @else {
            <ng-content select="[mznDrawerFilter]" />
          }

          <div
            [class]="contentClass"
            [attr.data-content-key]="contentKey() ?? null"
          >
            <ng-content />
          </div>

          @if (isBottomDisplay() || hasBottomActions()) {
            <div [class]="bottomClass">
              <div>
                @if (bottomGhostAction()?.text) {
                  <button
                    mznButton
                    type="button"
                    [variant]="bottomGhostAction()?.variant ?? 'base-ghost'"
                    [size]="bottomGhostAction()?.size"
                    [disabled]="bottomGhostAction()?.disabled"
                    [loading]="bottomGhostAction()?.loading ?? false"
                    (click)="bottomGhostActionClick.emit()"
                  >
                    @if (
                      bottomGhostAction()?.icon &&
                      bottomGhostAction()?.iconType === 'leading'
                    ) {
                      <i mznIcon [icon]="bottomGhostAction()!.icon!"></i>
                    }
                    {{ bottomGhostAction()?.text }}
                    @if (
                      bottomGhostAction()?.icon &&
                      bottomGhostAction()?.iconType === 'trailing'
                    ) {
                      <i mznIcon [icon]="bottomGhostAction()!.icon!"></i>
                    }
                  </button>
                }
              </div>
              <div [class]="bottomActionsClass">
                @if (bottomSecondaryAction()?.text) {
                  <button
                    mznButton
                    type="button"
                    [variant]="
                      bottomSecondaryAction()?.variant ?? 'base-secondary'
                    "
                    [size]="bottomSecondaryAction()?.size"
                    [disabled]="bottomSecondaryAction()?.disabled"
                    [loading]="bottomSecondaryAction()?.loading ?? false"
                    (click)="bottomSecondaryActionClick.emit()"
                  >
                    @if (
                      bottomSecondaryAction()?.icon &&
                      bottomSecondaryAction()?.iconType === 'leading'
                    ) {
                      <i mznIcon [icon]="bottomSecondaryAction()!.icon!"></i>
                    }
                    {{ bottomSecondaryAction()?.text }}
                    @if (
                      bottomSecondaryAction()?.icon &&
                      bottomSecondaryAction()?.iconType === 'trailing'
                    ) {
                      <i mznIcon [icon]="bottomSecondaryAction()!.icon!"></i>
                    }
                  </button>
                }
                @if (bottomPrimaryAction()?.text) {
                  <button
                    mznButton
                    type="button"
                    [variant]="bottomPrimaryAction()?.variant ?? 'base-primary'"
                    [size]="bottomPrimaryAction()?.size"
                    [disabled]="bottomPrimaryAction()?.disabled"
                    [loading]="bottomPrimaryAction()?.loading ?? false"
                    (click)="bottomPrimaryActionClick.emit()"
                  >
                    @if (
                      bottomPrimaryAction()?.icon &&
                      bottomPrimaryAction()?.iconType === 'leading'
                    ) {
                      <i mznIcon [icon]="bottomPrimaryAction()!.icon!"></i>
                    }
                    {{ bottomPrimaryAction()?.text }}
                    @if (
                      bottomPrimaryAction()?.icon &&
                      bottomPrimaryAction()?.iconType === 'trailing'
                    ) {
                      <i mznIcon [icon]="bottomPrimaryAction()!.icon!"></i>
                    }
                  </button>
                }
              </div>
            </div>
          } @else {
            <ng-content select="[mznDrawerBottom]" />
          }
        </div>
      </div>
    </div>
  `,
})
export class MznDrawer {
  private readonly escapeKey = inject(EscapeKeyService);
  private readonly topStack = inject(TopStackService);

  // ─── Bottom action configs ───────────────────────────────────────────────

  /**
   * Ghost 操作按鈕設定。
   * 傳入此 config 時，Drawer 底部左側會渲染 ghost 按鈕；
   * 未傳入時回退到 `[mznDrawerBottom]` ng-content slot。
   */
  readonly bottomGhostAction = input<DrawerActionConfig>();

  /**
   * Primary 操作按鈕設定。
   * 傳入此 config 時，Drawer 底部右側會渲染 primary 按鈕；
   * 未傳入時回退到 `[mznDrawerBottom]` ng-content slot。
   */
  readonly bottomPrimaryAction = input<DrawerActionConfig>();

  /**
   * Secondary 操作按鈕設定。
   * 傳入此 config 時，Drawer 底部右側會渲染 secondary 按鈕；
   * 未傳入時回退到 `[mznDrawerBottom]` ng-content slot。
   */
  readonly bottomSecondaryAction = input<DrawerActionConfig>();

  // ─── Core inputs ─────────────────────────────────────────────────────────

  /**
   * 強制重新掛載內容的 key。
   * 當資料異動（例如清單筆數減少）時，可透過此 input 清除 DOM 殘留。
   */
  readonly contentKey = input<string | number>();

  /** 是否禁用點擊遮罩關閉。 */
  readonly disableCloseOnBackdropClick = input(false);

  /** 是否禁用 Escape 鍵關閉。 */
  readonly disableCloseOnEscapeKeyDown = input(false);

  /** 是否禁用 Portal。 */
  readonly disablePortal = input(false);

  /**
   * 篩選區域設定物件。
   * 傳入時，Drawer 會在標題列下方渲染篩選列；
   * 未傳入時回退到 `[mznDrawerFilter]` ng-content slot。
   */
  readonly filterConfig = input<DrawerFilterConfig>();

  /** 標題文字。 */
  readonly headerTitle = input<string>();

  /**
   * 是否顯示底部操作按鈕區域。
   * 搭配 `bottomGhostAction`、`bottomPrimaryAction`、`bottomSecondaryAction` 使用，
   * 或搭配 `[mznDrawerBottom]` ng-content slot。
   * @default false
   */
  readonly isBottomDisplay = input(false);

  /**
   * 是否顯示標題列區域。
   * 預設行為是當 headerTitle 有值時顯示標題列；
   * 明確設為 `true` 時，即使 headerTitle 為空也會顯示標題列容器。
   * @default false
   */
  readonly isHeaderDisplay = input(false);

  /** 是否開啟 Drawer。 */
  readonly open = input(false);

  /** 寬度尺寸。 */
  readonly size = input<DrawerSize>('medium');

  // ─── Outputs ─────────────────────────────────────────────────────────────

  /** 遮罩點擊事件。 */
  readonly backdropClick = output<void>();

  /** Ghost 按鈕點擊事件（需搭配 `bottomGhostAction` input）。 */
  readonly bottomGhostActionClick = output<void>();

  /** Primary 按鈕點擊事件（需搭配 `bottomPrimaryAction` input）。 */
  readonly bottomPrimaryActionClick = output<void>();

  /** Secondary 按鈕點擊事件（需搭配 `bottomSecondaryAction` input）。 */
  readonly bottomSecondaryActionClick = output<void>();

  /** 關閉事件。 */
  readonly closed = output<void>();

  /** 篩選 radio 變更事件（需搭配 `filterConfig` input）。 */
  readonly filterRadioChange = output<string>();

  /** 篩選區域自訂按鈕點擊事件（需搭配 `filterConfig` input）。 */
  readonly filterCustomButtonClick = output<void>();

  /** 篩選 Dropdown 選項選取事件（需搭配 `filterConfig.options` 使用）。 */
  readonly filterOptionSelected = output<DropdownOption>();

  // ─── Computed ────────────────────────────────────────────────────────────

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.right, classes.size(this.size())),
  );

  protected readonly headerClass = classes.header;
  protected readonly contentClass = classes.content;
  protected readonly bottomClass = classes.bottom;
  protected readonly bottomActionsClass = classes['bottom__actions'];

  protected readonly filterAreaClass = computed((): string => {
    const hasRadios = this.hasFilterRadios();
    const hasButton = this.hasFilterButton();

    return clsx(
      classes.filterArea,
      !hasRadios && hasButton && classes.filterAreaButtonOnly,
    );
  });

  /** Whether any bottom action config is provided (triggers built-in bottom rendering). */
  protected readonly hasBottomActions = computed(
    (): boolean =>
      !!this.bottomGhostAction() ||
      !!this.bottomPrimaryAction() ||
      !!this.bottomSecondaryAction(),
  );

  /** Whether filterConfig is provided (triggers built-in filter rendering). */
  protected readonly hasFilterConfig = computed(
    (): boolean => !!this.filterConfig(),
  );

  protected readonly hasFilterRadios = computed((): boolean => {
    const cfg = this.filterConfig();

    if (!cfg) return false;

    return !!(
      cfg.allRadioLabel ||
      cfg.readRadioLabel ||
      (cfg.showUnreadButton && cfg.unreadRadioLabel)
    );
  });

  protected readonly hasFilterButton = computed((): boolean => {
    const cfg = this.filterConfig();

    if (!cfg) return false;

    return (
      (cfg.options != null && cfg.options.length > 0) ||
      cfg.customButtonLabel !== undefined
    );
  });

  /** Resolved filter value: uses config.value if provided, otherwise config.defaultValue. */
  protected readonly resolvedFilterValue = computed((): string => {
    const cfg = this.filterConfig();

    return cfg?.value ?? cfg?.defaultValue ?? 'all';
  });

  protected readonly dotHorizontalIcon = DotHorizontalIcon;
  protected readonly filterDropdownOpen = signal(false);

  protected onFilterOptionSelected(option: DropdownOption): void {
    this.filterOptionSelected.emit(option);
    this.filterDropdownOpen.set(false);
  }

  protected onFilterRadioChange(value: string): void {
    this.filterRadioChange.emit(value);
  }

  constructor() {
    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        const entry = this.topStack.register();

        const escapeCleanup = this.escapeKey.listen(() => {
          if (!this.disableCloseOnEscapeKeyDown() && entry.isTop()) {
            this.closed.emit();
          }
        });

        onCleanup(() => {
          escapeCleanup();
          entry.unregister();
        });
      }
    });
  }
}
