import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { TagSize } from '@mezzanine-ui/core/tag';
import clsx from 'clsx';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznTagGroup } from '@mezzanine-ui/ng/tag';

/** 表示多選選取值的資料結構。 */
export interface SelectTriggerTagValue {
  /** 唯一識別碼。 */
  readonly id: string;
  /** 顯示名稱。 */
  readonly name: string;
}

/**
 * 多選標籤顯示元件，用於在 Select 觸發器中以 Tag 形式呈現已選取的值。
 *
 * 支援兩種溢出策略：
 * - `counter`：固定一行，超出部分以 `+N` 計數器標籤取代（使用 ResizeObserver 動態計算）。
 * - `wrap`：換行顯示所有標籤。
 *
 * @example
 * ```html
 * import { MznSelectTriggerTags } from '@mezzanine-ui/ng/select';
 *
 * <div mznSelectTriggerTags
 *   [value]="selectedItems"
 *   overflowStrategy="counter"
 *   (tagClosed)="onRemove($event)"
 * ></div>
 * ```
 *
 * @see MznSelect
 * @see MznSelectTrigger
 * @see MznTag
 * @see MznTagGroup
 */
@Component({
  selector: '[mznSelectTriggerTags]',
  standalone: true,
  imports: [MznTag, MznTagGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'wrapperClasses()',
    '[attr.disabled]': 'null',
    '[attr.overflowStrategy]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.size]': 'null',
    '[attr.value]': 'null',
  },
  template: `
    @if (overflowStrategy() === 'wrap') {
      @for (item of value(); track item.id) {
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
              (close)="onTagClose($event, item)"
            ></span>
          }
        </span>
      }
    } @else {
      <div
        #tagsContainer
        [class]="tagsContainerClasses()"
        style="position: relative;"
      >
        <div mznTagGroup>
          @for (item of visibleItems(); track item.id) {
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
                (close)="onTagClose($event, item)"
              ></span>
            }
          }
          @if (overflowCount() > 0) {
            <span
              mznTag
              type="overflow-counter"
              [count]="overflowCount()"
              [disabled]="disabled()"
              [size]="size()"
              (tagClick)="$event.stopPropagation()"
            ></span>
          }
        </div>

        <!-- Fake tags for measurement (React useSelectTriggerTags pattern) -->
        <div
          [class]="fakeTagsClasses()"
          aria-hidden="true"
          style="position: absolute; pointer-events: none; visibility: hidden; opacity: 0; inset: 0;"
        >
          <div mznTagGroup>
            @for (item of value(); track item.id) {
              <span
                mznTag
                type="static"
                [size]="size()"
                [label]="item.name"
              ></span>
            }
            <span
              mznTag
              type="overflow-counter"
              [count]="99"
              [size]="size()"
            ></span>
          </div>
        </div>
      </div>
    }
  `,
})
export class MznSelectTriggerTags implements AfterViewInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  private resizeObserver: ResizeObserver | null = null;

  private readonly tagsContainerRef =
    viewChild<ElementRef<HTMLElement>>('tagsContainer');

  // Internal signals for overflow calculation
  private readonly visibleCount = signal<number>(Infinity);

  /**
   * 是否禁用（傳遞給各 Tag 元件）。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 溢出策略：
   * - `'counter'` — 固定單行，超出以 +N 計數器顯示。
   * - `'wrap'` — 換行顯示所有標籤。
   * @default 'counter'
   */
  readonly overflowStrategy = input<'counter' | 'wrap'>('counter');

  /**
   * 是否唯讀。唯讀時標籤不可關閉。
   * @default false
   */
  readonly readOnly = input(false);

  /**
   * 標籤尺寸。
   * @default 'main'
   */
  readonly size = input<TagSize>('main');

  /**
   * 已選取的值列表。
   * @default []
   */
  readonly value = input<ReadonlyArray<SelectTriggerTagValue>>([]);

  /** 點擊標籤關閉按鈕時發出，攜帶被移除的項目。 */
  readonly tagClosed = output<SelectTriggerTagValue>();

  protected readonly wrapperClasses = computed((): string =>
    clsx(
      classes.triggerTagsInputWrapper,
      this.overflowStrategy() === 'wrap'
        ? classes.triggerTagsInputWrapperWrap
        : classes.triggerTagsInputWrapperEllipsis,
    ),
  );

  protected readonly tagsContainerClasses = computed((): string =>
    clsx(classes.triggerTags, {
      [classes.triggerTagsEllipsis]: this.overflowStrategy() === 'counter',
    }),
  );

  protected readonly fakeTagsClasses = (): string =>
    clsx(classes.triggerTags, classes.triggerTagsEllipsis);

  protected readonly visibleItems = computed(
    (): ReadonlyArray<SelectTriggerTagValue> => {
      const count = this.visibleCount();
      const vals = this.value();
      if (count === Infinity || count >= vals.length) return vals;
      return vals.slice(0, count);
    },
  );

  protected readonly overflowCount = computed((): number => {
    const count = this.visibleCount();
    const total = this.value().length;
    if (count === Infinity || count >= total) return 0;
    return total - count;
  });

  ngAfterViewInit(): void {
    if (this.overflowStrategy() === 'counter') {
      this.setupResizeObserver();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.recalculateOverflow();
    });

    this.resizeObserver.observe(this.hostEl.nativeElement);
  }

  /**
   * Measures how many tags fit using the hidden fake DOM container.
   * Mirrors React's useSelectTriggerTags algorithm.
   */
  private recalculateOverflow(): void {
    const containerEl = this.tagsContainerRef()?.nativeElement;
    if (!containerEl) return;

    const fakeTagsWrapper = containerEl.querySelector<HTMLElement>(
      '[aria-hidden="true"]',
    );
    if (!fakeTagsWrapper) return;

    const tagGroupEl =
      fakeTagsWrapper.querySelector<HTMLElement>('.mzn-tag-group');
    if (!tagGroupEl) return;

    const children = Array.from(tagGroupEl.children) as HTMLElement[];
    // Last child is the overflow counter tag
    const fakeTags = children.filter(
      (el) => !el.classList.contains('mzn-tag--overflow-counter'),
    );
    const fakeEllipsis = children.find((el) =>
      el.classList.contains('mzn-tag--overflow-counter'),
    );

    if (fakeTags.length === 0) return;

    const cs = getComputedStyle(containerEl);
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;
    const paddingRight = parseFloat(cs.paddingRight) || 0;
    const maxWidth = containerEl.clientWidth - paddingLeft - paddingRight;

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

    const newCount = nextCount > 0 ? nextCount : 1;
    if (newCount !== this.visibleCount()) {
      this.visibleCount.set(newCount);
      this.cdr.markForCheck();
    }
  }

  private getFullWidth(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const marginLeft =
      parseFloat(style.marginInlineStart || style.marginLeft || '0') || 0;
    const marginRight =
      parseFloat(style.marginInlineEnd || style.marginRight || '0') || 0;

    return rect.width + marginLeft + marginRight;
  }

  protected onTagClose(event: MouseEvent, item: SelectTriggerTagValue): void {
    event.stopPropagation();
    this.tagClosed.emit(item);
  }
}
