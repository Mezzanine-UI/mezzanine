<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { inlineMessageGroupClasses as classes } from '@mezzanine-ui/core/inline-message';
import MznInlineMessage from './inline-message.vue';
import type {
  InlineMessageGroupItem,
  InlineMessageGroupProps,
} from './inline-message-group.types';

/**
 * 行內提示訊息群組。
 *
 * 以 `items` 傳入資料，或在預設 slot 自行放置 `MznInlineMessage`。
 * 任一則訊息被關閉時會發出 `itemClose`，帶出該則的 key。
 *
 * @example
 * ```vue
 * <MznInlineMessageGroup :items="items" @item-close="dismiss" />
 * ```
 *
 * @see MznInlineMessage 單則訊息
 */
const props = defineProps<InlineMessageGroupProps>();

const emit = defineEmits<{
  itemClose: [key: string | number];
}>();

defineSlots<{
  default?: () => unknown;
}>();

const slots = useSlots();

/** The slot wins over `items`, mirroring React's `children ?? mapItems(...)`. */
const items = computed((): InlineMessageGroupItem[] =>
  slots.default ? [] : (props.items ?? []),
);

function handleItemClose(item: InlineMessageGroupItem): void {
  item.onClose?.();
  emit('itemClose', item.key);
}

const hostClass = classes.host;
</script>

<template>
  <div aria-live="polite" role="region" :class="hostClass">
    <slot>
      <MznInlineMessage
        v-for="item in items"
        :key="item.key"
        :content="item.content"
        :icon="item.icon"
        :severity="item.severity"
        @close="handleItemClose(item)"
      />
    </slot>
  </div>
</template>
