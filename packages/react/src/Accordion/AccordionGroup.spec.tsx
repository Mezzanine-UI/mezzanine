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

  describe('exclusive prop', () => {
    it('should only allow one accordion to be expanded at a time', () => {
      const { getHostHTMLElement } = render(
        <AccordionGroup exclusive>
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
      const titles = host.querySelectorAll('.mzn-accordion__title');

      // initially all collapsed
      expect(titles[0].getAttribute('aria-expanded')).toBe('false');
      expect(titles[1].getAttribute('aria-expanded')).toBe('false');

      // expand first
      titles[0].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(titles[0].getAttribute('aria-expanded')).toBe('true');
      expect(titles[1].getAttribute('aria-expanded')).toBe('false');

      // expand second — first should collapse
      titles[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(titles[0].getAttribute('aria-expanded')).toBe('false');
      expect(titles[1].getAttribute('aria-expanded')).toBe('true');
    });

    it('should collapse the expanded accordion when clicked again', () => {
      const { getHostHTMLElement } = render(
        <AccordionGroup exclusive>
          <Accordion>
            <AccordionTitle id="accordion-1">Title 1</AccordionTitle>
            <AccordionContent>Content 1</AccordionContent>
          </Accordion>
        </AccordionGroup>,
      );

      const host = getHostHTMLElement();
      const title = host.querySelector('.mzn-accordion__title')!;

      title.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(title.getAttribute('aria-expanded')).toBe('true');

      title.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(title.getAttribute('aria-expanded')).toBe('false');
    });
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
