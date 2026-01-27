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

function getStyle(
  state: TransitionState,
  inProp: boolean,
  from: SlideFrom,
): CSSProperties {
  if (state === 'entering' || state === 'entered') {
    return {
      transform: 'translate3d(0, 0, 0)',
    };
  }

  const style: CSSProperties = {
    transform: {
      top: 'translate3d(0, -100%, 0)',
      right: 'translate3d(100%, 0, 0)',
    }[from],
  };

  if (state === 'exited' && !inProp) {
    style.visibility = 'hidden';
  }

  return style;
}

const defaultDuration = {
  enter: MOTION_DURATION.slow,
  exit: MOTION_DURATION.slow,
};

const defaultEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

export type SlideFrom = 'right' | 'top';

export interface SlideProps extends TransitionImplementationProps {
  /**
   * The position of child element will enter from.
   * @default 'right'
   */
  from?: SlideFrom;
}

/**
 * The react component for `mezzanine` transition slide in/out.
 */
const Slide = forwardRef<HTMLElement, SlideProps>(function Slide(
  props: SlideProps,
  ref,
) {
  const {
    children,
    delay = 0,
    duration: durationProp = defaultDuration,
    easing = defaultEasing,
    from = 'right',
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
              ...getStyle(state, inProp, from),
              ...children.props.style,
            },
          }))}
    </Transition>
  );
});

export default Slide;
