<script setup lang="ts">
import { computed, h, useAttrs, useSlots } from 'vue';
import type { FunctionalComponent, VNode } from 'vue';
import { buttonClasses as classes } from '@mezzanine-ui/core/button';
import clsx from 'clsx';
import MznIcon from '../icon/icon.vue';
import MznSpin from '../spin/spin.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import type { PopperOptions } from '../popper/popper.types';
import type { TooltipTriggerProps } from '../tooltip/tooltip.types';
import type { ButtonProps } from './button.types';

/**
 * 通用按鈕元件，支援多種外觀變體與尺寸。
 *
 * `variant` 控制外觀，`iconType` 決定圖示的位置（`leading`、`trailing` 或
 * `icon-only`）。當 `iconType` 為 `icon-only` 時，預設 slot 的內容會作為
 * tooltip 的提示文字而不是按鈕文字。`loading` 會以轉圈取代圖示，並擋下點擊。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznButton } from '@mezzanine-ui/vue/button';
 * import { PlusIcon } from '@mezzanine-ui/icons';
 * <\/script>
 *
 * <template>
 *   <MznButton variant="base-primary">送出</MznButton>
 *   <MznButton :icon="PlusIcon" icon-type="leading" variant="outlined-primary">
 *     新增項目
 *   </MznButton>
 *   <MznButton :icon="PlusIcon" icon-type="icon-only">新增</MznButton>
 * </template>
 * ```
 *
 * @see MznButtonGroup 將多個按鈕水平或垂直排列為群組
 */
/**
 * React composes the consumer's `onClick`, `onFocus` and `onBlur` with its own
 * — click is swallowed while disabled or loading, focus and blur are shared
 * with the tooltip — so the listeners are read from `$attrs` and re-bound
 * rather than left to fall through.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<ButtonProps>(), {
  component: 'button',
  disabled: false,
  disabledTooltip: false,
  icon: undefined,
  iconType: undefined,
  loading: false,
  size: 'main',
  tooltipPosition: 'bottom',
  variant: 'base-primary',
});

defineSlots<{
  /**
   * The button text content. With `iconType="icon-only"` it becomes the
   * tooltip's content instead.
   */
  default?: () => unknown;
}>();

const attrs = useAttrs();
const slots = useSlots();

type AttrHandler =
  | ((event: never) => void)
  | ((event: never) => void)[]
  | undefined;

/** `$attrs` holds either one listener or an array of them. */
function call(handler: AttrHandler, event: Event): void {
  const listeners = Array.isArray(handler) ? handler : [handler];

  listeners.forEach((listener) =>
    (listener as ((event: Event) => void) | undefined)?.(event),
  );
}

const isIconOnly = computed((): boolean => props.iconType === 'icon-only');

const showTooltip = computed(
  (): boolean =>
    isIconOnly.value && !props.disabledTooltip && Boolean(slots.default),
);

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    classes.variant(props.variant),
    classes.size(props.size),
    {
      [classes.disabled]: props.disabled,
      [classes.loading]: props.loading,
      [classes.iconLeading]: props.iconType === 'leading',
      [classes.iconTrailing]: props.iconType === 'trailing',
      [classes.iconOnly]: isIconOnly.value,
    },
    attrs.class as string,
  ),
);

const tooltipOptions = computed(
  (): PopperOptions => ({ placement: props.tooltipPosition }),
);

const forwardedAttrs = computed(() => {
  const {
    'aria-describedby': _describedBy,
    class: _class,
    onBlur: _onBlur,
    onClick: _onClick,
    onFocus: _onFocus,
    ...rest
  } = attrs;

  return rest;
});

/**
 * Everything the root element takes, in one place: React writes it once and
 * calls it from both the plain and the tooltip-wrapped branch, and so does the
 * template below.
 */
function rootBindings(tooltipProps?: TooltipTriggerProps) {
  return {
    ...forwardedAttrs.value,
    'aria-describedby':
      [attrs['aria-describedby'], tooltipProps?.['aria-describedby']]
        .filter(Boolean)
        .join(' ') || undefined,
    'aria-disabled': props.disabled,
    class: hostClasses.value,
    disabled: props.disabled,
    onBlur: (event: FocusEvent): void => {
      call(attrs.onBlur as AttrHandler, event);
      tooltipProps?.onBlur();
    },
    onClick: (event: MouseEvent): void => {
      if (!props.disabled && !props.loading) {
        call(attrs.onClick as AttrHandler, event);
      }
    },
    onFocus: (event: FocusEvent): void => {
      call(attrs.onFocus as AttrHandler, event);
      tooltipProps?.onFocus(event);
    },
    ...(tooltipProps && {
      onMouseenter: tooltipProps.onMouseenter,
      onMouseleave: tooltipProps.onMouseleave,
      ref: tooltipProps.ref,
    }),
  };
}

/**
 * The icon slot of the button: the spinner while loading, the icon otherwise,
 * and nothing when neither applies.
 */
const ButtonIcon: FunctionalComponent = () => {
  if (props.loading) return h(MznSpin, { loading: true, size: 'minor' });
  if (props.icon) return h(MznIcon, { icon: props.icon, size: 16 });

  return null;
};

/** Content arrangement, shared by both branches. */
const ButtonContent: FunctionalComponent = () => {
  if (props.loading) return h(ButtonIcon);

  const children: (VNode | unknown)[] = [];

  if (props.iconType === 'leading' || isIconOnly.value) {
    children.push(h(ButtonIcon));
  }

  if (!isIconOnly.value) children.push(slots.default?.());
  if (props.iconType === 'trailing') children.push(h(ButtonIcon));

  return children as VNode[];
};
</script>

<template>
  <MznTooltip v-if="showTooltip" :options="tooltipOptions">
    <template #title>
      <slot />
    </template>
    <template #default="tooltipProps">
      <component :is="component" v-bind="rootBindings(tooltipProps)">
        <ButtonContent />
      </component>
    </template>
  </MznTooltip>

  <component :is="component" v-else v-bind="rootBindings()">
    <ButtonContent />
  </component>
</template>
