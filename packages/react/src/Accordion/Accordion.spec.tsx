import { useState } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, { AccordionSummary, AccordionDetails } from '.';

function testExpanded(element: HTMLElement) {
  const summary = element.querySelector('.mzn-accordion__summary');

  expect(summary?.getAttribute('aria-expanded')).toBe('true');
}

describe('<Accordion />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Accordion ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Accordion className={className} />),
  );

  describe('Controll', () => {
    it('uncontrolled', () => {
      const { getHostHTMLElement } = render(
        <Accordion defaultExpanded>
          <AccordionSummary>foo</AccordionSummary>
          <AccordionDetails>bar</AccordionDetails>
        </Accordion>,
      );

      const host = getHostHTMLElement();

      testExpanded(host);
    });

    it('controlled', async () => {
      const ControlledAccordion = () => {
        const [expanded, setExpanded] = useState<boolean>(false);

        return (
          <Accordion expanded={expanded} onChange={(exp) => setExpanded(exp)}>
            <AccordionSummary>foo</AccordionSummary>
            <AccordionDetails>bar</AccordionDetails>
          </Accordion>
        );
      };

      const { getHostHTMLElement } = render(<ControlledAccordion />);
      const host = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(host.querySelector('.mzn-accordion__summary')!);
      });

      testExpanded(host);
    });
  });
});
