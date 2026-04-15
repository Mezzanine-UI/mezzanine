import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  dropdownClasses as classes,
  DropdownInputPosition,
  DropdownMode,
  DropdownOption,
  DropdownStatus as DropdownStatusType,
  DropdownType,
} from '@mezzanine-ui/core/dropdown';
import { type Placement } from '@floating-ui/dom';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTranslate } from '@mezzanine-ui/ng/transition';
import type { DropdownActionProps } from './dropdown-action.component';
import { MznDropdownItem } from './dropdown-item.component';

/**
 * 傳遞給 MznDropdownAction 的整合設定物件。
 * 可替代個別的 `actionCancelText`、`actionClearText`、`actionConfirmText`、
 * `showDropdownActions`、`showActionShowTopBar` 輸入屬性。
 * 若同時設定，`actionConfig` 中的對應欄位將覆蓋個別輸入屬性。
 */
export interface DropdownActionConfig {
  /** 自訂操作按鈕文字（custom mode）。 */
  actionText?: string;
  /** 取消按鈕文字。 */
  cancelText?: string;
  /** 清除按鈕文字。 */
  clearText?: string;
  /** 確認按鈕文字。 */
  confirmText?: string;
  /** 操作模式：'default' 顯示取消/確認；'clear' 顯示清除按鈕；'custom' 顯示自訂按鈕。 */
  mode?: 'clear' | 'custom' | 'default';
  /** 是否顯示操作區域。 */
  showActions?: boolean;
  /** 是否顯示頂部分隔線。 */
  showTopBar?: boolean;
}

/**
 * 下拉選單元件，以 Popper 定位於錨定元素旁顯示選項列表。
 *
 * 支援單選與多選模式，扁平選項結構。
 * 使用 `ClickAwayService` 點擊外部時自動關閉。
 * 透過 `inputPosition` 控制搜尋框位置，透過 `type` 指定選項結構類型。
 *
 * @example
 * ```html
 * import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
 *
 * <button #anchor (click)="open = !open">Options</button>
 * <div mznDropdown
 *   [anchor]="anchor"
 *   [open]="open"
 *   [options]="options"
 *   [value]="selected"
 *   (selected)="onSelect($event)"
 *   (closed)="open = false"
 * ></div>
 * ```
 *
 * @see MznSelect
 * @see MznPopper
 */
@Component({
  selector: '[mznDropdown]',
  standalone: true,
  imports: [MznPopper, MznDropdownItem, MznTranslate],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.name]': 'name() ?? null',
    '[attr.actionCancelText]': 'null',
    '[attr.actionClearText]': 'null',
    '[attr.actionConfirmText]': 'null',
    '[attr.actionConfig]': 'null',
    '[attr.actionText]': 'null',
    '[attr.activeIndex]': 'null',
    '[attr.anchor]': 'null',
    '[attr.customWidth]': 'null',
    '[attr.disabled]': 'null',
    '[attr.disableClickAway]': 'null',
    '[attr.emptyIcon]': 'null',
    '[attr.emptyText]': 'null',
    '[attr.inputPosition]': 'null',
    '[attr.loadingPosition]': 'null',
    '[attr.loadingText]': 'null',
    '[attr.listboxId]': 'null',
    '[attr.listboxLabel]': 'null',
    '[attr.maxHeight]': 'null',
    '[attr.minWidth]': 'null',
    '[attr.mode]': 'null',
    '[attr.open]': 'null',
    '[attr.options]': 'null',
    '[attr.placement]': 'null',
    '[attr.showActionShowTopBar]': 'null',
    '[attr.showCheckIcon]': 'null',
    '[attr.showDropdownActions]': 'null',
    '[attr.showHeader]': 'null',
    '[attr.status]': 'null',
    '[attr.type]': 'null',
    '[attr.value]': 'null',
    '[attr.zIndex]': 'null',
  },
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="popperOpen()"
      [placement]="resolvedPlacement()"
      [offsetOptions]="{ mainAxis: 4 }"
      [style.z-index]="zIndex() ?? null"
    >
      <div
        mznTranslate
        [in]="open()"
        from="top"
        (onExited)="onTranslateExited()"
      >
        <div [class]="resolvedRootClass()">
          @if (showHeader()) {
            <li [class]="listHeaderClass" role="presentation">
              <div [class]="listHeaderInnerClass">
                <ng-content select="[mznDropdownHeader]" />
              </div>
            </li>
          }
          <div
            mznDropdownItem
            [actionConfig]="resolvedActionConfig()"
            [activeIndex]="activeIndex()"
            [customWidth]="customWidth()"
            [disabled]="disabled()"
            [emptyIcon]="emptyIcon()"
            [emptyText]="emptyText()"
            [listboxId]="listboxId()"
            [listboxLabel]="listboxLabel()"
            [loadingPosition]="loadingPosition()"
            [loadingText]="loadingText()"
            [maxHeight]="maxHeight()"
            [minWidth]="minWidth()"
            [mode]="mode()"
            [options]="options()"
            [showCheckIcon]="showCheckIcon()"
            [status]="status()"
            [type]="type()"
            [value]="value()"
            (actionCancelled)="actionCancelled.emit()"
            (actionCleared)="actionCleared.emit()"
            (actionConfirmed)="actionConfirmed.emit()"
            (actionCustomClicked)="actionCustomClicked.emit()"
            (leaveBottom)="leaveBottom.emit()"
            (reachBottom)="reachBottom.emit()"
            (selected)="onItemSelected($event)"
          ></div>
        </div>
      </div>
    </div>
  `,
})
export class MznDropdown {
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  /** 取消按鈕文字，需搭配 showDropdownActions。 */
  readonly actionCancelText = input<string>();

  /** 清除按鈕文字，需搭配 showDropdownActions。 */
  readonly actionClearText = input<string>();

  /** 確認按鈕文字，需搭配 showDropdownActions。 */
  readonly actionConfirmText = input<string>();

  /**
   * 整合操作區設定物件，可替代個別的 actionCancelText、actionClearText、
   * actionConfirmText、showDropdownActions、showActionShowTopBar 輸入屬性。
   * 若同時設定，此物件中的對應欄位將覆蓋個別輸入屬性。
   */
  readonly actionConfig = input<DropdownActionConfig>();

  /** 自訂操作按鈕文字（custom mode）。 */
  readonly actionText = input<string>();

  /**
   * 目前鍵盤／滑鼠 active 選項的索引（0-indexed）。
   * 對應 React 的 `activeIndex`。
   */
  readonly activeIndex = input<number | null>(null);

  /** 錨定元素。 */
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();

  /**
   * 自訂下拉選單寬度，接受數字（px）或 CSS 字串。
   * 設定後優先於 sameWidth。
   */
  readonly customWidth = input<number | string>();

  /** 是否禁用所有選項互動。 @default false */
  readonly disabled = input(false);

  /** 是否禁用 click-away 關閉。 */
  readonly disableClickAway = input(false);

  /** 空狀態圖示，覆蓋預設圖示。 */
  readonly emptyIcon = input<IconDefinition>();

  /** 空狀態顯示文字。 */
  readonly emptyText = input<string>();

  /**
   * 搜尋輸入框的位置。
   * - `'outside'` — 觸發器本身即為輸入框
   * - `'inside'` — 輸入框顯示於下拉選單內部
   * @default 'outside'
   */
  readonly inputPosition = input<DropdownInputPosition>('outside');

  /**
   * 載入指示器位置。
   * - `'full'` — 覆蓋整個列表區域
   * - `'bottom'` — 僅顯示於列表底部
   * @default 'full'
   */
  readonly loadingPosition = input<'bottom' | 'full'>('full');

  /** 載入中顯示文字。 */
  readonly loadingText = input<string>();

  /**
   * listbox 的 DOM id（用於 aria-controls）。
   */
  readonly listboxId = input<string>();

  /**
   * listbox 的 aria-label。
   */
  readonly listboxLabel = input<string>();

  /**
   * 下拉選單最大高度，接受數字（px）或 CSS 字串。
   * 超過時啟用捲動。
   */
  readonly maxHeight = input<number | string>();

  /**
   * 下拉選單最小寬度，接受數字（px）或 CSS 字串。
   * @default size-container-tiny token
   */
  readonly minWidth = input<number | string>();

  /** 選取模式。 */
  readonly mode = input<DropdownMode>('single');

  /** 表單欄位名稱。 */
  readonly name = input<string>();

  /** 是否開啟下拉選單。 */
  readonly open = input(false);

  /** 選項列表。 */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /** 定位方向。 */
  readonly placement = input<Placement>('bottom-start');

  /**
   * 是否在操作區頂部顯示分隔線。
   * @default false
   */
  readonly showActionShowTopBar = input(false);

  /** 是否顯示勾選圖示。 */
  readonly showCheckIcon = input(true);

  /**
   * 是否顯示操作區（確認/取消/清除按鈕）。
   * @default false
   */
  readonly showDropdownActions = input(false);

  /**
   * 是否顯示標頭內容區域（搭配 `[mznDropdownHeader]` ng-content 插槽使用）。
   * 當有投影標頭內容時請設為 `true`。
   * @default false
   */
  readonly showHeader = input(false);

  /**
   * 非同步狀態。
   * - `'loading'` — 顯示載入中指示器
   * - `'empty'` — 顯示空狀態
   */
  readonly status = input<DropdownStatusType>();

  /**
   * 選項結構類型。
   * - `'default'` — 扁平列表
   * - `'tree'` — 樹狀結構（最多三層）
   * - `'grouped'` — 群組結構
   * @default 'default'
   */
  readonly type = input<DropdownType>('default');

  /** 目前選取值（單選為 string，多選為 string[]）。 */
  readonly value = input<ReadonlyArray<string> | string>();

  /**
   * 下拉選單的 z-index 覆蓋值。
   * 未設定時不套用 inline z-index，以 DOM 順序決定層級。
   */
  readonly zIndex = input<number | string>();

  /** 取消事件（搭配 showDropdownActions 使用）。 */
  readonly actionCancelled = output<void>();

  /** 清除事件（搭配 showDropdownActions 使用）。 */
  readonly actionCleared = output<void>();

  /** 確認事件（搭配 showDropdownActions 使用）。 */
  readonly actionConfirmed = output<void>();

  /** 自訂操作按鈕點擊事件（搭配 actionText 與 custom mode 使用）。 */
  readonly actionCustomClicked = output<void>();

  /** 關閉事件。 */
  readonly closed = output<void>();

  /** 離開列表底部時觸發。 */
  readonly leaveBottom = output<void>();

  /** 捲動至列表底部時觸發。 */
  readonly reachBottom = output<void>();

  /** 選取事件。 */
  readonly selected = output<DropdownOption>();

  protected readonly listHeaderClass = classes.listHeader;
  protected readonly listHeaderInnerClass = classes.listHeaderInner;

  /** Root element class, including inputPosition modifier. */
  protected readonly resolvedRootClass = computed((): string =>
    clsx(classes.root, classes.inputPosition(this.inputPosition())),
  );

  /**
   * Resolved placement: forces 'bottom' when inputPosition is 'inside',
   * otherwise uses the placement input.
   */
  protected readonly resolvedPlacement = computed(
    (): Placement =>
      this.inputPosition() === 'inside' ? 'bottom' : this.placement(),
  );

  /**
   * Build the unified DropdownActionProps passed to MznDropdownItem.
   * Merges individual action inputs with the actionConfig object.
   * actionConfig fields take precedence over individual inputs.
   */
  protected readonly resolvedActionConfig = computed(
    (): DropdownActionProps => {
      const cfg = this.actionConfig();
      const showActions = cfg?.showActions ?? this.showDropdownActions();
      const showTopBar = cfg?.showTopBar ?? this.showActionShowTopBar();
      const cancelText = cfg?.cancelText ?? this.actionCancelText();
      const clearText = cfg?.clearText ?? this.actionClearText();
      const confirmText = cfg?.confirmText ?? this.actionConfirmText();
      const actionText = cfg?.actionText ?? this.actionText();

      return {
        actionText,
        cancelText,
        clearText,
        confirmText,
        showActions,
        showTopBar,
      };
    },
  );

  /**
   * Popper 實際掛載狀態，會在 open=true 時立即變 true，在 open=false
   * 後繼續維持為 true 直到內部 MznTranslate 的離場動畫完成，確保
   * popper 的 `display: none` 不會在動畫結束前就把元素隱藏掉。
   */
  protected readonly popperOpen = signal(false);

  constructor() {
    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        this.popperOpen.set(true);
      }

      if (isOpen && !this.disableClickAway()) {
        const cleanup = this.clickAway.listen(
          this.hostElRef.nativeElement,
          () => this.closed.emit(),
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });
  }

  protected onTranslateExited(): void {
    if (!this.open()) {
      this.popperOpen.set(false);
    }
  }

  protected onItemSelected(option: DropdownOption): void {
    this.selected.emit(option);

    if (this.mode() === 'single') {
      this.closed.emit();
    }
  }
}
