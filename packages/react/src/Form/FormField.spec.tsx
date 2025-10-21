import { Severity } from '@mezzanine-ui/system/severity';
import { useContext } from 'react';
import { cleanup, cleanupHook, render, renderHook } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormControl, FormControlContext, FormField } from '.';

describe('<FormField />', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<FormField ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FormField className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<FormField />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-form-field')).toBeTruthy();
  });

  it('should provide formControl', () => {
    const firstProps: FormControl = {
      disabled: true,
      fullWidth: true,
      required: true,
      severity: 'warning',
    };

    const { result, rerender } = renderHook(
      () => useContext(FormControlContext),
      {
        wrapper: ({ children }) => (
          <FormField {...firstProps}>{children}</FormField>
        ),
      },
    );

    expect(result.current).toEqual(firstProps);

    const secondProps: FormControl = {
      disabled: false,
      fullWidth: false,
      required: false,
      severity: 'success',
    };

    rerender();
    // Need to re-render with new wrapper since props changed
    const { result: result2 } = renderHook(
      () => useContext(FormControlContext),
      {
        wrapper: ({ children }) => (
          <FormField {...secondProps}>{children}</FormField>
        ),
      },
    );
    expect(result2.current).toEqual(secondProps);
  });

  describe('prop: disabled', () => {
    function testDisabled(element: HTMLElement, disabled: boolean) {
      expect(element.classList.contains('mzn-form-field--disabled')).toBe(
        disabled,
      );
    }

    it('should render disabled by default', () => {
      const { getHostHTMLElement } = render(<FormField />);
      const element = getHostHTMLElement();

      testDisabled(element, false);
    });

    [false, true].forEach((disabled) => {
      const message = disabled
        ? 'should add disabled class if disabled=true'
        : 'should not add disabled class if disabled=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <FormField disabled={disabled} />,
        );
        const element = getHostHTMLElement();

        testDisabled(element, disabled);
      });
    });
  });

  describe('prop: fullWidth', () => {
    function testFullWidth(element: HTMLElement, fullWidth: boolean) {
      expect(element.classList.contains('mzn-form-field--full-width')).toBe(
        fullWidth,
      );
    }

    it('should render fullWidth by default', () => {
      const { getHostHTMLElement } = render(<FormField />);
      const element = getHostHTMLElement();

      testFullWidth(element, false);
    });

    [false, true].forEach((fullWidth) => {
      const message = fullWidth
        ? 'should add fullWidth class if fullWidth=true'
        : 'should not add fullWidth class if fullWidth=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <FormField fullWidth={fullWidth} />,
        );
        const element = getHostHTMLElement();

        testFullWidth(element, fullWidth);
      });
    });
  });

  describe('prop: severity', () => {
    const severities: Severity[] = ['success', 'warning', 'error'];

    severities.forEach((severity) => {
      it(`should add ${severity} class if severity=${severity}`, () => {
        const { getHostHTMLElement } = render(
          <FormField severity={severity} />,
        );
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-form-field--${severity}`),
        ).toBeTruthy();
      });
    });
  });
});
