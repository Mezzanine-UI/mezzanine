import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import { useState } from 'react';
import { toggleValue } from './toggleValue';
import { traverseTree } from './traverseTree';
import { TreeNodeListProps } from './TreeNodeList';
import { TreeNodeProp } from './typings';

export interface UseTreeExpandedValueProps {
  defaultExpandAll?: boolean;
  expandedValues?: TreeNodeValue[];
  nodes: TreeNodeProp[];
  onExpand?: TreeNodeListProps['onExpand'];
}

export function useTreeExpandedValue(props: UseTreeExpandedValueProps) {
  const {
    defaultExpandAll,
    expandedValues: expandedValuesProp,
    nodes,
    onExpand: onExpandProp,
  } = props;

  const [expandedValues, setExpandedValues] = useState(() => {
    if (expandedValuesProp) {
      return [];
    }

    const currentExpandedValues: TreeNodeValue[] = [];

    if (defaultExpandAll) {
      traverseTree(nodes, (node) => {
        if (node.nodes) {
          currentExpandedValues.push(node.value);
        }
      });
    }

    return currentExpandedValues;
  });

  const onExpand: TreeNodeListProps['onExpand'] = (value) => {
    const newExpandedValues = toggleValue(value, expandedValues);

    setExpandedValues(newExpandedValues);
    onExpandProp?.(value);
  };

  return {
    expandedValues: expandedValuesProp || expandedValues,
    onExpand: expandedValuesProp ? onExpandProp : onExpand,
    setExpandedValues,
  };
}
