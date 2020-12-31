import { createRef, ForwardedRef } from 'react';
import { RenderResult } from './core';

export function describeForwardRefToHTMLElement<E extends typeof Element>(
  element: E,
  render: (ref: ForwardedRef<InstanceType<E>>) => RenderResult,
) {
  describe('ref', () => {
    it('should forward ref to host element', () => {
      const ref = createRef<InstanceType<E>>();

      render(ref);

      expect(ref.current).toBeInstanceOf(element);
    });
  });
}

export function describeHostElementClassNameAppendable(
  className: string,
  getRenderResult: (className: string) => RenderResult,
) {
  describe('className', () => {
    it('should append class name on host element', () => {
      const { getHostHTMLElement } = getRenderResult(className);
      const { classList } = getHostHTMLElement();

      expect(classList.contains(className)).toBeTruthy();
    });
  });
}
