import {
  forwardRef,
} from 'react';
import {
  selectClasses as classes,
} from '@mezzanine-ui/core/select';
import { TagSize } from '@mezzanine-ui/core/tag';
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

  return (
    <div ref={ref} className={classes.triggerTags}>
      {(value as SelectValue[]).map((selection) => (
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
    </div>
  );
});

export default SelectTriggerTags;
