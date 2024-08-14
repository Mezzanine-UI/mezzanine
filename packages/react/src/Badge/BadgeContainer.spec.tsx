import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { BadgeContainer } from '.';

describe('<BadgeContainer />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLSpanElement, (ref) =>
    render(<BadgeContainer ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<BadgeContainer className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<BadgeContainer />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-badge__container')).toBeTruthy();
  });
});
