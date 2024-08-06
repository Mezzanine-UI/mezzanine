import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import Skeleton from '.';

describe('<Skeleton />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Skeleton className={className} />),
  );

  describe('prop: type', () => {
    it('should render circle skeleton', () => {
      const { getHostHTMLElement } = render(
        <Skeleton type="circle" width={40} height={40} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-skeleton--circle')).toBeTruthy();
    });
  });
});
