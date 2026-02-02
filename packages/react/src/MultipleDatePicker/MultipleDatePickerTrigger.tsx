'use client';

import {
  forwardRef,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { DateType } from '@mezzanine-ui/core/calendar';
import { multipleDatePickerClasses as classes } from '@mezzanine-ui/core/multiple-date-picker';
import { TagSize } from '@mezzanine-ui/core/tag';
import TextField, { TextFieldProps } from '../TextField';
import Tag from '../Tag';
import TagGroup from '../Tag/TagGroup';
import { OverflowCounterTag } from '../OverflowTooltip';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { useSelectTriggerTags } from '../Select/useSelectTriggerTags';

export interface DateValue {
  id: string;
  name: string;
  date: DateType;
}

export interface MultipleDatePickerTriggerProps
  extends Omit<
    TextFieldProps,
    | 'active'
    | 'children'
    | 'defaultChecked'
    | 'disabled'
    | 'readonly'
    | 'typing'
  > {
  /**
   * Whether the panel is currently open (for styling)
   */
  active?: boolean;
  /**
   * Whether the trigger is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * Callback when a tag is closed (date removed)
   */
  onTagClose?: (date: DateType) => void;
  /**
   * Overflow strategy for tags display
   * @default 'counter'
   */
  overflowStrategy?: 'counter' | 'wrap';
  /**
   * Placeholder text when no dates are selected
   */
  placeholder?: string;
  /**
   * Whether the trigger is readonly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Custom suffix element (e.g., calendar icon)
   */
  suffix?: ReactNode;
  /**
   * The selected date values for display
   */
  value?: DateValue[];
}

/**
 * The trigger component for MultipleDatePicker.
 * Displays selected dates as tags within a TextField.
 */
const MultipleDatePickerTrigger = forwardRef<
  HTMLDivElement,
  MultipleDatePickerTriggerProps
>(function MultipleDatePickerTrigger(props, ref) {
  const {
    active = false,
    className,
    clearable = true,
    disabled = false,
    error = false,
    fullWidth = false,
    onTagClose,
    overflowStrategy = 'counter',
    placeholder,
    readOnly = false,
    size = 'main',
    suffix,
    value = [],
    ...restTextFieldProps
  } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposeRefs([ref, wrapperRef]);

  const tagSize: TagSize = size === 'main' ? 'main' : 'sub';

  // Convert DateValue[] to SelectValue[] for useSelectTriggerTags
  const selectValues = useMemo(
    () => value.map((v) => ({ id: v.id, name: v.name })),
    [value],
  );

  const { overflowSelections, renderFakeTags, visibleSelections } =
    useSelectTriggerTags({
      containerRef: wrapperRef,
      enabled: overflowStrategy === 'counter',
      size: tagSize,
      tagsRef,
      value: selectValues,
    });

  const displaySelections = useMemo(
    () => (overflowStrategy === 'counter' ? visibleSelections : selectValues),
    [overflowStrategy, selectValues, visibleSelections],
  );

  // Find the original DateValue by id
  const findDateValue = useCallback(
    (id: string): DateValue | undefined => value.find((v) => v.id === id),
    [value],
  );

  const handleTagClose = useCallback(
    (id: string): MouseEventHandler =>
      (e) => {
        e.stopPropagation();
        const dateValue = findDateValue(id);

        if (dateValue && onTagClose) {
          onTagClose(dateValue.date);
        }
      },
    [findDateValue, onTagClose],
  );

  const tagChildren = useMemo(() => {
    const tags = displaySelections.map((selection) => {
      if (readOnly) {
        return (
          <Tag
            key={selection.id}
            label={selection.name}
            readOnly
            size={tagSize}
            type="static"
          />
        );
      }

      return (
        <Tag
          disabled={disabled}
          key={selection.id}
          label={selection.name}
          onClose={handleTagClose(selection.id)}
          size={tagSize}
          type="dismissable"
        />
      );
    });

    if (overflowStrategy === 'counter' && overflowSelections.length) {
      tags.push(
        <OverflowCounterTag
          disabled={disabled}
          key="overflow-counter"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onTagDismiss={(tagIndex) => {
            const target = overflowSelections[tagIndex];

            if (!target) return;

            const dateValue = findDateValue(target.id);

            if (dateValue && onTagClose) {
              onTagClose(dateValue.date);
            }
          }}
          readOnly={readOnly}
          tagSize={tagSize}
          tags={overflowSelections.map((s) => s.name)}
        />,
      );
    }

    return tags;
  }, [
    disabled,
    displaySelections,
    findDateValue,
    handleTagClose,
    onTagClose,
    overflowSelections,
    overflowStrategy,
    readOnly,
    tagSize,
  ]);

  const hasValue = value.length > 0;

  // TextField requires disabled and readonly to be mutually exclusive
  let interactiveProps = {};

  if (disabled) {
    interactiveProps = { disabled: true as const };
  } else if (readOnly) {
    interactiveProps = { readonly: true as const };
  }

  return (
    <TextField
      {...restTextFieldProps}
      {...interactiveProps}
      active={active}
      className={cx(
        classes.trigger,
        {
          [classes.triggerSelected]: hasValue,
          [classes.triggerDisabled]: disabled,
          [classes.triggerReadOnly]: readOnly,
        },
        className,
      )}
      clearable={!readOnly && clearable && hasValue}
      error={error}
      fullWidth={fullWidth}
      ref={composedRef}
      size={size}
      suffix={suffix}
    >
      {hasValue ? (
        <div
          className={cx(classes.triggerTagsWrapper, {
            [classes.triggerTagsWrapperEllipsis]:
              overflowStrategy === 'counter',
          })}
        >
          <div
            className={cx(classes.triggerTags, {
              [classes.triggerTagsEllipsis]: overflowStrategy === 'counter',
            })}
            ref={tagsRef}
          >
            <TagGroup>{tagChildren}</TagGroup>
            {overflowStrategy === 'counter' ? renderFakeTags() : null}
          </div>
          {/* Hidden input for accessibility */}
          <input
            aria-disabled={disabled}
            aria-multiline={false}
            aria-readonly={readOnly}
            className={cx(classes.triggerInput, classes.triggerInputAbsolute)}
            disabled={disabled}
            readOnly
            tabIndex={-1}
            type="text"
            value=""
          />
        </div>
      ) : (
        <input
          aria-disabled={disabled}
          aria-multiline={false}
          aria-readonly={readOnly}
          className={classes.triggerInput}
          disabled={disabled}
          placeholder={placeholder}
          readOnly
          tabIndex={-1}
          type="text"
          value=""
        />
      )}
    </TextField>
  );
});

export default MultipleDatePickerTrigger;
