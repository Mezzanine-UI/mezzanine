'use client';

import { forwardRef, Ref, useRef } from 'react';
import { textareaClasses as classes } from '@mezzanine-ui/core/textarea';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useComposeRefs } from '../hooks/useComposeRefs';
import TextField from '../TextField';
import Icon from '../Icon';
import { ResizeHandleIcon } from '@mezzanine-ui/icons';

export type TextareaProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'textarea'>,
  'disabled' | 'readOnly'
> & {
  /** ClassName apply to textarea */
  textareaClassName?: string;
  /** The react ref passed to textarea element. */
  textareaRef?: Ref<HTMLTextAreaElement>;
  /** Controls textarea CSS `resize` behavior with native `resize` values. */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical';
} & (
    | {
        /**  Set visual style type of the textarea. */
        type?: 'default';
        /** Disabled state of the taxtarea, Only available on default type. */
        disabled?: boolean;
        /** ReadOnly state of the textarea, Only available on default type. */
        readOnly?: boolean;
      }
    | { type: 'warning' | 'error'; disabled?: never; readOnly?: never }
  );

/**
 * The react component for `mezzanine` textarea.
 */
const Textarea = forwardRef<HTMLDivElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      className,
      disabled,
      readOnly,
      textareaClassName,
      textareaRef: textareaRefProp,
      type = 'default',
      resize,
      ...textareaProps
    } = props;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const composedTextareaRef = useComposeRefs([textareaRefProp, textareaRef]);

    const interactiveProps =
      type === 'default'
        ? disabled
          ? ({ disabled: true } as const)
          : readOnly
            ? ({ readonly: true } as const)
            : {}
        : {};

    return (
      <TextField
        {...interactiveProps}
        ref={ref}
        className={cx(classes.host, className)}
        error={type === 'error'}
        warning={type === 'warning'}
      >
        <textarea
          {...textareaProps}
          className={cx(classes.textarea, textareaClassName)}
          ref={composedTextareaRef}
          disabled={disabled}
          readOnly={readOnly}
          style={{ resize, ...textareaProps.style }}
        />

        {resize !== 'none' && (
          <Icon icon={ResizeHandleIcon} size={16} className={classes.resizer} />
        )}
      </TextField>
    );
  },
);

export default Textarea;
