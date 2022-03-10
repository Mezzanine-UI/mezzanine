import {
  Ref,
  forwardRef,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  selectClasses as classes,
} from '@mezzanine-ui/core/select';
import { TagSize } from '@mezzanine-ui/core/tag';
import take from 'lodash/take';
import { cx } from '../utils/cx';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { SelectValue } from './typings';
import Tag from '../Tag';

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
    | 'required'
    }`
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

const SelectTriggerTags = forwardRef<HTMLDivElement, SelectTriggerTagsProps>(function SelectTriggerTags(props, ref) {
  const {
    disabled,
    ellipsis,
    inputProps,
    inputRef,
    onTagClose,
    readOnly,
    required,
    searchText,
    size = 'medium',
    showTextInputAfterTags,
    value,
  } = props;

  const [tagsWidths, setTagsWidths] = useState<number[]>([]);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const controlRef = useRef<HTMLDivElement>();
  const composedRef = useComposeRefs([ref, controlRef]);

  useEffect(() => {
    const elements = controlRef.current?.getElementsByClassName('mzn-tag');

    if (elements?.length) {
      const lengthArray = Array.from(elements).map((e) => e.clientWidth);
      const parentWidth = controlRef.current?.clientWidth || 0;

      setTagsWidths(lengthArray);
      setMaxWidth(parentWidth * 0.8 - 60);
    }
  }, [value]);

  useEffect(() => {
    const tagsTotal = tagsWidths.reduce((prev, curr) => prev + curr + 4, 0);

    if (tagsTotal > maxWidth) {
      setCount(tagsWidths.length - 1);
    } else {
      // setCount(0);
    }
  }, [tagsWidths, maxWidth]);

  return (
    <div
      ref={composedRef}
      className={cx(
        classes.triggerTagsInputWrapper,
        {
          [classes.triggerTagsInputWrapperEllipsis]: ellipsis,
        },
      )}
    >
      <div
        className={cx(
          classes.triggerTags,
          {
            [classes.triggerTagsEllipsis]: ellipsis,
          },
        )}
      >
        {ellipsis ? (
          <>
            {take(value, count > 0 ? count : value?.length).map((selection) => (
              <Tag
                key={selection.id}
                closable
                disabled={disabled}
                onClose={(e) => {
                  e.stopPropagation();
                  onTagClose?.(selection);
                }}
                size={size}
              >
                {selection.name}
              </Tag>
            ))}
            {value && count > 0 && value.length > count ? (
              <Tag size={size}>
                {`+${value.length - count}...`}
              </Tag>
            ) : null}
          </>
        ) : (
          <>
            {value?.map((selection) => (
              <Tag
                key={selection.id}
                closable
                disabled={disabled}
                onClose={(e) => {
                  e.stopPropagation();
                  onTagClose?.(selection);
                }}
                size={size}
              >
                {selection.name}
              </Tag>
            ))}
          </>
        )}
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
            autoComplete="false"
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
});

export default SelectTriggerTags;
