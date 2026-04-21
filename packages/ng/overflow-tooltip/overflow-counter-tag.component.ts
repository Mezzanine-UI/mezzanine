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
import { overflowTooltipClasses as classes } from '@mezzanine-ui/core/overflow-tooltip';
import { TagSize } from '@mezzanine-ui/core/tag';
import { type Placement } from '@floating-ui/dom';
import { ClickAwayService } from '@mezzanine-ui/ng/services';
import { MznTag } from '@mezzanine-ui/ng/tag';
import clsx from 'clsx';
import { MznOverflowTooltip } from './overflow-tooltip.component';

/**
 * 溢出計數標籤元件，整合觸發按鈕與浮動標籤面板。
 *
 * 點擊計數標籤後展開 `MznOverflowTooltip`，點擊外部自動關閉。
 * 支援 disabled 與 readOnly 狀態控制。
 *
 * @example
 * ```html
 * import { MznOverflowCounterTag } from '@mezzanine-ui/ng/overflow-tooltip';
 *
 * <span mznOverflowCounterTag
 *   [tags]="overflowTags"
 *   placement="top-start"
 *   (tagDismiss)="onDismiss($event)"
 * ></span>
 * ```
 *
 * @see MznOverflowTooltip
 */
@Component({
  selector: '[mznOverflowCounterTag]',
  standalone: true,
  imports: [MznTag, MznOverflowTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.className]': 'null',
    '[attr.disabled]': 'null',
    '[attr.placement]': 'null',
    '[attr.readOnly]': 'null',
    '[attr.tagSize]': 'null',
    '[attr.tags]': 'null',
  },
  template: `
    <span #triggerEl>
      <span
        mznTag
        type="overflow-counter"
        [count]="tags().length"
        [disabled]="disabled()"
        [readOnly]="readOnly()"
        [size]="tagSize()"
        (tagClick)="toggle()"
      ></span>
    </span>
    <div
      mznOverflowTooltip
      [anchor]="triggerElementRef()!"
      [className]="className()"
      [open]="open()"
      [placement]="placement()"
      [readOnly]="readOnly()"
      [tagSize]="tagSize()"
      [tags]="tags()"
      (tagDismiss)="tagDismiss.emit($event)"
    ></div>
  `,
})
export class MznOverflowCounterTag {
  private readonly clickAway = inject(ClickAwayService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  private readonly triggerElRef =
    viewChild<ElementRef<HTMLElement>>('triggerEl');

  /**
   * 額外 CSS class（透傳給 MznOverflowTooltip）。
   */
  readonly className = input<string>();

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * Popper 定位方向。
   * @default 'top-start'
   */
  readonly placement = input<Placement>('top-start');

  /**
   * 是否唯讀。
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

  readonly open = signal(false);

  /** 供 MznOverflowTooltip 使用的觸發元素。 */
  protected readonly triggerElementRef = this.triggerElRef;

  protected readonly hostClasses = computed((): string =>
    clsx(classes.counterTagHost, {
      [classes.counterTagDisabled]: this.disabled(),
      [classes.counterTagReadOnly]: this.readOnly(),
    }),
  );

  constructor() {
    // Register click-away listener when open
    effect((onCleanup) => {
      const isOpen = this.open();

      if (isOpen) {
        const cleanup = this.clickAway.listen(
          this.hostElRef.nativeElement,
          () => this.open.set(false),
          this.destroyRef,
        );

        onCleanup(() => cleanup());
      }
    });

    // Close when disabled, readOnly, or tagSize changes
    effect(
      () => {
        this.disabled();
        this.readOnly();
        this.tagSize();

        this.open.set(false);
      },
      { allowSignalWrites: true },
    );
  }

  toggle(): void {
    if (this.disabled()) return;
    this.open.update((v) => !v);
  }
}
