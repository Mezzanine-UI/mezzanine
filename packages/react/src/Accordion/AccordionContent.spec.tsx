import { cleanup, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Accordion, { AccordionTitle, AccordionContent } from '.';

describe('<AccordionContent />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AccordionContent ref={ref} expanded />),
  );

  it('should render when prop expanded is true', () => {
    const { getHostHTMLElement } = render(<AccordionContent expanded />);

    const host = getHostHTMLElement();

    expect(host.querySelector('.mzn-accordion__content')).toBeInstanceOf(
      HTMLDivElement,
    );
  });

  describe('with Accordion', () => {
    let accordionHost: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <Accordion defaultExpanded>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      accordionHost = getHostHTMLElement();
    });

    it('should render content when context `expanded` is true', () => {
      expect(
        accordionHost.querySelector('.mzn-accordion__content'),
      ).toBeInstanceOf(HTMLDivElement);
    });

    it('should aria- props applied', () => {
      const content = accordionHost.querySelector('.mzn-accordion__content');

      expect(content?.getAttribute('role')).toBe('region');
      expect(content?.getAttribute('aria-labelledby')).toBe('accordion-1');
      expect(content?.getAttribute('id')).toBe('accordion-1-content');
    });
  });
});
