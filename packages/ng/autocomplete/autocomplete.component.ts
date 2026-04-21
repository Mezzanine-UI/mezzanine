import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import {
  autocompleteClasses,
  AutoCompleteMode,
  AutoCompleteInputSize,
} from '@mezzanine-ui/core/autocomplete';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznClearActions } from '@mezzanine-ui/ng/clear-actions';
import { MznDropdown } from '@mezzanine-ui/ng/dropdown';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { SelectTriggerTagValue } from '@mezzanine-ui/ng/select';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import { AutocompleteCreationTracker } from './creation-tracker';

/**
 * 標記 AutoComplete 的 prefix 內容投影插槽。
 *
 * @example
 * ```html
 * <div mznAutocomplete [options]="opts">
 *   <i mznIcon mznAutocompletePrefix [icon]="searchIcon" ></i>
 * </div>
 * ```
 */
@Directive({
  selector: '[mznAutocompletePrefix]',
  standalone: true,
})
export class MznAutocompletePrefix {}

/**
 * 拆分文字為多段（依 separators），去空、可 trim。
 * 純函式，供 bulk-create 使用。
 */
export function getFullParsedList(
  text: string,
  separators: ReadonlyArray<string>,
  trim: boolean,
): ReadonlyArray<string> {
  let parts = [text];

  for (const sep of separators) {
    parts = parts.flatMap((p) => p.split(sep));
  }

  if (trim) {
    parts = parts.map((p) => p.trim());
  }

  return parts.filter((p) => p.length > 0);
}

/**
 * 自動完成選擇器元件,結合文字輸入與下拉選單過濾。
 *
 * 架構上是 `MznDropdown` 的 thin wrapper,對齊 React
 * `<AutoComplete>` → `<Dropdown>` 的組合(`AutoComplete.tsx:1208`)。
 * wrapper 本身負責:
 * - 搜尋 debounce、`asyncData` 載入、`disabledOptionsFilter` 過濾
 * - `addable` 模式的建立項追蹤(`AutocompleteCreationTracker`)、
 *   bulk-create paste、`onRemoveCreated` 清理
 * - Multiple mode 的 `SelectTrigger` tag 渲染 + counter/wrap overflow
 *   策略、clearable 清除按鈕
 * - ControlValueAccessor(ngModel)整合
 *
 * 清單渲染、鍵盤導覽、click-away、followText 高亮、selection 事件、
 * 載入/空狀態、action bar 建立按鈕全部委派給內層 `<div mznDropdown>`
 * (inside 模式用 `[mznDropdownHeader]` 投影輸入框;outside 模式用
 * `[anchor]="triggerEl"` 綁定本元件的 SelectTrigger)。
 *
 * 支援單選與多選模式,搜尋過濾、clearable、loading 與 error 狀態。
 * 多選模式下已選項目以 Tag 顯示,支援 overflow counter/wrap 策略。
 * 支援動態新增選項(addable)、批次新增(bulk create)、inside 輸入模式、
 * 滾動到底載入更多(onReachBottom)等進階功能。
 *
 * @example
 * ```html
 * import { MznAutocomplete } from '@mezzanine-ui/ng/autocomplete';
 *
 * <div mznAutocomplete
 *   [options]="fruits"
 *   [(ngModel)]="selectedFruit"
 *   placeholder="搜尋水果"
 *   (searchChange)="onSearch($event)"
 * ></div>
 *
 * <div mznAutocomplete
 *   mode="multiple"
 *   [options]="fruits"
 *   [(ngModel)]="selectedFruits"
 *   placeholder="搜尋水果"
 *   [clearable]="true"
 *   overflowStrategy="wrap"
 * ></div>
 *
 * <div mznAutocomplete
 *   [options]="opts"
 *   [addable]="true"
 *   [onInsert]="handleInsert"
 *   placeholder="可新增選項"
 * ></div>
 * ```
 *
 * @see MznDropdown
 * @see MznSelect
 */
@Component({
  selector: '[mznAutocomplete]',
  standalone: true,
  imports: [MznClearActions, MznDropdown, MznIcon, MznTag, MznTextField],
  providers: [provideValueAccessor(MznAutocomplete)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.active]': 'null',
    '[attr.addable]': 'null',
    '[attr.asyncData]': 'null',
    '[attr.clearable]': 'null',
    '[attr.clearSearchText]': 'null',
    '[attr.createActionText]': 'null',
    '[attr.createActionTextTemplate]': 'null',
    '[attr.createSeparators]': 'null',
    '[attr.disabled]': 'null',
    '[attr.disabledOptionsFilter]': 'null',
    '[attr.dropdownZIndex]': 'null',
    '[attr.emptyText]': 'null',
    '[attr.error]': 'null',
    '[attr.inputPosition]': 'null',
    '[attr.loading]': 'null',
    '[attr.loadingPosition]': 'null',
    '[attr.loadingText]': 'null',
    '[attr.menuMaxHeight]': 'null',
    '[attr.mode]': 'null',
    '[attr.id]': 'null',
    '[attr.name]': 'null',
    '[attr.open]': 'null',
    '[attr.options]': 'null',
    '[attr.overflowStrategy]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.required]': 'null',
    '[attr.searchDebounceTime]': 'null',
    '[attr.size]': 'null',
    '[attr.stepByStepBulkCreate]': 'null',
    '[attr.trimOnCreate]': 'null',
  },
  template: `
    @if (inputPosition() === 'outside') {
      <div #triggerEl [class]="triggerClasses()" (click)="onTriggerClick()">
        @if (hasPrefix()) {
          <div [class]="prefixClass">
            <ng-content select="[mznAutocompletePrefix]" />
          </div>
        }
        @if (mode() === 'multiple') {
          <div [class]="tagsInputWrapperClasses()">
            @if (overflowStrategy() === 'counter') {
              <!-- Counter mode: tags container + fake measurement tags -->
              <div
                #counterTagsContainer
                [class]="counterTagsContainerClasses"
                style="min-width: 0; position: relative; overflow: hidden;"
              >
                @for (item of visibleTagValues(); track item.id) {
                  @if (readOnly()) {
                    <span
                      mznTag
                      type="static"
                      [size]="size()"
                      [label]="item.name"
                      [readOnly]="true"
                    ></span>
                  } @else {
                    <span
                      mznTag
                      type="dismissable"
                      [disabled]="disabled()"
                      [label]="item.name"
                      [size]="size()"
                      (close)="onTagClose(item); $event.stopPropagation()"
                    ></span>
                  }
                }
                @if (counterOverflowCount() > 0) {
                  <span
                    mznTag
                    type="overflow-counter"
                    [count]="counterOverflowCount()"
                    [disabled]="disabled()"
                    [size]="size()"
                  ></span>
                }
                <!-- Fake tags for measurement (hidden, uses triggerTags WITHOUT --ellipsis so tags don't shrink) -->
                <div
                  [class]="fakeTagsContainerClass"
                  aria-hidden="true"
                  style="position: absolute; pointer-events: none; visibility: hidden; opacity: 0; inset: 0;"
                >
                  @for (item of selectedTagValues(); track item.id) {
                    <span class="mzn-select-trigger__fake-tag">
                      <span
                        mznTag
                        type="dismissable"
                        [disabled]="true"
                        [size]="size()"
                        [label]="item.name"
                      ></span>
                    </span>
                  }
                  <span class="mzn-select-trigger__fake-ellipsis">
                    <span
                      mznTag
                      type="overflow-counter"
                      [count]="99"
                      [size]="size()"
                    ></span>
                  </span>
                </div>
              </div>
            } @else {
              <!-- Wrap mode: inline tags in flex-wrap flow -->
              @for (item of selectedTagValues(); track item.id) {
                <span>
                  @if (readOnly()) {
                    <span
                      mznTag
                      type="static"
                      [size]="size()"
                      [label]="item.name"
                      [readOnly]="true"
                    ></span>
                  } @else {
                    <span
                      mznTag
                      type="dismissable"
                      [disabled]="disabled()"
                      [label]="item.name"
                      [size]="size()"
                      (close)="onTagClose(item); $event.stopPropagation()"
                    ></span>
                  }
                </span>
              }
            }
            <!-- Search input: always the last flex child inside wrapper -->
            <div [class]="tagsInputClass">
              <input
                #inputEl
                type="search"
                [id]="id() ?? null"
                [placeholder]="hasValue() ? '' : placeholder()"
                [disabled]="disabled()"
                [name]="name() ?? null"
                [required]="required()"
                [value]="searchText()"
                (input)="onSearchInput($event)"
                (focus)="onInputFocus()"
                (keydown)="onInputKeydown($event)"
                (paste)="onPaste($event)"
              />
            </div>
          </div>
        } @else {
          <!-- Single mode: simple input -->
          <input
            #inputEl
            type="text"
            [class]="triggerInputClass"
            [id]="id() ?? null"
            [placeholder]="inputPlaceholder()"
            [disabled]="disabled()"
            [readOnly]="readOnly()"
            [name]="name() ?? null"
            [required]="required()"
            [value]="searchText()"
            (input)="onSearchInput($event)"
            (focus)="onInputFocus()"
            (keydown)="onInputKeydown($event)"
            (paste)="onPaste($event)"
          />
        }
        @if (shouldShowClearable()) {
          <button
            mznClearActions
            type="clearable"
            [class]="clearIconClass"
            tabindex="-1"
            (mousedown)="$event.preventDefault()"
            (clicked)="onClear(); $event.stopPropagation()"
          ></button>
        }
        <span [class]="suffixClass">
          <i mznIcon [icon]="chevronDownIcon" [class]="suffixIconClasses()"></i>
        </span>
      </div>
    } @else {
      <div #triggerEl [class]="insideTriggerClasses()">
        <ng-content select="[mznAutocompletePrefix]" />
      </div>
    }
    <!--
      Inside mode: delegate list/popper/keyboard to MznDropdown. 輸入框經
      [mznDropdownHeader] 投影進 <ul class="mzn-dropdown-list"> 的第一個
      <li>,與 options 共享同一張卡片;鍵盤 nav、click-away、followText
      highlight 全由 MznDropdown 內建邏輯負責,MznAutocomplete 只處理
      搜尋 debounce、建立新項、tag 渲染等 wrapper 層專屬邏輯。
    -->
    @if (inputPosition() === 'inside') {
      <div
        mznDropdown
        inputPosition="inside"
        [actionText]="createActionDisplayText()"
        [emptyText]="emptyText()"
        [followText]="searchText()"
        [loadingPosition]="loadingPosition()"
        [loadingText]="loadingText()"
        [maxHeight]="menuMaxHeight()"
        [mode]="mode()"
        [open]="isOpen()"
        [options]="dropdownOptions()"
        [showActionShowTopBar]="true"
        [showDropdownActions]="shouldShowCreateAction()"
        [status]="dropdownInlineStatus()"
        [value]="internalValue()"
        (actionCustomClicked)="onCreateActionClick()"
        (closed)="handleClose()"
        (leaveBottom)="leaveBottom.emit()"
        (reachBottom)="reachBottom.emit()"
        (selected)="onOptionClick($event)"
        (visibilityChange)="onDropdownVisibilityChangeFromInline($event)"
      >
        <div mznDropdownHeader>
          <div
            mznTextField
            [active]="!isEffectiveLoading()"
            [fullWidth]="true"
            [disabled]="disabled() || isEffectiveLoading()"
            [size]="insideInputTextFieldSize()"
          >
            <input
              #inputEl
              type="text"
              [placeholder]="placeholder()"
              [disabled]="disabled() || isEffectiveLoading()"
              [value]="searchText()"
              (input)="onSearchInput($event)"
              (keydown)="onInputKeydown($event)"
              (paste)="onPaste($event)"
            />
          </div>
        </div>
      </div>
    } @else {
      <!--
        Outside mode: same delegation pattern as inside mode, but the
        trigger lives in the component's own template (SelectTrigger)
        and is passed via [anchor] so MznDropdown can position the
        floating popper + sameWidth middleware takes the anchor width.
        globalPortal mirrors the legacy default (render through
        MznPortal for stacking-context isolation).
      -->
      <div
        mznDropdown
        inputPosition="outside"
        placement="bottom-start"
        [actionText]="createActionDisplayText()"
        [anchor]="triggerElRef()!"
        [emptyText]="emptyText()"
        [followText]="searchText()"
        [globalPortal]="true"
        [loadingPosition]="loadingPosition()"
        [loadingText]="loadingText()"
        [maxHeight]="menuMaxHeight()"
        [mode]="mode()"
        [open]="isOpen()"
        [options]="dropdownOptions()"
        [sameWidth]="true"
        [showActionShowTopBar]="true"
        [showDropdownActions]="shouldShowCreateAction()"
        [status]="dropdownInlineStatus()"
        [value]="internalValue()"
        [zIndex]="dropdownZIndex() ?? undefined"
        (actionCustomClicked)="onCreateActionClick()"
        (closed)="handleClose()"
        (leaveBottom)="leaveBottom.emit()"
        (reachBottom)="reachBottom.emit()"
        (selected)="onOptionClick($event)"
        (visibilityChange)="onDropdownVisibilityChangeFromInline($event)"
      ></div>
    }
  `,
})
export class MznAutocomplete
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly triggerElRef =
    viewChild<ElementRef<HTMLElement>>('triggerEl');
  private readonly inputElRef =
    viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private readonly counterTagsContainerRef = viewChild<ElementRef<HTMLElement>>(
    'counterTagsContainer',
  );

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // ── Prefix content projection (A2) ──
  private readonly prefixRef = contentChild(MznAutocompletePrefix);

  // ── Creation Tracker (A8) ──
  private readonly creationTracker = new AutocompleteCreationTracker();

  // ── Counter overflow state ──
  private counterResizeObserver: ResizeObserver | null = null;
  private readonly counterVisibleCount = signal<number>(Infinity);

  // ── Async data state (A5) ──
  private readonly internalLoading = signal(false);
  private requestSeq = 0;

  // ── Bulk create state (A9) ──
  protected readonly insertText = signal('');

  // ────────────────────────────────────────────
  //  Inputs
  // ────────────────────────────────────────────

  /**
   * 是否處於 active 狀態。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否啟用動態新增選項。需搭配 `onInsert` 或 `inserted` 使用。
   * @default false
   */
  readonly addable = input(false);

  /**
   * 非同步資料模式。啟用時，搜尋觸發後自動追蹤 loading 狀態，
   * 直到 `options` 變更時自動結束 loading。
   * @default false
   */
  readonly asyncData = input(false);

  /**
   * 是否可清除已選值。
   * @default false
   */
  readonly clearable = input(false);

  /**
   * 失焦後是否清除搜尋文字。
   * `false` 時保留使用者輸入的文字。
   * @default true
   */
  readonly clearSearchText = input(true);

  /**
   * 建立動作按鈕的自訂文字函式。
   * 優先於 `createActionTextTemplate`。
   */
  readonly createActionText = input<(text: string) => string>();

  /**
   * 建立動作按鈕的文字模板，以 `{text}` 作為替換佔位符。
   * @default '建立 "{text}"'
   */
  readonly createActionTextTemplate = input('建立 "{text}"');

  /**
   * 批次新增的分隔符號。
   * @default [',', '+', '\\n']
   */
  readonly createSeparators = input<ReadonlyArray<string>>([',', '+', '\n']);

  /** 是否禁用。 */
  readonly disabled = input(false);

  /**
   * 停用內建的 substring 過濾，改由消費者透過 `searchChange` 自行更新 `options`。
   * @default false
   */
  readonly disabledOptionsFilter = input(false);

  /** 下拉選單的 z-index。 */
  readonly dropdownZIndex = input<number>();

  /**
   * 無符合選項時顯示的文字。
   * @default '沒有符合的項目'
   */
  readonly emptyText = input('沒有符合的項目');

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 搜尋輸入框的位置。
   * - `'outside'`：輸入框在 trigger 區域（預設）。
   * - `'inside'`：輸入框在下拉面板內部。
   * @default 'outside'
   */
  readonly inputPosition = input<'outside' | 'inside'>('outside');

  /**
   * 是否顯示載入中狀態。
   * @default false
   */
  readonly loading = input(false);

  /**
   * 載入中狀態的顯示位置。
   * - `'full'` — 全畫面 loading，取代整個選項列表。
   * - `'bottom'` — 選項列表保持顯示，底部加載 loading 指示器。
   * @default 'bottom'
   */
  readonly loadingPosition = input<'full' | 'bottom'>('bottom');

  /**
   * 載入中狀態文字。
   * @default '載入中...'
   */
  readonly loadingText = input('載入中...');

  /** 下拉選單的最大高度（px）。 */
  readonly menuMaxHeight = input<number>();

  /**
   * 選取模式。
   * @default 'single'
   */
  readonly mode = input<AutoCompleteMode>('single');

  /**
   * input 元素的 id 屬性，供表單與 label 關聯使用。
   * 等效 React 版 `id` prop。
   */
  readonly id = input<string>();

  /** input 的 name 屬性，供表單使用。 */
  readonly name = input<string>();

  /**
   * 新增選項的同步回呼（callback input）。
   * 回傳值為更新後的 options 陣列，元件會立即使用。
   * 優先於 `inserted` output。
   */
  readonly onInsert =
    input<
      (
        text: string,
        currentOptions: ReadonlyArray<DropdownOption>,
      ) => ReadonlyArray<DropdownOption>
    >();

  /**
   * 關閉下拉時清理未選中的動態新增選項。
   * 回呼收到的是清理後的 options 陣列。
   */
  readonly onRemoveCreated =
    input<(cleanedOptions: ReadonlyArray<DropdownOption>) => void>();

  /** 是否受控模式下的開啟狀態。 */
  readonly open = input<boolean>();

  /** 選項列表。 */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /**
   * 多選模式的溢出策略。
   * - `'wrap'`：換行顯示所有標籤。
   * - `'counter'`：固定單行，超出以 +N 計數器顯示。
   * @default 'wrap'
   */
  readonly overflowStrategy = input<'counter' | 'wrap'>('wrap');

  /** 佔位文字。 */
  readonly placeholder = input('');

  /** 是否唯讀。 */
  readonly readOnly = input(false);

  /**
   * 是否必填。
   * @default false
   */
  readonly required = input(false);

  /**
   * 搜尋防抖時間（毫秒）。
   * @default 0
   */
  readonly searchDebounceTime = input(0);

  /**
   * 欄位尺寸。
   * @default 'main'
   */
  readonly size = input<AutoCompleteInputSize>('main');

  /**
   * 逐步批次新增模式。啟用時，貼上多筆項目後一次只建立第一筆。
   * @default false
   */
  readonly stepByStepBulkCreate = input(false);

  /**
   * 建立項目時是否自動去除前後空白。
   * @default true
   */
  readonly trimOnCreate = input(true);

  // ────────────────────────────────────────────
  //  Outputs
  // ────────────────────────────────────────────

  /** 搜尋文字變更事件（經 debounce）。 */
  readonly searchChange = output<string>();

  /** 搜尋文字原始變更事件（每次 input 立即觸發，無 debounce）。 */
  readonly searchTextChange = output<string>();

  /** 選取變更事件（單選或多選的每次 toggle 都會觸發）。 */
  readonly selectionChange = output<DropdownOption>();

  /** 多選模式下值陣列變更事件。 */
  readonly valueChange = output<ReadonlyArray<string>>();

  /** 清除事件。 */
  readonly cleared = output<void>();

  /** 下拉選單可見性變更事件。 */
  readonly visibilityChange = output<boolean>();

  /** 滾動到底事件。 */
  readonly reachBottom = output<void>();

  /** 離開底部事件。 */
  readonly leaveBottom = output<void>();

  /** 新增選項事件（output 風格）。 */
  readonly inserted = output<{
    text: string;
    currentOptions: ReadonlyArray<DropdownOption>;
  }>();

  /** 清理動態新增選項事件（output 風格）。 */
  readonly removeCreated = output<ReadonlyArray<DropdownOption>>();

  // ────────────────────────────────────────────
  //  Protected constants
  // ────────────────────────────────────────────

  protected readonly chevronDownIcon = ChevronDownIcon;

  // ────────────────────────────────────────────
  //  Internal signals
  // ────────────────────────────────────────────

  protected readonly isOpenInternal = signal(false);
  protected readonly searchText = signal('');
  protected readonly internalValue = signal<ReadonlyArray<string>>([]);

  // ────────────────────────────────────────────
  //  Computed
  // ────────────────────────────────────────────

  protected readonly isOpen = computed((): boolean =>
    this.open() !== undefined ? this.open()! : this.isOpenInternal(),
  );

  /** asyncData 啟用時合併 internal + external loading。 */
  protected readonly isEffectiveLoading = computed((): boolean =>
    this.asyncData()
      ? this.internalLoading() || this.loading()
      : this.loading(),
  );

  /**
   * 傳給 `<div mznDropdown [status]>` 的非同步狀態:
   * - `loading` — 載入中。
   * - `empty` — 無選項且非載入中。
   * - `undefined` — 正常渲染選項。
   * MznDropdownItem 內部會根據 `loadingPosition` 自行決定全畫面或底部
   * 載入指示,wrapper 不需重算 full/bottom 旗標。
   */
  protected readonly dropdownInlineStatus = computed(
    (): 'loading' | 'empty' | undefined => {
      if (this.isEffectiveLoading()) return 'loading';

      return this.dropdownOptions().length === 0 ? 'empty' : undefined;
    },
  );

  private readonly selectedIds = computed(
    (): ReadonlySet<string> => new Set(this.internalValue()),
  );

  protected readonly hasValue = computed(
    (): boolean => this.internalValue().length > 0,
  );

  protected readonly hasPrefix = computed(
    (): boolean => this.prefixRef() !== undefined,
  );

  protected readonly selectedTagValues = computed(
    (): ReadonlyArray<SelectTriggerTagValue> => {
      const ids = this.internalValue();
      const opts = this.options();

      return ids.map((id) => ({
        id,
        name: opts.find((o) => o.id === id)?.name ?? id,
      }));
    },
  );

  protected readonly inputPlaceholder = computed((): string => {
    if (this.mode() === 'multiple' && this.hasValue()) return '';

    // 單選 focused 時若已有值，用選中項名稱作為 placeholder
    if (this.mode() === 'single' && this.isOpen() && this.hasValue()) {
      const id = this.internalValue()[0];
      const opt = this.options().find((o) => o.id === id);

      return opt?.name ?? this.placeholder();
    }

    return this.placeholder();
  });

  protected readonly filteredOptions = computed(
    (): ReadonlyArray<DropdownOption> => {
      const search = this.searchText().toLowerCase();

      if (this.disabledOptionsFilter() || !search) return this.options();

      return this.options().filter((o) =>
        o.name.toLowerCase().includes(search),
      );
    },
  );

  /**
   * 根據 mode + inputPosition 決定每個選項的 `checkSite`,對齊 React
   * `AutoComplete.tsx:934-943`:
   * - `multiple` + `outside` → `'prefix'`(Checkbox 顯示於選項左側)
   * - `multiple` + `inside`  → `'suffix'`(check icon 於右側,視覺上更輕)
   * - `single`(任一 inputPosition) → `'suffix'`
   *
   * 沒有此轉換時,MznDropdownItem 會依 `option.checkSite ?? 'suffix'` 預設
   * 全部落到 suffix,導致 outside multi-select 缺少左側 Checkbox。
   */
  private readonly resolvedCheckSite = computed((): 'prefix' | 'suffix' =>
    this.mode() === 'multiple' && this.inputPosition() !== 'inside'
      ? 'prefix'
      : 'suffix',
  );

  /**
   * 在 filteredOptions 基礎上:
   * - 將 `checkSite` 覆寫為 mode+inputPosition 計算出的結果。
   * - 建立項 bubble to top 並加上 `shortcutText = 'New'`(對齊 React
   *   `AutoComplete.tsx:947`)。
   */
  protected readonly dropdownOptions = computed(
    (): ReadonlyArray<DropdownOption> => {
      const filtered = this.filteredOptions();
      const checkSite = this.resolvedCheckSite();
      const created: DropdownOption[] = [];
      const rest: DropdownOption[] = [];

      for (const opt of filtered) {
        const mapped: DropdownOption = { ...opt, checkSite };

        if (this.creationTracker.hasCreated(opt.id)) {
          mapped.shortcutText = mapped.shortcutText ?? 'New';
          created.push(mapped);
        } else {
          rest.push(mapped);
        }
      }

      return created.length ? [...created, ...rest] : rest;
    },
  );

  /** Counter 模式的可見 tag 值。 */
  protected readonly visibleTagValues = computed(
    (): ReadonlyArray<SelectTriggerTagValue> => {
      const count = this.counterVisibleCount();
      const vals = this.selectedTagValues();

      if (count === Infinity || count >= vals.length) return vals;

      return vals.slice(0, count);
    },
  );

  /** Counter 模式溢出的數量。 */
  protected readonly counterOverflowCount = computed((): number => {
    const count = this.counterVisibleCount();
    const total = this.selectedTagValues().length;

    if (count === Infinity || count >= total) return 0;

    return total - count;
  });

  /**
   * 是否加上 clearable class（控制佈局：min-width 覆蓋為 0）。
   * 對齊 React：SelectTrigger 永遠接收 `clearable={true}`，因此
   * `--clearable` class 只在 `clearable()` 為 true 時才加上。
   * 若 `clearable` 為 false 卻強制加上 `--clearable`，hover 時
   * suffix 消失但 clear-icon 不渲染，造成視覺寬度縮小。
   */
  protected readonly shouldForceClearable = computed((): boolean => {
    if (!this.clearable()) return false;

    if (this.mode() === 'multiple') {
      return this.hasValue() || !!this.searchText().trim();
    }

    return (
      this.hasValue() || (!this.clearSearchText() && !!this.searchText().trim())
    );
  });

  /** clearable icon 是否顯示。 */
  protected readonly shouldShowClearable = computed((): boolean => {
    if (!this.clearable()) return false;

    if (this.mode() === 'multiple') {
      return this.hasValue() || !!this.searchText().trim();
    }

    // single
    return (
      this.hasValue() || (!this.clearSearchText() && !!this.searchText().trim())
    );
  });

  /** 是否應顯示建立動作按鈕。 */
  protected readonly shouldShowCreateAction = computed((): boolean => {
    if (!this.addable()) return false;
    if (!this.onInsert()) return false;

    const text = this.getCreateActionTargetText();

    if (!text) return false;

    // 檢查是否已存在同名選項
    const lowerText = text.toLowerCase();

    return !this.filteredOptions().some(
      (o) => o.name.toLowerCase() === lowerText,
    );
  });

  /** 建立動作按鈕的顯示文字。 */
  protected readonly createActionDisplayText = computed((): string => {
    const text = this.getCreateActionTargetText();

    if (!text) return '';

    const customFn = this.createActionText();

    if (customFn) return customFn(text);

    return this.createActionTextTemplate().replace('{text}', text);
  });

  // ────────────────────────────────────────────
  //  CSS classes
  // ────────────────────────────────────────────

  protected readonly hostClasses = computed((): string =>
    clsx(autocompleteClasses.host, autocompleteClasses.hostMode(this.mode()), {
      [autocompleteClasses.hostInsideClosed]:
        this.inputPosition() === 'inside' && !this.isOpen(),
    }),
  );

  protected readonly triggerClasses = computed((): string =>
    clsx(
      textFieldClasses.host,
      {
        [textFieldClasses.main]: this.size() === 'main',
        [textFieldClasses.sub]: this.size() === 'sub',
        [textFieldClasses.active]: this.isOpen(),
        [textFieldClasses.error]: this.error(),
        [textFieldClasses.disabled]: this.disabled(),
        [textFieldClasses.readonly]: this.readOnly(),
        [textFieldClasses.fullWidth]: true,
        [textFieldClasses.clearable]: this.shouldForceClearable(),
      },
      classes.trigger,
      classes.triggerMode(this.mode()),
      classes.triggerSelected(this.hasValue() ? true : null),
      {
        [classes.triggerDisabled]: this.disabled(),
        [classes.triggerReadOnly]: this.readOnly(),
      },
    ),
  );

  protected readonly tagsInputWrapperClasses = computed((): string =>
    clsx(
      classes.triggerTagsInputWrapper,
      this.overflowStrategy() === 'wrap'
        ? classes.triggerTagsInputWrapperWrap
        : classes.triggerTagsInputWrapperEllipsis,
    ),
  );

  protected readonly insideTriggerClasses = computed((): string =>
    clsx(autocompleteClasses.host, {
      [autocompleteClasses.hostInsideClosed]: !this.isOpen(),
    }),
  );

  protected readonly suffixIconClasses = computed((): string =>
    clsx(classes.triggerSuffixActionIcon, {
      [classes.triggerSuffixActionIconActive]: this.isOpen(),
    }),
  );

  protected readonly triggerInputClass = classes.triggerInput;
  protected readonly clearIconClass = textFieldClasses.clearIcon;
  protected readonly suffixClass = textFieldClasses.suffix;
  protected readonly prefixClass = textFieldClasses.prefix;
  protected readonly tagsInputClass = classes.triggerTagsInput;
  protected readonly counterTagsContainerClasses = clsx(
    classes.triggerTags,
    classes.triggerTagsEllipsis,
  );
  protected readonly fakeTagsContainerClass = classes.triggerTags;

  protected readonly insideInputTextFieldSize = computed((): 'main' | 'sub' =>
    this.size() === 'sub' ? 'sub' : 'main',
  );

  // ────────────────────────────────────────────
  //  CVA
  // ────────────────────────────────────────────

  private onChange: (value: ReadonlyArray<string> | string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: ReadonlyArray<string> | string | null): void {
    if (value === null || value === undefined) {
      this.internalValue.set([]);
    } else if (typeof value === 'string') {
      this.internalValue.set(value ? [value] : []);
    } else {
      this.internalValue.set(value);
    }

    // 單選時設定 searchText 為選中項名稱
    if (this.mode() === 'single') {
      const v = typeof value === 'string' ? value : (value?.[0] ?? '');
      const opt = this.options().find((o) => o.id === v);

      this.searchText.set(opt?.name ?? '');
    }
  }

  registerOnChange(fn: (value: ReadonlyArray<string> | string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // ────────────────────────────────────────────
  //  Public API (A6)
  // ────────────────────────────────────────────

  /** 程式化重置搜尋文字與選取值。 */
  resetSearchText(): void {
    this.searchText.set('');
    this.insertText.set('');
    this.internalValue.set([]);
    this.onChange(this.mode() === 'single' ? '' : []);
  }

  /** 程式化設定搜尋文字。 */
  setSearchTextValue(text: string): void {
    this.searchText.set(text);

    const inputEl = this.inputElRef()?.nativeElement;

    if (inputEl) {
      inputEl.value = text;
    }
  }

  // ────────────────────────────────────────────
  //  Constructor & Effects
  // ────────────────────────────────────────────

  constructor() {
    // Click-away is owned by the nested MznDropdown — its listener already
    // whitelists the trigger anchor + its own host + the portal'd popper
    // element, then emits `closed` which MznAutocomplete translates to
    // `handleClose()` below. Duplicating the listener here would either
    // (a) fire twice on the same click or (b) fire incorrectly when the
    // popper is portal'd to body because MznAutocomplete's host does not
    // contain the portal target. Removed in the Dropdown delegation
    // refactor (2026-04).

    // AsyncData: reset internalLoading when options change (search complete)
    effect(() => {
      this.options(); // track dependency

      if (this.asyncData() && this.internalLoading()) {
        this.internalLoading.set(false);
      }
    });

    // Re-measure counter overflow when selected values change
    effect(() => {
      this.selectedTagValues(); // track dependency

      if (this.overflowStrategy() === 'counter' && this.mode() === 'multiple') {
        // Schedule measurement after DOM update
        setTimeout(() => this.recalculateCounterOverflow(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.overflowStrategy() === 'counter' && this.mode() === 'multiple') {
      this.setupCounterResizeObserver();
    }
  }

  ngOnDestroy(): void {
    this.counterResizeObserver?.disconnect();
    this.counterResizeObserver = null;
  }

  private setupCounterResizeObserver(): void {
    const containerEl = this.counterTagsContainerRef()?.nativeElement;

    if (!containerEl) return;

    // 觀察 wrapper（父元素），因為外部寬度決定可用空間
    const wrapperEl = containerEl.parentElement;

    if (!wrapperEl) return;

    this.counterResizeObserver = new ResizeObserver(() => {
      this.recalculateCounterOverflow();
    });

    this.counterResizeObserver.observe(wrapperEl);
  }

  private recalculateCounterOverflow(): void {
    const containerEl = this.counterTagsContainerRef()?.nativeElement;

    if (!containerEl) return;

    const fakeTagsWrapper = containerEl.querySelector<HTMLElement>(
      '[aria-hidden="true"]',
    );

    if (!fakeTagsWrapper) return;

    const fakeTagSpans = Array.from(
      fakeTagsWrapper.querySelectorAll<HTMLElement>(
        '.mzn-select-trigger__fake-tag',
      ),
    );
    const fakeEllipsis = fakeTagsWrapper.querySelector<HTMLElement>(
      '.mzn-select-trigger__fake-ellipsis',
    );

    if (fakeTagSpans.length === 0) return;

    // 從 wrapper 寬度減去 input 的 min-width 計算可用空間（避免雞生蛋問題）
    const wrapperEl = containerEl.parentElement;
    const wrapperWidth = wrapperEl
      ? wrapperEl.clientWidth
      : containerEl.clientWidth;
    const inputEl = wrapperEl?.querySelector<HTMLElement>(
      '.mzn-select-trigger__tags-input',
    );
    const inputMinWidthStr = inputEl ? getComputedStyle(inputEl).minWidth : '0';
    const inputMinWidth = inputMinWidthStr.endsWith('%')
      ? (wrapperWidth * parseFloat(inputMinWidthStr)) / 100
      : parseFloat(inputMinWidthStr) || 0;
    const containerWidth = wrapperWidth - inputMinWidth;
    const ellipsisWidth = fakeEllipsis
      ? fakeEllipsis.getBoundingClientRect().width + 4
      : 56;
    const gap = 4;

    let usedWidth = 0;
    let visibleCount = 0;

    for (let i = 0; i < fakeTagSpans.length; i++) {
      const tagWidth = fakeTagSpans[i].getBoundingClientRect().width + gap;
      const remainingTags = fakeTagSpans.length - visibleCount - 1;
      const neededWidth =
        remainingTags > 0
          ? usedWidth + tagWidth + ellipsisWidth + gap
          : usedWidth + tagWidth;

      if (neededWidth <= containerWidth) {
        usedWidth += tagWidth;
        visibleCount++;
      } else {
        break;
      }
    }

    const newCount = visibleCount > 0 ? visibleCount : 1;

    if (newCount !== this.counterVisibleCount()) {
      this.counterVisibleCount.set(newCount);
      this.cdr.markForCheck();
    }
  }

  // ────────────────────────────────────────────
  //  Event handlers
  // ────────────────────────────────────────────

  protected onTriggerClick(): void {
    if (this.disabled() || this.readOnly()) return;

    this.isOpenInternal.set(true);
    this.visibilityChange.emit(true);
  }

  protected onInputFocus(): void {
    this.onTouched();

    if (!this.disabled() && !this.readOnly()) {
      this.isOpenInternal.set(true);
      this.visibilityChange.emit(true);
    }
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    // Enter key: handle creation
    if (event.key === 'Enter' && this.handleEnterKey()) {
      event.preventDefault();

      return;
    }

    if (this.mode() !== 'multiple') return;

    const val = this.internalValue();

    if (val.length === 0 || this.searchText()) return;

    if (event.key === 'Backspace') {
      event.preventDefault();
      const next = val.slice(0, -1);

      this.internalValue.set(next);
      this.onChange(next);
      this.valueChange.emit(next);
    } else if (event.key === 'Delete') {
      event.preventDefault();
      const next = val.slice(1);

      this.internalValue.set(next);
      this.onChange(next);
      this.valueChange.emit(next);
    }
  }

  protected onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;

    this.searchText.set(val);
    this.insertText.set(val);

    // A3: immediate (non-debounced) text change
    this.searchTextChange.emit(val);

    if (!this.isOpen()) {
      this.isOpenInternal.set(true);
      this.visibilityChange.emit(true);
    }

    // A5: mark loading for async data
    if (this.asyncData() && val) {
      this.requestSeq++;
      this.internalLoading.set(true);
    }

    const debounce = this.searchDebounceTime();

    if (debounce > 0) {
      if (this.debounceTimer !== null) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.searchChange.emit(val);
        this.debounceTimer = null;
      }, debounce);
    } else {
      this.searchChange.emit(val);
    }
  }

  protected onOptionClick(option: DropdownOption): void {
    if (this.mode() === 'single') {
      this.internalValue.set([option.id]);
      this.searchText.set(option.name);
      this.onChange(option.id);
      this.selectionChange.emit(option);
      this.isOpenInternal.set(false);
      this.visibilityChange.emit(false);

      // Mark created items deselected if switching away
      this.clearNewlyCreated([option.id]);
    } else {
      const current = this.internalValue();
      const wasSelected = current.includes(option.id);
      const next = wasSelected
        ? current.filter((id) => id !== option.id)
        : [...current, option.id];

      this.internalValue.set(next);
      this.onChange(next);
      this.valueChange.emit(next);
      this.selectionChange.emit(option);
      this.searchText.set('');
      this.insertText.set('');

      // Track unselected created items
      if (wasSelected && this.creationTracker.hasCreated(option.id)) {
        this.markUnselected([option.id]);
      } else {
        this.clearNewlyCreated([option.id]);
      }
    }
  }

  protected onTagClose(item: SelectTriggerTagValue): void {
    const next = this.internalValue().filter((id) => id !== item.id);

    this.internalValue.set(next);
    this.onChange(next);
    this.valueChange.emit(next);

    if (this.creationTracker.hasCreated(item.id)) {
      this.markUnselected([item.id]);
    }
  }

  protected onClear(): void {
    // Mark all created items as unselected
    const currentValue = this.internalValue();

    for (const id of currentValue) {
      if (this.creationTracker.hasCreated(id)) {
        this.markUnselected([id]);
      }
    }

    this.internalValue.set([]);
    this.searchText.set('');
    this.insertText.set('');
    this.onChange(this.mode() === 'single' ? '' : []);
    this.cleared.emit();
  }

  /** A8: 建立動作按鈕點擊。 */
  protected onCreateActionClick(): void {
    this.handleActionCustom();
  }

  /**
   * MznDropdown 的 `visibilityChange` 反映 `open` input 轉換。inside 模式
   * 下 wrapper 是 open state 的 source of truth,因此這裡主要用於把「內部
   * 建立 close」的結果回推;當前實作僅處理 `false`(close),開啟動作由
   * wrapper 的 focus / click 流程自行完成。
   */
  protected onDropdownVisibilityChangeFromInline(open: boolean): void {
    if (!open && this.isOpenInternal()) {
      this.isOpenInternal.set(false);
      this.visibilityChange.emit(false);
    }
  }

  /** A9: 貼上事件。 */
  protected onPaste(event: ClipboardEvent): void {
    if (!this.addable() || !this.onInsert()) return;

    const pastedText = event.clipboardData?.getData('text') ?? '';
    const hasSeparator = this.createSeparators().some((sep) =>
      pastedText.includes(sep),
    );

    if (!hasSeparator) return;

    // Multiple mode + separator detected
    if (this.mode() === 'multiple') {
      event.preventDefault();

      if (this.stepByStepBulkCreate()) {
        // Show all items in input, user creates one at a time
        const pending = this.getPendingCreateList(pastedText);
        const joined = pending.join(', ');

        this.searchText.set(joined);
        this.insertText.set(joined);
        this.setNativeInputValue(joined);
      } else {
        // Create all at once
        const texts = this.processBulkCreate(pastedText);

        this.handleBulkCreate(texts);
        this.resetCreationInputs();
      }
    }
  }

  // ────────────────────────────────────────────
  //  Close / blur handling (A4)
  // ────────────────────────────────────────────

  protected handleClose(): void {
    this.isOpenInternal.set(false);
    this.visibilityChange.emit(false);

    if (this.clearSearchText()) {
      // 恢復搜尋文字為選中項目名稱（單選）或清空（多選）
      if (this.mode() === 'single') {
        const id = this.internalValue()[0];
        const opt = id ? this.options().find((o) => o.id === id) : undefined;

        this.searchText.set(opt?.name ?? '');
      } else {
        this.searchText.set('');
      }

      this.insertText.set('');
    }

    // 清理未選中的動態新增選項
    this.cleanupUnselectedCreated();
  }

  // ────────────────────────────────────────────
  //  Creation logic (A8-A10)
  // ────────────────────────────────────────────

  private getCreateActionTargetText(): string {
    const insert = this.insertText();

    if (this.stepByStepBulkCreate()) {
      const pending = this.getPendingCreateList(insert);

      return pending[0] ?? '';
    }

    return insert.trim();
  }

  private markCreated(id: string): void {
    this.creationTracker.addNewly(id);
  }

  private clearNewlyCreated(ids: ReadonlyArray<string>): void {
    for (const id of ids) {
      this.creationTracker.removeNewly(id);
    }
  }

  private markUnselected(ids: ReadonlyArray<string>): void {
    for (const id of ids) {
      this.creationTracker.markUnselected(id);
    }
  }

  private filterUnselected(
    options: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> {
    return this.creationTracker.filterOutUnselected(options);
  }

  private clearUnselected(): void {
    this.creationTracker.clearUnselected();
  }

  private cleanupUnselectedCreated(): void {
    if (!this.addable()) return;

    const cleaned = this.filterUnselected(this.options());

    if (cleaned.length < this.options().length) {
      this.clearUnselected();

      const removeFn = this.onRemoveCreated();

      if (removeFn) {
        removeFn(cleaned);
      }

      this.removeCreated.emit(cleaned);
    }
  }

  private processBulkCreate(text: string): ReadonlyArray<string> {
    const parts = getFullParsedList(
      text,
      this.createSeparators(),
      this.trimOnCreate(),
    );
    const currentNames = new Set(
      this.internalValue().map((id) => {
        const opt = this.options().find((o) => o.id === id);

        return opt?.name?.toLowerCase() ?? id.toLowerCase();
      }),
    );

    return parts.filter((p) => !currentNames.has(p.toLowerCase()));
  }

  private getPendingCreateList(text: string): ReadonlyArray<string> {
    const parts = this.processBulkCreate(text);
    const optionNames = new Set(
      this.options().map((o) => o.name.toLowerCase()),
    );

    return parts.filter((p) => !optionNames.has(p.toLowerCase()));
  }

  private handleBulkCreate(texts: ReadonlyArray<string>): void {
    const insertFn = this.onInsert();

    if (!insertFn) return;

    let currentOptions = [...this.filterUnselected(this.options())];

    this.clearUnselected();

    const newIds: string[] = [];

    for (const text of texts) {
      const existing = currentOptions.find(
        (o) => o.name.toLowerCase() === text.toLowerCase(),
      );

      if (existing) {
        if (!this.selectedIds().has(existing.id)) {
          newIds.push(existing.id);
        }
      } else {
        const result = insertFn(text, currentOptions);

        this.inserted.emit({ text, currentOptions });

        if (result.length > currentOptions.length) {
          const newOpt = result[result.length - 1];

          this.markCreated(newOpt.id);
          currentOptions = [...result];
          newIds.push(newOpt.id);
        }
      }
    }

    // 選中所有新建/找到的項目
    if (newIds.length > 0) {
      if (this.mode() === 'multiple') {
        const next = [...this.internalValue(), ...newIds];

        this.internalValue.set(next);
        this.onChange(next);
        this.valueChange.emit(next);
      } else if (newIds.length > 0) {
        this.internalValue.set([newIds[0]]);
        this.onChange(newIds[0]);
      }

      this.clearNewlyCreated(newIds);
    }
  }

  private handleActionCustom(): void {
    const insert = this.insertText();

    if (this.stepByStepBulkCreate() && this.mode() === 'multiple') {
      const pending = this.getPendingCreateList(insert);

      if (pending.length > 0) {
        this.handleBulkCreate([pending[0]]);

        const remaining = pending.slice(1);

        if (remaining.length > 0) {
          const joined = remaining.join(', ');

          this.searchText.set(joined);
          this.insertText.set(joined);
          this.setNativeInputValue(joined);
        } else {
          this.resetCreationInputs();
        }
      }
    } else {
      const texts = this.processBulkCreate(insert);

      this.handleBulkCreate(texts.length > 0 ? texts : [insert.trim()]);
      this.resetCreationInputs();
    }
  }

  private handleEnterKey(): boolean {
    if (!this.isOpen()) return false;
    if (!this.addable() || !this.searchText()) return false;

    const insert = this.insertText();

    if (this.stepByStepBulkCreate() && this.mode() === 'multiple') {
      this.handleActionCustom();

      return true;
    }

    const hasSeparator = this.createSeparators().some((sep) =>
      insert.includes(sep),
    );

    if (hasSeparator && this.mode() === 'multiple') {
      const texts = this.processBulkCreate(insert);

      this.handleBulkCreate(texts);
      this.resetCreationInputs();

      return true;
    }

    // Single item creation
    if (this.shouldShowCreateAction()) {
      const texts = this.processBulkCreate(insert);

      this.handleBulkCreate(texts.length > 0 ? texts : [insert.trim()]);
      this.resetCreationInputs();

      return true;
    }

    return false;
  }

  private resetCreationInputs(): void {
    this.searchText.set('');
    this.insertText.set('');
    this.setNativeInputValue('');
  }

  private setNativeInputValue(value: string): void {
    const inputEl = this.inputElRef()?.nativeElement;

    if (inputEl) {
      inputEl.value = value;
    }
  }
}
