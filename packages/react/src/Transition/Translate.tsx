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
  from: TranslateFrom,
): CSSProperties {
  if (state === 'entering' || state === 'entered') {
    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
    };
  }

  const style: CSSProperties = {
    opacity: 0,
    transform: {
      top: 'translate3d(0, -4px, 0)',
      right: 'translate3d(4px, 0, 0)',
      bottom: 'translate3d(0, 4px, 0)',
      left: 'translate3d(-4px, 0, 0)',
    }[from],
  };

  if (state === 'exited' && !inProp) {
    style.visibility = 'hidden';
  }

  return style;
}

const defaultDuration = {
  enter: MOTION_DURATION.moderate,
  exit: MOTION_DURATION.moderate,
};

const defaultEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

export type TranslateFrom = 'top' | 'bottom' | 'left' | 'right';

export interface TranslateProps extends TransitionImplementationProps {
  /**
   * The position of child element will enter from.
   * @default 'top'
   */
  from?: TranslateFrom;
}

/**
 * The react component for `mezzanine` transition translate in/out.
 */
const Translate = forwardRef<HTMLElement, TranslateProps>(function Translate(
  props: TranslateProps,
  ref,
) {
  const {
    children,
    delay = 0,
    duration: durationProp = defaultDuration,
    easing = defaultEasing,
    from = 'top',
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
      properties: ['opacity', 'transform'],
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

export default Translate;
