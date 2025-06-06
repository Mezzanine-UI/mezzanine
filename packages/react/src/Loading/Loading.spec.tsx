import { SpinnerIcon } from '@mezzanine-ui/icons';
import { cleanupHook, render, TestRenderer } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Loading from '.';

describe('<Loading />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Loading ref={ref} loading />),
  );

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Loading ref={ref} loading>
        test
      </Loading>,
    ),
  );

  describe('Basic mode', () => {
    it('should render null when loading is false', () => {
      const { getHostHTMLElement } = render(<Loading />);

      const host = getHostHTMLElement();

      expect(host).toBe(null);
    });

    it('should render SpinnerIcon as default when loading is true', () => {
      const { getHostHTMLElement } = render(<Loading loading />);

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-loading__spin__icon');

      expect(icon?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });

    it('should render tip content when given', () => {
      const { getHostHTMLElement } = render(<Loading loading tip="loading" />);

      const host = getHostHTMLElement();
      const tip = host.querySelector('.mzn-loading__spin__tip');

      expect(tip?.innerHTML).toBe('loading');
    });
  });

  describe('Nested mode', () => {
    it('should render overlay as background', () => {
      const { getHostHTMLElement } = render(<Loading loading>test</Loading>);

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay');

      expect(overlay).toBeInstanceOf(HTMLDivElement);
    });

    it('should overlay on-surface class exist', () => {
      const { getHostHTMLElement } = render(<Loading loading>test</Loading>);

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay__backdrop--on-surface');

      expect(overlay).toBeInstanceOf(HTMLDivElement);
    });
  });
});
