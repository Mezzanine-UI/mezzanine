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
import { CalendarIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
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
 * <div mznMultipleDatePickerTrigger
 *   [value]="selectedDateValues"
 *   [overflowStrategy]="'counter'"
 *   [clearable]="true"
 *   (tagClosed)="onTagClose($event)"
 *   (cleared)="onClear()"
 * ></div>
 * ```
 *
 * @see MznMultipleDatePicker
 * @see MznTag
 * @see MznTagGroup
 */
@Component({
  selector: '[mznMultipleDatePickerTrigger]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznTextField, MznTag, MznTagGroup, MznOverflowCounterTag],
  host: {
    '[class]': 'hostClasses()',
    '[style.display]': '"inline-flex"',
    '[attr.active]': 'null',
    '[attr.clearable]': 'null',
    '[attr.disabled]': 'null',
    '[attr.error]': 'null',
    '[attr.fullWidth]': 'null',
    '[attr.overflowStrategy]': 'null',
    '[attr.placeholder]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.required]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
  template: `
    <div
      mznTextField
      style="width: 100%"
      [active]="active()"
      [class.mzn-multiple-date-picker-trigger]="true"
      [class.mzn-multiple-date-picker-trigger--selected]="hasValue()"
      [class.mzn-multiple-date-picker-trigger--disabled]="disabled()"
      [class.mzn-multiple-date-picker-trigger--readonly]="readOnly()"
      [clearable]="shouldShowClearable()"
      [forceShowClearable]="shouldShowClearable()"
      [disabled]="disabled()"
      [error]="error()"
      [fullWidth]="fullWidth()"
      [hasSuffix]="true"
      [readonly]="readOnly()"
      [size]="size()"
      (cleared)="cleared.emit($event)"
    >
      <div
        #tagsContainerEl
        [class]="tagsWrapperClasses()"
        (click)="focused.emit()"
      >
        @if (hasValue()) {
          <div #tagsEl [class]="tagsClasses()">
            <div mznTagGroup>
              @for (item of visibleValues(); track item.id) {
                @if (readOnly()) {
                  <span
                    mznTag
                    type="static"
                    [label]="item.name"
                    [readOnly]="true"
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
            <!-- Hidden measurement container (React "fake DOM" pattern) -->
            <div
              #fakeTagsEl
              aria-hidden="true"
              style="position: absolute; pointer-events: none; visibility: hidden; opacity: 0; inset: 0;"
            >
              @for (item of value(); track item.id) {
                <span
                  mznTag
                  [disabled]="disabled()"
                  [label]="item.name"
                  [size]="tagSize()"
                  type="dismissable"
                ></span>
              }
              <span
                mznOverflowCounterTag
                [disabled]="disabled()"
                [readOnly]="readOnly()"
                [tagSize]="tagSize()"
                [tags]="['placeholder']"
              ></span>
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
      <i
        mznIcon
        suffix
        [clickable]="!disabled() && !readOnly()"
        [icon]="calendarIcon"
        (click)="onSuffixClick($event)"
      ></i>
    </div>
  `,
})
export class MznMultipleDatePickerTrigger implements AfterViewInit {
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver: ResizeObserver | null = null;

  private readonly tagsContainerElRef =
    viewChild<ElementRef<HTMLDivElement>>('tagsContainerEl');
  private readonly tagsElRef = viewChild<ElementRef<HTMLDivElement>>('tagsEl');
  private readonly fakeTagsElRef =
    viewChild<ElementRef<HTMLDivElement>>('fakeTagsEl');

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

  /** 後綴圖示點擊事件。 */
  readonly suffixClicked = output<Event>();

  /** 單一標籤關閉事件，回傳被移除的原始 DateType。 */
  readonly tagClosed = output<DateType>();

  // ---------------------------------------------------------------------------
  // Static CSS classes
  // ---------------------------------------------------------------------------

  protected readonly calendarIcon = CalendarIcon;

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
    clsx(classes.host, {
      [classes.hostFullWidth]: this.fullWidth(),
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
   * Measures how many tags fit by reading widths from the hidden "fake DOM"
   * container (which always renders ALL tags). This mirrors React's
   * useSelectTriggerTags approach and avoids the chicken-and-egg problem
   * where visible count determines rendering which determines measurement.
   */
  private recalculate(): void {
    if (this.overflowStrategy() !== 'counter') return;

    const container = this.tagsContainerElRef()?.nativeElement;
    const fakeContainer = this.fakeTagsElRef()?.nativeElement;

    if (!container || !fakeContainer) {
      this.maxVisibleCount.set(Infinity);
      return;
    }

    const tagsEl = this.tagsElRef()?.nativeElement;
    const measureTarget = tagsEl ?? container;
    const cs = getComputedStyle(measureTarget);
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;
    const paddingRight = parseFloat(cs.paddingRight) || 0;
    const maxWidth = container.clientWidth - paddingLeft - paddingRight;

    if (maxWidth <= 0) {
      this.maxVisibleCount.set(Infinity);
      return;
    }

    const fakeTags = Array.from(
      fakeContainer.querySelectorAll<HTMLElement>('.mzn-tag'),
    );
    const fakeEllipsis = fakeContainer.querySelector<HTMLElement>(
      '.mzn-overflow-counter-tag',
    );

    if (fakeTags.length === 0) {
      this.maxVisibleCount.set(Infinity);
      return;
    }

    const ellipsisWidth = fakeEllipsis ? this.getFullWidth(fakeEllipsis) : 0;

    let nextCount = fakeTags.length;
    let consumedWidth = 0;

    for (let i = 0; i < fakeTags.length; i++) {
      const tagWidth = this.getFullWidth(fakeTags[i]);
      const hasOverflow = fakeTags.length - (i + 1) > 0;
      const reservedWidth = hasOverflow ? ellipsisWidth : 0;

      if (consumedWidth + tagWidth + reservedWidth > maxWidth) {
        nextCount = i;
        break;
      }

      consumedWidth += tagWidth;
      nextCount = i + 1;
    }

    this.maxVisibleCount.set(nextCount > 0 ? nextCount : 1);
  }

  /** Measures element width including margins (matching React's getFullWidth). */
  private getFullWidth(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const marginLeft =
      parseFloat(style.marginInlineStart || style.marginLeft || '0') || 0;
    const marginRight =
      parseFloat(style.marginInlineEnd || style.marginRight || '0') || 0;

    return rect.width + marginLeft + marginRight;
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  protected onSuffixClick(event: Event): void {
    event.stopPropagation();
    this.suffixClicked.emit(event);
  }

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
