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
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';
import {
  type TransitionDelay,
  type TransitionDuration,
  type TransitionEasing,
} from './transition-types';
import { buildTransitionString, reflow } from './transition-utils';

/** The position the element will slide from. */
export type SlideFrom = 'right' | 'top';

const slideTransforms: Record<SlideFrom, string> = {
  top: 'translate3d(0, -100%, 0)',
  right: 'translate3d(100%, 0, 0)',
};

const defaultDuration: TransitionDuration = {
  enter: MOTION_DURATION.slow,
  exit: MOTION_DURATION.slow,
};

const defaultEasing: TransitionEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

/**
 * Slide transition component that animates transform (translate3d).
 *
 * Slides content in from a direction (right or top) on enter,
 * and slides back out on exit. Mirrors the React `Slide` component.
 *
 * @example
 * ```html
 * <mzn-slide [in]="isVisible" from="right">
 *   <div>Sliding panel content</div>
 * </mzn-slide>
 * ```
 */
@Component({
  selector: 'mzn-slide',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"contents"',
  },
  template: `
    <div
      #slideRoot
      [style.transform]="transformStyle()"
      [style.visibility]="visibilityStyle()"
    >
      <ng-content />
    </div>
  `,
})
export class MznSlide {
  /**
   * The delay of the transition, in milliseconds.
   * @default 0
   */
  readonly delay = input<TransitionDelay>(0);

  /**
   * The duration of the transition, in milliseconds.
   * @default { enter: MOTION_DURATION.slow, exit: MOTION_DURATION.slow }
   */
  readonly duration = input<TransitionDuration>(defaultDuration);

  /**
   * The timing function of the transition.
   * @default { enter: MOTION_EASING.standard, exit: MOTION_EASING.standard }
   */
  readonly easing = input<TransitionEasing>(defaultEasing);

  /**
   * The position of the element will enter from.
   * @default 'right'
   */
  readonly from = input<SlideFrom>('right');

  /**
   * The flag to trigger toggling transition between enter and exit state.
   * @default false
   */
  readonly in = input(false);

  /**
   * Whether to keep mounting the child if exited.
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
   * Callback fired before the exiting state applied.
   */
  readonly onExit = output<{ element: HTMLElement }>();

  /**
   * Callback fired after the exited state applied.
   */
  readonly onExited = output<{ element: HTMLElement }>();

  private readonly slideRoot =
    viewChild.required<ElementRef<HTMLElement>>('slideRoot');

  private readonly state = signal<
    'entered' | 'entering' | 'exiting' | 'exited'
  >('exited');
  private isFirstRun = true;

  /** Resolved duration (fallback for 'auto'). */
  private readonly resolvedDuration = computed(() => {
    const d = this.duration();

    return d === 'auto' ? defaultDuration : d;
  });

  protected readonly transformStyle = computed(() => {
    const s = this.state();
    const from = this.from();

    if (s === 'entering' || s === 'entered') {
      return 'translate3d(0, 0, 0)';
    }

    return slideTransforms[from];
  });

  protected readonly visibilityStyle = computed(() => {
    const s = this.state();
    const inProp = this.in();

    return s === 'exited' && !inProp ? 'hidden' : undefined;
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
  }

  private getRootElement(): HTMLElement {
    return this.slideRoot().nativeElement;
  }

  private setTransition(node: HTMLElement, mode: 'enter' | 'exit'): void {
    node.style.transition = buildTransitionString(mode, ['transform'], {
      delay: this.delay(),
      duration: this.resolvedDuration(),
      easing: this.easing(),
    });
  }

  private resetTransition(node: HTMLElement): void {
    node.style.transition = '';
  }

  private handleEnter(): void {
    const node = this.getRootElement();

    this.setTransition(node, 'enter');
    reflow(node);
    this.onEnter.emit({ element: node, isAppearing: false });

    this.state.set('entering');

    const handler = (): void => {
      node.removeEventListener('transitionend', handler);
      this.state.set('entered');
      this.resetTransition(node);
      this.onEntered.emit({ element: node, isAppearing: false });
    };

    node.addEventListener('transitionend', handler);
  }

  private handleExit(): void {
    const node = this.getRootElement();

    this.setTransition(node, 'exit');
    this.onExit.emit({ element: node });

    this.state.set('exiting');

    const handler = (): void => {
      node.removeEventListener('transitionend', handler);
      this.state.set('exited');
      this.resetTransition(node);
      this.onExited.emit({ element: node });
    };

    node.addEventListener('transitionend', handler);
  }
}
