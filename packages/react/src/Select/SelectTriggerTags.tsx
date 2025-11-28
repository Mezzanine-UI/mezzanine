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
  ellipsis: boolean;
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
      ellipsis,
      inputProps,
      inputRef,
      onTagClose,
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
        enabled: ellipsis,
        containerRef: wrapperRef,
        tagsRef,
        value,
        size,
      });

    const displaySelections = useMemo(
      () => (ellipsis ? visibleSelections : value),
      [ellipsis, value, visibleSelections],
    );

    const tagChildren = useMemo(() => {
      const tags = displaySelections.map((selection) => (
        <Tag
          key={selection.id}
          type="dismissable"
          disabled={disabled}
          onClose={(e) => {
            e.stopPropagation();
            onTagClose?.(selection);
          }}
          readOnly={readOnly}
          size={size}
          label={selection.name}
        />
      ));

      if (ellipsis && overflowSelections.length) {
        tags.push(
          <OverflowCounterTag
            key="overflow-counter"
            // TODO: tbc
            // disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onTagDismiss={(tagIndex) => {
              const target = overflowSelections[tagIndex];

              if (!target) return;

              onTagClose?.(target);
            }}
            tagSize={size}
            tags={overflowSelections.map((selection) => selection.name)}
          />,
        );
      }

      return tags;
    }, [
      disabled,
      displaySelections,
      ellipsis,
      onTagClose,
      overflowSelections,
      readOnly,
      size,
    ]);

    return (
      <div
        ref={composedRef}
        className={cx(classes.triggerTagsInputWrapper, {
          [classes.triggerTagsInputWrapperEllipsis]: ellipsis,
        })}
      >
        <div
          ref={tagsRef}
          className={cx(classes.triggerTags, {
            [classes.triggerTagsEllipsis]: ellipsis,
          })}
        >
          <TagGroup>{tagChildren}</TagGroup>

          {ellipsis ? renderFakeTags() : null}
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
