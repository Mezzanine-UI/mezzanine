import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import {
  TagSize,
  TagType,
  tagClasses as classes,
} from '@mezzanine-ui/core/tag';
import { PlusIcon, CloseIcon, IconDefinition } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznBadge } from '@mezzanine-ui/ng/badge';

/**
 * 標籤元件，用於分類、篩選或標記內容。
 *
 * 支援五種模式：`static`（純標籤）、`counter`（帶數字）、`dismissable`（可關閉）、
 * `addable`（可新增）及 `overflow-counter`（溢出計數）。
 *
 * @example
 * ```html
 * import { MznTag } from '@mezzanine-ui/ng/tag';
 *
 * <span mznTag type="static" label="設計" ></span>
 * <span mznTag type="counter" label="待處理" [count]="3" ></span>
 * <span mznTag type="dismissable" label="React" (close)="removeTag('React')" ></span>
 * <span mznTag type="addable" label="新增標籤" (click)="handleAdd()" ></span>
 * ```
 */
@Component({
  selector: '[mznTag]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznBadge],
  host: {
    '[class]': 'hostClasses()',
    // For button-typed tags (addable / overflow-counter) the inner
    // <button> carries all tag classes so React's SCSS selectors —
    // `.mzn-tag--addable:is(button):disabled`, `:has(> :last-child.label)`
    // padding rules, hover / active pseudo-class rules — match. The
    // host <span> becomes `display: contents` so it's transparent in
    // layout and doesn't intercept the cascade.
    '[style.display]': "isButtonHost() ? 'contents' : null",
    '[attr.aria-disabled]': 'isButtonHost() ? null : (disabled() || null)',
    '[attr.type]': 'null',
    '[attr.label]': 'null',
    '[attr.size]': 'null',
    '[attr.count]': 'null',
    '[attr.disabled]': 'null',
    '[attr.active]': 'null',
    '[attr.readOnly]': 'null',
  },
  template: `
    @switch (type()) {
      @case ('overflow-counter') {
        <button
          type="button"
          [class]="buttonHostClasses()"
          [disabled]="disabled()"
          (click)="tagClick.emit($event)"
        >
          <i mznIcon [class]="classes.icon" [icon]="plusIcon" [size]="16"></i>
          <span [class]="classes.label">{{ count() }}</span>
        </button>
      }
      @case ('addable') {
        <button
          type="button"
          [class]="buttonHostClasses()"
          [disabled]="disabled()"
          (click)="tagClick.emit($event)"
        >
          <i mznIcon [class]="classes.icon" [icon]="plusIcon" [size]="16"></i>
          <span [class]="classes.label">{{ label() }}</span>
        </button>
      }
      @default {
        <span [class]="classes.label">{{ label() }}</span>
        @if (type() === 'counter') {
          <div mznBadge variant="count-info" [count]="count() ?? 0"></div>
        }
        @if (type() === 'dismissable') {
          <button
            [class]="classes.closeButton"
            type="button"
            [disabled]="disabled()"
            (click)="close.emit($event)"
          >
            <i
              mznIcon
              [class]="classes.icon"
              [icon]="closeIcon"
              [size]="16"
            ></i>
          </button>
        }
      }
    }
  `,
})
export class MznTag {
  protected readonly classes = classes;
  protected readonly plusIcon: IconDefinition = PlusIcon;
  protected readonly closeIcon: IconDefinition = CloseIcon;

  /**
   * 標籤類型。
   * @default 'static'
   */
  readonly type = input<TagType>('static');

  /** 標籤顯示的文字。 */
  readonly label = input<string>();

  /**
   * 標籤尺寸。
   * @default 'main'
   */
  readonly size = input<TagSize>('main');

  /** 計數器/溢出計數器的數字。 */
  readonly count = input<number>();

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * 是否啟用中。
   * @default false
   */
  readonly active = input(false);

  /**
   * 是否唯讀。
   * @default false
   */
  readonly readOnly = input(false);

  /** 可關閉標籤的關閉事件。 */
  readonly close = output<MouseEvent>();

  /** 可點擊標籤（addable/overflow-counter）的點擊事件。 */
  readonly tagClick = output<MouseEvent>();

  /** True when the tag's host should be transparent and the inner
   *  `<button>` carries the tag classes — mirrors React's Tag that
   *  renders a `<button>` root for addable / overflow-counter. */
  protected readonly isButtonHost = computed(
    (): boolean =>
      this.type() === 'addable' || this.type() === 'overflow-counter',
  );

  /**
   * Any classes the consumer put on the host element in the template
   * (e.g. `<span mznTag class="is-hover">` from the Types story).
   * Captured once in the constructor — before Angular applies the
   * `[class]` host binding — so we can forward them to the inner
   * `<button>` when the tag is button-hosted. Without this step,
   * `.mzn-tag--addable.is-hover` never matches any element because the
   * managed tag classes live on the button while `is-hover` stays on
   * the span.
   */
  private readonly hostExtraClass: string;

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;

    this.hostExtraClass = Array.from(el.classList).join(' ');
  }

  /** Shared class composition used by whichever element actually owns
   *  the tag styling (host span for static/counter/dismissable, or the
   *  inner button for addable/overflow-counter). */
  private readonly tagClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), classes.type(this.type()), {
      [classes.disabled]: this.disabled(),
      [classes.active]: this.active(),
      [classes.readOnly]: this.readOnly(),
    }),
  );

  protected readonly hostClasses = computed((): string =>
    this.isButtonHost() ? '' : this.tagClasses(),
  );

  protected readonly buttonHostClasses = computed((): string =>
    clsx(this.tagClasses(), this.hostExtraClass),
  );
}
