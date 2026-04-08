import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import {
  dropdownClasses as classes,
  DropdownItemLevel,
  DropdownMode,
  DropdownOption,
  DropdownStatus as DropdownStatusType,
  DropdownType,
} from '@mezzanine-ui/core/dropdown';
import {
  CaretDownIcon,
  CaretRightIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import type { DropdownActionProps } from './dropdown-action.component';
import { MznDropdownAction } from './dropdown-action.component';
import { MznDropdownItemCard } from './dropdown-item-card.component';
import { MznDropdownStatus } from './dropdown-status.component';

/** 扁平化後的樹狀選項節點，供模板迭代使用。 */
export interface DropdownFlatTreeNode {
  /** 是否有子選項。 */
  hasChildren: boolean;
  /** 迭代中的全域選項索引（0-indexed），對應 activeIndex。 */
  index: number;
  /** 樹狀層級深度（0-indexed，最大值 2）。 */
  level: DropdownItemLevel;
  /** 原始 DropdownOption 資料。 */
  option: DropdownOption;
}

/**
 * Dropdown 選項列表元件，負責渲染扁平、群組或樹狀選項清單。
 *
 * 封裝 `<ul role="listbox">` 與其子選項的所有渲染邏輯，包含：
 * - 扁平（default）、群組（grouped）、樹狀（tree）三種選項結構
 * - 展開/收合樹節點的內建狀態管理
 * - 載入中（loading）與空狀態（empty）的顯示
 * - 捲動至底部 / 離開底部的事件回呼
 *
 * @example
 * ```html
 * import { MznDropdownItem } from '@mezzanine-ui/ng/dropdown';
 *
 * <mzn-dropdown-item
 *   [options]="options"
 *   [value]="selected"
 *   mode="single"
 *   (selected)="onSelect($event)"
 * />
 * ```
 *
 * @see MznDropdown
 * @see MznDropdownItemCard
 * @see MznDropdownStatus
 */
@Component({
  selector: 'mzn-dropdown-item',
  standalone: true,
  imports: [MznDropdownAction, MznDropdownItemCard, MznDropdownStatus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (resolvedMaxHeight()) {
      <div
        #listWrapper
        [class]="listWrapperClass"
        [style.max-height]="resolvedMaxHeight()"
        [style.min-width]="resolvedMinWidth()"
        [style.width]="resolvedCustomWidth()"
        (scroll)="onListWrapperScroll($event)"
      >
        <ul
          [id]="listboxId() ?? null"
          [attr.aria-label]="resolvedListboxLabel()"
          [class]="listClass"
          role="listbox"
          [tabIndex]="-1"
        >
          @if (status() && shouldShowFullStatus()) {
            <mzn-dropdown-status
              [status]="status()!"
              [emptyIcon]="emptyIcon()"
              [emptyText]="resolvedEmptyText()"
              [loadingText]="resolvedLoadingText()"
            />
          } @else {
            @if (type() === 'grouped') {
              @for (group of options(); track group.id) {
                <span [class]="groupLabelClass">{{ group.name }}</span>
                @for (
                  option of group.children ?? [];
                  track option.id;
                  let i = $index
                ) {
                  <mzn-dropdown-item-card
                    [active]="isActive(groupedOptionIndex(group, i))"
                    [checked]="isSelected(option)"
                    [checkSite]="option.checkSite ?? 'suffix'"
                    [disabled]="disabled()"
                    [id]="optionId(groupedOptionIndex(group, i))"
                    [label]="option.name"
                    [mode]="mode()"
                    [showUnderline]="option.showUnderline ?? false"
                    [validate]="option.validate ?? 'default'"
                    (clicked)="onOptionClick(option)"
                  />
                }
              }
            } @else if (type() === 'tree') {
              @for (item of flattenedTreeOptions(); track item.option.id) {
                <mzn-dropdown-item-card
                  [active]="isActive(item.index)"
                  [checked]="isTreeNodeChecked(item.option)"
                  [checkSite]="
                    resolveTreeCheckSite(item.option, item.hasChildren)
                  "
                  [disabled]="disabled()"
                  [id]="optionId(item.index)"
                  [indeterminate]="isTreeNodeIndeterminate(item.option)"
                  [label]="item.option.name"
                  [level]="item.level"
                  [mode]="mode()"
                  [prependIcon]="
                    resolveTreePrependIcon(
                      item.option,
                      item.hasChildren,
                      item.level
                    )
                  "
                  [showUnderline]="item.option.showUnderline ?? false"
                  [validate]="item.option.validate ?? 'default'"
                  (clicked)="onTreeOptionClick(item.option, item.hasChildren)"
                  (checkedChange)="onTreeCheckedChange(item.option)"
                />
              }
            } @else {
              @for (option of options(); track option.id; let i = $index) {
                <mzn-dropdown-item-card
                  [active]="isActive(i)"
                  [checked]="isSelected(option)"
                  [checkSite]="option.checkSite ?? 'suffix'"
                  [disabled]="disabled()"
                  [id]="optionId(i)"
                  [label]="option.name"
                  [mode]="mode()"
                  [prependIcon]="option.icon"
                  [showUnderline]="option.showUnderline ?? false"
                  [validate]="option.validate ?? 'default'"
                  (clicked)="onOptionClick(option)"
                />
              }
            }
            @if (shouldShowBottomLoading()) {
              <li [class]="loadingMoreClass" aria-live="polite" role="status">
                <mzn-dropdown-status
                  status="loading"
                  [loadingText]="resolvedLoadingText()"
                />
              </li>
            }
          }
          @if (actionConfig(); as ac) {
            @if (ac.showActions) {
              <div>
                <mzn-dropdown-action
                  [showActions]="ac.showActions ?? false"
                  [showTopBar]="ac.showTopBar ?? false"
                  [actionText]="ac.actionText"
                  [cancelText]="ac.cancelText"
                  [clearText]="ac.clearText"
                  [confirmText]="ac.confirmText"
                  [mode]="resolvedActionMode()"
                  (cancelled)="actionCancelled.emit()"
                  (confirmed)="actionConfirmed.emit()"
                  (cleared)="actionCleared.emit()"
                  (customClicked)="actionCustomClicked.emit()"
                />
              </div>
            }
          }
        </ul>
      </div>
    } @else {
      <ul
        [id]="listboxId() ?? null"
        [attr.aria-label]="resolvedListboxLabel()"
        [class]="listClass"
        [style.min-width]="resolvedMinWidth()"
        [style.width]="resolvedCustomWidth()"
        role="listbox"
        [tabIndex]="-1"
        (scroll)="onListWrapperScroll($event)"
      >
        @if (status() && shouldShowFullStatus()) {
          <mzn-dropdown-status
            [status]="status()!"
            [emptyIcon]="emptyIcon()"
            [emptyText]="resolvedEmptyText()"
            [loadingText]="resolvedLoadingText()"
          />
        } @else {
          @if (type() === 'grouped') {
            @for (group of options(); track group.id) {
              <span [class]="groupLabelClass">{{ group.name }}</span>
              @for (
                option of group.children ?? [];
                track option.id;
                let i = $index
              ) {
                <mzn-dropdown-item-card
                  [active]="isActive(groupedOptionIndex(group, i))"
                  [checked]="isSelected(option)"
                  [checkSite]="option.checkSite ?? 'suffix'"
                  [disabled]="disabled()"
                  [id]="optionId(groupedOptionIndex(group, i))"
                  [label]="option.name"
                  [mode]="mode()"
                  [showUnderline]="option.showUnderline ?? false"
                  [validate]="option.validate ?? 'default'"
                  (clicked)="onOptionClick(option)"
                />
              }
            }
          } @else if (type() === 'tree') {
            @for (item of flattenedTreeOptions(); track item.option.id) {
              <mzn-dropdown-item-card
                [active]="isActive(item.index)"
                [checked]="isTreeNodeChecked(item.option)"
                [checkSite]="
                  resolveTreeCheckSite(item.option, item.hasChildren)
                "
                [disabled]="disabled()"
                [id]="optionId(item.index)"
                [indeterminate]="isTreeNodeIndeterminate(item.option)"
                [label]="item.option.name"
                [level]="item.level"
                [mode]="mode()"
                [prependIcon]="
                  resolveTreePrependIcon(
                    item.option,
                    item.hasChildren,
                    item.level
                  )
                "
                [showUnderline]="item.option.showUnderline ?? false"
                [validate]="item.option.validate ?? 'default'"
                (clicked)="onTreeOptionClick(item.option, item.hasChildren)"
                (checkedChange)="onTreeCheckedChange(item.option)"
              />
            }
          } @else {
            @for (option of options(); track option.id; let i = $index) {
              <mzn-dropdown-item-card
                [active]="isActive(i)"
                [checked]="isSelected(option)"
                [checkSite]="option.checkSite ?? 'suffix'"
                [disabled]="disabled()"
                [id]="optionId(i)"
                [label]="option.name"
                [mode]="mode()"
                [prependIcon]="option.icon"
                [showUnderline]="option.showUnderline ?? false"
                [validate]="option.validate ?? 'default'"
                (clicked)="onOptionClick(option)"
              />
            }
          }
          @if (shouldShowBottomLoading()) {
            <li [class]="loadingMoreClass" aria-live="polite" role="status">
              <mzn-dropdown-status
                status="loading"
                [loadingText]="resolvedLoadingText()"
              />
            </li>
          }
        }
        @if (actionConfig(); as ac) {
          @if (ac.showActions) {
            <div>
              <mzn-dropdown-action
                [showActions]="ac.showActions ?? false"
                [showTopBar]="ac.showTopBar ?? false"
                [actionText]="ac.actionText"
                [cancelText]="ac.cancelText"
                [clearText]="ac.clearText"
                [confirmText]="ac.confirmText"
                [mode]="resolvedActionMode()"
                (cancelled)="actionCancelled.emit()"
                (confirmed)="actionConfirmed.emit()"
                (cleared)="actionCleared.emit()"
                (customClicked)="actionCustomClicked.emit()"
              />
            </div>
          }
        }
      </ul>
    }
  `,
})
export class MznDropdownItem {
  /**
   * 操作區設定物件，若設定則於 `<ul>` 末端渲染 DropdownAction。
   * 對應 React 的 `actionConfig` prop。
   */
  readonly actionConfig = input<DropdownActionProps>();

  /**
   * 目前鍵盤／滑鼠 active 選項的索引（0-indexed）。
   * 對應 React 的 `activeIndex`。
   */
  readonly activeIndex = input<number | null>(null);

  /** 自訂下拉選單寬度，接受數字（px）或 CSS 字串。 */
  readonly customWidth = input<number | string>();

  /** 是否禁用所有選項互動。 @default false */
  readonly disabled = input(false);

  /** 空狀態圖示，覆蓋預設圖示。 */
  readonly emptyIcon = input<IconDefinition>();

  /** 空狀態顯示文字。 @default 'No matching options.' */
  readonly emptyText = input<string>();

  /**
   * 載入指示器位置。
   * - `'full'` — 覆蓋整個列表區域
   * - `'bottom'` — 僅顯示於列表底部
   * @default 'full'
   */
  readonly loadingPosition = input<'bottom' | 'full'>('full');

  /** 載入中顯示文字。 @default 'Loading...' */
  readonly loadingText = input<string>();

  /**
   * listbox 的 aria-label。
   * 未設定時，選項為空時使用預設標籤 'Dropdown options'。
   */
  readonly listboxLabel = input<string>();

  /**
   * listbox 的 DOM id（用於 aria-controls）。
   */
  readonly listboxId = input<string>();

  /**
   * 下拉選單最大高度，接受數字（px）或 CSS 字串。
   * 超過時啟用捲動。
   */
  readonly maxHeight = input<number | string>();

  /**
   * 下拉選單最小寬度，接受數字（px）或 CSS 字串。
   */
  readonly minWidth = input<number | string>();

  /** 選取模式。 @default 'single' */
  readonly mode = input<DropdownMode>('single');

  /** 選項列表。 */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /** 是否顯示勾選圖示。 @default true */
  readonly showCheckIcon = input(true);

  /**
   * 非同步狀態。
   * - `'loading'` — 顯示載入中指示器
   * - `'empty'` — 顯示空狀態
   */
  readonly status = input<DropdownStatusType>();

  /**
   * 選項結構類型。
   * - `'default'` — 扁平列表
   * - `'grouped'` — 群組結構
   * - `'tree'` — 樹狀結構（最多三層）
   * @default 'default'
   */
  readonly type = input<DropdownType>('default');

  /** 目前選取值（單選為 string，多選為 string[]）。 */
  readonly value = input<ReadonlyArray<string> | string>();

  /** 操作區取消事件。 */
  readonly actionCancelled = output<void>();

  /** 操作區清除事件。 */
  readonly actionCleared = output<void>();

  /** 操作區確認事件。 */
  readonly actionConfirmed = output<void>();

  /** 操作區自訂按鈕點擊事件。 */
  readonly actionCustomClicked = output<void>();

  /** 捲動至列表底部時觸發。 */
  readonly leaveBottom = output<void>();

  /** 離開列表底部時觸發。 */
  readonly reachBottom = output<void>();

  /** 選取事件，攜帶被點選的 DropdownOption。 */
  readonly selected = output<DropdownOption>();

  protected readonly listClass = classes.list;
  protected readonly listWrapperClass = classes.listWrapper;
  protected readonly groupLabelClass = classes.groupLabel;
  protected readonly loadingMoreClass = classes.loadingMore;

  /** 內部樹節點展開狀態。 */
  private readonly expandedNodes = signal<ReadonlySet<string>>(
    new Set<string>(),
  );

  private wasAtBottom = false;

  /** 目前選取值的 Set，加速 isSelected 查詢。 */
  private readonly selectedIds = computed((): ReadonlySet<string> => {
    const v = this.value();

    if (!v) return new Set<string>();
    if (typeof v === 'string') return new Set([v]);

    return new Set(v);
  });

  /**
   * 是否應顯示全版狀態（loading full / empty）。
   * 當選項為空且狀態存在，或 loadingPosition 非 'bottom' 時顯示全版。
   */
  protected readonly shouldShowFullStatus = computed((): boolean => {
    const s = this.status();

    if (!s) return false;
    if (s === 'empty') return true;

    return this.loadingPosition() !== 'bottom';
  });

  /** 是否應於底部顯示載入中指示器。 */
  protected readonly shouldShowBottomLoading = computed(
    (): boolean =>
      this.status() === 'loading' && this.loadingPosition() === 'bottom',
  );

  protected readonly resolvedEmptyText = computed(
    (): string => this.emptyText() ?? 'No matching options.',
  );

  protected readonly resolvedLoadingText = computed(
    (): string => this.loadingText() ?? 'Loading...',
  );

  /**
   * Resolved aria-label for the listbox.
   * When options are empty and no listboxLabel provided, use default 'Dropdown options'.
   */
  protected readonly resolvedListboxLabel = computed((): string | null => {
    const label = this.listboxLabel();

    if (label) return label;
    if (this.options().length === 0) return 'Dropdown options';

    return null;
  });

  protected readonly resolvedMaxHeight = computed((): string | null => {
    const v = this.maxHeight();

    if (v == null) return null;

    return typeof v === 'number' ? `${v}px` : v;
  });

  protected readonly resolvedMinWidth = computed((): string | null => {
    const v = this.minWidth();

    if (v == null) return null;

    return typeof v === 'number' ? `${v}px` : v;
  });

  protected readonly resolvedCustomWidth = computed((): string | null => {
    const v = this.customWidth();

    if (v == null) return null;

    return typeof v === 'number' ? `${v}px` : v;
  });

  /**
   * Resolved action mode: infer from presence of clearText/actionText if not in config.
   * Mirrors React's DropdownAction inference logic.
   */
  protected readonly resolvedActionMode = computed(
    (): 'clear' | 'custom' | 'default' => {
      const ac = this.actionConfig();

      if (!ac) return 'default';
      if (ac.clearText || ac.onClear) return 'clear';
      if (ac.actionText || ac.onClick) return 'custom';

      return 'default';
    },
  );

  /**
   * 扁平化後的樹狀選項，供模板迭代使用。
   * 僅展開節點的子選項會包含在結果中。
   * 每個節點帶有全域 index，對應 activeIndex。
   */
  protected readonly flattenedTreeOptions = computed(
    (): ReadonlyArray<DropdownFlatTreeNode> => {
      const result: DropdownFlatTreeNode[] = [];
      let currentIndex = 0;

      const walk = (
        options: ReadonlyArray<DropdownOption>,
        depth: number,
      ): void => {
        for (const option of options) {
          const hasChildren = (option.children?.length ?? 0) > 0;
          const level = Math.min(depth, 2) as DropdownItemLevel;

          result.push({ hasChildren, index: currentIndex, level, option });
          currentIndex++;

          if (hasChildren && this.expandedNodes().has(option.id)) {
            walk(option.children!, depth + 1);
          }
        }
      };

      walk(this.options(), 0);

      return result;
    },
  );

  /**
   * Compute the global option index for a grouped option.
   * Counts all leaf options before the given group + offset within group.
   */
  protected groupedOptionIndex(
    group: DropdownOption,
    indexInGroup: number,
  ): number {
    const opts = this.options();
    let offset = 0;

    for (const g of opts) {
      if (g.id === group.id) break;
      offset += g.children?.length ?? 0;
    }

    return offset + indexInGroup;
  }

  /**
   * Build the option element id for aria-activedescendant.
   */
  protected optionId(index: number): string | undefined {
    const id = this.listboxId();

    if (!id) return undefined;

    return `${id}-option-${index}`;
  }

  /**
   * Whether the option at the given index is currently active.
   */
  protected isActive(index: number): boolean {
    const active = this.activeIndex();

    return active !== null && active === index;
  }

  protected isSelected(option: DropdownOption): boolean {
    return this.selectedIds().has(option.id);
  }

  protected isExpanded(optionId: string): boolean {
    return this.expandedNodes().has(optionId);
  }

  protected isTreeNodeChecked(option: DropdownOption): boolean {
    const state = this.getTreeNodeSelectionState(option);

    return state === 'checked';
  }

  protected isTreeNodeIndeterminate(option: DropdownOption): boolean {
    const state = this.getTreeNodeSelectionState(option);

    return state === 'indeterminate';
  }

  protected resolveTreePrependIcon(
    option: DropdownOption,
    hasChildren: boolean,
    level: DropdownItemLevel,
  ): IconDefinition | undefined {
    if (!hasChildren || level >= 2) return undefined;

    return this.isExpanded(option.id) ? CaretDownIcon : CaretRightIcon;
  }

  protected resolveTreeCheckSite(
    option: DropdownOption,
    hasChildren: boolean,
  ): 'none' | 'prefix' | 'suffix' {
    if (!this.showCheckIcon()) return 'none';
    if (option.showCheckbox) return 'prefix';
    if (hasChildren) return 'none';
    if (option.checkSite) return option.checkSite;

    return this.mode() === 'single' ? 'suffix' : 'none';
  }

  protected onOptionClick(option: DropdownOption): void {
    if (this.disabled()) return;

    this.selected.emit(option);
  }

  protected onTreeOptionClick(
    option: DropdownOption,
    hasChildren: boolean,
  ): void {
    if (this.disabled()) return;

    if (hasChildren) {
      this.toggleExpand(option.id);

      return;
    }

    if (this.mode() !== 'multiple') {
      this.selected.emit(option);
    }
  }

  protected onTreeCheckedChange(option: DropdownOption): void {
    if (this.disabled()) return;

    this.selected.emit(option);
  }

  protected onListWrapperScroll(event: Event): void {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;

    if (isAtBottom && !this.wasAtBottom) {
      this.reachBottom.emit();
    }

    if (!isAtBottom && this.wasAtBottom) {
      this.leaveBottom.emit();
    }

    this.wasAtBottom = isAtBottom;
  }

  private toggleExpand(optionId: string): void {
    const current = this.expandedNodes();
    const next = new Set(current);

    if (next.has(optionId)) {
      next.delete(optionId);
    } else {
      next.add(optionId);
    }

    this.expandedNodes.set(next);
  }

  private getTreeNodeSelectionState(
    option: DropdownOption,
  ): 'checked' | 'indeterminate' | 'unchecked' {
    const v = this.value();
    const selectedValues: ReadonlyArray<string> = Array.isArray(v)
      ? v
      : v
        ? [v]
        : [];

    return this.calculateNodeSelectionState(option, selectedValues);
  }

  private calculateNodeSelectionState(
    option: DropdownOption,
    selectedValues: ReadonlyArray<string>,
  ): 'checked' | 'indeterminate' | 'unchecked' {
    if (!option.children?.length) {
      return selectedValues.includes(option.id) ? 'checked' : 'unchecked';
    }

    const childStates = option.children.map((c) =>
      this.calculateNodeSelectionState(c, selectedValues),
    );

    if (childStates.every((s) => s === 'checked')) return 'checked';
    if (childStates.every((s) => s === 'unchecked')) return 'unchecked';

    return 'indeterminate';
  }
}
