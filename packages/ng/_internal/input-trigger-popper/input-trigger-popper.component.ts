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
import { inputTriggerPopperClasses as classes } from '@mezzanine-ui/core/_internal/input-trigger-popper';
import type { PopperPlacement } from '@mezzanine-ui/ng/popper';
import {
  type ConnectedOverlayPositionChange,
  Overlay,
  OverlayConfig,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

/**
 * 全域遞增計數器，確保後開啟的 popper z-index 永遠高於先開啟的。
 * @internal
 */
let popperOpenSequence = 0;

/**
 * 下拉觸發器共用的浮層容器（內部 directive，不公開匯出）。
 *
 * 套用在 `<ng-template mznInputTriggerPopper>` 上，開啟時透過 Angular CDK
 * `Overlay` 把模板內容 portal 到 `cdk-overlay-container`（body），固定使用
 * `bottom-start` 定位、4px 間距，並可選擇讓浮層最小寬度與 anchor 對齊。
 *
 * 改用 CDK Overlay（取代先前的 `MznPopper` + `MznPortal`）後，consumer 的 DOM
 * 子樹內不再殘留任何 popper 宿主元素，對齊 React `Popper` 的 portal 行為。
 *
 * Select / Cascader 等元件共用此 directive。
 *
 * @example
 * ```html
 * <ng-template
 *   mznInputTriggerPopper
 *   #popper="mznInputTriggerPopper"
 *   [anchor]="triggerEl"
 *   [open]="isOpen"
 *   [sameWidth]="true"
 * >
 *   <div>dropdown options</div>
 * </ng-template>
 * ```
 */
@Directive({
  selector: '[mznInputTriggerPopper]',
  standalone: true,
  exportAs: 'mznInputTriggerPopper',
})
export class MznInputTriggerPopper {
  /**
   * 參考（錨定）元素。
   */
  readonly anchor = input.required<HTMLElement | ElementRef<HTMLElement>>();

  /**
   * 是否啟用全域 Portal。CDK Overlay 一律把內容 portal 到 `cdk-overlay-container`
   * （body），因此本 input 目前恆為 portal 行為，保留以維持 consumer API 相容。
   * @default true
   */
  readonly globalPortal = input(true);

  /**
   * 是否啟用 floating-ui `flip` middleware。設為 `true` 時,當浮層於下方空間
   * 不足會沿主軸自動翻轉到對側。預設關閉,維持固定 `bottom-start` 定位。
   * @default false
   */
  readonly flip = input(false);

  /**
   * 是否顯示。
   * @default false
   */
  readonly open = input(false);

  /**
   * 是否讓浮層最小寬度與 anchor 對齊。
   * @default false
   */
  readonly sameWidth = input(false);

  private readonly tpl = inject(TemplateRef<unknown>);
  private readonly vcr = inject(ViewContainerRef);
  private readonly overlay = inject(Overlay);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * 轉發 CDK Overlay 解析(含 flip 翻轉)後的實際 placement,供父元件
   * (如 Select)調整進場動畫方向。
   */
  readonly placementChange = output<PopperPlacement>();

  private overlayRef: OverlayRef | null = null;
  private portal: TemplatePortal<unknown> | null = null;
  private stopListeners: (() => void) | null = null;
  private stopPositionUpdates: (() => void) | null = null;

  /**
   * 取得 overlay 的 pane 元素（`.cdk-overlay-pane`），供父元件在 click-away 時
   * 將其列入允許的 container 白名單，避免點擊 popped-out 內容被誤判為 outside。
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

      if (this.sameWidth()) {
        overlayRef.updateSize({
          minWidth: anchorEl.getBoundingClientRect().width,
        });
      }

      if (!overlayRef.hasAttached()) {
        this.portal ??= new TemplatePortal(this.tpl, this.vcr);
        overlayRef.attach(this.portal);
        this.attachStopPropagation(overlayRef.overlayElement);
      }

      // 後開啟者疊在先開啟者之上，沿用既有全域計數器語意。
      overlayRef.overlayElement.style.zIndex = `calc(var(--mzn-z-index-popover) + ${(popperOpenSequence += 1)})`;
    });

    this.destroyRef.onDestroy(() => {
      this.stopListeners?.();
      this.stopPositionUpdates?.();
      this.overlayRef?.dispose();
      this.overlayRef = null;
      this.portal = null;
    });
  }

  private ensureOverlay(anchorEl: HTMLElement): OverlayRef {
    if (this.overlayRef) {
      return this.overlayRef;
    }

    // 預設僅 `bottom-start`。啟用 flip 時補上 `top-start` fallback，讓 CDK 在
    // 下方空間不足時沿主軸翻轉，對齊 React Popper flip middleware 的行為。
    const belowPosition = {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 4,
    } as const;
    const abovePosition = {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -4,
    } as const;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(anchorEl)
      .withPositions(
        this.flip() ? [belowPosition, abovePosition] : [belowPosition],
      )
      .withFlexibleDimensions(false)
      .withPush(false);

    // 轉發 CDK 解析後的實際 placement（上／下），供父元件決定進場動畫方向。
    const subscription = positionStrategy.positionChanges.subscribe(
      (change: ConnectedOverlayPositionChange) => {
        this.placementChange.emit(
          change.connectionPair.originY === 'top'
            ? 'top-start'
            : 'bottom-start',
        );
      },
    );
    this.stopPositionUpdates = (): void => subscription.unsubscribe();

    this.overlayRef = this.overlay.create(
      new OverlayConfig({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        panelClass: classes.host,
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
