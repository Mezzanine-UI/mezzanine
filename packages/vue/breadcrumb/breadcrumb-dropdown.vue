<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { breadcrumbItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { ChevronDownIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznDropdown from '../dropdown/dropdown.vue';
import MznIcon from '../icon/icon.vue';
import MznRotate from '../transition/rotate.vue';
import MznTypography from '../typography/typography.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';

/**
 * 麵包屑中帶下拉選單的一節。
 *
 * 點擊觸發器會展開選單並轉動箭頭；沒有給 `open` 時由自己記住展開狀態。
 *
 * @see MznBreadcrumbItem 依 `options` 是否存在決定要不要用這一個
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  current: undefined,
  open: undefined,
});

const emit = defineEmits<{
  actionCancel: [];
  actionClear: [];
  actionConfirm: [];
  actionCustom: [];
  click: [];
  close: [];
  itemHover: [index: number];
  leaveBottom: [];
  open: [];
  reachBottom: [];
  select: [option: DropdownOption];
  visibilityChange: [open: boolean];
}>();

const attrs = useAttrs();

const internalOpen = ref(false);
const open = computed((): boolean => props.open ?? internalOpen.value);

function handleClick(): void {
  internalOpen.value = !open.value;
  emit('click');
}

const hostClasses = computed((): string =>
  clsx(
    classes.host,
    open.value && classes.expanded,
    props.current && classes.current,
    attrs.class as string,
  ),
);

/**
 * React spreads the rest of the item's props onto the Dropdown *after* its own
 * defaults, so a `placement` the consumer gave wins. A single object does the
 * same; two bindings would let the literal win instead.
 */
const dropdownBindings = computed(() => {
  const {
    class: _class,
    component: _component,
    current: _current,
    href: _href,
    name: _name,
    open: _open,
    target: _target,
    ...rest
  } = { ...props, ...attrs } as Record<string, unknown>;

  return {
    onClose: () => {
      internalOpen.value = false;
      emit('close');
    },
    onOpen: () => {
      handleClick();
      emit('open');
    },
    // Only reached when the item carries options — that is what makes it
    // a dropdown in the first place.
    options: props.options as DropdownOption[],
    placement: 'bottom-start' as const,
    ...rest,
    onActionCancel: () => emit('actionCancel'),
    onActionClear: () => emit('actionClear'),
    onActionConfirm: () => emit('actionConfirm'),
    onActionCustom: () => emit('actionCustom'),
    onItemHover: (index: number) => emit('itemHover', index),
    onLeaveBottom: () => emit('leaveBottom'),
    onReachBottom: () => emit('reachBottom'),
    onSelect: (option: DropdownOption) => emit('select', option),
    onVisibilityChange: (value: boolean) => emit('visibilityChange', value),
  };
});

const iconClass = classes.icon;
const triggerClass = classes.trigger;
</script>

<template>
  <span :class="hostClasses">
    <MznDropdown v-bind="dropdownBindings">
      <template #default="triggerProps">
        <button v-bind="triggerProps" :class="triggerClass" type="button">
          <MznTypography
            v-if="name"
            :variant="current ? 'caption-highlight' : 'caption'"
          >
            {{ name }}
          </MznTypography>

          <MznRotate :in="open">
            <MznIcon :class="iconClass" :icon="ChevronDownIcon" :size="14" />
          </MznRotate>
        </button>
      </template>
    </MznDropdown>
  </span>
</template>
