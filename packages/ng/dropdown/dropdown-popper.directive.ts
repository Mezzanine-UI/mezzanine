import {
  DestroyRef,
  Directive,
  ElementRef,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type Placement } from '@floating-ui/dom';

/**
 * 全域遞增計數器，確保後開啟的 popper z-index 永遠高於先開啟的（包含
 * Select / Autocomplete 等 wrapper 嵌套情境）。沿用 `MznInputTriggerPopper`
 * 的 popperOpenSequence 機制，但獨立維護以免與其他 popper 的 z-index 基底互相干涉。
 * @internal
 */
let dropdownPopperSequence = 0;

/**
 * floating-ui `Placement` → CDK `ConnectedPosition`，含 4px 主軸間距。
 *
 * `offsetX` / `offsetY` 對齊 floating-ui `offset({ mainAxis: 4 })`：主軸（垂直
 * placement 用 Y、水平 placement 用 X）外推 4px。
 */
function placementToConnectedPosition(
  placement: Placement,
  mainAxisOffset: number,
): ConnectedPosition {
  const [side, align = 'center'] = placement.split('-') as [
    'top' | 'bottom' | 'left' | 'right',
    'start' | 'end' | undefined,
  ];

  // 主軸：popper 相對 anchor 的開展方向。
  const base: ConnectedPosition = (() => {
    switch (side) {
      case 'top':
        return {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -mainAxisOffset,
        };
      case 'left':
        return {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -mainAxisOffset,
        };
      case 'right':
        return {
          originX: 'end',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: mainAxisOffset,
        };
      case 'bottom':
      default:
        return {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: mainAxisOffset,
        };
    }
  })();

  // 對齊軸（-start / -end）：垂直 placement 調整 X 對齊，水平 placement 調整 Y 對齊。
  if (side === 'top' || side === 'bottom') {
    if (align === 'end') {
      return { ...base, originX: 'end', overlayX: 'end' };
    }

    if (align === 'center') {
      return { ...base, originX: 'center', overlayX: 'center' };
    }

    return base; // start
  }

  // left / right
  if (align === 'end') {
    return { ...base, originY: 'bottom', overlayY: 'bottom' };
  }

  if (align === 'center') {
    return { ...base, originY: 'center', overlayY: 'center' };
  }

  return base; // start
}

/**
 * floating-ui placement → 主軸對向（供 flip fallback）。
 */
function invertPlacement(placement: Placement): Placement {
  const [side, align] = placement.split('-');
  const opposite: Record<string, string> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  const inverted = opposite[side] ?? side;

  return (align ? `${inverted}-${align}` : inverted) as Placement;
}

/**
 * 把 CDK 解析後的 `ConnectedPosition` 反推回 floating-ui `Placement`，
 * 供 `placementChange` 回報實際（flip 後）方向，讓 `MznDropdown` 的進場
 * 動畫方向跟著翻轉。
 */
function connectedPositionToPlacement(pos: ConnectedPosition): Placement {
  let side: string;

  if (pos.overlayY === 'bottom' && pos.originY === 'top') side = 'top';
  else if (pos.overlayY === 'top' && pos.originY === 'bottom') side = 'bottom';
  else if (pos.overlayX === 'end' && pos.originX === 'start') side = 'left';
  else if (pos.overlayX === 'start' && pos.originX === 'end') side = 'right';
  else side = 'bottom';

  if (side === 'top' || side === 'bottom') {
    if (pos.overlayX === 'end') return `${side}-end` as Placement;
    if (pos.overlayX === 'center') return side as Placement;

    return `${side}-start` as Placement;
  }

  if (pos.overlayY === 'bottom') return `${side}-end` as Placement;
  if (pos.overlayY === 'center') return side as Placement;

  return `${side}-start` as Placement;
}

/**
 * MznDropdown 專屬的浮層容器（內部 directive，不公開匯出）。
 *
 * 套用在 `<ng-template mznDropdownPopper>` 上，開啟時透過 Angular CDK
 * `Overlay` 把模板內容 portal 到 `cdk-overlay-container`（body），閉合時
 * `detach` 讓 consumer 子樹內不再殘留任何 popper 宿主元素，對齊 React
 * `<Popper>` 的 portal 行為（消除原 `MznPopper` + `MznPortal` 留下的
 * `display:none` 殘留 DOM）。
 *
 * 與共用的 `MznInputTriggerPopper` 不同處：本 directive 支援**任意
 * floating-ui placement** 與 `flip` fallback，並透過 `placementChange`
 * 回報實際解析方向，因此只給 Dropdown 使用、不影響 Select / Cascader 路徑。
 *
 * @see MznInputTriggerPopper
 */
@Directive({
  selector: '[mznDropdownPopper]',
  standalone: true,
  exportAs: 'mznDropdownPopper',
})
export class MznDropdownPopper {
  /** 參考（錨定）元素。 */
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();

  /** 自訂下拉選單寬度（px 數字或 CSS 字串）。設定後優先於 sameWidth。 */
  readonly customWidth = input<number | string>();

  /**
   * 是否啟用 flip fallback。`true` 時於主位置空間不足時翻轉到對向 placement，
   * 對齊 React `Dropdown` 的 `flip` prop（floating-ui flip，bestFit）。
   * @default false
   */
  readonly flip = input(false);

  /**
   * 是否啟用全域 Portal。CDK Overlay 一律 portal 到 `cdk-overlay-container`，
   * 故本 input 目前恆為 portal 行為，保留以維持 consumer API 相容。
   * @default true
   */
  readonly globalPortal = input(true);

  /** 是否顯示。 @default false */
  readonly open = input(false);

  /** 定位方向。 @default 'bottom-start' */
  readonly placement = input<Placement>('bottom-start');

  /** 是否讓浮層最小寬度與 anchor 對齊。 @default false */
  readonly sameWidth = input(false);

  /** z-index 覆蓋值；未設定時以內部遞增序號計算。 */
  readonly zIndex = input<number | string>();

  /** floating-ui 實際解析（含 flip 翻轉）後的 placement。 */
  readonly placementChange = output<Placement>();

  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);

  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal<unknown> | null = null;
  private stopListeners: (() => void) | null = null;

  /**
   * 取得 overlay 的 pane 元素（`.cdk-overlay-pane`），供父元件在 click-away 時
   * 將其列入允許白名單，避免點擊 popped-out 內容被誤判為 outside。
   * overlay 尚未開啟時回傳 `null`。
   */
  get popperElRef(): HTMLElement | null {
    return this.overlayRef?.overlayElement ?? null;
  }

  constructor() {
    effect(() => {
      const isOpen = this.open();
      const anchorRaw = this.anchor();
      const anchorEl =
        anchorRaw instanceof ElementRef ? anchorRaw.nativeElement : anchorRaw;

      if (!isOpen || !anchorEl) {
        this.overlayRef?.detach();

        return;
      }

      const overlayRef = this.ensureOverlay(anchorEl);

      const customWidth = this.customWidth();

      if (customWidth !== undefined && customWidth !== null) {
        overlayRef.updateSize({
          width:
            typeof customWidth === 'number' ? `${customWidth}px` : customWidth,
        });
      } else if (this.sameWidth()) {
        overlayRef.updateSize({
          minWidth: anchorEl.getBoundingClientRect().width,
        });
      }

      if (!overlayRef.hasAttached()) {
        this.portal ??= new TemplatePortal(this.tpl, this.vcr);
        overlayRef.attach(this.portal);
        this.attachStopPropagation(overlayRef.overlayElement);
      }

      // z-index：外部顯式 zIndex 優先，否則後開啟者疊在先開啟者之上。
      const explicitZIndex = this.zIndex();

      overlayRef.overlayElement.style.zIndex =
        explicitZIndex !== undefined && explicitZIndex !== null
          ? `${explicitZIndex}`
          : `calc(var(--mzn-z-index-popover) + ${(dropdownPopperSequence += 1)})`;
    });

    this.destroyRef.onDestroy(() => {
      this.stopListeners?.();
      this.overlayRef?.dispose();
      this.overlayRef = null;
      this.portal = null;
    });
  }

  private ensureOverlay(anchorEl: HTMLElement): OverlayRef {
    if (this.overlayRef) {
      return this.overlayRef;
    }

    const primary = placementToConnectedPosition(this.placement(), 4);
    const positions: ConnectedPosition[] = this.flip()
      ? [
          primary,
          placementToConnectedPosition(invertPlacement(this.placement()), 4),
        ]
      : [primary];

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(anchorEl)
      .withPositions(positions)
      .withFlexibleDimensions(false)
      .withPush(false);

    positionStrategy.positionChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((change) => {
        this.placementChange.emit(
          connectedPositionToPlacement(change.connectionPair),
        );
      });

    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
      }),
    );

    return this.overlayRef;
  }

  /**
   * CDK pane 內容在 body，不在 consumer 宿主子樹內，原 host 上的 stopPropagation
   * 對其失效。改在 pane 元素上補綁，維持點擊／觸控不向外冒泡的既有行為。
   */
  private attachStopPropagation(el: HTMLElement): void {
    const stop = (event: Event): void => event.stopPropagation();
    const events: Array<keyof HTMLElementEventMap> = [
      'click',
      'touchstart',
      'touchmove',
      'touchend',
    ];

    events.forEach((event) => el.addEventListener(event, stop));
    this.stopListeners = (): void =>
      events.forEach((event) => el.removeEventListener(event, stop));
  }
}
