import { cleanup, render } from '../../__test-utils__';
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
});
