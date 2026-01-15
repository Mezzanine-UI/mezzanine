import '@testing-library/jest-dom';
import { createRef } from 'react';
import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import Anchor from '.';

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

describe('<Anchor />', () => {
  afterEach(cleanup);

  it('should bind ref to host element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Anchor anchors={mockAnchors} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Anchor anchors={mockAnchors} className={className} />),
  );

  it('should render with anchors prop (data-driven format)', () => {
    const { getAllByRole } = render(<Anchor anchors={mockAnchors} />);
    const links = getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('anchor-1');
    expect(links[0]).toHaveAttribute('href', '#anchor-1');
    expect(links[1]).toHaveTextContent('anchor-2');
    expect(links[1]).toHaveAttribute('href', '#anchor-2');
  });

  it('should render nested anchors with anchors prop', () => {
    const { getAllByRole } = render(<Anchor anchors={mockNestedAnchors} />);
    const links = getAllByRole('link');

    expect(links).toHaveLength(4);
    expect(links[0]).toHaveTextContent('Parent 1');
    expect(links[1]).toHaveTextContent('Child 1');
    expect(links[2]).toHaveTextContent('Child 2');
    expect(links[3]).toHaveTextContent('Parent 2');
  });

  it('should render with children prop (JSX format)', () => {
    const { getAllByRole } = render(
      <Anchor>
        <Anchor href="#anchor-1">anchor-1</Anchor>
        <Anchor href="#anchor-2">anchor-2</Anchor>
      </Anchor>,
    );
    const links = getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('anchor-1');
    expect(links[0]).toHaveAttribute('href', '#anchor-1');
    expect(links[1]).toHaveTextContent('anchor-2');
    expect(links[1]).toHaveAttribute('href', '#anchor-2');
  });

  it('should render nested children (JSX format)', () => {
    const { getAllByRole } = render(
      <Anchor>
        <Anchor href="#parent-1">
          Parent 1
          <Anchor href="#child-1">
            Child 1
            <Anchor href="#grandchild-1">Grandchild 1</Anchor>
          </Anchor>
        </Anchor>
        <Anchor href="#parent-2">Parent 2</Anchor>
      </Anchor>,
    );
    const links = getAllByRole('link');

    expect(links).toHaveLength(4);
  });

  it('should limit nesting to 3 levels maximum', () => {
    const deeplyNestedAnchors = [
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    href: '#level-4',
                    id: 'level-4',
                    name: 'Level 4 (should not render)',
                  },
                ],
                href: '#level-3',
                id: 'level-3',
                name: 'Level 3',
              },
            ],
            href: '#level-2',
            id: 'level-2',
            name: 'Level 2',
          },
        ],
        href: '#level-1',
        id: 'level-1',
        name: 'Level 1',
      },
    ];

    const { getAllByRole, queryByText } = render(
      <Anchor anchors={deeplyNestedAnchors} />,
    );
    const links = getAllByRole('link');

    expect(links).toHaveLength(3);
    expect(queryByText('Level 4 (should not render)')).not.toBeInTheDocument();
  });

  it('should apply progressive padding for nested levels', () => {
    const { container } = render(<Anchor anchors={mockNestedAnchors} />);
    const nestedContainers = container.querySelectorAll('.mzn-anchor__nested');
    const level1Anchors = container.querySelectorAll('.mzn-anchor__nested--level-1');

    expect(nestedContainers).toHaveLength(1);
    expect(level1Anchors.length).toBeGreaterThan(0);
  });

  it('should handle onClick callback', () => {
    const onClick = jest.fn();
    const anchorsWithClick = [
      {
        href: '#anchor-1',
        id: 'anchor-1',
        name: 'anchor-1',
        onClick,
      },
      {
        href: '#anchor-2',
        id: 'anchor-2',
        name: 'anchor-2',
        onClick,
      },
    ];
    const { getAllByRole } = render(
      <Anchor anchors={anchorsWithClick} />,
    );
    const links = getAllByRole('link');

    links[0].click();
    expect(onClick).toHaveBeenCalledTimes(1);

    links[1].click();
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('should not render anchor without href in JSX format', () => {
    const { getAllByRole } = render(
      <Anchor>
        <Anchor href="#anchor-1">anchor-1</Anchor>
        <Anchor>anchor-2</Anchor>
        <Anchor href="#anchor-3">anchor-3</Anchor>
      </Anchor>,
    );
    const links = getAllByRole('link');

    expect(links).toHaveLength(2);
    expect(links[0]).toHaveTextContent('anchor-1');
    expect(links[1]).toHaveTextContent('anchor-3');
  });

  it('should limit children to maximum 3 items in JSX format', () => {
    const { getAllByRole } = render(
      <Anchor>
        <Anchor href="#parent">
          Parent
          <Anchor href="#child-1">Child 1</Anchor>
          <Anchor href="#child-2">Child 2</Anchor>
          <Anchor href="#child-3">Child 3</Anchor>
          <Anchor href="#child-4">Child 4</Anchor>
          <Anchor href="#child-5">Child 5</Anchor>
        </Anchor>
      </Anchor>,
    );
    const links = getAllByRole('link');

    expect(links).toHaveLength(4);
    expect(links[0]).toHaveTextContent('Parent');
    expect(links[1]).toHaveTextContent('Child 1');
    expect(links[2]).toHaveTextContent('Child 2');
    expect(links[3]).toHaveTextContent('Child 3');
  });

  it('should limit children to maximum 3 items with anchors prop', () => {
    const anchorsWithManyChildren = [
      {
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
      },
    ];
    const { getAllByRole } = render(
      <Anchor anchors={anchorsWithManyChildren} />,
    );
    const links = getAllByRole('link');

    expect(links).toHaveLength(4);
    expect(links[0]).toHaveTextContent('Parent');
    expect(links[1]).toHaveTextContent('Child 1');
    expect(links[2]).toHaveTextContent('Child 2');
    expect(links[3]).toHaveTextContent('Child 3');
  });
});
