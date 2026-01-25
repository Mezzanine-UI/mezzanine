import { render } from '../../__test-utils__';
import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import { BreadcrumbProps } from './typings';

describe('<Breadcrumb />', () => {
  const mockItems: BreadcrumbProps['items'] = [
    { id: 'home', href: '/', name: 'Home' },
    { id: 'category', href: '/category', name: 'Category' },
    { id: 'product', href: '/product', name: 'Product' },
    { id: 'details', href: '/details', name: 'Details' },
  ];

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-breadcrumb')).toBeTruthy();
  });

  describe('prop: items', () => {
    it('should render correct number of items', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();
      const items = element.querySelectorAll('.mzn-breadcrumb__item');

      expect(items).toHaveLength(4);
    });

    it('should mark the last item as current', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();
      const currentItem = element.querySelector(
        '.mzn-breadcrumb__item--current',
      );

      expect(currentItem?.textContent).toBe('Details');
    });

    it('should handle single item', () => {
      const singleItem: BreadcrumbProps['items'] = [
        { href: '/', name: 'Home' },
      ];
      const { getHostHTMLElement } = render(<Breadcrumb items={singleItem} />);
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
    });
  });

  describe('prop: condensed', () => {
    it('should apply condensed mode correctly', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={mockItems} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Product');
      expect(element.textContent).toContain('Detail');
    });

    it('should show only last two items in condensed mode', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={mockItems} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).not.toContain('Home');
      expect(element.textContent).not.toContain('Category');
    });
  });

  describe('prop: children', () => {
    it('should render BreadcrumbItem children correctly', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" name="Home" />
          <BreadcrumbItem href="/category" name="Category" />
          <BreadcrumbItem href="/product" name="Product" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
    });

    it('should mark the last child item as current', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" name="Home" />
          <BreadcrumbItem href="/category" name="Category" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();
      const currentItem = element.querySelector(
        '.mzn-breadcrumb__item--current',
      );

      expect(currentItem?.textContent).toBe('Category');
    });
  });

  describe('prop: items with id field', () => {
    it('should handle items with explicit id field', () => {
      const itemsWithId: BreadcrumbProps['items'] = [
        { href: '/', id: 'home-id', name: 'Home' },
        { href: '/category', id: 'category-id', name: 'Category' },
        { href: '/product', id: 'product-id', name: 'Product' },
      ];
      const { getHostHTMLElement } = render(<Breadcrumb items={itemsWithId} />);
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
    });

    it('should fall back to name when id is not provided', () => {
      const itemsWithoutId: BreadcrumbProps['items'] = [
        { href: '/', name: 'Home' },
        { href: '/category', name: 'Category' },
      ];
      const { getHostHTMLElement } = render(
        <Breadcrumb items={itemsWithoutId} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
    });
  });

  describe('overflow menu integration', () => {
    it('should render overflow menu when items exceed 4', () => {
      const manyItems: BreadcrumbProps['items'] = [
        { href: '/', name: 'Home' },
        { href: '/level1', name: 'Level 1' },
        { href: '/level2', name: 'Level 2' },
        { href: '/level3', name: 'Level 3' },
        { href: '/level4', name: 'Level 4' },
        { href: '/level5', name: 'Level 5' },
      ];
      const { getHostHTMLElement } = render(<Breadcrumb items={manyItems} />);
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Level 4');
      expect(element.textContent).toContain('Level 5');
    });

    it('should not render overflow menu when items are exactly 4', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();

      expect(element.querySelectorAll('.mzn-breadcrumb__item')).toHaveLength(4);
    });

    it('should render overflow menu in condensed mode when more than 2 items', () => {
      const threeItems = mockItems.slice(0, 3);
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={threeItems} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
      expect(element.textContent).not.toContain('Home');
    });

    it('should not render overflow menu in condensed mode with exactly 2 items', () => {
      const twoItems = mockItems.slice(0, 2);
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={twoItems} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
    });
  });

  describe('children with explicit id props', () => {
    it('should handle BreadcrumbItem children with id prop', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" id="home-id" name="Home" />
          <BreadcrumbItem href="/category" id="category-id" name="Category" />
          <BreadcrumbItem href="/product" id="product-id" name="Product" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
    });

    it('should handle mix of children with and without id', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" id="home-id" name="Home" />
          <BreadcrumbItem href="/category" name="Category" />
          <BreadcrumbItem href="/product" id="product-id" name="Product" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
    });
  });

  describe('null and undefined items handling', () => {
    it('should handle undefined items gracefully', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb items={undefined as any} />,
      );
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(0);
    });

    it('should handle empty children array gracefully', () => {
      const { getHostHTMLElement } = render(<Breadcrumb>{[]}</Breadcrumb>);
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(0);
    });

    it('should handle empty items array gracefully', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={[]} />);
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(0);
    });
  });

  describe('separator count validation', () => {
    it('should have exactly 4 separators with 5 items in default mode', () => {
      const fiveItems: BreadcrumbProps['items'] = [
        { href: '/', name: 'Home' },
        { href: '/level1', name: 'Level 1' },
        { href: '/level2', name: 'Level 2' },
        { href: '/level3', name: 'Level 3' },
        { href: '/level4', name: 'Level 4' },
      ];
      const { getHostHTMLElement } = render(<Breadcrumb items={fiveItems} />);
      const element = getHostHTMLElement();
      const icons = element.querySelectorAll('i');

      expect(icons.length).toBeGreaterThanOrEqual(3);
    });

    it('should have correct separator count in condensed mode with 3 items', () => {
      const threeItems = mockItems.slice(0, 3);
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={threeItems} />,
      );
      const element = getHostHTMLElement();
      const icons = element.querySelectorAll('i');

      expect(icons.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('current item in various scenarios', () => {
    it('should mark correct item as current in 5-item overflow', () => {
      const fiveItems: BreadcrumbProps['items'] = [
        { href: '/', name: 'Home' },
        { href: '/level1', name: 'Level 1' },
        { href: '/level2', name: 'Level 2' },
        { href: '/level3', name: 'Level 3' },
        { href: '/level4', name: 'Level 4' },
      ];
      const { getHostHTMLElement } = render(<Breadcrumb items={fiveItems} />);
      const element = getHostHTMLElement();
      const currentItems = element.querySelectorAll(
        '.mzn-breadcrumb__item--current',
      );

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].textContent).toContain('Level 4');
    });

    it('should mark correct item as current in condensed 3-item overflow', () => {
      const threeItems = mockItems.slice(0, 3);
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={threeItems} />,
      );
      const element = getHostHTMLElement();
      const currentItems = element.querySelectorAll(
        '.mzn-breadcrumb__item--current',
      );

      expect(currentItems).toHaveLength(1);
      expect(currentItems[0].textContent).toContain('Product');
    });
  });

  describe('complex children structures', () => {
    it('should handle nested fragments with mixed content', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <>
            <>
              <BreadcrumbItem href="/" name="Home" />
              <BreadcrumbItem href="/category" name="Category" />
            </>
            <BreadcrumbItem href="/product" name="Product" />
          </>
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
    });

    it('should handle children with more than 4 items showing overflow', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" name="Home" />
          <BreadcrumbItem href="/l1" name="L1" />
          <BreadcrumbItem href="/l2" name="L2" />
          <BreadcrumbItem href="/l3" name="L3" />
          <BreadcrumbItem href="/l4" name="L4" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('L4');
      expect(element.textContent).not.toContain('L2');
    });
  });
});
