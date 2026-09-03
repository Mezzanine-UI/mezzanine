<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  inlineMessageClasses as classes,
  inlineMessageIcons,
} from '@mezzanine-ui/core/inline-message';
import { MOTION_DURATION, MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import MznClearActions from '../clear-actions/clear-actions.vue';
import MznIcon from '../icon/icon.vue';
import MznFade from '../transition/fade.vue';
import type { InlineMessageProps } from './inline-message.types';

/**
 * 行內提示訊息。
 *
 * 直接放進版面中呈現情境回饋，需要在關閉時反應請監聽 `close`。
 *
 * 根元素預設帶 `role="status"` 與 `aria-live="polite"`，其餘屬性會原樣轉發；
 * 兩個預設值都可覆寫 — 失敗訊息需要插播時請傳 `aria-live="assertive"`。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznInlineMessage } from '@mezzanine-ui/vue/inline-message';
 * <\/script>
 *
 * <template>
 *   <MznInlineMessage content="已儲存草稿" severity="info" />
 *
 *   <MznInlineMessage
 *     aria-live="assertive"
 *     content="送出失敗"
 *     id="submit-error"
 *     severity="error"
 *   />
 * </template>
 * ```
 */
const props = defineProps<InlineMessageProps>();

const emit = defineEmits<{
  close: [];
}>();

/**
 * React spreads the rest props onto the inner div, after `role` and
 * `aria-live` so the consumer can override them. The root here is the fade
 * wrapper, so attributes are forwarded explicitly and in that same order.
 */
defineOptions({ inheritAttrs: false });

const visible = ref(true);

const fadeDuration = {
  enter: MOTION_DURATION.fast,
  exit: MOTION_DURATION.fast,
};
const fadeEasing = {
  enter: MOTION_EASING.standard,
  exit: MOTION_EASING.standard,
};

const icon = computed(() => props.icon ?? inlineMessageIcons[props.severity]);

const hostClasses = computed((): string =>
  clsx(classes.host, classes.severity(props.severity)),
);

function handleClose(): void {
  visible.value = false;
  emit('close');
}

const iconClass = classes.icon;
const contentContainerClass = classes.contentContainer;
const contentClass = classes.content;
</script>

<template>
  <MznFade :duration="fadeDuration" :easing="fadeEasing" :in="visible">
    <div aria-live="polite" role="status" v-bind="$attrs" :class="hostClasses">
      <div :class="contentContainerClass">
        <MznIcon :class="iconClass" :icon="icon" />
        <span :class="contentClass">{{ content }}</span>
      </div>
      <MznClearActions
        v-if="severity === 'info'"
        type="standard"
        variant="base"
        @click="handleClose"
      />
    </div>
  </MznFade>
</template>
