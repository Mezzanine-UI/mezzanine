import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';
import {
  type TransitionDelay,
  type TransitionDuration,
  type TransitionEasing,
} from './transition-types';
import { buildTransitionString, reflow } from './transition-utils';

const defaultDuration: TransitionDuration = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};

const defaultEasing: TransitionEasing = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};

/**
 * Fade transition directive. Animates opacity on the host element.
 *
 * Mirrors React's `<Fade>` which uses `cloneElement` to inject the opacity
 * style onto the child — the animated element is the same element carrying
 * other styles/classes, with no wrapper in between. Any intermediate wrapper
 * would break consumers that rely on positioning or flex parent context
 * (e.g. `<img>` with `position: absolute` inside a relative container).
 *
 * @example
 * ```html
 * <img mznFade [in]="isVisible" class="mzn-modal__media-preview-image" src="..." />
 * ```
 */
@Directive({
  selector: '[mznFade]',
  standalone: true,
  host: {
    '[style.opacity]': 'opacityStyle()',
    '[style.visibility]': 'visibilityStyle()',
    '[attr.appear]': 'null',
    '[attr.delay]': 'null',
    '[attr.duration]': 'null',
    '[attr.easing]': 'null',
    '[attr.in]': 'null',
    '[attr.keepMount]': 'null',
  },
})
export class MznFade {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Whether to perform the enter transition if in is true while it first mounts.
   * @default true
   */
  readonly appear = input(true);

  /**
   * The delay of the transition, in milliseconds.
   * @default 0
   */
  readonly delay = input<TransitionDelay>(0);

  /**
   * The duration of the transition, in milliseconds.
   * @default { enter: MOTION_DURATION.moderate, exit: MOTION_DURATION.moderate }
   */
  readonly duration = input<TransitionDuration>(defaultDuration);

  /**
   * The timing function of the transition.
   * @default { enter: MOTION_EASING.entrance, exit: MOTION_EASING.exit }
   */
  readonly easing = input<TransitionEasing>(defaultEasing);

  /**
   * The flag to trigger toggling transition between enter and exit state.
   *
   * Declared as `model` so host-directive consumers can flip the state
   * programmatically without exposing a public setter.
   *
   * @default false
   */
  readonly in = model(false);

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

  private readonly state = signal<
    'entered' | 'entering' | 'exiting' | 'exited'
  >('exited');
  private isFirstRun = true;

  /** Resolved duration (fallback for 'auto'). */
  private readonly resolvedDuration = computed(() => {
    const d = this.duration();

    return d === 'auto' ? defaultDuration : d;
  });

  protected readonly opacityStyle = computed(() => {
    const s = this.state();

    return s === 'entering' || s === 'entered' ? 1 : 0;
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
    return this.elementRef.nativeElement;
  }

  private setTransition(node: HTMLElement, mode: 'enter' | 'exit'): void {
    node.style.transition = buildTransitionString(mode, ['opacity'], {
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

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.state.set('entering');

        const handler = (): void => {
          node.removeEventListener('transitionend', handler);
          this.state.set('entered');
          this.resetTransition(node);
          this.onEntered.emit({ element: node, isAppearing: false });
        };

        node.addEventListener('transitionend', handler);
      });
    });
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
