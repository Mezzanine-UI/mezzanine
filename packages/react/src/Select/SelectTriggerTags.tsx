import {
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
import { usePreviousValue } from '../hooks/usePreviousValue';
import { useComposeRefs } from '../hooks/useComposeRefs';
import { SelectValue } from './typings';
import Tag from '../Tag';

export interface SelectTriggerTagsProps {
  disabled?: boolean;
  onTagClose?: (target: SelectValue) => void;
  size?: TagSize;
  value?: SelectValue[];
}

const SelectTriggerTags = forwardRef<HTMLDivElement, SelectTriggerTagsProps>(function SelectTriggerTags(props, ref) {
  const {
    disabled,
    onTagClose,
    size = 'medium',
    value,
  } = props;

  const [tagsWidths, setTagsWidths] = useState<number[]>([]);
  const [wrapperWidth, setWrapperWidth] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const prevTagsWidths = usePreviousValue(tagsWidths);
  const prevWrapperWidth = usePreviousValue(wrapperWidth);
  const controlRef = useRef<HTMLDivElement>();
  const composedRef = useComposeRefs([ref, controlRef]);

  useEffect(() => {
    const elements = controlRef.current?.getElementsByClassName('mzn-tag');

    if (elements?.length) {
      const lengthArray = Array.from(elements).map((e) => e.clientWidth);
      const parentWidth = controlRef.current?.clientWidth || 0;

      setTagsWidths(lengthArray);
      setWrapperWidth(parentWidth);
    }
  }, [value]);

  useEffect(() => {
    const prevTagsTotal = prevTagsWidths.reduce((prev, curr) => prev + curr + 4, 0);
    const tagsTotal = tagsWidths.reduce((prev, curr) => prev + curr + 4, 0);

    if (prevTagsTotal < prevWrapperWidth && tagsTotal > wrapperWidth) {
      setCount(prevTagsWidths.length);
    } else if (prevTagsTotal > prevWrapperWidth && tagsTotal < wrapperWidth) {
      // setCount(tagsWidths.length);
    }
  }, [tagsWidths, prevTagsWidths, wrapperWidth, prevWrapperWidth]);

  return (
    <div ref={composedRef} className={classes.triggerTags}>
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
    </div>
  );
});

export default SelectTriggerTags;
