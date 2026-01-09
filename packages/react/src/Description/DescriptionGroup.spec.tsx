import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { DescriptionGroup } from '.';

describe('<DescriptionGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <DescriptionGroup ref={ref}>
        <div />
        <div />
      </DescriptionGroup>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <DescriptionGroup className={className}>
        <div />
        <div />
      </DescriptionGroup>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <DescriptionGroup>
        <div />
        <div />
      </DescriptionGroup>,
    );
    const element = getHostHTMLElement();

    expect(element!.classList.contains('mzn-description-group')).toBeTruthy();
  });
});
