import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import Skeleton from '.';

describe('<Skeleton />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Skeleton className={className} />),
  );

  describe('prop: variant body', () => {
    it('should render circle skeleton', () => {
      const { getHostHTMLElement } = render(
        <Skeleton variant="body" width={200} />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-skeleton--strip--body'),
      ).toBeTruthy();
    });
  });
  describe('prop: circle', () => {
    it('should render circle skeleton', () => {
      const { getHostHTMLElement } = render(
        <Skeleton circle width={40} height={40} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-skeleton--circle')).toBeTruthy();
    });
  });
});
