import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { MenuDivider } from '.';

describe('<MenuDivider />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLHRElement,
    (ref) => render(<MenuDivider ref={ref} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<MenuDivider className={className} />),
  );

  it('should be rendered by <hr />', () => {
    const { getHostHTMLElement } = render(<MenuDivider />);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('hr');
  });
});
