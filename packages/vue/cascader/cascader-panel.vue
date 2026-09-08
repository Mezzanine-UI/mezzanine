<script setup lang="ts">
import { computed, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { cascaderClasses as classes } from '@mezzanine-ui/core/cascader';
import { CheckedIcon, ChevronRightIcon } from '@mezzanine-ui/icons';
import clsx from 'clsx';
import { toCssLength } from '../_internal/css-length';
import MznIcon from '../icon/icon.vue';
import MznScrollbar from '../scrollbar/scrollbar.vue';
import type { CascaderOption } from './cascader.types';
import type { CascaderPanelProps } from './cascader-panel.types';

/**
 * 階層選單的其中一欄。
 *
 * 每一欄是一個 listbox，選項有子項時右側顯示箭頭、是葉節點且被選取時顯示勾勾。
 * 鍵盤移動到的選項會自己捲進可視範圍。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznCascaderPanel } from '@mezzanine-ui/vue/cascader';
 * <\/script>
 *
 * <template>
 *   <MznCascaderPanel :options="options" @select="onSelect" />
 * </template>
 * ```
 *
 * @see MznCascader 把多欄排在一起的階層選擇器
 */
const props = defineProps<CascaderPanelProps>();

const emit = defineEmits<{
  /** Fired when an option is clicked; `isLeaf` says whether it ends the path. */
  select: [option: CascaderOption, isLeaf: boolean];
}>();

const toItemId = (optionId: string): string =>
  `mzn-cascader-option-${optionId}`;

watch(
  () => props.focusedId,
  (focusedId) => {
    if (!focusedId) return;

    document
      .getElementById(toItemId(focusedId))
      ?.scrollIntoView({ block: 'nearest' });
  },
  { flush: 'post' },
);

/** React appends `px` to a numeric style value; Vue leaves it invalid. */
const panelStyle = computed((): CSSProperties | undefined =>
  props.maxHeight ? { maxHeight: toCssLength(props.maxHeight) } : undefined,
);

const scrollbarStyle: CSSProperties = { flex: 1, minHeight: 0 };

interface PanelItem {
  classes: string;
  isLeaf: boolean;
  isSelected: boolean;
  itemId: string;
  option: CascaderOption;
  expanded: boolean | undefined;
}

const items = computed((): PanelItem[] =>
  props.options.map((option) => {
    const isLeaf = !option.children || option.children.length === 0;
    const isActive = option.id === props.activeId;
    const isSelected = option.id === props.selectedId;

    return {
      classes: clsx(
        classes.item,
        isActive && classes.itemActive,
        option.disabled && classes.itemDisabled,
        option.id === props.focusedId && classes.itemFocused,
        isSelected && classes.itemSelected,
      ),
      expanded: !isLeaf ? isActive : undefined,
      isLeaf,
      isSelected,
      itemId: toItemId(option.id),
      option,
    };
  }),
);

const activeDescendant = computed((): string | undefined =>
  props.focusedId ? toItemId(props.focusedId) : undefined,
);

function onSelect(option: CascaderOption, isLeaf: boolean): void {
  if (!option.disabled) emit('select', option, isLeaf);
}

function onKeydown(
  event: KeyboardEvent,
  option: CascaderOption,
  isLeaf: boolean,
): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSelect(option, isLeaf);
  }
}
</script>

<template>
  <div :class="classes.panel" :style="panelStyle">
    <MznScrollbar :style="scrollbarStyle">
      <ul
        :aria-activedescendant="activeDescendant"
        aria-label="Options"
        role="listbox"
        :tabindex="-1"
      >
        <li
          v-for="item in items"
          :id="item.itemId"
          :key="item.option.id"
          :aria-disabled="item.option.disabled || undefined"
          :aria-expanded="item.expanded"
          :aria-selected="item.isSelected"
          :class="item.classes"
          role="option"
          @click="onSelect(item.option, item.isLeaf)"
          @keydown="onKeydown($event, item.option, item.isLeaf)"
        >
          <span :class="classes.itemLabel">{{ item.option.name }}</span>
          <span :class="classes.itemAppend">
            <template v-if="item.isLeaf">
              <MznIcon v-if="item.isSelected" :icon="CheckedIcon" />
            </template>
            <MznIcon v-else :icon="ChevronRightIcon" />
          </span>
        </li>
      </ul>
    </MznScrollbar>
  </div>
</template>
