import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import Navigation from './Navigation';
import NavigationOptionItem from './NavigationOptionItem';
import NavigationOption from './NavigationOption';

const renderMockNavigationItem = jest.fn();
const renderMockNavigationSubMenu = jest.fn();

jest.mock('./NavigationItem', () => {
  return function MockNavigationItem(props: any) {
    renderMockNavigationItem(props);
    return <div>{props.children}</div>;
  };
});

jest.mock('./NavigationSubMenu', () => {
  return function MockNavigationSubMenu(props: any) {
    renderMockNavigationSubMenu(props);
    return <div>{props.children}</div>;
  };
});

describe('<Navigation />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLUListElement, (ref) =>
    render(<Navigation ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Navigation className={className} />),
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
      render(
        <Navigation activeKey={itemKey} onOptionClick={onClick}>
          <NavigationOptionItem key={itemKey}>
            {itemChildren}
          </NavigationOptionItem>
        </Navigation>,
      );

      expect(renderMockNavigationItem).toHaveBeenCalledWith(
        expect.objectContaining({
          eventKey: itemKey,
          active: true,
        }),
      );
    });

    it('should render `NavigationSubMenu` children', () => {
      const itemKey = '1';

      const itemChildren = 'foo';

      render(
        <Navigation activeKey={itemKey}>
          <NavigationOption>
            <NavigationOptionItem key={itemKey}>
              {itemChildren}
            </NavigationOptionItem>
          </NavigationOption>
        </Navigation>,
      );

      expect(renderMockNavigationSubMenu).toHaveBeenCalledWith(
        expect.objectContaining({
          active: true,
        }),
      );
    });

    it('should allow null/Fragment rendering and render NavigationItem correctly', () => {
      const onClick = jest.fn();
      const itemKey = '1';
      const itemChildren = 'foo';
      render(
        <Navigation activeKey={itemKey} onOptionClick={onClick}>
          {null}
          <>
            <NavigationOptionItem key={itemKey}>
              {itemChildren}
            </NavigationOptionItem>
            test
          </>
        </Navigation>,
      );

      expect(renderMockNavigationItem).toHaveBeenCalledWith(
        expect.objectContaining({
          eventKey: itemKey,
          active: true,
        }),
      );
    });
  });
});
