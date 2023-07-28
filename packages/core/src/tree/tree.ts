// Types
export type TreeSelectMethod = 'toggle' | 'target';
export type TreeSize = 'small' | 'medium' | 'large';
export type TreeNodeValue = string | number;
export interface TreeState {
  checkable?: boolean;
  disabled?: boolean;
  selectable?: boolean;
}

export type TreeNodeState = {
  disabled?: boolean;
  expanded?: boolean;
  indeterminate?: boolean;
  selected?: boolean;
};

export interface TreeNodePropShape<L> {
  label: L;
  dynamicNodesFetching?: boolean;
  nodes?: TreeNodePropShape<L>[];
  value: TreeNodeValue;
}

export interface TreeNodeDataShape<L>
  extends
  TreeNodeState,
  TreeNodePropShape<L> {
  label: L;
  nodes?: TreeNodeDataShape<L>[];
}
export interface TreeNodeEntityShape<L> {
  node: TreeNodeDataShape<L>
  siblings?: TreeNodeEntityShape<L>[];
  values: TreeNodeValue[];
}

// Classes
export const treePrefix = 'mzn-tree';
export const treeNodeListPrefix = `${treePrefix}-node-list`;
export const treeNodePrefix = `${treePrefix}-node`;

export const treeClasses = {
  host: treePrefix,

  /** tree node list classes */
  nodeList: treeNodeListPrefix,
  nodeListSize: (size: TreeSize) => `${treeNodeListPrefix}--${size}`,

  /** tree node classes */
  node: treeNodePrefix,
  nodeSize: (size: TreeSize) => `${treeNodePrefix}--${size}`,
  nodeStem: `${treeNodePrefix}__stem`,
  nodeCaret: `${treeNodePrefix}__caret`,
  nodeCaretExpanded: `${treeNodePrefix}__caret-expanded`,
  nodeLabel: `${treeNodePrefix}__label`,
  nodeLabelSelectable: `${treeNodePrefix}__label--selectable`,
  nodeLabelIndeterminate: `${treeNodePrefix}__label--indeterminate`,
  nodeLabelActive: `${treeNodePrefix}__label--active`,
  nodeLabelDisabled: `${treeNodePrefix}__label--disabled`,
};
