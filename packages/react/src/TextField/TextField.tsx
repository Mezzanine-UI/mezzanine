'use client';

import {
  forwardRef,
  MouseEventHandler,
  ReactNode,
  cloneElement,
  ReactElement,
  useContext,
} from 'react';
import { TimesIcon } from '@mezzanine-ui/icons';
import {
  textFieldClasses as classes,
  TextFieldSize,
} from '@mezzanine-ui/core/text-field';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useTextFieldControl } from './useTextFieldControl';
import Icon from '../Icon';
import { MezzanineConfig } from '../Provider/context';

export interface TextFieldProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'defaultValue' | 'onChange' | 'prefix'
  > {
  /**
   * Whether the field is active.
   */
  active?: boolean;
  className?: string;
  /**
   * Whether to show the clear button.
   * @default false
   */
  clearable?: boolean;
  /**
   * Whether the field is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the field is error.
   * @default false
   */
  error?: boolean;
  /**
   * If `true`, set width: 100%.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The callback will be fired after clear icon clicked.
   */
  onClear?: MouseEventHandler;
  /**
   * The prefix addon of the field.
   */
  prefix?: ReactNode;
  /**
   * The size of field.
   * @default 'medium'
   */
  size?: TextFieldSize;
  /**
   * The suffix addon of the field.
   */
  suffix?: ReactNode;
  suffixActionIcon?: ReactElement<HTMLElement>;
}

/**
 * The react component for `mezzanine` input.
 */
const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      active = false,
      children,
      className,
      clearable = false,
      disabled = false,
      error = false,
      fullWidth,
      onClear,
      onClick: onClickProps,
      onKeyDown: onKeyDownProps,
      prefix,
      role: roleProp,
      size = globalSize,
      suffix,
      suffixActionIcon,
      ...rest
    } = props;

    const { role, onClick, onKeyDown } = useTextFieldControl({
      onClick: onClickProps,
      onKeyDown: onKeyDownProps,
    });

    return (
      <div
        {...rest}
        ref={ref}
        role={roleProp || role}
        onClick={(evt) => {
          evt.stopPropagation();

          onClick?.(evt);
        }}
        onKeyDown={onKeyDown}
        className={cx(
          classes.host,
          classes.size(size),
          {
            [classes.active]: active,
            [classes.clearable]: clearable,
            [classes.disabled]: disabled,
            [classes.error]: error,
            [classes.fullWidth]: fullWidth,
            [classes.withPrefix]: prefix,
            [classes.withSuffix]: suffix || suffixActionIcon,
          },
          className,
        )}
      >
        {prefix && <div className={classes.prefix}>{prefix}</div>}
        {children}
        {suffix && <div className={classes.suffix}>{suffix}</div>}
        {suffixActionIcon &&
          cloneElement(suffixActionIcon, {
            className: cx(classes.actionIcon, suffixActionIcon.props.className),
            role: 'button',
            tabIndex: -1,
          })}
        {clearable && (
          <Icon
            className={classes.clearIcon}
            icon={TimesIcon}
            onClick={(event) => {
              if (!disabled && onClear) {
                onClear(event);
              }
            }}
            onMouseDown={(event) => event.preventDefault()}
            role="button"
            tabIndex={-1}
          />
        )}
      </div>
    );
  },
);

export default TextField;
