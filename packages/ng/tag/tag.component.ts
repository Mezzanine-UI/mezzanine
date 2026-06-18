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
 * 按鈕型標籤（`addable` / `overflow-counter`）對應 React 直接以 `<button>` 為根節點，
 * 因此消費端應把 `mznTag` 套在 `<button>` 上（`<button mznTag type="addable">`）以對齊
 * DOM；其餘型別則套在 `<span>` 上。若按鈕型標籤仍套在 `<span>` 上（例如 runtime 動態
 * `[type]`），元件會自動退回內層 `<button>` + `display: contents` 包裹以維持行為。
 *
 * @example
 * ```html
 * import { MznTag } from '@mezzanine-ui/ng/tag';
 *
 * <span mznTag type="static" label="設計" ></span>
 * <span mznTag type="counter" label="待處理" [count]="3" ></span>
 * <span mznTag type="dismissable" label="React" (close)="removeTag('React')" ></span>
 * <button mznTag type="addable" label="新增標籤" (tagClick)="handleAdd()" ></button>
 * <button mznTag type="overflow-counter" [count]="5" (tagClick)="expand()" ></button>
 * ```
 */
@Component({
  selector: '[mznTag]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MznIcon, MznBadge],
  host: {
    '[class]': 'hostClasses()',
    // When the consumer places `[mznTag]` directly on a `<button>` host for
    // a button-typed tag (addable / overflow-counter), the host button owns
    // all tag styling and semantics — mirroring React's `Tag` that renders a
    // `<button>` root. This keeps DOM parity (no extra wrapper node) and lets
    // React's SCSS selectors — `.mzn-tag:is(button)`, `:disabled`,
    // `:has(> :last-child.label)` padding rules — match the host directly.
    '[attr.type]': "isButtonHost() ? 'button' : null",
    '[attr.disabled]': "isButtonHost() && disabled() ? '' : null",
    // Fallback: a button-typed tag still rendered on a `<span>` host (e.g. the
    // Playground story's runtime `[type]`). The inner `<button>` carries the
    // tag classes and the host span becomes `display: contents` so it's
    // transparent in layout. Preserves backward compatibility for any host
    // that can't switch element by type.
    '[style.display]': "isButtonFallback() ? 'contents' : null",
    '[attr.aria-disabled]':
      "isButtonType() ? null : (disabled() ? 'true' : 'false')",
    '(click)': 'onHostClick($event)',
    '[attr.label]': 'null',
    '[attr.size]': 'null',
    '[attr.count]': 'null',
    '[attr.active]': 'null',
    '[attr.readOnly]': 'null',
  },
  template: `
    @switch (type()) {
      @case ('overflow-counter') {
        @if (isButtonHost()) {
          <i mznIcon [class]="classes.icon" [icon]="plusIcon" [size]="16"></i>
          <span [class]="classes.label">{{ count() }}</span>
        } @else {
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
      }
      @case ('addable') {
        @if (isButtonHost()) {
          <i mznIcon [class]="classes.icon" [icon]="plusIcon" [size]="16"></i>
          <span [class]="classes.label">{{ label() }}</span>
        } @else {
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

  /** Whether this tag type renders as a button in React (addable /
   *  overflow-counter). Drives content shape (icon + label) and the
   *  suppression of `aria-disabled` in favour of native `disabled`. */
  protected readonly isButtonType = computed(
    (): boolean =>
      this.type() === 'addable' || this.type() === 'overflow-counter',
  );

  /** True when a button-typed tag is hosted on a native `<button>` element
   *  (the consumer wrote `<button mznTag …>`). The host button then owns the
   *  tag classes and semantics directly — no inner wrapper — matching React's
   *  `<button>` root and keeping DOM parity. */
  protected readonly isButtonHost = computed(
    (): boolean => this.isButtonType() && this.hostIsButton,
  );

  /** True when a button-typed tag is hosted on a non-button element (e.g. the
   *  Playground story's runtime `[type]` on a `<span>`). Falls back to the
   *  inner-`<button>` + `display: contents` wrapper for backward compat. */
  protected readonly isButtonFallback = computed(
    (): boolean => this.isButtonType() && !this.hostIsButton,
  );

  /** Whether the host element is a native `<button>`. Captured once in the
   *  constructor; the host element type is fixed at template-compile time. */
  private readonly hostIsButton: boolean;

  /**
   * Any classes the consumer put on the host element in the template
   * (e.g. `<span mznTag class="is-hover">` from the Playground fallback).
   * Captured once in the constructor — before Angular applies the
   * `[class]` host binding — so we can forward them to the inner
   * `<button>` in the fallback path. Without this step,
   * `.mzn-tag--addable.is-hover` never matches any element because the
   * managed tag classes live on the button while `is-hover` stays on
   * the span. Unused on the button-host path, where the host owns both.
   */
  private readonly hostExtraClass: string;

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;

    this.hostIsButton = el.tagName === 'BUTTON';
    this.hostExtraClass = Array.from(el.classList).join(' ');
  }

  /** Shared class composition used by whichever element actually owns
   *  the tag styling (host span/button for most cases, or the inner
   *  button for the button-typed span fallback). */
  private readonly tagClasses = computed((): string =>
    clsx(classes.host, classes.size(this.size()), classes.type(this.type()), {
      [classes.disabled]: this.disabled(),
      [classes.active]: this.active(),
      [classes.readOnly]: this.readOnly(),
    }),
  );

  protected readonly hostClasses = computed((): string =>
    this.isButtonFallback() ? '' : this.tagClasses(),
  );

  protected readonly buttonHostClasses = computed((): string =>
    clsx(this.tagClasses(), this.hostExtraClass),
  );

  /** Forwards a native click on a `<button mznTag>` host to `tagClick`.
   *  No-op for non-button hosts (static/counter/dismissable) and for the
   *  span fallback, where the inner `<button>` emits `tagClick` itself. */
  protected onHostClick(event: MouseEvent): void {
    if (this.isButtonHost()) {
      this.tagClick.emit(event);
    }
  }
}
