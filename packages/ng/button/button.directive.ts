import {
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  buttonClasses as classes,
  ButtonIconType,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
import { iconClasses as spinClasses } from '@mezzanine-ui/core/spin';
import { tooltipClasses } from '@mezzanine-ui/core/tooltip';
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
  arrow as arrowMiddleware,
  type Placement,
} from '@floating-ui/dom';
import clsx from 'clsx';
import { MZN_BUTTON_GROUP } from './button-group.token';

const TOOLTIP_SVG_NS = 'http://www.w3.org/2000/svg';
const TOOLTIP_ARROW_WIDTH = 12;
const TOOLTIP_ARROW_HEIGHT = 6;
const TOOLTIP_OFFSET = 4;
const TOOLTIP_MOUSE_LEAVE_DELAY = 100;

const SIDE_TO_ROTATION: Record<string, number> = {
  top: 180,
  right: -90,
  bottom: 0,
  left: 90,
};

/**
 * 通用按鈕 directive，支援多種外觀變體與尺寸。
 *
 * 使用 attribute selector `[mznButton]`，可套用於 `<button>`、`<a>` 或任意 host element，
 * 實現與 React 版 `component` prop 等效的多型態功能。
 *
 * 透過 `variant` 控制外觀、`size` 控制尺寸、`iconType` 決定圖示排列方式。
 * 若放在 `<div mznButtonGroup>` 內部，會自動繼承 group 的 variant / size / disabled（除非自行指定）。
 *
 * 當 `iconType` 為 `'icon-only'` 且提供 `tooltipText` 時，hover 時會自動顯示 tooltip，
 * 與 React 版 Button 的 `children` + `<Tooltip>` 包裹行為等效。
 *
 * @example
 * ```html
 * import { MznButton } from '@mezzanine-ui/ng/button';
 * import { MznIcon } from '@mezzanine-ui/ng/icon';
 *
 * <!-- 基本用法 -->
 * <button mznButton variant="base-primary">送出</button>
 *
 * <!-- 帶有前置圖示 -->
 * <button mznButton variant="base-primary" iconType="leading">
 *   <i mznIcon [icon]="PlusIcon" [size]="16" ></i>新增
 * </button>
 *
 * <!-- 僅圖示（hover 顯示 tooltip） -->
 * <button mznButton variant="base-primary" iconType="icon-only" tooltipText="新增">
 *   <i mznIcon [icon]="PlusIcon" [size]="16" ></i>
 * </button>
 *
 * <!-- 以 <a> 渲染 -->
 * <a mznButton variant="base-secondary" href="/dashboard">前往儀表板</a>
 * ```
 */
@Directive({
  selector: '[mznButton]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-disabled]': 'resolvedDisabled()',
    '[attr.disabled]': "resolvedDisabled() ? '' : null",
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class MznButton {
  private readonly group = inject(MZN_BUTTON_GROUP, { optional: true });
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly renderer = inject(Renderer2);

  private tooltipEl: HTMLDivElement | null = null;
  private arrowEl: HTMLDivElement | null = null;
  private cleanupAutoUpdate: (() => void) | null = null;
  private leaveTimer: ReturnType<typeof setTimeout> | null = null;

  /** Spin element rendered when loading=true */
  private spinWrapperEl: HTMLDivElement | null = null;
  /** Original children detached into a fragment during loading */
  private detachedChildren: DocumentFragment | null = null;

  constructor() {
    // Capture-phase click interception for disabled/loading
    const handler = (event: Event): void => {
      if (this.resolvedDisabled() || this.loading()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    this.elRef.nativeElement.addEventListener('click', handler, true);
    this.destroyRef.onDestroy(() => {
      this.elRef.nativeElement.removeEventListener('click', handler, true);
      this.hideTooltipEl();
      this.removeTooltipElement();
      this.removeSpinElement();
    });

    // React to loading state changes — show/hide spin
    effect(() => {
      if (this.loading()) {
        this.showSpinElement();
      } else {
        this.removeSpinElement();
      }
    });
  }

  /** 按鈕的視覺樣式變體。 @default 'base-primary' */
  readonly variant = input<ButtonVariant>();

  /** 按鈕尺寸。 @default 'main' */
  readonly size = input<ButtonSize>();

  /** 是否禁用按鈕。 @default false */
  readonly disabled = input<boolean>();

  /** 是否顯示載入狀態。 @default false */
  readonly loading = input(false);

  /** 圖示定義（來自 `@mezzanine-ui/icons`）。用於 CSS class 計算。 */
  readonly icon = input<IconDefinition>();

  /**
   * 圖示排列方式。
   * - `'leading'` — 圖示在文字左側
   * - `'trailing'` — 圖示在文字右側
   * - `'icon-only'` — 僅顯示圖示
   */
  readonly iconType = input<ButtonIconType>();

  /**
   * icon-only 模式的 tooltip 文字。
   * 僅在 `iconType` 為 `'icon-only'` 且 `disabledTooltip` 為 `false` 時生效。
   * 等效於 React 版 Button 的 `children`（在 icon-only 模式下作為 tooltip 內容）。
   */
  readonly tooltipText = input<string>();

  /**
   * 是否禁用 icon-only 模式的自動 tooltip。
   * @default false
   */
  readonly disabledTooltip = input(false);

  /**
   * tooltip 顯示位置。
   * @default 'bottom'
   */
  readonly tooltipPosition = input<Placement>('bottom');

  /** 解析後的 variant（優先使用自身，否則沿用 group）。 */
  protected readonly resolvedVariant = computed(
    (): ButtonVariant =>
      this.variant() ?? this.group?.variant ?? 'base-primary',
  );

  /** 解析後的 size（優先使用自身，否則沿用 group）。 */
  protected readonly resolvedSize = computed(
    (): ButtonSize => this.size() ?? this.group?.size ?? 'main',
  );

  /** 解析後的 disabled（優先使用自身，否則沿用 group）。 */
  readonly resolvedDisabled = computed(
    (): boolean => this.disabled() ?? this.group?.disabled ?? false,
  );

  /** 是否應顯示 tooltip。 */
  private readonly shouldShowTooltip = computed(
    (): boolean =>
      this.iconType() === 'icon-only' &&
      !this.disabledTooltip() &&
      !!this.tooltipText(),
  );

  protected readonly hostClasses = computed((): string =>
    clsx(
      classes.host,
      classes.variant(this.resolvedVariant()),
      classes.size(this.resolvedSize()),
      {
        [classes.disabled]: this.resolvedDisabled(),
        [classes.loading]: this.loading(),
        [classes.iconLeading]: this.iconType() === 'leading',
        [classes.iconTrailing]: this.iconType() === 'trailing',
        [classes.iconOnly]: this.iconType() === 'icon-only',
      },
    ),
  );

  private showSpinElement(): void {
    const el = this.elRef.nativeElement;

    if (this.spinWrapperEl) return;

    // Detach existing children into a fragment so we can restore them later.
    // This matches React's behaviour of swapping children entirely during
    // loading (no leftover hidden wrappers in the DOM tree).
    const fragment = document.createDocumentFragment();

    while (el.firstChild) {
      fragment.appendChild(el.firstChild);
    }

    this.detachedChildren = fragment;

    // Create spin element using spinClasses (host + size + ring + tail) from @mezzanine-ui/core/spin.
    // React's <Spin loading size="minor" /> standalone path renders a <div>,
    // so we mirror that tag exactly.
    const wrapper = this.renderer.createElement('div') as HTMLDivElement;

    wrapper.className = `${spinClasses.spin} ${spinClasses.size('minor')}`;

    const ring = this.renderer.createElement('span') as HTMLSpanElement;

    ring.className = spinClasses.spinnerRing;

    const tail = this.renderer.createElement('span') as HTMLSpanElement;

    tail.className = spinClasses.spinnerTail;

    ring.appendChild(tail);
    wrapper.appendChild(ring);
    el.appendChild(wrapper);
    this.spinWrapperEl = wrapper;
  }

  private removeSpinElement(): void {
    if (this.spinWrapperEl) {
      this.spinWrapperEl.parentNode?.removeChild(this.spinWrapperEl);
      this.spinWrapperEl = null;
    }

    if (this.detachedChildren) {
      this.elRef.nativeElement.appendChild(this.detachedChildren);
      this.detachedChildren = null;
    }
  }

  protected onMouseEnter(): void {
    if (!this.shouldShowTooltip()) return;

    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }

    this.showTooltipEl();
  }

  protected onMouseLeave(): void {
    if (!this.shouldShowTooltip()) return;

    if (this.leaveTimer) {
      clearTimeout(this.leaveTimer);
    }

    this.leaveTimer = setTimeout(() => {
      this.hideTooltipEl();
    }, TOOLTIP_MOUSE_LEAVE_DELAY);
  }

  private showTooltipEl(): void {
    const title = this.tooltipText();

    if (!title) return;

    if (!this.tooltipEl) {
      this.createTooltipElement();
    }

    // Update text content
    this.tooltipEl!.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = title;
      }
    });

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

  private hideTooltipEl(): void {
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
    this.tooltipEl.className = tooltipClasses.host;
    this.tooltipEl.style.position = 'absolute';
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

    // Arrow element
    this.arrowEl = this.renderer.createElement('div') as HTMLDivElement;
    this.arrowEl.className = tooltipClasses.arrow;
    this.arrowEl.style.position = 'absolute';

    const svg = document.createElementNS(TOOLTIP_SVG_NS, 'svg');

    svg.setAttribute('width', String(TOOLTIP_ARROW_WIDTH));
    svg.setAttribute('height', String(TOOLTIP_ARROW_HEIGHT));
    svg.setAttribute(
      'viewBox',
      `0 0 ${TOOLTIP_ARROW_WIDTH} ${TOOLTIP_ARROW_HEIGHT}`,
    );

    const path = document.createElementNS(TOOLTIP_SVG_NS, 'path');

    path.setAttribute('d', 'M0 0L6 6L12 0');
    path.setAttribute('fill', 'currentColor');
    svg.appendChild(path);
    this.arrowEl.appendChild(svg);
    this.tooltipEl.appendChild(this.arrowEl);

    document.body.appendChild(this.tooltipEl);
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
    const placementVal = this.tooltipPosition();

    const middlewares = [offset(TOOLTIP_OFFSET), flip(), shift()];

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
