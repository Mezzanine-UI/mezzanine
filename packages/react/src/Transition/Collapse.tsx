import { CSSProperties, forwardRef, useRef } from 'react';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import Transition, { TransitionImplementationProps, TransitionProps, TransitionState } from './Transition';
import { getAutoSizeDuration } from './getAutoSizeDuration';
import { reflow } from './reflow';
import { useAutoTransitionDuration } from './useAutoTransitionDuration';
import { useSetNodeTransition } from './useSetNodeTransition';

function getStyle(state: TransitionState, inProp: boolean, collapsedHeight: string): CSSProperties {
  const style: CSSProperties = {
    minHeight: collapsedHeight,
    height: 0,
    overflow: 'hidden',
  };

  if (state === 'entered') {
    style.height = 'auto';
    style.overflow = 'visible';
  } else if (state === 'exited' && !inProp && collapsedHeight === '0px') {
    style.visibility = 'hidden';
  }

  return style;
}

const defaultEasing = {
  enter: MOTION_EASING.decelerated,
  exit: MOTION_EASING.accelerated,
};

export interface CollapseProps
  extends
  TransitionImplementationProps,
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>, 'children'> {
  /**
   * The height of the container while collapsed.
   * @default 0
   */
  collapsedHeight?: string | number;
}

/**
 * The react component for `mezzanine` transition collapse.
 */
const Collapse = forwardRef<HTMLElement, CollapseProps>(function Collapse(props, ref) {
  const {
    appear,
    children,
    collapsedHeight: collapsedHeightProp = 0,
    delay = 0,
    duration = 'auto',
    easing = defaultEasing,
    in: inProp = false,
    lazyMount,
    keepMount,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExiting,
    onExited,
    style,
    ...rest
  } = props;
  const { autoTransitionDuration, addEndListener } = useAutoTransitionDuration(duration);
  const nodeRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const collapsedHeight = typeof collapsedHeightProp === 'number' ? `${collapsedHeightProp}px` : collapsedHeightProp;
  const getWrapperHeight = () => wrapperRef.current?.clientHeight || 0;
  const [setNodeTransition, resetNodeTransition] = useSetNodeTransition({
    delay,
    duration,
    easing,
    properties: ['height'],
    resolveAutoDuration: () => {
      const autoSizeDuration = getAutoSizeDuration(getWrapperHeight());

      autoTransitionDuration.current = autoSizeDuration;

      return autoSizeDuration;
    },
  }, style);
  const composedNodeRef = useComposeRefs([ref, nodeRef]);
  const transitionProps: TransitionProps = {
    addEndListener,
    appear,
    duration,
    in: inProp,
    lazyMount,
    keepMount: collapsedHeight !== '0px' ? true : keepMount,
    nodeRef,
    /* eslint-disable no-param-reassign */
    onEnter(node, isAppearing) {
      node.style.height = collapsedHeight;
      reflow(node);

      if (onEnter) {
        onEnter(node, isAppearing);
      }
    },
    onEntering(node, isAppearing) {
      setNodeTransition(node, 'enter');

      node.style.height = `${getWrapperHeight()}px`;

      if (onEntering) {
        onEntering(node, isAppearing);
      }
    },
    onEntered(node, isAppearing) {
      node.style.height = 'auto';

      resetNodeTransition(node);

      if (onEntered) {
        onEntered(node, isAppearing);
      }
    },
    onExit(node) {
      node.style.height = `${getWrapperHeight()}px`;
      reflow(node);

      if (onExit) {
        onExit(node);
      }
    },
    onExiting(node) {
      setNodeTransition(node, 'exit');
      node.style.height = collapsedHeight;

      if (onExiting) {
        onExiting(node);
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
      {(state) => (
        <div
          {...rest}
          ref={composedNodeRef}
          style={{
            ...getStyle(state, inProp, collapsedHeight),
            ...style,
          }}
        >
          <div ref={wrapperRef} style={{ display: 'flex', width: '100%' }}>
            <div style={{ width: '100%' }}>
              {children}
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
});

export default Collapse;
