import { cleanup, render, act, fireEvent } from '../../__test-utils__';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { DescriptionTitle } from '.';

function getPopperContainer(container: Element | null = document.body) {
  return container!.querySelector('div[data-popper-placement]');
}

describe('<DescriptionTitle />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<DescriptionTitle ref={ref}>title</DescriptionTitle>),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<DescriptionTitle className={className}>title</DescriptionTitle>),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <DescriptionTitle>title</DescriptionTitle>,
    );
    const element = getHostHTMLElement();

    expect(element!.classList.contains('mzn-description-title')).toBeTruthy();
  });

  it('badge should be set when badge prop is given', () => {
    const { getHostHTMLElement } = render(
      <DescriptionTitle badge="dot-success">title</DescriptionTitle>,
    );
    const element = getHostHTMLElement();

    expect(
      element.firstElementChild!.classList.contains('mzn-badge__container'),
    ).toBeTruthy();
  });

  it('icon and tooltip should be set when icon and tooltip props are given', async () => {
    const { getHostHTMLElement } = render(
      <DescriptionTitle icon={QuestionOutlineIcon} tooltip="Hello">
        title
      </DescriptionTitle>,
    );
    const element = getHostHTMLElement();
    const [iconElement] = element.getElementsByTagName('i');

    expect(iconElement!.classList.contains('mzn-icon')).toBeTruthy();

    await act(async () => {
      fireEvent.mouseEnter(iconElement);
    });

    const popperElement = getPopperContainer();

    expect(popperElement?.textContent).toBe('Hello');
  });

  describe('prop: widthType', () => {
    it('default widthType is "stretch"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionTitle>title</DescriptionTitle>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-title--stretch'),
      ).toBeTruthy();
    });

    it('when widthType is "narrow"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionTitle widthType="narrow">title</DescriptionTitle>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-title--narrow'),
      ).toBeTruthy();
    });

    it('when widthType is "wide"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionTitle widthType="wide">title</DescriptionTitle>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-title--wide'),
      ).toBeTruthy();
    });

    it('when widthType is "hug"', () => {
      const { getHostHTMLElement } = render(
        <DescriptionTitle widthType="hug">title</DescriptionTitle>,
      );
      const element = getHostHTMLElement();

      expect(
        element!.classList.contains('mzn-description-title--hug'),
      ).toBeTruthy();
    });
  });
});
