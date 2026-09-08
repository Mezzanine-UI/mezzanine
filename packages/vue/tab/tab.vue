<script setup lang="ts">
import { computed, nextTick, onMounted, provide, ref, watch } from 'vue';
import { tabClasses as classes } from '@mezzanine-ui/core/tab';
import clsx from 'clsx';
import { TAB_CONTEXT, type TabKey } from './tab-context';
import type { TabProps } from './tab.types';

/**
 * 頁籤導航元件，透過底部滑動指示條標示當前選取的頁籤。
 *
 * 以 `MznTabItem` 作為子元件定義每個頁籤項目，支援水平（`horizontal`）與垂直（`vertical`）
 * 兩種排列方向。可透過 `activeKey`（受控）或 `defaultActiveKey`（非受控）指定當前頁籤，
 * `change` 事件在切換時帶出新的 `activeKey` 與索引。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznTab, MznTabItem } from '@mezzanine-ui/vue/tab';
 * <\/script>
 *
 * <template>
 *   <MznTab default-active-key="home">
 *     <MznTabItem key="home">首頁</MznTabItem>
 *     <MznTabItem key="profile">個人資料</MznTabItem>
 *   </MznTab>
 *
 *   <MznTab :active-key="activeKey" @change="activeKey = $event">
 *     <MznTabItem key="tab1">頁籤一</MznTabItem>
 *     <MznTabItem key="tab2">頁籤二</MznTabItem>
 *   </MznTab>
 * </template>
 * ```
 *
 * @see MznTabItem 頁籤項目元件
 */
const props = withDefaults(defineProps<TabProps>(), {
  defaultActiveKey: 0,
  direction: 'horizontal',
  size: 'main',
});

const emit = defineEmits<{
  change: [activeKey: TabKey, index: number];
}>();

defineSlots<{
  default?: () => unknown;
}>();

const internalActiveKey = ref<TabKey>(props.defaultActiveKey);
const activeKey = computed(
  (): TabKey => props.activeKey ?? internalActiveKey.value,
);

const activeElement = ref<HTMLButtonElement | null>(null);
const registeredCount = ref(0);

/**
 * React reaches the children through `Children.map` + `cloneElement`, injecting
 * `active`, a ref and an onClick into each one. Vue resolves the same wiring
 * through provide/inject: reading the slot inside a `computed` would not
 * invalidate when the parent re-renders, since slot invocation is not a
 * tracked dependency.
 */
provide(TAB_CONTEXT, {
  activeKey,
  register: () => {
    const index = registeredCount.value;

    registeredCount.value += 1;

    return index;
  },
  unregister: () => {
    registeredCount.value = Math.max(0, registeredCount.value - 1);
  },
  select: (key, index) => {
    internalActiveKey.value = key;
    emit('change', key, index);
  },
  setActiveElement: (element) => {
    activeElement.value = element;
  },
});

const activeBarStyle = ref<Record<string, string>>({
  '--active-bar-length': '0px',
  '--active-bar-shift': '0px',
});

function measureActiveBar(): void {
  const element = activeElement.value;

  if (!element) return;

  const horizontal = props.direction === 'horizontal';

  activeBarStyle.value = {
    '--active-bar-length': `${horizontal ? element.offsetWidth : element.offsetHeight}px`,
    '--active-bar-shift': `${horizontal ? element.offsetLeft : element.offsetTop}px`,
  };
}

onMounted(measureActiveBar);
watch([activeKey, () => props.direction, activeElement], async () => {
  await nextTick();
  measureActiveBar();
});

const hostClasses = computed((): string =>
  clsx(classes.host, {
    [classes.tabHorizontal]: props.direction === 'horizontal',
    [classes.tabVertical]: props.direction === 'vertical',
    [classes.tabSizeMain]: props.size === 'main',
    [classes.tabSizeSub]: props.size === 'sub',
  }),
);

const activeBarClass = classes.tabActiveBar;
</script>

<template>
  <div :class="hostClasses">
    <slot />

    <div :class="activeBarClass" :style="activeBarStyle" />
  </div>
</template>
