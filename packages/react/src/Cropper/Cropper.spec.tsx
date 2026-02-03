import { CropperSize } from '@mezzanine-ui/core/cropper';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Cropper from './Cropper';

describe('<Cropper />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLCanvasElement, (ref) =>
    render(<Cropper ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Cropper className={className} />),
  );

  it('should render as canvas element', () => {
    const { getHostHTMLElement } = render(<Cropper />);
    const element = getHostHTMLElement();

    expect(element.tagName.toLowerCase()).toBe('canvas');
  });

  describe('prop: size', () => {
    it('should render size="main" by default', () => {
      const { getHostHTMLElement } = render(<Cropper />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-cropper--main')).toBeTruthy();
    });

    const sizes: CropperSize[] = ['main', 'sub', 'minor'];

    sizes.forEach((size) => {
      it(`should render size="${size}"`, () => {
        const { getHostHTMLElement } = render(<Cropper size={size} />);
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-cropper--${size}`)).toBeTruthy();
      });
    });
  });

  describe('prop: component', () => {
    it('should render as canvas by default', () => {
      const { getHostHTMLElement } = render(<Cropper />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('canvas');
    });
  });
});

