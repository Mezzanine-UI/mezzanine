'use client';

import { ChangeEventHandler, forwardRef, KeyboardEvent, MouseEvent, Ref, useId, useMemo } from 'react';

import Typography from '../Typography';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

import { selectionClasses as classes, SelectionDirection, SelectionImageObjectFit, SelectionType } from '@mezzanine-ui/core/selection';

import type { IconDefinition } from '@mezzanine-ui/icons';
import { FileIcon } from '@mezzanine-ui/icons';
import Icon from '../Icon';

// Icon size constant for Selection component
// Note: This value is component-specific and doesn't have a corresponding design token
const SELECTION_ICON_SIZE = 26;

export interface SelectionPropsBase
  extends Omit<NativeElementPropsWithoutKeyAndRef<'label'>, 'onChange'> {
  /**
   * Whether the selection is checked.
   */
  checked?: boolean;
  /**
   * Whether the selection is checked by default.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The type of selection.
   * @default 'radio'
   */
  selector: SelectionType;
  /**
   * If true, selection will be disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * The direction of selection.
   * @default 'horizontal'
   */
  direction?: SelectionDirection;
  /**
   * The image of selection. support image url.
   */
  image?: string;
  /**
   * The object fit of selection image.
   * @default 'cover'
   */
  imageObjectFit?: SelectionImageObjectFit;
  /**
   * The custom icon of selection.
   */
  customIcon?: IconDefinition;
  /**
   * The name of selection.
   * 
   * @important When using with react-hook-form or inside a RadioGroup/CheckboxGroup, this prop is recommended.
   */
  name?: string;
  /**
   * The description of selection.
   */
  id?: string;
  /**
   * The accessible text of selection.
   */
  text: string;
  /**
   * The accessible description of selection.
   */
  supportingText?: string;
  /**
   * Whether the selection is readonly.
   * @default false
   */
  readonly?: boolean;
  /**
   * The value of selection.
   * 
   * @important This prop is required when selection is inside a RadioGroup/CheckboxGroup.
   * It is also recommended when integrating with react-hook-form.
   */
  value?: string;
  /**
   * The react ref passed to input element.
   * 
   * @important When using with react-hook-form's `register`, pass the ref through this prop:
   * ```tsx
   * const { register } = useForm();
   * <Selection inputRef={register('fieldName').ref} name="fieldName" />
   * ```
   */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * Invoked by input change event.
   */
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export interface SelectionProps extends SelectionPropsBase {
  /**
   * Callback when the selection is clicked.
   */
  onClick?: (event: MouseEvent<HTMLLabelElement>) => void;
}

/**
 * The react component for `mezzanine` selection.
 */
const Selection = forwardRef<HTMLLabelElement, SelectionProps>(
  function Selection(props, ref) {
    const {
      checked: checkedProp,
      className,
      defaultChecked = false,
      disabled = false,
      direction = 'horizontal',
      id,
      image,
      imageObjectFit = 'cover',
      inputRef: inputRefProp,
      name,
      onChange: onChangeProp,
      readonly = false,
      selector = 'radio',
      supportingText,
      text,
      value,
      customIcon,
      onClick,
      ...rest
    } = props;

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const textId = useMemo(() => `${inputId}-text`, [inputId]);
    const supportingTextId = useMemo(() => `${inputId}-supporting-text`, [inputId]);

    const isRadioOrCheckbox = selector === 'radio' || selector === 'checkbox';
    const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      onChangeProp?.(event);
    };

    const haveImage = useMemo(() => Boolean(image && typeof image === 'string' && image.trim().length > 0), [image]);

    if (!text) {
      console.error('Selection: `text` (title) is required.');

      return null;
    }

    if (!supportingText) {
      console.warn('Selection: `supportingText` is optional but strongly recommended for better accessibility.');
    }

    return (
      <label
        {...rest}
        ref={ref}
        htmlFor={inputId}
        className={cx(
          classes.host,
          classes.direction(direction),
          {
            [classes.disabled]: disabled,
            [classes.readonly]: readonly,
          },
          className,
        )}
        {...(disabled && { 'aria-disabled': true })}
        {...(onClick && {
          onClick,
          onKeyDown: (e: KeyboardEvent<HTMLLabelElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              (e.currentTarget as HTMLLabelElement).click();
            }
          },
        })}
      >
        <div className={classes.container}>
          {
            haveImage
              ? <img
                src={image}
                alt={text}
                className={classes.selectionImage}
                style={{ objectFit: imageObjectFit }}
              />
              : <Icon
                aria-hidden="true"
                className={classes.icon}
                color="neutral-solid"
                icon={customIcon || FileIcon}
                size={SELECTION_ICON_SIZE}
              />
          }
          <div className={classes.content}>
            <Typography
              id={textId}
              color="text-neutral-solid"
              variant="body-highlight"
              className={classes.text}
            >
              {text}
            </Typography>
            {supportingText && (
              <Typography
                id={supportingTextId}
                color="text-neutral"
                variant="caption"
                className={classes.supportingText}
              >
                {supportingText}
              </Typography>
            )}
          </div>
        </div>
        {!readonly && (
          <input
            ref={inputRefProp}
            type={selector}
            name={name}
            id={inputId}
            className={classes.input}
            disabled={disabled}
            {...(checkedProp !== undefined
              ? { checked: checkedProp }
              : { defaultChecked })}
            value={value}
            onChange={onInputChange}
            {...(isRadioOrCheckbox && checkedProp !== undefined
              ? { 'aria-checked': checkedProp }
              : {})}
            aria-labelledby={textId}
            aria-describedby={supportingText ? supportingTextId : undefined}
          />
        )}
      </label>
    );
  },
);

export default Selection;

