import { useState } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, { AccordionTitle, AccordionContent } from '.';

function testExpanded(element: HTMLElement) {
  const title = element.querySelector('.mzn-accordion__title');

  expect(title?.getAttribute('aria-expanded')).toBe('true');
}

describe('<Accordion />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Accordion ref={ref}>
        <AccordionTitle id="test">test</AccordionTitle>
        <AccordionContent>content</AccordionContent>
      </Accordion>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <Accordion className={className}>
        <AccordionTitle id="test">test</AccordionTitle>
        <AccordionContent>content</AccordionContent>
      </Accordion>,
    ),
  );

  describe('Control', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(
        <Accordion defaultExpanded>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      testExpanded(host);
    });

    it('controlled', async () => {
      const ControlledAccordion = () => {
        const [expanded, setExpanded] = useState<boolean>(true);

        return (
          <Accordion expanded={expanded} onChange={(exp) => setExpanded(exp)}>
            <AccordionTitle id="accordion-1">foo</AccordionTitle>
            <AccordionContent>bar</AccordionContent>
          </Accordion>
        );
      };

      const { getHostHTMLElement } = render(<ControlledAccordion />);
      const host = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(host.querySelector('.mzn-accordion__title')!);
      });

      testExpanded(host);
    });
  });

  describe('disabled', () => {
    it('should not toggle when disabled', async () => {
      const { getHostHTMLElement } = render(
        <Accordion disabled>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(host.querySelector('.mzn-accordion__title')!);
      });

      const title = host.querySelector('.mzn-accordion__title');

      expect(title?.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('composition usage', () => {
    it('should render AccordionTitle', () => {
      const { getHostHTMLElement } = render(
        <Accordion>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      expect(host.querySelector('.mzn-accordion__title')).toBeInstanceOf(
        HTMLDivElement,
      );
    });

    it('should render AccordionContent when expanded', async () => {
      const { getHostHTMLElement } = render(
        <Accordion defaultExpanded>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      expect(host.querySelector('.mzn-accordion__content')).toBeInstanceOf(
        HTMLDivElement,
      );
    });
  });
});
