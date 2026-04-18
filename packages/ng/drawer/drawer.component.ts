import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
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
import { MznRadio, MznRadioGroup } from '@mezzanine-ui/ng/radio';
import { MznSlide } from '@mezzanine-ui/ng/transition';
import { EscapeKeyService, TopStackService } from '@mezzanine-ui/ng/services';

/**
 * 從螢幕右側滑入的抽屜面板元件。
 *
 * 使用 `MznBackdrop` 作為遮罩層，並以 slide-right 動畫過渡。
 * 支援標題列、篩選區域、底部操作按鈕等皆為 flat props，嚴格對齊 React。
 * 當多個 Drawer 同時開啟時，Escape 鍵只會關閉最上層的 Drawer。
 *
 * @example
 * ```html
 * import { MznDrawer } from '@mezzanine-ui/ng/drawer';
 *
 * <div mznDrawer
 *   [open]="isOpen"
 *   isHeaderDisplay
 *   headerTitle="編輯資料"
 *   isBottomDisplay
 *   bottomPrimaryActionText="確認"
 *   bottomSecondaryActionText="取消"
 *   (bottomPrimaryActionClick)="onSubmit()"
 *   (bottomSecondaryActionClick)="isOpen = false"
 *   (closed)="isOpen = false"
 * >
 *   <p>Drawer 內容</p>
 * </div>
 * ```
 *
 * @see MznModal
 * @see MznBackdrop
 */
@Component({
  selector: '[mznDrawer]',
  host: {
    '[attr.bottomGhostActionDisabled]': 'null',
    '[attr.bottomGhostActionIcon]': 'null',
    '[attr.bottomGhostActionIconType]': 'null',
    '[attr.bottomGhostActionLoading]': 'null',
    '[attr.bottomGhostActionSize]': 'null',
    '[attr.bottomGhostActionText]': 'null',
    '[attr.bottomGhostActionVariant]': 'null',
    '[attr.bottomPrimaryActionDisabled]': 'null',
    '[attr.bottomPrimaryActionIcon]': 'null',
    '[attr.bottomPrimaryActionIconType]': 'null',
    '[attr.bottomPrimaryActionLoading]': 'null',
    '[attr.bottomPrimaryActionSize]': 'null',
    '[attr.bottomPrimaryActionText]': 'null',
    '[attr.bottomPrimaryActionVariant]': 'null',
    '[attr.bottomSecondaryActionDisabled]': 'null',
    '[attr.bottomSecondaryActionIcon]': 'null',
    '[attr.bottomSecondaryActionIconType]': 'null',
    '[attr.bottomSecondaryActionLoading]': 'null',
    '[attr.bottomSecondaryActionSize]': 'null',
    '[attr.bottomSecondaryActionText]': 'null',
    '[attr.bottomSecondaryActionVariant]': 'null',
    '[attr.contentKey]': 'null',
    '[attr.container]': 'null',
    '[attr.disableCloseOnBackdropClick]': 'null',
    '[attr.disableCloseOnEscapeKeyDown]': 'null',
    '[attr.disablePortal]': 'null',
    '[attr.filterAreaAllRadioLabel]': 'null',
    '[attr.filterAreaCustomButtonLabel]': 'null',
    '[attr.filterAreaDefaultValue]': 'null',
    '[attr.filterAreaIsEmpty]': 'null',
    '[attr.filterAreaOptions]': 'null',
    '[attr.filterAreaReadRadioLabel]': 'null',
    '[attr.filterAreaShow]': 'null',
    '[attr.filterAreaShowUnreadButton]': 'null',
    '[attr.filterAreaUnreadRadioLabel]': 'null',
    '[attr.filterAreaValue]': 'null',
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
      [class]="overlayClass"
      [container]="container()"
      [open]="open()"
      [disableCloseOnBackdropClick]="disableCloseOnBackdropClick()"
      [disablePortal]="disablePortal()"
      role="presentation"
      (closed)="closed.emit()"
      (backdropClick)="backdropClick.emit()"
    >
      <div mznSlide [in]="open()" from="right">
        <div [class]="hostClasses()">
          @if (isHeaderDisplay()) {
            <div [class]="headerClass">
              {{ headerTitle() }}
              <button mznClearActions (clicked)="closed.emit()"></button>
            </div>
          }

          @if (shouldRenderFilterArea()) {
            <div [class]="filterAreaClass()">
              @if (hasFilterRadios()) {
                <div
                  mznRadioGroup
                  size="minor"
                  type="segment"
                  [ngModel]="resolvedFilterValue()"
                  (valueChange)="filterAreaRadioChange.emit($event)"
                >
                  @if (filterAreaAllRadioLabel()) {
                    <div mznRadio type="segment" value="all">{{
                      filterAreaAllRadioLabel()
                    }}</div>
                  }
                  @if (filterAreaReadRadioLabel()) {
                    <div mznRadio type="segment" value="read">{{
                      filterAreaReadRadioLabel()
                    }}</div>
                  }
                  @if (
                    filterAreaShowUnreadButton() && filterAreaUnreadRadioLabel()
                  ) {
                    <div mznRadio type="segment" value="unread">{{
                      filterAreaUnreadRadioLabel()
                    }}</div>
                  }
                </div>
              }
              @if (hasFilterButton()) {
                @if ((filterAreaOptions()?.length ?? 0) > 0) {
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
                    [options]="filterAreaOptions()!"
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
                    [disabled]="filterAreaIsEmpty()"
                    (click)="filterAreaCustomButtonClick.emit()"
                  >
                    {{ filterAreaCustomButtonLabel() }}
                  </button>
                }
              }
            </div>
          }

          @for (instance of contentInstances(); track instance) {
            <div [class]="contentClass">
              <ng-content />
            </div>
          }

          @if (isBottomDisplay()) {
            <div [class]="bottomClass">
              <div>
                @if (bottomGhostActionText()) {
                  <button
                    mznButton
                    type="button"
                    [variant]="bottomGhostActionVariant()"
                    [size]="bottomGhostActionSize()"
                    [disabled]="bottomGhostActionDisabled()"
                    [loading]="bottomGhostActionLoading()"
                    (click)="bottomGhostActionClick.emit()"
                  >
                    @if (
                      bottomGhostActionIcon() &&
                      bottomGhostActionIconType() === 'leading'
                    ) {
                      <i mznIcon [icon]="bottomGhostActionIcon()!"></i>
                    }
                    {{ bottomGhostActionText() }}
                    @if (
                      bottomGhostActionIcon() &&
                      bottomGhostActionIconType() === 'trailing'
                    ) {
                      <i mznIcon [icon]="bottomGhostActionIcon()!"></i>
                    }
                  </button>
                }
              </div>
              <div [class]="bottomActionsClass">
                @if (bottomSecondaryActionText()) {
                  <button
                    mznButton
                    type="button"
                    [variant]="bottomSecondaryActionVariant()"
                    [size]="bottomSecondaryActionSize()"
                    [disabled]="bottomSecondaryActionDisabled()"
                    [loading]="bottomSecondaryActionLoading()"
                    (click)="bottomSecondaryActionClick.emit()"
                  >
                    @if (
                      bottomSecondaryActionIcon() &&
                      bottomSecondaryActionIconType() === 'leading'
                    ) {
                      <i mznIcon [icon]="bottomSecondaryActionIcon()!"></i>
                    }
                    {{ bottomSecondaryActionText() }}
                    @if (
                      bottomSecondaryActionIcon() &&
                      bottomSecondaryActionIconType() === 'trailing'
                    ) {
                      <i mznIcon [icon]="bottomSecondaryActionIcon()!"></i>
                    }
                  </button>
                }
                @if (bottomPrimaryActionText()) {
                  <button
                    mznButton
                    type="button"
                    [variant]="bottomPrimaryActionVariant()"
                    [size]="bottomPrimaryActionSize()"
                    [disabled]="bottomPrimaryActionDisabled()"
                    [loading]="bottomPrimaryActionLoading()"
                    (click)="bottomPrimaryActionClick.emit()"
                  >
                    @if (
                      bottomPrimaryActionIcon() &&
                      bottomPrimaryActionIconType() === 'leading'
                    ) {
                      <i mznIcon [icon]="bottomPrimaryActionIcon()!"></i>
                    }
                    {{ bottomPrimaryActionText() }}
                    @if (
                      bottomPrimaryActionIcon() &&
                      bottomPrimaryActionIconType() === 'trailing'
                    ) {
                      <i mznIcon [icon]="bottomPrimaryActionIcon()!"></i>
                    }
                  </button>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class MznDrawer {
  private readonly escapeKey = inject(EscapeKeyService);
  private readonly topStack = inject(TopStackService);

  // ─── Bottom ghost action flat props ──────────────────────────────────────

  /** Ghost 按鈕 disabled 狀態。 */
  readonly bottomGhostActionDisabled = input(false);

  /** Ghost 按鈕圖示。 */
  readonly bottomGhostActionIcon = input<IconDefinition>();

  /** Ghost 按鈕圖示排列方式。 */
  readonly bottomGhostActionIconType = input<ButtonIconType>();

  /** Ghost 按鈕 loading 狀態。 */
  readonly bottomGhostActionLoading = input(false);

  /** Ghost 按鈕尺寸。 */
  readonly bottomGhostActionSize = input<ButtonSize>();

  /** Ghost 按鈕文字。有值時才會渲染此按鈕。 */
  readonly bottomGhostActionText = input<string>();

  /**
   * Ghost 按鈕 variant。
   * @default 'base-ghost'
   */
  readonly bottomGhostActionVariant = input<ButtonVariant>('base-ghost');

  // ─── Bottom primary action flat props ────────────────────────────────────

  /** Primary 按鈕 disabled 狀態。 */
  readonly bottomPrimaryActionDisabled = input(false);

  /** Primary 按鈕圖示。 */
  readonly bottomPrimaryActionIcon = input<IconDefinition>();

  /** Primary 按鈕圖示排列方式。 */
  readonly bottomPrimaryActionIconType = input<ButtonIconType>();

  /** Primary 按鈕 loading 狀態。 */
  readonly bottomPrimaryActionLoading = input(false);

  /** Primary 按鈕尺寸。 */
  readonly bottomPrimaryActionSize = input<ButtonSize>();

  /** Primary 按鈕文字。有值時才會渲染此按鈕。 */
  readonly bottomPrimaryActionText = input<string>();

  /**
   * Primary 按鈕 variant。
   * @default 'base-primary'
   */
  readonly bottomPrimaryActionVariant = input<ButtonVariant>('base-primary');

  // ─── Bottom secondary action flat props ──────────────────────────────────

  /** Secondary 按鈕 disabled 狀態。 */
  readonly bottomSecondaryActionDisabled = input(false);

  /** Secondary 按鈕圖示。 */
  readonly bottomSecondaryActionIcon = input<IconDefinition>();

  /** Secondary 按鈕圖示排列方式。 */
  readonly bottomSecondaryActionIconType = input<ButtonIconType>();

  /** Secondary 按鈕 loading 狀態。 */
  readonly bottomSecondaryActionLoading = input(false);

  /** Secondary 按鈕尺寸。 */
  readonly bottomSecondaryActionSize = input<ButtonSize>();

  /** Secondary 按鈕文字。有值時才會渲染此按鈕。 */
  readonly bottomSecondaryActionText = input<string>();

  /**
   * Secondary 按鈕 variant。
   * @default 'base-secondary'
   */
  readonly bottomSecondaryActionVariant =
    input<ButtonVariant>('base-secondary');

  // ─── Filter area flat props ──────────────────────────────────────────────

  /** 「全部」radio 的標籤文字。 */
  readonly filterAreaAllRadioLabel = input<string>();

  /**
   * 自訂按鈕文字。
   * @default '全部已讀'
   */
  readonly filterAreaCustomButtonLabel = input<string>('全部已讀');

  /** radio 群組的預設值。 */
  readonly filterAreaDefaultValue = input<string>();

  /**
   * 是否為空（用於禁用自訂按鈕）。
   * @default false
   */
  readonly filterAreaIsEmpty = input(false);

  /**
   * Dropdown 選項列表。有值時取代自訂按鈕，改以 Dropdown 形式呈現。
   */
  readonly filterAreaOptions = input<ReadonlyArray<DropdownOption>>();

  /** 「已讀」radio 的標籤文字。 */
  readonly filterAreaReadRadioLabel = input<string>();

  /**
   * 是否顯示篩選區域。
   * @default false
   */
  readonly filterAreaShow = input(false);

  /**
   * 是否顯示未讀 radio。
   * @default false
   */
  readonly filterAreaShowUnreadButton = input(false);

  /** 「未讀」radio 的標籤文字。 */
  readonly filterAreaUnreadRadioLabel = input<string>();

  /** radio 群組目前的值（受控模式）。 */
  readonly filterAreaValue = input<string>();

  // ─── Core inputs ─────────────────────────────────────────────────────────

  /**
   * 自訂 Backdrop portal 容器。
   */
  readonly container = input<HTMLElement>();

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

  /** 標題文字。 */
  readonly headerTitle = input<string>();

  /**
   * 是否顯示底部操作按鈕區域。
   * @default false
   */
  readonly isBottomDisplay = input(false);

  /**
   * 是否顯示標題列區域。
   * @default false
   */
  readonly isHeaderDisplay = input(false);

  /** 是否開啟 Drawer。 */
  readonly open = input(false);

  /**
   * 寬度尺寸。
   * @default 'medium'
   */
  readonly size = input<DrawerSize>('medium');

  // ─── Outputs ─────────────────────────────────────────────────────────────

  /** 遮罩點擊事件。 */
  readonly backdropClick = output<void>();

  /** Ghost 按鈕點擊事件。對應 React `bottomOnGhostActionClick`。 */
  readonly bottomGhostActionClick = output<void>();

  /** Primary 按鈕點擊事件。對應 React `bottomOnPrimaryActionClick`。 */
  readonly bottomPrimaryActionClick = output<void>();

  /** Secondary 按鈕點擊事件。對應 React `bottomOnSecondaryActionClick`。 */
  readonly bottomSecondaryActionClick = output<void>();

  /** 關閉事件（遮罩點擊或 Escape 鍵）。對應 React `onClose`。 */
  readonly closed = output<void>();

  /** 篩選區域自訂按鈕點擊事件。對應 React `filterAreaOnCustomButtonClick`。 */
  readonly filterAreaCustomButtonClick = output<void>();

  /** 篩選區域 radio 變更事件。對應 React `filterAreaOnRadioChange`。 */
  readonly filterAreaRadioChange = output<string>();

  /** 篩選區域 Dropdown 選項選取事件。對應 React `filterAreaOnSelect`。 */
  readonly filterAreaSelect = output<DropdownOption>();

  // ─── Internal state ──────────────────────────────────────────────────────

  /**
   * 記錄 drawer 開啟次數。在 `contentKey` 未提供時用來觸發內容 remount
   * （對齊 React `openCount`，讓重開 drawer 會清理上一次的內容殘留）。
   */
  private readonly openCount = signal(0);
  protected readonly filterDropdownOpen = signal(false);
  protected readonly dotHorizontalIcon = DotHorizontalIcon;

  // ─── Computed ────────────────────────────────────────────────────────────

  protected readonly overlayClass = classes.overlay;
  protected readonly headerClass = classes.header;
  protected readonly contentClass = classes.content;
  protected readonly bottomClass = classes.bottom;
  protected readonly bottomActionsClass = classes['bottom__actions'];

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, classes.right, classes.size(this.size())),
  );

  protected readonly hasFilterRadios = computed(
    (): boolean =>
      !!this.filterAreaAllRadioLabel() ||
      !!this.filterAreaReadRadioLabel() ||
      (this.filterAreaShowUnreadButton() &&
        !!this.filterAreaUnreadRadioLabel()),
  );

  protected readonly hasFilterButton = computed((): boolean => {
    const options = this.filterAreaOptions();
    // 對齊 React: 有 options OR custom button label 有值就顯示按鈕。
    // React 用 `filterAreaOnCustomButtonClick !== undefined` 判斷；Angular
    // output 永遠存在，所以改用 customButtonLabel 有非預設值作為 proxy。
    if (options != null && options.length > 0) return true;
    const label = this.filterAreaCustomButtonLabel();
    return label !== undefined && label !== '';
  });

  protected readonly shouldRenderFilterArea = computed(
    (): boolean =>
      this.filterAreaShow() &&
      (this.hasFilterRadios() || this.hasFilterButton()),
  );

  protected readonly filterAreaClass = computed((): string =>
    clsx(classes.filterArea, {
      [classes.filterAreaButtonOnly]:
        !this.hasFilterRadios() && this.hasFilterButton(),
    }),
  );

  protected readonly resolvedFilterValue = computed(
    (): string =>
      this.filterAreaValue() ?? this.filterAreaDefaultValue() ?? 'all',
  );

  /**
   * 內容區 remount 用的 key 陣列。對應 React 的
   * `<div key={contentKey !== undefined ? contentKey : openCount}>`：
   * `@for (track instance)` 會在 key 改變時銷毀+重建 wrapper，
   * 連同 `<ng-content />` 一併重新 project，讓投影進來的子元件重掛載。
   */
  protected readonly contentInstances = computed(
    (): ReadonlyArray<string | number> => [
      this.contentKey() ?? this.openCount(),
    ],
  );

  constructor() {
    // Auto-increment openCount whenever drawer transitions to open; drives
    // content remount fallback when no explicit contentKey is provided.
    effect(() => {
      const isOpen = this.open();
      if (isOpen) {
        untracked(() => this.openCount.update((n) => n + 1));
      }
    });

    // Top-stack + Escape handling; only the top drawer responds to Escape.
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

  protected onFilterOptionSelected(option: DropdownOption): void {
    this.filterAreaSelect.emit(option);
    this.filterDropdownOpen.set(false);
  }
}
