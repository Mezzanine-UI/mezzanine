import { Ref, useRef } from 'react';
import { ComposedRef } from '../utils/composeRefs';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { InputValueControl, useInputValueControl, UseInputValueControlProps } from './useInputValueControl';

export interface UseInputControlProps<E extends HTMLInputElement | HTMLTextAreaElement>
  extends Omit<UseInputValueControlProps<E>, 'ref'> {
  ref?: Ref<E>;
}

export interface InputControl<E extends HTMLInputElement | HTMLTextAreaElement> extends InputValueControl<E> {
  active: boolean;
  composedRef: ComposedRef<E>;
}

export function useInputControl<E extends HTMLInputElement | HTMLTextAreaElement>(
  props: UseInputControlProps<E>,
): InputControl<E> {
  const { ref: refProp } = props;
  const ref = useRef<E>(null);
  const composedRef = useComposeRefs([refProp, ref]);
  const valueControl = useInputValueControl({ ...props, ref });
  const active = !!valueControl.value;

  return {
    ...valueControl,
    active,
    composedRef,
  };
}
