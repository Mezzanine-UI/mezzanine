import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, { AccordionContent, AccordionGroup, AccordionTitle } from '.';

describe('<AccordionGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AccordionGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<AccordionGroup className={className} />),
  );

  it('should render with mzn-accordion-group class', () => {
    const { getHostHTMLElement } = render(<AccordionGroup />);

    const host = getHostHTMLElement();

    expect(host.classList.contains('mzn-accordion-group')).toBe(true);
  });

  it('should render children accordions', () => {
    const { getHostHTMLElement } = render(
      <AccordionGroup>
        <Accordion>
          <AccordionTitle id="accordion-1">Title 1</AccordionTitle>
          <AccordionContent>Content 1</AccordionContent>
        </Accordion>
        <Accordion>
          <AccordionTitle id="accordion-2">Title 2</AccordionTitle>
          <AccordionContent>Content 2</AccordionContent>
        </Accordion>
      </AccordionGroup>,
    );

    const host = getHostHTMLElement();
    const accordions = host.querySelectorAll('.mzn-accordion');

    expect(accordions.length).toBe(2);
  });

  describe('size prop', () => {
    it('should pass size="main" to children accordions', () => {
      const { getHostHTMLElement } = render(
        <AccordionGroup size="main">
          <Accordion>
            <AccordionTitle id="accordion-1">Title 1</AccordionTitle>
            <AccordionContent>Content 1</AccordionContent>
          </Accordion>
        </AccordionGroup>,
      );

      const host = getHostHTMLElement();
      const accordion = host.querySelector('.mzn-accordion');

      expect(accordion?.classList.contains('mzn-accordion--main')).toBe(true);
    });

    it('should pass size="sub" to children accordions', () => {
      const { getHostHTMLElement } = render(
        <AccordionGroup size="sub">
          <Accordion>
            <AccordionTitle id="accordion-1">Title 1</AccordionTitle>
            <AccordionContent>Content 1</AccordionContent>
          </Accordion>
        </AccordionGroup>,
      );

      const host = getHostHTMLElement();
      const accordion = host.querySelector('.mzn-accordion');

      expect(accordion?.classList.contains('mzn-accordion--sub')).toBe(true);
    });
  });
});
