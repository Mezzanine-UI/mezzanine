import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';
import { TagSize } from '@mezzanine-ui/core/tag';
import { type Placement } from '@floating-ui/dom';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';
import { MznPopper } from '@mezzanine-ui/ng/popper';
import { MznTag } from '@mezzanine-ui/ng/tag';
import { MznFade } from '@mezzanine-ui/ng/transition';
import clsx from 'clsx';

const FADE_FAST_DURATION = {
  enter: MOTION_DURATION.fast,
  exit: MOTION_DURATION.fast,
};

const FADE_FAST_EASING = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

/**
 * 浮動標籤面板元件，用於顯示溢出標籤清單。
 *
 * 基於 `MznPopper` 定位，支援可關閉與唯讀兩種模式。
 * 開啟時自動量測內容寬度以對齊多列標籤。
 *
 * @example
 * ```html
 * import { MznOverflowTooltip } from '@mezzanine-ui/ng/overflow-tooltip';
 *
 * <div #anchor style="width: 32px; height: 32px;"></div>
 * <div mznOverflowTooltip
 *   [anchor]="anchor"
 *   [open]="isOpen"
 *   [tags]="['Tag 1', 'Tag 2', 'Tag 3']"
 *   (tagDismiss)="onDismiss($event)"
 * ></div>
 * ```
 *
 * @see MznOverflowCounterTag
 */
@Component({
  selector: '[mznOverflowTooltip]',
  host: {
    '[attr.anchor]': 'null',
    '[attr.className]': 'null',
    '[attr.open]': 'null',
    '[attr.placement]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.tagSize]': 'null',
    '[attr.tags]': 'null',
  },
  standalone: true,
  imports: [MznPopper, MznTag, MznFade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="popperOpen()"
      [placement]="placement()"
      [arrowOptions]="arrowConfig"
      [offsetOptions]="offsetConfig"
      [class]="hostClasses()"
    >
      <div
        mznFade
        [in]="open()"
        [duration]="fadeFastDuration"
        [easing]="fadeFastEasing"
        (onExited)="onFadeExited()"
      >
        <div #contentEl [class]="classes.content">
          @for (tag of tags(); track $index) {
            @if (readOnly()) {
              <span
                mznTag
                type="static"
                [label]="tag"
                [readOnly]="true"
                [size]="tagSize()"
              ></span>
            } @else {
              <span
                mznTag
                type="dismissable"
                [label]="tag"
                [size]="tagSize()"
                (close)="tagDismiss.emit($index)"
              ></span>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class MznOverflowTooltip {
  protected readonly classes = classes;
  protected readonly fadeFastDuration = FADE_FAST_DURATION;
  protected readonly fadeFastEasing = FADE_FAST_EASING;

  protected readonly arrowConfig = {
    enabled: true,
    className: classes.arrow,
    padding: 12,
  };

  protected readonly offsetConfig = { mainAxis: 10 };

  private readonly contentElRef =
    viewChild<ElementRef<HTMLElement>>('contentEl');

  /**
   * 錨定元素。
   */
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();

  /**
   * 額外 CSS class。
   */
  readonly className = input<string>();

  /**
   * 是否開啟。
   * @default false
   */
  readonly open = input(false);

  /**
   * Popper 定位方向。
   * @default 'top-start'
   */
  readonly placement = input<Placement>('top-start');

  /**
   * 是否唯讀（唯讀時標籤不可關閉）。
   * @default false
   */
  readonly readOnly = input(false);

  /**
   * 標籤尺寸。
   * @default 'main'
   */
  readonly tagSize = input<TagSize>('main');

  /**
   * 標籤清單。
   */
  readonly tags = input.required<string[]>();

  /** 標籤關閉事件，回傳被移除標籤的索引。 */
  readonly tagDismiss = output<number>();

  /** 控制 MznPopper 的顯示，在淡出結束後才設為 false。 */
  readonly popperOpen = signal(false);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, this.className()),
  );

  constructor() {
    // When open becomes true, show the popper immediately
    effect(() => {
      if (this.open()) {
        this.popperOpen.set(true);
      }
    });

    // Measure content width after tags render to align rows
    effect((onCleanup) => {
      const isOpen = this.popperOpen();
      const tags = this.tags();
      const tagSize = this.tagSize();
      const readOnly = this.readOnly();

      if (!isOpen) return;

      // Consume to establish dependency tracking
      void tags;
      void tagSize;
      void readOnly;

      // defer to next frame so the DOM is fully laid out
      const rafId = requestAnimationFrame(() => {
        const contentEl = this.contentElRef()?.nativeElement;
        if (!contentEl) return;

        contentEl.style.width = '';

        const children = Array.from(contentEl.children) as HTMLElement[];
        if (!children.length) return;

        const rows = new Map<number, HTMLElement[]>();
        children.forEach((child) => {
          const top = Math.round(child.getBoundingClientRect().top);
          if (!rows.has(top)) {
            rows.set(top, []);
          }
          rows.get(top)!.push(child);
        });

        const computedStyle = getComputedStyle(contentEl);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);
        const contentLeft = contentEl.getBoundingClientRect().left;

        let maxRowWidth = 0;
        rows.forEach((rowItems) => {
          const lastItem = rowItems[rowItems.length - 1];
          const rowWidth =
            lastItem.getBoundingClientRect().right - contentLeft - paddingLeft;
          maxRowWidth = Math.max(maxRowWidth, rowWidth);
        });

        contentEl.style.width = `${maxRowWidth + paddingLeft + paddingRight}px`;
      });

      onCleanup(() => cancelAnimationFrame(rafId));
    });
  }

  protected onFadeExited(): void {
    this.popperOpen.set(false);
  }
}
