import { useState } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, { AccordionContent, AccordionTitle } from '.';
import { accordionClasses } from '@mezzanine-ui/core/accordion';

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
    it('uncontrolled', async () => {
      const { getHostHTMLElement } = render(
        <Accordion defaultExpanded>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(
          host.querySelector(`.${accordionClasses.titleMainPart}`)!,
        );
      });

      const title = host.querySelector(`.${accordionClasses.titleMainPart}`);

      expect(title?.getAttribute('aria-expanded')).toBe('false');
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
        fireEvent.click(
          host.querySelector(`.${accordionClasses.titleMainPart}`)!,
        );
      });

      const title = host.querySelector(`.${accordionClasses.titleMainPart}`);

      expect(title?.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('disabled', () => {
    it('should not toggle when disabled', async () => {
      const { getHostHTMLElement } = render(
        <Accordion disabled defaultExpanded>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(
          host.querySelector(`.${accordionClasses.titleMainPart}`)!,
        );
      });

      const title = host.querySelector(`.${accordionClasses.titleMainPart}`);

      expect(title?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('size', () => {
    it('should apply size="main" class by default', () => {
      const { getHostHTMLElement } = render(
        <Accordion>
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-accordion--main')).toBe(true);
    });

    it('should apply size="main" class when size prop is "main"', () => {
      const { getHostHTMLElement } = render(
        <Accordion size="main">
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-accordion--main')).toBe(true);
      expect(host.classList.contains('mzn-accordion--sub')).toBe(false);
    });

    it('should apply size="sub" class when size prop is "sub"', () => {
      const { getHostHTMLElement } = render(
        <Accordion size="sub">
          <AccordionTitle id="accordion-1">foo</AccordionTitle>
          <AccordionContent>bar</AccordionContent>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-accordion--sub')).toBe(true);
      expect(host.classList.contains('mzn-accordion--main')).toBe(false);
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

      expect(
        host.querySelector(`.${accordionClasses.titleMainPart}`),
      ).toBeInstanceOf(HTMLButtonElement);
    });

    it('should render AccordionContent when expanded', () => {
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
