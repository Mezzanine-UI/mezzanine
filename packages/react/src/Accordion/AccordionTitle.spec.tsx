import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, { AccordionContent, AccordionTitle } from '.';

describe('<AccordionTitle />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AccordionTitle ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<AccordionTitle className={className} />),
  );

  describe('interact with Accordion', () => {
    let hostElement: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <Accordion>
          <AccordionTitle id="accordion-1">test</AccordionTitle>
          <AccordionContent>content</AccordionContent>
        </Accordion>,
      );

      hostElement = getHostHTMLElement();
    });

    it('should aria- props correctly applied', async () => {
      const title = hostElement.querySelector('[class*="accordion__title"]');

      expect(title?.getAttribute('aria-expanded')).toBe('false');

      const clickTarget =
        hostElement.querySelector('[class*="title-main-part"]') ||
        hostElement.querySelector('button') ||
        title;

      await act(async () => {
        fireEvent.click(clickTarget!);
      });

      expect(title?.getAttribute('aria-expanded')).toBe('true');
      expect(title?.getAttribute('aria-controls')).toBe('accordion-1-content');
    });

    it('should expand icon existed by default', () => {
      const titleIcon = hostElement.querySelector('[data-icon-name]');

      expect(titleIcon?.getAttribute('data-icon-name')).toBe(
        ChevronRightIcon.name,
      );
    });

    describe('Keyboard Event', () => {
      it('should `Enter` keyboard event toggle Accordion to open', async () => {
        const title = hostElement.querySelector('[class*="accordion__title"]');
        const clickTarget =
          hostElement.querySelector('[class*="title-main-part"]') ||
          hostElement.querySelector('button') ||
          title;

        await act(async () => {
          fireEvent.keyDown(clickTarget!, { code: 'Enter', key: 'Enter' });
        });

        expect(title?.getAttribute('aria-expanded')).toBe('true');
      });

      it('should keyboard events been ignored except `Enter`', async () => {
        const title = hostElement.querySelector('[class*="accordion__title"]');
        const clickTarget =
          hostElement.querySelector('[class*="title-main-part"]') ||
          hostElement.querySelector('button') ||
          title;

        await act(async () => {
          fireEvent.keyDown(clickTarget!, {
            code: 'ArrowDown',
            key: 'ArrowDown',
          });
          fireEvent.keyDown(clickTarget!, {
            code: 'ArrowUp',
            key: 'ArrowUp',
          });
          fireEvent.keyDown(clickTarget!, {
            code: 'ArrowRight',
            key: 'ArrowRight',
          });
          fireEvent.keyDown(clickTarget!, {
            code: 'ArrowLeft',
            key: 'ArrowLeft',
          });
          fireEvent.keyDown(clickTarget!, { code: 'Tab', key: 'Tab' });
        });

        expect(title?.getAttribute('aria-expanded')).toBe('false');
      });
    });
  });

  describe('Accordion disabled', () => {
    let hostElement: HTMLElement;

    beforeEach(() => {
      const { getHostHTMLElement } = render(
        <Accordion disabled>
          <AccordionTitle id="accordion-1">test</AccordionTitle>
          <AccordionContent>content</AccordionContent>
        </Accordion>,
      );

      hostElement = getHostHTMLElement();
    });

    it('should title disabled classes been applied', () => {
      const title = hostElement.querySelector('[class*="accordion__title"]');
      const titleIcon = hostElement.querySelector('[data-icon-name]');

      expect(title?.className).toMatch(/disabled/);
      expect(titleIcon?.className).toMatch(/disabled/);
    });

    it('should not expanded when title clicked', async () => {
      const title = hostElement.querySelector('[class*="accordion__title"]');
      const clickTarget =
        hostElement.querySelector('[class*="title-main-part"]') ||
        hostElement.querySelector('button') ||
        title;

      await act(async () => {
        fireEvent.click(clickTarget!);
      });

      expect(title?.getAttribute('aria-expanded')).toBe('false');
    });

    it('should not expanded when keyboard event triggered', async () => {
      const title = hostElement.querySelector('[class*="accordion__title"]');
      const clickTarget =
        hostElement.querySelector('[class*="title-main-part"]') ||
        hostElement.querySelector('button') ||
        title;

      await act(async () => {
        fireEvent.keyDown(clickTarget!, { code: 'Enter', key: 'Enter' });
      });

      expect(title?.getAttribute('aria-expanded')).toBe('false');
    });
  });
});
