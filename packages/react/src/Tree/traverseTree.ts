import { TreeNodeData } from './typings';

export function traverseTree(
  nodes: TreeNodeData[],
  callback: (node: TreeNodeData, parent?: TreeNodeData) => void,
  parent?: TreeNodeData,
) {
  nodes.forEach((node) => {
    const {
      nodes: siblingNodes,
    } = node;

    callback(node, parent);

    if (siblingNodes) {
      traverseTree(siblingNodes, callback, node);
    }
  });
}
