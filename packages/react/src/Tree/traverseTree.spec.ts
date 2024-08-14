import { TreeNodeValue } from '@mezzanine-ui/core/tree';
import difference from 'lodash/difference';
import { traverseTree, TreeNodeData } from '.';

describe('traverseTree()', () => {
  it('should execute call back on each node', () => {
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

    const allNodeValues: TreeNodeValue[] = [
      '1',
      '1-1',
      '1-2',
      '1-1-1',
      '1-1-2',
      '1-1-3',
      '2',
    ];
    const visited: TreeNodeValue[] = [];

    traverseTree(nodes, (node) => {
      visited.push(node.value);
      expect(allNodeValues.includes(node.value));
    });

    expect(difference(visited, allNodeValues).length).toBe(0);
  });
});
