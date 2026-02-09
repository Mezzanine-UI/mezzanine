import Separator from '.';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

describe('<Separator />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLHRElement, (ref) =>
    render(<Separator ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Separator className={className} />),
  );

  describe('prop: orientation', () => {
    it('should render orientation="horizontal" by default', () => {
      const { getHostHTMLElement } = render(<Separator />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-separator--horizontal')).toBeTruthy();
      expect(element.classList.contains('mzn-separator--vertical')).toBeFalsy();
      expect(element.getAttribute('aria-orientation')).toBeNull();
    });

    it('should set aria-orientation="vertical" when orientation is vertical', () => {
      const { getHostHTMLElement } = render(<Separator orientation="vertical" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-separator--vertical')).toBeTruthy();
      expect(element.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('should not set aria-orientation when orientation is horizontal', () => {
      const { getHostHTMLElement } = render(<Separator orientation="horizontal" />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-separator--horizontal')).toBeTruthy();
      expect(element.getAttribute('aria-orientation')).toBeNull();
    });

    it('aria-orientation from props should not override orientation prop', () => {
      const { getHostHTMLElement } = render(
        <Separator aria-orientation="horizontal" orientation="vertical" />,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-orientation')).toBe('vertical');
      expect(element.classList.contains('mzn-separator--vertical')).toBeTruthy();
    });
  });
});

