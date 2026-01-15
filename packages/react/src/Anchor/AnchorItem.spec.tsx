import '@testing-library/jest-dom';
import { anchorClasses } from '@mezzanine-ui/core/anchor';
import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import AnchorItem, { AnchorItemData } from './AnchorItem';

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

  describeHostElementClassNameAppendable('anchor', (className) =>
    render(<AnchorItem className={className} href="#anchor" id="anchor" name="Anchor Item" />),
  );

  it('should bind host class', () => {
    const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
    const element = container.querySelector('a');

    expect(element?.classList.contains(anchorClasses.anchorItem)).toBeTruthy();
  });

  it('should wrap children by anchor tag', () => {
    const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
    const element = container.querySelector('a');

    expect(element?.tagName.toLowerCase()).toBe('a');
    expect(element?.textContent).toBe('Anchor Item');
  });

  it('should render with correct href attribute', () => {
    const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
    const element = container.querySelector('a');

    expect(element?.getAttribute('href')).toBe('#anchor');
  });

  describe('prop: disabled', () => {
    it('should not have disabled styles by default', () => {
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemDisabled)).toBe(false);
    });

    it('should have aria-disabled attribute when disabled=true', () => {
      const { container } = render(<AnchorItem disabled href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('aria-disabled')).toBe('true');
      expect(element?.classList.contains(anchorClasses.anchorItemDisabled)).toBe(true);
    });

    it('should have aria-disabled attribute when parentDisabled=true', () => {
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" parentDisabled />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('aria-disabled')).toBe('true');
      expect(element?.classList.contains(anchorClasses.anchorItemDisabled)).toBe(true);
    });

    it('should set tabIndex to -1 when disabled', () => {
      const { container } = render(<AnchorItem disabled href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.getAttribute('tabIndex')).toBe('-1');
    });

    it('should not have tabIndex when not disabled', () => {
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.hasAttribute('tabIndex')).toBe(false);
    });
  });

  describe('prop: onClick', () => {
    it('should call onClick handler when clicked', () => {
      const onClick = jest.fn();
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" onClick={onClick} />);
      const element = container.querySelector('a');

      element?.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const { container } = render(<AnchorItem disabled href="#anchor" id="anchor" name="Anchor Item" onClick={onClick} />);
      const element = container.querySelector('a');

      element?.click();

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when parent is disabled', () => {
      const onClick = jest.fn();
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" onClick={onClick} parentDisabled />);
      const element = container.querySelector('a');

      element?.click();

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('nested children', () => {
    it('should render children when present', () => {
      const { getAllByRole } = render(
        <AnchorItem
          href="#parent"
          id="parent"
          name="Parent Item"
          subAnchors={mockItemWithChildren.children}
        />
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(3);
      expect(links[0]).toHaveTextContent('Parent Item');
      expect(links[1]).toHaveTextContent('Child 1');
      expect(links[2]).toHaveTextContent('Child 2');
    });

    it('should apply nested class to children container', () => {
      const { container } = render(
        <AnchorItem
          href="#parent"
          id="parent"
          name="Parent Item"
          subAnchors={mockItemWithChildren.children}
        />
      );
      const nestedContainer = container.querySelector(`.${anchorClasses.nested}`);

      expect(nestedContainer).toBeInTheDocument();
    });

    it('should apply level-1 class to level 1 nested items', () => {
      const { container } = render(
        <AnchorItem
          href="#parent"
          id="parent"
          level={1}
          name="Parent Item"
          subAnchors={mockItemWithChildren.children}
        />
      );
      const level1Items = container.querySelectorAll(`.${anchorClasses.nestedLevel1}`);

      expect(level1Items.length).toBeGreaterThan(0);
    });

    it('should apply level-2 class to level 2 nested items', () => {
      const deepSubAnchors: AnchorItemData[] = [
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
      ];
      const { container } = render(
        <AnchorItem
          href="#parent"
          id="parent"
          level={1}
          name="Parent"
          subAnchors={deepSubAnchors}
        />
      );
      const level2Items = container.querySelectorAll(`.${anchorClasses.nestedLevel2}`);

      expect(level2Items.length).toBeGreaterThan(0);
    });

    it('should limit children to maximum 3 items', () => {
      const manySubAnchors: AnchorItemData[] = [
        { href: '#child-1', id: 'child-1', name: 'Child 1' },
        { href: '#child-2', id: 'child-2', name: 'Child 2' },
        { href: '#child-3', id: 'child-3', name: 'Child 3' },
        { href: '#child-4', id: 'child-4', name: 'Child 4' },
        { href: '#child-5', id: 'child-5', name: 'Child 5' },
      ];
      const { getAllByRole } = render(
        <AnchorItem
          href="#parent"
          id="parent"
          name="Parent"
          subAnchors={manySubAnchors}
        />
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(4);
      expect(links[0]).toHaveTextContent('Parent');
      expect(links[1]).toHaveTextContent('Child 1');
      expect(links[2]).toHaveTextContent('Child 2');
      expect(links[3]).toHaveTextContent('Child 3');
    });

    it('should not render children when level reaches MAX_LEVEL (3)', () => {
      const deepSubAnchors: AnchorItemData[] = [
        {
          href: '#child',
          id: 'child',
          name: 'Child',
        },
      ];
      const { getAllByRole } = render(
        <AnchorItem
          href="#parent"
          id="parent"
          level={3}
          name="Parent"
          subAnchors={deepSubAnchors}
        />
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(1);
      expect(links[0]).toHaveTextContent('Parent');
    });

    it('should propagate disabled state to children', () => {
      const { getAllByRole } = render(
        <AnchorItem
          disabled
          href="#parent"
          id="parent"
          name="Parent Item"
          subAnchors={mockItemWithChildren.children}
        />
      );
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
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemActive)).toBe(false);
    });

    it('should have active class when hash matches href', () => {
      window.location.hash = '#anchor';
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemActive)).toBe(true);
    });

    it('should not have active class when hash does not match', () => {
      window.location.hash = '#other';
      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      expect(element?.classList.contains(anchorClasses.anchorItemActive)).toBe(false);
    });
  });

  describe('prop: autoScrollTo', () => {
    beforeEach(() => {
      window.location.hash = '';
      document.body.innerHTML = '<div id="anchor"></div>';
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should not auto-scroll by default when autoScrollTo is not set', () => {
      const scrollIntoViewMock = jest.fn();
      const targetElement = document.getElementById('anchor');
      if (targetElement) {
        targetElement.scrollIntoView = scrollIntoViewMock;
      }

      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      element?.click();

      expect(scrollIntoViewMock).not.toHaveBeenCalled();
    });

    it('should auto-scroll when autoScrollTo is true', () => {
      const scrollIntoViewMock = jest.fn();
      const targetElement = document.getElementById('anchor');
      if (targetElement) {
        targetElement.scrollIntoView = scrollIntoViewMock;
      }

      const { container } = render(<AnchorItem autoScrollTo href="#anchor" id="anchor" name="Anchor Item" />);
      const element = container.querySelector('a');

      element?.click();

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should auto-scroll when parentAutoScrollTo is true', () => {
      const scrollIntoViewMock = jest.fn();
      const targetElement = document.getElementById('anchor');
      if (targetElement) {
        targetElement.scrollIntoView = scrollIntoViewMock;
      }

      const { container } = render(<AnchorItem href="#anchor" id="anchor" name="Anchor Item" parentAutoScrollTo />);
      const element = container.querySelector('a');

      element?.click();

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('should propagate autoScrollTo to children', () => {
      document.body.innerHTML = '<div id="parent"></div><div id="child-1"></div><div id="child-2"></div>';

      const scrollIntoViewMocks = {
        child1: jest.fn(),
        child2: jest.fn(),
        parent: jest.fn(),
      };

      const parentElement = document.getElementById('parent');
      const child1Element = document.getElementById('child-1');
      const child2Element = document.getElementById('child-2');

      if (parentElement) parentElement.scrollIntoView = scrollIntoViewMocks.parent;
      if (child1Element) child1Element.scrollIntoView = scrollIntoViewMocks.child1;
      if (child2Element) child2Element.scrollIntoView = scrollIntoViewMocks.child2;

      const { getAllByRole } = render(
        <AnchorItem
          autoScrollTo
          href="#parent"
          id="parent"
          name="Parent Item"
          subAnchors={mockItemWithChildren.children}
        />
      );
      const links = getAllByRole('link');

      links[1]?.click();

      expect(scrollIntoViewMocks.child1).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
});
