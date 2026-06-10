import { createElement, createRef, Ref } from 'react';
import { getElementRef, ReactElementWithRef } from './getElementRef';

/**
 * Builds a fake element shaped like a React 18 dev-mode element created
 * with a ref: the actual ref lives on `element.ref`, and `props.ref` is a
 * warning getter marked with `isReactWarning` (see
 * `defineRefPropWarningGetter` in the React 18 source). Accessing it logs
 * "`ref` is not a prop."
 */
function createReact18DevElementWithRef(
  ref: Ref<HTMLElement>,
  onWarningAccess: () => void,
): ReactElementWithRef<unknown, HTMLElement> {
  const props = {};
  const warnAboutAccessingRef = () => {
    onWarningAccess();
    return undefined;
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true,
  });

  return { props, ref } as unknown as ReactElementWithRef<unknown, HTMLElement>;
}

/**
 * Builds a fake element shaped like a React 19 dev-mode element created
 * with a ref: the actual ref lives in `props.ref` as a regular property,
 * and `element.ref` is a deprecation warning getter. Accessing it logs
 * "Accessing element.ref was removed in React 19."
 */
function createReact19DevElementWithRef(
  ref: Ref<HTMLElement>,
  onWarningAccess: () => void,
): ReactElementWithRef<unknown, HTMLElement> {
  const props = { ref };
  const element = { props };
  const elementRefGetterWithDeprecationWarning = function getRef(
    this: typeof element,
  ) {
    onWarningAccess();
    return this.props.ref;
  };
  // React 19.0 does not mark this getter with `isReactWarning`, so model
  // the worst case (no flag) — getElementRef must not read it anyway.
  Object.defineProperty(element, 'ref', {
    enumerable: false,
    get: elementRefGetterWithDeprecationWarning,
  });

  return element as unknown as ReactElementWithRef<unknown, HTMLElement>;
}

describe('getElementRef()', () => {
  describe('React 18 dev-mode element shape', () => {
    it('should return element.ref without touching the props.ref warning getter', () => {
      const ref = createRef<HTMLElement>();
      const onWarningAccess = jest.fn();
      const element = createReact18DevElementWithRef(ref, onWarningAccess);

      expect(getElementRef(element)).toBe(ref);
      expect(onWarningAccess).not.toHaveBeenCalled();
    });
  });

  describe('React 19 dev-mode element shape', () => {
    it('should return props.ref without touching the element.ref deprecation getter', () => {
      const ref = createRef<HTMLElement>();
      const onWarningAccess = jest.fn();
      const element = createReact19DevElementWithRef(ref, onWarningAccess);

      expect(getElementRef(element)).toBe(ref);
      expect(onWarningAccess).not.toHaveBeenCalled();
    });
  });

  describe('production-like element shapes (no warning getters)', () => {
    it('should return props.ref when ref lives in props (React 19)', () => {
      const ref = createRef<HTMLElement>();
      const element = {
        props: { ref },
      } as unknown as ReactElementWithRef<unknown, HTMLElement>;

      expect(getElementRef(element)).toBe(ref);
    });

    it('should return element.ref when ref lives on the element (React 18)', () => {
      const ref = createRef<HTMLElement>();
      const element = {
        props: {},
        ref,
      } as unknown as ReactElementWithRef<unknown, HTMLElement>;

      expect(getElementRef(element)).toBe(ref);
    });
  });

  describe('with the installed React version', () => {
    it('should extract the ref from a real element without logging any warning', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      try {
        const ref = createRef<HTMLButtonElement>();
        const element = createElement('button', { ref });

        expect(
          getElementRef(
            element as unknown as ReactElementWithRef<
              unknown,
              HTMLButtonElement
            >,
          ),
        ).toBe(ref);
        expect(errorSpy).not.toHaveBeenCalled();
      } finally {
        errorSpy.mockRestore();
      }
    });

    it('should return a nullish value for an element created without ref', () => {
      const element = createElement('button');

      expect(
        getElementRef(
          element as unknown as ReactElementWithRef<unknown, HTMLElement>,
        ),
      ).toBeFalsy();
    });
  });
});
