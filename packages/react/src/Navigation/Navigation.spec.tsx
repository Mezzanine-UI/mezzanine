import {
  cleanup,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import Navigation from './Navigation';
import NavigationItem from './NavigationItem';
import NavigationSubMenu from './NavigationSubMenu';

describe('<Navigation />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLUListElement,
    (ref) => render(<Navigation ref={ref} />));

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Navigation className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Navigation />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-navigation')).toBeTruthy();
  });

  describe('prop: children', () => {
    it('should render `NavigationItem` children', () => {
      const onClick = jest.fn();
      const itemKey = '1';
      const itemChildren = 'foo';
      const testRenderer = TestRenderer.create(
        <Navigation
          activeKey={itemKey}
          onClick={onClick}
        >
          <NavigationItem
            key={itemKey}
          >
            {itemChildren}
          </NavigationItem>
        </Navigation>,
      );

      const testInstance = testRenderer.root;

      const item = testInstance.findByType(NavigationItem);

      expect(item).toBeTruthy();
      expect(item.props.eventKey).toBe(itemKey);
      expect(item.props.active).toBeTruthy();
    });

    it('should render `NavigationSubMenu` children', () => {
      const itemKey = '1';

      const itemChildren = 'foo';

      const testRenderer = TestRenderer.create(
        <Navigation activeKey={itemKey}>
          <NavigationSubMenu>
            <NavigationItem key={itemKey}>
              {itemChildren}
            </NavigationItem>
          </NavigationSubMenu>
        </Navigation>,
      );

      const testInstance = testRenderer.root;

      const subMenu = testInstance.findByType(NavigationSubMenu);

      expect(subMenu).toBeTruthy();
      expect(subMenu.props.active).toBeTruthy();
    });
  });
});
