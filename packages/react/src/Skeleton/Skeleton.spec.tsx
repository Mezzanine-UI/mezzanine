import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import Skeleton from '.';
import { TypographySemanticType } from '../Typography';

describe('<Skeleton />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Skeleton className={className} />),
  );

  describe('prop: variant', () => {
    it('should render strip skeleton with body variant', () => {
      const { getHostHTMLElement } = render(
        <Skeleton variant="body" width={200} />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-skeleton--strip--body'),
      ).toBeTruthy();
      expect(element.querySelector('span')).toBeTruthy();
      expect(
        element.querySelector('span')?.classList.contains('mzn-skeleton--bg'),
      ).toBeTruthy();
    });

    it('should render strip skeleton with different typography variants', () => {
      const variants: TypographySemanticType[] = [
        'h1',
        'h2',
        'h3',
        'body',
        'button',
        'caption',
      ] as const;

      variants.forEach((variant) => {
        const { getHostHTMLElement } = render(<Skeleton variant={variant} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-skeleton--strip--${variant}`),
        ).toBeTruthy();
      });
    });
  });

  describe('prop: circle', () => {
    it('should render circle skeleton', () => {
      const { getHostHTMLElement } = render(
        <Skeleton circle height={40} width={40} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-skeleton--circle')).toBeTruthy();
      expect(element.classList.contains('mzn-skeleton--bg')).toBeTruthy();
      expect(element.querySelector('span')).toBeFalsy();
    });
  });

  describe('prop: height', () => {
    it('should render rectangle skeleton when height is specified', () => {
      const { getHostHTMLElement } = render(
        <Skeleton height={100} width={200} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-skeleton--bg')).toBeTruthy();
      expect(element.querySelector('span')).toBeFalsy();
      expect(element.style.height).toBe('100px');
    });

    it('should render rectangle skeleton when height is string', () => {
      const { getHostHTMLElement } = render(
        <Skeleton height="50%" width="100%" />,
      );
      const element = getHostHTMLElement();

      expect(element.style.height).toBe('50%');
    });
  });

  describe('prop: width', () => {
    it('should apply width style', () => {
      const { getHostHTMLElement } = render(
        <Skeleton variant="body" width={150} />,
      );
      const element = getHostHTMLElement();

      expect(element.style.width).toBe('150px');
    });

    it('should apply percentage width', () => {
      const { getHostHTMLElement } = render(
        <Skeleton variant="body" width="75%" />,
      );
      const element = getHostHTMLElement();

      expect(element.style.width).toBe('75%');
    });
  });

  describe('priority logic', () => {
    it('should ignore variant when height is specified', () => {
      const { getHostHTMLElement } = render(
        <Skeleton height={100} variant="body" />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-skeleton--strip--body'),
      ).toBeFalsy();
      expect(element.classList.contains('mzn-skeleton--bg')).toBeTruthy();
    });

    it('should ignore variant when circle is true', () => {
      const { getHostHTMLElement } = render(
        <Skeleton circle height={40} variant="body" width={40} />,
      );
      const element = getHostHTMLElement();

      expect(
        element.classList.contains('mzn-skeleton--strip--body'),
      ).toBeFalsy();
      expect(element.classList.contains('mzn-skeleton--circle')).toBeTruthy();
    });
  });

  describe('default behavior', () => {
    it('should render rectangle skeleton by default without props', () => {
      const { getHostHTMLElement } = render(<Skeleton />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-skeleton--bg')).toBeTruthy();
      expect(element.querySelector('span')).toBeFalsy();
    });
  });

  describe('custom style', () => {
    it('should merge custom styles', () => {
      const customStyle = { backgroundColor: 'red', margin: '10px' };
      const { getHostHTMLElement } = render(
        <Skeleton height={100} style={customStyle} width={200} />,
      );
      const element = getHostHTMLElement();

      expect(element.style.backgroundColor).toBe('red');
      expect(element.style.margin).toBe('10px');
      expect(element.style.height).toBe('100px');
      expect(element.style.width).toBe('200px');
    });
  });
});
