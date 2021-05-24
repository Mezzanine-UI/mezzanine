
import { TreeSize } from '@mezzanine-ui/core/tree';
import {
  cleanup,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import {
  TreeNode,
  TreeNodeList,
  TreeNodeRefs,
  TreeNodeData,
  traverseTree,
} from '.';

describe('<TreeNodeList />', () => {
  const nodes: TreeNodeData[] = [{
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
  }];

  afterEach(cleanup);

  describeForwardRefToHTMLElement(
    HTMLUListElement,
    (ref) => render(<TreeNodeList ref={ref} nodes={nodes} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<TreeNodeList className={className} nodes={nodes} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<TreeNodeList nodes={nodes} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree-node-list')).toBeTruthy();
  });

  it('nodes should be rendered with TreeNode', () => {
    const testInstance = TestRenderer.create(
      <TreeNodeList nodes={nodes} />,
    );

    const treeNodeInstances = testInstance.root.findAllByType(TreeNode);

    nodes.forEach((node, i) => {
      expect(treeNodeInstances[i].props.value).toEqual(node.value);
    });
  });

  it('prop multiple, onExpand, onSelect, selectable and size should be passed to TreeNode', () => {
    const multiple = true;
    const onExpand = jest.fn();
    const onSelect = jest.fn();
    const selectable = true;
    const size: TreeSize = 'large';
    const testInstance = TestRenderer.create(
      <TreeNodeList
        nodes={nodes}
        multiple={multiple}
        onExpand={onExpand}
        onSelect={onSelect}
        selectable={selectable}
        size={size}
      />,
    );

    const treeNodeInstances = testInstance.root.findAllByType(TreeNode);

    treeNodeInstances.forEach((treeNodeInstance) => {
      expect(treeNodeInstance.props.multiple).toEqual(multiple);
      expect(treeNodeInstance.props.onExpand).toEqual(onExpand);
      expect(treeNodeInstance.props.onSelect).toEqual(onSelect);
      expect(treeNodeInstance.props.selectable).toEqual(selectable);
      expect(treeNodeInstance.props.size).toEqual(size);
    });
  });

  it('nodes of node should be rendered with a nested TreeNodeList which has same props of root except nodes', () => {
    const allExpandedNodes: TreeNodeData[] = [{
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
    }];
    const className = 'foo';
    const multiple = true;
    const onExpand = jest.fn();
    const onSelect = jest.fn();
    const selectable = true;
    const size: TreeSize = 'large';
    const testInstance = TestRenderer.create(
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

    const treeNodeInstances = testInstance.root.findAllByType(TreeNode);

    allExpandedNodes.forEach((node, i) => {
      if (node.nodes?.length) {
        const treeNodeInstance = treeNodeInstances[i];
        const nestedTreeNodeListInstance = treeNodeInstance.findByType(TreeNodeList);

        // expect(nestedTreeNodeListInstance.props.nodes).toEqual(node.nodes);
        expect(nestedTreeNodeListInstance.props.className).toEqual(className);
        expect(nestedTreeNodeListInstance.props.multiple).toEqual(multiple);
        expect(nestedTreeNodeListInstance.props.onExpand).toEqual(onExpand);
        expect(nestedTreeNodeListInstance.props.onSelect).toEqual(onSelect);
        expect(nestedTreeNodeListInstance.props.selectable).toEqual(selectable);
        expect(nestedTreeNodeListInstance.props.size).toEqual(size);
      }
    });
  });

  it('should return null if nodes is not provided', () => {
    render(
      <TreeNodeList />,
    );

    expect(document.body.firstElementChild?.childElementCount).toBe(0);
  });

  it('should return null if nodes is provided with an empty array', () => {
    render(
      <TreeNodeList nodes={[]} />,
    );

    expect(document.body.firstElementChild?.childElementCount).toBe(0);
  });

  describe('prop: size', () => {
    it('default to "medium"', () => {
      const { getHostHTMLElement } = render(
        <TreeNodeList nodes={nodes} />,
      );
      const element = getHostHTMLElement();

      expect(element.classList.contains('mzn-tree-node-list--medium'));
    });

    const sizes:TreeSize[] = ['small', 'medium', 'large'];

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
      const allExpandedNodes: TreeNodeData[] = [{
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
      }];

      render(
        <TreeNodeList nodes={allExpandedNodes} treeNodeRefs={treeNodeRefs} />,
      );

      traverseTree(allExpandedNodes, (node) => {
        expect(treeNodeRefs.current?.[node.value]).toBeInstanceOf(HTMLLIElement);
      });
    });
  });
});
