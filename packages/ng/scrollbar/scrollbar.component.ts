import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import {
  ClickScrollPlugin,
  type EventListeners,
  OverlayScrollbars,
  type PartialOptions,
} from 'overlayscrollbars';
import { scrollbarClasses as classes } from '@mezzanine-ui/core/scrollbar';
import clsx from 'clsx';

/**
 * 自訂捲軸容器元件，提供跨瀏覽器一致的捲軸樣式。
 *
 * 整合 `overlayscrollbars` 套件，支援點擊捲軸、自動隱藏等進階行為。
 * 可透過 `maxHeight` / `maxWidth` 限制尺寸，透過 `disabled` 退回原生捲軸。
 *
 * @example
 * ```html
 * import { MznScrollbar } from '@mezzanine-ui/ng/scrollbar';
 *
 * <div mznScrollbar maxHeight="300px" (viewportReady)="onReady($event)">
 *   <div>Long content...</div>
 * </div>
 * ```
 *
 * @see {@link https://kingsora.github.io/OverlayScrollbars/ OverlayScrollbars}
 */
@Component({
  selector: '[mznScrollbar]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.max-height]': 'maxHeight()',
    '[style.max-width]': 'maxWidth()',
    '[attr.defer]': 'null',
    '[attr.disabled]': 'null',
    '[attr.events]': 'null',
    '[attr.maxHeight]': 'null',
    '[attr.maxWidth]': 'null',
    '[attr.options]': 'null',
  },
  template: `<ng-content />`,
})
export class MznScrollbar implements OnDestroy {
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private osInstance: OverlayScrollbars | undefined;

  /**
   * 是否延遲初始化 OverlayScrollbars，可改善首次渲染效能。
   * 傳入 `true` 使用 `requestIdleCallback`/`requestAnimationFrame`；
   * 傳入物件可設定 `{ timeout: number }` 延遲毫秒數。
   * @default true
   */
  readonly defer = input<boolean | { timeout?: number }>(true);

  /**
   * 是否禁用自訂捲軸，退回原生捲軸行為。
   * @default false
   */
  readonly disabled = input(false);

  /**
   * OverlayScrollbars 事件處理器。
   * @see {@link https://kingsora.github.io/OverlayScrollbars/#!documentation/events OverlayScrollbars Events}
   */
  readonly events = input<EventListeners>();

  /** 最大高度（CSS 字串值，例如 `'300px'`、`'50vh'`）。 */
  readonly maxHeight = input<string>();

  /** 最大寬度（CSS 字串值，例如 `'500px'`、`'100%'`）。 */
  readonly maxWidth = input<string>();

  /**
   * 傳遞給 OverlayScrollbars 的額外選項。
   * 會與預設選項合併（預設啟用點擊捲軸與自動隱藏）。
   * @see {@link https://kingsora.github.io/OverlayScrollbars/#!documentation/options OverlayScrollbars Options}
   */
  readonly options = input<PartialOptions>();

  /** 捲軸初始化完成時觸發，提供 viewport 元素供外部整合（如虛擬化、DnD）使用。 */
  readonly viewportReady = output<{
    viewport: HTMLDivElement;
    instance?: OverlayScrollbars;
  }>();

  protected readonly hostClasses = computed((): string =>
    this.disabled() ? '' : clsx(classes.host),
  );

  constructor() {
    afterNextRender(() => {
      this.initOverlayScrollbars();
    });
  }

  ngOnDestroy(): void {
    this.osInstance?.destroy();
    this.osInstance = undefined;
  }

  private initOverlayScrollbars(): void {
    if (this.disabled()) {
      const el = this.elementRef.nativeElement as HTMLDivElement;

      this.viewportReady.emit({ viewport: el });

      return;
    }

    const doInit = (): void => {
      OverlayScrollbars.plugin(ClickScrollPlugin);

      const userOptions = this.options();
      const mergedOptions: PartialOptions = {
        ...userOptions,
        overflow: {
          x: 'scroll',
          y: 'scroll',
        },
        scrollbars: {
          autoHide: 'scroll',
          autoHideDelay: 600,
          clickScroll: true,
          ...userOptions?.scrollbars,
        },
      };

      const userEvents = this.events();
      const mergedEvents: EventListeners = {
        ...userEvents,
        initialized: (instance: OverlayScrollbars) => {
          const { viewport } = instance.elements();

          this.viewportReady.emit({
            viewport: viewport as HTMLDivElement,
            instance,
          });

          const existingInitialized = userEvents?.initialized;

          if (existingInitialized) {
            if (Array.isArray(existingInitialized)) {
              existingInitialized.forEach((handler) => handler(instance));
            } else {
              existingInitialized(instance);
            }
          }
        },
      };

      this.osInstance = OverlayScrollbars(
        this.elementRef.nativeElement,
        mergedOptions,
        mergedEvents,
      );
    };

    const deferValue = this.defer();

    if (!deferValue) {
      doInit();

      return;
    }

    const win = window as Window & {
      requestIdleCallback?: (
        cb: () => void,
        opts?: { timeout?: number },
      ) => number;
    };

    if (typeof win.requestIdleCallback === 'function') {
      const timeout =
        typeof deferValue === 'object' && deferValue.timeout != null
          ? deferValue.timeout
          : 2233;

      win.requestIdleCallback(doInit, { timeout });
    } else {
      requestAnimationFrame(doInit);
    }
  }
}
