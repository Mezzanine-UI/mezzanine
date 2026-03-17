'use client';

import { forwardRef } from 'react';
import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { cx } from '../utils/cx';
import { TagProps } from './typings';
import Badge from '../Badge';
import Icon from '../Icon';
import { PlusIcon } from '@mezzanine-ui/icons';
import { CloseIcon } from '@mezzanine-ui/icons';

const getTagType = (props: TagProps) => props.type ?? 'static';

const isTagType = <T extends NonNullable<TagProps['type']>>(
  props: TagProps,
  current: T,
): props is Extract<TagProps, { type?: T }> => getTagType(props) === current;

/**
 * 標籤元件，用於分類、篩選或標記內容，支援靜態、計數、可關閉及可新增四種模式。
 *
 * 透過 `type` prop 切換顯示模式：`static` 純標籤（預設）、`counter` 帶數字的標籤、
 * `dismissable` 含關閉按鈕、`addable` 含新增按鈕。`overflow-counter` 適用於收合多餘標籤並顯示剩餘數量。
 * `dismissable` 與 `addable` 模式支援 `active` 和 `disabled` 狀態。
 *
 * @example
 * ```tsx
 * import Tag from '@mezzanine-ui/react/Tag';
 *
 * // 靜態標籤
 * <Tag type="static" label="設計" />
 *
 * // 計數標籤
 * <Tag type="counter" label="待處理" count={3} />
 *
 * // 可關閉標籤
 * <Tag type="dismissable" label="React" onClose={() => removeTag('React')} />
 *
 * // 可新增標籤（按鈕形式）
 * <Tag type="addable" label="新增標籤" onClick={handleAdd} />
 *
 * // 收合溢出的標籤數量
 * <Tag type="overflow-counter" count={5} onClick={handleExpand} />
 * ```
 *
 * @see {@link TagGroup} 以群組方式管理多個標籤
 */
const Tag = forwardRef<HTMLSpanElement | HTMLButtonElement, TagProps>(
  function Tag(props, ref) {
    const {
      active,
      className,
      disabled,
      onClick,
      onClose: _onClose,
      readOnly,
      size = 'main',
      type: _type,
      ...rest
    } = props;

    const tagType = _type ?? 'static';

    const commonClassName = cx(
      classes.host,
      classes.size(size),
      classes.type(tagType),
      {
        [classes.disabled]: disabled,
        [classes.active]: active,
        [classes.readOnly]: readOnly,
      },
      className,
    );

    if (isTagType(props, 'overflow-counter')) {
      const { count } = props;

      return (
        <button
          {...rest}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={commonClassName}
        >
          <Icon className={classes.icon} icon={PlusIcon} size={16} />
          <span className={classes.label}>{count}</span>
        </button>
      );
    }

    if (isTagType(props, 'addable')) {
      const { label } = props;

      return (
        <button
          {...rest}
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={commonClassName}
        >
          <Icon className={classes.icon} icon={PlusIcon} size={16} />
          <span className={classes.label}>{label}</span>
        </button>
      );
    }

    return (
      <span
        {...rest}
        ref={ref as React.Ref<HTMLSpanElement>}
        aria-disabled={disabled}
        className={commonClassName}
      >
        {isTagType(props, 'static') && (
          <span className={classes.label}>{props.label}</span>
        )}

        {isTagType(props, 'counter') && (
          <>
            <span className={classes.label}>{props.label}</span>
            <Badge variant="count-info" count={props.count} />
          </>
        )}

        {isTagType(props, 'dismissable') && (
          <>
            <span className={classes.label}>{props.label}</span>

            <button
              className={classes.closeButton}
              type="button"
              onClick={props.onClose}
              disabled={disabled}
            >
              <Icon className={classes.icon} icon={CloseIcon} size={16} />
            </button>
          </>
        )}
      </span>
    );
  },
);

export default Tag;
