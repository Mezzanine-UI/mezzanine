<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue';
import { breadcrumbOverflowMenuItemClasses as classes } from '@mezzanine-ui/core/breadcrumb';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import MznDropdown from '../dropdown/dropdown.vue';
import MznIcon from '../icon/icon.vue';
import MznTypography from '../typography/typography.vue';
import type { BreadcrumbItemProps } from './breadcrumb-item.types';

/**
 * 收合選單裡帶次層下拉的一列，箭頭朝右、選單往右側展開。
 *
 * @see MznBreadcrumbOverflowMenuItem 依 `options` 是否存在決定要不要用這一個
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BreadcrumbItemProps>(), {
  open: undefined,
});

const attrs = useAttrs();

const internalOpen = ref(false);
const open = computed((): boolean => props.open ?? internalOpen.value);

const hostClasses = computed((): string =>
  clsx(classes.host, open.value && classes.expanded, attrs.class as string),
);

const dropdownBindings = computed(() => {
  const {
    class: _class,
    current: _current,
    name: _name,
    open: _open,
    ...rest
  } = { ...props, ...attrs } as Record<string, unknown>;

  return {
    onClose: () => {
      internalOpen.value = false;
    },
    onOpen: () => {
      internalOpen.value = !open.value;
      (attrs.onClick as (() => void) | undefined)?.();
    },
    // Only reached when the item carries options — that is what makes it
    // a dropdown in the first place.
    options: props.options as DropdownOption[],
    placement: 'right-start' as const,
    ...rest,
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
          <MznTypography variant="label-primary">{{ name }}</MznTypography>
          <MznIcon :class="iconClass" :icon="ChevronRightIcon" :size="16" />
        </button>
      </template>
    </MznDropdown>
  </span>
</template>
