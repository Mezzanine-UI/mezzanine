import { ChevronRightIcon } from '@mezzanine-ui/icons';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Accordion, {
  AccordionActions,
  AccordionContent,
  AccordionTitle,
} from '.';
import Button from '../Button';

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

  describe('actions', () => {
    describe('prop-based API', () => {
      it('should render actions from actions prop', () => {
        const { getHostHTMLElement } = render(
          <Accordion>
            <AccordionTitle
              actions={{
                children: <Button>Action Button</Button>,
              }}
              id="accordion-1"
            >
              test
            </AccordionTitle>
            <AccordionContent>content</AccordionContent>
          </Accordion>,
        );

        const hostElement = getHostHTMLElement();
        const buttons = hostElement.querySelectorAll('.mzn-button');

        expect(buttons.length).toBeGreaterThanOrEqual(1);

        const actionButton = Array.from(buttons).find(
          (btn) => btn.textContent === 'Action Button',
        );

        expect(actionButton).toBeInstanceOf(HTMLElement);
      });

      it('should render multiple actions from actions prop', () => {
        const { getHostHTMLElement } = render(
          <Accordion>
            <AccordionTitle
              actions={{
                children: (
                  <>
                    <Button>Edit</Button>
                    <Button color="error">Delete</Button>
                  </>
                ),
              }}
              id="accordion-1"
            >
              test
            </AccordionTitle>
            <AccordionContent>content</AccordionContent>
          </Accordion>,
        );

        const hostElement = getHostHTMLElement();
        const buttons = hostElement.querySelectorAll('.mzn-button');
        const buttonTexts = Array.from(buttons).map((btn) => btn.textContent);

        expect(buttonTexts).toContain('Edit');
        expect(buttonTexts).toContain('Delete');
      });
    });

    describe('children-based API', () => {
      it('should render AccordionActions as children', () => {
        const { getHostHTMLElement } = render(
          <Accordion>
            <AccordionTitle id="accordion-1">
              test
              <AccordionActions>
                <Button>Action Button</Button>
              </AccordionActions>
            </AccordionTitle>
            <AccordionContent>content</AccordionContent>
          </Accordion>,
        );

        const hostElement = getHostHTMLElement();
        const buttons = hostElement.querySelectorAll('.mzn-button');

        const actionButton = Array.from(buttons).find(
          (btn) => btn.textContent === 'Action Button',
        );

        expect(actionButton).toBeInstanceOf(HTMLElement);
      });

      it('should render multiple actions in AccordionActions', () => {
        const { getHostHTMLElement } = render(
          <Accordion>
            <AccordionTitle id="accordion-1">
              test
              <AccordionActions>
                <Button>Edit</Button>
                <Button color="error">Delete</Button>
              </AccordionActions>
            </AccordionTitle>
            <AccordionContent>content</AccordionContent>
          </Accordion>,
        );

        const hostElement = getHostHTMLElement();
        const buttons = hostElement.querySelectorAll('.mzn-button');
        const buttonTexts = Array.from(buttons).map((btn) => btn.textContent);

        expect(buttonTexts).toContain('Edit');
        expect(buttonTexts).toContain('Delete');
      });
    });

    describe('actions click behavior', () => {
      it('should not toggle accordion when action button is clicked', async () => {
        const onActionClick = jest.fn();

        const { getHostHTMLElement } = render(
          <Accordion>
            <AccordionTitle id="accordion-1">
              test
              <AccordionActions>
                <Button onClick={onActionClick}>Action</Button>
              </AccordionActions>
            </AccordionTitle>
            <AccordionContent>content</AccordionContent>
          </Accordion>,
        );

        const hostElement = getHostHTMLElement();
        const title = hostElement.querySelector('[class*="accordion__title"]');
        const buttons = hostElement.querySelectorAll('.mzn-button');
        const actionButton = Array.from(buttons).find(
          (btn) => btn.textContent === 'Action',
        );

        await act(async () => {
          fireEvent.click(actionButton!);
        });

        expect(onActionClick).toHaveBeenCalledTimes(1);
        expect(title?.getAttribute('aria-expanded')).toBe('false');
      });
    });

    describe('actions prop priority', () => {
      it('should prioritize actions prop over AccordionActions children', () => {
        const { getHostHTMLElement } = render(
          <Accordion>
            <AccordionTitle
              actions={{
                children: <Button>Prop Action</Button>,
              }}
              id="accordion-1"
            >
              test
              <AccordionActions>
                <Button>Children Action</Button>
              </AccordionActions>
            </AccordionTitle>
            <AccordionContent>content</AccordionContent>
          </Accordion>,
        );

        const hostElement = getHostHTMLElement();
        const buttons = hostElement.querySelectorAll('.mzn-button');
        const buttonTexts = Array.from(buttons).map((btn) => btn.textContent);

        expect(buttonTexts).toContain('Prop Action');
        expect(buttonTexts).not.toContain('Children Action');
      });
    });
  });
});
