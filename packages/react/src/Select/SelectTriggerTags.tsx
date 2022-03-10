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
  const [ellipsisTagWidth, setEllipsisTagWidth] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [takeCount, setTakeCount] = useState<number>(0);
  const controlRef = useRef<HTMLDivElement>();
  const composedRef = useComposeRefs([ref, controlRef]);

  useEffect(() => {
    const elements = controlRef.current?.getElementsByClassName('fake-tag');
    const ellipsisTagElement = controlRef.current?.getElementsByClassName('fake-ellipsis-tag')[0];

    if (elements?.length && ellipsisTagElement) {
      const lengthArray = Array.from(elements).map((e) => e.clientWidth);
      const parentWidth = controlRef.current?.clientWidth || 0;

      setTagsWidths(lengthArray);
      setMaxWidth(parentWidth * 0.7);
      setEllipsisTagWidth(ellipsisTagElement.clientWidth);
    }
  }, [value]);

  useEffect(() => {
    function calcTakeCount() {
      let targetCount = 0;

      for (let count = 0; count <= tagsWidths.length; count += 1) {
        const prevTotal = take(tagsWidths, count).reduce((prev, curr) => prev + curr, 0);
        const nowTotal = take(tagsWidths, count + 1).reduce((prev, curr) => prev + curr, 0);

        targetCount = count;

        if (prevTotal < maxWidth && nowTotal > maxWidth) {
          if (prevTotal + ellipsisTagWidth > maxWidth) {
            targetCount -= 1;
          }

          break;
        }
      }

      setTakeCount(targetCount);
    }

    calcTakeCount();
  }, [tagsWidths, maxWidth, ellipsisTagWidth]);

  const renderFakeTags = () => {
    if (value && value.length === tagsWidths.length) return null;

    return (
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        {value?.map((selection) => (
          <Tag
            key={selection.id}
            className="fake-tag"
            closable
            disabled
            size={size}
          >
            {selection.name}
          </Tag>
        ))}
        <Tag disabled className="fake-ellipsis-tag" size={size}>
          +99...
        </Tag>
      </div>
    );
  };

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
        {renderFakeTags()}
        {ellipsis ? (
          <>
            {take(value, takeCount > 0 ? takeCount : value?.length).map((selection) => (
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
            {value && takeCount > 0 && value.length > takeCount ? (
              <Tag size={size}>
                {`+${value.length - takeCount}...`}
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
