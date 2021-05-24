import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import xor from 'lodash/xor';
import { TreeNodeData, TreeNodeEntities, TreeNodeEntity } from './typings';

export interface GetTreeNodeEntitiesProps {
  expandedValues?: TreeNodeValue[];
  includeNodeValue?: boolean;
  nodes: TreeNodeData[];
  selectedValues?: TreeNodeValue[];
  disabledValues?: TreeNodeValue[];
}

export function getTreeNodeEntities({
  expandedValues,
  includeNodeValue = false,
  nodes,
  selectedValues,
  disabledValues,
}: GetTreeNodeEntitiesProps): TreeNodeEntities {
  const entities: TreeNodeEntities = new Map();
  const selectedValueMap = selectedValues?.length
    ? new Map(selectedValues.map((val) => [val, true]))
    : undefined;
  const expandedValueMap = expandedValues?.length
    ? new Map(expandedValues.map((val) => [val, true]))
    : undefined;
  const disabledValueMap = disabledValues?.length
    ? new Map(disabledValues.map((val) => [val, true]))
    : undefined;

  function getTreeEntity(
    node: TreeNodeData,
    parentDisabled?: boolean,
  ): TreeNodeEntity {
    const {
      nodes: currentSiblings,
      value,
    } = node;
    const selected = selectedValueMap?.get(value);
    const expanded = expandedValueMap?.get(value);
    const disabled = disabledValueMap?.get(value);
    const entity: TreeNodeEntity = {
      node: {
        ...node,
        disabled: parentDisabled || disabled,
        expanded,
        selected,
      },
      values: [],
    };

    if (!currentSiblings?.length) {
      entities.set(entity.node.value, entity);
      entity.values.push(value);

      return entity;
    }

    type SiblingsResult = {
      anyIndeterminate: boolean,
      directSiblings: TreeNodeValue[],
      disabledValues: TreeNodeValue[],
      selectedValues: TreeNodeValue[],
      siblingNodes: TreeNodeData[],
      siblings: TreeNodeEntity[],
      values: TreeNodeValue[],
    };
    const {
      anyIndeterminate,
      directSiblings,
      disabledValues: siblingDisabledValues,
      selectedValues: siblingSelectedValues,
      siblingNodes,
      siblings: siblingEntities,
      values: siblingValues,
    } = currentSiblings.reduce<SiblingsResult>((acc, sibling) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const siblingEntity = getTreeEntity(sibling, parentDisabled || disabled)!;
      const currentAnyIndeterminate = (
        siblingEntity.node.indeterminate ||
        acc.anyIndeterminate
      );

      return {
        anyIndeterminate: currentAnyIndeterminate,
        directSiblings: [...acc.directSiblings, siblingEntity.node.value],
        disabledValues: siblingEntity.node.disabled
          ? [...acc.disabledValues, siblingEntity.node.value]
          : acc.disabledValues,
        selectedValues: siblingEntity.node.selected
          ? [...acc.selectedValues, siblingEntity.node.value]
          : acc.selectedValues,
        siblingNodes: [...acc.siblingNodes, siblingEntity.node],
        siblings: [...acc.siblings, siblingEntity],
        values: [...acc.values, ...siblingEntity.values],
      };
    }, {
      anyIndeterminate: false,
      directSiblings: [],
      disabledValues: [],
      selectedValues: [],
      siblingNodes: [],
      siblings: [],
      values: [],
    });

    entity.node.nodes = siblingNodes;
    entity.siblings = siblingEntities;
    entity.values.push(...siblingValues);

    if (includeNodeValue) {
      entity.values.push(value);
    }

    const shouldDisabled = siblingDisabledValues.length && !xor(siblingDisabledValues, directSiblings).length;

    if (!disabled && shouldDisabled) {
      entity.node.disabled = true;
    }

    if (anyIndeterminate && !disabled && !shouldDisabled) {
      entity.node.selected = false;
      entity.node.indeterminate = true;

      entities.set(entity.node.value, entity);

      return entity;
    }

    const allDirectSiblingChecked = !!(
      siblingSelectedValues.length && !xor(siblingSelectedValues, directSiblings).length
    );

    entity.node.selected = allDirectSiblingChecked;
    entity.node.indeterminate = allDirectSiblingChecked ? false : !!siblingSelectedValues.length;

    entities.set(entity.node.value, entity);

    return entity;
  }

  nodes.forEach((node) => {
    getTreeEntity(node, disabledValueMap?.get(node.value));
  });

  return entities;
}
