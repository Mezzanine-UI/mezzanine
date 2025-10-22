import { CSSProperties } from 'react';
import { TransitionMode } from './Transition';
import {
  GetTransitionStyleProps,
  getTransitionStyleProps,
  TransitionStyleProps,
} from './getTransitionStyleProps';

export interface UseSetNodeTransitionProps extends GetTransitionStyleProps {
  properties: (
    | string
    | [
        string,
        (
          props: TransitionStyleProps,
          mode: TransitionMode,
        ) => TransitionStyleProps,
      ]
  )[];
}

export function useSetNodeTransition(
  props: UseSetNodeTransitionProps,
  style?: CSSProperties,
) {
  const setNodeTransition = (node: HTMLElement, mode: TransitionMode) => {
    const transitionProps = getTransitionStyleProps(mode, props);
    const { properties } = props;

    node.style.transition = properties
      .map((propertyOrConfig) => {
        let property: string;
        let resolvedTransitionProps = transitionProps;

        if (typeof propertyOrConfig === 'string') {
          property = propertyOrConfig;
        } else {
          const [, overrideTransitionProps] = propertyOrConfig;

          [property] = propertyOrConfig;
          resolvedTransitionProps = overrideTransitionProps(
            resolvedTransitionProps,
            mode,
          );
        }

        const { delay, duration, timingFunction } = resolvedTransitionProps;

        return `${property} ${duration}ms ${timingFunction} ${delay}ms`;
      })
      .join(',');
  };

  const resetNodeTransition = (node: HTMLElement) => {
    const { transition } = style || {};

    if (transition) {
      node.style.transition = transition;
    }
  };

  return [setNodeTransition, resetNodeTransition] as const;
}
