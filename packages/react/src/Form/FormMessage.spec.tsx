import { Severity } from '@mezzanine-ui/system/severity';
import { formMessageIcons } from '@mezzanine-ui/core/form';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormField, FormMessage } from '.';

describe('<FormMessage />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<FormMessage ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FormMessage className={className} />),
  );

  it('should render by span and bind host class', () => {
    const { getHostHTMLElement } = render(<FormMessage>Hello</FormMessage>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-form-field__message')).toBeTruthy();
    expect(element.textContent).toBe('Hello');
    expect(element.tagName.toLowerCase()).toBe('span');
  });

  describe('form: severity', () => {
    function testSeverityIcon(
      element: HTMLElement,
      severity: Severity | undefined,
    ) {
      const messageElement = element.querySelector('.mzn-form-field__message');
      const severityIconElement = messageElement!.querySelector(
        '.mzn-form-field__severity-icon',
      );

      if (severity) {
        const icon = formMessageIcons[severity];

        expect(severityIconElement!.tagName.toLowerCase()).toBe('i');
        expect(severityIconElement!.getAttribute('data-icon-name')).toBe(
          icon.name,
        );
      } else {
        expect(severityIconElement).toBeNull();
      }
    }

    it('should not render severity icon if severity=undefined', () => {
      const { getHostHTMLElement } = render(
        <FormField>
          <FormMessage>Hello</FormMessage>
        </FormField>,
      );
      const element = getHostHTMLElement();

      testSeverityIcon(element, undefined);
    });

    const severities: Severity[] = ['success', 'warning', 'error'];

    severities.forEach((severity) => {
      it(`should render ${formMessageIcons[severity].name} icon if severity=${severity}`, () => {
        const { getHostHTMLElement } = render(
          <FormField severity={severity}>
            <FormMessage>Hello</FormMessage>
          </FormField>,
        );
        const element = getHostHTMLElement();

        testSeverityIcon(element, severity);
      });
    });
  });
});
