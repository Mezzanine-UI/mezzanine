import { NgTemplateOutlet } from '@angular/common';
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
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  dropdownClasses as classes,
  DropdownInputPosition,
  DropdownMode,
  DropdownOption,
  DropdownStatus as DropdownStatusType,
  DropdownType,
} from '@mezzanine-ui/core/dropdown';
import { type Middleware, type Placement, size } from '@floating-ui/dom';
import { IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznPortal } from '@mezzanine-ui/ng/portal';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTranslate } from '@mezzanine-ui/ng/transition';
import type { DropdownActionProps } from './dropdown-action.component';
import { MznDropdownItem } from './dropdown-item.component';

/**
 * 跨所有 MznDropdown 實例共用的遞增計數器,確保後開啟的 popper z-index
 * 永遠高於先開啟的(包含 Select / Autocomplete 等 wrapper 嵌套情境)。
 * 跟 `MznInputTriggerPopper` 的 popperOpenSequence 同機制但分離維護,
 * 因為兩邊使用的 z-index 基底不同時不應互相干涉。
 * @internal
 */
let mznDropdownPopperSequence = 0;

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
 * 下拉選單元件,支援 `inputPosition='outside'`(popper + anchor)與
 * `inputPosition='inside'`(in-flow + `[mznDropdownHeader]` 投影 header)
 * 兩種渲染模式,對齊 React `<Dropdown>` 介面 1:1。
 *
 * 內建功能:
 * - Popper 定位、click-away 自動關閉、mznTranslate 開合動畫
 * - 鍵盤導覽(↑/↓/Home/End/Enter/Escape),滑鼠 hover 同步 `itemHovered`
 * - `keyboardActiveIndex`(可由外部控制)與 `activeIndex`(hover)分離,
 *   對齊 React `Dropdown.tsx:476-477`
 * - `followText` 逐層傳至 `MznDropdownItemCard`,將符合子字串高亮
 * - 擴充 props 如 `sameWidth`、`globalPortal`、`toggleCheckedOnClick`
 *   亦與 React 同名(目前部分僅保留介面,行為擴充見各 input JSDoc)
 *
 * 作為 `MznAutocomplete` / `MznSelect` 的 list renderer,wrapper 只需
 * 傳入 options + bindings 即可獲得一致的清單行為。
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
 * @see MznAutocomplete
 * @see MznSelect
 * @see MznPopper
 */
@Component({
  selector: '[mznDropdown]',
  standalone: true,
  imports: [
    MznPopper,
    MznPortal,
    MznDropdownItem,
    MznTranslate,
    NgTemplateOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.name]': 'name() ?? null',
    '(keydown)': 'onHostKeyDown($event)',
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
    '[attr.followText]': 'null',
    '[attr.globalPortal]': 'null',
    '[attr.inputPosition]': 'null',
    '[attr.isMatchInputValue]': 'null',
    '[attr.keyboardActiveIndex]': 'null',
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
    '[attr.sameWidth]': 'null',
    '[attr.showActionShowTopBar]': 'null',
    '[attr.showCheckIcon]': 'null',
    '[attr.showDropdownActions]': 'null',
    '[attr.showHeader]': 'null',
    '[attr.status]': 'null',
    '[attr.toggleCheckedOnClick]': 'null',
    '[attr.type]': 'null',
    '[attr.value]': 'null',
    '[attr.zIndex]': 'null',
  },
  template: `
    <!--
      Capture [mznDropdownHeader] 投影為 TemplateRef,讓內層 mznDropdownItem
      可以把它渲染成 <ul class="mzn-dropdown-list"> 的第一個 <li class="list-header">,
      使 header(如 TextField)與 options 共享同一張 .mzn-dropdown-list 卡片
      (background + border-radius + shadow)。對齊 React DropdownItem 的
      headerContent prop 行為(DropdownItem.tsx:1004-1012)。
      透過 ng-template 包起來能讓同一份投影內容同時被 inline 與 popper 兩個
      分支使用,ng-content 原則上只能放一處,但 ng-template 可被 ngTemplateOutlet
      重複渲染。
    -->
    <ng-template #headerTpl>
      <ng-content select="[mznDropdownHeader]" />
    </ng-template>
    @if (isInline()) {
      <!--
        Inline 模式(inputPosition='inside')對齊 React Dropdown.tsx:986-1014
        的 isInline 分支:
        - Closed(!isOpen):只渲染 inlineTriggerElement(standalone TextField),
          不包任何卡片 wrapper。
        - Open(isOpen):DropdownItem 把 headerContent(TextField)以 sticky
          <li class="mzn-dropdown-list-header"> 放在 <ul class="mzn-dropdown-list">
          頂端,與 options 共享同一張卡片(bg / radius / shadow)。
        ng-template #headerTpl 捕獲 [mznDropdownHeader] 投影,讓同一份 TextField
        宣告在兩個分支皆可重用(closed 用 ngTemplateOutlet 直接渲染;open 傳給
        DropdownItem 當 headerContent)。
      -->
      @if (open()) {
        <div
          mznTranslate
          [in]="open()"
          [from]="translateFrom()"
          (onExited)="onTranslateExited()"
        >
          <div [class]="resolvedRootClass()">
            <div
              mznDropdownItem
              [actionConfig]="resolvedActionConfig()"
              [activeIndex]="activeIndex()"
              [keyboardActiveIndex]="effectiveKeyboardIndex()"
              [customWidth]="customWidth()"
              [disabled]="disabled()"
              [emptyIcon]="emptyIcon()"
              [emptyText]="emptyText()"
              [followText]="resolvedFollowText()"
              [headerContentTemplate]="headerTplRef() ?? undefined"
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
              (itemHovered)="itemHovered.emit($event)"
              (leaveBottom)="leaveBottom.emit()"
              (reachBottom)="reachBottom.emit()"
              (selected)="onItemSelected($event)"
            ></div>
          </div>
        </div>
      } @else {
        <ng-container *ngTemplateOutlet="headerTplRef() ?? null" />
      }
    } @else {
      <div mznPortal [disablePortal]="!globalPortal()">
        <div
          mznPopper
          data-mzn-dropdown-popper="true"
          [anchor]="anchor()!"
          [class]="popperWithPortalClass()"
          [open]="popperOpen()"
          [placement]="resolvedPlacement()"
          [offsetOptions]="{ mainAxis: 4 }"
          [middleware]="popperMiddleware()"
          [style.z-index]="resolvedZIndex()"
        >
          <div
            mznTranslate
            [in]="open()"
            [from]="translateFrom()"
            (onExited)="onTranslateExited()"
          >
            <div [class]="resolvedRootClass()">
              <div
                mznDropdownItem
                [actionConfig]="resolvedActionConfig()"
                [activeIndex]="activeIndex()"
                [keyboardActiveIndex]="effectiveKeyboardIndex()"
                [customWidth]="customWidth()"
                [disabled]="disabled()"
                [emptyIcon]="emptyIcon()"
                [emptyText]="emptyText()"
                [followText]="resolvedFollowText()"
                [headerContentTemplate]="
                  showHeader() ? (headerTplRef() ?? undefined) : undefined
                "
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
                (itemHovered)="itemHovered.emit($event)"
                (leaveBottom)="leaveBottom.emit()"
                (reachBottom)="reachBottom.emit()"
                (selected)="onItemSelected($event)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    }
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
   * 目前 active 選項的索引(0-indexed),通常反映滑鼠 hover;鍵盤導覽另由
   * `keyboardActiveIndex` 追蹤,對齊 React `Dropdown.tsx:92`。
   */
  readonly activeIndex = input<number | null>(null);

  /**
   * 鍵盤導覽高亮 index(0-indexed),與 `activeIndex` 分離以支援
   * "滑鼠 hover / 鍵盤 focus 可同時存在但視覺不同"的 pattern。
   * 對齊 React `Dropdown.tsx:99` 的 `keyboardActiveIndex` prop。
   */
  readonly keyboardActiveIndex = input<number | null>(null);

  /**
   * 錨定元素。popper 模式(inputPosition='outside',預設)必填;inline 模式
   * (inputPosition='inside')不需要 anchor,整個 dropdown 直接在原位
   * in-flow 渲染,不靠 popper 定位。
   */
  readonly anchor = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

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
   * 搜尋高亮關鍵字。若明確指定,會覆蓋 `isMatchInputValue` 從 header input
   * 自動推導的字串;設為空字串 / undefined 則關閉高亮。
   * 對應 React `Dropdown.tsx:127` 的 `followText` prop。
   */
  readonly followText = input<string>();

  /**
   * 搜尋輸入框的位置。
   * - `'outside'` — 觸發器本身即為輸入框
   * - `'inside'` — 輸入框顯示於下拉選單內部
   * @default 'outside'
   */
  readonly inputPosition = input<DropdownInputPosition>('outside');

  /**
   * 是否將 header 輸入框的值自動作為 `followText` 高亮 options。
   * 等同 React `Dropdown.tsx:122` 的 `isMatchInputValue`。目前 Angular 端
   * 沒有穩定的 ng-content 值橋接,請配合 `followText` 明確傳入 keyword;
   * 保留本 prop 以便未來支援。 @default false
   */
  readonly isMatchInputValue = input(false);

  /**
   * 是否讓下拉選單寬度與 anchor(trigger)等寬。僅在 popper 模式
   * (inputPosition='outside')且 `customWidth` 未設定時生效。
   * 對齊 React `Dropdown.tsx:206` 的 `sameWidth`。 @default false
   */
  readonly sameWidth = input(false);

  /**
   * popper 模式是否透過 `MznPortal` 渲染到 document.body,避開 overflow 裁切與
   * stacking context 限制;inline 模式(inputPosition='inside')下無效。
   * 對齊 React `Dropdown.tsx:257` 的 `globalPortal`。 @default true
   */
  readonly globalPortal = input(true);

  /**
   * Multiple mode 點擊選項是否 toggle 勾選(React 與 Autocomplete 預設行為
   * 不同,此旗標用來細控)。未設時沿用內部預設(single 不 toggle、
   * multiple toggle)。對齊 React `Dropdown.tsx:224` 的 `toggleCheckedOnClick`。
   */
  readonly toggleCheckedOnClick = input<boolean | undefined>(undefined);

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

  /** 關閉事件。對齊 React `Dropdown.tsx:171` 的 `onClose`。 */
  readonly closed = output<void>();

  /**
   * 選項 hover 事件,參數為選項的 0-indexed 位置。通常由 parent 用來更新
   * `activeIndex`(hover-style highlight)。對齊 React `Dropdown.tsx:175`
   * 的 `onItemHover`。
   */
  readonly itemHovered = output<number>();

  /** 開啟事件。對齊 React `Dropdown.tsx:179` 的 `onOpen`。 */
  readonly opened = output<void>();

  /**
   * 開閉狀態統一事件,切換時 emit `true` / `false`。`opened` 與 `closed`
   * 仍保留以向下相容。對齊 React `Dropdown.tsx:183` 的 `onVisibilityChange`。
   */
  readonly visibilityChange = output<boolean>();

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
   * 打在 outside-mode popper root 上的 class。`globalPortal=true` 時套用
   * `.mzn-dropdown-popper--with-portal` 把 `pointer-events` 從 portal
   * container 繼承的 `none` 重新打開為 `auto`,對齊 React
   * `Dropdown.tsx:1019` + `_dropdown-styles.scss:200` 的處理。
   *
   * 若不套用,portal container 整張 fixed 全屏 + pointer-events: none 會
   * 讓 popper 連同選項整張透明 —— 點擊穿過去打到後面元素,dropdown 本身
   * 收不到任何點擊事件。
   */
  protected readonly popperWithPortalClass = computed((): string =>
    this.globalPortal() ? classes.popperWithPortal : '',
  );

  /**
   * 是否為 inline 模式(React Dropdown.tsx 的 `isInline`):inputPosition='inside'
   * 時,dropdown 不透過 popper 定位,而是在原位 in-flow 渲染 + 以 mznTranslate
   * 做開合動畫。對齊 React 的 `isInline = inputPosition === 'inside'`。
   */
  protected readonly isInline = computed(
    (): boolean => this.inputPosition() === 'inside',
  );

  /**
   * 讀取 template 內 <ng-template #headerTpl> 的 TemplateRef,用於傳遞給
   * mznDropdownItem 的 `headerContentTemplate` input — 使 header 被渲染到
   * <ul class="mzn-dropdown-list"> 內部第一個 <li>,與 options 共享卡片。
   */
  protected readonly headerTplRef =
    viewChild<TemplateRef<unknown>>('headerTpl');

  /**
   * Resolved placement: forces 'bottom' when inputPosition is 'inside',
   * otherwise uses the placement input.
   */
  protected readonly resolvedPlacement = computed(
    (): Placement =>
      this.inputPosition() === 'inside' ? 'bottom' : this.placement(),
  );

  /**
   * MznTranslate 的 from 方向,鏡像 React Dropdown.tsx 的 translateFrom:
   * - isInline(inputPosition='inside')→ 'bottom'(list 從下方浮起)
   * - placement 以 'top' 開頭 → 'top'(list 出現在 trigger 上方,從上方滑下)
   * - 其他(bottom-/left-/right-*)→ 'bottom'(list 出現在 trigger 下方/側邊,
   *   從下方滑上 — 視覺上的「浮起來」感)
   *
   * 原本寫死 `from="top"` 讓所有 placement 都是「下滑」動畫,跟 React 的
   * 「浮起」方向相反。
   */
  protected readonly translateFrom = computed((): 'top' | 'bottom' => {
    if (this.inputPosition() === 'inside') return 'bottom';

    const placementBase = this.resolvedPlacement().split('-')[0];

    return placementBase === 'top' ? 'top' : 'bottom';
  });

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
   * 最終傳入 MznDropdownItem 的 `followText`。`followText` input 顯式提供
   * 時優先使用;否則目前 Angular 無穩定途徑從 ng-content 讀取 input value,
   * 回傳 undefined(關閉高亮)。對應 React `Dropdown.tsx:506-525` 的
   * useMemo。
   */
  protected readonly resolvedFollowText = computed((): string | undefined => {
    const explicit = this.followText();

    if (explicit !== undefined) {
      return explicit !== null ? String(explicit) : undefined;
    }

    return undefined;
  });

  /**
   * Popper 實際掛載狀態，會在 open=true 時立即變 true，在 open=false
   * 後繼續維持為 true 直到內部 MznTranslate 的離場動畫完成，確保
   * popper 的 `display: none` 不會在動畫結束前就把元素隱藏掉。
   */
  protected readonly popperOpen = signal(false);

  /**
   * 每次開啟 popper 時以遞增序號計算 z-index,對齊
   * `MznInputTriggerPopper` 的 popperOpenSequence 機制:後開啟的 popper
   * 永遠蓋在先開啟的之上,即使在 Modal / Drawer 內也不被其他 popover
   * 遮住。外部若用 `zIndex` input 明確指定,則以該值為準。
   */
  private readonly openSequenceZIndex = signal<string | null>(null);

  /**
   * 送入 `[style.z-index]` 的最終值:`zIndex` input > 內部 sequence。
   * 未顯式提供 zIndex 時,每次 `open` → true 會遞增 sequence 以超越已
   * 開啟的同類 popper;回退到 CSS 變數 `--mzn-z-index-popover` 作為基值。
   */
  protected readonly resolvedZIndex = computed((): string | null => {
    const explicit = this.zIndex();

    if (explicit !== undefined && explicit !== null) {
      return typeof explicit === 'number' ? `${explicit}` : explicit;
    }

    return this.openSequenceZIndex();
  });

  /**
   * 額外的 floating-ui middleware。`sameWidth=true` 時加上 `size` middleware
   * 讓 floating 元素 `minWidth` 與 anchor 同寬,對齊 React
   * `Dropdown.tsx:535-568` 的 sameWidthMiddleware。`customWidth` 有值時
   * 優先,此 middleware 直接不套用避免互打。
   */
  protected readonly popperMiddleware = computed(
    (): ReadonlyArray<Middleware> => {
      if (!this.sameWidth() || this.customWidth() !== undefined) return [];

      return [
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              minWidth: `${rects.reference.width}px`,
            });
          },
        }),
      ];
    },
  );

  /**
   * 內部鍵盤 active index,對齊 React `Dropdown.tsx` 中的 `keyboardActiveIndex`
   * 內建狀態機。當外部顯式指定 `keyboardActiveIndex` 時忽略此 signal;
   * 否則由本元件的 keydown handler 維護(↑/↓/Home/End/Enter)。
   * 以 -1 表示「無選中」(剛開啟或全部 disabled 時)。
   */
  private readonly internalKeyboardIndex = signal(-1);

  /**
   * 送入 MznDropdownItem 的鍵盤 active index:外部指定值優先,否則使用
   * 內部 signal。對應 React `Dropdown.tsx:476-477`。
   */
  protected readonly effectiveKeyboardIndex = computed((): number | null => {
    const explicit = this.keyboardActiveIndex();

    if (explicit !== null && explicit !== undefined) return explicit;

    return this.internalKeyboardIndex();
  });

  /**
   * 扁平化可選 option 的總數(供鍵盤 nav 計算 wrap-around)。
   * - 'default':`options().length`
   * - 'grouped':所有 group children 加總
   * - 'tree':目前不支援鍵盤 nav(由各 tree 節點自行處理),回傳 0
   */
  protected readonly flatOptionCount = computed((): number => {
    const type = this.type();
    const opts = this.options();

    if (type === 'grouped') {
      return opts.reduce((acc, g) => acc + (g.children?.length ?? 0), 0);
    }

    if (type === 'tree') return 0;

    return opts.length;
  });

  /**
   * 以 flat index 取得對應的 DropdownOption(跨 default / grouped)。
   * tree 模式目前鍵盤 nav 不支援,回傳 undefined。
   */
  private optionAtFlatIndex(index: number): DropdownOption | undefined {
    if (index < 0) return undefined;

    const type = this.type();
    const opts = this.options();

    if (type === 'grouped') {
      let offset = 0;

      for (const g of opts) {
        const children = g.children ?? [];

        if (index < offset + children.length) {
          return children[index - offset];
        }

        offset += children.length;
      }

      return undefined;
    }

    if (type === 'tree') return undefined;

    return opts[index];
  }

  /**
   * 前一次 `open()` 值,effect 比對後用來判斷本次是 false→true 還是
   * true→false,以 emit 正確的 `opened` / `visibilityChange` 事件。
   * 初始化為 open 的首次值,避免 mount 時立即誤 emit。
   */
  private lastOpen = this.open();

  constructor() {
    // Inline 模式 focus 續接:@if (open()) 會讓 header template 在 closed
    // branch 的 standalone outlet 與 open branch 的 DropdownItem 內部 outlet
    // 各建一份 embedded view,切換時 DOM 會重建。使用者點 input 觸發 open 後,
    // 舊 input 被銷毀、新 input 預設未 focus → 後續按鍵打進空處。open 轉為
    // true 時於 host 內 querySelector 第一個 input/textarea 並 focus。
    effect(() => {
      if (this.isInline() && this.open()) {
        queueMicrotask(() => {
          const hostEl = this.hostElRef.nativeElement;
          const focusable = hostEl.querySelector(
            'input:not([type="hidden"]), textarea',
          ) as HTMLElement | null;

          if (focusable && document.activeElement !== focusable) {
            focusable.focus();
          }
        });
      }
    });

    // Transition detector:比對 lastOpen 與 current open() 以判斷本次 run 是
    // false→true 還是 true→false,對應 emit `opened` / `visibilityChange`。
    // 使用 lastOpen 欄位而非 previousValue 參數的原因:Angular effect 在
    // 首次 run 沒有 previous value,保存欄位可確保 mount 時不誤 emit。
    effect(() => {
      const isOpen = this.open();

      if (isOpen === this.lastOpen) return;

      this.lastOpen = isOpen;
      this.visibilityChange.emit(isOpen);

      if (isOpen) {
        this.opened.emit();
      } else {
        // 關閉時重置內部鍵盤 index,避免下次開啟時仍停留在舊位置
        // (對齊 React Dropdown 每次 open 都從 activeIndex 初始化的行為)。
        this.internalKeyboardIndex.set(-1);
      }
    });

    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        this.popperOpen.set(true);

        // Bump sequence and reflect onto resolvedZIndex so the latest-opened
        // popper always sits above previously opened ones (Modal / Drawer
        // scenarios). Intentionally not reset on close so the closing
        // popper retains its stacking position through the exit animation,
        // mirroring `MznInputTriggerPopper`'s popperOpenSequence behaviour.
        if (!this.isInline()) {
          this.openSequenceZIndex.set(
            `calc(var(--mzn-z-index-popover) + ${++mznDropdownPopperSequence})`,
          );
        }
      }

      if (isOpen && !this.disableClickAway()) {
        // 把 anchor、host、以及 popper root 一併視為「inside」,對齊 React
        // Dropdown 的 `!anchor.contains(target) && !popper.contains(target)`。
        // - anchor:使用者點 trigger(如 TextField)時不可被判外部。
        // - host:inline 模式整個 dropdown 都在 host 內。
        // - popper:globalPortal=true 時 popper 內容被 MznPortal 移到
        //   `<body>`,host 已不包含它;也不能單靠 `popperElRef` viewChild
        //   因為 `<ng-content>` → `<ng-template>` 的穿透使得 viewChild
        //   在某些 change detection 時序下未解析。改用 selector 檢查
        //   `target.closest('[data-mzn-dropdown-popper]')`,不論 popper
        //   被搬到哪裡都能正確判定。
        const anchorRaw = this.anchor();
        const anchorEl =
          anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;
        const cleanup = this.clickAway.listen(
          [this.hostElRef.nativeElement, anchorEl],
          (event) => {
            const target = event.target as HTMLElement | null;

            if (target?.closest('[data-mzn-dropdown-popper="true"]')) return;

            this.closed.emit();
          },
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });

    // Outside 模式 keyboard forwarding:popper 渲染的 list 不在 trigger 的
    // DOM 樹裡,但使用者的 focus 通常停留在 trigger <input>,因此把 anchor
    // 的 keydown 轉發到 host keyboard handler,讓 wrappers(MznAutocomplete、
    // MznSelect)不需要各自重寫 nav 邏輯。`onHostKeyDown` 本身已有
    // `defaultPrevented` 早退,所以 wrapper 若要吞 Enter / Backspace 做
    // 自己的事,只要對該 event 呼叫 preventDefault 即可。
    effect((onCleanup) => {
      if (!this.open()) return;

      const anchorRaw = this.anchor();
      const anchorEl =
        anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;

      if (!anchorEl) return;
      // Inline 模式的 anchor 若有設定也無所謂,hostEl 的 listener 已經
      // handle 了同一個事件;但 inline 模式通常不設 anchor,故此處大多
      // 只在 outside 模式起作用。
      const handler = (event: KeyboardEvent): void => this.onHostKeyDown(event);

      anchorEl.addEventListener('keydown', handler);
      onCleanup(() => anchorEl.removeEventListener('keydown', handler));
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

  /**
   * 內建鍵盤導覽:對齊 React `Dropdown.tsx:689-757` 的 handleBuiltinKeyDown。
   * 僅在 `open()` 時處理。tree 模式目前交由 MznDropdownItem 內部處理,
   * 此處略過 nav keys。
   *
   * 事件來源:
   * - Inside 模式:`[mznDropdownHeader]` 內 <input> 的 keydown 會沿 DOM
   *   bubble 到 host(<div mznDropdown>),直接被這個 host listener 接到。
   * - Outside 模式:trigger <input> 是外部 `anchor`,不在 host DOM 樹內,
   *   由建構子內另一個 effect 將 anchor 的 keydown 轉發到同一個 handler,
   *   讓 wrapper 不需自行實作 nav。
   */
  protected onHostKeyDown(event: KeyboardEvent): void {
    if (!this.open() || this.disabled()) return;

    // 若有外層 wrapper(如 MznAutocomplete)在同一事件上已呼叫
    // `event.preventDefault()` 表示它已消化掉此 key(例如以 Enter 觸發
    // creation、Backspace 刪除 tag),MznDropdown 不應重複處理以免
    // 同一 Enter 先建立後又選取。
    if (event.defaultPrevented) return;

    const type = this.type();

    if (type === 'tree') return;

    const count = this.flatOptionCount();

    if (count === 0) return;

    const key = event.key;

    if (key === 'Escape') {
      event.preventDefault();
      this.closed.emit();

      return;
    }

    if (key === 'Enter') {
      const current = this.effectiveKeyboardIndex();

      if (current === null || current < 0) return;

      const option = this.optionAtFlatIndex(current);

      if (!option) return;

      event.preventDefault();
      this.onItemSelected(option);

      return;
    }

    if (
      key !== 'ArrowDown' &&
      key !== 'ArrowUp' &&
      key !== 'Home' &&
      key !== 'End'
    ) {
      return;
    }

    event.preventDefault();

    const current = this.internalKeyboardIndex();
    const next =
      key === 'Home'
        ? 0
        : key === 'End'
          ? count - 1
          : key === 'ArrowDown'
            ? current < 0
              ? 0
              : (current + 1) % count
            : current <= 0
              ? count - 1
              : current - 1;

    this.internalKeyboardIndex.set(next);
  }
}
