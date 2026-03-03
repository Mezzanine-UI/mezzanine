import { SeverityWithInfo } from '@mezzanine-ui/system/severity';
import { formHintIcons } from '@mezzanine-ui/core/form';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { FormHintText } from '.';

describe('<FormHintText />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<FormHintText ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<FormHintText className={className} />),
  );

  it('should render by span and bind host class', () => {
    const { getHostHTMLElement } = render(<FormHintText hintText="Hello" />);
    const element = getHostHTMLElement();

    expect(
      element.classList.contains('mzn-form-field__hint-text'),
    ).toBeTruthy();
    expect(element.textContent).toContain('Hello');
    expect(element.tagName.toLowerCase()).toBe('span');
  });

  it('should render with default severity="info"', () => {
    const { getHostHTMLElement } = render(<FormHintText hintText="Hello" />);
    const element = getHostHTMLElement();

    expect(
      element.classList.contains('mzn-form-field__hint-text--info'),
    ).toBeTruthy();
  });

  describe('prop: severity', () => {
    const severities: SeverityWithInfo[] = [
      'success',
      'warning',
      'error',
      'info',
    ];

    severities.forEach((severity) => {
      it(`should render severity class and icon if severity=${severity}`, () => {
        const { getHostHTMLElement } = render(
          <FormHintText hintText="Hello" severity={severity} />,
        );
        const element = getHostHTMLElement();
        const iconElement = element.querySelector(
          '.mzn-form-field__hint-text__icon',
        );

        expect(
          element.classList.contains(`mzn-form-field__hint-text--${severity}`),
        ).toBeTruthy();
        expect(iconElement).toBeInstanceOf(HTMLElement);
        expect(iconElement!.getAttribute('data-icon-name')).toBe(
          formHintIcons[severity].name,
        );
      });
    });
  });

  describe('prop: showHintTextIcon', () => {
    it('should not render any icon when showHintTextIcon=false with severity', () => {
      const { getHostHTMLElement } = render(
        <FormHintText
          hintText="Hello"
          severity="error"
          showHintTextIcon={false}
        />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(
        '.mzn-form-field__hint-text__icon',
      );

      expect(iconElement).toBeNull();
    });

    it('should not render any icon when showHintTextIcon=false with custom hintTextIcon', () => {
      const customIcon = {
        name: 'custom-icon',
        definition: {
          svg: { viewBox: '0 0 24 24' },
          path: { fill: 'currentColor', d: 'M0 0h24v24H0z' },
        },
      };

      const { getHostHTMLElement } = render(
        <FormHintText
          hintText="Hello"
          hintTextIcon={customIcon}
          showHintTextIcon={false}
        />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(
        '.mzn-form-field__hint-text__icon',
      );

      expect(iconElement).toBeNull();
    });
  });

  describe('prop: hintTextIcon', () => {
    const customIcon = {
      name: 'custom-icon',
      definition: {
        svg: {
          viewBox: '0 0 24 24',
        },
        path: {
          fill: 'currentColor',
          d: 'M0 0h24v24H0z',
        },
      },
    };

    it('should render custom icon when hintTextIcon is provided', () => {
      const { getHostHTMLElement } = render(
        <FormHintText hintText="Hello" hintTextIcon={customIcon} />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(
        '.mzn-form-field__hint-text__icon',
      );

      expect(iconElement).toBeInstanceOf(HTMLElement);
      expect(iconElement!.getAttribute('data-icon-name')).toBe('custom-icon');
    });

    it('should use custom icon over default severity icon', () => {
      const { getHostHTMLElement } = render(
        <FormHintText
          hintText="Hello"
          hintTextIcon={customIcon}
          severity="error"
        />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector(
        '.mzn-form-field__hint-text__icon',
      );

      expect(iconElement!.getAttribute('data-icon-name')).toBe('custom-icon');
    });
  });
});
