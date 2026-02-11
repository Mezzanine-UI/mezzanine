import { selectClasses as classes } from '@mezzanine-ui/core/select';
import { TagSize } from '@mezzanine-ui/core/tag';
import {
  JSX,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Tag from '../Tag';
import { SelectValue } from './typings';

export interface UseSelectTriggerTagsProps {
  /**
   * Enable ellipsis calculation.
   */
  enabled?: boolean;
  /**
   * The ref for wrapper that defines available width.
   */
  containerRef: RefObject<HTMLDivElement | null>;
  /**
   * Container ref of the visible tags list.
   */
  tagsRef: RefObject<HTMLDivElement | null>;
  size?: TagSize;
  value?: SelectValue[];
}

export interface UseSelectTriggerTagsValue {
  overflowSelections: SelectValue[];
  renderFakeTags: () => JSX.Element | null;
  takeCount: number;
  visibleSelections: SelectValue[];
}

const fakeTagClassName = 'mzn-select-trigger__fake-tag';
const fakeEllipsisClassName = 'mzn-select-trigger__fake-ellipsis';

function getFullWidth(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const marginStart =
    parseFloat(style.marginInlineStart || style.marginLeft || '0') || 0;
  const marginEnd =
    parseFloat(style.marginInlineEnd || style.marginRight || '0') || 0;

  return rect.width + marginStart + marginEnd;
}

export function useSelectTriggerTags(
  props: UseSelectTriggerTagsProps,
): UseSelectTriggerTagsValue {
  const { containerRef, tagsRef, value = [], size, enabled = false } = props;
  const [takeCount, setTakeCount] = useState<number>(value.length);
  const fakeContainerRef = useRef<HTMLDivElement | null>(null);
  const updateTakeCount = useCallback((nextCount: number) => {
    setTakeCount((prevCount) =>
      prevCount === nextCount ? prevCount : nextCount,
    );
  }, []);

  const measure = useCallback(() => {
    if (!enabled) {
      updateTakeCount(value.length);
      return;
    }

    const container = containerRef.current ?? tagsRef.current;
    const fakeContainer = fakeContainerRef.current;

    if (!container || !fakeContainer) {
      // Keep current takeCount when refs are temporarily unavailable to avoid flicker.
      return;
    }

    const fakeTags = Array.from(
      fakeContainer.getElementsByClassName(fakeTagClassName),
    ) as HTMLElement[];
    const fakeEllipsis = fakeContainer.getElementsByClassName(
      fakeEllipsisClassName,
    )[0] as HTMLElement | undefined;

    if (!fakeTags.length) {
      // Keep current takeCount until fake tags are ready in DOM.
      return;
    }

    const computedStyleTarget = tagsRef.current ?? container;
    const containerWidth = container.clientWidth;
    const style = computedStyleTarget
      ? window.getComputedStyle(computedStyleTarget)
      : null;
    const paddingLeft = style ? parseFloat(style.paddingLeft) || 0 : 0;
    const paddingRight = style ? parseFloat(style.paddingRight) || 0 : 0;
    const maxWidth = containerWidth - paddingLeft - paddingRight;
    const ellipsisWidth = fakeEllipsis ? getFullWidth(fakeEllipsis) : 0;

    let nextCount = fakeTags.length;
    let consumedWidth = 0;

    for (let i = 0; i < fakeTags.length; i += 1) {
      const tagWidth = getFullWidth(fakeTags[i]);
      const hasOverflow = fakeTags.length - (i + 1) > 0;
      const reservedWidth = hasOverflow ? ellipsisWidth : 0;

      if (consumedWidth + tagWidth + reservedWidth > maxWidth) {
        nextCount = i;
        break;
      }

      consumedWidth += tagWidth;
      nextCount = i + 1;
    }

    updateTakeCount(nextCount);
  }, [containerRef, enabled, tagsRef, updateTakeCount, value.length]);

  useLayoutEffect(() => {
    measure();
  }, [value, size, enabled, measure]);

  useEffect(() => {
    if (!enabled) return;

    const container = tagsRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      measure();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [enabled, containerRef, tagsRef, value.length, measure]);

  const renderFakeTags = () => {
    if (!enabled || !value.length) return null;

    return (
      <div
        aria-hidden
        className={classes.triggerTags}
        ref={fakeContainerRef}
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          opacity: 0,
          inset: 0,
        }}
      >
        {value.map((selection) => (
          <span className={fakeTagClassName} key={`fake-${selection.id}`}>
            <Tag
              disabled
              label={selection.name}
              onClose={() => { }}
              size={size}
              type="dismissable"
            />
          </span>
        ))}
        <span className={fakeEllipsisClassName}>
          <Tag count={99} size={size} type="overflow-counter" />
        </span>
      </div>
    );
  };

  const visibleSelections = value.slice(0, takeCount);
  const overflowSelections = value.slice(takeCount);

  return {
    overflowSelections,
    renderFakeTags,
    takeCount,
    visibleSelections,
  };
}
