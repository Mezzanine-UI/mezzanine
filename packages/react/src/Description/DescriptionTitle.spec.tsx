import { cleanup, render } from '../../__test-utils__';
import { QuestionOutlineIcon } from '@mezzanine-ui/icons';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { DescriptionTitle } from '.';

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

  it('icon should be set when icon prop is given', () => {
    const { getHostHTMLElement } = render(
      <DescriptionTitle icon={QuestionOutlineIcon}>title</DescriptionTitle>,
    );
    const element = getHostHTMLElement();
    const [iconElement] = element.getElementsByTagName('i');

    expect(iconElement!.classList.contains('mzn-icon')).toBeTruthy();
  });
});
