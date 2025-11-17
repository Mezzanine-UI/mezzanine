import { cloneElement, CSSProperties, forwardRef, useRef } from 'react';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Transition, {
  TransitionImplementationProps,
  TransitionProps,
  TransitionState,
} from './Transition';
import { getAutoSizeDuration } from './getAutoSizeDuration';
import { reflow } from './reflow';
import { useAutoTransitionDuration } from './useAutoTransitionDuration';
import { useSetNodeTransition } from './useSetNodeTransition';

function getScale(value: number) {
  return `scale(${value})`;
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
    transform: getScale(0.95),
  };
}

const defaultDuration = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};

const defaultEasing = {
  enter: MOTION_EASING.entrance,
  exit: MOTION_EASING.exit,
};

export interface ScaleProps extends TransitionImplementationProps {
  /**
   * The transform origin for child element.
   */
  transformOrigin?: string;
}

/**
 * The react component for `mezzanine` transition scale.
 */
const Scale = forwardRef<HTMLElement, ScaleProps>(function Scale(
  props: ScaleProps,
  ref,
) {
  const {
    appear,
    children,
    delay = 0,
    duration: durationProp = defaultDuration,
    easing = defaultEasing,
    in: inProp,
    onEnter,
    onEntered,
    onExit,
    onExited,
    transformOrigin,
    ...rest
  } = props;
  const duration = durationProp === 'auto' ? defaultDuration : durationProp;
  const { autoTransitionDurationRef, addEndListener } =
    useAutoTransitionDuration(duration);
  const nodeRef = useRef<HTMLElement>(null);
  const [setNodeTransition, resetNodeTransition] = useSetNodeTransition(
    {
      delay,
      duration,
      easing,
      properties: [
        'opacity',
        [
          'transform',
          (transitionProps) => {
            const { delay: delayProp, duration: durationProp } =
              transitionProps;

            return {
              ...transitionProps,
              delay: delayProp,
              duration: durationProp,
            };
          },
        ],
      ],
      resolveAutoDuration: () => {
        const autoSizeDuration = getAutoSizeDuration(
          nodeRef.current?.clientHeight ?? 0,
        );

        autoTransitionDurationRef.current = autoSizeDuration;

        return autoSizeDuration;
      },
    },
    children?.props.style,
  );
  const composedNodeRef = useComposeRefs([ref, nodeRef]);
  const transitionProps: TransitionProps = {
    ...rest,
    addEndListener,
    appear,
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
              visibility: state === 'exited' && !inProp ? 'hidden' : undefined,
              ...getStyle(state),
              transformOrigin,
              ...children.props.style,
            },
          }))}
    </Transition>
  );
});

export default Scale;
