import { cleanup, render } from '../../__test-utils__';
import { CopyIcon } from '@mezzanine-ui/icons';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { DescriptionContent } from '.';

describe('<DescriptionContent />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<DescriptionContent ref={ref}>content</DescriptionContent>),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <DescriptionContent className={className}>content</DescriptionContent>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <DescriptionContent>content</DescriptionContent>,
    );
    const element = getHostHTMLElement();

    expect(element!.classList.contains('mzn-description-content')).toBeTruthy();
  });

  describe('prop: size', () => {
    it('default size is "main"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent>content</DescriptionContent>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-content--main'),
      ).toBeTruthy();
    });

    it('when size is "sub"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent size="sub">content</DescriptionContent>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-content--sub'),
      ).toBeTruthy();
    });
  });

  describe('prop: variant', () => {
    it('default variant is "normal"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent>content</DescriptionContent>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-content--normal'),
      ).toBeTruthy();
    });

    it('when variant is "statistic"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent variant="statistic">content</DescriptionContent>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-content--statistic'),
      ).toBeTruthy();
    });

    it('when variant is "trend-up"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent variant="trend-up">content</DescriptionContent>,
      );
      const element = getHostHTMLElement();
      const [iconElement] = element.getElementsByTagName('i');

      expect(iconElement.getAttribute('data-icon-name')).toBe('caret-up');
    });

    it('when variant is "trend-down"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent variant="trend-down">content</DescriptionContent>,
      );
      const element = getHostHTMLElement();
      const [iconElement] = element.getElementsByTagName('i');

      expect(iconElement.getAttribute('data-icon-name')).toBe('caret-down');
    });

    it('when variant is "with-icon"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionContent
          variant="with-icon"
          icon={CopyIcon}
          onClickIcon={() => {
            // eslint-disable-next-line no-console
            console.log('click');
          }}
        >
          content
        </DescriptionContent>,
      );
      const element = getHostHTMLElement();
      const [iconElement] = element.getElementsByTagName('i');

      expect(
        iconElement!.classList.contains('mzn-description-content__icon'),
      ).toBeTruthy();
      expect(iconElement.style.getPropertyValue('--mzn-icon-cursor')).toBe(
        'pointer',
      );
    });
  });
});
