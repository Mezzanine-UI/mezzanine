import {
  treeClasses as classes,
  TreeNodeValue,
  TreeSelectMethod,
} from '@mezzanine-ui/core/tree';
import {
  forwardRef,
  Ref,
  useImperativeHandle,
  useMemo,
} from 'react';
import castArray from 'lodash/castArray';
import without from 'lodash/without';
import uniq from 'lodash/uniq';
import { getTreeNodeEntities, GetTreeNodeEntitiesProps } from './getTreeNodeEntities';
import { toggleValueWithStatusControl } from './toggleValue';
import { traverseTree } from './traverseTree';
import TreeNodeList, {
  TreeNodeListElementProps,
  TreeNodeListProps,
} from './TreeNodeList';
import {
  TreeExpandControl,
  TreeNodeProp,
} from './typings';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { cx } from '../utils/cx';
import { useTreeExpandedValue } from './useTreeExpandedValue';

export interface TreeProps
  extends
  Pick<TreeNodeListProps,
  | 'multiple'
  | 'selectable'
  | 'size'
  | 'treeNodeProps'
  | 'treeNodeRefs'
  | 'onExpand'
  >,
  Omit<NativeElementPropsWithoutKeyAndRef<'div'>,
  | 'children'
  | 'defaultChecked'
  | 'defaultValue'
  | 'onChange'
  | 'onSelect'
  > {
  /**
   * Controls whether to expand all at first render.
   */
  defaultExpandAll?: boolean;
  /**
   * Provide if certain nodes should be disabled.
   * Notice that there are two conditions for auto disabling.
   * First, if the siblings are all disabled, the parent will be disabled as well.
   * Second, if the parent is disabled, all its siblings will be disabled as well.
   */
  disabledValues?: GetTreeNodeEntitiesProps['disabledValues'];
  /**
   * Provide if access to expand control is needed.
   */
  expandControllerRef?: Ref<TreeExpandControl | null>;
  /**
   * By default expanded values of `Tree` is uncontrolled.
   * However, you may specify `expandedValues` to gain full control.
   * If that's the case, you should provide `onExpand` as well.
   * Notices that if `expandedValues` is provided, `expandControllerRef` will not get the control methods.
   */
  expandedValues?: TreeNodeValue[];
  /**
   * By default Tree only passes the leaf values to the select handler.
   * If you want to include all the node values, set `includeNodeValue` to `true`.
   */
  includeNodeValue?: GetTreeNodeEntitiesProps['includeNodeValue'];
  /**
   * The nodes to be rendered in `Tree`
   */
  nodes: TreeNodeProp[];
  /**
   * By default expanded values of `Tree` is uncontrolled, where `onExpand` is not needed.
   * However, you may specify `expandedValues` to gain full control
   * and that's where you should provide `onExpand` together.
   */
  onExpand?: TreeNodeListProps['onExpand'];
  /**
   * Select handler for `Tree`. Receives all the current selected values as its argument.
   */
  onSelect?: (selectedValues: TreeNodeValue[]) => void;
  /**
   * Controls the singular select logic.
   * `Toggle` means the value will be toggled.
   * `Target` means the target value will always be the result value and will not deselect if click again.
   * @default 'toggle''
   */
  selectMethod?: TreeSelectMethod;
  /**
   * Other `ul` props you may provide to `TreeNodeList` component.
   * A common use-case is to override classes and styles.
   */
  treeNodeListProps?: TreeNodeListElementProps;
  /**
   * The selected values are controlled values. Should be use with `selectable`.
   */
  values?: TreeNodeValue | TreeNodeValue[];
}

/**
 * The react component for `mezzanine` tree.
 */
const Tree = forwardRef<HTMLDivElement, TreeProps>(
  function Tree(props, ref) {
    const {
      className,
      defaultExpandAll,
      disabledValues,
      expandControllerRef,
      expandedValues: expandedValuesProp,
      includeNodeValue,
      multiple,
      nodes,
      onExpand: onExpandProp,
      onSelect: onSelectProp,
      selectMethod = 'toggle',
      selectable,
      size,
      treeNodeListProps,
      treeNodeProps,
      treeNodeRefs,
      values,
      ...restRootProp
    } = props;
    const selectedValues: TreeNodeValue[] | undefined = values ? castArray(values) : undefined;
    const {
      expandedValues,
      onExpand,
      setExpandedValues,
    } = useTreeExpandedValue({
      nodes,
      defaultExpandAll,
      expandedValues: expandedValuesProp,
      onExpand: onExpandProp,
    });

    const treeEntities = useMemo(() => getTreeNodeEntities({
      disabledValues,
      expandedValues,
      includeNodeValue,
      multiple,
      nodes,
      selectedValues,
    }), [
      disabledValues,
      expandedValues,
      includeNodeValue,
      multiple,
      nodes,
      selectedValues,
    ]);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const displayNodes = nodes.map((node) => treeEntities.get(node.value)!.node);

    const getAllExpandSiblingValues = (value: TreeNodeValue) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentEntity = treeEntities.get(value)!;
      const allSiblingEntities = currentEntity.siblings;
      const allSiblingNodes = allSiblingEntities?.map(({ node }) => node);
      const allNodeValues = [];

      if (allSiblingNodes?.length) {
        allNodeValues.push(currentEntity.node.value);

        traverseTree(allSiblingNodes, (node) => {
          if (node.nodes?.length) {
            allNodeValues.push(node.value);
          }
        });
      }

      return allNodeValues;
    };

    const collapse = (value: TreeNodeValue) => {
      setExpandedValues(expandedValues.filter((v) => v !== value));
    };

    const collapseAll = () => {
      const allNodeValues = nodes.reduce<TreeNodeValue[]>((acc, currentNode) => (
        [...acc, ...getAllExpandSiblingValues(currentNode.value)] as TreeNodeValue[]
      ), [] as TreeNodeValue[]);

      const uniqAllNodeValues = uniq(allNodeValues);

      const newExpandedValues = without(expandedValues, ...uniqAllNodeValues);

      setExpandedValues(newExpandedValues);
    };

    const collapseAllFrom = (value: TreeNodeValue) => {
      const allNodeValues = getAllExpandSiblingValues(value);

      const newExpandedValues = without(expandedValues, ...allNodeValues);

      setExpandedValues(newExpandedValues);
    };

    const expand = (value: TreeNodeValue) => {
      setExpandedValues(uniq([...expandedValues, value]));
    };

    const expandAll = () => {
      const allNodeValues = nodes.reduce<TreeNodeValue[]>((acc, currentNode) => (
        [...acc, ...getAllExpandSiblingValues(currentNode.value)] as TreeNodeValue[]
      ), [] as TreeNodeValue[]);

      const newExpandedValues = uniq([...expandedValues, ...allNodeValues]);

      setExpandedValues(newExpandedValues);
    };

    const expandAllFrom = (value: TreeNodeValue) => {
      const allNodeValues = getAllExpandSiblingValues(value);

      const newExpandedValues = uniq([...expandedValues, ...allNodeValues]);

      setExpandedValues(newExpandedValues);
    };

    useImperativeHandle(expandControllerRef, () => {
      if (expandedValuesProp) {
        return null;
      }

      return {
        collapse,
        collapseAll,
        collapseAllFrom,
        expand,
        expandAll,
        expandAllFrom,
      };
    });

    const onMultipleSelect: TreeNodeListProps['onSelect'] = onSelectProp
      ? (value) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const targetEntity = treeEntities.get(value)!;
        const { selected } = targetEntity.node;

        const newCheckedValues = toggleValueWithStatusControl(
          !!selected,
          targetEntity.values,
          selectedValues || [],
        );

        onSelectProp(newCheckedValues);
      }
      : undefined;

    const onSingleSelect: TreeNodeListProps['onSelect'] = onSelectProp
      ? (value) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const targetEntity = treeEntities.get(value)!;
        const { selected } = targetEntity.node;

        if (!targetEntity.siblings?.length) {
          if (selectMethod === 'target') {
            onSelectProp([value]);
          } else {
            const newCheckedValues = toggleValueWithStatusControl(
              !!selected,
              targetEntity.values,
              [],
            );

            onSelectProp(newCheckedValues);
          }
        }
      }
      : undefined;

    const selectHandler = multiple ? onMultipleSelect : onSingleSelect;
    const onSelect = selectable ? selectHandler : undefined;

    return (
      <div
        ref={ref}
        className={cx(
          classes.host,
          className,
        )}
        {...restRootProp}
      >
        <TreeNodeList
          {...treeNodeListProps}
          multiple={multiple}
          nodes={displayNodes}
          onExpand={onExpand}
          onSelect={onSelect}
          selectable={selectable}
          size={size}
          treeNodeProps={treeNodeProps}
          treeNodeRefs={treeNodeRefs}
        />
      </div>
    );
  },
);

export default Tree;
