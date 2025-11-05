import { SpinnerIcon } from '@mezzanine-ui/icons';
import { act, cleanupHook, render } from '../../__test-utils__';
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

  describe('prop: loading', () => {
    it('should render null when loading is false', () => {
      const { getHostHTMLElement } = render(<Loading />);

      const host = getHostHTMLElement();

      expect(host).toBe(null);
    });

    it('should render spinner when loading is true', () => {
      const { getHostHTMLElement } = render(<Loading loading />);

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-loading__spin__icon');

      expect(icon?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });
  });

  describe('prop: description', () => {
    it('should render description content when provided', () => {
      const { getHostHTMLElement } = render(
        <Loading description="loading" loading />,
      );

      const host = getHostHTMLElement();
      const description = host.querySelector('.mzn-loading__spin__description');

      expect(description?.innerHTML).toBe('loading');
    });

    it('should not render description when not provided', () => {
      const { getHostHTMLElement } = render(<Loading loading />);

      const host = getHostHTMLElement();
      const description = host.querySelector('.mzn-loading__spin__description');

      expect(description).toBeNull();
    });

    it('should apply custom descriptionClassName', () => {
      const { getHostHTMLElement } = render(
        <Loading
          description="loading"
          descriptionClassName="custom-description"
          loading
        />,
      );

      const host = getHostHTMLElement();
      const description = host.querySelector('.mzn-loading__spin__description');

      expect(description?.classList.contains('custom-description')).toBe(true);
    });
  });

  describe('prop: size', () => {
    it('should apply main size by default', () => {
      const { getHostHTMLElement } = render(<Loading loading />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-loading__spin--main')).toBe(true);
    });

    it('should apply sub size when size="sub"', () => {
      const { getHostHTMLElement } = render(<Loading loading size="sub" />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-loading__spin--sub')).toBe(true);
    });

    it('should apply minor size when size="minor"', () => {
      const { getHostHTMLElement } = render(<Loading loading size="minor" />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-loading__spin--minor')).toBe(true);
    });
  });

  describe('prop: stretch', () => {
    it('should apply stretch class when stretch is true in basic mode', () => {
      const { getHostHTMLElement } = render(<Loading loading stretch />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-loading__spin')).toBe(true);
      expect(host.classList.contains('mzn-loading--stretch')).toBe(true);
    });

    it('should apply stretch class to host when nested and stretch is true', async () => {
      const { getHostHTMLElement } = render(
        <Loading loading stretch>
          test
        </Loading>,
      );

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-loading--stretch')).toBe(true);
    });
  });

  describe('prop: iconProps', () => {
    it('should apply custom icon size', () => {
      const { getHostHTMLElement } = render(
        <Loading iconProps={{ size: 48 }} loading />,
      );

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-loading__spin__icon');

      expect(icon?.getAttribute('style')).toContain('font-size: 48px');
    });

    it('should apply custom icon className', () => {
      const { getHostHTMLElement } = render(
        <Loading iconProps={{ className: 'custom-icon' }} loading />,
      );

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-loading__spin__icon');

      expect(icon?.classList.contains('custom-icon')).toBe(true);
    });

    it('should apply custom icon color', () => {
      const { getHostHTMLElement } = render(
        <Loading iconProps={{ color: 'brand' }} loading />,
      );

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-loading__spin__icon');

      // Icon color 會透過 CSS variable 設定，檢查 class 是否存在
      expect(icon?.classList.contains('mzn-icon--color')).toBe(true);
    });
  });

  describe('Nested mode', () => {
    it('should render host container when has children', async () => {
      const { getHostHTMLElement } = render(<Loading loading>test</Loading>);

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-loading')).toBe(true);
    });

    it('should render overlay as background', async () => {
      const { getHostHTMLElement } = render(<Loading loading>test</Loading>);

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay');

      expect(overlay).toBeInstanceOf(HTMLDivElement);
    });

    it('should render overlay with on-surface class', async () => {
      const { getHostHTMLElement } = render(<Loading loading>test</Loading>);

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay__backdrop--on-surface');

      expect(overlay).toBeInstanceOf(HTMLDivElement);
    });

    it('should render children', async () => {
      const { getHostHTMLElement } = render(
        <Loading loading>
          <div className="test-child">test content</div>
        </Loading>,
      );

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();
      const child = host.querySelector('.test-child');

      expect(child?.textContent).toBe('test content');
    });

    it('should pass overlayProps to Overlay component', async () => {
      const { getHostHTMLElement } = render(
        <Loading loading overlayProps={{ className: 'custom-overlay' }}>
          test
        </Loading>,
      );

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay');

      expect(overlay?.classList.contains('custom-overlay')).toBe(true);
    });
  });
});
