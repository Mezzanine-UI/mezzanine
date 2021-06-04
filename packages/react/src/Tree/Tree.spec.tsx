
import { TreeNodeValue, TreeSize } from '@mezzanine-ui/core/tree';
import { RefObject } from 'react';
import {
  act,
  cleanup,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tree, {
  TreeNodeRefs,
  TreeExpandControl,
  TreeNodeProp,
  TreeNodeList,
  TreeNode,
  traverseTree,
} from '.';

describe('<Tree />', () => {
  const nodes: TreeNodeProp[] = [{
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
    HTMLDivElement,
    (ref) => render(<Tree ref={ref} nodes={nodes} />),
  );

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(<Tree className={className} nodes={nodes} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Tree nodes={nodes} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree')).toBeTruthy();
  });

  it('should render nodes with TreeNodeList', () => {
    const testInstance = TestRenderer.create(
      <Tree nodes={nodes} />,
    );
    const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

    nodes.forEach((node, i) => {
      expect(node.value).toEqual(treeNodeListInstance.props.nodes[i].value);
    });
  });

  describe('expand functionality', () => {
    it('should have expand handler on icon if node has siblings', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <Tree nodes={nodes} />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-icon');

      expect(document.querySelector('.mzn-tree-node-list .mzn-tree-node-list')).toBe(null);

      fireEvent.click(iconElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-tree-node-list .mzn-tree-node-list')).toBeInstanceOf(HTMLElement);
    });

    it('should toggle sibling list', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(
        <Tree nodes={nodes} />,
      );
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-icon');

      expect(document.querySelector('.mzn-tree-node-list .mzn-tree-node-list')).toBe(null);

      fireEvent.click(iconElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-tree-node-list .mzn-tree-node-list')).toBeInstanceOf(HTMLElement);

      fireEvent.click(iconElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(document.querySelector('.mzn-tree-node-list .mzn-tree-node-list')).toBe(null);
    });
  });

  describe('values can be either TreeNodeValue or array of TreeNodeValue', () => {
    it('case: TreeNodeValue', () => {
      const values = '1-1-1';
      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} values={values} defaultExpandAll />,
      );
      const targetNodeListInstance = testInstance.root.findByProps({
        value: '1-1-1',
      });

      expect(targetNodeListInstance.props.selected).toBe(true);
    });

    it('case: TreeNodeValue[]', () => {
      const values = ['1-1-1', '1-1-2'];
      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} values={values} defaultExpandAll />,
      );
      const firstTargetNodeListInstance = testInstance.root.findByProps({
        value: '1-1-1',
      });
      const secondTargetNodeListInstance = testInstance.root.findByProps({
        value: '1-1-2',
      });

      expect(firstTargetNodeListInstance.props.selected).toBe(true);
      expect(secondTargetNodeListInstance.props.selected).toBe(true);
    });
  });

  describe('prop: defaultExpandAll', () => {
    it('default collapse all', () => {
      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} />,
      );
      const treeNodeListInstances = testInstance.root.findAllByType(TreeNodeList);

      treeNodeListInstances.forEach((treeNodeListInstance) => {
        const treeNodeInstances = treeNodeListInstance.findAllByType(TreeNode);

        treeNodeInstances.forEach((treeNodeInstance) => {
          expect(treeNodeInstance.props.expand).toBeFalsy();
        });
      });
    });

    it('should expand all list if defaultExpandAll=true on first render', () => {
      const allNodeValues: TreeNodeValue[] = [];

      traverseTree(nodes, (node) => {
        allNodeValues.push(node.value);
      });

      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} defaultExpandAll />,
      );

      allNodeValues.forEach((value) => {
        const targetInstance = testInstance.root.findByProps({
          value,
        });

        expect(targetInstance).toBeTruthy();
      });
    });
  });

  describe('prop: expandControllerRef', () => {
    it('should not get handlers if `expandedValues` prop is provided', () => {
      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      render(
        <Tree nodes={nodes} expandControllerRef={expandControllerRef} expandedValues={[]} />,
      );

      expect(expandControllerRef.current).toBe(null);
    });

    it('should get controllers if expandControllerRef is provided', () => {
      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      render(
        <Tree nodes={nodes} expandControllerRef={expandControllerRef} />,
      );

      expect(expandControllerRef.current?.collapse).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.collapseAll).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.collapseAllFrom).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.expand).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.expandAll).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.expandAllFrom).toBeInstanceOf(Function);
    });

    it('control collapse: should collapse target', () => {
      jest.useFakeTimers();

      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      const { getByText } = render(
        <Tree
          nodes={nodes}
          defaultExpandAll
          expandControllerRef={expandControllerRef}
        />,
      );
      const targetElement = getByText('label 1-1').parentElement?.parentElement;

      expect(targetElement?.childElementCount).toBe(2);

      act(() => {
        expandControllerRef.current?.collapse('1-1');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(targetElement?.childElementCount).toBe(1);
    });

    it('control collapseAll: should collapse all node', () => {
      jest.useFakeTimers();

      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      const { getByText } = render(
        <Tree
          nodes={nodes}
          defaultExpandAll
          expandControllerRef={expandControllerRef}
        />,
      );
      const targetElement = getByText('label 1').parentElement?.parentElement;

      expect(targetElement?.childElementCount).toBe(2);

      act(() => {
        expandControllerRef.current?.collapseAll();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(targetElement?.childElementCount).toBe(1);
    });

    it('control collapseAllFrom: should collapse all sibling node from target', () => {
      jest.useFakeTimers();

      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      const { getByText } = render(
        <Tree
          nodes={nodes}
          defaultExpandAll
          expandControllerRef={expandControllerRef}
        />,
      );
      const targetElement = getByText('label 1-1').parentElement?.parentElement;

      expect(targetElement?.childElementCount).toBe(2);

      act(() => {
        expandControllerRef.current?.collapseAllFrom('1-1');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(targetElement?.childElementCount).toBe(1);
    });

    it('control expand: should expand target', () => {
      jest.useFakeTimers();

      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      const { getByText } = render(
        <Tree
          nodes={nodes}
          expandControllerRef={expandControllerRef}
        />,
      );
      const targetElement = getByText('label 1').parentElement?.parentElement;

      expect(targetElement?.childElementCount).toBe(1);

      act(() => {
        expandControllerRef.current?.expand('1');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(targetElement?.childElementCount).toBe(2);
    });

    it('control expandAll: should expand all node', () => {
      jest.useFakeTimers();

      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      const { getByText } = render(
        <Tree
          nodes={nodes}
          expandControllerRef={expandControllerRef}
        />,
      );
      const targetElement = getByText('label 1').parentElement?.parentElement;

      expect(targetElement?.childElementCount).toBe(1);

      act(() => {
        expandControllerRef.current?.expandAll();
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(targetElement?.childElementCount).toBe(2);
    });

    it('control expandAllFrom: should expand all sibling node from target', () => {
      jest.useFakeTimers();

      const expandControllerRef = { current: null } as RefObject<TreeExpandControl>;

      const { getByText } = render(
        <Tree
          nodes={nodes}
          expandControllerRef={expandControllerRef}
        />,
      );
      const targetElement = getByText('label 1').parentElement?.parentElement;

      expect(targetElement?.childElementCount).toBe(1);

      act(() => {
        expandControllerRef.current?.expandAllFrom('1');
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(targetElement?.childElementCount).toBe(2);
    });
  });

  describe('prop: multiple & prop: onSelect', () => {
    it('multiple should be passed to TreeNodeList', () => {
      const multiple = true;

      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} multiple={multiple} />,
      );

      const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

      expect(treeNodeListInstance.props.multiple).toEqual(multiple);
    });

    it('prop onSelect should only bind to leaf elements when multiple is falsy', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} defaultExpandAll onSelect={onSelect} selectable />,
      );
      const targetLabelElement = getByText('label 1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toBeCalledTimes(0);
    });

    it('prop onSelect should receive target value in the returned array if multiple is falsy', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} defaultExpandAll onSelect={onSelect} selectable />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith(expect.arrayContaining(['1-1-1']));
    });

    it('prop onSelect should receive multiple value in the returned array if multiple=true', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} defaultExpandAll onSelect={onSelect} selectable multiple />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith(expect.arrayContaining(['1-1-1']));

      const secondTargetLabelElement = getByText('label 1-1-2');

      fireEvent.click(secondTargetLabelElement);

      expect(onSelect).toBeCalledTimes(2);
      expect(onSelect).toBeCalledWith(expect.arrayContaining(['1-1-2']));
    });
  });

  describe('prop: selectMethod', () => {
    it('default to "toggle" which toggles the target value', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} defaultExpandAll onSelect={onSelect} selectable values={['1-1-1']} />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith(expect.not.arrayContaining(['1-1-1']));
    });

    it('should always include target if selectMode="target"', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree
          nodes={nodes}
          defaultExpandAll
          onSelect={onSelect}
          selectable
          values={['1-1-1']}
          selectMethod="target"
        />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toBeCalledTimes(1);
      expect(onSelect).toBeCalledWith(expect.arrayContaining(['1-1-1']));
    });
  });

  describe('prop: selectable', () => {
    it('default to falsy', () => {
      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} />,
      );
      const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

      expect(treeNodeListInstance.props.onSelect).toBe(undefined);
    });

    it('should have click handler on caret icons if selectable=true and onSelect is provided', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} selectable onSelect={onSelect} />,
      );
      const nodeElement = getByText('label 1').parentElement?.parentElement;
      const caretElement = nodeElement?.querySelector('.mzn-icon');

      expect((caretElement as HTMLElement).onclick).toBeInstanceOf(Function);
    });
  });

  describe('prop: size', () => {
    it('should pass to TreeNodeList', () => {
      const size: TreeSize = 'large';
      const testInstance = TestRenderer.create(
        <Tree nodes={nodes} size={size} />,
      );
      const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

      expect(treeNodeListInstance.props.size).toEqual(size);
    });
  });

  describe('prop: treeNodeListProps', () => {
    it('properties should pass to TreeNodeList', () => {
      const className = 'foo';
      const testInstance = TestRenderer.create(
        <Tree
          nodes={nodes}
          treeNodeListProps={{
            className,
          }}
        />,
      );
      const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

      expect(treeNodeListInstance.props.className).toEqual(className);
    });
  });

  describe('prop: treeNodeProps', () => {
    it('should pass to TreeNodeList', () => {
      const treeNodeProps = {
        className: 'foo',
      };
      const testInstance = TestRenderer.create(
        <Tree
          nodes={nodes}
          treeNodeProps={treeNodeProps}
        />,
      );
      const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

      expect(treeNodeListInstance.props.treeNodeProps).toEqual(treeNodeProps);
    });
  });

  describe('prop: treeNodeRefs', () => {
    it('should pass to TreeNodeList', () => {
      const treeNodeRefs = { current: undefined } as TreeNodeRefs;
      const testInstance = TestRenderer.create(
        <Tree
          nodes={nodes}
          treeNodeRefs={treeNodeRefs}
        />,
      );
      const treeNodeListInstance = testInstance.root.findByType(TreeNodeList);

      expect(treeNodeListInstance.props.treeNodeRefs).toEqual(treeNodeRefs);
    });
  });
});
