import { ChevronDownIcon } from '@mezzanine-ui/icons';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, { AccordionSummary } from '.';

describe('<AccordionSummary />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AccordionSummary ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<AccordionSummary className={className} />),
  );

  describe('interact with Accordion', () => {
    let hostElement: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <Accordion>
          <AccordionSummary id="accordion-1">test</AccordionSummary>
        </Accordion>,
      );

      hostElement = getHostHTMLElement();
    });

    it('should aria- props correctly applied', async () => {
      const summary = document.getElementById('accordion-1');

      expect(summary?.getAttribute('aria-expanded')).toBe('false');

      await act(async () => {
        fireEvent.click(summary!);
      });

      expect(summary?.getAttribute('aria-expanded')).toBe('true');
      expect(summary?.getAttribute('aria-controls')).toBe(
        'accordion-1-details',
      );
    });

    it('should expand icon existed by default', () => {
      const summaryIcon = hostElement.querySelector(
        '.mzn-accordion__summary__icon',
      );

      expect(summaryIcon?.getAttribute('data-icon-name')).toBe(
        ChevronDownIcon.name,
      );
    });

    it('should icon expanded class applied when clicked on summary', async () => {
      const summary = document.getElementById('accordion-1');

      expect(
        hostElement.querySelector('.mzn-accordion__summary__icon--expanded'),
      ).toBeNull();

      await act(async () => {
        fireEvent.click(summary!);
      });

      const summaryIconExpanded = hostElement.querySelector(
        '.mzn-accordion__summary__icon--expanded',
      );

      expect(summaryIconExpanded?.getAttribute('data-icon-name')).toBe(
        ChevronDownIcon.name,
      );
    });

    it('should icon expanded class applied when clicked on icon', async () => {
      const icon = hostElement.querySelector('.mzn-accordion__summary__icon');

      await act(async () => {
        fireEvent.click(icon!);
      });

      const iconExpanded = hostElement.querySelector(
        '.mzn-accordion__summary__icon--expanded',
      );

      expect(iconExpanded?.getAttribute('data-icon-name')).toBe(
        ChevronDownIcon.name,
      );
    });

    it('should nothing happened when `mouseDown` event trigger on icon', async () => {
      const icon = hostElement.querySelector('.mzn-accordion__summary__icon');

      await act(async () => {
        fireEvent.mouseDown(icon!);
      });

      const iconExpanded = hostElement.querySelector(
        '.mzn-accordion__summary__icon--expanded',
      );

      expect(iconExpanded).toBeNull();
    });

    describe('Keyboard Event', () => {
      it('should `Enter` keyboard event toggle Accordion to open', async () => {
        const summary = document.getElementById('accordion-1');

        await act(async () => {
          fireEvent.keyDown(summary!, { key: 'Enter', code: 'Enter' });
        });

        const summaryIconExpanded = hostElement.querySelector(
          '.mzn-accordion__summary__icon--expanded',
        );

        expect(summaryIconExpanded?.getAttribute('data-icon-name')).toBe(
          ChevronDownIcon.name,
        );
      });

      it('should keyboard events been ignored except `Enter`', async () => {
        const summary = document.getElementById('accordion-1');

        await act(async () => {
          fireEvent.keyDown(summary!, { key: 'ArrowDown', code: 'ArrowDown' });
          fireEvent.keyDown(summary!, { key: 'ArrowUp', code: 'ArrowUp' });
          fireEvent.keyDown(summary!, {
            key: 'ArrowRight',
            code: 'ArrowRight',
          });
          fireEvent.keyDown(summary!, { key: 'ArrowLeft', code: 'ArrowLeft' });
          fireEvent.keyDown(summary!, { key: 'Tab', code: 'Tab' });
        });

        const summaryIconExpanded = hostElement.querySelector(
          '.mzn-accordion__summary__icon--expanded',
        );

        expect(summaryIconExpanded).toBeNull();
      });
    });
  });

  describe('Accordion disabled', () => {
    let hostElement: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <Accordion disabled>
          <AccordionSummary id="accordion-1">test</AccordionSummary>
        </Accordion>,
      );

      hostElement = getHostHTMLElement();
    });

    it('should summary disabled classes been applied', () => {
      expect(
        hostElement.querySelector('.mzn-accordion__summary--disabled'),
      ).toBeInstanceOf(HTMLElement);
      expect(
        hostElement.querySelector('.mzn-accordion__summary__icon--disabled'),
      ).toBeInstanceOf(HTMLElement);
    });

    it('should not expanded when summary clicked', async () => {
      const summary = hostElement.querySelector(
        '.mzn-accordion__summary--disabled',
      );

      await act(async () => {
        fireEvent.click(summary!);
      });

      expect(summary?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should not expanded when icon clicked', async () => {
      const icon = hostElement.querySelector(
        '.mzn-accordion__summary__icon--disabled',
      );

      await act(async () => {
        fireEvent.click(icon!);
      });

      const iconExpanded = hostElement.querySelector(
        '.mzn-accordion__summary__icon--expanded',
      );

      expect(iconExpanded).toBeNull();
    });
  });
});
