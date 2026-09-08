<script setup lang="ts">
import {
  computed,
  getCurrentInstance,
  inject,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import clsx from 'clsx';
import MznBadge from '../badge/badge.vue';
import MznIcon from '../icon/icon.vue';
import { TAB_CONTEXT, type TabKey } from './tab-context';
import type { TabItemProps } from './tab-item.types';

/**
 * 頁籤項目，需放在 MznTab 之中。
 *
 * `active` 由父層 MznTab 控制，識別身分取自 vnode 的 key，與 React 以 element key
 * 對應 `activeKey` 的語意相同。
 *
 * @example
 * ```vue
 * <MznTabItem key="home" :icon="FolderIcon" :badge-count="99">首頁</MznTabItem>
 * ```
 */
const props = withDefaults(defineProps<TabItemProps>(), {
  disabled: false,
  error: false,
});

defineSlots<{
  default?: () => unknown;
}>();

const context = inject(TAB_CONTEXT, null);
const instance = getCurrentInstance();
const index = ref(0);

/**
 * React uses the element's key as the tab's identity, so `activeKey="home"`
 * matches an item keyed `home`. A Vue component can read its own vnode key,
 * which preserves that exactly.
 *
 * The fallback for an unkeyed item is `.0`, `.1`, … rather than the bare
 * index, and that is deliberate. React's `flattenChildren` runs children
 * through `Children.toArray`, which names unkeyed children `.0`, `.1`, … and
 * only strips the `.$` prefix that keyed ones get. So an unkeyed item ends up
 * with the *string* `'.0'`, which never equals the numeric `defaultActiveKey`
 * of `0` — a tab group written without keys therefore renders with no active
 * item at all. Using the index here would activate the first one instead.
 */
const ownKey = computed((): TabKey => {
  const key = instance?.vnode.key;

  return typeof key === 'string' || typeof key === 'number'
    ? key
    : `.${index.value}`;
});

const active = computed((): boolean =>
  context ? context.activeKey.value === ownKey.value : !!props.active,
);

const element = ref<HTMLButtonElement | null>(null);

onMounted(() => {
  if (context) index.value = context.register();
});

onBeforeUnmount(() => {
  if (!context) return;

  context.unregister(index.value);

  if (active.value) context.setActiveElement(null);
});

watch(
  [active, element],
  ([isActive, el]) => {
    if (context && isActive) context.setActiveElement(el);
  },
  { immediate: true },
);

function handleClick(): void {
  if (!context || active.value) return;

  context.select(ownKey.value, index.value);
}

const hostClasses = computed((): string =>
  clsx(classes.tabItem, {
    [classes.tabItemActive]: active.value,
    [classes.tabItemError]: props.error,
  }),
);

const badgeVariant = computed(() => {
  if (props.error) return 'count-alert' as const;

  return active.value ? ('count-brand' as const) : ('count-inactive' as const);
});

const iconClass = classes.tabItemIcon;
const badgeClass = classes.tabItemBadge;
</script>

<template>
  <button
    ref="element"
    :aria-disabled="disabled"
    :class="hostClasses"
    :disabled="disabled"
    type="button"
    @click="handleClick"
  >
    <MznIcon v-if="icon" :class="iconClass" :icon="icon" :size="16" />
    <slot />
    <MznBadge
      v-if="badgeCount !== undefined"
      :class="badgeClass"
      :count="badgeCount"
      :variant="badgeVariant"
    />
  </button>
</template>
