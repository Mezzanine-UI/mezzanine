import {
  cleanup,
  render,
} from '../../__test-utils__';
import {
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Card from '.';

describe('<Card />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Card className={className} />),
  );

  it('should bind content class', () => {
    const { getHostHTMLElement } = render(<Card>No Data</Card>);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-badge')).toBeTruthy();
  });
});
