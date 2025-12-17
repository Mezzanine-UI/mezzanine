import {
  ChangeEvent,
  KeyboardEvent,
  RefObject,
  useCallback,
  useRef,
  useState,
} from 'react';
import {
  useInputControlValue,
  UseInputControlValueProps,
} from './useInputControlValue';

export type TagsType = string[] | number[];

export interface UseInputWithTagsModeValueProps<
  E extends HTMLInputElement | HTMLTextAreaElement,
> extends UseInputControlValueProps<E> {
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
  onTagsChange?: (tags: TagsType) => void;
  /**
   * The ref object of input element
   */
  ref: RefObject<E | null>;
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

export function useInputWithTagsModeValue<
  E extends HTMLInputElement | HTMLTextAreaElement,
>(props: Omit<UseInputWithTagsModeValueProps<E>, 'onChange'>) {
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
  const activeMaxTagsLength =
    maxTagsLength || Math.max(3, initialTagsValue.length);

  const tagsSetRef = useRef<Set<string>>(
    new Set(initialTagsValue.map((initialTag) => initialTag.trim())),
  );

  const inputTypeIsNumber = useRef(ref.current?.type === 'number');

  const tagValueTransform = (tag: string) =>
    tag.slice(0, tagValueMaxLength).trim();

  const transformNumberTags = (tags: string[]) =>
    tags.map((tag) => Number(tag));

  const generateUniqueTags = () =>
    Array.from(tagsSetRef.current.values()).map((initialTag) =>
      tagValueTransform(initialTag),
    );

  const [value, setValue] = useInputControlValue({
    defaultValue: canActive ? defaultValue : undefined,
  });

  const [tags, setTags] = useState<string[]>(
    generateUniqueTags().slice(0, activeMaxTagsLength),
  );

  const tagsWillOverflow = useCallback(
    () => tagsSetRef.current.size === activeMaxTagsLength,
    [activeMaxTagsLength],
  );

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

  const onRemove = (tag: string) => {
    tagsSetRef.current.delete(tag);

    const numberTag = inputTypeIsNumber.current;
    const newTags = generateUniqueTags();

    setTags(newTags);
    onChangeProp?.(numberTag ? transformNumberTags(newTags) : newTags);
  };

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
        inputTypeIsNumber.current = ref.current?.type === 'number';

        const tagsSet = tagsSetRef.current;
        const isNumber = inputTypeIsNumber.current;
        const newTagValue = tagValueTransform(element.value);

        tagsSet.add(newTagValue);

        const newTags = generateUniqueTags();

        setTags(newTags);
        onChangeProp?.(isNumber ? transformNumberTags(newTags) : newTags);
        clearTypingFieldValue();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tagsWillOverflow],
  );

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
