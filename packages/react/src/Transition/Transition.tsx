import {
  RefObject,
  CSSProperties,
  ReactElement,
  JSXElementConstructor,
  Ref,
} from 'react';
import ReactTransition, {
  TransitionStatus as TransitionState,
  TransitionChildren,
} from 'react-transition-group/Transition';
import { NativeElementTag } from '../utils/jsx-types';

export { TransitionState };

export type TransitionMode = 'enter' | 'exit';

export type TransitionDuration = 'auto' | number | {
  [mode in TransitionMode]?: number;
};

export type TransitionEasing = string | {
  [mode in TransitionMode]?: string;
};

export type TransitionDelay = number | {
  [mode in TransitionMode]?: number;
};

export type TransitionEnterHandler = (node: HTMLElement, isAppearing: boolean) => void;
export type TransitionExitHandler = (node: HTMLElement) => void;

export interface TransitionImplementationChildProps {
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
}

export interface TransitionImplementationProps
  extends Omit<TransitionProps, 'addEndListener' | 'children' | 'nodeRef'> {
  children: ReactElement<
  TransitionImplementationChildProps,
  NativeElementTag | JSXElementConstructor<TransitionImplementationChildProps>
  >;
  /**
   * The delay of the transition, in milliseconds
   */
  delay?: TransitionDelay;
  /**
   * The timing function of the transition
   */
  easing?: TransitionEasing;
}

export interface TransitionProps {
  /**
   * A custom callback for adding custom transition end handler
   */
  addEndListener?: (node: HTMLElement, next: VoidFunction) => void;
  /**
   * Whether to perform the enter transition if `in` is true while it first mount
   * @true
   */
  appear?: boolean;
  /**
   * A react node or a render props called with transition state
   */
  children?: TransitionChildren;
  /**
   * The duration of the transition, in milliseconds
   */
  duration?: TransitionDuration;
  /**
   * The flag to trigger toggling transition between `enter` and `exit` state
   * @default false
   */
  in?: boolean;
  /**
   * Whether to keeping mounting the child if exited.
   * @default false
   */
  keepMount?: boolean;
  /**
   * Whether to mount the child at the first time entering.
   * @default true
   */
  lazyMount?: boolean;
  /**
   * A ref of DOM element need to transition
   */
  nodeRef: RefObject<HTMLElement>;
  /**
   * Callback fired before the `entering` state applied
   */
  onEnter?: TransitionEnterHandler;
  /**
   * Callback fired after the `entering` state applied
   */
  onEntering?: TransitionEnterHandler;
  /**
   * Callback fired after the `entered` state applied
   */
  onEntered?: TransitionEnterHandler;
  /**
   * Callback fired before the `exiting` state applied.
   */
  onExit?: TransitionExitHandler;
  /**
   * Callback fired after the `exiting` state applied.
   */
  onExiting?: TransitionExitHandler;
  /**
   * Callback fired after the `exited` state applied.
   */
  onExited?: TransitionExitHandler;
}

/**
 * The react component for `mezzanine` transition.
 */
function Transition(props: TransitionProps) {
  const {
    addEndListener,
    appear = true,
    children,
    duration,
    in: inProp = false,
    keepMount = false,
    lazyMount = true,
    nodeRef,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
  } = props;
  const addNodeToCallback = <F extends (node: HTMLElement, ...args: any[]) => void>(callback?: F) => {
    if (!callback) {
      return;
    }

    return (...args: F extends (node: HTMLElement, ...a: infer A) => void ? A : never) => {
      const node = nodeRef.current;

      if (node) {
        callback(node, ...args);
      }
    };
  };

  return (
    <ReactTransition
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      addEndListener={addNodeToCallback(addEndListener)!}
      appear={appear}
      in={inProp}
      mountOnEnter={lazyMount}
      nodeRef={nodeRef}
      onEnter={addNodeToCallback(onEnter)}
      onEntering={addNodeToCallback(onEntering)}
      onEntered={addNodeToCallback(onEntered)}
      onExit={addNodeToCallback(onExit)}
      onExiting={addNodeToCallback(onExiting)}
      onExited={addNodeToCallback(onExited)}
      timeout={duration === 'auto' ? undefined : duration}
      unmountOnExit={!keepMount}
    >
      {children}
    </ReactTransition>
  );
}

export default Transition;
