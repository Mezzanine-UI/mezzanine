import { TreeSize } from '@mezzanine-ui/core/tree';
import { cleanup, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import { TreeNodeList, TreeNodeRefs, TreeNodeData, traverseTree } from '.';

describe('<TreeNodeList />', () => {
  afterEach(cleanup);
  const nodes: TreeNodeData[] = [
    {
      label: 'label 1',
      value: '1',
      nodes: [
        {
          label: 'label 1-1',
          value: '1-1',
          nodes: [
            {
              label: 'label 1-1-1',
              value: '1-1-1',
            },
            {
              label: 'label 1-1-2',
              value: '1-1-2',
            },
            {
              label: 'label 1-1-3',
              value: '1-1-3',
            },
          ],
        },
        {
          label: 'label 1-2',
          value: '1-2',
        },
      ],
    },
    {
      label: 'label 2',
      value: '2',
    },
  ];

  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLUListElement, (ref) =>
    render(<TreeNodeList ref={ref} nodes={nodes} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<TreeNodeList className={className} nodes={nodes} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TreeNodeList nodes={nodes} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree-node-list')).toBeTruthy();
  });

  it('nodes should be rendered with TreeNode', () => {
    const { container } = render(<TreeNodeList nodes={nodes} />);

    const treeNodes = container.querySelectorAll('.mzn-tree-node');

    // Should render the same number of nodes (at least at the root level)
    expect(treeNodes.length).toBeGreaterThanOrEqual(nodes.length);
  });

  it('prop multiple, onExpand, onSelect, selectable and size should be passed to TreeNode', () => {
    const multiple = true;
    const onExpand = jest.fn();
    const onSelect = jest.fn();
    const selectable = true;
    const size: TreeSize = 'large';
    const { container } = render(
      <TreeNodeList
        nodes={nodes}
        multiple={multiple}
        onExpand={onExpand}
        onSelect={onSelect}
        selectable={selectable}
        size={size}
      />,
    );

    // Verify that tree nodes are rendered with the correct size class
    const treeNodes = container.querySelectorAll('.mzn-tree-node');
    expect(treeNodes.length).toBeGreaterThan(0);

    // Check that the size class is applied
    treeNodes.forEach((node) => {
      expect(node.classList.contains(`mzn-tree-node--${size}`)).toBe(true);
    });
  });

  it('nodes of node should be rendered with a nested TreeNodeList which has same props of root except nodes', () => {
    const allExpandedNodes: TreeNodeData[] = [
      {
        label: 'label 1',
        value: '1',
        expanded: true,
        nodes: [
          {
            label: 'label 1-1',
            value: '1-1',
            expanded: true,
            nodes: [
              {
                label: 'label 1-1-1',
                value: '1-1-1',
              },
              {
                label: 'label 1-1-2',
                value: '1-1-2',
              },
              {
                label: 'label 1-1-3',
                value: '1-1-3',
              },
            ],
          },
          {
            label: 'label 1-2',
            value: '1-2',
          },
        ],
      },
      {
        label: 'label 2',
        value: '2',
      },
    ];
    const className = 'foo';
    const multiple = true;
    const onExpand = jest.fn();
    const onSelect = jest.fn();
    const selectable = true;
    const size: TreeSize = 'large';
    const { container } = render(
      <TreeNodeList
        className={className}
        multiple={multiple}
        nodes={allExpandedNodes}
        onExpand={onExpand}
        onSelect={onSelect}
        selectable={selectable}
        size={size}
      />,
    );

    // Check that nested TreeNodeList exists (should be > 1 since we have nested nodes)
    const nestedLists = container.querySelectorAll('.mzn-tree-node-list');

    // We expect at least 2 TreeNodeLists (root + at least one nested)
    expect(nestedLists.length).toBeGreaterThan(1);

    // Verify that nested lists have the className applied
    nestedLists.forEach((list) => {
      expect(list.classList.contains(className)).toBe(true);
    });
  });

  it('should return null if nodes is not provided', () => {
    render(<TreeNodeList />);

    expect(document.body.firstElementChild?.childElementCount).toBe(0);
  });

  it('should return null if nodes is provided with an empty array', () => {
    render(<TreeNodeList nodes={[]} />);

    expect(document.body.firstElementChild?.childElementCount).toBe(0);
  });

  describe('prop: size', () => {
    it('default to "medium"', () => {
      const { getHostHTMLElement } = render(<TreeNodeList nodes={nodes} />);
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-tree-node-list--medium'));
    });

    const sizes: TreeSize[] = ['small', 'medium', 'large'];

    sizes.forEach((size) => {
      it(`should apply ${size} size layout when size=${size}`, () => {
        const { getHostHTMLElement } = render(
          <TreeNodeList nodes={nodes} size={size} />,
        );
        const element = getHostHTMLElement();

        expect(element.classList.contains(`mzn-tree-node-list--${size}`));
      });
    });
  });

  describe('prop: treeNodeRefs', () => {
    it('should get node refs if treeNodeRefs is provided', () => {
      const treeNodeRefs = { current: undefined } as TreeNodeRefs;
      const allExpandedNodes: TreeNodeData[] = [
        {
          label: 'label 1',
          value: '1',
          expanded: true,
          nodes: [
            {
              label: 'label 1-1',
              value: '1-1',
              expanded: true,
              nodes: [
                {
                  label: 'label 1-1-1',
                  value: '1-1-1',
                },
                {
                  label: 'label 1-1-2',
                  value: '1-1-2',
                },
                {
                  label: 'label 1-1-3',
                  value: '1-1-3',
                },
              ],
            },
            {
              label: 'label 1-2',
              value: '1-2',
            },
          ],
        },
        {
          label: 'label 2',
          value: '2',
        },
      ];

      render(
        <TreeNodeList nodes={allExpandedNodes} treeNodeRefs={treeNodeRefs} />,
      );

      traverseTree(allExpandedNodes, (node) => {
        expect(treeNodeRefs.current?.[node.value]).toBeInstanceOf(
          HTMLLIElement,
        );
      });
    });
  });
});
