import '@testing-library/jest-dom';
import { anchorClasses } from '@mezzanine-ui/core/anchor';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Anchor from './Anchor';
import AnchorGroup from './AnchorGroup';

const mockAnchors = [
  {
    href: '#anchor-1',
    id: 'anchor-1',
    name: 'anchor-1',
  },
  {
    href: '#anchor-2',
    id: 'anchor-2',
    name: 'anchor-2',
  },
];

const mockNestedAnchors = [
  {
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
    href: '#parent-1',
    id: 'parent-1',
    name: 'Parent 1',
  },
  {
    href: '#parent-2',
    id: 'parent-2',
    name: 'Parent 2',
  },
];

describe('<AnchorGroup />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<AnchorGroup ref={ref} anchors={mockAnchors} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<AnchorGroup className={className} anchors={mockAnchors} />),
  );

  it('should bind host class', () => {
    const { container } = render(<AnchorGroup anchors={mockAnchors} />);
    const element = container.firstElementChild;

    expect(element?.classList.contains(anchorClasses.group)).toBeTruthy();
  });

  describe('anchors prop (data-driven format)', () => {
    it('should render with anchors prop', () => {
      const { getAllByRole } = render(<AnchorGroup anchors={mockAnchors} />);
      const links = getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('anchor-1');
      expect(links[0]).toHaveAttribute('href', '#anchor-1');
      expect(links[1]).toHaveTextContent('anchor-2');
      expect(links[1]).toHaveAttribute('href', '#anchor-2');
    });

    it('should render nested anchors with anchors prop', () => {
      const { getAllByRole } = render(<AnchorGroup anchors={mockNestedAnchors} />);
      const links = getAllByRole('link');

      expect(links).toHaveLength(4);
      expect(links[0]).toHaveTextContent('Parent 1');
      expect(links[1]).toHaveTextContent('Child 1');
      expect(links[2]).toHaveTextContent('Child 2');
      expect(links[3]).toHaveTextContent('Parent 2');
    });
  });

  describe('children prop (JSX format)', () => {
    it('should render with children prop', () => {
      const { getAllByRole } = render(
        <AnchorGroup>
          <Anchor href="#anchor-1">anchor-1</Anchor>
          <Anchor href="#anchor-2">anchor-2</Anchor>
        </AnchorGroup>,
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('anchor-1');
      expect(links[0]).toHaveAttribute('href', '#anchor-1');
      expect(links[1]).toHaveTextContent('anchor-2');
      expect(links[1]).toHaveAttribute('href', '#anchor-2');
    });

    it('should render nested children', () => {
      const { getAllByRole } = render(
        <AnchorGroup>
          <Anchor href="#parent-1">
            Parent 1
            <Anchor href="#child-1">Child 1</Anchor>
            <Anchor href="#child-2">Child 2</Anchor>
          </Anchor>
          <Anchor href="#parent-2">Parent 2</Anchor>
        </AnchorGroup>,
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(4);
      expect(links[0]).toHaveTextContent('Parent 1');
      expect(links[1]).toHaveTextContent('Child 1');
      expect(links[2]).toHaveTextContent('Child 2');
      expect(links[3]).toHaveTextContent('Parent 2');
    });

    it('should skip anchors without href', () => {
      const { getAllByRole } = render(
        <AnchorGroup>
          <Anchor href="#anchor-1">anchor-1</Anchor>
          <Anchor>anchor-without-href</Anchor>
          <Anchor href="#anchor-2">anchor-2</Anchor>
        </AnchorGroup>,
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('anchor-1');
      expect(links[1]).toHaveTextContent('anchor-2');
    });

    it('should parse anchors prop from child Anchor components', () => {
      const childAnchors = [
        { href: '#from-child-1', id: 'from-child-1', name: 'From Child 1' },
        { href: '#from-child-2', id: 'from-child-2', name: 'From Child 2' },
      ];
      const { getAllByRole } = render(
        <AnchorGroup>
          <Anchor anchors={childAnchors} />
        </AnchorGroup>,
      );
      const links = getAllByRole('link');

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('From Child 1');
      expect(links[1]).toHaveTextContent('From Child 2');
    });

    it('should handle disabled prop on children', () => {
      const { getAllByRole } = render(
        <AnchorGroup>
          <Anchor disabled href="#anchor-1">anchor-1</Anchor>
          <Anchor href="#anchor-2">anchor-2</Anchor>
        </AnchorGroup>,
      );
      const links = getAllByRole('link');

      expect(links[0]).toHaveAttribute('aria-disabled', 'true');
      expect(links[1]).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('empty state', () => {
    it('should render empty group when no anchors provided', () => {
      const { container, queryAllByRole } = render(<AnchorGroup anchors={[]} />);
      const links = queryAllByRole('link');

      expect(links).toHaveLength(0);
      expect(container.firstElementChild?.classList.contains(anchorClasses.group)).toBeTruthy();
    });
  });
});
