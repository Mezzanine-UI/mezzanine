<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, useSlots, watch } from 'vue';
import { textFieldClasses as classes } from '@mezzanine-ui/core/text-field';
import clsx from 'clsx';
import MznClearActions from '../clear-actions/clear-actions.vue';
import type { TextFieldPaddingInfo, TextFieldProps } from './text-field.types';

/**
 * 輸入類元件的視覺外框，包住原生 input 或 textarea。
 *
 * 外框會自動推導 `role`（有 click 監聽時為 `button`，否則 `textbox`）。若內部放的是
 * 真正的 `input` / `textarea`，且命名屬性（例如 `aria-label`）是掛在該原生控制項上，
 * 請傳入 `role="presentation"`，讓 ARIA 語意留在原生控制項。
 *
 * 預設 slot 會收到 `paddingClassName`；一旦取用，外框就不再自行套用內距，
 * 改由使用端決定 — 這對需要 resize handle 貼齊邊界的 textarea 特別有用。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTextField } from '@mezzanine-ui/vue/text-field';
 * <\/script>
 *
 * <template>
 *   <MznTextField clearable @clear="value = ''">
 *     <input v-model="value" type="text" placeholder="Enter text..." />
 *   </MznTextField>
 *
 *   <MznTextField v-slot="{ paddingClassName }">
 *     <textarea v-model="text" :class="paddingClassName" rows="4" />
 *   </MznTextField>
 * </template>
 * ```
 */
/**
 * Defaults must go through `withDefaults`, not `?? fallback` in a computed:
 * Vue casts an absent Boolean prop to `false` rather than leaving it
 * `undefined`, so `props.fullWidth ?? true` would always resolve to `false`.
 *
 * The three interactive-state props are given an explicit `undefined` default
 * for the same reason in reverse — the auto-detect path depends on being able
 * to tell "not supplied" from "supplied as false", which the Boolean cast
 * would erase.
 */
const props = withDefaults(defineProps<TextFieldProps>(), {
  active: false,
  clearable: false,
  disabled: undefined,
  error: false,
  forceShowClearable: false,
  fullWidth: true,
  hideSuffixWhenClearable: false,
  readonly: undefined,
  size: 'main',
  typing: undefined,
  warning: undefined,
});

const emit = defineEmits<{
  clear: [event: MouseEvent];
}>();

defineSlots<{
  default?: (info: TextFieldPaddingInfo) => unknown;
  prefix?: () => unknown;
  suffix?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

const container = ref<HTMLDivElement | null>(null);
const isTyping = ref(false);
const isHovered = ref(false);
const isFocused = ref(false);
const hasValue = ref(false);

const typing = computed((): boolean => {
  if (props.disabled || props.readonly) return false;

  return props.typing ?? isTyping.value;
});

let detach: (() => void) | null = null;
let checkValue: (() => void) | null = null;

/**
 * The value/typing/hover state is read straight off the nested native control,
 * exactly as React does: the field frames a control it does not own, so there
 * is no prop to observe.
 */
function attachToControl(): void {
  detach?.();
  detach = null;
  checkValue = null;

  const element = container.value;

  if (!element) return;

  const input = element.querySelector('input, textarea') as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;

  if (!input) return;

  const check = (): void => {
    hasValue.value = (input.value || '').trim().length > 0;
  };

  checkValue = check;

  const handleInput = (): void => {
    isTyping.value = true;
    check();
  };
  const handleFocus = (): void => {
    isFocused.value = true;
    check();
  };
  const handleBlur = (): void => {
    isTyping.value = false;
    isFocused.value = false;
    check();
  };
  const handleMouseEnter = (): void => {
    check();
    isHovered.value = true;
  };
  const handleMouseLeave = (): void => {
    isHovered.value = false;
  };

  check();

  const trackTyping =
    props.typing === undefined && !props.disabled && !props.readonly;

  if (trackTyping) {
    input.addEventListener('input', handleInput, false);
    input.addEventListener('mousedown', handleInput, false);
  }

  input.addEventListener('focus', handleFocus, false);
  input.addEventListener('blur', handleBlur, false);
  element.addEventListener('mouseenter', handleMouseEnter, false);
  element.addEventListener('mouseleave', handleMouseLeave, false);
  input.addEventListener('input', check, false);
  input.addEventListener('change', check, false);

  detach = () => {
    if (trackTyping) {
      input.removeEventListener('input', handleInput, false);
      input.removeEventListener('mousedown', handleInput, false);
    }

    input.removeEventListener('focus', handleFocus, false);
    input.removeEventListener('blur', handleBlur, false);
    element.removeEventListener('mouseenter', handleMouseEnter, false);
    element.removeEventListener('mouseleave', handleMouseLeave, false);
    input.removeEventListener('input', check, false);
    input.removeEventListener('change', check, false);
  };
}

watch(
  [container, () => props.typing, () => props.disabled, () => props.readonly],
  attachToControl,
  { flush: 'post', immediate: true },
);

onBeforeUnmount(() => detach?.());

const paddingClassName = computed((): string =>
  clsx(
    classes.inputPadding,
    props.size === 'main' ? classes.inputPaddingMain : classes.inputPaddingSub,
  ),
);

/**
 * React branches on `typeof children === 'function'` to know the consumer took
 * over padding. A Vue scoped slot is always a function, so that test does not
 * exist — but reading the payload does: the slot is invoked once with a getter
 * that records whether `paddingClassName` was destructured. The probe result is
 * discarded, so this costs one extra pass of vnode creation and nothing else.
 */
function consumesPadding(): boolean {
  const slot = slots.default;

  if (!slot) return false;

  let consumed = false;

  slot({
    get paddingClassName() {
      consumed = true;

      return paddingClassName.value;
    },
  });

  return consumed;
}

const hasPrefix = computed(() => !!slots.prefix);
const hasSuffix = computed(() => !!slots.suffix);

const shouldShowClearable = computed(
  () =>
    props.clearable &&
    (props.forceShowClearable || hasValue.value) &&
    (isHovered.value || typing.value || isFocused.value),
);

const fallbackRole = computed((): string =>
  attrs.onClick ? 'button' : 'textbox',
);

function hostClasses(): string {
  return clsx(classes.host, {
    [classes.slimGap]: (hasPrefix.value && hasSuffix.value) || props.clearable,
    [classes.main]: props.size === 'main',
    [classes.sub]: props.size === 'sub',
    [classes.clearable]: props.clearable,
    [classes.disabled]: props.disabled,
    [classes.error]: props.error,
    [classes.fullWidth]: props.fullWidth,
    [classes.noPadding]: consumesPadding(),
    [classes.readonly]: props.readonly,
    [classes.typing]: typing.value,
    [classes.active]: props.active,
    [classes.clearing]: shouldShowClearable.value,
    [classes.warning]: props.warning,
  });
}

function handleClick(event: MouseEvent): void {
  event.stopPropagation();
}

function handleClear(event: MouseEvent): void {
  if (props.disabled || props.readonly) return;

  emit('clear', event);
  requestAnimationFrame(() => checkValue?.());
}

const prefixClass = classes.prefix;
const clearIconClass = classes.clearIcon;
const suffixContentClass = classes.suffixContent;

const suffixClasses = computed((): string =>
  clsx(classes.suffix, {
    [classes.suffixOverlay]: props.hideSuffixWhenClearable,
  }),
);
</script>

<template>
  <div
    ref="container"
    :class="hostClasses()"
    :role="fallbackRole"
    @click="handleClick"
  >
    <div v-if="hasPrefix" :class="prefixClass">
      <slot name="prefix" />
    </div>

    <slot :padding-class-name="paddingClassName" />

    <MznClearActions
      v-if="clearable && !hideSuffixWhenClearable"
      :class="clearIconClass"
      :tabindex="-1"
      type="clearable"
      @click="handleClear"
      @mousedown.prevent
    />

    <div v-if="hasSuffix" :class="suffixClasses">
      <template v-if="hideSuffixWhenClearable">
        <div :class="suffixContentClass">
          <slot name="suffix" />
        </div>
        <MznClearActions
          v-if="clearable"
          :class="clearIconClass"
          :tabindex="-1"
          type="clearable"
          @click="handleClear"
          @mousedown.prevent
        />
      </template>
      <slot v-else name="suffix" />
    </div>
  </div>
</template>
