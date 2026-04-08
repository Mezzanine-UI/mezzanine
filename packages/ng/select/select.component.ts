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
  DropdownOption,
  DropdownType,
} from '@mezzanine-ui/core/dropdown';
import { ChevronDownIcon, CheckedIcon, SpinnerIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznInputTriggerPopper } from '@mezzanine-ui/ng/_internal';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { mznTranslateTopAnimation } from '@mezzanine-ui/ng/transition';
import { provideValueAccessor } from '@mezzanine-ui/ng/utils';
import { MznSelectTrigger } from './select-trigger.component';
import {
  MznSelectTriggerTags,
  SelectTriggerTagValue,
} from './select-trigger-tags.component';

/**
 * 選擇器元件，點擊觸發器後展開下拉選單供選取。
 *
 * 支援單選與多選模式，實作 `ControlValueAccessor` 支援 Angular Forms。
 * 使用 `MznInputTriggerPopper` 定位下拉選單，`ClickAwayService` 處理外部點擊。
 *
 * @example
 * ```html
 * import { MznSelect } from '@mezzanine-ui/ng/select';
 *
 * <mzn-select
 *   [options]="fruits"
 *   [(ngModel)]="selectedFruit"
 *   placeholder="請選擇水果"
 *   (selectionChange)="onFruitChange($event)"
 * />
 * ```
 *
 * @see MznDropdown
 * @see MznAutocomplete
 */
@Component({
  selector: 'mzn-select',
  standalone: true,
  imports: [
    MznIcon,
    MznInputTriggerPopper,
    MznSelectTrigger,
    MznSelectTriggerTags,
  ],
  providers: [provideValueAccessor(MznSelect)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [mznTranslateTopAnimation],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <mzn-select-trigger
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
        <mzn-select-trigger-tags
          [disabled]="disabled()"
          [overflowStrategy]="overflowStrategy()"
          [readOnly]="readOnly()"
          [size]="size()"
          [value]="selectedTagValues()"
          (tagClosed)="onTagClose($event)"
        />
      }
    </mzn-select-trigger>
    <mzn-input-trigger-popper
      [anchor]="triggerElRef()!"
      [open]="isOpen()"
      [sameWidth]="true"
    >
      @if (isOpen()) {
        <div
          [class]="dropdownRootClass"
          [style.max-height.px]="menuMaxHeight()"
          @mznTranslateTop
        >
          <div [class]="listWrapperClass" (scroll)="onListScroll($event)">
            @if (loading() && loadingPosition() === 'full') {
              <div [class]="statusClass">
                <i mznIcon [icon]="loadingIcon" [spin]="true" [size]="16"></i>
                <span [class]="statusTextClass">{{ loadingText() }}</span>
              </div>
            }
            <ul [class]="listClass" role="listbox">
              @for (option of options(); track option.id) {
                <li
                  role="option"
                  [class]="optionClasses(option)"
                  [attr.aria-selected]="isSelected(option)"
                  (click)="onOptionClick(option); $event.stopPropagation()"
                >
                  <span [class]="cardBodyClass">
                    <span [class]="cardTitleClass">{{ option.name }}</span>
                  </span>
                  @if (isSelected(option)) {
                    <span [class]="appendClass">
                      <i mznIcon [icon]="checkedIcon"></i>
                    </span>
                  }
                </li>
              }
            </ul>
            @if (loading() && loadingPosition() === 'bottom') {
              <div [class]="loadingMoreClass">
                <i mznIcon [icon]="loadingIcon" [spin]="true" [size]="16"></i>
                <span>{{ loadingText() }}</span>
              </div>
            }
          </div>
        </div>
      }
    </mzn-input-trigger-popper>
  `,
})
export class MznSelect implements ControlValueAccessor {
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  protected readonly triggerElRef = viewChild(MznSelectTrigger, {
    read: ElementRef<HTMLElement>,
  });

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
  private lastScrollTop = 0;
  private maxScrollTop = 0;

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

  protected readonly displayText = computed((): string => {
    const ids = this.internalValue();
    const opts = this.options();

    if (ids.length === 0) return '';

    return ids
      .map((id) => opts.find((o) => o.id === id)?.name ?? id)
      .join(', ');
  });

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

  protected readonly dropdownRootClass = dropdownClasses.root;
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
        const cleanup = this.clickAway.listen(
          this.hostElRef.nativeElement,
          () => this.isOpen.set(false),
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });
  }

  protected isSelected(option: DropdownOption): boolean {
    return this.selectedIds().has(option.id);
  }

  protected optionClasses(option: DropdownOption): string {
    return clsx(dropdownClasses.card, {
      [dropdownClasses.cardActive]: this.isSelected(option),
    });
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

  protected onOptionClick(option: DropdownOption): void {
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

  protected onListScroll(event: Event): void {
    const target = event.target as HTMLDivElement;
    const { scrollTop } = target;
    const maxScrollTop = target.scrollHeight - target.clientHeight;

    // Update maxScrollTop only when scrolled to bottom
    if (scrollTop >= maxScrollTop) {
      this.maxScrollTop = maxScrollTop;
    }

    // Emit scroll event
    this.onScroll.emit({ scrollTop, maxScrollTop: this.maxScrollTop });

    // Handle onReachBottom and onLeaveBottom
    if (scrollTop >= maxScrollTop && this.lastScrollTop < maxScrollTop) {
      this.onReachBottom.emit();
    } else if (scrollTop < maxScrollTop && this.lastScrollTop >= maxScrollTop) {
      this.onLeaveBottom.emit();
    }

    this.lastScrollTop = scrollTop;
  }
}
