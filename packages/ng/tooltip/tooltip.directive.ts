import {
  Directive,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  Renderer2,
} from '@angular/core';
import { tooltipClasses as classes } from '@mezzanine-ui/core/tooltip';
import {
  computePosition,
  autoUpdate,
  flip,
  shift,
  offset,
  arrow as arrowMiddleware,
  type Placement,
} from '@floating-ui/dom';

const SVG_NS = 'http://www.w3.org/2000/svg';
const ARROW_WIDTH = 12;
const ARROW_HEIGHT = 6;

const SIDE_TO_ROTATION: Record<string, number> = {
  top: 180,
  right: -90,
  bottom: 0,
  left: 90,
};

/**
 * 提示工具 directive，滑鼠 hover 時顯示浮動提示文字。
 *
 * 使用 `@floating-ui/dom` 進行定位，支援自動翻轉與偏移。
 * 預設渲染箭頭指示器。預設透過 portal（`document.body`）掛載，
 * 可透過 `tooltipDisablePortal` 改為在原位渲染。
 *
 * @example
 * ```html
 * import { MznTooltip } from '@mezzanine-ui/ng/tooltip';
 *
 * <button [mznTooltip]="'提示文字'" tooltipPlacement="top">Hover me</button>
 * ```
 */
@Directive({
  selector: '[mznTooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class MznTooltip implements OnInit {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);

  private tooltipEl: HTMLDivElement | null = null;
  private arrowEl: HTMLDivElement | null = null;
  private cleanupAutoUpdate: (() => void) | null = null;
  private leaveTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * 是否顯示箭頭。
   * @default true
   */
  readonly tooltipArrow = input(true);

  /**
   * 是否禁用 Portal。若為 `true`，tooltip 將渲染在原位（不掛載至 `document.body`）。
   * 若為 `false`，tooltip 透過 portal 掛載至 `document.body`。
   * @default false
   */
  readonly tooltipDisablePortal = input(false);

  /**
   * 滑鼠離開後的延遲關閉時間（毫秒）。
   * @default 100
   */
  readonly tooltipMouseLeaveDelay = input(100);

  /**
   * 提示文字內容。空字串或 undefined 時不顯示。
   */
  readonly mznTooltip = input<string>();

  /**
   * 主軸偏移距離（px）。
   * @default 4
   */
  readonly tooltipOffset = input(4);

  /**
   * 強制開啟（受控模式）。
   */
  readonly tooltipOpen = input<boolean>();

  /**
   * 定位方向。
   * @default 'top'
   */
  readonly tooltipPlacement = input<Placement>('top');

  private readonly isHovered = signal(false);

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      this.hideTooltip();
      this.removeTooltipElement();
    });
  }

  protected onMouseEnter(): void {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }

    this.isHovered.set(true);
    this.showTooltip();
  }

  protected onMouseLeave(): void {
    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
    }

    this.leaveTimer = setTimeout(() => {
      this.isHovered.set(false);
      this.hideTooltip();
    }, this.tooltipMouseLeaveDelay());
  }

  private showTooltip(): void {
    const title = this.mznTooltip();

    if (!title) {
      return;
    }

    if (!this.tooltipEl) {
      this.createTooltipElement();
    }

    this.tooltipEl!.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = title;
      }
    });

    // If there's no text node yet, insert one before the arrow
    if (
      !Array.from(this.tooltipEl!.childNodes).some(
        (n) => n.nodeType === Node.TEXT_NODE,
      )
    ) {
      this.tooltipEl!.insertBefore(
        document.createTextNode(title),
        this.tooltipEl!.firstChild,
      );
    }

    this.tooltipEl!.style.display = '';
    this.startPositioning();
  }

  private hideTooltip(): void {
    if (this.tooltipOpen() !== undefined && this.tooltipOpen()) {
      return;
    }

    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
      this.cleanupAutoUpdate = null;
    }

    if (this.tooltipEl) {
      this.tooltipEl.style.display = 'none';
    }
  }

  private createTooltipElement(): void {
    this.tooltipEl = this.renderer.createElement('div') as HTMLDivElement;
    this.tooltipEl.className = classes.host;
    this.tooltipEl.style.position = this.tooltipDisablePortal()
      ? 'absolute'
      : 'fixed';
    this.tooltipEl.style.top = '0';
    this.tooltipEl.style.left = '0';
    this.tooltipEl.style.display = 'none';

    this.tooltipEl.addEventListener('mouseenter', () => {
      if (this.leaveTimer) {
        clearTimeout(this.leaveTimer);
        this.leaveTimer = null;
      }
    });

    this.tooltipEl.addEventListener('mouseleave', () => {
      this.onMouseLeave();
    });

    if (this.tooltipArrow()) {
      this.arrowEl = this.renderer.createElement('div') as HTMLDivElement;
      this.arrowEl.className = classes.arrow;
      this.arrowEl.style.position = 'absolute';

      const svg = document.createElementNS(SVG_NS, 'svg');

      svg.setAttribute('width', String(ARROW_WIDTH));
      svg.setAttribute('height', String(ARROW_HEIGHT));
      svg.setAttribute('viewBox', `0 0 ${ARROW_WIDTH} ${ARROW_HEIGHT}`);

      const path = document.createElementNS(SVG_NS, 'path');

      path.setAttribute('d', 'M0 0L6 6L12 0');
      path.setAttribute('fill', 'currentColor');
      svg.appendChild(path);
      this.arrowEl.appendChild(svg);
      this.tooltipEl.appendChild(this.arrowEl);
    }

    if (this.tooltipDisablePortal()) {
      this.elRef.nativeElement.appendChild(this.tooltipEl);
    } else {
      document.body.appendChild(this.tooltipEl);
    }
  }

  private removeTooltipElement(): void {
    if (this.tooltipEl?.parentNode) {
      this.tooltipEl.parentNode.removeChild(this.tooltipEl);
      this.tooltipEl = null;
      this.arrowEl = null;
    }
  }

  private startPositioning(): void {
    if (this.cleanupAutoUpdate) {
      this.cleanupAutoUpdate();
    }

    const reference = this.elRef.nativeElement;
    const floating = this.tooltipEl!;
    const arrowElement = this.arrowEl;
    const placementVal = this.tooltipPlacement();
    const offsetVal = this.tooltipOffset();

    const middlewares = [offset(offsetVal), flip(), shift()];

    if (arrowElement) {
      middlewares.push(arrowMiddleware({ element: arrowElement }));
    }

    this.cleanupAutoUpdate = autoUpdate(reference, floating, () => {
      void computePosition(reference, floating, {
        placement: placementVal,
        middleware: middlewares,
      }).then(({ x, y, placement, middlewareData }) => {
        Object.assign(floating.style, {
          left: `${x}px`,
          top: `${y}px`,
        });

        if (arrowElement && middlewareData['arrow']) {
          const { x: arrowX, y: arrowY } = middlewareData['arrow'];
          const side = placement.split('-')[0];
          const rotation = SIDE_TO_ROTATION[side] ?? 0;

          Object.assign(arrowElement.style, {
            left: arrowX != null ? `${arrowX}px` : '',
            top: arrowY != null ? `${arrowY}px` : '',
            transform: `rotate(${rotation}deg)`,
          });
        }
      });
    });
  }
}
