<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { dropdownClasses as classes } from '@mezzanine-ui/core/dropdown/dropdown';
import { CheckedIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { useHasListener } from '../_internal/use-has-listener';
import MznCheckbox from '../checkbox/checkbox.vue';
import MznIcon from '../icon/icon.vue';
import type { IconColor } from '@mezzanine-ui/core/icon';
import MznSeparator from '../separator/separator.vue';
import MznTypography from '../typography/typography.vue';
import { highlightText, type HighlightSegment } from './highlight-text';
import type { DropdownItemCardProps } from './dropdown-item-card.types';

/**
 * 下拉選單的單一選項列。
 *
 * `checkSite` 決定勾選標記在前綴、後綴或不顯示；`multiple` 模式的前綴是核取方塊，
 * `single` 模式則是勾。`followText` 會把符合的片段標成高亮。
 * `showUnderline` 會在下方再補一條分隔線（第二個 `li`）。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznDropdownItemCard } from '@mezzanine-ui/vue/dropdown';
 * <\/script>
 *
 * <template>
 *   <MznDropdownItemCard label="選項一" mode="single" @click="onSelect" />
 * </template>
 * ```
 *
 * @see MznDropdownItem 排出整份清單的元件
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<DropdownItemCardProps>(), {
  active: false,
  appendContent: undefined,
  appendIcon: undefined,
  checked: undefined,
  checkSite: undefined,
  defaultChecked: undefined,
  disabled: undefined,
  followText: undefined,
  id: undefined,
  indeterminate: false,
  label: undefined,
  level: undefined,
  name: undefined,
  prependIcon: undefined,
  showUnderline: undefined,
  subTitle: undefined,
  toggleCheckedOnClick: true,
  validate: undefined,
});

const emit = defineEmits<{
  checkedChange: [checked: boolean];
  click: [];
  /**
   * Named the way React spells its prop (`onMouseEnter`): a component emit is
   * camelized, so this is `@mouse-enter` for consumers — not the DOM's own
   * `mouseenter`, which the row still listens to natively below.
   */
  mouseEnter: [];
}>();

const attrs = useAttrs();
const hasListener = useHasListener();

const cardLabel = computed((): string => props.label || '');
const cardName = computed((): string => props.name || cardLabel.value);
const level = computed(() => props.level || 0);

// Generate ID for the label element to use with aria-labelledby
// If no id is provided, we'll rely on the visible text content for accessibility
const labelId = computed((): string | undefined =>
  props.id ? `${props.id}-label` : undefined,
);

// If name is different from label, we need to use aria-label as fallback
const ariaLabel = computed((): string | undefined =>
  cardName.value !== cardLabel.value ? cardName.value : undefined,
);

// Controlled/uncontrolled mode for checked/selected state
const internalChecked = ref(props.defaultChecked ?? false);
const isControlled = computed((): boolean => props.checked !== undefined);
const isChecked = computed((): boolean =>
  isControlled.value ? Boolean(props.checked) : internalChecked.value,
);

const appendIconColor = computed((): IconColor => {
  if (props.disabled) return 'neutral-light';

  if (props.validate === 'danger') return 'error';

  return 'brand';
});

const iconColor = computed((): IconColor => {
  if (props.disabled) return 'neutral-light';

  return props.validate === 'danger' ? 'error' : 'neutral';
});

const labelParts = computed((): HighlightSegment[] =>
  props.followText
    ? highlightText(cardLabel.value, props.followText)
    : [{ text: cardLabel.value, highlight: false }],
);

const subTitleParts = computed((): HighlightSegment[] => {
  if (props.followText && props.subTitle) {
    return highlightText(props.subTitle, props.followText);
  }

  return props.subTitle ? [{ text: props.subTitle, highlight: false }] : [];
});

const showPrependContent = computed((): boolean =>
  Boolean(
    props.prependIcon ||
      (props.checkSite === 'prefix' && props.mode === 'multiple') ||
      (props.checkSite === 'prefix' &&
        props.mode === 'single' &&
        isChecked.value),
  ),
);

const showAppendContent = computed((): boolean =>
  Boolean(
    props.appendContent ||
      props.appendIcon ||
      (props.checkSite === 'suffix' && isChecked.value),
  ),
);

const highlightClass = (part: HighlightSegment): string =>
  part.highlight && props.validate !== 'danger'
    ? classes.cardHighlightedText
    : '';

function toggleChecked(): void {
  if (props.disabled) return;

  const newChecked = !isChecked.value;

  if (!isControlled.value) {
    internalChecked.value = newChecked;
  }

  emit('checkedChange', newChecked);
}

function handleClick(): void {
  if (props.disabled) return;

  if (props.mode === 'multiple' && props.toggleCheckedOnClick) {
    toggleChecked();
  }

  emit('click');
}

function handleCheckboxChange(event: Event): void {
  event.stopPropagation();
  toggleChecked();
}

function handleKeyDown(event: KeyboardEvent): void {
  if (props.disabled) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
}

/**
 * React only stops propagation on the checkbox when a `onCheckedChange`
 * handler was given; the same condition is read from the listener here.
 */
function checkboxGuards(): Record<string, (event: Event) => void> {
  if (!hasListener('checkedChange')) return {};

  return {
    click: (event: Event) => event.stopPropagation(),
    mousedown: (event: Event) => event.stopPropagation(),
  };
}

const hostClasses = computed((): string =>
  clsx(
    classes.card,
    classes.cardLevel(level.value),
    {
      [classes.cardActive]: props.active || isChecked.value,
      [classes.cardKeyboardActive]: props.active,
      [classes.cardDisabled]: props.disabled,
      [classes.cardDanger]: props.validate === 'danger',
    },
    attrs.class as string,
  ),
);

const forwardedAttrs = computed(() => {
  const { class: _class, ...rest } = attrs;

  return rest;
});

const cardAppendContentClass = classes.cardAppendContent;
const cardBodyClass = classes.cardBody;
const cardContainerClass = classes.cardContainer;
const cardDescriptionClass = classes.cardDescription;
const cardPrependContentClass = classes.cardPrependContent;
const cardTitleClass = classes.cardTitle;
const cardUnderlineClass = classes.cardUnderline;
</script>

<template>
  <li
    v-bind="forwardedAttrs"
    :aria-label="ariaLabel"
    :aria-labelledby="labelId"
    :aria-selected="isChecked"
    :class="hostClasses"
    :id="id"
    role="option"
    :tabindex="-1"
    @click="handleClick"
    @keydown="handleKeyDown"
    @mouseenter="emit('mouseEnter')"
  >
    <div :class="cardContainerClass">
      <div v-if="showPrependContent" :class="cardPrependContentClass">
        <MznIcon v-if="prependIcon" :color="iconColor" :icon="prependIcon" />
        <MznCheckbox
          v-if="checkSite === 'prefix' && mode === 'multiple'"
          :checked="isChecked"
          :disabled="disabled"
          :indeterminate="indeterminate"
          v-on="checkboxGuards()"
          @change="handleCheckboxChange"
        />
        <MznIcon
          v-if="checkSite === 'prefix' && mode === 'single' && isChecked"
          :color="appendIconColor"
          :icon="CheckedIcon"
          :size="16"
        />
      </div>
      <div :class="cardBodyClass">
        <MznTypography v-if="cardLabel" :class="cardTitleClass" :id="labelId"
          ><span
            v-for="(part, index) in labelParts"
            :key="index"
            :class="highlightClass(part)"
            >{{ part.text }}</span
          ></MznTypography
        >
        <MznTypography
          v-if="subTitleParts.length > 0"
          :class="cardDescriptionClass"
          ><span
            v-for="(part, index) in subTitleParts"
            :key="index"
            :class="highlightClass(part)"
            >{{ part.text }}</span
          ></MznTypography
        >
      </div>
      <div v-if="showAppendContent" :class="cardAppendContentClass">
        <MznTypography v-if="appendContent" color="text-neutral-light">
          {{ appendContent }}
        </MznTypography>
        <MznIcon v-if="appendIcon" :color="iconColor" :icon="appendIcon" />
        <MznIcon
          v-if="checkSite === 'suffix' && isChecked"
          :color="appendIconColor"
          :icon="CheckedIcon"
          :size="16"
        />
      </div>
    </div>
  </li>
  <li v-if="showUnderline" aria-hidden="true" role="presentation">
    <MznSeparator :class="cardUnderlineClass" orientation="horizontal" />
  </li>
</template>
