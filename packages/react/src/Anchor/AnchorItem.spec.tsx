import { anchorClasses } from '@mezzanine-ui/core/anchor';
import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import AnchorItem, { AnchorItemData } from './AnchorItem';

const mockItem: AnchorItemData = {
  href: '#foo',
  id: 'foo',
  name: 'Foo Item',
};

const mockItemWithChildren: AnchorItemData = {
  children: [
    {
      href: '#child-1',
      id: 'child-1',
      name: 'Child 1',
    },
    {
      href: '#child-2',
      id: 'child-2',
      name: 'Child 2',
    },
  ],
  href: '#parent',
  id: 'parent',
  name: 'Parent Item',
};

describe('<AnchorItem />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<AnchorItem className={className} item={mockItem} />),
  );

  it('should bind host class', () => {
    const { container } = render(<AnchorItem item={mockItem} />);
    const element = container.querySelector('a');

    expect(element?.classList.contains(anchorClasses.anchorItem)).toBeTruthy();
  });

  it('should wrap children by anchor tag', () => {
    const { container } = render(<AnchorItem item={mockItem} />);
    const element = container.querySelector('a');

    expect(element?.tagName.toLowerCase()).toBe('a');
    expect(element?.textContent).toBe('Foo Item');
  });

  it('should render with correct href attribute', () => {
    const { container } = render(<AnchorItem item={mockItem} />);
    const element = container.querySelector('a');

    expect(element?.getAttribute('href')).toBe('#foo');
  });

  describe('prop: disabled', () => {
    it('should not have aria-disabled attribute by default', () => {
      const { container } = render(<AnchorItem item={mockItem} />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('aria-disabled')).toBe('false');
      expect(element?.classList.contains(anchorClasses.anchorItemDisabled)).toBe(false);
    });

    it('should have aria-disabled attribute when item.disabled=true', () => {
      const disabledItem = { ...mockItem, disabled: true };
      const { container } = render(<AnchorItem item={disabledItem} />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('aria-disabled')).toBe('true');
      expect(element?.classList.contains(anchorClasses.anchorItemDisabled)).toBe(true);
    });

    it('should have aria-disabled attribute when parentDisabled=true', () => {
      const { container } = render(<AnchorItem item={mockItem} parentDisabled />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('aria-disabled')).toBe('true');
      expect(element?.classList.contains(anchorClasses.anchorItemDisabled)).toBe(true);
    });

    it('should set tabIndex to -1 when disabled', () => {
      const disabledItem = { ...mockItem, disabled: true };
      const { container } = render(<AnchorItem item={disabledItem} />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('tabIndex')).toBe('-1');
    });

    it('should not have tabIndex when not disabled', () => {
      const { container } = render(<AnchorItem item={mockItem} />);
      const element = container.querySelector('a');

      expect(element?.hasAttribute('tabIndex')).toBe(false);
    });
  });

  describe('prop: onClick', () => {
    it('should call item.onClick handler when clicked', () => {
      const onClick = jest.fn();
      const itemWithClick = { ...mockItem, onClick };
      const { container } = render(<AnchorItem item={itemWithClick} />);
      const element = container.querySelector('a');

      element?.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const disabledItem = { ...mockItem, disabled: true, onClick };
      const { container } = render(<AnchorItem item={disabledItem} />);
      const element = container.querySelector('a');

      element?.click();

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when parent is disabled', () => {
      const onClick = jest.fn();
      const itemWithClick = { ...mockItem, onClick };
      const { container } = render(<AnchorItem item={itemWithClick} parentDisabled />);
      const element = container.querySelector('a');

      element?.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('nested children', () => {
    it('should render children when present', () => {
      const { getAllByRole } = render(<AnchorItem item={mockItemWithChildren} />);
      const links = getAllByRole('link');

      expect(links).toHaveLength(3);
      expect(links[0]).toHaveTextContent('Parent Item');
      expect(links[1]).toHaveTextContent('Child 1');
      expect(links[2]).toHaveTextContent('Child 2');
    });

    it('should apply nested class to children container', () => {
      const { container } = render(<AnchorItem item={mockItemWithChildren} />);
      const nestedContainer = container.querySelector(`.${anchorClasses.nested}`);

      expect(nestedContainer).toBeInTheDocument();
    });

    it('should apply level-1 class to level 1 nested items', () => {
      const { container } = render(<AnchorItem item={mockItemWithChildren} level={1} />);
      const level1Items = container.querySelectorAll(`.${anchorClasses.nestedLevel1}`);

      expect(level1Items.length).toBeGreaterThan(0);
    });

    it('should apply level-2 class to level 2 nested items', () => {
      const deepItem: AnchorItemData = {
        children: [
          {
            children: [
              {
                href: '#grandchild',
                id: 'grandchild',
                name: 'Grandchild',
              },
            ],
            href: '#child',
            id: 'child',
            name: 'Child',
          },
        ],
        href: '#parent',
        id: 'parent',
        name: 'Parent',
      };
      const { container } = render(<AnchorItem item={deepItem} level={1} />);
      const level2Items = container.querySelectorAll(`.${anchorClasses.nestedLevel2}`);

      expect(level2Items.length).toBeGreaterThan(0);
    });

    it('should limit children to maximum 3 items', () => {
      const itemWithManyChildren: AnchorItemData = {
        children: [
          { href: '#child-1', id: 'child-1', name: 'Child 1' },
          { href: '#child-2', id: 'child-2', name: 'Child 2' },
          { href: '#child-3', id: 'child-3', name: 'Child 3' },
          { href: '#child-4', id: 'child-4', name: 'Child 4' },
          { href: '#child-5', id: 'child-5', name: 'Child 5' },
        ],
        href: '#parent',
        id: 'parent',
        name: 'Parent',
      };
      const { getAllByRole } = render(<AnchorItem item={itemWithManyChildren} />);
      const links = getAllByRole('link');

      expect(links).toHaveLength(4);
      expect(links[0]).toHaveTextContent('Parent');
      expect(links[1]).toHaveTextContent('Child 1');
      expect(links[2]).toHaveTextContent('Child 2');
      expect(links[3]).toHaveTextContent('Child 3');
    });

    it('should not render children when level reaches MAX_LEVEL (3)', () => {
      const deepItem: AnchorItemData = {
        children: [
          {
            href: '#child',
            id: 'child',
            name: 'Child',
          },
        ],
        href: '#parent',
        id: 'parent',
        name: 'Parent',
      };
      const { getAllByRole } = render(<AnchorItem item={deepItem} level={3} />);
      const links = getAllByRole('link');

      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent('Parent');
    });

    it('should propagate disabled state to children', () => {
      const disabledItem = { ...mockItemWithChildren, disabled: true };
      const { getAllByRole } = render(<AnchorItem item={disabledItem} />);
      const links = getAllByRole('link');

      links.forEach((link) => {
        expect(link.getAttribute('aria-disabled')).toBe('true');
      });
    });
  });

  describe('active state', () => {
    beforeEach(() => {
      // Reset hash before each test
      window.location.hash = '';
    });

    it('should not have active class by default', () => {
      const { container } = render(<AnchorItem item={mockItem} />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemActive)).toBe(false);
    });

    it('should have active class when hash matches href', () => {
      window.location.hash = '#foo';
      const { container } = render(<AnchorItem item={mockItem} />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemActive)).toBe(true);
    });

    it('should not have active class when hash does not match', () => {
      window.location.hash = '#bar';
      const { container } = render(<AnchorItem item={mockItem} />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemActive)).toBe(false);
    });
  });
});
