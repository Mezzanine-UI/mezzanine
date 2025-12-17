'use client';

import {
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useState,
  useRef,
  useEffect,
} from 'react';
import {
  textFieldClasses as classes,
  TextFieldSize,
} from '@mezzanine-ui/core/text-field';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useTextFieldControl } from './useTextFieldControl';
import ClearActions from '../ClearActions';
import { useComposeRefs } from '../hooks/useComposeRefs';

/**
 * Padding info provided to children function
 */
export interface TextFieldPaddingInfo {
  /**
   * ClassName that applies the same padding as TextField's current size.
   * Use this when you want to move padding from TextField to input/textarea.
   */
  paddingClassName: string;
}

/**
 * Base props shared by all TextField variants
 */
export interface TextFieldBaseProps
  extends Omit<
    NativeElementPropsWithoutKeyAndRef<'div'>,
    'children' | 'defaultValue' | 'onChange' | 'prefix'
  > {
  /**
   * Whether the field is active (focused/opened/expanded).
   * @default false
   */
  active?: boolean;
  /**
   * The input/textarea element, or a function that receives padding info.
   * When using function form, TextField will not apply padding (you control it).
   */
  children: ReactNode | ((paddingInfo: TextFieldPaddingInfo) => ReactNode);
  /**
   * Additional class name to apply to the root element.
   */
  className?: string;
  /**
   * Whether to show the clear button.
   * @default false
   */
  clearable?: boolean;
  /**
   * Whether the field is in error state.
   * @default false
   */
  error?: boolean;
  /**
   * Whether the field should take the full width of its container.
   * @default true
   */
  fullWidth?: boolean;
  /**
   * The callback will be fired after clear icon clicked.
   */
  onClear?: MouseEventHandler;
  /**
   * The size of field.
   * @default 'main'
   */
  size?: TextFieldSize;
  /**
   * Whether the field is in warning state.
   * @default false
   */
  warning?: boolean;
}

/**
 * Affix props - prefix and suffix
 */
export type TextFieldAffixProps = {
  /**
   * The prefix addon of the field.
   */
  prefix?: ReactNode;
  /**
   * The suffix addon of the field.
   */
  suffix?: ReactNode;
};

/**
 * Interactive state - typing, disabled, and readonly are mutually exclusive
 */
export type TextFieldInteractiveStateProps =
  | {
      /**
       * Whether the user is currently typing.
       * If not provided, will be auto-detected.
       */
      typing?: boolean;
      disabled?: never;
      readonly?: never;
    }
  | {
      typing?: never;
      /**
       * Whether the field is disabled.
       * @default false
       */
      disabled: true;
      readonly?: never;
    }
  | {
      typing?: never;
      disabled?: never;
      /**
       * Whether the field is readonly.
       * @default false
       */
      readonly: true;
    }
  | {
      typing?: never;
      disabled?: never;
      readonly?: never;
    };

export type TextFieldProps = TextFieldBaseProps &
  TextFieldAffixProps &
  TextFieldInteractiveStateProps;

/**
 * The react component for `mezzanine` text field.
 */
const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(props, ref) {
    const {
      active = false,
      children,
      className,
      clearable = false,
      disabled,
      error = false,
      fullWidth = true,
      onClear,
      onClick: onClickProps,
      onKeyDown: onKeyDownProps,
      prefix,
      readonly,
      role: roleProp,
      size = 'main',
      suffix,
      typing: typingProp,
      warning,
      ...rest
    } = props;

    const [isTyping, setIsTyping] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hostRef = useComposeRefs([ref, containerRef]);

    const typing =
      disabled || readonly
        ? false
        : typeof typingProp !== 'undefined'
          ? typingProp
          : isTyping;

    useEffect(() => {
      if (typingProp !== undefined || disabled || readonly) return;

      const container = containerRef.current;
      if (!container) return;

      const input = container.querySelector('input, textarea');
      if (!input) return;

      const handleInput = () => {
        setIsTyping(true);
      };

      const handleBlur = () => {
        setIsTyping(false);
      };

      input.addEventListener('input', handleInput, false);
      input.addEventListener('mousedown', handleInput, false);
      input.addEventListener('blur', handleBlur, false);

      return () => {
        input.removeEventListener('input', handleInput, false);
        input.removeEventListener('mousedown', handleInput, false);
        input.removeEventListener('blur', handleBlur, false);
      };
    }, [typingProp, disabled, readonly]);

    const { role, onClick, onKeyDown } = useTextFieldControl({
      onClick: onClickProps,
      onKeyDown: onKeyDownProps,
    });

    const isChildrenFunction = typeof children === 'function';

    const paddingInfo: TextFieldPaddingInfo = {
      paddingClassName: cx(
        classes.inputPadding,
        size === 'main' ? classes.inputPaddingMain : classes.inputPaddingSub,
      ),
    };

    const renderedChildren = isChildrenFunction
      ? children(paddingInfo)
      : children;

    return (
      <div
        {...rest}
        ref={hostRef}
        role={roleProp || role}
        onClick={(evt) => {
          evt.stopPropagation();

          onClick?.(evt);
        }}
        onKeyDown={onKeyDown}
        className={cx(
          classes.host,
          {
            [classes.slimGap]: (prefix && suffix) || clearable,
            [classes.main]: size === 'main',
            [classes.sub]: size === 'sub',
            [classes.clearable]: clearable,
            [classes.disabled]: disabled,
            [classes.error]: error,
            [classes.fullWidth]: fullWidth,
            [classes.noPadding]: isChildrenFunction,
            [classes.readonly]: readonly,
            [classes.typing]: typing,
            [classes.active]: active,
            [classes.warning]: warning,
          },
          className,
        )}
      >
        {prefix && <div className={classes.prefix}>{prefix}</div>}
        {renderedChildren}
        {clearable && (
          <ClearActions
            type="clearable"
            className={classes.clearIcon}
            onClick={(event) => {
              if (!disabled && !readonly && onClear) {
                onClear(event);
              }
            }}
            onMouseDown={(event) => event.preventDefault()}
            tabIndex={-1}
          />
        )}
        {suffix && <div className={classes.suffix}>{suffix}</div>}
      </div>
    );
  },
);

export default TextField;
