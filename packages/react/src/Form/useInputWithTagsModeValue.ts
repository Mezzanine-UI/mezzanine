import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useInputControlValue, UseInputControlValueProps } from './useInputControlValue';

export interface UseInputWithMultipleSplitValueProps<E extends HTMLInputElement | HTMLTextAreaElement>
  extends UseInputControlValueProps<E> {
  /**
   * The value of initial tags
   */
  initialTagsValue?: string[];
  /**
   * Maximum permitted length of the tags
   * @default 3
   */
  maxTagsLength?: number;
  /**
   * The change event handler of tags
   */
  onTagsChange?: (tags: string[]) => void,
  /**
   * The ref object of input element
   */
  ref: RefObject<E>;
  /**
   * Will skip `onKeyDown` calling if `true`
   * @default false
   */
  skip?: boolean;
  /**
   * Maximum length of value on each tag
   * @default 8
   */
  tagValueMaxLength?: number;
}

export function useInputWithTagsModeValue<E extends HTMLInputElement | HTMLTextAreaElement>(
  props: Omit<UseInputWithMultipleSplitValueProps<E>, 'onChange'>,
) {
  const {
    defaultValue,
    onTagsChange: onChangeProp,
    ref,
    initialTagsValue = [],
    skip = false,
    maxTagsLength,
    tagValueMaxLength = 8,
  } = props;
  const canActive = !skip;
  const activeMaxTagsLength = maxTagsLength || Math.max(3, initialTagsValue.length);
  const tagsSetRef = useRef<Set<string>>(new Set(initialTagsValue));

  const generateUniqueTags = () => Array.from(tagsSetRef.current.values());

  const [value, setValue] = useInputControlValue({
    defaultValue: canActive ? defaultValue : undefined,
  });
  const [tags, setTags] = useState<string[]>(
    generateUniqueTags()
      .map((initialTag) => initialTag.slice(0, tagValueMaxLength))
      .slice(0, activeMaxTagsLength),
  );

  const tagsWillOverflow = useCallback(() => (
    tags.length === activeMaxTagsLength
  ), [tags]);
  const clearTypingFieldValue = () => {
    if (!canActive) return;

    const target = ref.current;

    if (target) {
      const changeEvent: ChangeEvent<E> = Object.create({});

      changeEvent.target = target;
      changeEvent.currentTarget = target;

      target.value = '';
      setValue(changeEvent);
    }
  };

  const onClear = () => {
    clearTypingFieldValue();
    tagsSetRef.current.clear();
    setTags([]);
    onChangeProp?.([]);
  };

  const onChange = (event: ChangeEvent<E> | null) => {
    if (canActive && event) {
      setValue(event);
    }
  };

  const onRemove = (tag: string) => {
    tagsSetRef.current.delete(tag);

    const newTags = generateUniqueTags();

    setTags(newTags);
    onChangeProp?.(newTags);
  };

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canActive) return;
    const element = ref.current;

    if (
      element &&
      element?.value &&
      e.key === 'Enter' &&
      !tagsWillOverflow()
    ) {
      const tagsSet = tagsSetRef.current;

      tagsSet.add(element.value);

      const newTags = generateUniqueTags();

      setTags(newTags);
      onChangeProp?.(newTags);
      clearTypingFieldValue();
    }
  }, [tagsWillOverflow]);

  return [
    {
      tags,
      typingValue: value,
      tagsReachedMax: tagsWillOverflow(),
    },
    onChange,
    onClear,
    onRemove,
    onKeyDown,
  ] as const;
}
