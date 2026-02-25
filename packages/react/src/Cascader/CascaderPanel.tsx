'use client';

import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';
import { CaretRightIcon, CheckedIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';
import { cx } from '../utils/cx';
import { CascaderOption } from './typings';

export interface CascaderPanelProps {
  /**
   * The id of the currently active (navigating) option.
   */
  activeId?: string;
  /**
   * The max height for the panel.
   */
  maxHeight?: number | string;
  /**
   * Called when an option is clicked.
   * `isLeaf` is true if the option has no children.
   */
  onSelect: (option: CascaderOption, isLeaf: boolean) => void;
  /**
   * The options to render in this panel.
   */
  options: CascaderOption[];
  /**
   * The id of the confirmed selected option at this level.
   */
  selectedId?: string;
}

export default function CascaderPanel({
  activeId,
  maxHeight,
  onSelect,
  options,
  selectedId,
}: CascaderPanelProps) {
  return (
    <div
      className={classes.panel}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {options.map((option) => {
          const isLeaf = !option.children || option.children.length === 0;
          const isActive = option.id === activeId;
          const isSelected = option.id === selectedId;

          return (
            <li
              key={option.id}
              className={cx(
                classes.item,
                isActive && classes.itemActive,
                isSelected && classes.itemSelected,
                option.disabled && classes.itemDisabled,
              )}
              onClick={() => {
                if (!option.disabled) {
                  onSelect(option, isLeaf);
                }
              }}
            >
              <span className={classes.itemLabel}>{option.name}</span>
              <span className={classes.itemAppend}>
                {isLeaf ? (
                  isSelected && <Icon icon={CheckedIcon} />
                ) : (
                  <Icon icon={CaretRightIcon} />
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
