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
    | {
        /** 文字區域類型：警告或錯誤狀態。 */
        type: 'warning' | 'error';
        /** 警告/錯誤狀態下不適用。 */
        disabled?: never;
        /** 警告/錯誤狀態下不適用。 */
        readOnly?: never;
      }
  );

/**
 * 多行文字輸入區域元件，支援禁用、唯讀、警告與錯誤等視覺狀態。
 *
 * 以 `TextField` 作為外框容器，`type` 控制視覺樣式（`default`、`warning`、`error`），
 * `disabled` 與 `readOnly` 僅在 `type="default"` 時有效。`resize` prop 對應原生 CSS
 * `resize` 屬性，設為非 `none` 時會顯示右下角的調整大小拖曳圖示。
 *
 * @example
 * ```tsx
 * import Textarea from '@mezzanine-ui/react/Textarea';
 *
 * // 基本用法
 * <Textarea placeholder="請輸入內容..." rows={4} />
 *
 * // 允許垂直縮放
 * <Textarea resize="vertical" rows={3} />
 *
 * // 錯誤狀態
 * <Textarea type="error" value={text} onChange={(e) => setText(e.target.value)} />
 *
 * // 禁用狀態
 * <Textarea disabled placeholder="此欄位已停用" />
 * ```
 *
 * @see {@link Input} 單行文字輸入元件
 * @see {@link FormField} 表單欄位容器，可整合 label 與錯誤訊息
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
      resize = 'none',
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
