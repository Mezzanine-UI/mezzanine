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
import { type Placement } from '@floating-ui/dom';
import { IconDefinition } from '@mezzanine-ui/icons';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTranslate } from '@mezzanine-ui/ng/transition';
import type {
  DropdownActionButtonProps,
  DropdownActionProps,
} from './dropdown-action.component';
import { MznDropdownItem } from './dropdown-item.component';
import { MznDropdownPopper } from './dropdown-popper.directive';

/**
 * 跨所有 MznDropdown 實例共用的遞增序號,供未顯式提供 `listboxId` 時產生
 * 穩定的後備 listbox id(anchor 的 `aria-controls` 指向)。parity tool 會把
 * 所有 id 類 attribute 正規化為 `<id>`,故實際值不影響比對,僅需穩定存在。
 * @internal
 */
let dropdownListboxSeq = 0;

/**
 * 下拉選單元件,支援 `inputPosition='outside'`(CDK Overlay + anchor)與
 * `inputPosition='inside'`(in-flow + `[mznDropdownHeader]` 投影 header)
 * 兩種渲染模式,對齊 React `<Dropdown>` 介面 1:1。
 *
 * Host element 直接扮演 React `<div class="mzn-dropdown mzn-dropdown--outside">`
 * root 的角色(透過 host class binding),trigger 以 default `<ng-content>` 投影
 * 進來(對齊 React 把 children clone 進 root 末端),outside 模式的浮層則透過
 * `[mznDropdownPopper]` directive 用 Angular CDK Overlay portal 到 body,閉合時
 * detach,consumer 子樹內不殘留任何 popper 宿主元素(對齊 React `<Popper>` 的
 * portal 行為,消除原 `MznPopper` 的 `display:none` 殘留)。
 *
 * 內建功能:
 * - CDK Overlay 定位、click-away 自動關閉、mznTranslate 開合動畫
 * - 鍵盤導覽(↑/↓/Home/End/Enter/Escape),滑鼠 hover 同步 `itemHover`
 * - `keyboardActiveIndex`(可由外部控制)與 `activeIndex`(hover)分離,
 *   對齊 React `Dropdown.tsx:476-477`
 * - anchor 上注入 `aria-haspopup` / `aria-expanded` / `aria-controls`,對齊
 *   React 對 trigger 的 ARIA clone 行為
 *
 * 作為 `MznAutocomplete` / `MznSelect` 的 list renderer,wrapper 只需
 * 傳入 options + bindings 即可獲得一致的清單行為。
 *
 * @example
 * ```html
 * import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
 *
 * <div mznDropdown
 *   [anchor]="anchor"
 *   [open]="open"
 *   [options]="options"
 *   [value]="selected"
 *   (select)="onSelect($event)"
 *   (close)="open = false"
 * >
 *   <button #anchor (click)="open = !open">Options</button>
 * </div>
 * ```
 *
 * @see MznAutocomplete
 * @see MznSelect
 */
@Component({
  selector: '[mznDropdown]',
  standalone: true,
  imports: [MznDropdownItem, MznDropdownPopper, MznTranslate, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Host element 即 React 的 `div.mzn-dropdown` root;以個別 class binding
    // 加上 BEM class(不用 `[class]` 整包覆寫,以保留 consumer 自帶 class)。
    // `.mzn-dropdown` 提供 position:relative,`.mzn-dropdown--outside` 提供
    // line-height:0(見 core/_dropdown-styles.scss)。
    '[class.mzn-dropdown]': 'true',
    '[class.mzn-dropdown--outside]': '!isInline()',
    '[class.mzn-dropdown--inside]': 'isInline()',
    '[attr.id]': 'id() ?? null',
    '(keydown)': 'onHostKeyDown($event)',
    '[attr.actionCancelText]': 'null',
    '[attr.actionClearText]': 'null',
    '[attr.actionConfirmText]': 'null',
    '[attr.actionText]': 'null',
    '[attr.activeIndex]': 'null',
    '[attr.anchor]': 'null',
    '[attr.customWidth]': 'null',
    '[attr.disabled]': 'null',
    '[attr.emptyIcon]': 'null',
    '[attr.emptyText]': 'null',
    '[attr.flip]': 'null',
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
    '[attr.showDropdownActions]': 'null',
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
      使 header(如 TextField)與 options 共享同一張 .mzn-dropdown-list 卡片。
      對齊 React DropdownItem 的 headerContent prop(DropdownItem.tsx:1004-1012)。
    -->
    <ng-template #headerTpl>
      <ng-content select="[mznDropdownHeader]" />
    </ng-template>
    @if (isInline()) {
      <!--
        Inline 模式(inputPosition='inside')對齊 React Dropdown.tsx:986-1014
        的 isInline 分支:不用 popper,整個 dropdown in-flow 渲染。
      -->
      @if (open()) {
        <div
          mznTranslate
          [in]="open()"
          [from]="translateFrom()"
          (onExited)="onTranslateExited()"
        >
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
            [showCheckIcon]="true"
            [status]="status()"
            [type]="type()"
            [value]="value()"
            (actionCancelled)="actionCancel.emit()"
            (actionCleared)="actionClear.emit()"
            (actionConfirmed)="actionConfirm.emit()"
            (actionCustomClicked)="actionCustom.emit()"
            (itemHovered)="itemHover.emit($event)"
            (leaveBottom)="leaveBottom.emit()"
            (reachBottom)="reachBottom.emit()"
            (scroll)="scroll.emit($event)"
            (selected)="onItemSelected($event)"
          ></div>
        </div>
      } @else {
        <ng-container *ngTemplateOutlet="headerTplRef() ?? null" />
      }
    } @else {
      <ng-template
        mznDropdownPopper
        [anchor]="anchor()!"
        [customWidth]="customWidth() ?? undefined"
        [flip]="flip()"
        [globalPortal]="globalPortal()"
        [open]="popperOpen()"
        [placement]="resolvedPlacement()"
        [sameWidth]="sameWidth()"
        [zIndex]="zIndex() ?? undefined"
        (placementChange)="onPositionUpdated($event)"
      >
        <div [class]="popperWithPortalClass()" data-mzn-dropdown-popper="true">
          <div
            mznTranslate
            [in]="open()"
            [from]="translateFrom()"
            (onExited)="onTranslateExited()"
          >
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
              [headerContentTemplate]="undefined"
              [listboxId]="listboxId()"
              [listboxLabel]="listboxLabel()"
              [loadingPosition]="loadingPosition()"
              [loadingText]="loadingText()"
              [maxHeight]="maxHeight()"
              [minWidth]="minWidth()"
              [mode]="mode()"
              [options]="options()"
              [showCheckIcon]="true"
              [status]="status()"
              [type]="type()"
              [value]="value()"
              (actionCancelled)="actionCancel.emit()"
              (actionCleared)="actionClear.emit()"
              (actionConfirmed)="actionConfirm.emit()"
              (actionCustomClicked)="actionCustom.emit()"
              (itemHovered)="itemHover.emit($event)"
              (leaveBottom)="leaveBottom.emit()"
              (reachBottom)="reachBottom.emit()"
              (scroll)="scroll.emit($event)"
              (selected)="onItemSelected($event)"
            ></div>
          </div>
        </div>
      </ng-template>
      <!--
        Outside 模式的 trigger 以 default ng-content 投影進 host 內,對齊
        React 把 trigger children clone 進 root 末端的行為。
        popper 透過 CDK Overlay portal,不在此處留下 DOM。
      -->
      <ng-content />
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

  /** 自訂操作按鈕文字（custom mode）。 */
  readonly actionText = input<string>();

  /**
   * 自訂操作按鈕（custom mode）的 ButtonProps 子集,鏡像 React Dropdown 的
   * `actionCustomButtonProps`。透傳給 footer custom 按鈕(variant/size/disabled/loading)。
   */
  readonly actionCustomButtonProps = input<DropdownActionButtonProps>();

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

  /** 空狀態圖示，覆蓋預設圖示。 */
  readonly emptyIcon = input<IconDefinition>();

  /** 空狀態顯示文字。 */
  readonly emptyText = input<string>();

  /**
   * 是否啟用 floating-ui `flip` middleware。設為 `true` 時,當選單於主軸空間
   * 不足會自動翻轉到對側(例如 `bottom-start` → `top-start`),且進場動畫方向
   * 會跟隨實際翻轉後的 placement。預設關閉以保留既有 placement 行為。
   * 鏡像 React `Dropdown` 的 `flip` prop。
   * @default false
   */
  readonly flip = input(false);

  /**
   * 搜尋高亮關鍵字。若明確指定,會覆蓋 `isMatchInputValue` 從 header input
   * 自動推導的字串;設為空字串 / undefined 則關閉高亮。
   * 對應 React `Dropdown.tsx:127` 的 `followText` prop。
   */
  readonly followText = input<string>();

  /**
   * 下拉選單 root element 的 DOM id,綁定至 host `[attr.id]`,對齊 React
   * `Dropdown.tsx:976` 把 `id` 套用到最外層 `div.mzn-dropdown` root。
   */
  readonly id = input<string>();

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
   * popper 模式是否透過 CDK Overlay 渲染到 document.body,避開 overflow 裁切與
   * stacking context 限制;inline 模式(inputPosition='inside')下無效。
   * CDK Overlay 一律 portal,故此 input 目前恆為 portal 行為,保留以維持
   * consumer API 相容。對齊 React `Dropdown.tsx:257` 的 `globalPortal`。 @default true
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

  /**
   * 是否顯示操作區（確認/取消/清除按鈕）。
   * @default false
   */
  readonly showDropdownActions = input(false);

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
   * 未設定時由 CDK Overlay 以遞增序號決定層級(後開啟者疊在先開啟者之上)。
   */
  readonly zIndex = input<number | string>();

  /** 取消事件（搭配 showDropdownActions 使用）。對齊 React `onActionCancel`。 */
  readonly actionCancel = output<void>();

  /** 清除事件（搭配 showDropdownActions 使用）。對齊 React `onActionClear`。 */
  readonly actionClear = output<void>();

  /** 確認事件（搭配 showDropdownActions 使用）。對齊 React `onActionConfirm`。 */
  readonly actionConfirm = output<void>();

  /** 自訂操作按鈕點擊事件（搭配 actionText 與 custom mode 使用）。對齊 React `onActionCustom`。 */
  readonly actionCustom = output<void>();

  /** 關閉事件。對齊 React `Dropdown.tsx:150` 的 `onClose`（去 `on` 前綴）。 */
  readonly close = output<void>();

  /**
   * 選項 hover 事件,參數為選項的 0-indexed 位置。通常由 parent 用來更新
   * `activeIndex`(hover-style highlight)。對齊 React `Dropdown.tsx:154`
   * 的 `onItemHover`（去 `on` 前綴）。
   */
  readonly itemHover = output<number>();

  /**
   * 開啟事件。對齊 React `Dropdown.tsx:158` 的 `onOpen`。
   *
   * 命名說明:React `onOpen` 去 `on` 前綴後為 `open`,但 `open` 已是
   * 控制開閉的 input,Angular 無法讓 input/output 同名,故此 output 維持
   * 過去式 `opened`(平台限制,記錄於 DEVIATIONS.md)。
   */
  readonly opened = output<void>();

  /**
   * 開閉狀態統一事件,切換時 emit `true` / `false`。對齊 React
   * `Dropdown.tsx:162` 的 `onVisibilityChange`（去 `on` 前綴）。
   */
  readonly visibilityChange = output<boolean>();

  /** 離開列表底部時觸發。對齊 React `onLeaveBottom`（去 `on` 前綴）。 */
  readonly leaveBottom = output<void>();

  /** 捲動至列表底部時觸發。對齊 React `onReachBottom`（去 `on` 前綴）。 */
  readonly reachBottom = output<void>();

  /**
   * 列表捲動事件,payload 為 `{ scrollTop, maxScrollTop }`。對齊 React
   * `Dropdown.tsx:259` 的 `onScroll`（去 `on` 前綴;Angular EventEmitter 不
   * 慣用多參數,僅取 `computed` payload,不含 React 第二參數 `target`）。
   */
  readonly scroll = output<{ scrollTop: number; maxScrollTop: number }>();

  /** 選取事件。對齊 React `Dropdown.tsx:166` 的 `onSelect`（去 `on` 前綴）。 */
  readonly select = output<DropdownOption>();

  protected readonly listHeaderClass = classes.listHeader;
  protected readonly listHeaderInnerClass = classes.listHeaderInner;

  /**
   * 打在 outside-mode popper wrapper 上的 class。`globalPortal=true` 時套用
   * `.mzn-dropdown-popper--with-portal` 把 `pointer-events` 重新打開為 `auto`,
   * 對齊 React `Dropdown.tsx:1016` + `_dropdown-styles.scss:200`。
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
   * mznDropdownItem 的 `headerContentTemplate` input。
   */
  protected readonly headerTplRef =
    viewChild<TemplateRef<unknown>>('headerTpl');

  /** outside 模式的 CDK overlay popper directive 實例(供 click-away 白名單)。 */
  private readonly popperRef = viewChild(MznDropdownPopper);

  /**
   * Resolved placement: forces 'bottom' when inputPosition is 'inside',
   * otherwise uses the placement input.
   */
  protected readonly resolvedPlacement = computed(
    (): Placement =>
      this.inputPosition() === 'inside' ? 'bottom' : this.placement(),
  );

  /**
   * floating-ui 實際解析(含 flip 翻轉)後的 placement,僅在 `flip` 啟用時用於
   * 決定進場動畫方向。由 `MznDropdownPopper` 的 `placementChange` 輸出驅動。
   */
  private readonly flippedPlacement = signal<Placement>('bottom-start');

  protected onPositionUpdated(placement: Placement): void {
    this.flippedPlacement.set(placement);
  }

  /**
   * MznTranslate 的 from 方向,鏡像 React Dropdown.tsx 的 translateFrom:
   * - isInline(inputPosition='inside')→ 'bottom'(list 從下方浮起)
   * - placement 以 'top' 開頭 → 'top'(list 出現在 trigger 上方,從上方滑下)
   * - 其他(bottom-/left-/right-*)→ 'bottom'
   *
   * 啟用 flip 時跟隨實際翻轉後的 placement,讓進場動畫從正確方向滑入。
   */
  protected readonly translateFrom = computed((): 'top' | 'bottom' => {
    if (this.inputPosition() === 'inside') return 'bottom';

    const placementBase = (
      this.flip() ? this.flippedPlacement() : this.resolvedPlacement()
    ).split('-')[0];

    return placementBase === 'top' ? 'top' : 'bottom';
  });

  /**
   * Build the DropdownActionProps passed to MznDropdownItem from the flat
   * action inputs, mirroring React's flat-only action props
   * (`actionCancelText` / `actionClearText` / … / `actionCustomButtonProps`).
   */
  protected readonly resolvedActionConfig = computed(
    (): DropdownActionProps => ({
      actionText: this.actionText(),
      cancelText: this.actionCancelText(),
      clearText: this.actionClearText(),
      confirmText: this.actionConfirmText(),
      customActionButtonProps: this.actionCustomButtonProps(),
      showActions: this.showDropdownActions(),
      showTopBar: this.showActionShowTopBar(),
    }),
  );

  /**
   * 最終傳入 MznDropdownItem 的 `followText`。`followText` input 顯式提供
   * 時優先使用;否則目前 Angular 無穩定途徑從 ng-content 讀取 input value,
   * 回傳 undefined(關閉高亮)。對應 React `Dropdown.tsx:506-525` 的 useMemo。
   */
  protected readonly resolvedFollowText = computed((): string | undefined => {
    const explicit = this.followText();

    if (explicit !== undefined) {
      return explicit !== null ? String(explicit) : undefined;
    }

    return undefined;
  });

  /**
   * Popper 實際掛載狀態,會在 open=true 時立即變 true,在 open=false
   * 後繼續維持為 true 直到內部 MznTranslate 的離場動畫完成,確保
   * popper 在動畫結束前不會被 detach。
   */
  protected readonly popperOpen = signal(false);

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
    // 各建一份 embedded view,切換時 DOM 會重建。open 轉為 true 時於 host 內
    // querySelector 第一個 input/textarea 並 focus。
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

    // anchor ARIA 注入:對齊 React 對 trigger element 注入 aria-haspopup /
    // aria-expanded / aria-controls(Dropdown.tsx cloneElement)。outside 模式
    // 的 anchor 是外部元素,Angular 不 clone,改在 effect 中直接設 attribute。
    effect(() => {
      const anchorRaw = this.anchor();
      const anchorEl =
        anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;

      if (!anchorEl || this.isInline()) return;

      anchorEl.setAttribute('aria-haspopup', 'listbox');
      anchorEl.setAttribute('aria-expanded', String(this.open()));
      anchorEl.setAttribute(
        'aria-controls',
        this.listboxId() ?? this.defaultListboxId,
      );
    });

    // Inline 模式 trigger ARIA 注入:inline 模式無 anchor,trigger 是
    // `[mznDropdownHeader]` 投影的 TextField。對齊 React 對 inline Input
    // clone 注入 role=combobox / aria-haspopup / aria-expanded / aria-controls
    // (isMatchInputValue 時加 aria-autocomplete=list)。投影內容在 host DOM 內,
    // 改 render 後 querySelector trigger element 設 attribute。
    effect(() => {
      if (!this.isInline()) return;

      const isOpen = this.open();
      const isMatch = this.isMatchInputValue();
      const controls = this.listboxId() ?? this.defaultListboxId;

      queueMicrotask(() => {
        const host = this.hostElRef.nativeElement;
        const header = host.querySelector('[mznDropdownHeader]');

        // 對齊 React inline closed:trigger 被 <Translate in> 包住,settled-in
        // 狀態套 identity transform(matrix(1,0,0,1,0,0))。Angular closed 分支
        // 以 ngTemplateOutlet 直接投影 header(無 mznTranslate wrapper,避免多一層
        // 破壞 ARIA 路徑對齊),故在此對 header 元素補上等效 identity transform。
        if (header instanceof HTMLElement) {
          header.style.transform = 'translate3d(0, 0, 0)';
        }

        const trigger =
          header?.querySelector('.mzn-text-field') ??
          header?.firstElementChild ??
          null;

        if (!(trigger instanceof HTMLElement)) return;

        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', String(isOpen));
        trigger.setAttribute('aria-controls', controls);

        if (isMatch) {
          trigger.setAttribute('aria-autocomplete', 'list');
        }
      });
    });

    // Transition detector:比對 lastOpen 與 current open() 以判斷本次 run 是
    // false→true 還是 true→false,對應 emit `opened` / `visibilityChange`。
    effect(() => {
      const isOpen = this.open();

      if (isOpen === this.lastOpen) return;

      this.lastOpen = isOpen;
      this.visibilityChange.emit(isOpen);

      if (isOpen) {
        this.opened.emit();
      } else {
        // 關閉時重置內部鍵盤 index,避免下次開啟時仍停留在舊位置。
        this.internalKeyboardIndex.set(-1);
      }
    });

    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        this.popperOpen.set(true);
      }

      if (isOpen) {
        // 把 anchor、host、以及 popper pane 一併視為「inside」,對齊 React
        // Dropdown 的 `!anchor.contains(target) && !popper.contains(target)`。
        // popper 內容經 CDK Overlay 搬到 body,故以 overlay pane(popperElRef)
        // 與 selector `[data-mzn-dropdown-popper]` 雙重判定確保穩定。
        const anchorRaw = this.anchor();
        const anchorEl =
          anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;
        const cleanup = this.clickAway.listen(
          [
            this.hostElRef.nativeElement,
            anchorEl,
            this.popperRef()?.popperElRef ?? null,
          ],
          (event) => {
            const target = event.target as HTMLElement | null;

            if (target?.closest('[data-mzn-dropdown-popper="true"]')) return;

            this.close.emit();
          },
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });

    // Outside 模式 keyboard forwarding:popper 渲染的 list 不在 trigger 的
    // DOM 樹裡,但使用者的 focus 通常停留在 trigger,因此把 anchor 的 keydown
    // 轉發到 host keyboard handler,讓 wrappers(MznAutocomplete、MznSelect)
    // 不需要各自重寫 nav 邏輯。
    effect((onCleanup) => {
      if (!this.open()) return;

      const anchorRaw = this.anchor();
      const anchorEl =
        anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;

      if (!anchorEl) return;

      const handler = (event: KeyboardEvent): void => this.onHostKeyDown(event);

      anchorEl.addEventListener('keydown', handler);
      onCleanup(() => anchorEl.removeEventListener('keydown', handler));
    });
  }

  /**
   * 未顯式提供 `listboxId` 時的後備 id,供 anchor 的 `aria-controls` 指向。
   * parity tool 會把所有 id 類 attribute 正規化為 `<id>`,故實際值不影響比對,
   * 僅需穩定存在。
   */
  private readonly defaultListboxId = `mzn-dropdown-listbox-${(dropdownListboxSeq += 1)}`;

  protected onTranslateExited(): void {
    if (!this.open()) {
      this.popperOpen.set(false);
    }
  }

  protected onItemSelected(option: DropdownOption): void {
    this.select.emit(option);

    if (this.mode() === 'single') {
      this.close.emit();
    }
  }

  /**
   * 內建鍵盤導覽:對齊 React `Dropdown.tsx:689-757` 的 handleBuiltinKeyDown。
   * 僅在 `open()` 時處理。tree 模式目前交由 MznDropdownItem 內部處理。
   */
  protected onHostKeyDown(event: KeyboardEvent): void {
    if (!this.open() || this.disabled()) return;

    // 若有外層 wrapper(如 MznAutocomplete)在同一事件上已呼叫
    // `event.preventDefault()` 表示它已消化掉此 key,MznDropdown 不重複處理。
    if (event.defaultPrevented) return;

    const type = this.type();

    if (type === 'tree') return;

    const count = this.flatOptionCount();

    if (count === 0) return;

    const key = event.key;

    if (key === 'Escape') {
      event.preventDefault();
      this.close.emit();

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
