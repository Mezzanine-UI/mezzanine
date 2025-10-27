'use client';

import {
  treeClasses as classes,
  TreeNodeValue,
  TreeSize,
} from '@mezzanine-ui/core/tree';
import { CaretRightIcon } from '@mezzanine-ui/icons';
import { forwardRef, useMemo, useContext } from 'react';
import Checkbox from '../Checkbox';
import Icon from '../Icon';
import { Collapse, CollapseProps } from '../Transition';
import Typography, { TypographyVariant } from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { TreeNodeData } from './typings';
import { MezzanineConfig } from '../Provider/context';
import Loading from '../Loading/Loading';

export type TreeNodeElementProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'li'>,
  'children' | 'value' | 'onSelect'
>;

export interface TreeNodeProps extends TreeNodeData, TreeNodeElementProps {
  /**
   * Provided children will be wrapped under `Collapse`.
   */
  children?: CollapseProps['children'];
  /**
   * The list item will be rendered as `Checkbox` if multiple set to true.
   * @default false
   */
  multiple?: boolean;
  /**
   * Handler for caret icon click event. Receive current node value as its argument.
   */
  onExpand?: (value: TreeNodeValue) => void;
  /**
   * Handler for label element click event. Receive current node value as its argument.
   * Must use with selectable setting to `true`.
   */
  onSelect?: (value: TreeNodeValue) => void;
  /**
   * Controls whether to be selectable.
   * @default false
   */
  selectable?: boolean;
  /**
   * Sizes for the layout.
   * @default 'medium'
   */
  size?: TreeSize;
}

/**
 * The react component for `mezzanine` tree node.
 */
const TreeNode = forwardRef<HTMLLIElement, TreeNodeProps>(
  function TreeNode(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      children,
      className,
      disabled,
      dynamicNodesFetching,
      expanded,
      indeterminate,
      label,
      multiple = false,
      onExpand: onExpandProp,
      onSelect: onSelectProp,
      selectable = false,
      selected,
      size = globalSize,
      value,
      ...restRootProps
    } = props;

    const variant: TypographyVariant = useMemo(() => {
      if (size === 'small') {
        return 'input3';
      }

      if (size === 'large') {
        return 'input1';
      }

      return 'input2';
    }, [size]);

    const onExpand = onExpandProp
      ? () => {
          onExpandProp(value);
        }
      : undefined;
    const onSelect =
      selectable && onSelectProp && !disabled
        ? () => {
            onSelectProp(value);
          }
        : undefined;

    const mayHaveChildren = children || dynamicNodesFetching;

    return (
      <li
        ref={ref}
        {...restRootProps}
        className={cx(classes.node, classes.nodeSize(size), className)}
      >
        <div className={classes.nodeStem}>
          {mayHaveChildren ? (
            <Icon
              icon={CaretRightIcon}
              className={cx(classes.nodeCaret, {
                [classes.nodeCaretExpanded]: expanded,
              })}
              role="button"
              onClick={onExpand}
            />
          ) : (
            <div />
          )}
          {multiple ? (
            <Checkbox
              checked={!!selected}
              disabled={disabled}
              indeterminate={indeterminate}
              onChange={onSelect}
              size={size}
              value={`${value}`}
            >
              {label}
            </Checkbox>
          ) : (
            <Typography
              component="span"
              variant={variant}
              onClick={onSelect}
              className={cx(classes.nodeLabel, {
                [classes.nodeLabelSelectable]: !children && selectable,
                [classes.nodeLabelIndeterminate]: indeterminate,
                [classes.nodeLabelActive]: selected,
                [classes.nodeLabelDisabled]: disabled,
              })}
            >
              {label}
            </Typography>
          )}
        </div>
        {mayHaveChildren && (
          <Collapse in={expanded} appear={false}>
            {children || <Loading loading iconProps={{ size: 16 }} />}
          </Collapse>
        )}
      </li>
    );
  },
);

export default TreeNode;
