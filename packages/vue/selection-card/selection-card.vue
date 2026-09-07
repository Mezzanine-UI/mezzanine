<script setup lang="ts">
import { computed, useId, watchEffect } from 'vue';
import type { CSSProperties } from 'vue';
import { selectionCardClasses as classes } from '@mezzanine-ui/core/selection-card';
import { FileIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import type { SelectionCardProps } from './selection-card.types';

/**
 * 以整張卡片作為選項的單選或多選控制項。
 *
 * `selector` 決定它是 radio 還是 checkbox，`direction` 決定圖片與文字是左右
 * 還是上下排列。沒有給 `image` 時顯示 `customIcon`（預設是檔案圖示）。
 * `readonly` 會整個拿掉 input，讓卡片變成純展示。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznSelectionCard } from '@mezzanine-ui/vue/selection-card';
 * <\/script>
 *
 * <template>
 *   <MznSelectionCard selector="radio" text="方案 A" supporting-text="每月 100 元" />
 *   <MznSelectionCard direction="vertical" selector="checkbox" text="方案 B" />
 * </template>
 * ```
 *
 * @see MznSelectionCardGroup 把多張卡片排成一組
 */
// Icon size constant for SelectionCard component
// Note: This value is component-specific and doesn't have a corresponding design token
const SELECTION_ICON_SIZE = 26;

const props = withDefaults(defineProps<SelectionCardProps>(), {
  checked: undefined,
  customIcon: undefined,
  defaultChecked: false,
  direction: 'horizontal',
  disabled: false,
  id: undefined,
  image: undefined,
  imageObjectFit: 'cover',
  name: undefined,
  readonly: false,
  supportingText: undefined,
  supportingTextMaxWidth: undefined,
  textMaxWidth: undefined,
  value: undefined,
});

const emit = defineEmits<{
  change: [event: Event];
  click: [event: MouseEvent];
}>();

const generatedId = useId();
const inputId = computed((): string => props.id ?? generatedId);
const textId = computed((): string => `${inputId.value}-text`);
const supportingTextId = computed(
  (): string => `${inputId.value}-supporting-text`,
);

const isRadioOrCheckbox = computed(
  (): boolean => props.selector === 'radio' || props.selector === 'checkbox',
);

const haveImage = computed((): boolean =>
  Boolean(
    props.image &&
      typeof props.image === 'string' &&
      props.image.trim().length > 0,
  ),
);

watchEffect(() => {
  if (!props.text) {
    console.error('SelectionCard: `text` (title) is required.');

    return;
  }

  if (!props.supportingText) {
    console.warn(
      'SelectionCard: `supportingText` is optional but strongly recommended for better accessibility.',
    );
  }
});

const hostClasses = computed((): string =>
  clsx(classes.host, classes.direction(props.direction), {
    [classes.disabled]: props.disabled,
    [classes.readonly]: props.readonly,
  }),
);

const imageStyle = computed(
  (): CSSProperties => ({ objectFit: props.imageObjectFit }),
);

const textStyle = computed((): CSSProperties | undefined =>
  props.textMaxWidth !== undefined
    ? { maxWidth: props.textMaxWidth }
    : undefined,
);

const supportingTextStyle = computed((): CSSProperties | undefined =>
  props.supportingTextMaxWidth !== undefined
    ? { maxWidth: props.supportingTextMaxWidth }
    : undefined,
);

/**
 * React writes `checked` or `defaultChecked`, never both: the input is
 * controlled only when a `checked` reached it.
 */
const checkedBindings = computed(() =>
  props.checked !== undefined
    ? {
        checked: props.checked,
        ...(isRadioOrCheckbox.value ? { 'aria-checked': props.checked } : {}),
      }
    : { checked: props.defaultChecked },
);

const containerClass = classes.container;
const contentClass = classes.content;
const iconClass = classes.icon;
const inputClass = classes.input;
const selectionImageClass = classes.selectionImage;
const supportingTextClass = classes.supportingText;
const textClass = classes.text;
</script>

<template>
  <label
    v-if="text"
    :aria-disabled="disabled || undefined"
    :class="hostClasses"
    :for="inputId"
    @click="emit('click', $event)"
  >
    <div :class="containerClass">
      <img
        v-if="haveImage"
        :alt="text"
        :class="selectionImageClass"
        :src="image"
        :style="imageStyle"
      />
      <MznIcon
        v-else
        aria-hidden="true"
        :class="iconClass"
        color="neutral-solid"
        :icon="customIcon || FileIcon"
        :size="SELECTION_ICON_SIZE"
      />
      <div :class="contentClass">
        <MznTypography
          :class="textClass"
          color="text-neutral-solid"
          display="block"
          ellipsis
          :id="textId"
          :style="textStyle"
          variant="body-highlight"
        >
          {{ text }}
        </MznTypography>
        <MznTypography
          v-if="supportingText"
          :class="supportingTextClass"
          color="text-neutral"
          display="block"
          ellipsis
          :id="supportingTextId"
          :style="supportingTextStyle"
          variant="caption"
        >
          {{ supportingText }}
        </MznTypography>
      </div>
    </div>
    <input
      v-if="!readonly"
      ref="input"
      :aria-describedby="supportingText ? supportingTextId : undefined"
      :aria-labelledby="textId"
      v-bind="checkedBindings"
      :class="inputClass"
      :disabled="disabled"
      :id="inputId"
      :name="name"
      :type="selector"
      :value="value"
      @change="emit('change', $event)"
    />
  </label>
</template>
