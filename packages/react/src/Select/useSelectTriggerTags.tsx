/* global JSX */
import {
  MutableRefObject,
  useState,
  useEffect,
} from 'react';
import { TagSize } from '@mezzanine-ui/core/tag';
import take from 'lodash/take';
import { SelectValue } from './typings';
import Tag from '../Tag';

export interface UseSelectTriggerTagsProps {
  controlRef: MutableRefObject<HTMLDivElement | undefined>;
  size?: TagSize;
  value?: SelectValue[];
}

export interface UseSelectTriggerTagsValue {
  renderFakeTags: () => JSX.Element | null;
  takeCount: number;
}

export function calcTakeCount({
  tagsWidths,
  maxWidth,
  ellipsisTagWidth,
  setTakeCount,
} : {
  tagsWidths: number[],
  maxWidth: number,
  ellipsisTagWidth: number,
  setTakeCount: (count: number) => void,
}) {
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

export function useSelectTriggerTags(props: UseSelectTriggerTagsProps): UseSelectTriggerTagsValue {
  const {
    controlRef,
    value,
    size,
  } = props;

  const [tagsWidths, setTagsWidths] = useState<number[]>([]);
  const [takeCount, setTakeCount] = useState<number>(0);
  const mznFakeTagClassName = 'mzn-fake-tag';
  const mznFakeEllipsisTagClassName = 'mzn-fake-ellipsis-tag';

  useEffect(() => {
    const elements = controlRef.current?.getElementsByClassName(mznFakeTagClassName);
    const ellipsisTagElement = controlRef.current?.getElementsByClassName(mznFakeEllipsisTagClassName)[0];

    if (elements?.length && ellipsisTagElement) {
      const tagsWidthsArray = Array.from(elements).map((e) => e.clientWidth);
      const parentWidth = controlRef.current?.clientWidth || 0;
      const maxWidth = parentWidth * 0.7;
      const ellipsisTagWidth = ellipsisTagElement.clientWidth;

      setTagsWidths(tagsWidthsArray);

      calcTakeCount({
        tagsWidths: tagsWidthsArray,
        maxWidth,
        ellipsisTagWidth,
        setTakeCount,
      });
    }
  }, [value, controlRef]);

  const renderFakeTags = () => {
    if (value && value.length === tagsWidths.length) return null;

    return (
      <div
        style={{
          position: 'absolute',
          visibility: 'hidden',
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        {value?.map((selection) => (
          <Tag
            key={selection.id}
            className={mznFakeTagClassName}
            closable
            disabled
            size={size}
          >
            {selection.name}
          </Tag>
        ))}
        <Tag disabled className={mznFakeEllipsisTagClassName} size={size}>
          +99...
        </Tag>
      </div>
    );
  };

  return {
    renderFakeTags,
    takeCount,
  };
}
