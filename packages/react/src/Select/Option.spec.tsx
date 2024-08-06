import { CheckIcon } from '@mezzanine-ui/icons';
import { cleanupHook, render } from '../../__test-utils__';
import { describeForwardRefToHTMLElement } from '../../__test-utils__/common';
import { Option } from '.';

describe('<Option />', () => {
  afterEach(cleanupHook);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(
      <Option ref={ref} value="1">
        foo
      </Option>,
    ),
  );

  describe('prop: active', () => {
    function testActive(element: HTMLElement, active: boolean) {
      const { lastElementChild: activeIconElement } = element;

      expect(element.classList.contains('mzn-menu-item--active')).toBe(active);

      if (active) {
        expect(activeIconElement?.tagName.toLowerCase()).toBe('i');
        expect(activeIconElement?.getAttribute('data-icon-name')).toBe(
          CheckIcon.name,
        );
      } else {
        expect(activeIconElement?.tagName.toLowerCase()).not.toBe('i');
      }
    }

    it('should render active=false by default', () => {
      const { getHostHTMLElement } = render(<Option value="1">foo</Option>);
      const element = getHostHTMLElement();

      testActive(element, false);
    });

    [false, true].forEach((active) => {
      const message = active
        ? 'should add active class and render active icon'
        : 'should not add active class and not render active icon';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <Option active={active} value="1">
            foo
          </Option>,
        );
        const element = getHostHTMLElement();

        testActive(element, active);
      });
    });
  });

  describe('props: role', () => {
    it('should render role="option" by default', () => {
      const { getHostHTMLElement } = render(<Option value="1">foo</Option>);
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe('option');
    });

    it('should override original role', () => {
      const role = 'menuitem';
      const { getHostHTMLElement } = render(
        <Option role={role} value="1">
          foo
        </Option>,
      );
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe(role);
    });
  });
});
