import { CheckIcon } from '@mezzanine-ui/icons';
import { cleanup, render, fireEvent } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { MenuItem } from '.';

describe('<MenuItem />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(<MenuItem ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<MenuItem className={className} />),
  );

  it('should wrap children by label which rendered by div', () => {
    const { getHostHTMLElement } = render(<MenuItem>foo</MenuItem>);
    const element = getHostHTMLElement();
    const { firstElementChild: labelElement } = element;

    expect(
      labelElement?.classList.contains('mzn-menu-item__label'),
    ).toBeTruthy();
    expect(labelElement?.tagName.toLowerCase()).toBe('div');
  });

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
      const { getHostHTMLElement } = render(<MenuItem>foo</MenuItem>);
      const element = getHostHTMLElement();

      testActive(element, false);
    });

    [false, true].forEach((active) => {
      const message = active
        ? 'should add active class and render active icon'
        : 'should not add active class and not render active icon';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <MenuItem active={active}>foo</MenuItem>,
        );
        const element = getHostHTMLElement();

        testActive(element, active);
      });
    });
  });

  describe('prop: disabled', () => {
    function testDisabled(element: HTMLElement, disabled: boolean) {
      expect(element.getAttribute('aria-disabled')).toBe(`${disabled}`);
      expect(element.classList.contains('mzn-menu-item--disabled')).toBe(
        disabled,
      );
    }

    it('should render disabled=false by default', () => {
      const { getHostHTMLElement } = render(<MenuItem>foo</MenuItem>);
      const element = getHostHTMLElement();

      testDisabled(element, false);
    });

    [false, true].forEach((disabled) => {
      const message = disabled
        ? 'should add disabled class and aria-disabled attribute'
        : 'should not add disabled class and aria-disabled attribute';

      it(message, () => {
        const { getHostHTMLElement } = render(
          <MenuItem disabled={disabled}>foo</MenuItem>,
        );
        const element = getHostHTMLElement();

        testDisabled(element, disabled);
      });
    });
  });

  describe('prop: onClick', () => {
    it('should be fired on click event', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <MenuItem onClick={onClick}>foo</MenuItem>,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not be fired if disabled=true', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <MenuItem disabled onClick={onClick}>
          foo
        </MenuItem>,
      );

      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toHaveBeenCalledTimes(0);
    });
  });

  describe('prop: role', () => {
    it('should render role="menuitem" by default', () => {
      const { getHostHTMLElement } = render(<MenuItem />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe('menuitem');
    });

    it('should override original role', () => {
      const role = 'option';
      const { getHostHTMLElement } = render(<MenuItem role={role} />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('role')).toBe(role);
    });
  });
});
