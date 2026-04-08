import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  arrow as arrowMiddleware,
  type Middleware,
  type Placement,
  type Strategy,
} from '@floating-ui/dom';

/** Popper 支援的定位方向。 */
export type PopperPlacement = Placement;

/** Popper 定位策略。 */
export type PopperPositionStrategy = Strategy;

/** Popper 箭頭設定。 */
export interface PopperArrowOptions {
  /** 箭頭額外 CSS class。 */
  readonly className?: string;
  /** 是否顯示箭頭。 */
  readonly enabled: boolean;
  /** 箭頭內邊距（防止箭頭超出圓角）。 */
  readonly padding?: number;
}

/** Popper 位移設定。 */
export interface PopperOffsetOptions {
  /** 交叉軸偏移。 */
  readonly crossAxis?: number;
  /** 主軸偏移（anchor 到 floating 的距離）。 */
  readonly mainAxis?: number;
}

const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;

/**
 * 根據 placement 的主方向決定箭頭的旋轉角度。
 * 對應 React 實作：top=0deg、right=90deg、bottom=180deg、left=-90deg。
 */
const SIDE_TO_ROTATION: Record<string, number> = {
  bottom: 180,
  left: -90,
  right: 90,
  top: 0,
};

/**
 * 根據 placement 的主方向決定箭頭需設置的靜態側邊偏移屬性。
 * 對應 React 實作中的 staticSide 計算。
 */
const SIDE_TO_STATIC: Record<string, { property: string; value: string }> = {
  bottom: { property: 'top', value: '-6px' },
  left: { property: 'right', value: '-8px' },
  right: { property: 'left', value: '-8px' },
  top: { property: 'bottom', value: '-6px' },
};

/**
 * 以 `@floating-ui/dom` 為基礎的浮動定位元件。
 *
 * 接收 `anchor` 參考元素，將投影內容定位於其周圍。
 * 支援自動翻轉、偏移、箭頭、以及 anchor 隱藏時自動隱藏。
 *
 * @example
 * ```html
 * import { MznPopper } from '@mezzanine-ui/ng/popper';
 *
 * <button #anchor>Toggle</button>
 * <div mznPopper [anchor]="anchor" [open]="isOpen" placement="bottom-start">
 *   <div>Popper content</div>
 * </div>
 * ```
 *
 * @see MznPortal
 */
@Component({
  selector: '[mznPopper]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.position]': 'strategy()',
    '[style.top.px]': 'floatingY()',
    '[style.left.px]': 'floatingX()',
    '[style.display]': 'open() ? null : "none"',
    '[style.visibility]': 'referenceHidden() ? "hidden" : null',
    '[attr.data-popper-placement]': 'currentPlacement()',
    '[attr.anchor]': 'null',
    '[attr.arrowOptions]': 'null',
    '[attr.middleware]': 'null',
    '[attr.offsetOptions]': 'null',
    '[attr.open]': 'null',
    '[attr.placement]': 'null',
    '[attr.strategy]': 'null',
  },
  template: `
    <ng-content />
    @if (arrowOptions()?.enabled) {
      <svg
        #arrowEl
        [attr.class]="arrowOptions()?.className ?? null"
        viewBox="0 0 12 6"
        fill="none"
        [style]="arrowStyle()"
        [attr.width]="arrowWidth"
        [attr.height]="arrowHeight"
      >
        <path
          d="M6.70711 5.29289C6.31658 5.68342 5.68342 5.68342 5.29289 5.29289L0 0L12 6.05683e-07L6.70711 5.29289Z"
          fill="currentColor"
        />
      </svg>
    }
  `,
})
export class MznPopper {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly hostElRef = inject(ElementRef<HTMLElement>);

  protected readonly arrowWidth = ARROW_WIDTH;
  protected readonly arrowHeight = ARROW_HEIGHT;

  private readonly arrowElRef = viewChild<ElementRef<HTMLElement>>('arrowEl');

  private cleanupAutoUpdate: (() => void) | null = null;

  /**
   * 參考（錨定）元素。可傳入 `HTMLElement`、`ElementRef` 或 `null`（未設定時不啟動定位）。
   * @default null
   */
  readonly anchor = input<HTMLElement | ElementRef<HTMLElement> | null>(null);

  /**
   * 箭頭設定。
   */
  readonly arrowOptions = input<PopperArrowOptions>();

  /**
   * 額外的 floating-ui middleware。
   */
  readonly middleware = input<ReadonlyArray<Middleware>>();

  /**
   * 偏移設定。
   */
  readonly offsetOptions = input<PopperOffsetOptions>();

  /**
   * 是否顯示 Popper。
   * @default false
   */
  readonly open = input(false);

  /**
   * 定位方向。
   * @default 'bottom'
   */
  readonly placement = input<PopperPlacement>('bottom');

  /**
   * CSS 定位策略。
   * @default 'absolute'
   */
  readonly strategy = input<PopperPositionStrategy>('absolute');

  /**
   * 位置更新事件。
   */
  readonly positionUpdated = output<Placement>();

  // ─── Internal state ────────────────────────────────────────────

  readonly floatingX = signal(0);
  readonly floatingY = signal(0);
  readonly arrowX = signal<number | undefined>(undefined);
  readonly arrowY = signal<number | undefined>(undefined);
  readonly currentPlacement = signal<Placement>('bottom');
  readonly referenceHidden = signal(false);

  /**
   * 箭頭完整 style 物件（對應 React getArrowStyles 計算結果）。
   * 包含定位、旋轉、尺寸及靜態側邊偏移。
   */
  protected readonly arrowStyle = computed((): Record<string, string> => {
    const side = this.currentPlacement().split('-')[0];
    const deg = SIDE_TO_ROTATION[side] ?? 0;
    const staticSide = SIDE_TO_STATIC[side];
    const arrowX = this.arrowX();
    const arrowY = this.arrowY();

    const style: Record<string, string> = {
      height: `${ARROW_HEIGHT}px`,
      position: 'absolute',
      transform: `rotate(${deg}deg)`,
      transformOrigin: 'center',
      width: `${ARROW_WIDTH}px`,
    };

    if (typeof arrowX === 'number') {
      style['left'] = `${arrowX}px`;
    }

    if (typeof arrowY === 'number') {
      style['top'] = `${arrowY}px`;
    }

    if (staticSide) {
      style[staticSide.property] = staticSide.value;
    }

    return style;
  });

  constructor() {
    // Ensure host bindings update when open/position signals change
    effect(() => {
      this.open();
      this.floatingX();
      this.floatingY();
      this.referenceHidden();
      this.currentPlacement();
      this.cdr.markForCheck();
    });

    effect(() => {
      const isOpen = this.open();
      const anchorRaw = this.anchor();
      const placementVal = this.placement();
      const strategyVal = this.strategy();
      const offsetOpts = this.offsetOptions();
      const arrowOpts = this.arrowOptions();
      const extraMiddleware = this.middleware();

      // Read arrow element ref inside the effect to track it
      const arrowElRef = this.arrowElRef();

      this.cleanup();

      if (!isOpen || anchorRaw === null) {
        return;
      }

      const reference =
        anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;

      const floating = this.hostElRef.nativeElement;

      const middlewares: Middleware[] = [];

      if (offsetOpts) {
        middlewares.push(offset(offsetOpts));
      }

      middlewares.push(flip());

      if (arrowOpts?.enabled && arrowElRef) {
        middlewares.push(
          arrowMiddleware({
            element: arrowElRef.nativeElement,
            padding: arrowOpts.padding,
          }),
        );
      }

      middlewares.push(hide());

      if (extraMiddleware) {
        middlewares.push(...extraMiddleware);
      }

      this.cleanupAutoUpdate = autoUpdate(reference, floating, () => {
        void computePosition(reference, floating, {
          placement: placementVal,
          strategy: strategyVal,
          middleware: middlewares,
        }).then(({ x, y, placement: resolvedPlacement, middlewareData }) => {
          this.floatingX.set(x);
          this.floatingY.set(y);
          this.currentPlacement.set(resolvedPlacement);
          this.referenceHidden.set(
            middlewareData['hide']?.referenceHidden ?? false,
          );
          this.positionUpdated.emit(resolvedPlacement);

          if (middlewareData['arrow']) {
            this.arrowX.set(middlewareData['arrow'].x);
            this.arrowY.set(middlewareData['arrow'].y);
          }
        });
      });
    });

    this.destroyRef.onDestroy(() => {
      this.cleanup();
    });
  }

  private cleanup(): void {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }
  }
}
