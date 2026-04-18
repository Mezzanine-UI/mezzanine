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

/** The position the element will translate from. */
export type TranslateFrom = 'top' | 'bottom' | 'left' | 'right';

const translateTransforms: Record<TranslateFrom, string> = {
  top: 'translate3d(0, -4px, 0)',
  right: 'translate3d(4px, 0, 0)',
  bottom: 'translate3d(0, 4px, 0)',
  left: 'translate3d(-4px, 0, 0)',
};

const defaultDuration: TransitionDuration = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};

const defaultEasing: TransitionEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

/**
 * Translate transition directive. Animates transform + opacity on the
 * host element.
 *
 * Mirrors React's `<Translate>` which uses `cloneElement` to inject the
 * style onto the child — the element receiving the transform is the same
 * element carrying other styles/classes, with no wrapper in between.
 *
 * @example
 * ```html
 * <div mznTranslate [in]="isVisible" from="top" class="mzn-message ...">
 *   ...content...
 * </div>
 * ```
 */
@Directive({
  selector: '[mznTranslate]',
  standalone: true,
  host: {
    '[style.opacity]': 'opacityStyle()',
    '[style.transform]': 'transformStyle()',
    '[style.visibility]': 'visibilityStyle()',
    '[attr.delay]': 'null',
    '[attr.duration]': 'null',
    '[attr.easing]': 'null',
    '[attr.from]': 'null',
    '[attr.in]': 'null',
    '[attr.keepMount]': 'null',
  },
})
export class MznTranslate {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

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
   * @default { enter: MOTION_EASING.standard, exit: MOTION_EASING.standard }
   */
  readonly easing = input<TransitionEasing>(defaultEasing);

  /**
   * The position the element will enter from.
   *
   * Declared as `model` so host-directive consumers (e.g. MznMessage) can pick
   * a default direction ('bottom' for toasts) without requiring every caller
   * to bind it explicitly.
   *
   * @default 'top'
   */
  readonly from = model<TranslateFrom>('top');

  /**
   * The flag to trigger toggling transition between enter and exit state.
   *
   * Declared as `model` so host-directive consumers (e.g. MznMessage) can flip
   * the state programmatically after mount without exposing a public setter.
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

  protected readonly transformStyle = computed(() => {
    const s = this.state();
    const from = this.from();

    if (s === 'entering' || s === 'entered') {
      return 'translate3d(0, 0, 0)';
    }

    return translateTransforms[from];
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

    // Fresh-mount case (e.g. toasts added to a @for loop): the element's first
    // paint happens in the same task as the `in` flip, and the browser can
    // coalesce the exited styles with the entering styles — skipping the
    // transition entirely. A double rAF gives the browser one frame to commit
    // the starting opacity:0 / transform:offset paint before we flip state.
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
