
import { MutableRefObject, ReactNode } from 'react';
import {
  TreeNodeDataShape,
  TreeNodeEntityShape,
  TreeNodePropShape,
  TreeNodeValue,
} from '@mezzanine-ui/core/tree';

export type TreeNodeProp = TreeNodePropShape<ReactNode>;
export type TreeNodeData = TreeNodeDataShape<ReactNode>;
export type TreeNodeEntity = TreeNodeEntityShape<ReactNode>;
export type TreeNodeEntities = Map<TreeNodeValue, TreeNodeEntity>;

export type TreeNodeRefsShape = Record<TreeNodeValue, HTMLLIElement>;
export type TreeNodeRefs = MutableRefObject<TreeNodeRefsShape | undefined>;

export type TreeExpandControl = {
  collapse: (value: TreeNodeValue) => void;
  collapseAll: () => void;
  collapseAllFrom: (value: TreeNodeValue) => void;
  expand: (value: TreeNodeValue) => void;
  expandAll: () => void;
  expandAllFrom: (value: TreeNodeValue) => void;
};
