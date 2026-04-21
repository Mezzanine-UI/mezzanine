import {
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { MOTION_DURATION } from '@mezzanine-ui/system/motion/duration';
import { MOTION_EASING } from '@mezzanine-ui/system/motion/easing';

/**
 * Rotate transition directive that applies CSS rotation to the host element.
 *
 * Unlike other transition directives, Rotate does not unmount the element.
 * It simply applies a rotation transform based on the `in` state.
 *
 * Common use case: arrow indicators that rotate to indicate expand/collapse state.
 *
 * Applied as an attribute directive so it does not add a wrapper element,
 * achieving DOM parity with React's `cloneElement` approach.
 *
 * @example
 * ```html
 * <i mznIcon mznRotate [in]="isExpanded" [icon]="ChevronUpIcon" ></i>
 * ```
 *
 * @example
 * ```html
 * <span mznRotate [in]="isOpen" [degrees]="90" transformOrigin="left center">
 *   <i mznIcon [icon]="ArrowIcon" ></i>
 * </span>
 * ```
 */
@Directive({
  selector: '[mznRotate]',
  standalone: true,
})
export class MznRotate {
  /**
   * The rotation degrees when `in` is true.
   * @default 180
   */
  readonly degrees = input(180);

  /**
   * The duration of the rotation transition in milliseconds.
   * @default MOTION_DURATION.fast
   */
  readonly duration = input(MOTION_DURATION.fast);

  /**
   * The easing function for the rotation transition.
   * @default MOTION_EASING.standard
   */
  readonly easing = input(MOTION_EASING.standard);

  /**
   * Whether the element should be in the rotated state.
   * @default false
   */
  readonly in = input(false);

  /**
   * The transform origin for the rotation.
   * @default 'center'
   */
  readonly transformOrigin = input('center');

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const inProp = this.in();
      const degrees = this.degrees();
      const duration = this.duration();
      const easing = this.easing();
      const transformOrigin = this.transformOrigin();
      const nativeEl = this.el.nativeElement;

      this.renderer.setStyle(
        nativeEl,
        'transform',
        inProp ? `rotate(${degrees}deg)` : 'rotate(0deg)',
      );
      this.renderer.setStyle(nativeEl, 'transformOrigin', transformOrigin);
      this.renderer.setStyle(
        nativeEl,
        'transition',
        `transform ${duration}ms ${easing}`,
      );
    });
  }
}
