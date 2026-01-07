import { cleanup, render } from '../../__test-utils__';
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
});
