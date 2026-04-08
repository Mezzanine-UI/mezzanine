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

const defaultDuration: TransitionDuration = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};

const defaultEasing: TransitionEasing = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};

/**
 * Scale transition component that animates scale and opacity.
 *
 * Wraps projected content and controls transform + opacity
 * based on the `in` state. Scales from 0.95 to 1.0 on enter,
 * and from 1.0 to 0.95 on exit, matching the React Scale component.
 *
 * @example
 * ```html
 * <div mznScale [in]="isVisible">
 *   <div>Scalable content</div>
 * </div>
 * ```
 */
@Component({
  selector: '[mznScale]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"contents"',
    '[attr.appear]': 'null',
    '[attr.delay]': 'null',
    '[attr.duration]': 'null',
    '[attr.easing]': 'null',
    '[attr.in]': 'null',
    '[attr.keepMount]': 'null',
    '[attr.transformOrigin]': 'null',
  },
  template: `
    <div
      #scaleRoot
      [style.opacity]="opacityStyle()"
      [style.transform]="transformStyle()"
      [style.transform-origin]="transformOrigin()"
      [style.visibility]="visibilityStyle()"
    >
      <ng-content />
    </div>
  `,
})
export class MznScale {
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

  /**
   * The transform origin for the scaled element.
   * @default 'center'
   */
  readonly transformOrigin = input('center');

  private readonly scaleRoot =
    viewChild.required<ElementRef<HTMLElement>>('scaleRoot');

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

  protected readonly transformStyle = computed(() => {
    const s = this.state();

    if (s === 'entering') {
      return 'scale(1)';
    }

    if (s === 'entered') {
      return 'none';
    }

    return 'scale(0.95)';
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
    return this.scaleRoot().nativeElement;
  }

  private setTransition(node: HTMLElement, mode: 'enter' | 'exit'): void {
    node.style.transition = buildTransitionString(
      mode,
      ['opacity', 'transform'],
      {
        delay: this.delay(),
        duration: this.resolvedDuration(),
        easing: this.easing(),
      },
    );
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
