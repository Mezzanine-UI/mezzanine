import { forwardRef, MouseEventHandler, useContext } from 'react';
import { tagClasses as classes, TagSize } from '@mezzanine-ui/core/tag';
import { TimesIcon } from '@mezzanine-ui/icons';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import Icon from '../Icon';
import { MezzanineConfig } from '../Provider/context';

export interface TagProps extends NativeElementPropsWithoutKeyAndRef<'span'> {
  /**
   * Whether the tag can be closed.
   * @default false
   */
  closable?: boolean;
  /**
   * Whether the tag disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback executed while tag closed.
   */
  onClose?: MouseEventHandler;
  /**
   * The size of the tag.
   * @default 'medium'
   */
  size?: TagSize;
}

/**
 * The react component for `mezzanine` tag.
 */
const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(props, ref) {
  const { size: globalSize } = useContext(MezzanineConfig);
  const {
    children,
    className,
    closable = false,
    disabled = false,
    onClose,
    size = globalSize,
    ...rest
  } = props;

  return (
    <span
      {...rest}
      ref={ref}
      aria-disabled={disabled}
      className={cx(
        classes.host,
        classes.size(size),
        {
          [classes.disabled]: disabled,
        },
        className,
      )}
    >
      <span className={classes.label}>{children}</span>
      {closable && (
        <Icon
          className={classes.closeIcon}
          icon={TimesIcon}
          onClick={(event) => {
            if (!disabled && onClose) {
              onClose(event);
            }
          }}
          tabIndex={-1}
        />
      )}
    </span>
  );
});

export default Tag;
