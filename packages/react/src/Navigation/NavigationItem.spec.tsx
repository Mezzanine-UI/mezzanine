import { PlusIcon } from '@mezzanine-ui/icons';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import NavigationItem from './NavigationItem';

describe('<NavigationItem />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(<NavigationItem ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<NavigationItem className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<NavigationItem />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-navigation-item')).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should render children under the title element', () => {
      const testChildren = 'foo';

      const { getHostHTMLElement } = render(
        <NavigationItem>{testChildren}</NavigationItem>,
      );

      const element = getHostHTMLElement();

      expect(element.textContent).toBe(testChildren);
    });
  });

  describe('prop: active', () => {
    it('should bind active class', () => {
      const { getHostHTMLElement } = render(<NavigationItem active />);
      const element = getHostHTMLElement();

      expect(element.classList).toContain('mzn-navigation-item--active');
    });
  });

  describe('prop: eventKey, onClick', () => {
    it('should trigger onClick and pass eventKey', () => {
      const eventKey = '1';
      const onClick = jest.fn();

      const { getHostHTMLElement } = render(
        <NavigationItem onClick={onClick} eventKey={eventKey} />,
      );
      const element = getHostHTMLElement();

      fireEvent.click(element);

      expect(onClick).toHaveBeenCalled();
      expect(onClick.mock.calls[0][0]).toBe(eventKey);
    });
  });

  describe('prop: icon', () => {
    it('should render suffix icon', () => {
      const itemChildren = 'foo';
      const { getHostHTMLElement } = render(
        <NavigationItem icon={PlusIcon}>{itemChildren}</NavigationItem>,
      );
      const element = getHostHTMLElement();
      const { firstElementChild: iconElement } = element;

      expect(iconElement?.tagName.toLowerCase()).toBe('i');
      expect(element?.textContent).toBe(itemChildren);
    });
  });
});
