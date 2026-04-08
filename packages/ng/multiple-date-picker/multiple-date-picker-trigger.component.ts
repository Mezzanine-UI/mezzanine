import {
  AfterViewInit,
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
import { multipleDatePickerClasses as classes } from '@mezzanine-ui/core/multiple-date-picker';
import { DateType } from '@mezzanine-ui/core/calendar';
import { TagSize } from '@mezzanine-ui/core/tag';
import { TextFieldSize } from '@mezzanine-ui/core/text-field';
import clsx from 'clsx';
import { MznTag, MznTagGroup } from '@mezzanine-ui/ng/tag';
import { MznTextField } from '@mezzanine-ui/ng/text-field';
import { MznOverflowCounterTag } from '@mezzanine-ui/ng/overflow-tooltip';

/**
 * 多日期選擇器中每個已選日期的資料格式。
 */
export interface DateValue {
  /** 唯一識別碼 */
  readonly id: string;
  /** 顯示名稱 */
  readonly name: string;
  /** 原始日期值 */
  readonly date: DateType;
}

/**
 * 多日期選擇器觸發器元件，以可關閉標籤的形式呈現已選取的日期。
 *
 * 依照 `overflowStrategy` 決定標籤溢出時的呈現方式：
 * - `'counter'`：使用 `MznOverflowCounterTag` 顯示 +N，搭配 ResizeObserver 即時計算可見標籤數量。
 * - `'wrap'`：所有標籤換行顯示。
 *
 * @example
 * ```html
 * import { MznMultipleDatePickerTrigger } from '@mezzanine-ui/ng/multiple-date-picker';
 *
 * <mzn-multiple-date-picker-trigger
 *   [value]="selectedDateValues"
 *   [overflowStrategy]="'counter'"
 *   [clearable]="true"
 *   (tagClosed)="onTagClose($event)"
 *   (cleared)="onClear()"
 * />
 * ```
 *
 * @see MznMultipleDatePicker
 * @see MznTag
 * @see MznTagGroup
 */
@Component({
  selector: 'mzn-multiple-date-picker-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznTextField, MznTag, MznTagGroup, MznOverflowCounterTag],
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <mzn-text-field
      [active]="active()"
      [clearable]="shouldShowClearable()"
      [forceShowClearable]="shouldShowClearable()"
      [disabled]="disabled()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [readonly]="readOnly()"
      [size]="size()"
      (cleared)="cleared.emit($event)"
    >
      <div #tagsContainerEl [class]="tagsWrapperClasses()">
        @if (hasValue()) {
          <div #tagsEl [class]="tagsClasses()">
            <div mznTagGroup>
              @for (item of visibleValues(); track item.id) {
                @if (readOnly()) {
                  <span
                    mznTag
                    type="static"
                    [label]="item.name"
                    [size]="tagSize()"
                  ></span>
                } @else {
                  <span
                    mznTag
                    type="dismissable"
                    [disabled]="disabled()"
                    [label]="item.name"
                    [size]="tagSize()"
                    (close)="onTagClose($event, item.date)"
                  ></span>
                }
              }
              @if (
                overflowStrategy() === 'counter' && overflowValues().length > 0
              ) {
                <span
                  mznOverflowCounterTag
                  [disabled]="disabled()"
                  [readOnly]="readOnly()"
                  [tagSize]="tagSize()"
                  [tags]="overflowNames()"
                  (tagDismiss)="onOverflowTagDismiss($event)"
                ></span>
              }
            </div>
          </div>
          <input
            [attr.aria-disabled]="disabled()"
            [attr.aria-multiline]="false"
            [attr.aria-readonly]="readOnly()"
            [attr.aria-required]="required()"
            [class]="absoluteInputClass"
            [disabled]="disabled()"
            readOnly
            tabindex="-1"
            type="text"
            value=""
          />
        } @else {
          <input
            [attr.aria-disabled]="disabled()"
            [attr.aria-multiline]="false"
            [attr.aria-readonly]="readOnly()"
            [attr.aria-required]="required()"
            [class]="inputClass"
            [disabled]="disabled()"
            [placeholder]="placeholder()"
            readOnly
            tabindex="-1"
            type="text"
            value=""
          />
        }
      </div>
      <ng-content select="[suffix]" />
    </mzn-text-field>
  `,
})
export class MznMultipleDatePickerTrigger implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver: ResizeObserver | null = null;

  private readonly tagsContainerElRef =
    viewChild<ElementRef<HTMLDivElement>>('tagsContainerEl');
  private readonly tagsElRef = viewChild<ElementRef<HTMLDivElement>>('tagsEl');

  /** 最大可見標籤數量（counter 模式下由 ResizeObserver 計算）。 */
  private readonly maxVisibleCount = signal<number>(Infinity);

  // ---------------------------------------------------------------------------
  // Inputs (alphabetical)
  // ---------------------------------------------------------------------------

  /**
   * 是否處於 active（開啟）狀態。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否顯示清除按鈕。
   * @default true
   */
  readonly clearable = input(true);

  /**
   * 是否停用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否為錯誤狀態。
   * @default false
   */
  readonly error = input(false);

  /**
   * 是否全寬。
   * @default false
   */
  readonly fullWidth = input(false);

  /**
   * 標籤溢出時的顯示策略。
   * - `'counter'`：顯示 +N 計數標籤
   * - `'wrap'`：換行顯示所有標籤
   * @default 'counter'
   */
  readonly overflowStrategy = input<'counter' | 'wrap'>('counter');

  /**
   * 佔位文字，無選取值時顯示。
   * @default ''
   */
  readonly placeholder = input('');

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readOnly = input(false);

  /**
   * 是否必填。
   * @default false
   */
  readonly required = input(false);

  /**
   * 觸發器尺寸。
   * @default 'main'
   */
  readonly size = input<TextFieldSize>('main');

  /**
   * 已選取日期的清單。
   * @default []
   */
  readonly value = input<ReadonlyArray<DateValue>>([]);

  // ---------------------------------------------------------------------------
  // Outputs
  // ---------------------------------------------------------------------------

  /** 清除按鈕點擊事件。 */
  readonly cleared = output<MouseEvent>();

  /** 觸發器聚焦事件。 */
  readonly focused = output<void>();

  /** 單一標籤關閉事件，回傳被移除的原始 DateType。 */
  readonly tagClosed = output<DateType>();

  // ---------------------------------------------------------------------------
  // Static CSS classes
  // ---------------------------------------------------------------------------

  protected readonly inputClass = classes.triggerInput;
  protected readonly absoluteInputClass = clsx(
    classes.triggerInput,
    classes.triggerInputAbsolute,
  );

  // ---------------------------------------------------------------------------
  // Computed
  // ---------------------------------------------------------------------------

  protected readonly hasValue = computed(
    (): boolean => this.value().length > 0,
  );

  protected readonly tagSize = computed(
    (): TagSize => (this.size() === 'main' ? 'main' : 'sub'),
  );

  protected readonly shouldShowClearable = computed(
    (): boolean => !this.readOnly() && this.clearable() && this.hasValue(),
  );

  protected readonly visibleValues = computed((): ReadonlyArray<DateValue> => {
    if (this.overflowStrategy() !== 'counter') return this.value();
    const max = this.maxVisibleCount();
    if (!isFinite(max)) return this.value();
    return this.value().slice(0, max);
  });

  protected readonly overflowValues = computed((): ReadonlyArray<DateValue> => {
    if (this.overflowStrategy() !== 'counter') return [];
    const max = this.maxVisibleCount();
    if (!isFinite(max)) return [];
    return this.value().slice(max);
  });

  protected readonly overflowNames = computed((): string[] =>
    this.overflowValues().map((v) => v.name),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(classes.trigger, {
      [classes.triggerSelected]: this.hasValue(),
      [classes.triggerDisabled]: this.disabled(),
      [classes.triggerReadOnly]: this.readOnly(),
    }),
  );

  protected readonly tagsWrapperClasses = computed((): string =>
    clsx(classes.triggerTagsWrapper, {
      [classes.triggerTagsWrapperEllipsis]:
        this.overflowStrategy() === 'counter',
    }),
  );

  protected readonly tagsClasses = computed((): string =>
    clsx(classes.triggerTags, {
      [classes.triggerTagsEllipsis]: this.overflowStrategy() === 'counter',
    }),
  );

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  constructor() {
    // React to value or overflowStrategy changes to trigger recalculation
    effect(() => {
      this.value();
      this.overflowStrategy();

      if (this.overflowStrategy() === 'counter') {
        this.recalculate();
      } else {
        this.maxVisibleCount.set(Infinity);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.overflowStrategy() === 'counter') {
      this.setupResizeObserver();
    }
  }

  // ---------------------------------------------------------------------------
  // Overflow calculation
  // ---------------------------------------------------------------------------

  private setupResizeObserver(): void {
    const container = this.tagsContainerElRef()?.nativeElement;

    if (!container) return;

    this.resizeObserver = new ResizeObserver(() => {
      this.recalculate();
    });

    this.resizeObserver.observe(container);

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
    });
  }

  /**
   * Measures how many tags fit within the container width by comparing
   * cumulative tag widths against the available container width.
   * Reserves space for the counter tag when not all items fit.
   */
  private recalculate(): void {
    if (this.overflowStrategy() !== 'counter') return;

    const container = this.tagsContainerElRef()?.nativeElement;
    const tagsEl = this.tagsElRef()?.nativeElement;

    if (!container || !tagsEl) {
      this.maxVisibleCount.set(Infinity);
      return;
    }

    const containerWidth = container.getBoundingClientRect().width;

    if (containerWidth === 0) {
      this.maxVisibleCount.set(Infinity);
      return;
    }

    const tagEls = Array.from(tagsEl.querySelectorAll<HTMLElement>('mzn-tag'));
    const counterTagEl = tagsEl.querySelector<HTMLElement>(
      'mzn-overflow-counter-tag',
    );

    if (tagEls.length === 0) {
      this.maxVisibleCount.set(Infinity);
      return;
    }

    const counterWidth = counterTagEl
      ? counterTagEl.getBoundingClientRect().width
      : 40; // estimated fallback for counter tag

    let accumulated = 0;
    let fits = 0;

    for (const el of tagEls) {
      const w = el.getBoundingClientRect().width;
      const remaining = tagEls.length - fits - 1;
      const wouldOverflow = accumulated + w > containerWidth;

      if (wouldOverflow) {
        // Check if we can fit remaining in counter mode
        if (accumulated + counterWidth <= containerWidth) {
          break;
        }
        break;
      }

      const nextWouldOverflow =
        remaining > 0 && accumulated + w + counterWidth > containerWidth;

      if (nextWouldOverflow && remaining > 0) {
        // This tag fits but the rest won't — stop here and show counter
        fits += 1;
        break;
      }

      accumulated += w;
      fits += 1;
    }

    this.maxVisibleCount.set(fits > 0 ? fits : 1);
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  protected onTagClose(event: MouseEvent, date: DateType): void {
    event.stopPropagation();
    this.tagClosed.emit(date);
  }

  protected onOverflowTagDismiss(index: number): void {
    const target = this.overflowValues()[index];

    if (target) {
      this.tagClosed.emit(target.date);
    }
  }
}
