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
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';
import {
  type TransitionDelay,
  type TransitionDuration,
  type TransitionEasing,
} from './transition-types';
import {
  buildTransitionString,
  getAutoSizeDuration,
  reflow,
} from './transition-utils';

const defaultEasing: TransitionEasing = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};

/**
 * Collapse transition component that animates height.
 *
 * Wraps content in a measured container and animates between
 * `collapsedHeight` and the measured content height.
 * Mirrors the React `Collapse` component's DOM structure:
 * outer div (overflow/height) > flex wrapper > content wrapper.
 *
 * @example
 * ```html
 * <div mznCollapse [in]="isExpanded">
 *   <div>Collapsible content here</div>
 * </div>
 * ```
 *
 * @example
 * ```html
 * <div mznCollapse [in]="isOpen" collapsedHeight="48px">
 *   <div>Partially visible when collapsed</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznCollapse]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"contents"',
    '[attr.collapsedHeight]': 'null',
    '[attr.delay]': 'null',
    '[attr.duration]': 'null',
    '[attr.easing]': 'null',
    '[attr.in]': 'null',
    '[attr.keepMount]': 'null',
  },
  template: `
    <div
      #collapseRoot
      [style.min-height]="normalizedCollapsedHeight()"
      [style.overflow]="overflowStyle()"
      [style.visibility]="visibilityStyle()"
    >
      <div #wrapper style="display: flex; width: 100%;">
        <div style="width: 100%;">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class MznCollapse {
  /**
   * The height of the container while collapsed.
   * @default 0
   */
  readonly collapsedHeight = input<string | number>(0);

  /**
   * The delay of the transition, in milliseconds.
   * @default 0
   */
  readonly delay = input<TransitionDelay>(0);

  /**
   * The duration of the transition, in milliseconds.
   * @default 'auto'
   */
  readonly duration = input<TransitionDuration>('auto');

  /**
   * The timing function of the transition.
   * @default { enter: MOTION_EASING.entrance, exit: MOTION_EASING.exit }
   */
  readonly easing = input<TransitionEasing>(defaultEasing);

  /**
   * The flag to trigger toggling transition between enter and exit state.
   * @default false
   */
  readonly in = input(false);

  /**
   * Whether to keep mounting the child if exited.
   * When collapsedHeight is not '0px', this is forced to true.
   * @default false
   */
  readonly keepMount = input(false);

  /**
   * Callback fired before the entering state applied.
   */
  readonly onEnter = output<{ element: HTMLElement; isAppearing: boolean }>();

  /**
   * Callback fired after the entered state applied.
   */
  readonly onEntered = output<{ element: HTMLElement; isAppearing: boolean }>();

  /**
   * Callback fired after the entering state applied.
   */
  readonly onEntering = output<{
    element: HTMLElement;
    isAppearing: boolean;
  }>();

  /**
   * Callback fired before the exiting state applied.
   */
  readonly onExit = output<{ element: HTMLElement }>();

  /**
   * Callback fired after the exited state applied.
   */
  readonly onExited = output<{ element: HTMLElement }>();

  /**
   * Callback fired after the exiting state applied.
   */
  readonly onExiting = output<{ element: HTMLElement }>();

  private readonly collapseRoot =
    viewChild.required<ElementRef<HTMLElement>>('collapseRoot');

  private readonly wrapper =
    viewChild.required<ElementRef<HTMLElement>>('wrapper');

  private readonly destroyRef = inject(DestroyRef);

  /** Internal state tracking. */
  private readonly state = signal<
    'entered' | 'entering' | 'exiting' | 'exited'
  >('exited');

  private autoTransitionDuration = 0;
  private endListenerTimer = NaN;
  private isFirstRun = true;

  /** Normalize collapsedHeight to a CSS string. */
  protected readonly normalizedCollapsedHeight = computed(() => {
    const val = this.collapsedHeight();

    return typeof val === 'number' ? `${val}px` : val;
  });

  protected readonly overflowStyle = computed(() => {
    const s = this.state();

    return s === 'entered' ? 'visible' : 'hidden';
  });

  protected readonly visibilityStyle = computed(() => {
    const s = this.state();
    const inProp = this.in();
    const ch = this.normalizedCollapsedHeight();

    return s === 'exited' && !inProp && ch === '0px' ? 'hidden' : undefined;
  });

  constructor() {
    effect(() => {
      const inProp = this.in();

      if (this.isFirstRun) {
        this.isFirstRun = false;

        if (inProp) {
          this.state.set('entered');
        }

        return;
      }

      if (inProp) {
        this.handleEnter();
      } else {
        this.handleExit();
      }
    });

    this.destroyRef.onDestroy(() => {
      window.clearTimeout(this.endListenerTimer);
    });
  }

  private getWrapperHeight(): number {
    return this.wrapper()?.nativeElement.clientHeight ?? 0;
  }

  private getRootElement(): HTMLElement {
    return this.collapseRoot().nativeElement;
  }

  private getResolveAutoDuration(): () => number {
    return () => {
      const duration = getAutoSizeDuration(this.getWrapperHeight());

      this.autoTransitionDuration = duration;

      return duration;
    };
  }

  private setTransition(node: HTMLElement, mode: 'enter' | 'exit'): void {
    const transitionStr = buildTransitionString(mode, ['height'], {
      delay: this.delay(),
      duration: this.duration(),
      easing: this.easing(),
      resolveAutoDuration: this.getResolveAutoDuration(),
    });

    node.style.transition = transitionStr;
  }

  private resetTransition(node: HTMLElement): void {
    node.style.transition = '';
  }

  private scheduleEnd(callback: () => void): void {
    window.clearTimeout(this.endListenerTimer);

    const duration = this.duration();

    if (duration === 'auto') {
      this.endListenerTimer = window.setTimeout(
        callback,
        this.autoTransitionDuration || 0,
      );
    } else {
      const node = this.getRootElement();

      const handler = (): void => {
        node.removeEventListener('transitionend', handler);
        callback();
      };

      node.addEventListener('transitionend', handler);
    }
  }

  private handleEnter(): void {
    const node = this.getRootElement();
    const collapsedHeight = this.normalizedCollapsedHeight();

    // onEnter: set to collapsed height
    node.style.height = collapsedHeight;
    reflow(node);
    this.onEnter.emit({ element: node, isAppearing: false });

    // onEntering: set transition and animate to wrapper height
    this.state.set('entering');
    this.setTransition(node, 'enter');
    node.style.height = `${this.getWrapperHeight()}px`;
    this.onEntering.emit({ element: node, isAppearing: false });

    // Schedule enter done
    this.scheduleEnd(() => {
      this.state.set('entered');
      node.style.height = 'auto';
      this.resetTransition(node);
      this.onEntered.emit({ element: node, isAppearing: false });
    });
  }

  private handleExit(): void {
    const node = this.getRootElement();

    // onExit: set to current wrapper height
    node.style.height = `${this.getWrapperHeight()}px`;
    reflow(node);
    this.onExit.emit({ element: node });

    // onExiting: set transition and animate to collapsed height
    this.state.set('exiting');
    this.setTransition(node, 'exit');

    // Need rAF so the browser registers the start height before animating
    requestAnimationFrame(() => {
      node.style.height = this.normalizedCollapsedHeight();
      this.onExiting.emit({ element: node });
    });

    // Schedule exit done
    this.scheduleEnd(() => {
      this.state.set('exited');
      this.resetTransition(node);
      this.onExited.emit({ element: node });
    });
  }
}
