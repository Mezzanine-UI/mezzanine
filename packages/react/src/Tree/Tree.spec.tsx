import { TreeNodeValue, TreeSize } from '@mezzanine-ui/core/tree';
import { RefObject } from 'react';
import { act, cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Tree, {
  TreeNodeRefs,
  TreeExpandControl,
  TreeNodeProp,
  traverseTree,
} from '.';

const mockTreeNodeListRender = jest.fn();
const OriginalTreeNodeList = jest.requireActual('./TreeNodeList').default;

jest.mock('./TreeNodeList', () => {
  return function MockTreeNodeList(props: any) {
    mockTreeNodeListRender(props);
    const React = require('react');
    return React.createElement(OriginalTreeNodeList, props);
  };
});

const mockTreeNodeRender = jest.fn();
const OriginalTreeNode = jest.requireActual('./TreeNode').default;

jest.mock('./TreeNode', () => {
  return function MockTreeNode(props: any) {
    mockTreeNodeRender(props);
    const React = require('react');
    return React.createElement(OriginalTreeNode, props);
  };
});

describe('<Tree />', () => {
  const nodes: TreeNodeProp[] = [
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

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(<Tree ref={ref} nodes={nodes} />),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(<Tree className={className} nodes={nodes} />),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(<Tree nodes={nodes} />);
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-tree')).toBeTruthy();
  });

  it('should render nodes with TreeNodeList', () => {
    mockTreeNodeListRender.mockClear();
    render(<Tree nodes={nodes} />);
    const calls = mockTreeNodeListRender.mock.calls;
    const treeNodeListProps = calls[calls.length - 1][0];

    nodes.forEach((node, i) => {
      expect(node.value).toEqual(treeNodeListProps.nodes[i].value);
    });
  });

  describe('expand functionality', () => {
    it('should have expand handler on icon if node has siblings', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(<Tree nodes={nodes} />);
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-icon');

      expect(
        document.querySelector('.mzn-tree-node-list .mzn-tree-node-list'),
      ).toBe(null);

      fireEvent.click(iconElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(
        document.querySelector('.mzn-tree-node-list .mzn-tree-node-list'),
      ).toBeInstanceOf(HTMLElement);
    });

    it('should toggle sibling list', () => {
      jest.useFakeTimers();

      const { getHostHTMLElement } = render(<Tree nodes={nodes} />);
      const element = getHostHTMLElement();
      const iconElement = element.querySelector('.mzn-icon');

      expect(
        document.querySelector('.mzn-tree-node-list .mzn-tree-node-list'),
      ).toBe(null);

      fireEvent.click(iconElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(
        document.querySelector('.mzn-tree-node-list .mzn-tree-node-list'),
      ).toBeInstanceOf(HTMLElement);

      fireEvent.click(iconElement!);

      act(() => {
        jest.runAllTimers();
      });

      expect(
        document.querySelector('.mzn-tree-node-list .mzn-tree-node-list'),
      ).toBe(null);
    });
  });

  describe('values can be either TreeNodeValue or array of TreeNodeValue', () => {
    it('case: TreeNodeValue', () => {
      const values = '1-1-1';
      mockTreeNodeRender.mockClear();
      render(<Tree nodes={nodes} values={values} defaultExpandAll />);
      const calls = mockTreeNodeRender.mock.calls;
      const targetCall = calls.find((call) => call[0].value === '1-1-1');

      expect(targetCall[0].selected).toBe(true);
    });

    it('case: TreeNodeValue[]', () => {
      const values = ['1-1-1', '1-1-2'];
      mockTreeNodeRender.mockClear();
      render(<Tree nodes={nodes} values={values} defaultExpandAll />);
      const calls = mockTreeNodeRender.mock.calls;
      const firstTargetCall = calls.find((call) => call[0].value === '1-1-1');
      const secondTargetCall = calls.find((call) => call[0].value === '1-1-2');

      expect(firstTargetCall[0].selected).toBe(true);
      expect(secondTargetCall[0].selected).toBe(true);
    });
  });

  describe('prop: defaultExpandAll', () => {
    it('default collapse all', () => {
      const { getHostHTMLElement } = render(<Tree nodes={nodes} />);
      const element = getHostHTMLElement();
      const expandedNodes = element.querySelectorAll(
        '.mzn-tree-node--expanded',
      );

      expect(expandedNodes.length).toBe(0);
    });

    it('should expand all list if defaultExpandAll=true on first render', () => {
      const allNodeValues: TreeNodeValue[] = [];

      traverseTree(nodes, (node) => {
        allNodeValues.push(node.value);
      });

      mockTreeNodeRender.mockClear();
      render(<Tree nodes={nodes} defaultExpandAll />);
      const calls = mockTreeNodeRender.mock.calls;

      allNodeValues.forEach((value) => {
        const targetCall = calls.find((call) => call[0].value === value);

        expect(targetCall).toBeTruthy();
      });
    });
  });

  describe('prop: expandControllerRef', () => {
    it('should not get handlers if `expandedValues` prop is provided', () => {
      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

      render(
        <Tree
          nodes={nodes}
          expandControllerRef={expandControllerRef}
          expandedValues={[]}
        />,
      );

      expect(expandControllerRef.current).toBe(null);
    });

    it('should get controllers if expandControllerRef is provided', () => {
      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

      render(<Tree nodes={nodes} expandControllerRef={expandControllerRef} />);

      expect(expandControllerRef.current?.collapse).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.collapseAll).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.collapseAllFrom).toBeInstanceOf(
        Function,
      );
      expect(expandControllerRef.current?.expand).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.expandAll).toBeInstanceOf(Function);
      expect(expandControllerRef.current?.expandAllFrom).toBeInstanceOf(
        Function,
      );
    });

    it('control collapse: should collapse target', () => {
      jest.useFakeTimers();

      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

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

      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

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

      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

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

      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

      const { getByText } = render(
        <Tree nodes={nodes} expandControllerRef={expandControllerRef} />,
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

      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

      const { getByText } = render(
        <Tree nodes={nodes} expandControllerRef={expandControllerRef} />,
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

      const expandControllerRef = {
        current: null,
      } as RefObject<TreeExpandControl | null>;

      const { getByText } = render(
        <Tree nodes={nodes} expandControllerRef={expandControllerRef} />,
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

      mockTreeNodeListRender.mockClear();
      render(<Tree nodes={nodes} multiple={multiple} />);

      const calls = mockTreeNodeListRender.mock.calls;
      const treeNodeListProps = calls[calls.length - 1][0];

      expect(treeNodeListProps.multiple).toEqual(multiple);
    });

    it('prop onSelect should only bind to leaf elements when multiple is falsy', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} defaultExpandAll onSelect={onSelect} selectable />,
      );
      const targetLabelElement = getByText('label 1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toHaveBeenCalledTimes(0);
    });

    it('prop onSelect should receive target value in the returned array if multiple is falsy', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree nodes={nodes} defaultExpandAll onSelect={onSelect} selectable />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(expect.arrayContaining(['1-1-1']));
    });

    it('prop onSelect should receive multiple value in the returned array if multiple=true', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree
          nodes={nodes}
          defaultExpandAll
          onSelect={onSelect}
          selectable
          multiple
        />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(expect.arrayContaining(['1-1-1']));

      const secondTargetLabelElement = getByText('label 1-1-2');

      fireEvent.click(secondTargetLabelElement);

      expect(onSelect).toHaveBeenCalledTimes(2);
      expect(onSelect).toHaveBeenCalledWith(expect.arrayContaining(['1-1-2']));
    });
  });

  describe('prop: selectMethod', () => {
    it('default to "toggle" which toggles the target value', () => {
      const onSelect = jest.fn();
      const { getByText } = render(
        <Tree
          nodes={nodes}
          defaultExpandAll
          onSelect={onSelect}
          selectable
          values={['1-1-1']}
        />,
      );
      const targetLabelElement = getByText('label 1-1-1');

      fireEvent.click(targetLabelElement);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(
        expect.not.arrayContaining(['1-1-1']),
      );
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

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(expect.arrayContaining(['1-1-1']));
    });
  });

  describe('prop: selectable', () => {
    it('default to falsy', () => {
      mockTreeNodeListRender.mockClear();
      render(<Tree nodes={nodes} />);
      const calls = mockTreeNodeListRender.mock.calls;
      const treeNodeListProps = calls[calls.length - 1][0];

      expect(treeNodeListProps.onSelect).toBe(undefined);
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
      mockTreeNodeListRender.mockClear();
      render(<Tree nodes={nodes} size={size} />);
      const calls = mockTreeNodeListRender.mock.calls;
      const treeNodeListProps = calls[calls.length - 1][0];

      expect(treeNodeListProps.size).toEqual(size);
    });
  });

  describe('prop: treeNodeListProps', () => {
    it('properties should pass to TreeNodeList', () => {
      const className = 'foo';
      mockTreeNodeListRender.mockClear();
      render(
        <Tree
          nodes={nodes}
          treeNodeListProps={{
            className,
          }}
        />,
      );
      const calls = mockTreeNodeListRender.mock.calls;
      const treeNodeListProps = calls[calls.length - 1][0];

      expect(treeNodeListProps.className).toEqual(className);
    });
  });

  describe('prop: treeNodeProps', () => {
    it('should pass to TreeNodeList', () => {
      const treeNodeProps = {
        className: 'foo',
      };
      mockTreeNodeListRender.mockClear();
      render(<Tree nodes={nodes} treeNodeProps={treeNodeProps} />);
      const calls = mockTreeNodeListRender.mock.calls;
      const treeNodeListPropsObj = calls[calls.length - 1][0];

      expect(treeNodeListPropsObj.treeNodeProps).toEqual(treeNodeProps);
    });
  });

  describe('prop: treeNodeRefs', () => {
    it('should pass to TreeNodeList', () => {
      const treeNodeRefs = { current: undefined } as TreeNodeRefs;
      mockTreeNodeListRender.mockClear();
      render(<Tree nodes={nodes} treeNodeRefs={treeNodeRefs} />);
      const calls = mockTreeNodeListRender.mock.calls;
      const treeNodeListProps = calls[calls.length - 1][0];

      expect(treeNodeListProps.treeNodeRefs).toEqual(treeNodeRefs);
    });
  });
});
