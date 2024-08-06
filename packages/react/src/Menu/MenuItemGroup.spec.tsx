import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { MenuItemGroup } from '.';

describe('<MenuItemGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLLIElement, (ref) =>
    render(<MenuItemGroup ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<MenuItemGroup className={className} />),
  );

  it('should wrap children by ul', () => {
    const { getHostHTMLElement } = render(
      <MenuItemGroup label="Group A">foo</MenuItemGroup>,
    );
    const element = getHostHTMLElement();
    const { lastElementChild: listElement } = element;

    expect(listElement?.tagName.toLowerCase()).toBe('ul');
    expect(
      listElement?.classList.contains('mzn-menu-item-group__items'),
    ).toBeTruthy();
    expect(listElement?.textContent).toBe('foo');
  });

  describe('prop: label', () => {
    const { getHostHTMLElement } = render(<MenuItemGroup label="Group A" />);
    const element = getHostHTMLElement();
    const { firstElementChild: labelElement } = element;

    expect(labelElement?.tagName.toLowerCase()).toBe('span');
    expect(
      labelElement?.classList.contains('mzn-menu-item-group__label'),
    ).toBeTruthy();
  });
});
