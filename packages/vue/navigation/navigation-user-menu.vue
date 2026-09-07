<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, useSlots, watch } from 'vue';
import { navigationUserMenuClasses as classes } from '@mezzanine-ui/core/navigation';
import { ChevronDownIcon, UserIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import MznDropdown from '../dropdown/dropdown.vue';
import MznIcon from '../icon/icon.vue';
import MznTooltip from '../tooltip/tooltip.vue';
import type { PopperPlacement } from '../popper/popper.types';
import { NAVIGATION_ACTIVATED_CONTEXT } from './navigation-context';
import type { NavigationUserMenuProps } from './navigation-user-menu.types';

/**
 * 側邊欄底部的使用者選單。
 *
 * 頭像取自 `imgSrc`，載入失敗或沒給就退回使用者圖示。收合時名字藏起來，因此
 * `aria-label` 會退而取用 slot 裡的純文字，讓按鈕仍然唸得出名字。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznNavigationUserMenu } from '@mezzanine-ui/vue/navigation';
 * <\/script>
 *
 * <template>
 *   <MznNavigationUserMenu :options="options">王小明</MznNavigationUserMenu>
 * </template>
 * ```
 *
 * @see MznNavigationFooter 放這個選單的地方
 */
const props = withDefaults(defineProps<NavigationUserMenuProps>(), {
  collapsedPlacement: 'right-end',
  placement: 'top-end',
});

/**
 * React's props extend the dropdown's, so every callback the dropdown takes is
 * part of this component's contract too. They are declared here and forwarded
 * rather than left to fall through, because a declared emit is stripped out of
 * the attributes.
 */
const emit = defineEmits<{
  /** Fired when the dropdown's cancel action is used. */
  actionCancel: [];
  /** Fired when the dropdown's clear action is used. */
  actionClear: [];
  /** Fired when the dropdown's confirm action is used. */
  actionConfirm: [];
  /** Fired when the dropdown's custom action is used. */
  actionCustom: [];
  /** Fired when the trigger is clicked. */
  click: [];
  /** Fired when the menu is closed. */
  close: [];
  /** Fired when an option is hovered. */
  itemHover: [index: number];
  /** Fired when the list scrolls away from its bottom. */
  leaveBottom: [];
  /** Fired when the menu opens. */
  open: [];
  /** Fired when the list reaches its bottom. */
  reachBottom: [];
  /** Fired as the list scrolls. */
  scroll: [
    computed: { maxScrollTop: number; scrollTop: number },
    target: HTMLDivElement,
  ];
  /** Fired when an option is selected. */
  select: [option: DropdownOption];
  /** Fired when the menu is asked to open or close. */
  visibilityChange: [open: boolean];
}>();

const slots = defineSlots<{
  /** The user name shown next to the avatar. */
  default?: () => unknown;
}>();

const allSlots = useSlots();

const context = inject(NAVIGATION_ACTIVATED_CONTEXT, undefined);

const collapsed = computed((): boolean => Boolean(context?.value.collapsed));

const imgError = ref(false);
const internalOpen = ref(false);

const open = computed((): boolean => props.open ?? internalOpen.value);

const userName = ref<HTMLSpanElement | null>(null);
const userNameOverflow = ref(false);

let resizeObserver: ResizeObserver | null = null;

watch(
  userName,
  (element) => {
    resizeObserver?.disconnect();
    resizeObserver = null;

    if (!element) return;

    resizeObserver = new ResizeObserver(() => {
      if (userName.value) {
        userNameOverflow.value =
          userName.value.scrollWidth > userName.value.offsetWidth;
      }
    });

    resizeObserver.observe(element);
  },
  { flush: 'post', immediate: true },
);

onBeforeUnmount(() => resizeObserver?.disconnect());

/**
 * The content is the only accessible name the collapsed button could have, so
 * it is read off the slot when it is plain text. An explicit label still wins.
 */
const ariaLabel = computed((): string | undefined => {
  // Vue camelises a declared prop's name, so `aria-label` arrives as `ariaLabel`.
  const given = (props as { ariaLabel?: string }).ariaLabel;

  if (given) return given;

  const children = slots.default?.();
  const first = Array.isArray(children) ? children[0] : children;
  const text = (first as { children?: unknown } | undefined)?.children;

  // A template keeps the newline around the content as a trailing space; JSX
  // hands React the bare string.
  return typeof text === 'string' ? text.trim() : undefined;
});

const dropdownProps = computed(() => {
  const { ...rest } = props;

  delete (rest as Record<string, unknown>)['aria-label'];
  delete (rest as Record<string, unknown>).collapsedPlacement;
  delete (rest as Record<string, unknown>).imgSrc;
  delete (rest as Record<string, unknown>).open;
  delete (rest as Record<string, unknown>).placement;

  return rest;
});

const placement = computed(
  (): PopperPlacement =>
    collapsed.value ? props.collapsedPlacement : props.placement,
);

function onVisibilityChange(): void {
  internalOpen.value = !open.value;
  emit('visibilityChange', !open.value);
  emit('click');
}

function onClose(): void {
  internalOpen.value = false;
  emit('close');
}

const hostClasses = computed((): string =>
  clsx(classes.host, open.value && classes.open),
);

const showTooltip = computed(
  (): boolean =>
    (collapsed.value || userNameOverflow.value) &&
    !open.value &&
    Boolean(allSlots.default),
);

const tooltipOptions = computed(() => ({
  placement: (collapsed.value ? 'right' : 'top') as PopperPlacement,
}));

const offsetMainAxis = computed((): number =>
  collapsed.value ? 8 + 6 : 8 + 8,
);
</script>

<template>
  <MznDropdown
    v-bind="dropdownProps"
    :open="open"
    :placement="placement"
    @action-cancel="emit('actionCancel')"
    @action-clear="emit('actionClear')"
    @action-confirm="emit('actionConfirm')"
    @action-custom="emit('actionCustom')"
    @close="onClose"
    @item-hover="emit('itemHover', $event)"
    @leave-bottom="emit('leaveBottom')"
    @open="emit('open')"
    @reach-bottom="emit('reachBottom')"
    @scroll="(computed, target) => emit('scroll', computed, target)"
    @select="emit('select', $event)"
    @visibility-change="onVisibilityChange"
  >
    <template #default="trigger">
      <button
        v-bind="trigger"
        :aria-label="ariaLabel"
        :class="hostClasses"
        type="button"
      >
        <MznTooltip
          :disable-portal="false"
          :offset-main-axis="offsetMainAxis"
          :options="tooltipOptions"
        >
          <template v-if="showTooltip" #title><slot /></template>
          <template #default="tooltip">
            <span
              :ref="tooltip.ref"
              :class="classes.content"
              @mouseenter="tooltip.onMouseenter"
              @mouseleave="tooltip.onMouseleave"
            >
              <span :class="classes.avatar">
                <MznIcon v-if="imgError || !imgSrc" :icon="UserIcon" />
                <img
                  v-else
                  alt="User avatar"
                  :class="classes.avatar"
                  :src="imgSrc"
                  @error="imgError = true"
                />
              </span>
              <span v-if="$slots.default" :class="classes.userName">
                <span ref="userName"><slot /></span>
              </span>
              <MznIcon :class="classes.icon" :icon="ChevronDownIcon" />
            </span>
          </template>
        </MznTooltip>
      </button>
    </template>
  </MznDropdown>
</template>
