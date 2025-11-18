import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { cloneElement, CSSProperties, forwardRef, ReactElement } from 'react';
import { useComposeRefs } from '../hooks/useComposeRefs';

export interface RotateProps {
  /**
   * The child element to rotate.
   */
  children: ReactElement;
  /**
   * The rotation degrees when `open` is true.
   * Common use case: arrow indicators in Select, Accordion, etc.
   * @default 180
   */
  degrees?: number;
  /**
   * The duration of the rotation transition in milliseconds.
   * @default MOTION_DURATION.fast (150ms)
   */
  duration?: number;
  /**
   * The easing function for the rotation transition.
   * @default MOTION_EASING.standard
   */
  easing?: string;
  /**
   * Whether the element should be in the rotated state.
   * @default false
   */
  in?: boolean;
  /**
   * The transform origin for child element.
   * @default 'center'
   */
  transformOrigin?: string;
}

/**
 * The react component for `mezzanine` transition rotate.
 * Unlike other transition components, Rotate does not unmount the element.
 * It simply rotates the element based on the `in` state.
 *
 * Common use case: arrow indicators that rotate to indicate expand/collapse state.
 */
const Rotate = forwardRef<HTMLElement, RotateProps>(function Rotate(
  props: RotateProps,
  ref,
) {
  const {
    children,
    degrees = 180,
    duration = MOTION_DURATION.fast,
    easing = MOTION_EASING.standard,
    in: inProp = false,
    transformOrigin = 'center',
  } = props;

  const childRef = (children as any).ref;
  const composedRef = useComposeRefs([ref, childRef]);
  const childProps = children.props as Record<string, any>;

  const style: CSSProperties = {
    transform: inProp ? `rotate(${degrees}deg)` : 'rotate(0deg)',
    transformOrigin,
    transition: `transform ${duration}ms ${easing}`,
    ...(childProps.style as CSSProperties),
  };

  return cloneElement(children, {
    ...childProps,
    ref: composedRef,
    style,
  } as any);
});

export default Rotate;
