import { Ref, forwardRef, useMemo, useRef } from 'react';
import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { TagSize } from '@mezzanine-ui/core/tag';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { useSelectTriggerTags } from './useSelectTriggerTags';
import { SelectValue } from './typings';
import Tag from '../Tag';
import { OverflowCounterTag } from '../OverflowTooltip';
import TagGroup from '../Tag/TagGroup';

export interface SelectTriggerTagsProps {
  disabled?: boolean;
  inputProps?: Omit<
    NativeElementPropsWithoutKeyAndRef<'input'>,
    | 'autoComplete'
    | 'children'
    | 'defaultValue'
    | 'disabled'
    | 'readOnly'
    | 'required'
    | 'type'
    | 'value'
    | `aria-${
        | 'autocomplete'
        | 'disabled'
        | 'haspopup'
        | 'multiline'
        | 'readonly'
        | 'required'}`
  >;
  inputRef?: Ref<HTMLInputElement>;
  onTagClose?: (target: SelectValue) => void;
  overflowStrategy: 'counter' | 'wrap';
  readOnly?: boolean;
  required?: boolean;
  searchText?: string;
  size?: TagSize;
  showTextInputAfterTags?: boolean;
  value?: SelectValue[];
}

const SelectTriggerTags = forwardRef<HTMLDivElement, SelectTriggerTagsProps>(
  function SelectTriggerTags(props, ref) {
    const {
      disabled,
      inputProps,
      inputRef,
      onTagClose,
      overflowStrategy,
      readOnly,
      required,
      searchText,
      size,
      showTextInputAfterTags,
      value = [],
    } = props;
    const wrapperRef = useRef<HTMLDivElement>(null);
    const tagsRef = useRef<HTMLDivElement>(null);
    const composedRef = useComposeRefs([ref, wrapperRef]);

    const { overflowSelections, renderFakeTags, visibleSelections } =
      useSelectTriggerTags({
        enabled: overflowStrategy === 'counter',
        containerRef: wrapperRef,
        tagsRef,
        value,
        size,
      });

    const displaySelections = useMemo(
      () => (overflowStrategy === 'counter' ? visibleSelections : value),
      [overflowStrategy, value, visibleSelections],
    );

    const tagChildren = useMemo(() => {
      const tags = displaySelections.map((selection) => {
        if (readOnly) {
          return (
            <Tag
              key={selection.id}
              type="static"
              size={size}
              label={selection.name}
              readOnly
            />
          );
        }

        return (
          <Tag
            key={selection.id}
            type="dismissable"
            disabled={disabled}
            onClose={(e) => {
              e.stopPropagation();
              onTagClose?.(selection);
            }}
            size={size}
            label={selection.name}
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

              onTagClose?.(target);
            }}
            readOnly={readOnly}
            tagSize={size}
            tags={overflowSelections.map((selection) => selection.name)}
          />,
        );
      }

      return tags;
    }, [
      disabled,
      displaySelections,
      onTagClose,
      overflowSelections,
      overflowStrategy,
      readOnly,
      size,
    ]);

    return (
      <div
        ref={composedRef}
        className={cx(classes.triggerTagsInputWrapper, {
          [classes.triggerTagsInputWrapperEllipsis]:
            overflowStrategy === 'counter',
        })}
      >
        <div
          ref={tagsRef}
          className={cx(classes.triggerTags, {
            [classes.triggerTagsEllipsis]: overflowStrategy === 'counter',
          })}
        >
          <TagGroup>{tagChildren}</TagGroup>

          {overflowStrategy === 'counter' ? renderFakeTags() : null}
        </div>

        {showTextInputAfterTags ? (
          <div className={classes.triggerTagsInput}>
            <input
              {...inputProps}
              ref={inputRef}
              aria-autocomplete="list"
              aria-disabled={disabled}
              aria-haspopup="listbox"
              aria-readonly={readOnly}
              aria-required={required}
              autoComplete="off"
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              type="search"
              value={searchText}
            />
          </div>
        ) : null}
      </div>
    );
  },
);

export default SelectTriggerTags;
