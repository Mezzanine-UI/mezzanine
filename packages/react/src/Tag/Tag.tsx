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
 * The react component for `mezzanine` tag.
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
