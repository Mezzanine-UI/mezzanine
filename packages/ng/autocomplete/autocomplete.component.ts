import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  DestroyRef,
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
import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor } from '@angular/forms';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { dropdownClasses, DropdownOption } from '@mezzanine-ui/core/dropdown';
import {
  autocompleteClasses,
  AutoCompleteMode,
  AutoCompleteInputSize,
} from '@mezzanine-ui/core/autocomplete';
import { textFieldClasses } from '@mezzanine-ui/core/text-field';
import {
  ChevronDownIcon,
  CheckedIcon,
  CloseIcon,
  FolderOpenIcon,
  PlusIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { checkboxClasses } from '@mezzanine-ui/core/checkbox';
import { iconClasses as spinClasses } from '@mezzanine-ui/core/spin';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznInputTriggerPopper } from '@mezzanine-ui/ng/_internal';
import { SelectTriggerTagValue } from '@mezzanine-ui/ng/select';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { mznTranslateTopAnimation } from '@mezzanine-ui/ng/transition';
import { highlightText, provideValueAccessor } from '@mezzanine-ui/ng/utils';

/**
 * 標記 AutoComplete 的 prefix 內容投影插槽。
 *
 * @example
 * ```html
 * <mzn-autocomplete [options]="opts">
 *   <i mznIcon mznAutocompletePrefix [icon]="searchIcon" ></i>
 * </mzn-autocomplete>
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
 * 自動完成選擇器元件，結合文字輸入與下拉選單過濾。
 *
 * 支援單選與多選模式，搜尋過濾、clearable、loading 與 error 狀態。
 * 多選模式下已選項目以 Tag 顯示，支援 overflow counter/wrap 策略。
 * 支援動態新增選項（addable）、批次新增（bulk create）、inside 輸入模式、
 * 滾動到底載入更多（onReachBottom）等進階功能。
 *
 * @example
 * ```html
 * import { MznAutocomplete } from '@mezzanine-ui/ng/autocomplete';
 *
 * <mzn-autocomplete
 *   [options]="fruits"
 *   [(ngModel)]="selectedFruit"
 *   placeholder="搜尋水果"
 *   (searchChange)="onSearch($event)"
 * />
 *
 * <mzn-autocomplete
 *   mode="multiple"
 *   [options]="fruits"
 *   [(ngModel)]="selectedFruits"
 *   placeholder="搜尋水果"
 *   [clearable]="true"
 *   overflowStrategy="wrap"
 * />
 *
 * <mzn-autocomplete
 *   [options]="opts"
 *   [addable]="true"
 *   [onInsert]="handleInsert"
 *   placeholder="可新增選項"
 * />
 * ```
 *
 * @see MznSelect
 */
@Component({
  selector: 'mzn-autocomplete',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    MznButton,
    MznIcon,
    MznInputTriggerPopper,
    MznTag,
    MznTextField,
  ],
  providers: [provideValueAccessor(MznAutocomplete)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [mznTranslateTopAnimation],
  host: {
    '[class]': 'hostClasses()',
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
          <i
            mznIcon
            [icon]="timesCircleIcon"
            [class]="clearIconClass"
            role="button"
            tabindex="0"
            (click)="onClear(); $event.stopPropagation()"
            (keydown.enter)="onClear(); $event.stopPropagation()"
          ></i>
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
    <!-- Inside mode: render inline (no popper), matching React Dropdown isInline behavior -->
    @if (inputPosition() === 'inside') {
      @if (isOpen()) {
        <div
          [class]="dropdownRootClass()"
          @mznTranslateTop
          (click)="$event.stopPropagation()"
          (touchstart)="$event.stopPropagation()"
          (touchend)="$event.stopPropagation()"
        >
          <ng-container *ngTemplateOutlet="dropdownContentTpl" />
        </div>
      }
    } @else {
      <!-- Outside mode: use popper for floating positioning -->
      <mzn-input-trigger-popper
        [anchor]="triggerElRef()!"
        [open]="isOpen()"
        [sameWidth]="true"
      >
        @if (isOpen()) {
          <div [class]="dropdownRootClass()" @mznTranslateTop>
            <ng-container *ngTemplateOutlet="dropdownContentTpl" />
          </div>
        }
      </mzn-input-trigger-popper>
    }
    <!-- Shared dropdown content template -->
    <ng-template #dropdownContentTpl>
      <ul [class]="listClass" role="listbox">
        @if (inputPosition() === 'inside') {
          <li [class]="listHeaderClass" role="presentation">
            <div [class]="listHeaderInnerClass">
              <mzn-text-field
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
              </mzn-text-field>
            </div>
          </li>
        }
        @if (shouldShowFullStatus()) {
          <li [class]="statusClass">
            <div [class]="loadingSpinClass">
              <span [class]="spinnerRingClass"
                ><span [class]="spinnerTailClass"></span
              ></span>
            </div>
            <span [class]="statusTextClass">{{ loadingText() }}</span>
          </li>
        } @else {
          <div
            [class]="listWrapperClass"
            [style.maxHeight]="menuMaxHeight() ? menuMaxHeight() + 'px' : null"
            (scroll)="onDropdownScroll($event)"
          >
            @for (option of dropdownOptions(); track option.id) {
              <li
                role="option"
                [class]="optionClasses(option)"
                [attr.aria-selected]="isSelected(option)"
                (click)="onOptionClick(option); $event.stopPropagation()"
              >
                <div [class]="cardContainerClass">
                  @if (checkSitePrefix()) {
                    <div [class]="prependClass">
                      @if (mode() === 'multiple') {
                        <div
                          [class]="inlineCheckboxClasses(isSelected(option))"
                          (click)="$event.stopPropagation()"
                          (mousedown)="$event.stopPropagation()"
                        >
                          <label [class]="cbLabelContainerClass">
                            <div [class]="cbInputContainerClass">
                              <div [class]="cbInputContentClass">
                                <input
                                  type="checkbox"
                                  [class]="cbInputClass"
                                  [checked]="isSelected(option)"
                                  (change)="
                                    onOptionClick(option);
                                    $event.stopPropagation()
                                  "
                                />
                                @if (isSelected(option)) {
                                  <i
                                    mznIcon
                                    [icon]="checkedIcon"
                                    [class]="cbIconClass"
                                    color="fixed-light"
                                    [size]="9"
                                  ></i>
                                }
                              </div>
                            </div>
                          </label>
                        </div>
                      } @else if (isSelected(option)) {
                        <i mznIcon [icon]="checkedIcon"></i>
                      }
                    </div>
                  }
                  <div [class]="cardBodyClass">
                    <span [class]="cardTitleClass">
                      @for (
                        seg of highlightOptionText(option.name);
                        track $index
                      ) {
                        <span
                          [class]="seg.highlight ? highlightedTextClass : ''"
                          >{{ seg.text }}</span
                        >
                      }
                    </span>
                  </div>
                  @if (showAppendContent(option)) {
                    <div [class]="appendClass">
                      @if (isCreated(option.id)) {
                        <span
                          style="color: var(--mzn-text-neutral-light); font-size: 12px;"
                          >New</span
                        >
                      }
                      @if (!checkSitePrefix() && isSelected(option)) {
                        <i mznIcon [icon]="checkedIcon"></i>
                      }
                    </div>
                  }
                </div>
              </li>
            }
            @if (shouldShowBottomLoading()) {
              <li [class]="loadingMoreClass" aria-live="polite" role="status">
                <div [class]="statusClass">
                  <div [class]="loadingSpinClass">
                    <span [class]="spinnerRingClass"
                      ><span [class]="spinnerTailClass"></span
                    ></span>
                  </div>
                  <span [class]="statusTextClass">{{ loadingText() }}</span>
                </div>
              </li>
            }
            @if (dropdownOptions().length === 0 && !isEffectiveLoading()) {
              <li [class]="statusClass">
                <i mznIcon [icon]="folderOpenIcon" [size]="16"></i>
                <span [class]="statusTextClass">{{ emptyText() }}</span>
              </li>
            }
            @if (shouldShowCreateAction()) {
              <div [class]="actionClass">
                <i [class]="actionTopBarClass"></i>
                <div [class]="actionToolsClass">
                  <button
                    mznButton
                    variant="base-ghost"
                    size="minor"
                    (mousedown)="$event.preventDefault()"
                    (click)="onCreateActionClick(); $event.stopPropagation()"
                  >
                    {{ createActionDisplayText() }}
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </ul>
    </ng-template>
  `,
})
export class MznAutocomplete
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  private readonly clickAway = inject(ClickAwayService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

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
  private readonly creationTracker = {
    newlyCreatedIds: new Set<string>(),
    unselectedCreatedIds: new Set<string>(),
    allCreatedIds: new Set<string>(),
  };

  // ── Scroll state (A7) ──
  private wasAtBottom = false;

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
  protected readonly checkedIcon = CheckedIcon;
  protected readonly timesCircleIcon = CloseIcon;
  protected readonly folderOpenIcon = FolderOpenIcon;
  protected readonly plusIcon = PlusIcon;

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
   * 全畫面 loading 狀態：當 loading 中且 options 為空（或 loadingPosition 為 'full'）。
   * 對齊 React DropdownItem shouldShowFullStatus 邏輯。
   */
  protected readonly shouldShowFullStatus = computed(
    (): boolean =>
      this.isEffectiveLoading() &&
      (this.dropdownOptions().length === 0 ||
        this.loadingPosition() !== 'bottom'),
  );

  /**
   * 底部 loading 指示器：loading 中且 loadingPosition 為 'bottom'，且有選項顯示。
   * 對齊 React DropdownItem shouldShowBottomLoading 邏輯。
   */
  protected readonly shouldShowBottomLoading = computed(
    (): boolean =>
      this.isEffectiveLoading() &&
      this.loadingPosition() === 'bottom' &&
      this.dropdownOptions().length > 0,
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

  /** 在 filteredOptions 基礎上：created 項目 bubble to top。 */
  protected readonly dropdownOptions = computed(
    (): ReadonlyArray<DropdownOption> => {
      const filtered = this.filteredOptions();

      if (this.creationTracker.allCreatedIds.size === 0) return filtered;

      const created: DropdownOption[] = [];
      const rest: DropdownOption[] = [];

      for (const opt of filtered) {
        if (this.creationTracker.allCreatedIds.has(opt.id)) {
          created.push(opt);
        } else {
          rest.push(opt);
        }
      }

      return [...created, ...rest];
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
   * 對齊 React 的 shouldForceClearable：有值或有搜尋文字時自動啟用。
   */
  protected readonly shouldForceClearable = computed((): boolean => {
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

  /**
   * checkSite 是否為 prefix（左側 Checkbox/CheckedIcon）。
   * React 邏輯：multiple + outside → prefix; single 或 inside → suffix。
   */
  protected readonly checkSitePrefix = computed(
    (): boolean =>
      this.mode() === 'multiple' && this.inputPosition() !== 'inside',
  );

  /** 是否顯示 append content（suffix checkmark 或 'New' 標記）。 */
  protected showAppendContent(option: DropdownOption): boolean {
    // React 邏輯：appendContent || (checkSite === 'suffix' && isChecked)
    return (
      this.isCreated(option.id) ||
      (!this.checkSitePrefix() && this.isSelected(option))
    );
  }

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
  protected readonly dropdownRootClass = computed((): string =>
    clsx(
      dropdownClasses.root,
      dropdownClasses.inputPosition(this.inputPosition()),
    ),
  );
  protected readonly listClass = dropdownClasses.list;
  protected readonly listWrapperClass = dropdownClasses.listWrapper;
  protected readonly cardBodyClass = dropdownClasses.cardBody;
  protected readonly cardTitleClass = dropdownClasses.cardTitle;
  protected readonly appendClass = dropdownClasses.cardAppendContent;
  protected readonly statusClass = dropdownClasses.status;
  protected readonly statusTextClass = dropdownClasses.statusText;
  protected readonly loadingMoreClass = dropdownClasses.loadingMore;
  protected readonly loadingSpinClass = clsx(
    spinClasses.spin,
    spinClasses.size('minor'),
  );
  protected readonly spinnerRingClass = spinClasses.spinnerRing;
  protected readonly spinnerTailClass = spinClasses.spinnerTail;
  protected readonly clearIconClass = textFieldClasses.clearIcon;
  protected readonly suffixClass = textFieldClasses.suffix;
  protected readonly prefixClass = textFieldClasses.prefix;
  protected readonly highlightedTextClass = dropdownClasses.cardHighlightedText;
  protected readonly cardContainerClass = dropdownClasses.cardContainer;
  protected readonly prependClass = dropdownClasses.cardPrependContent;
  protected readonly tagsInputClass = classes.triggerTagsInput;
  protected readonly counterTagsContainerClasses = clsx(
    classes.triggerTags,
    classes.triggerTagsEllipsis,
  );
  protected readonly fakeTagsContainerClass = classes.triggerTags;
  protected readonly actionClass = dropdownClasses.action;
  protected readonly actionTopBarClass = dropdownClasses.actionTopBar;
  protected readonly actionToolsClass = dropdownClasses.actionTools;
  protected readonly listHeaderClass = dropdownClasses.listHeader;
  protected readonly listHeaderInnerClass = dropdownClasses.listHeaderInner;

  protected readonly insideInputTextFieldSize = computed((): 'main' | 'sub' =>
    this.size() === 'sub' ? 'sub' : 'main',
  );

  // Inline checkbox classes (matching React's <Checkbox> without mzn-input-check wrapper)
  protected readonly cbLabelContainerClass = checkboxClasses.labelContainer;
  protected readonly cbInputContainerClass = checkboxClasses.inputContainer;
  protected readonly cbInputContentClass = checkboxClasses.inputContent;
  protected readonly cbInputClass = checkboxClasses.input;
  protected readonly cbIconClass = checkboxClasses.icon;

  protected inlineCheckboxClasses(checked: boolean): string {
    return clsx(checkboxClasses.host, checkboxClasses.size('main'), {
      [checkboxClasses.checked]: checked,
    });
  }

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
    // Click-away to close dropdown
    effect((onCleanup) => {
      const open = this.isOpen();

      if (open) {
        const cleanup = this.clickAway.listen(
          this.hostElRef.nativeElement,
          () => this.handleClose(),
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });

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
  //  Template helpers
  // ────────────────────────────────────────────

  protected highlightOptionText(
    text: string,
  ): ReadonlyArray<{ readonly text: string; readonly highlight: boolean }> {
    return highlightText(text, this.searchText());
  }

  protected isSelected(option: DropdownOption): boolean {
    return this.selectedIds().has(option.id);
  }

  protected isCreated(id: string): boolean {
    return this.creationTracker.allCreatedIds.has(id);
  }

  protected optionClasses(option: DropdownOption): string {
    const selected = this.isSelected(option);

    return clsx(dropdownClasses.card, {
      [dropdownClasses.cardActive]: selected,
    });
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
      if (wasSelected && this.creationTracker.allCreatedIds.has(option.id)) {
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

    if (this.creationTracker.allCreatedIds.has(item.id)) {
      this.markUnselected([item.id]);
    }
  }

  protected onClear(): void {
    // Mark all created items as unselected
    const currentValue = this.internalValue();

    for (const id of currentValue) {
      if (this.creationTracker.allCreatedIds.has(id)) {
        this.markUnselected([id]);
      }
    }

    this.internalValue.set([]);
    this.searchText.set('');
    this.insertText.set('');
    this.onChange(this.mode() === 'single' ? '' : []);
    this.cleared.emit();
  }

  /** A7: 下拉選單滾動事件。 */
  protected onDropdownScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if (isAtBottom && !this.wasAtBottom) {
      this.reachBottom.emit();
    }

    if (!isAtBottom && this.wasAtBottom) {
      this.leaveBottom.emit();
    }

    this.wasAtBottom = isAtBottom;
  }

  /** A8: 建立動作按鈕點擊。 */
  protected onCreateActionClick(): void {
    this.handleActionCustom();
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

  private handleClose(): void {
    this.isOpenInternal.set(false);
    this.visibilityChange.emit(false);
    this.wasAtBottom = false;

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
    this.creationTracker.newlyCreatedIds.add(id);
    this.creationTracker.allCreatedIds.add(id);
  }

  private clearNewlyCreated(ids: ReadonlyArray<string>): void {
    for (const id of ids) {
      this.creationTracker.newlyCreatedIds.delete(id);
    }
  }

  private markUnselected(ids: ReadonlyArray<string>): void {
    for (const id of ids) {
      if (this.creationTracker.allCreatedIds.has(id)) {
        this.creationTracker.unselectedCreatedIds.add(id);
      }
    }
  }

  private filterUnselected(
    options: ReadonlyArray<DropdownOption>,
  ): ReadonlyArray<DropdownOption> {
    if (this.creationTracker.unselectedCreatedIds.size === 0) return options;

    return options.filter(
      (o) => !this.creationTracker.unselectedCreatedIds.has(o.id),
    );
  }

  private clearUnselected(): void {
    this.creationTracker.unselectedCreatedIds.clear();
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
