import { createElement, createRef } from 'react';
import { getElementRef, ReactElementWithRef } from './getElementRef';

describe('getElementRef()', () => {
  it('should return props.ref', () => {
    const ref = createRef<HTMLElement>();
    const element = {
      props: { ref },
    } as unknown as ReactElementWithRef<unknown, HTMLElement>;

    expect(getElementRef(element)).toBe(ref);
  });

  it('should never touch the deprecated element.ref getter', () => {
    const ref = createRef<HTMLElement>();
    const onWarningAccess = jest.fn();
    const element = { props: { ref } };

    Object.defineProperty(element, 'ref', {
      enumerable: false,
      get: onWarningAccess,
    });

    expect(
      getElementRef(
        element as unknown as ReactElementWithRef<unknown, HTMLElement>,
      ),
    ).toBe(ref);
    expect(onWarningAccess).not.toHaveBeenCalled();
  });

  it('should extract the ref from a real element without logging any warning', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    try {
      const ref = createRef<HTMLButtonElement>();
      const element = createElement('button', { ref });

      expect(
        getElementRef(
          element as unknown as ReactElementWithRef<unknown, HTMLButtonElement>,
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
