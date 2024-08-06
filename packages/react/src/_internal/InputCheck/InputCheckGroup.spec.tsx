import { cleanup, render } from '../../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../../__test-utils__/common';
import { InputCheckGroup, InputCheckGroupOrientation } from '.';

describe('<InputCheckGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<InputCheckGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<InputCheckGroup className={className} />),
  );

  it('should bind host class and wrap children', () => {
    const { getHostHTMLElement } = render(
      <InputCheckGroup>
        <div data-test="foo" />
      </InputCheckGroup>,
    );
    const element = getHostHTMLElement();
    const { firstElementChild } = element;

    expect(element.classList.contains('mzn-input-check-group')).toBeTruthy();
    expect(firstElementChild!.getAttribute('data-test')).toBe('foo');
  });

  describe('prop: orientation', () => {
    function testOrientation(
      element: HTMLElement,
      orientation: InputCheckGroupOrientation,
    ) {
      expect(
        element.classList.contains(`mzn-input-check-group--${orientation}`),
      ).toBeTruthy();
      expect(element.getAttribute('aria-orientation')).toBe(orientation);
    }

    it('should render size="medium" by default', () => {
      const { getHostHTMLElement } = render(<InputCheckGroup />);
      const element = getHostHTMLElement();

      testOrientation(element, 'horizontal');
    });

    const orientations: InputCheckGroupOrientation[] = [
      'horizontal',
      'vertical',
    ];

    orientations.forEach((orientation) => {
      it(`should add class if orientation="${orientation}"`, () => {
        const { getHostHTMLElement } = render(
          <InputCheckGroup orientation={orientation} />,
        );
        const element = getHostHTMLElement();

        testOrientation(element, orientation);
      });
    });
  });
});
