import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import { useInputControlValue, UseInputControlValueProps } from './useInputControlValue';

export type TagType = string | number;
export type TagsType = string[] | number[];

export interface UseInputWithTagsModeValueProps<E extends HTMLInputElement | HTMLTextAreaElement>
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
  onTagsChange?: (tags: TagsType) => void,
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
  props: Omit<UseInputWithTagsModeValueProps<E>, 'onChange'>,
) {
  const {
    defaultValue,
    initialTagsValue = [],
    maxTagsLength,
    onTagsChange: onChangeProp,
    ref,
    skip = false,
    tagValueMaxLength = 8,
  } = props;
  const canActive = !skip;
  const activeMaxTagsLength = maxTagsLength || Math.max(3, initialTagsValue.length);

  const tagsSetRef = useRef<Set<TagType>>(new Set(
    initialTagsValue.map((initialTag) => initialTag.trim()),
  ));

  const inputTypeIsNumber = () => ref.current?.type === 'number';

  const tagValueTransform = (tag: TagType, isNumber: boolean) => {
    const stringTag = typeof tag === 'number'
      ? String(tag)
      : tag;

    const slicedTag = stringTag.slice(0, tagValueMaxLength).trim();

    return isNumber ? Number(slicedTag) : slicedTag;
  };

  const generateUniqueTags = <T extends boolean>(isNumber: T) => {
    const result = Array
      .from(tagsSetRef.current.values())
      .map((initialTag) => tagValueTransform(initialTag, isNumber));

    return result as T extends true ? number[] : string[];
  };

  const [value, setValue] = useInputControlValue({
    defaultValue: canActive ? defaultValue : undefined,
  });

  const [tags, setTags] = useState<TagsType>(
    generateUniqueTags(inputTypeIsNumber())
      .slice(0, activeMaxTagsLength),
  );

  const tagsWillOverflow = useCallback(() => (
    tagsSetRef.current.size === activeMaxTagsLength
  ), []);

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
    if (!canActive) return;
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

  const onRemove = (tag: TagType) => {
    tagsSetRef.current.delete(tag);

    const numberTag = typeof tag === 'number';
    const newTags = generateUniqueTags(numberTag);

    setTags(newTags);
    onChangeProp?.(
      numberTag
        ? newTags as number[]
        : newTags as string[],
    );
  };

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!canActive) return;
    const element = ref.current;

    if (
      element &&
      element?.value &&
      (e.key === 'Enter' || e.code === 'Enter') &&
      !e.nativeEvent.isComposing &&
      !tagsWillOverflow()
    ) {
      e.preventDefault();

      const tagsSet = tagsSetRef.current;
      const isNumber = inputTypeIsNumber();
      const newTagValue = tagValueTransform(element.value, isNumber);

      tagsSet.add(newTagValue);

      const newTags = generateUniqueTags(isNumber);

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
