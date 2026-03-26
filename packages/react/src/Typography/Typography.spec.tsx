import { toCssVar } from '@mezzanine-ui/system/css';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Typography, {
  TypographyAlign,
  TypographyColor,
  TypographyComponent,
  TypographyDisplay,
  TypographySemanticType,
} from '.';

describe('<Typography />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLParagraphElement, (ref) =>
    render(<Typography ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Typography className={className} />),
  );

  it('should render the text', () => {
    const { getHostHTMLElement } = render(<Typography>Hello</Typography>);
    const { textContent } = getHostHTMLElement();

    expect(textContent).toBe('Hello');
  });

  describe('prop: variant', () => {
    it('should render variant="body" by default', () => {
      const { getHostHTMLElement } = render(<Typography>Hello</Typography>);
      const { classList } = getHostHTMLElement();

      expect(classList.contains('mzn-typography--body')).toBeTruthy();
    });

    const variantWithComponents: [
      TypographySemanticType,
      TypographyComponent,
    ][] = [
      ['h1', 'h1'],
      ['h2', 'h2'],
      ['h3', 'h3'],
      ['body', 'p'],
      ['body-highlight', 'p'],
      ['body-mono', 'p'],
      ['body-mono-highlight', 'p'],
      ['text-link-body', 'p'],
      ['text-link-caption', 'span'],
      ['caption', 'span'],
      ['caption-highlight', 'span'],
      ['annotation', 'span'],
      ['annotation-highlight', 'span'],
      ['button', 'span'],
      ['button-highlight', 'span'],
      ['input', 'span'],
      ['input-mono', 'span'],
      ['input-highlight', 'span'],
      ['label-primary', 'span'],
      ['label-primary-highlight', 'span'],
      ['label-secondary', 'span'],
    ];

    variantWithComponents.forEach(([variant, component]) => {
      it(`should render variant="${variant}"`, () => {
        const { getHostHTMLElement } = render(
          <Typography variant={variant}>Hello</Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.tagName.toLowerCase()).toBe(component);
        expect(
          element.classList.contains(`mzn-typography--${variant}`),
        ).toBeTruthy();
      });

      it(`should render variant="${variant}" w/ overriding component`, () => {
        const { getHostHTMLElement } = render(
          <Typography variant={variant} component="div">
            Hello
          </Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.tagName.toLowerCase()).toBe('div');
      });
    });
  });

  describe('prop: align', () => {
    const aligns: (TypographyAlign | undefined)[] = [
      undefined,
      'left',
      'center',
      'right',
      'justify',
    ];

    aligns.forEach((align) => {
      const message = align
        ? `should add class and style if align="${align}"`
        : 'should not add class and style if align=undefined';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Typography align={align} className="foo">
            Hello
          </Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-typography--align')).toBe(
          !!align,
        );
        expect(element.style.getPropertyValue('--mzn-typography-align')).toBe(
          align || '',
        );
      });
    });
  });

  describe('prop: color', () => {
    const colors: (TypographyColor | undefined)[] = [
      undefined,
      'inherit',
      'text-neutral',
      'text-neutral-strong',
      'text-neutral-solid',
      'text-brand',
      'text-brand-strong',
      'text-error',
      'text-warning',
      'text-success',
      'text-info',
    ];

    colors.forEach((color) => {
      const expected = !color
        ? ''
        : color === 'inherit'
          ? 'inherit'
          : toCssVar(`mzn-color-${color}`);

      const message = color
        ? `should add class and style if color="${color}"`
        : 'should not add class and style if color=undefined';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Typography color={color} className="foo">
            Hello
          </Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-typography--color')).toBe(
          !!color,
        );
        expect(element.style.getPropertyValue('--mzn-typography-color')).toBe(
          expected,
        );
      });
    });
  });

  describe('prop: display', () => {
    const displays: (TypographyDisplay | undefined)[] = [
      undefined,
      'block',
      'inline-block',
      'flex',
      'inline-flex',
    ];

    displays.forEach((display) => {
      const message = display
        ? `should add class and style if display="${display}"`
        : 'should not add class and style if display=undefined';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Typography display={display} className="foo">
            Hello
          </Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-typography--display')).toBe(
          !!display,
        );
        expect(element.style.getPropertyValue('--mzn-typography-display')).toBe(
          display || '',
        );
      });
    });
  });

  describe('prop: ellipsis', () => {
    [false, true].forEach((ellipsis) => {
      const message = ellipsis
        ? 'should add class and provide titile attribute if ellipsis=true'
        : 'should not add class and not provide titile attribute if ellipsis=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Typography ellipsis={ellipsis}>Hello</Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-typography--ellipsis')).toBe(
          ellipsis,
        );
        expect(element.getAttribute('title')).toBe(ellipsis ? 'Hello' : null);
      });
    });
  });

  describe('prop: noWrap', () => {
    [false, true].forEach((noWrap) => {
      const message = noWrap
        ? 'should add class if noWrap=true'
        : 'should not add class if noWrap=false';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Typography noWrap={noWrap}>Hello</Typography>,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains('mzn-typography--nowrap')).toBe(
          noWrap,
        );
      });
    });
  });
});
