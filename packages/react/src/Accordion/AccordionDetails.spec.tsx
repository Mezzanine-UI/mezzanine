import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Accordion, { AccordionSummary, AccordionDetails } from '.';

describe('<AccordionDetails />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AccordionDetails ref={ref} expanded />),
  );

  it('should applied expanded className when prop expanded is true', () => {
    const { getHostHTMLElement } = render(<AccordionDetails expanded />);

    const host = getHostHTMLElement();

    expect(
      host.querySelector('.mzn-accordion__details--expanded'),
    ).toBeInstanceOf(HTMLDivElement);
  });

  describe('with Accordion', () => {
    let accordionHost: HTMLElement;

    beforeEach(async () => {
      const { getHostHTMLElement } = render(
        <Accordion>
          <AccordionSummary id="accordion-1">foo</AccordionSummary>
          <AccordionDetails>bar</AccordionDetails>
        </Accordion>,
      );

      const tempHost = getHostHTMLElement();

      await act(async () => {
        fireEvent.click(tempHost.querySelector('.mzn-accordion__summary')!);
      });

      accordionHost = tempHost;
    });

    it('should be expanded when context `expanded` is true', () => {
      expect(
        accordionHost.querySelector('.mzn-accordion__details--expanded'),
      ).toBeInstanceOf(HTMLDivElement);
    });

    it('should aria- props applied', () => {
      const details = accordionHost.querySelector('.mzn-accordion__details');

      expect(details?.getAttribute('role')).toBe('region');
      expect(details?.getAttribute('aria-labelledby')).toBe('accordion-1');
      expect(details?.getAttribute('id')).toBe('accordion-1-details');
    });
  });
});
