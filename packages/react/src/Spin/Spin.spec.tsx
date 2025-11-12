import { SpinnerIcon } from '@mezzanine-ui/icons';
import { act, cleanupHook, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import Spin from '.';
import { resetPortals } from '../Portal/portalRegistry';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
} as any;

describe('<Spin />', () => {
  beforeEach(() => {
    // Clean up portal containers
    document.getElementById('mzn-alert-container')?.remove();
    document.getElementById('mzn-portal-container')?.remove();
    resetPortals();
  });

  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Spin ref={ref} loading />),
  );

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <Spin ref={ref} loading>
        test
      </Spin>,
    ),
  );

  describe('prop: loading', () => {
    it('should render null when loading is false', () => {
      const { getHostHTMLElement } = render(<Spin />);

      const host = getHostHTMLElement();

      expect(host).toBe(null);
    });

    it('should render spinner when loading is true', () => {
      const { getHostHTMLElement } = render(<Spin loading />);

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-spin__spin__icon');

      expect(icon?.getAttribute('data-icon-name')).toBe(SpinnerIcon.name);
    });
  });

  describe('prop: description', () => {
    it('should render description content when provided', () => {
      const { getHostHTMLElement } = render(
        <Spin description="loading" loading />,
      );

      const host = getHostHTMLElement();
      const description = host.querySelector('.mzn-spin__spin__description');

      expect(description?.innerHTML).toBe('loading');
    });

    it('should not render description when not provided', () => {
      const { getHostHTMLElement } = render(<Spin loading />);

      const host = getHostHTMLElement();
      const description = host.querySelector('.mzn-spin__spin__description');

      expect(description).toBeNull();
    });

    it('should apply custom descriptionClassName', () => {
      const { getHostHTMLElement } = render(
        <Spin
          description="loading"
          descriptionClassName="custom-description"
          loading
        />,
      );

      const host = getHostHTMLElement();
      const description = host.querySelector('.mzn-spin__spin__description');

      expect(description?.classList.contains('custom-description')).toBe(true);
    });
  });

  describe('prop: size', () => {
    it('should apply main size by default', () => {
      const { getHostHTMLElement } = render(<Spin loading />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-spin__spin--main')).toBe(true);
    });

    it('should apply sub size when size="sub"', () => {
      const { getHostHTMLElement } = render(<Spin loading size="sub" />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-spin__spin--sub')).toBe(true);
    });

    it('should apply minor size when size="minor"', () => {
      const { getHostHTMLElement } = render(<Spin loading size="minor" />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-spin__spin--minor')).toBe(true);
    });
  });

  describe('prop: stretch', () => {
    it('should apply stretch class when stretch is true in basic mode', () => {
      const { getHostHTMLElement } = render(<Spin loading stretch />);

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-spin__spin')).toBe(true);
      expect(host.classList.contains('mzn-spin--stretch')).toBe(true);
    });

    it('should apply stretch class to host when nested and stretch is true', async () => {
      const { getHostHTMLElement } = render(
        <Spin loading stretch>
          test
        </Spin>,
      );

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-spin--stretch')).toBe(true);
    });
  });

  describe('prop: iconProps', () => {
    it('should apply custom icon size', () => {
      const { getHostHTMLElement } = render(
        <Spin iconProps={{ size: 48 }} loading />,
      );

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-spin__spin__icon');

      expect(icon?.getAttribute('style')).toContain('font-size: 48px');
    });

    it('should apply custom icon className', () => {
      const { getHostHTMLElement } = render(
        <Spin iconProps={{ className: 'custom-icon' }} loading />,
      );

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-spin__spin__icon');

      expect(icon?.classList.contains('custom-icon')).toBe(true);
    });

    it('should apply custom icon color', () => {
      const { getHostHTMLElement } = render(
        <Spin iconProps={{ color: 'brand' }} loading />,
      );

      const host = getHostHTMLElement();
      const icon = host.querySelector('.mzn-spin__spin__icon');

      // Icon color 會透過 CSS variable 設定，檢查 class 是否存在
      expect(icon?.classList.contains('mzn-icon--color')).toBe(true);
    });
  });

  describe('Nested mode', () => {
    it('should render host container when has children', async () => {
      const { getHostHTMLElement } = render(<Spin loading>test</Spin>);

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();

      expect(host.classList.contains('mzn-spin')).toBe(true);
    });

    it('should render overlay as background', async () => {
      const { getHostHTMLElement } = render(<Spin loading>test</Spin>);

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay');

      expect(overlay).toBeInstanceOf(HTMLDivElement);
    });

    it('should render overlay with light variant', async () => {
      const { getHostHTMLElement } = render(<Spin loading>test</Spin>);

      await act(async () => {
        // Wait for render
      });

      const host = getHostHTMLElement();
      const overlay = host.querySelector('.mzn-overlay__backdrop--light');

      expect(overlay).toBeInstanceOf(HTMLDivElement);
    });

    it('should render children', async () => {
      const { getHostHTMLElement } = render(
        <Spin loading>
          <div className="test-child">test content</div>
        </Spin>,
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
        <Spin loading overlayProps={{ className: 'custom-overlay' }}>
          test
        </Spin>,
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
