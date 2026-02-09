import { SeparatorOrientation } from '@mezzanine-ui/core/separator';
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
    });

    const orientations: SeparatorOrientation[] = ['horizontal', 'vertical'];

    orientations.forEach((orientation) => {
      it(`should add class if orientation="${orientation}"`, () => {
        const { getHostHTMLElement } = render(<Separator orientation={orientation} />);
        const element = getHostHTMLElement();

        expect(
          element.classList.contains(`mzn-separator--${orientation}`),
        ).toBeTruthy();
      });
    });
  });
});

