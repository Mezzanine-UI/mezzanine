import {
  useState,
  useEffect,
} from 'react';
import take from 'lodash/take';
import Tag from '../Tag';

export function useSelectTriggerTags(props) {
  const {
    controlRef,
    value,
    size,
  } = props;

  const [tagsWidths, setTagsWidths] = useState<number[]>([]);
  const [ellipsisTagWidth, setEllipsisTagWidth] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [takeCount, setTakeCount] = useState<number>(0);

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
  }, [value, controlRef]);

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
          visibility: 'hidden',
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

  return {
    renderFakeTags,
    takeCount,
  };
}
