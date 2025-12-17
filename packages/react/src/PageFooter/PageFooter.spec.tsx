import { cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { DotVerticalIcon } from '@mezzanine-ui/icons';
import PageFooter from '.';

describe('<PageFooter />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(
      <PageFooter
        actions={{
          primaryButton: { children: 'Confirm' },
        }}
        ref={ref}
      />,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <PageFooter
        actions={{
          primaryButton: { children: 'Confirm' },
        }}
        className={className}
      />,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <PageFooter
        actions={{
          primaryButton: { children: 'Confirm' },
        }}
      />,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-page-footer')).toBeTruthy();
  });

  describe('prop: actions', () => {
    it('should render primary button', () => {
      const { getHostHTMLElement } = render(
        <PageFooter
          actions={{
            primaryButton: { children: 'Submit' },
          }}
        />,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');

      expect(buttons.length).toBeGreaterThanOrEqual(1);
      expect(buttons[buttons.length - 1].textContent).toBe('Submit');
    });

    it('should render both primary and secondary buttons', () => {
      const { getHostHTMLElement } = render(
        <PageFooter
          actions={{
            primaryButton: { children: 'Confirm' },
            secondaryButton: { children: 'Cancel' },
          }}
        />,
      );
      const element = getHostHTMLElement();
      const buttonGroup = element.querySelector('.mzn-button-group');
      const buttons = buttonGroup!.querySelectorAll('button');

      expect(buttons).toHaveLength(2);
      expect(buttons[0].textContent).toBe('Cancel');
      expect(buttons[1].textContent).toBe('Confirm');
    });

    it('should use default text "Button" when primary button has no children', () => {
      const { getHostHTMLElement } = render(
        <PageFooter
          actions={{
            primaryButton: {},
          }}
        />,
      );
      const element = getHostHTMLElement();
      const buttonGroup = element.querySelector('.mzn-button-group');
      const button = buttonGroup!.querySelector('button');

      expect(button!.textContent).toBe('Button');
    });
  });

  describe('prop: type and annotation', () => {
    describe('standard type', () => {
      it('should render annotation as a ghost button', () => {
        const { getHostHTMLElement } = render(
          <PageFooter
            type="standard"
            actions={{
              primaryButton: { children: 'Confirm' },
            }}
            annotation="View History"
          />,
        );
        const element = getHostHTMLElement();
        const annotationElement = element.querySelector(
          '.mzn-page-footer__annotation',
        );
        const button = annotationElement!.querySelector('button');

        expect(button).toBeInstanceOf(HTMLButtonElement);
        expect(button!.textContent).toBe('View History');
        expect(
          button!.classList.contains('mzn-button--base-ghost'),
        ).toBeTruthy();
      });

      it('should call onAnnotationClick when button is clicked', () => {
        const onClick = jest.fn();
        const { getHostHTMLElement } = render(
          <PageFooter
            type="standard"
            actions={{
              primaryButton: { children: 'Confirm' },
            }}
            annotation="View History"
            onAnnotationClick={onClick}
          />,
        );
        const element = getHostHTMLElement();
        const annotationElement = element.querySelector(
          '.mzn-page-footer__annotation',
        );
        const button = annotationElement!.querySelector('button');

        fireEvent.click(button!);

        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('overflow type', () => {
      it('should render annotation as an icon-only ghost button', () => {
        const { getHostHTMLElement } = render(
          <PageFooter
            type="overflow"
            actions={{
              primaryButton: { children: 'Confirm' },
            }}
            annotation={{
              position: 'icon-only',
              src: DotVerticalIcon,
            }}
          />,
        );
        const element = getHostHTMLElement();
        const annotationElement = element.querySelector(
          '.mzn-page-footer__annotation',
        );
        const button = annotationElement!.querySelector('button');

        expect(button).toBeInstanceOf(HTMLButtonElement);
        expect(
          button!.classList.contains('mzn-button--base-ghost'),
        ).toBeTruthy();
        expect(
          button!.classList.contains('mzn-button--icon-only'),
        ).toBeTruthy();
      });

      it('should call onAnnotationClick when button is clicked', () => {
        const onClick = jest.fn();
        const { getHostHTMLElement } = render(
          <PageFooter
            type="overflow"
            actions={{
              primaryButton: { children: 'Confirm' },
            }}
            annotation={{
              position: 'icon-only',
              src: DotVerticalIcon,
            }}
            onAnnotationClick={onClick}
          />,
        );
        const element = getHostHTMLElement();
        const annotationElement = element.querySelector(
          '.mzn-page-footer__annotation',
        );
        const button = annotationElement!.querySelector('button');

        fireEvent.click(button!);

        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('information type', () => {
      it('should render annotation as plain text', () => {
        const { getHostHTMLElement } = render(
          <PageFooter
            type="information"
            actions={{
              primaryButton: { children: 'Confirm' },
            }}
            annotation="Last saved: 5 mins ago"
          />,
        );
        const element = getHostHTMLElement();
        const annotationElement = element.querySelector(
          '.mzn-page-footer__annotation',
        );
        const typography = annotationElement!.querySelector(
          '.mzn-typography--caption',
        );

        expect(typography).toBeInstanceOf(HTMLElement);
        expect(typography!.textContent).toBe('Last saved: 5 mins ago');
        expect(
          typography!.classList.contains('mzn-typography--caption'),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: annotationClassName', () => {
    it('should bind class to the annotation wrapper', () => {
      const className = 'custom-annotation';

      const { getHostHTMLElement } = render(
        <PageFooter
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          annotationClassName={className}
        />,
      );
      const element = getHostHTMLElement();
      const annotationElement = element.querySelector(
        '.mzn-page-footer__annotation',
      );

      expect(annotationElement!.classList.contains(className)).toBeTruthy();
    });
  });

  describe('prop: warningMessage', () => {
    it('should render warning message in the middle section', () => {
      const { getHostHTMLElement } = render(
        <PageFooter
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
          warningMessage="Please review before submitting"
        />,
      );
      const element = getHostHTMLElement();
      const messageElement = element.querySelector('.mzn-page-footer__message');
      const spanElement = messageElement!.querySelector('span');

      expect(spanElement).toBeInstanceOf(HTMLSpanElement);
      expect(spanElement!.textContent).toBe('Please review before submitting');
    });

    it('should not render span when warningMessage is not provided', () => {
      const { getHostHTMLElement } = render(
        <PageFooter
          actions={{
            primaryButton: { children: 'Confirm' },
          }}
        />,
      );
      const element = getHostHTMLElement();
      const messageElement = element.querySelector('.mzn-page-footer__message');
      const spanElement = messageElement!.querySelector('span');

      expect(spanElement).toBe(null);
    });
  });
});
