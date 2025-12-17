import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import intersection from 'lodash/intersection';
import { getTreeNodeEntities, traverseTree, TreeNodeData } from '.';

describe('getTreeNodeEntities()', () => {
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
              nodes: [
                {
                  label: 'label 1-1-1-1',
                  value: '1-1-1-1',
                },
                {
                  label: 'label 1-1-1-2',
                  value: '1-1-1-2',
                },
                {
                  label: 'label 1-1-1-3',
                  value: '1-1-1-3',
                },
              ],
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

  it('should get all entities', () => {
    const allNodeValues: TreeNodeValue[] = [
      '1',
      '1-1',
      '1-2',
      '1-1-1',
      '1-1-2',
      '1-1-3',
      '1-1-1-1',
      '1-1-1-2',
      '1-1-1-3',
      '2',
    ];

    const entities = getTreeNodeEntities({ nodes });

    allNodeValues.forEach((value) => {
      expect(entities.get(value)).not.toBeFalsy();
    });
  });

  it('while expandedValues is provided, any value within the array should be marked expanded on the entity', () => {
    const expandedValues: TreeNodeValue[] = ['1', '1-1'];

    const entities = getTreeNodeEntities({ nodes, expandedValues });

    entities.forEach(({ node }) => {
      if (expandedValues.includes(node.value)) {
        expect(node.expanded).toBe(true);
      } else {
        expect(node.expanded).toBeFalsy();
      }
    });
  });

  it('while selectedValue is provided, any value within the array should be marked selected on the entity', () => {
    const selectedValues: TreeNodeValue[] = ['1-1-1-1', '1-1-1-2'];

    const entities = getTreeNodeEntities({ nodes, selectedValues });

    entities.forEach(({ node }) => {
      if (selectedValues.includes(node.value)) {
        expect(node.selected).toBe(true);
      } else {
        expect(node.selected).toBeFalsy();
      }
    });
  });

  it('while selectedValue is provided, all parent nodes of each selectedValue should be marked as indeterminate or selected', () => {
    const selectedValues: TreeNodeValue[] = ['1-1-1', '1-1-2'];

    const entities = getTreeNodeEntities({ nodes, selectedValues });

    entities.forEach(({ node, values }) => {
      if (!selectedValues.includes(node.value)) {
        if (values.every((v) => selectedValues.includes(v))) {
          expect(node.selected).toBe(true);
        } else if (intersection(selectedValues, values).length) {
          expect(node.indeterminate).toBe(true);
        } else {
          expect(node.indeterminate).toBeFalsy();
        }
      }
    });
  });

  it('while selectedValue is provided, the node whose direct sibling values are all marked as selected should be selected as well', () => {
    const selectedValues: TreeNodeValue[] = ['1-1-1-1', '1-1-1-2', '1-1-1-3'];

    const entities = getTreeNodeEntities({
      nodes,
      selectedValues,
      multiple: true,
    });
    const targetEntity = entities.get('1-1-1')!;

    expect(targetEntity.node.selected).toBe(true);
  });

  it('while selectedValue is provided, the node whose leaf values are all marked as selected should be selected as well', () => {
    const selectedValues: TreeNodeValue[] = [
      '1-1-1-1',
      '1-1-1-2',
      '1-1-1-3',
      '1-1-2',
      '1-1-3',
    ];

    const entities = getTreeNodeEntities({
      nodes,
      selectedValues,
      multiple: true,
    });
    const targetEntity = entities.get('1-1')!;

    expect(targetEntity.node.selected).toBe(true);
  });

  it('should includes node value in entity values property if includeNodeValue=true', () => {
    const entities = getTreeNodeEntities({
      nodes,
      includeNodeValue: true,
    });

    entities.forEach((entity) => {
      expect(entity.values.includes(entity.node.value));

      if (entity.node.nodes) {
        traverseTree(entity.node.nodes, (node) => {
          expect(entity.values.includes(node.value));
        });
      }
    });
  });

  describe('disable', () => {
    it('should disable the values within the "disabledValues" array and also their parents.', () => {
      const disabledValues: TreeNodeValue[] = ['1-1-1', '1-1-2', '1-1-3'];

      const entities = getTreeNodeEntities({ nodes, disabledValues });

      disabledValues.forEach((value) => {
        const targetEntity = entities.get(value)!;

        expect(targetEntity.node.disabled).toBe(true);
      });

      const parentEntity = '1-1';

      expect(entities.get(parentEntity)!.node.disabled).toBe(true);
    });

    it('should disable the sibling values of values in the "disabledValues" array.', () => {
      const disabledValues: TreeNodeValue[] = ['1-1'];
      const siblingValues = ['1-1-1', '1-1-2', '1-1-3'];

      const entities = getTreeNodeEntities({ nodes, disabledValues });

      expect(entities.get(disabledValues[0])!.node.disabled).toBe(true);

      siblingValues.forEach((value) => {
        const targetEntity = entities.get(value)!;

        expect(targetEntity.node.disabled).toBe(true);
      });
    });
  });
});
