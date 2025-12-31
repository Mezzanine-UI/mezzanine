import { render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Breadcrumb from './Breadcrumb';
import BreadcrumbItem from './BreadcrumbItem';
import { BreadcrumbProps } from './typings';

const mockItems: BreadcrumbProps['items'] = [
  { href: '/', label: 'Home' },
  { href: '/category', label: 'Category' },
  { href: '/product', label: 'Product' },
  { href: '/details', label: 'Details' },
];

describe('<Breadcrumb />', () => {
  describeForwardRefToHTMLElement(HTMLElement, (ref) =>
    render(<Breadcrumb items={mockItems} ref={ref} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Breadcrumb className={className} items={mockItems} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-breadcrumb')).toBeTruthy();
  });

  it('should have proper aria-label', () => {
    const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
    const element = getHostHTMLElement();

    expect(element.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  describe('single item', () => {
    it('should render single item without separator', () => {
      const singleItem = [{ href: '/', label: 'Home' }];
      const { getHostHTMLElement } = render(<Breadcrumb items={singleItem} />);
      const element = getHostHTMLElement();

      expect(element.querySelectorAll('i')).toHaveLength(0);
      expect(element.textContent).toContain('Home');
    });
  });

  describe('two items', () => {
    it('should render two items with one separator', () => {
      const twoItems = mockItems.slice(0, 2);
      const { getHostHTMLElement } = render(<Breadcrumb items={twoItems} />);
      const element = getHostHTMLElement();

      expect(element.querySelectorAll('i')).toHaveLength(1);
      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
    });
  });

  describe('three items', () => {
    it('should render three items with two separators', () => {
      const threeItems = mockItems.slice(0, 3);
      const { getHostHTMLElement } = render(<Breadcrumb items={threeItems} />);
      const element = getHostHTMLElement();

      expect(element.querySelectorAll('i')).toHaveLength(2);
      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
    });
  });

  describe('four items', () => {
    it('should render all four items with separators', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();

      expect(element.querySelectorAll('i')).toHaveLength(3);
      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
      expect(element.textContent).toContain('Details');
    });

    it('should mark last item as current', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();
      const breadcrumbItems = element.querySelectorAll('.mzn-breadcrumb__item');
      const lastItem = breadcrumbItems[breadcrumbItems.length - 1];

      expect(
        lastItem.classList.contains('mzn-breadcrumb__item--current'),
      ).toBeTruthy();
    });
  });

  describe('more than four items', () => {
    const manyItems: BreadcrumbProps['items'] = [
      { href: '/', label: 'Home' },
      { href: '/level1', label: 'Level 1' },
      { href: '/level2', label: 'Level 2' },
      { href: '/level3', label: 'Level 3' },
      { href: '/level4', label: 'Level 4' },
      { href: '/level5', label: 'Level 5' },
    ];

    it('should show overflow pattern with dropdown', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={manyItems} />);
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Level 5');
      expect(element.textContent).toContain('Level 4');
    });

    it('should not show all intermediate items', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={manyItems} />);
      const element = getHostHTMLElement();

      expect(element.textContent).not.toContain('Level 2');
      expect(element.textContent).not.toContain('Level 3');
    });
  });

  describe('prop: condensed', () => {
    it('should show only last two items in condensed mode', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={mockItems} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Product');
      expect(element.textContent).toContain('Details');
      expect(element.textContent).not.toContain('Home');
      expect(element.textContent).not.toContain('Category');
    });

    it('should show dropdown when condensed and more than 2 items', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={mockItems} />,
      );
      const element = getHostHTMLElement();
      const breadcrumbItems = element.querySelectorAll('.mzn-breadcrumb__item');

      expect(breadcrumbItems.length).toBeGreaterThan(2);
    });

    it('should handle condensed mode with two items', () => {
      const twoItems = mockItems.slice(0, 2);
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={twoItems} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
    });

    it('should handle condensed mode with single item', () => {
      const singleItem = [mockItems[0]];
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed items={singleItem} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.querySelectorAll('i')).toHaveLength(0);
    });
  });

  describe('current item handling', () => {
    it('should mark only the last item as current', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();
      const breadcrumbItems = element.querySelectorAll('.mzn-breadcrumb__item');

      breadcrumbItems.forEach((item, index) => {
        const isCurrent = item.classList.contains(
          'mzn-breadcrumb__item--current',
        );
        if (index === breadcrumbItems.length - 1) {
          expect(isCurrent).toBeTruthy();
        } else {
          expect(isCurrent).toBeFalsy();
        }
      });
    });

    it('should mark single item as current', () => {
      const singleItem = [mockItems[0]];
      const { getHostHTMLElement } = render(<Breadcrumb items={singleItem} />);
      const element = getHostHTMLElement();
      const breadcrumbItem = element.querySelector('.mzn-breadcrumb__item');

      expect(
        breadcrumbItem?.classList.contains('mzn-breadcrumb__item--current'),
      ).toBeTruthy();
    });
  });

  describe('separators', () => {
    it('should have correct number of separators for different item counts', () => {
      const testCases = [
        { items: 1, separators: 0 },
        { items: 2, separators: 1 },
        { items: 3, separators: 2 },
        { items: 4, separators: 3 },
      ];

      testCases.forEach(({ items: count, separators }) => {
        const testItems = mockItems.slice(0, count);
        const { getHostHTMLElement } = render(<Breadcrumb items={testItems} />);
        const element = getHostHTMLElement();
        const icons = element.querySelectorAll('i');

        expect(icons).toHaveLength(separators);
      });
    });

    it('should place separators between items', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();
      const children = Array.from(element.children);

      children.forEach((child, index) => {
        if (index % 2 === 1) {
          expect(child.tagName.toLowerCase()).toBe('i');
        }
      });
    });
  });

  describe('accessibility', () => {
    it('should have proper nav role', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();

      expect(element.tagName.toLowerCase()).toBe('nav');
    });

    it('should have aria-label for navigation', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={mockItems} />);
      const element = getHostHTMLElement();

      expect(element.getAttribute('aria-label')).toBe('Breadcrumb');
    });
  });

  describe('empty items', () => {
    it('should handle empty items array', () => {
      const { getHostHTMLElement } = render(<Breadcrumb items={[]} />);
      const element = getHostHTMLElement();

      expect(element.children).toHaveLength(0);
      expect(element.textContent?.trim()).toBe('');
    });
  });

  describe('prop: children', () => {
    it('should render single BreadcrumbItem child', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" label="Home" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.querySelectorAll('i')).toHaveLength(0);
    });

    it('should render multiple BreadcrumbItem children with separators', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" label="Home" />
          <BreadcrumbItem href="/category" label="Category" />
          <BreadcrumbItem href="/product" label="Product" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
      expect(element.querySelectorAll('i')).toHaveLength(2);
    });

    it('should mark last child as current', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" label="Home" />
          <BreadcrumbItem href="/category" label="Category" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();
      const breadcrumbItems = element.querySelectorAll('.mzn-breadcrumb__item');
      const lastItem = breadcrumbItems[breadcrumbItems.length - 1];

      expect(
        lastItem.classList.contains('mzn-breadcrumb__item--current'),
      ).toBeTruthy();
    });

    it('should handle four children items', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" label="Home" />
          <BreadcrumbItem href="/category" label="Category" />
          <BreadcrumbItem href="/product" label="Product" />
          <BreadcrumbItem href="/details" label="Details" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
      expect(element.textContent).toContain('Details');
      expect(element.querySelectorAll('i')).toHaveLength(3);
    });

    it('should show overflow pattern with more than four children', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <BreadcrumbItem href="/" label="Home" />
          <BreadcrumbItem href="/level1" label="Level 1" />
          <BreadcrumbItem href="/level2" label="Level 2" />
          <BreadcrumbItem href="/level3" label="Level 3" />
          <BreadcrumbItem href="/level4" label="Level 4" />
          <BreadcrumbItem href="/level5" label="Level 5" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Level 5');
      expect(element.textContent).toContain('Level 4');
      expect(element.textContent).not.toContain('Level 2');
      expect(element.textContent).not.toContain('Level 3');
    });

    it('should handle condensed mode with children', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb condensed>
          <BreadcrumbItem href="/" label="Home" />
          <BreadcrumbItem href="/category" label="Category" />
          <BreadcrumbItem href="/product" label="Product" />
          <BreadcrumbItem href="/details" label="Details" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Product');
      expect(element.textContent).toContain('Details');
      expect(element.textContent).not.toContain('Home');
      expect(element.textContent).not.toContain('Category');
    });

    it('should handle fragment children', () => {
      const { getHostHTMLElement } = render(
        <Breadcrumb>
          <>
            <BreadcrumbItem href="/" label="Home" />
            <BreadcrumbItem href="/category" label="Category" />
          </>
          <BreadcrumbItem href="/product" label="Product" />
        </Breadcrumb>,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toContain('Home');
      expect(element.textContent).toContain('Category');
      expect(element.textContent).toContain('Product');
      expect(element.querySelectorAll('i')).toHaveLength(2);
    });
  });
});
