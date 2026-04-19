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
  viewChild,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import {
  selectClasses as classes,
  SelectInputSize,
  SelectMode,
} from '@mezzanine-ui/core/select';
import {
  dropdownClasses,
  DropdownItemLevel,
  DropdownOption,
  DropdownType,
} from '@mezzanine-ui/core/dropdown';
import {
  CaretDownIcon,
  CaretRightIcon,
  ChevronDownIcon,
  CheckedIcon,
  IconDefinition,
  SpinnerIcon,
} from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznDropdownItemCard } from '@mezzanine-ui/ng/dropdown';
import { MznSpin } from '@mezzanine-ui/ng/spin';
import { MznInputTriggerPopper } from '@mezzanine-ui/ng/_internal';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTranslate } from '@mezzanine-ui/ng/transition';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import { MznSelectTrigger } from './select-trigger.component';
import {
  MznSelectTriggerTags,
  SelectTriggerTagValue,
} from './select-trigger-tags.component';

/** Flattened tree node for rendering. */
interface FlatOption {
  readonly option: DropdownOption;
  readonly level: DropdownItemLevel;
  readonly hasChildren: boolean;
  readonly isExpanded: boolean;
}

/**
 * 選擇器元件，點擊觸發器後展開下拉選單供選取。
 *
 * 支援單選與多選模式，實作 `ControlValueAccessor` 支援 Angular Forms。
 * 多選模式下若 options 含有 `children` 巢狀結構，會自動切換為樹狀選取（`type: 'tree'`）
 * 並為所有選項加上勾選框。
 * 使用 `MznInputTriggerPopper` 定位下拉選單，`ClickAwayService` 處理外部點擊。
 *
 * @example
 * ```html
 * import { MznSelect } from '@mezzanine-ui/ng/select';
 *
 * <div mznSelect
 *   [options]="fruits"
 *   [(ngModel)]="selectedFruit"
 *   placeholder="請選擇水果"
 *   (selectionChange)="onFruitChange($event)"
 * ></div>
 * ```
 *
 * @see MznDropdown
 * @see MznAutocomplete
 */
@Component({
  selector: '[mznSelect]',
  standalone: true,
  imports: [
    MznSpin,
    MznInputTriggerPopper,
    MznSelectTrigger,
    MznSelectTriggerTags,
    MznDropdownItemCard,
    MznTranslate,
  ],
  providers: [provideValueAccessor(MznSelect)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.className]': 'null',
    '[attr.mode]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.options]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.type]': 'null',
    '[attr.menuMaxHeight]': 'null',
    '[attr.clearable]': 'null',
    '[attr.loading]': 'null',
    '[attr.loadingPosition]': 'null',
    '[attr.loadingText]': 'null',
    '[attr.globalPortal]': 'null',
    '[attr.dropdownZIndex]': 'null',
    '[attr.prefix]': 'null',
    '[attr.suffixActionIcon]': 'null',
    '[attr.size]': 'null',
    '[attr.required]': 'null',
    '[attr.overflowStrategy]': 'null',
  },
  template: `
    <div
      mznSelectTrigger
      [active]="isOpen()"
      [clearable]="clearable()"
      [disabled]="disabled()"
      [displayText]="displayText()"
      [error]="error()"
      [hasValue]="hasValue()"
      [mode]="mode()"
      [placeholder]="placeholder()"
      [prefix]="prefix()"
      [readOnly]="readOnly()"
      [size]="size()"
      [suffixActionIcon]="resolvedSuffixIcon()"
      (cleared)="onClear($event)"
      (triggerClicked)="toggleOpen()"
    >
      @if (mode() === 'multiple' && hasValue()) {
        <div
          mznSelectTriggerTags
          [disabled]="disabled()"
          [overflowStrategy]="overflowStrategy()"
          [readOnly]="readOnly()"
          [size]="size()"
          [value]="selectedTagValues()"
          (tagClosed)="onTagClose($event)"
        ></div>
      }
    </div>
    <div
      #triggerPopper
      mznInputTriggerPopper
      [anchor]="triggerElRef()!"
      [open]="isOpen()"
      [sameWidth]="true"
      [globalPortal]="globalPortal()"
    >
      <div mznTranslate [in]="isOpen()" from="top">
        <ul
          [class]="listClass"
          [style.max-height.px]="menuMaxHeight()"
          role="listbox"
        >
          <div
            [class]="listWrapperClass"
            [style.max-height.px]="menuMaxHeight()"
            (scroll)="onListScroll($event)"
          >
            @if (loading() && loadingPosition() === 'full') {
              <div [class]="statusClass">
                <div mznSpin [loading]="true" size="minor"></div>
                <span [class]="statusTextClass">{{ loadingText() }}</span>
              </div>
            }
            @for (item of visibleOptions(); track item.option.id) {
              <div
                mznDropdownItemCard
                [mode]="mode()"
                [label]="item.option.name"
                [level]="item.level"
                [checked]="isOptionChecked(item.option)"
                [indeterminate]="isOptionIndeterminate(item.option)"
                [prependIcon]="getCaretIcon(item)"
                [checkSite]="resolvedType() === 'tree' ? 'prefix' : 'suffix'"
                (clicked)="onVisibleOptionClick(item)"
                (checkedChange)="onVisibleOptionCheckedChange(item)"
              ></div>
            }
            @if (loading() && loadingPosition() === 'bottom') {
              <li [class]="loadingMoreClass">
                <div [class]="statusClass">
                  <div mznSpin [loading]="true" size="minor"></div>
                  <span [class]="statusTextClass">{{ loadingText() }}</span>
                </div>
              </li>
            }
          </div>
        </ul>
      </div>
    </div>
  `,
})
export class MznSelect implements ControlValueAccessor {
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  protected readonly triggerElRef = viewChild(MznSelectTrigger, {
    read: ElementRef<HTMLElement>,
  });

  private readonly triggerPopperRef = viewChild(MznInputTriggerPopper);

  /** 自訂 CSS class。 */
  readonly className = input<string>();

  /** 選取模式。 */
  readonly mode = input<SelectMode>('single');

  /** 佔位文字。 */
  readonly placeholder = input('');

  /** 選項列表。 */
  readonly options = input<ReadonlyArray<DropdownOption>>([]);

  /** 是否禁用。 */
  readonly disabled = input(false);

  /** 是否為錯誤狀態。 */
  readonly error = input(false);

  /** 是否全寬。 */
  readonly fullWidth = input(false);

  /** 是否唯讀。 */
  readonly readOnly = input(false);

  /** 下拉選單類型。 */
  readonly type = input<DropdownType>('default');

  /** 下拉選單最大高度。 */
  readonly menuMaxHeight = input<number>();

  /** 是否顯示清除按鈕。 */
  readonly clearable = input(false);

  /** 是否為載入中狀態。 */
  readonly loading = input(false);

  /** 載入指示器位置。 */
  readonly loadingPosition = input<'full' | 'bottom'>('bottom');

  /** 載入中顯示文字。 */
  readonly loadingText = input('Loading...');

  /** 是否啟用全域 Portal。 */
  readonly globalPortal = input(true);

  /** 下拉選單 Z軸層級。 */
  readonly dropdownZIndex = input<number>();

  /** 前綴內容。 */
  readonly prefix = input<string>();

  /** 後綴動作圖示。 */
  readonly suffixActionIcon = input<typeof ChevronDownIcon>(ChevronDownIcon);

  /** 輸入框尺寸。 */
  readonly size = input<SelectInputSize>('main');

  /** 是否為必填欄位。 */
  readonly required = input(false);

  /** 多選模式下的溢位策略。 */
  readonly overflowStrategy = input<'counter' | 'wrap'>('counter');

  /** 滾動事件。 */
  readonly onScroll = output<{ scrollTop: number; maxScrollTop: number }>();

  /** 滾動到底部事件。 */
  readonly onReachBottom = output<void>();

  /** 離開底部事件。 */
  readonly onLeaveBottom = output<void>();

  /** 選取變更事件。 */
  readonly selectionChange = output<DropdownOption>();

  protected readonly chevronDownIcon = ChevronDownIcon;
  protected readonly checkedIcon = CheckedIcon;
  protected readonly loadingIcon = SpinnerIcon;

  protected readonly isOpen = signal(false);
  private readonly internalValue = signal<ReadonlyArray<string>>([]);
  private readonly expandedNodes = signal<ReadonlySet<string>>(new Set());
  private wasAtBottom = false;

  // CVA
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
  }

  registerOnChange(fn: (value: ReadonlyArray<string> | string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private readonly selectedIds = computed(
    (): ReadonlySet<string> => new Set(this.internalValue()),
  );

  protected readonly hasValue = computed(
    (): boolean => this.internalValue().length > 0,
  );

  /** Auto-detect tree mode: multiple + any option has children → 'tree'. Mirrors React Select. */
  protected readonly resolvedType = computed((): DropdownType => {
    const opts = this.options();
    if (this.mode() === 'multiple' && opts.some((o) => o.children?.length)) {
      return 'tree';
    }
    return this.type();
  });

  protected readonly displayText = computed((): string => {
    const ids = this.internalValue();
    const opts = this.options();

    if (ids.length === 0) return '';

    return ids
      .map((id) => this.findOptionById(id, opts)?.name ?? id)
      .join(', ');
  });

  protected readonly selectedTagValues = computed(
    (): ReadonlyArray<SelectTriggerTagValue> => {
      const ids = this.internalValue();
      const opts = this.options();

      return ids.map((id) => ({
        id,
        name: this.findOptionById(id, opts)?.name ?? id,
      }));
    },
  );

  /** Flatten tree into visible items respecting expansion state. */
  protected readonly visibleOptions = computed(
    (): ReadonlyArray<FlatOption> => {
      const opts = this.options();
      const expanded = this.expandedNodes();
      const isTree = this.resolvedType() === 'tree';

      if (!isTree) {
        return opts.map((option) => ({
          option,
          level: 0 as DropdownItemLevel,
          hasChildren: false,
          isExpanded: false,
        }));
      }

      const result: FlatOption[] = [];

      const collect = (
        items: ReadonlyArray<DropdownOption>,
        depth: number,
      ): void => {
        for (const option of items) {
          const hasChildren = (option.children?.length ?? 0) > 0;
          const level = Math.min(depth, 2) as DropdownItemLevel;
          const isExpanded = hasChildren && expanded.has(option.id);

          result.push({ option, level, hasChildren, isExpanded });

          if (isExpanded && option.children) {
            collect(option.children, depth + 1);
          }
        }
      };

      collect(opts, 0);

      return result;
    },
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      {
        [classes.hostFullWidth]: this.fullWidth(),
        [classes.hostMode(this.mode())]: true,
      },
      this.className(),
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

  protected readonly resolvedSuffixIcon = computed(
    (): typeof ChevronDownIcon => {
      if (this.loading()) {
        return this.loadingIcon;
      }
      return this.suffixActionIcon() ?? this.chevronDownIcon;
    },
  );

  constructor() {
    effect((onCleanup) => {
      const open = this.isOpen();

      if (open) {
        // globalPortal=true 時 popper 會被搬到 body 層級，不再落在 host 內，
        // 所以 click-away 需同時接受「host」與「popper 根元素」兩個 container —
        // 否則點擊 popped-out 選項會被 capture-phase click-away 判定為 outside
        // 而立刻關閉（multi-select 模式會中斷連續選取）。
        const popperEl = this.triggerPopperRef()?.popperElRef()?.nativeElement;
        const cleanup = this.clickAway.listen(
          [this.hostElRef.nativeElement, popperEl],
          () => this.isOpen.set(false),
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });
  }

  // ── Tree helpers ──────────────────────────────────────────────

  private findOptionById(
    id: string,
    opts: ReadonlyArray<DropdownOption>,
  ): DropdownOption | null {
    for (const opt of opts) {
      if (String(opt.id) === id) return opt;
      if (opt.children) {
        const found = this.findOptionById(id, opt.children);
        if (found) return found;
      }
    }
    return null;
  }

  private getLeafDescendantIds(option: DropdownOption): ReadonlyArray<string> {
    const ids: string[] = [];

    const collect = (opt: DropdownOption): void => {
      if (!opt.children || opt.children.length === 0) {
        ids.push(String(opt.id));
      } else {
        opt.children.forEach(collect);
      }
    };

    collect(option);

    return ids;
  }

  protected isOptionChecked(option: DropdownOption): boolean {
    if (this.resolvedType() !== 'tree') {
      return this.selectedIds().has(option.id);
    }

    const leafIds = this.getLeafDescendantIds(option);
    const selected = this.selectedIds();

    return leafIds.length > 0 && leafIds.every((id) => selected.has(id));
  }

  protected isOptionIndeterminate(option: DropdownOption): boolean {
    if (this.resolvedType() !== 'tree') return false;
    if (!option.children?.length) return false;

    const leafIds = this.getLeafDescendantIds(option);
    const selected = this.selectedIds();
    const count = leafIds.filter((id) => selected.has(id)).length;

    return count > 0 && count < leafIds.length;
  }

  protected getCaretIcon(item: FlatOption): IconDefinition | undefined {
    if (!item.hasChildren || item.level === 2) return undefined;

    return item.isExpanded ? CaretDownIcon : CaretRightIcon;
  }

  private toggleExpand(optionId: string): void {
    this.expandedNodes.update((prev) => {
      const next = new Set(prev);

      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }

      return next;
    });
  }

  // ── Selection handlers ────────────────────────────────────────

  protected onVisibleOptionClick(item: FlatOption): void {
    if (this.resolvedType() === 'tree') {
      if (item.hasChildren) {
        this.toggleExpand(item.option.id);

        return;
      }

      this.onTreeLeafSelect(item.option);
    } else {
      this.onFlatOptionClick(item.option);
    }
  }

  /** Checkbox click handler (prefix mode). stopPropagation prevents (clicked) from firing. */
  protected onVisibleOptionCheckedChange(item: FlatOption): void {
    this.onTreeLeafSelect(item.option);
  }

  private onFlatOptionClick(option: DropdownOption): void {
    const m = this.mode();

    if (m === 'single') {
      this.internalValue.set([option.id]);
      this.onChange(option.id);
      this.isOpen.set(false);
    } else {
      const current = this.internalValue();
      const next = current.includes(option.id)
        ? current.filter((id) => id !== option.id)
        : [...current, option.id];

      this.internalValue.set(next);
      this.onChange(next);
    }

    this.selectionChange.emit(option);
  }

  private onTreeLeafSelect(option: DropdownOption): void {
    const opts = this.options();
    const leafIds = this.getLeafDescendantIds(option);
    const current = this.internalValue();
    const selectedLeafIds = leafIds.filter((id) => current.includes(id));
    const allSelected = selectedLeafIds.length === leafIds.length;

    let next: ReadonlyArray<string>;

    if (allSelected) {
      const leafIdSet = new Set(leafIds);
      next = current.filter((id) => !leafIdSet.has(id));
    } else {
      const existingIdSet = new Set(current);
      const toAdd = leafIds.filter((id) => !existingIdSet.has(id));
      next = [...current, ...toAdd];
    }

    this.internalValue.set(next);
    this.onChange(next);
    this.selectionChange.emit(this.findOptionById(option.id, opts) ?? option);
  }

  protected toggleOpen(): void {
    if (this.disabled() || this.readOnly()) return;

    this.isOpen.update((v) => !v);
    this.onTouched();
  }

  protected onClear(_event: MouseEvent): void {
    this.internalValue.set([]);
    this.onChange(this.mode() === 'single' ? '' : []);
    this.selectionChange.emit({ id: '', name: '' } as DropdownOption);
  }

  protected onTagClose(item: SelectTriggerTagValue): void {
    const next = this.internalValue().filter((id) => id !== item.id);
    this.internalValue.set(next);
    this.onChange(next);
    this.selectionChange.emit({
      id: item.id,
      name: item.name,
    } as DropdownOption);
  }

  protected onListScroll(event: Event): void {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const maxScrollTop = scrollHeight - clientHeight;

    this.onScroll.emit({ scrollTop, maxScrollTop });

    // Check if scrolled to bottom (with 1px threshold for sub-pixel rounding errors)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (isAtBottom && !this.wasAtBottom) {
      this.onReachBottom.emit();
    }

    if (!isAtBottom && this.wasAtBottom) {
      this.onLeaveBottom.emit();
    }

    this.wasAtBottom = isAtBottom;
  }
}
