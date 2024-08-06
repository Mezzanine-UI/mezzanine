import { treeClasses as classes, TreeNodeValue } from '@mezzanine-ui/core/tree';
import { forwardRef } from 'react';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import TreeNode, { TreeNodeElementProps, TreeNodeProps } from './TreeNode';
import { TreeNodeData, TreeNodeRefs } from './typings';

export type TreeNodeListElementProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'ul'>,
  'children' | 'onSelect'
>;

export interface TreeNodeListProps
  extends TreeNodeListElementProps,
    Pick<
      TreeNodeProps,
      'multiple' | 'onExpand' | 'onSelect' | 'selectable' | 'size'
    > {
  /**
   * Given nodes will be passed to `TreeNode` component orderly.
   */
  nodes?: TreeNodeData['nodes'];
  /**
   * Other props you may provide to `TreeNode` component. A common use-case is to override classes and styles.
   */
  treeNodeProps?: TreeNodeElementProps;
  /**
   * Provide if you want to access every list element. Paired with node key and the element.
   * Usage example: `const treeNodeRefs = useRef<TreeNodeRefsShape | undefined>(undefined)`
   */
  treeNodeRefs?: TreeNodeRefs;
}

/**
 * The react component for `mezzanine` tree node list.
 */
const TreeNodeList = forwardRef<HTMLUListElement, TreeNodeListProps>(
  (props, ref) => {
    const {
      className,
      multiple,
      nodes,
      onExpand,
      onSelect,
      selectable,
      size = 'medium',
      treeNodeProps,
      treeNodeRefs,
      ...restRootProp
    } = props;

    const getNodeRefHandler = treeNodeRefs
      ? (value: TreeNodeValue) => (node: HTMLLIElement) => {
          treeNodeRefs.current = {
            ...treeNodeRefs.current,
            [value]: node,
          };
        }
      : undefined;

    if (!nodes?.length) return null;

    return (
      <ul
        {...restRootProp}
        ref={ref}
        className={cx(classes.nodeList, classes.nodeListSize(size), className)}
      >
        {nodes.map((node) => {
          const { value, nodes: siblingNodes, ...restNodeProps } = node;

          return (
            <TreeNode
              key={value}
              ref={getNodeRefHandler?.(value)}
              {...treeNodeProps}
              multiple={multiple}
              onExpand={onExpand}
              onSelect={onSelect}
              selectable={selectable}
              size={size}
              value={value}
              {...restNodeProps}
            >
              {siblingNodes?.length ? (
                <TreeNodeList
                  {...restRootProp}
                  className={className}
                  multiple={multiple}
                  nodes={siblingNodes}
                  onExpand={onExpand}
                  onSelect={onSelect}
                  selectable={selectable}
                  size={size}
                  treeNodeRefs={treeNodeRefs}
                />
              ) : undefined}
            </TreeNode>
          );
        })}
      </ul>
    );
  },
);

export default TreeNodeList;
