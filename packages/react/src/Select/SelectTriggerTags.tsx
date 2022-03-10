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
    const tagsTotal = tagsWidths.reduce((prev, curr) => prev + curr + 4, 0);

    if (tagsTotal > wrapperWidth) {
      setCount((c) => c + 1);
    }
  }, [tagsWidths, wrapperWidth]);

  return (
    <div ref={composedRef} className={classes.triggerTags}>
      {take(value, (value?.length || 0) - count).map((selection) => (
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
      {count > 0 ? (
        <Tag size={size}>
          {`+${count}...`}
        </Tag>
      ) : null}
    </div>
  );
});

export default SelectTriggerTags;
