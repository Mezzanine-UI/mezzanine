import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  signal,
} from '@angular/core';
import { inputTriggerPopperClasses as classes } from '@mezzanine-ui/core/_internal/input-trigger-popper';
import { MznPopper, PopperPlacement } from '@mezzanine-ui/ng/popper';
import { size, type Middleware } from '@floating-ui/dom';

/**
 * 全域遞增計數器，確保後開啟的 popper z-index 永遠高於先開啟的。
 * @internal
 */
let popperOpenSequence = 0;

/**
 * 下拉觸發器共用的 Popper 容器（內部元件，不公開匯出）。
 *
 * 組合 `MznPopper`，固定使用 `bottom-start` 定位、4px 間距，
 * 並可選擇讓浮動層寬度與 anchor 對齊。
 *
 * Select / AutoComplete 等元件共用此元件。
 *
 * @example
 * ```html
 * <div mznInputTriggerPopper [anchor]="triggerEl" [open]="isOpen" [sameWidth]="true">
 *   <div>dropdown options</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznInputTriggerPopper]',
  standalone: true,
  imports: [MznPopper],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '(click)': '$event.stopPropagation()',
    '(touchstart)': '$event.stopPropagation()',
    '(touchmove)': '$event.stopPropagation()',
    '(touchend)': '$event.stopPropagation()',
    '[attr.anchor]': 'null',
    '[attr.open]': 'null',
    '[attr.sameWidth]': 'null',
  },
  template: `
    <div
      mznPopper
      [anchor]="anchor()"
      [open]="open()"
      [placement]="placement"
      [offsetOptions]="offsetOpts"
      [middleware]="resolvedMiddleware()"
      [style.z-index]="zIndex()"
    >
      <ng-content />
    </div>
  `,
})
export class MznInputTriggerPopper {
  /**
   * 參考（錨定）元素。
   */
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();

  /**
   * 是否顯示。
   * @default false
   */
  readonly open = input(false);

  /**
   * 是否讓浮動層最小寬度與 anchor 對齊。
   * @default false
   */
  readonly sameWidth = input(false);

  protected readonly hostClass = classes.host;
  protected readonly placement: PopperPlacement = 'bottom-start';
  protected readonly offsetOpts = { mainAxis: 4 };
  protected readonly zIndex = signal('var(--mzn-z-index-popover)');

  constructor() {
    effect(() => {
      if (this.open()) {
        this.zIndex.set(
          `calc(var(--mzn-z-index-popover) + ${++popperOpenSequence})`,
        );
      }
    });
  }

  protected readonly resolvedMiddleware = computed(
    (): ReadonlyArray<Middleware> => {
      if (!this.sameWidth()) {
        return [];
      }

      return [
        size({
          apply({ rects, elements }) {
            Object.assign(elements.floating.style, {
              minWidth: `${rects.reference.width}px`,
            });
          },
        }),
      ];
    },
  );
}
