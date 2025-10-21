import { PaginationItemType } from '@mezzanine-ui/core/pagination';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  IconDefinition,
} from '@mezzanine-ui/icons';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';

import { PaginationItem } from '.';

const renderMockIcon = jest.fn();

jest.mock('../Icon', () => {
  return function MockIcon(props: any) {
    renderMockIcon(props);
    return <div />;
  };
});

describe('<PaginationItem />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<PaginationItem ref={ref} type="page" />),
  );

  describeForwardRefToHTMLElement(HTMLButtonElement, (ref) =>
    render(<PaginationItem ref={ref} type="next" />),
  );

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<PaginationItem ref={ref} type="ellipsis" />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<PaginationItem className={className} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<PaginationItem />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-pagination-item')).toBeTruthy();
  });
  describe('prop: disabled', () => {
    it('should add disabled class if disabled=true', () => {
      const { getHostHTMLElement } = render(<PaginationItem disabled />);
      const element = getHostHTMLElement();

      expect(element.classList).toContain('mzn-pagination-item--disabled');
      expect(element.hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('prop: page', () => {
    it('should render page number', () => {
      const page = 2;
      const { getHostHTMLElement } = render(
        <PaginationItem type="page" page={page} />,
      );
      const element = getHostHTMLElement();

      expect(element.textContent).toBe(page.toString());
    });
  });

  describe('prop: active', () => {
    it('should add active class if active=true', () => {
      const { getHostHTMLElement } = render(<PaginationItem active />);
      const element = getHostHTMLElement();

      expect(element.classList).toContain('mzn-pagination-item--active');
    });
  });

  describe('prop: type', () => {
    it('should render `page` button element by default', () => {
      const page = 2;

      const { getHostHTMLElement } = render(<PaginationItem page={page} />);
      const element = getHostHTMLElement();

      expect(element).toBeInstanceOf(HTMLButtonElement);
      expect(
        element.classList.contains('mzn-pagination-item__button'),
      ).toBeTruthy();
      expect(element.textContent).toBe(page.toString());
    });

    it('should render `ellipsis` span element if `type={ellipsis}`', () => {
      const { getHostHTMLElement } = render(<PaginationItem type="ellipsis" />);
      const element = getHostHTMLElement();

      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(
        element.classList.contains('mzn-pagination-item__ellipsis'),
      ).toBeTruthy();
    });

    const iconTypes: PaginationItemType[] = ['previous', 'next'];
    const icons: { [index: string]: IconDefinition } = {
      previous: ChevronLeftIcon,
      next: ChevronRightIcon,
    };

    iconTypes.forEach((iconType) => {
      const ItemIcon = icons[iconType];

      it(`should render ${iconType} button element if type={${iconType}}`, () => {
        const { getHostHTMLElement } = render(
          <PaginationItem type={iconType} />,
        );
        const element = getHostHTMLElement();

        expect(element).toBeInstanceOf(HTMLButtonElement);
        expect(renderMockIcon).toHaveBeenCalledWith(
          expect.objectContaining({
            icon: ItemIcon,
          }),
        );

        renderMockIcon.mockClear();
      });
    });
  });
});
