import {
  cloneElement, CSSProperties, forwardRef, useRef,
} from 'react';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Transition, { TransitionImplementationProps, TransitionProps, TransitionState } from './Transition';
import { getAutoSizeDuration } from './getAutoSizeDuration';
import { reflow } from './reflow';
import { useAutoTransitionDuration } from './useAutoTransitionDuration';
import { useSetNodeTransition } from './useSetNodeTransition';

function getScale(value: number) {
  return `scale(${value}, ${value ** 2})`;
}

function getStyle(state: TransitionState): CSSProperties {
  if (state === 'entering') {
    return {
      opacity: 1,
      transform: getScale(1),
    };
  }

  if (state === 'entered') {
    return {
      opacity: 1,
      transform: 'none',
    };
  }

  return {
    opacity: 0,
    transform: getScale(0.75),
  };
}

const defaultEasing = {
  enter: MOTION_EASING.decelerated,
  exit: MOTION_EASING.accelerated,
};

export interface GrowProps extends TransitionImplementationProps {
  /**
   * The transform origin for child element.
   */
  transformOrigin?: string;
}

/**
 * The react component for `mezzanine` transition grow.
 */
const Grow = forwardRef<HTMLElement, GrowProps>(function Grow(props: GrowProps, ref) {
  const {
    appear,
    children,
    delay = 0,
    duration = 'auto',
    easing = defaultEasing,
    in: inProp,
    onEnter,
    onEntered,
    onExit,
    onExited,
    transformOrigin,
    ...rest
  } = props;
  const { autoTransitionDuration, addEndListener } = useAutoTransitionDuration(duration);
  const nodeRef = useRef<HTMLElement>(null);
  const [setNodeTransition, resetNodeTransition] = useSetNodeTransition({
    delay,
    duration,
    easing,
    properties: [
      'opacity',
      ['transform', (transitionProps, mode) => {
        const { delay: delayProp, duration: durationProp } = transitionProps;

        return {
          ...transitionProps,
          delay: mode === 'exit' ? delayProp || durationProp * 0.333 : delayProp,
          duration: durationProp * 0.666,
        };
      }],
    ],
    resolveAutoDuration: () => {
      const autoSizeDuration = getAutoSizeDuration(nodeRef.current?.clientHeight ?? 0);

      autoTransitionDuration.current = autoSizeDuration;

      return autoSizeDuration;
    },
  }, children?.props.style);
  const composedNodeRef = useComposeRefs([ref, nodeRef]);
  const transitionProps: TransitionProps = {
    ...rest,
    addEndListener,
    appear,
    duration,
    in: inProp,
    nodeRef,
    /* eslint-disable no-param-reassign */
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
    /* eslint-enable no-param-reassign */
  };

  return (
    <Transition {...transitionProps}>
      {children && ((state) => cloneElement(children, {
        ...children.props,
        ref: composedNodeRef,
        style: {
          visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
          ...getStyle(state),
          transformOrigin,
          ...children.props.style,
        },
      }))}
    </Transition>
  );
});

export default Grow;
