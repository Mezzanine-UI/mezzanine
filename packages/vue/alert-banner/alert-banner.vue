<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue';
import {
  alertBannerIcons,
  alertBannerClasses as classes,
} from '@mezzanine-ui/core/alert-banner';
import type { IconDefinition } from '@mezzanine-ui/icons';
import { MOTION_EASING } from '@mezzanine-ui/system/motion';
import clsx from 'clsx';
import MznButton from '../button/button.vue';
import MznClearActions from '../clear-actions/clear-actions.vue';
import MznIcon from '../icon/icon.vue';
import MznPortal from '../portal/portal.vue';
import type { AlertBannerProps } from './alert-banner.types';

/**
 * 頁面層級的橫幅式警示訊息。
 *
 * 預設透過 MznPortal 渲染至 alert layer，支援 `info`、`warning`、`error` 三種
 * 嚴重程度，最多兩個操作按鈕與一個關閉按鈕。開啟與關閉時以高度動畫展開／收合。
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { MznAlertBanner } from '@mezzanine-ui/vue/alert-banner';
 * <\/script>
 *
 * <template>
 *   <MznAlertBanner message="系統將於今晚進行維護" severity="info" />
 * </template>
 * ```
 *
 * @see alertBanner 以命令式呼叫的版本
 * @see MznInlineMessage 行內訊息元件
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<AlertBannerProps>(), {
  actions: undefined,
  closable: true,
  disablePortal: false,
  icon: undefined,
});

const emit = defineEmits<{
  close: [];
}>();

const attrs = useAttrs();

const visible = ref(true);
const node = ref<HTMLElement | null>(null);
const wrapper = ref<HTMLElement | null>(null);

/** Ported from React's `reflow`. */
function reflow(element: HTMLElement): void {
  void element.scrollTop;
}

function handleClose(): void {
  const element = wrapper.value;

  if (element) {
    element.style.height = `${element.scrollHeight}px`;
    element.style.overflow = 'hidden';
    reflow(element);

    element.style.transition = `height 250ms ${MOTION_EASING.exit}`;
    element.style.height = '0px';
  }

  setTimeout(() => {
    visible.value = false;
    emit('close');
  }, 250); // moderate duration
}

watch(
  (): AlertBannerProps['actions'] => props.actions,
  (actions) => {
    if (actions && actions.length > 2) {
      console.warn('AlertBanner: actions maximum is 2');
    }
  },
  { immediate: true },
);

/**
 * Expand from nothing to the content's height, then hand the height back to
 * the layout — an explicit `auto` would not animate, and leaving the measured
 * pixel height would freeze the banner at one size.
 */
function playEnter(): void {
  const element = wrapper.value;
  const inner = node.value;

  if (!visible.value || !element || !inner) return;

  element.style.height = '0px';
  element.style.overflow = 'hidden';
  reflow(element);

  requestAnimationFrame(() => {
    element.style.transition = `height 250ms ${MOTION_EASING.entrance}`;
    element.style.height = `${inner.scrollHeight}px`;

    setTimeout(() => {
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      element.style.transition = '';
    }, 250);
  });
}

onMounted(playEnter);
watch(visible, playEnter, { flush: 'post' });

const resolvedIcon = computed(
  (): IconDefinition => props.icon ?? alertBannerIcons[props.severity],
);

/**
 * Maximum support 2 actions. `content` and `onClick` are pulled out the way
 * React destructures them, so neither reaches the button as an attribute, and
 * the rest is bound after `size`/`variant` so a caller can still override them.
 */
const validActions = computed(() =>
  (props.actions?.slice(0, 2) ?? []).map((action) => {
    const { content, onClick, ...buttonProps } = action;

    return { buttonProps, content, onClick };
  }),
);

const hostClasses = computed((): string =>
  clsx(classes.host, classes.severity(props.severity), attrs.class as string),
);

const forwardedAttrs = computed(() => {
  const {
    class: _class,
    instanceKey: _instanceKey,
    maxCount: _maxCount,
    ...rest
  } = attrs;

  return rest;
});

const wrapperClass = classes.wrapper;
const bodyClass = classes.body;
const iconClass = classes.icon;
const messageClass = classes.message;
const controlsClass = classes.controls;
const actionsClass = classes.actions;
const closeClass = classes.close;
</script>

<template>
  <MznPortal v-if="visible" :disable-portal="disablePortal" layer="alert">
    <div ref="wrapper" :class="wrapperClass">
      <div
        v-bind="forwardedAttrs"
        ref="node"
        aria-live="polite"
        :class="hostClasses"
        role="status"
      >
        <div :class="bodyClass">
          <MznIcon :class="iconClass" :icon="resolvedIcon" />
          <span :class="messageClass">{{ message }}</span>
        </div>

        <div :class="controlsClass">
          <div v-if="validActions.length" :class="actionsClass">
            <MznButton
              v-for="(action, index) in validActions"
              :key="index"
              size="minor"
              variant="inverse"
              v-bind="action.buttonProps"
              @click="action.onClick"
            >
              {{ action.content }}
            </MznButton>
          </div>
          <MznClearActions
            v-if="closable"
            :class="closeClass"
            type="standard"
            variant="inverse"
            @click="handleClose"
          />
        </div>
      </div>
    </div>
  </MznPortal>
</template>
