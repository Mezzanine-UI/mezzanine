import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { cloneElement, CSSProperties, forwardRef, useRef } from 'react';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Transition, {
  TransitionState,
  TransitionImplementationProps,
  TransitionProps,
} from './Transition';
import { reflow } from './reflow';
import { useSetNodeTransition } from './useSetNodeTransition';

function getStyle(state: TransitionState, inProp: boolean): CSSProperties {
  const style: CSSProperties = {
    transform: 'scale(0)',
  };

  if (state === 'entering' || state === 'entered') {
    style.transform = 'none';
  } else if (state === 'exited' && !inProp) {
    style.visibility = 'hidden';
  }

  return style;
}

const defaultDuration = {
  enter: MOTION_DURATION.short,
  exit: MOTION_DURATION.shorter,
};

const defaultEasing = {
  enter: MOTION_EASING.decelerated,
  exit: MOTION_EASING.accelerated,
};

export type ZoomProps = TransitionImplementationProps;

/**
 * The react component for `mezzanine` transition zoom.
 */
const Zoom = forwardRef<HTMLElement, ZoomProps>(function Zoom(
  props: ZoomProps,
  ref,
) {
  const {
    children,
    delay = 0,
    duration: durationProp = defaultDuration,
    easing = defaultEasing,
    in: inProp = false,
    onEnter,
    onEntered,
    onExit,
    onExited,
    ...rest
  } = props;
  const duration = durationProp === 'auto' ? defaultDuration : durationProp;
  const nodeRef = useRef<HTMLElement>(null);
  const composedNodeRef = useComposeRefs([ref, nodeRef]);
  const [setNodeTransition, resetNodeTransition] = useSetNodeTransition(
    {
      delay,
      duration,
      easing,
      properties: ['transform'],
    },
    children?.props.style,
  );
  const transitionProps: TransitionProps = {
    ...rest,
    duration,
    in: inProp,
    nodeRef,
    onEnter(node, isAppearing) {
      setNodeTransition(node, 'enter');
      reflow(node);

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    },
    onEntered(node, isAppearing) {
      resetNodeTransition(node);

      if (onEntered) {
        onEntered(node, isAppearing);
      }
    },
    onExit(node) {
      setNodeTransition(node, 'exit');

      if (onExit) {
        onExit(node);
      }
    },
    onExited(node) {
      resetNodeTransition(node);

      if (onExited) {
        onExited(node);
      }
    },
  };

  return (
    <Transition {...transitionProps}>
      {children &&
        ((state) =>
          cloneElement(children, {
            ...children.props,
            ref: composedNodeRef,
            style: {
              ...getStyle(state, inProp),
              ...children.props.style,
            },
          }))}
    </Transition>
  );
});

export default Zoom;
