'use client';

import { forwardRef } from 'react';
import { tagClasses as classes } from '@mezzanine-ui/core/tag';
import { cx } from '../utils/cx';
import { TagProps } from './typings';
import Badge from '../Badge';
import Icon from '../Icon';
import { PlusIcon } from '@mezzanine-ui/icons';
import { CloseIcon } from '@mezzanine-ui/icons';

/**
 * The react component for `mezzanine` tag.
 */
const Tag = forwardRef<HTMLSpanElement | HTMLButtonElement, TagProps>(
  function Tag(props, ref) {
    const {
      active,
      className,
      count,
      disabled,
      label,
      onClick,
      onClose,
      readOnly,
      size = 'main',
      type,
      ...rest
    } = props;

    const commonClassName = cx(
      classes.host,
      classes.size(size),
      classes.type(type),
      {
        [classes.disabled]: disabled,
        [classes.active]: active,
        [classes.readOnly]: readOnly,
      },
      className,
    );

    if (type === 'overflow-counter') {
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

    if (type === 'addable') {
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
        {type === 'static' && <span className={classes.label}>{label}</span>}

        {type === 'counter' && (
          <>
            <span className={classes.label}>{label}</span>
            <Badge variant="count-info" count={count} />
          </>
        )}

        {type === 'dismissable' && (
          <>
            <span className={classes.label}>{label}</span>
            {!readOnly && (
              <button
                className={classes.closeButton}
                type="button"
                onClick={onClose}
                aria-label="Dismiss tag"
                disabled={disabled}
              >
                <Icon className={classes.icon} icon={CloseIcon} size={16} />
              </button>
            )}
          </>
        )}
      </span>
    );
  },
);

export default Tag;
